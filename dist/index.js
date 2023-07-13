(function (deckyFrontendLib, React) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
  };
  var IconContext = React__default["default"].createContext && React__default["default"].createContext(DefaultContext);

  var __assign = window && window.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = window && window.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function Tree2Element(tree) {
    return tree && tree.map(function (node, i) {
      return React__default["default"].createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }
  function GenIcon(data) {
    // eslint-disable-next-line react/display-name
    return function (props) {
      return React__default["default"].createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function (conf) {
      var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className) className = conf.className;
      if (props.className) className = (className ? className + " " : "") + props.className;
      return React__default["default"].createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className: className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && React__default["default"].createElement("title", null, title), props.children);
    };
    return IconContext !== undefined ? React__default["default"].createElement(IconContext.Consumer, null, function (conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // THIS FILE IS AUTO GENERATED
  function FaRocket (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z"}}]})(props);
  }

  const object = {};
  const hasOwnProperty = object.hasOwnProperty;
  const forOwn = (object, callback) => {
  	for (const key in object) {
  		if (hasOwnProperty.call(object, key)) {
  			callback(key, object[key]);
  		}
  	}
  };

  const extend = (destination, source) => {
  	if (!source) {
  		return destination;
  	}
  	forOwn(source, (key, value) => {
  		destination[key] = value;
  	});
  	return destination;
  };

  const forEach = (array, callback) => {
  	const length = array.length;
  	let index = -1;
  	while (++index < length) {
  		callback(array[index]);
  	}
  };

  const fourHexEscape = (hex) => {
  	return '\\u' + ('0000' + hex).slice(-4);
  };

  const hexadecimal = (code, lowercase) => {
  	let hexadecimal = code.toString(16);
  	if (lowercase) return hexadecimal;
  	return hexadecimal.toUpperCase();
  };

  const toString = object.toString;
  const isArray = Array.isArray;
  const isBuffer = (value) => {
  	return typeof Buffer === 'function' && Buffer.isBuffer(value);
  };
  const isObject = (value) => {
  	// This is a very simple check, but it’s good enough for what we need.
  	return toString.call(value) == '[object Object]';
  };
  const isString = (value) => {
  	return typeof value == 'string' ||
  		toString.call(value) == '[object String]';
  };
  const isNumber = (value) => {
  	return typeof value == 'number' ||
  		toString.call(value) == '[object Number]';
  };
  const isFunction = (value) => {
  	return typeof value == 'function';
  };
  const isMap = (value) => {
  	return toString.call(value) == '[object Map]';
  };
  const isSet = (value) => {
  	return toString.call(value) == '[object Set]';
  };

  /*--------------------------------------------------------------------------*/

  // https://mathiasbynens.be/notes/javascript-escapes#single
  const singleEscapes = {
  	'\\': '\\\\',
  	'\b': '\\b',
  	'\f': '\\f',
  	'\n': '\\n',
  	'\r': '\\r',
  	'\t': '\\t'
  	// `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
  	// '\v': '\\x0B'
  };
  const regexSingleEscape = /[\\\b\f\n\r\t]/;

  const regexDigit = /[0-9]/;
  const regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

  const escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g;
  const escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g;

  const jsesc = (argument, options) => {
  	const increaseIndentation = () => {
  		oldIndent = indent;
  		++options.indentLevel;
  		indent = options.indent.repeat(options.indentLevel);
  	};
  	// Handle options
  	const defaults = {
  		'escapeEverything': false,
  		'minimal': false,
  		'isScriptContext': false,
  		'quotes': 'single',
  		'wrap': false,
  		'es6': false,
  		'json': false,
  		'compact': true,
  		'lowercaseHex': false,
  		'numbers': 'decimal',
  		'indent': '\t',
  		'indentLevel': 0,
  		'__inline1__': false,
  		'__inline2__': false
  	};
  	const json = options && options.json;
  	if (json) {
  		defaults.quotes = 'double';
  		defaults.wrap = true;
  	}
  	options = extend(defaults, options);
  	if (
  		options.quotes != 'single' &&
  		options.quotes != 'double' &&
  		options.quotes != 'backtick'
  	) {
  		options.quotes = 'single';
  	}
  	const quote = options.quotes == 'double' ?
  		'"' :
  		(options.quotes == 'backtick' ?
  			'`' :
  			'\''
  		);
  	const compact = options.compact;
  	const lowercaseHex = options.lowercaseHex;
  	let indent = options.indent.repeat(options.indentLevel);
  	let oldIndent = '';
  	const inline1 = options.__inline1__;
  	const inline2 = options.__inline2__;
  	const newLine = compact ? '' : '\n';
  	let result;
  	let isEmpty = true;
  	const useBinNumbers = options.numbers == 'binary';
  	const useOctNumbers = options.numbers == 'octal';
  	const useDecNumbers = options.numbers == 'decimal';
  	const useHexNumbers = options.numbers == 'hexadecimal';

  	if (json && argument && isFunction(argument.toJSON)) {
  		argument = argument.toJSON();
  	}

  	if (!isString(argument)) {
  		if (isMap(argument)) {
  			if (argument.size == 0) {
  				return 'new Map()';
  			}
  			if (!compact) {
  				options.__inline1__ = true;
  				options.__inline2__ = false;
  			}
  			return 'new Map(' + jsesc(Array.from(argument), options) + ')';
  		}
  		if (isSet(argument)) {
  			if (argument.size == 0) {
  				return 'new Set()';
  			}
  			return 'new Set(' + jsesc(Array.from(argument), options) + ')';
  		}
  		if (isBuffer(argument)) {
  			if (argument.length == 0) {
  				return 'Buffer.from([])';
  			}
  			return 'Buffer.from(' + jsesc(Array.from(argument), options) + ')';
  		}
  		if (isArray(argument)) {
  			result = [];
  			options.wrap = true;
  			if (inline1) {
  				options.__inline1__ = false;
  				options.__inline2__ = true;
  			}
  			if (!inline2) {
  				increaseIndentation();
  			}
  			forEach(argument, (value) => {
  				isEmpty = false;
  				if (inline2) {
  					options.__inline2__ = false;
  				}
  				result.push(
  					(compact || inline2 ? '' : indent) +
  					jsesc(value, options)
  				);
  			});
  			if (isEmpty) {
  				return '[]';
  			}
  			if (inline2) {
  				return '[' + result.join(', ') + ']';
  			}
  			return '[' + newLine + result.join(',' + newLine) + newLine +
  				(compact ? '' : oldIndent) + ']';
  		} else if (isNumber(argument)) {
  			if (json) {
  				// Some number values (e.g. `Infinity`) cannot be represented in JSON.
  				return JSON.stringify(argument);
  			}
  			if (useDecNumbers) {
  				return String(argument);
  			}
  			if (useHexNumbers) {
  				let hexadecimal = argument.toString(16);
  				if (!lowercaseHex) {
  					hexadecimal = hexadecimal.toUpperCase();
  				}
  				return '0x' + hexadecimal;
  			}
  			if (useBinNumbers) {
  				return '0b' + argument.toString(2);
  			}
  			if (useOctNumbers) {
  				return '0o' + argument.toString(8);
  			}
  		} else if (!isObject(argument)) {
  			if (json) {
  				// For some values (e.g. `undefined`, `function` objects),
  				// `JSON.stringify(value)` returns `undefined` (which isn’t valid
  				// JSON) instead of `'null'`.
  				return JSON.stringify(argument) || 'null';
  			}
  			return String(argument);
  		} else { // it’s an object
  			result = [];
  			options.wrap = true;
  			increaseIndentation();
  			forOwn(argument, (key, value) => {
  				isEmpty = false;
  				result.push(
  					(compact ? '' : indent) +
  					jsesc(key, options) + ':' +
  					(compact ? '' : ' ') +
  					jsesc(value, options)
  				);
  			});
  			if (isEmpty) {
  				return '{}';
  			}
  			return '{' + newLine + result.join(',' + newLine) + newLine +
  				(compact ? '' : oldIndent) + '}';
  		}
  	}

  	const regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex;
  	result = argument.replace(regex, (char, pair, lone, quoteChar, index, string) => {
  		if (pair) {
  			if (options.minimal) return pair;
  			const first = pair.charCodeAt(0);
  			const second = pair.charCodeAt(1);
  			if (options.es6) {
  				// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
  				const codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
  				const hex = hexadecimal(codePoint, lowercaseHex);
  				return '\\u{' + hex + '}';
  			}
  			return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex));
  		}

  		if (lone) {
  			return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex));
  		}

  		if (
  			char == '\0' &&
  			!json &&
  			!regexDigit.test(string.charAt(index + 1))
  		) {
  			return '\\0';
  		}

  		if (quoteChar) {
  			if (quoteChar == quote || options.escapeEverything) {
  				return '\\' + quoteChar;
  			}
  			return quoteChar;
  		}

  		if (regexSingleEscape.test(char)) {
  			// no need for a `hasOwnProperty` check here
  			return singleEscapes[char];
  		}

  		if (options.minimal && !regexWhitespace.test(char)) {
  			return char;
  		}

  		const hex = hexadecimal(char.charCodeAt(0), lowercaseHex);
  		if (json || hex.length > 2) {
  			return fourHexEscape(hex);
  		}

  		return '\\x' + ('00' + hex).slice(-2);
  	});

  	if (quote == '`') {
  		result = result.replace(/\$\{/g, '\\${');
  	}
  	if (options.isScriptContext) {
  		// https://mathiasbynens.be/notes/etago
  		result = result
  			.replace(/<\/(script|style)/gi, '<\\/$1')
  			.replace(/<!--/g, json ? '\\u003C!--' : '\\x3C!--');
  	}
  	if (options.wrap) {
  		result = quote + result + quote;
  	}
  	return result;
  };

  jsesc.version = '3.0.2';

  var jsesc_1 = jsesc;

  const Content = ({ serverAPI }) => {
      const [options, setOptions] = React.useState({
          epicGames: false,
          gogGalaxy: false,
          origin: false,
          uplay: false,
      });
      // Add a new state variable to keep track of the progress and status of the operation
      const [progress, setProgress] = React.useState({ percent: 0, status: '' });
      const handleButtonClick = (name) => {
          setOptions((prevOptions) => ({
              ...prevOptions,
              [name]: !prevOptions[name],
          }));
      };
      const handleInstallClick = async () => {
          // Update the progress state variable to indicate that the operation has started
          setProgress({ percent: 0, status: 'Calling serverAPI...' });
          // Access the current state of the options variable here
          console.log(options);
          setProgress((prevProgress) => ({
              ...prevProgress,
              status: prevProgress.status + '\nAccessing current state of options...',
          }));
          // Set the selected options
          const selectedOptions = Object.keys(options).filter((key) => options[key]);
          // Convert the selected options to a mapping
          const selectedOptionsMapping = {};
          for (const option of selectedOptions) {
              selectedOptionsMapping[option] = true;
          }
          // Add a print statement before calling the install method on the serverAPI object
          console.log('Calling install method on serverAPI object with selected options:', selectedOptionsMapping);
          setProgress((prevProgress) => ({
              ...prevProgress,
              status: prevProgress.status +
                  '\nCalling install method on serverAPI object with selected options: ' +
                  JSON.stringify(selectedOptionsMapping),
          }));
          try {
              // Use the executeInTab method to run a Python file
              const pythonFile = `
import os
import json
import subprocess

def run():
  # Convert the selected options to a JSON string
  selected_options_json = '${jsesc_1(JSON.stringify(selectedOptionsMapping), { quotes: 'double' })}'

  # Parse the JSON string to get a dictionary of the selected options
  selected_options = json.loads(selected_options_json)

  # Set an environment variable with the selected options
  os.environ['SELECTED_OPTIONS'] = selected_options_json

  # Run the main.py file with the selected options as an environment variable
  process = subprocess.Popen(["python3", "main.py"])

  # Wait for the process to complete
  process.wait()

if __name__ == "__main__":
  run()
`;
              await serverAPI.executeInTab("my_tab_id", true, pythonFile);
              // Update the progress state variable to indicate that the operation has completed successfully
              setProgress({ percent: 100, status: 'Installation successful!' });
              alert('Installation successful!');
          }
          catch (error) {
              // Update the progress state variable to indicate that an error occurred
              setProgress({ percent: 100, status: 'Installation failed.' });
              console.error('Error calling install method on serverAPI object:', error);
          }
      };
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement("progress", { value: progress.percent, max: 100 }),
              window.SP_REACT.createElement("div", null, progress.status)),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: (e) => deckyFrontendLib.showContextMenu(window.SP_REACT.createElement(deckyFrontendLib.Menu, { label: "Menu", cancelText: "CAAAANCEL", onCancel: () => { } },
                          window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { } }, "Item #1"),
                          window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { } }, "Item #2"),
                          window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { } }, "Item #3")), e.currentTarget ?? window) }, "Find Games w/BoilR")),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options.epicGames ? 'selected' : '', layout: "below", onClick: () => handleButtonClick('epicGames') },
                      window.SP_REACT.createElement("span", { className: "checkmark" }, options.epicGames ? '✓' : ''),
                      ' ',
                      "Epic Games"),
                  window.SP_REACT.createElement("br", null),
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options.gogGalaxy ? 'selected' : '', layout: "below", onClick: () => handleButtonClick('gogGalaxy') },
                      window.SP_REACT.createElement("span", { className: "checkmark" }, options.gogGalaxy ? '✓' : ''),
                      ' ',
                      "Gog Galaxy"),
                  window.SP_REACT.createElement("br", null),
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options.origin ? 'selected' : '', layout: "below", onClick: () => handleButtonClick('origin') },
                      window.SP_REACT.createElement("span", { className: "checkmark" }, options.origin ? '✓' : ''),
                      ' ',
                      "Origin"),
                  window.SP_REACT.createElement("br", null),
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options.uplay ? 'selected' : '', layout: "below", onClick: () => handleButtonClick('uplay') },
                      window.SP_REACT.createElement("span", { className: "checkmark" }, options.uplay ? '✓' : ''),
                      ' ',
                      "Uplay"),
                  window.SP_REACT.createElement("br", null),
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: handleInstallClick }, "Install"))),
          window.SP_REACT.createElement("style", null, `
              .checkmark {
                color: green;
              }
              .selected {
                background-color: #eee;
              }
              progress {
                display: block;
                width: 100%;
                margin-top: 5px;
                height: 20px; /* Change the height of the progress bar here */
              }
              pre {
                white-space: pre-wrap;
              }
            `)));
  };
  var index = deckyFrontendLib.definePlugin((serverApi) => {
      return {
          title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "NonSteamLaunchers"),
          content: window.SP_REACT.createElement(Content, { serverAPI: serverApi }),
          icon: window.SP_REACT.createElement(FaRocket, null),
      };
  });

  return index;

})(DFL, SP_REACT);
