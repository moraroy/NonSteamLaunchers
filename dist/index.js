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

  const SearchModal = ({ closeModal, setModalResult, promptText }) => {
      console.log('SearchModal rendered'); // Add this line
      const [searchText, setSearchText] = React.useState('');
      const handleTextChange = (e) => {
          setSearchText(e.target.value);
      };
      const handleSubmit = () => {
          setModalResult && setModalResult(searchText);
          closeModal && closeModal();
      };
      return (window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, { closeModal: handleSubmit },
          window.SP_REACT.createElement("form", null,
              window.SP_REACT.createElement(deckyFrontendLib.TextField, { focusOnMount: true, label: "Search", placeholder: promptText, onChange: handleTextChange }))));
  };
  const Content = ({ serverAPI }) => {
      console.log('Content rendered'); // Add this line
      const [options, setOptions] = React.useState({
          epicGames: false,
          gogGalaxy: false,
          origin: false,
          uplay: false,
          xboxGamePass: false,
          geforceNow: false,
          amazonLuna: false,
          netflix: false,
          hulu: false,
          disneyPlus: false,
          amazonPrimeVideo: false,
          youtube: false
      });
      // Add a new state variable to keep track of the progress and status of the operation
      const [progress, setProgress] = React.useState({ percent: 0, status: '' });
      // Add a new state variable to keep track of whether the "Separate App IDs" option is selected or not
      const [separateAppIds, setSeparateAppIds] = React.useState(false);
      // Add a new state variable to keep track of whether the search modal is open or not
      const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
      // Add a new state variable to keep track of which button was clicked
      const [clickedButton, setClickedButton] = React.useState('');
      // Add a new state variable to keep track of the custom websites entered by the user
      const [customWebsites, setCustomWebsites] = React.useState([]);
      const handleButtonClick = (name) => {
          setOptions((prevOptions) => ({
              ...prevOptions,
              [name]: !prevOptions[name],
          }));
      };
      const handleInstallClick = async () => {
          console.log('handleInstallClick called'); // Add this line
          // Construct a string that lists the selected launchers
          const selectedLaunchers = Object.entries(options)
              .filter(([_, isSelected]) => isSelected)
              .map(([name, _]) => name.charAt(0).toUpperCase() + name.slice(1))
              .join(', ');
          // Update the progress state variable to indicate that the operation has started
          setProgress({ percent: 0, status: `Calling serverAPI... Installing ${selectedLaunchers}` });
          // Log the selected options for debugging
          console.log(`Selected options: ${JSON.stringify(options)}`);
          try {
              const result = await serverAPI.callPluginMethod("install", {
                  selected_options: options,
                  custom_websites: customWebsites,
                  separate_app_ids: separateAppIds
              });
              if (result) {
                  // Update the progress state variable to indicate that the operation has completed successfully
                  setProgress({ percent: 100, status: 'Installation successful!' });
                  alert('Installation successful!');
              }
              else {
                  // Update the progress state variable to indicate that an error occurred
                  setProgress({ percent: 100, status: 'Installation failed.' });
                  alert('Installation failed.');
              }
          }
          catch (error) {
              // Update the progress state variable to indicate that an error occurred
              setProgress({ percent: 100, status: 'Installation failed.' });
              console.error('Error calling _main method on server-side plugin:', error);
          }
      };
      const handleCreateWebsiteShortcutClick = async () => {
          console.log('handleCreateWebsiteShortcutClick called'); // Add this line
          // Set the clickedButton state variable to 'createWebsiteShortcut'
          setClickedButton('createWebsiteShortcut');
          // Open the search modal to prompt the user for a website
          setIsSearchModalOpen(true);
      };
      // Create an array of objects representing each option, with properties for the option name and label
      const optionsData = [
          { name: 'epicGames', label: 'Epic Games' },
          { name: 'gogGalaxy', label: 'Gog Galaxy' },
          { name: 'origin', label: 'Origin' },
          { name: 'uplay', label: 'Uplay' },
          { name: 'xboxGamePass', label: 'Xbox Game Pass' },
          { name: 'geforceNow', label: 'GeForce Now' },
          { name: 'amazonLuna', label: 'Amazon Luna' },
          { name: 'netflix', label: 'Netflix' },
          { name: 'hulu', label: 'Hulu' },
          { name: 'disneyPlus', label: 'Disney+' },
          { name: 'amazonPrimeVideo', label: 'Amazon Prime Video' },
          { name: 'youtube', label: 'Youtube' }
      ];
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement("progress", { value: progress.percent, max: 100 }),
              window.SP_REACT.createElement("div", null, progress.status)),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: handleInstallClick }, "Install"),
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: handleCreateWebsiteShortcutClick }, "Create Website Shortcut"),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.ToggleField, { label: "Separate App IDs", checked: separateAppIds, onChange: setSeparateAppIds })),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: (e) => deckyFrontendLib.showContextMenu(window.SP_REACT.createElement(deckyFrontendLib.Menu, { label: "Menu", cancelText: "CAAAANCEL", onCancel: () => { } },
                          window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { } }, "Item #1"),
                          window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { } }, "Item #2"),
                          window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { } }, "Item #3")), e.currentTarget ?? window) }, "Find Games w/BoilR")),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null, optionsData.map(({ name, label }) => (window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options[name] ? 'selected' : '', layout: "below", onClick: () => handleButtonClick(name) },
                  window.SP_REACT.createElement("span", { className: "checkmark" }, options[name] ? '✓' : ''),
                  ' ',
                  label))))),
          isSearchModalOpen && (window.SP_REACT.createElement(SearchModal, { closeModal: () => setIsSearchModalOpen(false), setModalResult: (result) => {
                  if (clickedButton === 'createWebsiteShortcut') {
                      // Handle result for createWebsiteShortcut button
                      setCustomWebsites([...customWebsites, result]);
                  }
                  setIsSearchModalOpen(false);
              }, promptText: "Enter website" })),
          window.SP_REACT.createElement("style", null, `
           .checkmark {
             color: green;
           }
           .selected {
             background-color: #eee;
           }
           progress {
             display:block;
             width: 100%;
             margin-top: 5px;
             height: 20px; /* Change the height of the progress bar here */
           }
           pre {
             white-space: pre-wrap;
           }
           ButtonItem {
             margin-bottom: 10px;
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
