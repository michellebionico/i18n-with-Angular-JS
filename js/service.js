angular.module('ShoppingList') 
	.service('localeFunctions', function() {

		//Rewriting Currency filter Angular JS function
		var currency = function(locale, number, fractionSize ) {

			var formats = locale.NUMBER_FORMATS;
			currencySymbol = formats.CURRENCY_SYM;

		    if (!fractionSize) {
		      fractionSize = formats.PATTERNS[1].maxFrac;
		    }

		    // if null or undefined pass it through
		    return (number == null)
		        ? number
		        : formatNumber(number, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).
		            replace(/\u00A4/g, currencySymbol);
		};

		var isObject = function (value) {
		  return value !== null && typeof value === 'object';
		};


		//Rewriting Number filter Angular JS function
		var number = function (locale, ammount, fractionSize) {
	 	 	var formats = locale.NUMBER_FORMATS;

		    // if null or undefined pass it through
		    return (!ammount)
		        ? ammount
		        : formatNumber(ammount, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,
		                       fractionSize);
		};

		//Rewriting FormatNumber from Angular JS
		var formatNumber = function (number, pattern, groupSep, decimalSep, fractionSize) {
		  
			var DECIMAL_SEP = '.';
			  if (!isFinite(number) || isObject(number)) return '';

			  var isNegative = number < 0;
			  number = Math.abs(number);
			  var numStr = number + '',
			      formatedText = '',
			      parts = [];

			  var hasExponent = false;
			  if (numStr.indexOf('e') !== -1) {
			    var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
			    if (match && match[2] == '-' && match[3] > fractionSize + 1) {
			      number = 0;
			    } else {
			      formatedText = numStr;
			      hasExponent = true;
			    }
			  }

			  if (!hasExponent) {
			    var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

			    // determine fractionSize if it is not specified
			    if (!fractionSize) {
			      fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
			    }

			    // safely round numbers in JS without hitting imprecisions of floating-point arithmetics
			    // inspired by:
			    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
			    number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);

			    var fraction = ('' + number).split(DECIMAL_SEP);
			    var whole = fraction[0];
			    fraction = fraction[1] || '';

			    var i, pos = 0,
			        lgroup = pattern.lgSize,
			        group = pattern.gSize;

			    if (whole.length >= (lgroup + group)) {
			      pos = whole.length - lgroup;
			      for (i = 0; i < pos; i++) {
			        if ((pos - i) % group === 0 && i !== 0) {
			          formatedText += groupSep;
			        }
			        formatedText += whole.charAt(i);
			      }
			    }

			    for (i = pos; i < whole.length; i++) {
			      if ((whole.length - i) % lgroup === 0 && i !== 0) {
			        formatedText += groupSep;
			      }
			      formatedText += whole.charAt(i);
			    }

			    // format fraction part.
			    while (fraction.length < fractionSize) {
			      fraction += '0';
			    }

			    if (fractionSize && fractionSize !== "0") formatedText += decimalSep + fraction.substr(0, fractionSize);
			  } else {
			    if (fractionSize > 0 && number < 1) {
			      formatedText = number.toFixed(fractionSize);
			      number = parseFloat(formatedText);
			    }
			  }

			  if (number === 0) {
			    isNegative = false;
			  }

			  parts.push(isNegative ? pattern.negPre : pattern.posPre,
			             formatedText,
			             isNegative ? pattern.negSuf : pattern.posSuf);
			  return parts.join('');
		};

		return {
            currency: currency,
            number: number
        }

});