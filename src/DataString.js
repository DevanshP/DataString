(function(global) {

	var nada = {};
	function extend(d, s) {
		for (var p in s) {
			if (Object.prototype.hasOwnProperty.call(s, p)) {
				d[p] = s[p];
			}
		}
	}
	function $(id) {
		return typeof id == 'string' ? document.getElementById(id) : id;
	}
	var listen = document.addEventListener ?
		function(element, type, callback) {
			element.addEventListener(type, callback, false);
		} :
		function(element, type, callback) {
			element.attachEvent("on" + type, callback);
		}
	;
	function DataString(value) {
		this.raw = (value === nada ? '' : this.setValue(value));
	}

	var staticMethods = {
		validateInput: function(input, callback) {
			input = $(input);
			var me = new this;
			function validate() {
				me.raw = input.value;
				if (!me.isValid()) {
					callback.call(me, input);
				}
			}
			listen(input, 'blur', validate);
			listen(input, 'change', validate);
		},
		autoFormatInput: function(input, formatArgs) {
			input = $(input);
			var me = new this;
			function autoFormat() {
				me.raw = input.value;
				input.value = me.format.apply(me, formatArgs);
			}
			listen(input, 'blur', autoFormat);
			listen(input, 'change', autoFormat);
		},
		keyMaskInput: function(input) {
			input = $(input);
			var me = new this;
			function mask(evt) {
				evt = evt || window.event;
				if (evt.ctrlKey || evt.metaKey || evt.altKey || !evt.keyCode) {
					return;
				}
				var kc = evt.keyCode;
				console.log(kc, String.fromCharCode(kc));
				if (kc < 10/*Tab and backspace*/ || kc == 27/*Esc*/) {
					return;
				}
				var c = String.fromCharCode(kc);
				if (c && !me.isAllowedChar(c)) {
					evt.preventDefault && evt.preventDefault();
					evt.returnValue = false;
				}
			}
			listen(input, 'keydown', mask);
		}
	};

	function createSubclass(methods) {
		var klass = function(value) {
			this.raw = (value === nada ? '' : this.setValue(value));
		};
		extend(klass, staticMethods);
		klass.createSubclass = createSubclass;
		klass.prototype = new DataString(nada);
		klass.prototype.constructor = klass;
		klass.prototype.constructor.parent = this;
		if (methods) {
			extend(klass.prototype, methods);
		}
		return klass;
	};
	DataString.createSubclass = createSubclass;
	extend(DataString, staticMethods);

	DataString._thousandsSeparator = ',';
	DataString._decimal = '.';
	DataString._formatNumber = function(n, precision) {
		n = Number(parseFloat(n + '')).toFixed(precision);
		var parts = n.split('.');
		var whole = parts[0];
		var decimal = parts[1];
		var sign = (whole.charAt(0) == '-' ? '-' : '');
		whole = whole.replace('-', '');
		var threes = [];
		while (whole.length) {
			threes.unshift(whole.slice(-3));
			whole = whole.slice(0, -3);
		}
		return sign + threes.join(DataString._thousandsSeparator) + (decimal ? DataString._decimal + decimal : '');
	};

	//
	// instance methods
	extend(DataString.prototype, {
		setValue: function(value) {
			this.raw = (typeof value == 'undefined' || value === null ? '' : value + '').replace(/^\s+/, '').replace(/\s+$/, '');
			return this;
		},
		equals: function(value) {
			return this.toString() === (value instanceof DataString ? value : new this.constructor(value)).toString();
		},
		copy: function() {
			return new this(this.toString());
		},
		isValid: function() {
			return true;
		},
		isEmpty: function() {
			return this.raw === '';
		},
		format: function() {
			return this.raw;
		},
		toString: function() {
			return this.format();
		},
		toValue: function() {
			return this.raw;
		},
		isAllowedChar: function(c) {
			return true;
		}
	});

	global.DataString = DataString;

})(this);