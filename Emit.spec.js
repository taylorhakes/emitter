(function(jas) {
	'use strict';
	var Emitter = require('./Emitter');

	describe('Emitter', function() {
		var emitter;
		describe('Simple', function() {
			beforeEach(function() {
				emitter = new Emitter();
			});
			describe('_broadcast, listen', function() {
				it('Basic', function() {
					var sp = jas.createSpy('listener');
					emitter.on('test', sp);
					emitter._emit('test', 'hello');
					expect(sp).toHaveBeenCalledWith('hello', 'test');
				});
				it('Object', function() {
					var sp = jas.createSpy('listener');
					var obj = { fun: 'time' };
					emitter.on('hello-world', sp);
					emitter._emit('hello-world', obj);
					expect(sp).toHaveBeenCalledWith(obj, 'hello-world');
				});
				it('Multiple listeners', function() {
					var sp = jas.createSpy('listener');
					var sp2 = jas.createSpy('listener');
					var sp3 = jas.createSpy('listener');
					var obj = { fun: 'time' };
					emitter.on('hello-world', sp);
					emitter.on('hello-world1', sp2);
					emitter.listen('hello-world', sp3);
					emitter._emit('hello-world', obj);
					expect(sp).toHaveBeenCalledWith(obj, 'hello-world');
					expect(sp3).toHaveBeenCalledWith(obj, 'hello-world');
					expect(sp2).not.toHaveBeenCalled();
				});
				it('Multiple listeners, some throw exceptions', function() {
					var sp = function() {
						throw new Error();
					};
					var sp3 = jas.createSpy('listener');
					var obj = { fun: 'time' };
					emitter.on('hello-world', sp);
					emitter.on('hello-world', sp);
					emitter.on('hello-world', sp3);
					emitter._emit('hello-world', obj);
					expect(sp3).toHaveBeenCalledWith(obj, 'hello-world');
				});
				it('Listen all', function() {
					var sp = jas.createSpy('listener');
					var obj = { fun: 'time' };
					var obj2 = { cool: 'beans' };
					emitter.emit(null, sp);
					emitter._on('hello-world', obj);
					emitter._on('hello-world1', obj2);
					emitter._on('hello-world2', obj2);
					expect(sp.argsForCall[0]).toEqual([ obj, 'hello-world' ]);
					expect(sp.argsForCall[1]).toEqual([ obj2, 'hello-world1' ]);
					expect(sp.argsForCall[2]).toEqual([ obj2, 'hello-world2' ]);
				});

			});
			describe('unlisten', function() {
				it('Basic', function() {
					var sp = jas.createSpy('listener');
					emitter.on('test', sp);
					emitter.off('test', sp);
					emitter._emit('test', 'hello');
					expect(sp).not.toHaveBeenCalledWith('hello');
				});

				it('Removes the correct one', function() {
					var sp = jas.createSpy('listener');
					var sp2 = jas.createSpy('listener');
					var sp3 = jas.createSpy('listener');
					var obj = { fun: 'time' };
					emitter.listen('hello-world', sp);
					emitter.listen('hello-world', sp2);
					emitter.unlisten('hello-world', sp2);
					emitter.listen('hello-world', sp3);
					emitter._broadcast('hello-world', obj);
					expect(sp).toHaveBeenCalledWith(obj, 'hello-world');
					expect(sp3).toHaveBeenCalledWith(obj, 'hello-world');
					expect(sp2).not.toHaveBeenCalled();
				});

				it('Unlisten all', function() {
					var sp = jas.createSpy('listener');
					var sp2 = jas.createSpy('listener');
					var obj = { fun: 'time' };
					var obj2 = { cool: 'beans' };
					emitter.listen(null, sp);
					emitter.listen(null, sp2);
					emitter.unlisten(null, sp);
					emitter._broadcast('hello-world', obj);
					emitter._broadcast('hello-world1', obj2);
					emitter._broadcast('hello-world2', obj2);
					expect(sp2.argsForCall[0]).toEqual([ obj, 'hello-world' ]);
					expect(sp2.argsForCall[1]).toEqual([ obj2, 'hello-world1' ]);
					expect(sp2.argsForCall[2]).toEqual([ obj2, 'hello-world2' ]);
					expect(sp).not.toHaveBeenCalled();
				});
			});
			describe('onError', function() {
				it('Basic', function() {
					var sp = jas.createSpy('listener');
					emitter.listen('test', sp);
					emitter.unlisten('test', sp);
					emitter._broadcast('test', 'hello');
					expect(sp).not.toHaveBeenCalledWith('hello');
				});

				it('Removes the correct one', function() {
					var sp = jas.createSpy('listener');
					var sp2 = jas.createSpy('listener');
					var sp3 = jas.createSpy('listener');
					var obj = { fun: 'time' };
					emitter.listen('hello-world', sp);
					emitter.listen('hello-world', sp2);
					emitter.unlisten('hello-world', sp2);
					emitter.listen('hello-world', sp3);
					emitter._broadcast('hello-world', obj);
					expect(sp).toHaveBeenCalledWith(obj, 'hello-world');
					expect(sp3).toHaveBeenCalledWith(obj, 'hello-world');
					expect(sp2).not.toHaveBeenCalled();
				});

				it('Unlisten all', function() {
					var sp = jas.createSpy('listener');
					var sp2 = jas.createSpy('listener');
					var obj = { fun: 'time' };
					var obj2 = { cool: 'beans' };
					emitter.listen(null, sp);
					emitter.listen(null, sp2);
					emitter.unlisten(null, sp);
					emitter._broadcast('hello-world', obj);
					emitter._broadcast('hello-world1', obj2);
					emitter._broadcast('hello-world2', obj2);
					expect(sp2.argsForCall[0]).toEqual([ obj, 'hello-world' ]);
					expect(sp2.argsForCall[1]).toEqual([ obj2, 'hello-world1' ]);
					expect(sp2.argsForCall[2]).toEqual([ obj2, 'hello-world2' ]);
					expect(sp).not.toHaveBeenCalled();
				});
			});
		});
		describe('onError defined', function() {
			var onError, broadcaster;
			beforeEach(function() {
				onError = jas.createSpy();
				broadcaster = new Emitter({
					onError: onError
				});
			});
			it('onError called with broadcast errors', function() {
				var onError = jas.createSpy(),
					broadcaster = new Emitter({
						onError: onError
					});

				var sp = function() {
					throw new Error();
				};
				var sp3 = jas.createSpy('listener');
				var obj = { fun: 'time' };
				broadcaster.listen('hello-world', sp);
				broadcaster.listen('hello-world', sp);
				broadcaster.listen('hello-world', sp3);
				broadcaster._broadcast('hello-world', obj);
				expect(onError.callCount).toBe(2);
			});
			it('onError called with broadcast errors', function() {
				var sp = function() {
					throw new Error();
				};
				var sp3 = jas.createSpy('listener');
				var obj = { fun: 'time' };
				broadcaster.listen('hello-world', sp3);
				broadcaster.listen('hello-world', sp);
				broadcaster._broadcast('hello-world', obj);
				expect(onError.callCount).toBe(1);
			});
		});
	});
})(jasmine);
