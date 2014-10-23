(function() {
	'use strict';
	var allEventsName = '_all_';

	/***
	 * Emitter is a mixin to allow objects to emit events
	 * @class Emitter
	 * @constructor
	 */
	function Emitter(options) {
		this._events = {};
		if (options && options.onError) {
			this._onEmitError = options.onError;
		}
	}

	function fireEvents(eventProp, eventName, data) {
		/*jshint validthis: true */
		for (var i = 0, len = this._events[eventProp].length; i < len; i++) {
			try {
				this._events[eventProp][i](data, eventName);
			} catch (e) {
				if (typeof this._onEmitError === 'function') {
					this._onEmitError(e);
				}
			}
		}
	}

	/***
	 * Internal emit function the object uses internally
	 * @method _emit
	 * @param {string} eventName
	 * @param {*} data
	 * @protected
	 */
	Emitter.prototype._emit = function(eventName, data) {
		if (this._events[eventName]) {
			fireEvents.call(this, eventName, eventName, data);
		}
		if (this._events[allEventsName]) {
			fireEvents.call(this, allEventsName, eventName, data);
		}
	};

	/***
	 * Respond to an event
	 * @method on
	 * @param {string|null} eventName Null to listen to all events
	 * @param {function} fn Funciton to listen to the event
	 */
	Emitter.prototype.on = function(eventName, fn) {
		// Listen to all events
		if (eventName === null) {
			eventName = allEventsName;
		}

		if (!this._events.hasOwnProperty(eventName)) {
			this._events[eventName] = [];
		}

		this._events[eventName].push(fn);
	};

	/***
	 * Stop responding to an event
	 * @method off
	 * @param {string} eventName
	 * @param {function} fn Function to remove, must be the same reference as one use for listen
	 */
	Emitter.prototype.off = function(eventName, fn) {
		var i, len;
		if (eventName === null) {
			eventName = allEventsName;
		}

		if (this._events.hasOwnProperty(eventName)) {
			for (i = 0, len = this._events[eventName].length; i < len; i++) {
				if (this._events[eventName][i] === fn) {
					this._events[eventName].splice(i, 1);
					break;
				}
			}
		}
	};

	module.exports = Emitter;
})();
