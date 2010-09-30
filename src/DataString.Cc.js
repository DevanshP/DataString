DataString.Cc = DataString.createSubclass({
	matcher15: /^(\d{4})\D*(\d{6})\D*(\d{5})$/,
	matcher16: /^(\d{4})\D*(\d{4})\D*(\d{4})\D*(\d{4})$/,
	isValid: function() {
		return this.isValidChecksum();
	},
	isSupportedType: function() {
		var type = this.getType();
		var supp = this.getSupportedTypes().join(' ');
		return (' ' + supp + ' ').indexOf(' ' + type + ' ') > -1;
	},
	isValidFormat: function() {
		if (!this.isSupportedType()) {
			return false;
		}
		return this.raw.match(this.matcher15) || this.raw.match(this.matcher16);
	},
	isValidChecksum: function() {
		if (!this.isValidFormat()) {
			return false;
		}
		var digits = this.toValue();
		var i = 0, sum = 0;
		while (i < digits.length) {
			sum += ((i % 2) == 0 ? 2 : 1) * parseInt(digits[i++], 10);
		}
		return (sum % 10) == 0;
	},
	format: function(addMask) {
		var m;
		if ((m = this.raw.match(this.matcher16))) {
			if (addMask) {
				m[1] = 'XXXX';
				m[2] = 'XXXXXX';
				m[3] = 'X' . m.slice(1);
			}
			m.shift();
			return m.join('-');
		}
		else if ((m = this.raw.match(this.matcher15))) {
			if (addMask) {
				m[1] = m[2] = m[3] = 'XXXX';
			}
			m.shift();
			return m.join('-');
		}
		return this.raw;
	},
	toValue: function() {
		return this.raw.replace(/\D/g, '');
	},
	getType: function() {
		// not intended to validate number, just guess what card type user
		// is trying to use by looking at known prefixes
		var m = this.raw.match(/^(34|35|36|37|4|5|6011)/);
		if (m) {
			switch (m[1]) {
				case '6011': return 'disc';
				case '5':    return 'mc';
				case '4':    return 'visa';
			}
			return 'amex';
		}
	},
	getSupportedTypes: function() {
		return ['amex', 'mc', 'disc', 'visa'];
	},
	isAllowedChar: function(c) {
		return /[\d -]/.test(c);
	}
});
