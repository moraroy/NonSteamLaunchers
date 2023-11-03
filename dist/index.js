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

  // Define a reducer function for updating customWebsites
  const customWebsitesReducer = (state, action) => {
      console.log(`action: ${JSON.stringify(action)}`);
      switch (action.type) {
          case 'UPDATE_CUSTOM_WEBSITES':
              // Store the updated customWebsites in localStorage
              localStorage.setItem('customWebsites', JSON.stringify(action.customWebsites));
              return action.customWebsites;
          default:
              return state;
      }
  };
  // Create a context with an empty array as the default value
  const CustomWebsitesContext = React.createContext({
      customWebsites: [],
      dispatch: () => { },
  });
  // Create a provider component that takes in children as a prop
  const CustomWebsitesProvider = ({ children }) => {
      // Retrieve the customWebsites from localStorage on initial render
      const [customWebsites, dispatch] = React.useReducer(customWebsitesReducer, JSON.parse(localStorage.getItem('customWebsites') || '[]'));
      // Render the provider and pass in the customWebsites state and dispatch function as the value
      return (window.SP_REACT.createElement(CustomWebsitesContext.Provider, { value: { customWebsites, dispatch } }, children));
  };
  const SearchModal = ({ closeModal, setModalResult, promptText }) => {
      console.log('SearchModal rendered');
      const [searchText, setSearchText] = React.useState('');
      const handleTextChange = (e) => {
          setSearchText(e.target.value);
      };
      const handleSubmit = () => {
          // Split the entered text by commas and trim any whitespace
          const websites = searchText.split(',').map((website) => website.trim());
          console.log(`websites: ${JSON.stringify(websites)}`);
          setModalResult && setModalResult(websites);
          closeModal && closeModal();
      };
      return (window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, { closeModal: handleSubmit },
          window.SP_REACT.createElement("form", null,
              window.SP_REACT.createElement(deckyFrontendLib.TextField, { focusOnMount: true, label: "Websites", placeholder: promptText, onChange: handleTextChange }),
              window.SP_REACT.createElement("p", null, "You can separate multiple websites by using commas."),
              window.SP_REACT.createElement("button", { type: "button", onClick: handleSubmit }, "Submit"))));
  };
  const Content = ({ serverAPI }) => {
      console.log('Content rendered');
      // Use the useContext hook to access customWebsites and dispatch from the context
      const { customWebsites, dispatch } = React.useContext(CustomWebsitesContext);
      const [options, setOptions] = React.useState({
          epicGames: false,
          gogGalaxy: false,
          origin: false,
          uplay: false,
          battleNet: false,
          amazonGames: false,
          eaApp: false,
          legacyGames: false,
          itchIo: false,
          humbleGames: false,
          indieGala: false,
          rockstar: false,
          glyph: false,
          minecraft: false,
          psPlus: false,
          dmm: false,
          xboxGamePass: false,
          geforceNow: false,
          amazonLuna: false,
          netflix: false,
          hulu: false,
          disneyPlus: false,
          amazonPrimeVideo: false,
          youtube: false,
          twitch: false
      });
      const [progress, setProgress] = React.useState({ percent: 0, status: '' });
      const [separateAppIds, setSeparateAppIds] = React.useState(false);
      const [clickedButton, setClickedButton] = React.useState('');
      React.useEffect(() => {
          console.log(`customWebsites updated:${JSON.stringify(customWebsites)}`);
      }, [customWebsites]);
      const handleButtonClick = (name) => {
          setOptions((prevOptions) => ({
              ...prevOptions,
              [name]: !prevOptions[name],
          }));
      };
      const handleInstallClick = async () => {
          console.log('handleInstallClick called');
          const selectedLaunchers = Object.entries(options)
              .filter(([_, isSelected]) => isSelected)
              .map(([name, _]) => name.charAt(0).toUpperCase() + name.slice(1))
              .join(', ');
          setProgress({ percent: 0, status: `Calling serverAPI...please be patient...this can take some time... Downloading and Installing ${selectedLaunchers}... Steam will restart Automatically` });
          console.log(`Selected options:${JSON.stringify(options)}`);
          console.log(`customWebsites:${JSON.stringify(customWebsites)}`);
          try {
              const result = await serverAPI.callPluginMethod("install", {
                  selected_options: options,
                  custom_websites: customWebsites,
                  separate_app_ids: separateAppIds,
                  start_fresh: false // Pass true for the start_fresh parameter
              });
              if (result) {
                  setProgress({ percent: 100, status: 'Installation successful!' });
                  alert('Installation successful!');
              }
              else {
                  setProgress({ percent: 100, status: 'Installation failed.' });
                  alert('Installation failed.');
              }
          }
          catch (error) {
              setProgress({ percent: 100, status: 'Installation failed.' });
              console.error('Error calling _main method on server-side plugin:', error);
          }
      };
      const handleStartFreshClick = async () => {
          console.log('handleStartFreshClick called');
          // Call the install method on the server-side plugin with the appropriate arguments
          try {
              const result = await serverAPI.callPluginMethod("install", {
                  selected_options: options,
                  custom_websites: customWebsites,
                  separate_app_ids: separateAppIds,
                  start_fresh: true // Pass true for the start_fresh parameter
              });
              if (result) {
                  setProgress({ percent: 100, status: 'Installation successful!' });
                  alert('Installation successful!');
              }
              else {
                  setProgress({ percent: 100, status: 'Installation failed.' });
                  alert('Installation failed.');
              }
          }
          catch (error) {
              setProgress({ percent: 100, status: 'Installation failed.' });
              console.error('Error calling _main method on server-side plugin:', error);
          }
      };
      const handleCreateWebsiteShortcutClick = async () => {
          console.log('handleCreateWebsiteShortcutClick called');
          setClickedButton('createWebsiteShortcut');
          deckyFrontendLib.showModal(window.SP_REACT.createElement(SearchModal, { promptText: "Enter website", setModalResult: (result) => {
                  console.log(`result:${JSON.stringify(result)}`);
                  if (clickedButton === 'createWebsiteShortcut') {
                      // Handle result for createWebsiteShortcut button
                      dispatch({ type: 'UPDATE_CUSTOM_WEBSITES', customWebsites: result });
                  }
              } }), deckyFrontendLib.findSP());
      };
      const optionsData = [
          { name: 'epicGames', label: 'Epic Games' },
          { name: 'gogGalaxy', label: 'Gog Galaxy' },
          { name: 'origin', label: 'Origin' },
          { name: 'uplay', label: 'Ubisoft Connect' },
          { name: 'battleNet', label: 'Battle.net' },
          { name: 'amazonGames', label: 'Amazon Games' },
          { name: 'eaApp', label: 'EA App' },
          { name: 'legacyGames', label: 'Legacy Games' },
          { name: 'itchIo', label: 'Itch.io' },
          { name: 'humbleGames', label: 'Humble Games' },
          { name: 'indieGala', label: 'IndieGala Client' },
          { name: 'rockstar', label: 'Rockstar Games Launcher' },
          { name: 'glyph', label: 'Glyph Laucnher' },
          { name: 'minecraft', label: 'Minecraft' },
          { name: 'psPlus', label: 'Playstation Plus' },
          { name: 'dmm', label: 'DMM Games' },
          { name: 'xboxGamePass', label: 'Xbox Game Pass' },
          { name: 'geforceNow', label: 'GeForce Now' },
          { name: 'amazonLuna', label: 'Amazon Luna' },
          { name: 'netflix', label: 'Netflix' },
          { name: 'hulu', label: 'Hulu' },
          { name: 'disneyPlus', label: 'Disney+' },
          { name: 'amazonPrimeVideo', label: 'Amazon Prime Video' },
          { name: 'youtube', label: 'Youtube' },
          { name: 'twitch', label: 'Twitch' }
      ];
      const launcherOptions = optionsData.filter(({ name }) => ['epicGames', 'gogGalaxy', 'uplay', 'battleNet', 'amazonGames', 'eaApp', 'legacyGames', 'humbleGames', 'indieGala', 'minecraft', 'psPlus'].includes(name));
      const streamingOptions = optionsData.filter(({ name }) => ['xboxGamePass', 'geforceNow', 'amazonLuna', 'netflix', 'hulu', 'disneyPlus', 'amazonPrimeVideo', 'youtube', 'twitch'].includes(name));
      return (window.SP_REACT.createElement("div", { className: "decky-plugin" },
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "10px" } }, "Welcome to the decky plugin version of NonSteamLaunchers! I hope it works..."),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, { style: { fontSize: "12px", marginBottom: "10px" } }, "Thank you for everyone's support and contributions on the script itself, this is the plugin we have all been waiting for... installing your favorite launchers in the easiest way possible. Enjoy! P.S. A couple notes... you may need to restart your steam deck even after steam restarts the first time. This is a known bug im trying to fix. The \"Create Website Shortcut\" doesnt hold variables yet that is a WIP. Some launchers are not available due to user input, still looking for way around this, thank you and please be patient as i add more features from the original script!"),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.ToggleField, { label: "Separate App IDs", checked: separateAppIds, onChange: setSeparateAppIds })),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement("progress", { value: progress.percent, max: 100 }),
              window.SP_REACT.createElement("div", null, progress.status)),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: handleInstallClick }, "Install"),
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: handleStartFreshClick }, "Start Fresh"),
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: handleCreateWebsiteShortcutClick }, "Create Website Shortcut")),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "Game Launchers" },
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, { style: { fontSize: "12px", marginBottom: "10px" } }, "Here you choose your launchers you want to install and let NSL do the rest. Once Steam restarts your launchers will be in your library!"),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null, launcherOptions.map(({ name, label }) => (window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options[name] ? 'selected' : '', layout: "below", onClick: () => handleButtonClick(name) },
                  window.SP_REACT.createElement("span", { className: "checkmark" }, options[name] ? '✓' : ''),
                  ' ',
                  label))))),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "Game and Movie Streaming" },
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, { style: { fontSize: "12px", marginBottom: "10px" } }, "Please install Google Chrome via the Discover Store in desktop mode first. NSL uses Chrome to launch these sites. Do NOT \"Force Compatability\" on these they will not open with proton."),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null, streamingOptions.map(({ name, label }) => (window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { className: options[name] ? 'selected' : '', layout: "below", onClick: () => handleButtonClick(name) },
                  window.SP_REACT.createElement("span", { className: "checkmark" }, options[name] ? '✓' : ''),
                  ' ',
                  label))))),
          window.SP_REACT.createElement("style", null, `
          .decky-plugin .checkmark {
            color: green;
          }
          .decky-plugin .selected {
            background-color: #eee;
          }
          .decky-plugin progress {
            display:block;
            width: 100%;
            margin-top: 5px;
            height: 20px;
          }
          .decky-plugin pre {
            white-space: pre-wrap;
          }
          .decky-plugin .decky-ButtonItem {
            margin-bottom: 10px;
            border-bottom: none;
          }
          .decky-plugin .decky-PanelSection {
            border-bottom: none;
          }
        `)));
  };
  var index = deckyFrontendLib.definePlugin((serverApi) => {
      return {
          title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "NonSteamLaunchers"),
          content: (window.SP_REACT.createElement(CustomWebsitesProvider, null,
              window.SP_REACT.createElement(Content, { serverAPI: serverApi }))),
          icon: window.SP_REACT.createElement(FaRocket, null),
      };
  });

  return index;

})(DFL, SP_REACT);
