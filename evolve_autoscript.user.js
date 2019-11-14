/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/evolution.js":
/*!**************************!*\
  !*** ./src/evolution.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return loadEvolution; });\n// Contains variables and functions for Auto Evolution\r\n\r\n// IDs of the farming buttons\r\nconst evoFarmActions = [\"evo-rna\", \"evo-dna\"];\r\n\r\n// IDs of all the race decision actions\r\nconst evoRaceActions = [\r\n\t\"evo-phagocytosis\", \"evo-chitin\", \"evo-chloroplasts\",\r\n\t\"evo-eggshell\", \"evo-mammals\", \"evo-athropods\",\r\n\t\"evo-ectothermic\", \"evo-endothermic\",\r\n\t\"evo-humanoid\", \"evo-gigantism\", \"evo-animalism\", \"evo-dwarfism\",\r\n\t\"evo-aquatic\", \"evo-demonic\",\r\n\t\"evo-entish\", \"evo-cacti\",\r\n\t\"evo-sporgar\", \"evo-shroomi\",\r\n\t\"evo-arraak\", \"evo-pterodacti\", \"evo-dracnid\",\r\n\t\"evo-tortoisan\", \"evo-gecko\", \"evo-slitheryn\",\r\n\t\"evo-human\", \"evo-elven\", \"evo-orc\",\r\n\t\"evo-orge\", \"evo-cyclops\", \"evo-troll\",\r\n\t\"evo-kobold\", \"evo-goblin\", \"evo-gnome\",\r\n\t\"evo-cath\", \"evo-wolven\", \"evo-centaur\",\r\n\t\"evo-mantis\", \"evo-scorpid\", \"evo-antid\",\r\n\t\"evo-sharkin\", \"evo-octigoran\", \"evo-balorg\", \"evo-imp\",'evo-seraph','evo-unicorn'];\r\n\r\n// IDs of all the challenge options\r\nconst evoChallengeActions = ['evo-plasmid', 'evo-mastery', 'evo-trade', 'evo-craft', 'evo-crispr', 'evo-junker', 'evo-joyless', 'evo-decay'];\r\n// IDs of all the harder challenge options\r\nconst evoHardChallengeActions = ['evo-junker', 'evo-joyless', 'evo-decay'];\r\n\r\n// IDs of all the universe options\r\nconst evoUniverses = ['uni-standard','uni-heavy','uni-antimatter','uni-evil','uni-micro'];\r\n\r\n// Contains all the race option decisions for each race\r\nconst evoRaceTrees = {\r\n    \"entish\":[\"evo-chloroplasts\", \"evo-entish\"],\r\n    \"cacti\":[\"evo-chloroplasts\", \"evo-cacti\"],\r\n    \"sporgar\":[\"evo-chitin\", \"evo-sporgar\"],\r\n    \"shroomi\":[\"evo-chitin\", \"evo-shroomi\"],\r\n    \"arraak\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-endothermic\", \"evo-arraak\"],\r\n    \"pterodacti\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-endothermic\", \"evo-pterodacti\"],\r\n    \"dracnid\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-endothermic\", \"evo-dracnid\"],\r\n    \"tortoisan\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-ectothermic\", \"evo-tortoisan\"],\r\n    \"gecko\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-ectothermic\", \"evo-gecko\"],\r\n    \"slitheryn\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-ectothermic\", \"evo-slitheryn\"],\r\n    \"human\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-humanoid\", \"evo-human\"],\r\n    \"elven\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-humanoid\", \"evo-elven\"],\r\n    \"orc\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-humanoid\", \"evo-orc\"],\r\n    \"orge\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-gigantism\", \"evo-orge\"],\r\n    \"cyclops\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-gigantism\", \"evo-cyclops\"],\r\n    \"troll\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-gigantism\", \"evo-troll\"],\r\n    \"kobold\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-dwarfism\", \"evo-kobold\"],\r\n    \"goblin\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-dwarfism\", \"evo-goblin\"],\r\n    \"gnome\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-dwarfism\", \"evo-gnome\"],\r\n    \"cath\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-animalism\", \"evo-cath\"],\r\n    \"wolven\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-animalism\", \"evo-wolven\"],\r\n    \"centaur\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-animalism\", \"evo-centaur\"],\r\n    \"mantis\":[\"evo-phagocytosis\", \"evo-athropods\", \"evo-mantis\"],\r\n    \"scorpid\":[\"evo-phagocytosis\", \"evo-athropods\", \"evo-scorpid\"],\r\n    \"antid\":[\"evo-phagocytosis\", \"evo-athropods\", \"evo-antid\"],\r\n    \"sharkin\":[\"evo-phagocytosis\", \"evo-aquatic\", \"evo-sharkin\"],\r\n    \"octigoran\":[\"evo-phagocytosis\", \"evo-aquatic\", \"evo-octigoran\"],\r\n    \"octigoran\":[\"evo-phagocytosis\", \"evo-aquatic\", \"evo-octigoran\"],\r\n    \"balorg\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-demonic\", \"evo-balorg\"],\r\n    \"imp\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-demonic\", \"evo-imp\"],\r\n    \"seraph\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-angelic\", \"evo-seraph\"],\r\n    \"unicorn\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-angelic\", \"evo-unicorn\"],\r\n};\r\n\r\n// Will contain the minimum amount of each evolution building to move onto civilization\r\n// Is loaded by loadEvolution\r\nvar maxEvo = {}\r\n\r\n// Loads maxEvo\r\nfunction loadEvolution() {\r\n    // Loading all maximum values for evolution upgrades\r\n    maxEvo = {};\r\n    // Need these to unlock next upgrades\r\n    maxEvo['evo-organelles'] = 2;\r\n    maxEvo['evo-nucleus'] = 1;\r\n    // Determining how much storage is necessary\r\n    let needed = 320\r\n    if (perkUnlocked('Morphogenesis')) {\r\n        needed *= 0.8;\r\n    }\r\n    let baseStorage = 100;\r\n    // Adding to baseStorage if Creator is unlocked\r\n    if (achievementUnlocked('Creator') != -1) {\r\n        baseStorage += (achievementUnlocked('Creator')-1)*50;\r\n    }\r\n    // Finding most optimal maxes to reach sentience\r\n    let total = 1000;\r\n    for (let i = 0;i < 10;i++) {\r\n        let numEuk = i;\r\n        let numMit = Math.ceil((((needed-baseStorage) / numEuk) - 10)/10)\r\n        if ((numEuk + numMit) <= total) {\r\n            maxEvo['evo-eukaryotic_cell'] = numEuk;\r\n            maxEvo['evo-mitochondria'] = numMit;\r\n            total = numEuk + numMit\r\n        }\r\n    }\r\n    maxEvo['evo-membrane'] = Math.ceil((needed-baseStorage) / (5 * maxEvo['evo-mitochondria'] + 5))\r\n    // Setting minimum to 1 for unlocking next upgrades\r\n    maxEvo['evo-membrane'] = (maxEvo['evo-membrane'] <= 0) ? 1 : maxEvo['evo-membrane'];\r\n    maxEvo['evo-eukaryotic_cell'] = (maxEvo['evo-eukaryotic_cell'] <= 0) ? 1 : maxEvo['evo-eukaryotic_cell'];\r\n    maxEvo['evo-mitochondria'] = (maxEvo['evo-mitochondria'] <= 0) ? 1 : maxEvo['evo-mitochondria'];\r\n}\r\n\r\nfunction autoEvolution() {\r\n    let actions = document.querySelectorAll('#evolution .action');\r\n    let chosenAction = null;\r\n    let chosenPriority = 0;\r\n    let transition = false;\r\n    for (let i = 0; i < actions.length; i++) {\r\n        // Checking if purchasable\r\n        let action = actions[i];\r\n        // Not purchasable\r\n        if (action.className.indexOf(\"cna\") >= 0) {continue;}\r\n        // Farming button\r\n        if(evoFarmActions.includes(action.id)) {continue;}\r\n        // Reached max in maxEvo\r\n        if(action.id in maxEvo && parseInt($('#'+action.id+' > a > .count')[0].innerText) >= maxEvo[action.id]) {continue;}\r\n        // Don't take planets\r\n        if(/\\w+\\d+/.exec(action.id) !== null) {continue;}\r\n        // Don't take universes\r\n        if (evoUniverses.includes(action.id)) {continue;}\r\n        // Checking for race decision tree\r\n        if(evoRaceActions.includes(action.id) && !evoRaceTrees[settings.evolution].includes(action.id)) {continue;}\r\n        let newPriority = 0;\r\n        // If it is a challenge Action\r\n        if (evoChallengeActions.includes(action.id)) {\r\n            // Hard Challenge\r\n            if (evoHardChallengeActions.includes(action.id)) {\r\n                // Junker will start automatically\r\n                if (action.id == 'evo-junker' && settings[action.id]) {\r\n                    newPriority = 2;\r\n                }\r\n                // Other Hard Challenges will need to be toggled\r\n                else {\r\n                    if (!action.classList.contains('hl') === settings[action.id]) {\r\n                        newPriority = 10;\r\n                    }\r\n                }\r\n            }\r\n            // Normal Challenge\r\n            else {\r\n                // Normal Challenges will need to be toggled\r\n                if (!action.classList.contains('hl') === settings[action.id]) {\r\n                    newPriority = 10;\r\n                }\r\n            }\r\n        }\r\n        // Race Actions\r\n        else if (evoRaceActions.includes(action.id)) {\r\n            newPriority = 6;\r\n            // Final race action\r\n            if (action.id == evoRaceTrees[settings.evolution][evoRaceTrees[settings.evolution].length-1]) {\r\n                newPriority = 5;\r\n            }\r\n        }\r\n        // Sentience\r\n        else if (action.id == 'evo-sentience') {\r\n            newPriority = 1;\r\n        }\r\n        // Other actions\r\n        else {\r\n            newPriority = 20;\r\n        }\r\n        // Checking if chosen action needs to be replaced\r\n        if (newPriority > chosenPriority) {\r\n            chosenPriority = newPriority;\r\n            chosenAction = action;\r\n        }\r\n    }\r\n    if (chosenAction !== null) {\r\n        chosenAction.children[0].click();\r\n        if (chosenPriority <= 5) {\r\n            loadSettings();\r\n            resetUI();\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/evolution.js?");

/***/ }),

/***/ "./src/gameScripts.js":
/*!****************************!*\
  !*** ./src/gameScripts.js ***!
  \****************************/
/*! exports provided: f_rate, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"f_rate\", function() { return f_rate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return zigguratBonus; });\n// These variables and functions were stolen from the original game scripts\r\n// If any of these change with game updates, they need to be updated here as well\r\n\r\n// From actions.js\r\n// Determines the factory output\r\nconst f_rate = {\r\n    Lux: {\r\n        demand: [0.14,0.21,0.28,0.35],\r\n        fur: [2,3,4,5]\r\n    },\r\n    Alloy: {\r\n        copper: [0.75,1.12,1.49,1.86],\r\n        aluminium: [1,1.5,2,2.5],\r\n        output: [0.075,0.112,0.149,0.186]\r\n    },\r\n    Polymer: {\r\n        oil_kk: [0.22,0.33,0.44,0.55],\r\n        oil: [0.18,0.27,0.36,0.45],\r\n        lumber: [15,22,29,36],\r\n        output: [0.125,0.187,0.249,0.311],\r\n    },\r\n    Nano_Tube: {\r\n        coal: [8,12,16,20],\r\n        neutronium: [0.05,0.075,0.1,0.125],\r\n        output: [0.2,0.3,0.4,0.5],\r\n    },\r\n    Stanene: {\r\n        aluminium: [30,45,60,75],\r\n        nano: [0.02,0.03,0.04,0.05],\r\n        output: [0.6,0.9,1.2,1.5],\r\n    }\r\n};\r\n\r\n// From space.js\r\n// Determines the mining droid output bonus\r\nfunction zigguratBonus(){\r\n    let bonus = 1;\r\n    if (window.evolve.global.space['ziggurat'] && window.evolve.global.space['ziggurat'].count > 0){\r\n        let study = window.evolve.global.tech['ancient_study'] ? 0.006 : 0.004;\r\n        bonus += (window.evolve.global.space.ziggurat.count * window.evolve.global.civic.colonist.workers * study);\r\n    }\r\n    return bonus;\r\n}\n\n//# sourceURL=webpack:///./src/gameScripts.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility.js */ \"./src/utility.js\");\n/* harmony import */ var _gameScripts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameScripts.js */ \"./src/gameScripts.js\");\n/* harmony import */ var _evolution_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./evolution.js */ \"./src/evolution.js\");\n\r\n\r\n\r\n\r\n\r\n(async function() {\r\n    console.log(\"Waiting for game to load...\");\r\n    await Object(_utility_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(2000);\r\n    main();\r\n})();\r\n\r\nasync function main() {\r\n\r\n    window.evolve = unsafeWindow.evolve;\r\n    console.log(window.evolve);\r\n    'use strict';\r\n    var settings = {};\r\n    var jsonSettings = localStorage.getItem('settings');\r\n    if(jsonSettings != null){settings = JSON.parse(jsonSettings);}\r\n\r\n    var url = 'https://github.com/HLXII/Evolve-Autoscript';\r\n    var version = '1.2.12';\r\n\r\n    // Used to ensure no modal window conflicts\r\n    var modal = false;\r\n\r\n    var resources = {};\r\n    var buildings = {};\r\n    var researches = {};\r\n\r\n    loadSettings();\r\n\r\n    // Main script loop\r\n    var count = 1;\r\n    while(1) {\r\n        await Object(_utility_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(2000);\r\n        await fastAutomate();\r\n    }\r\n}\r\n\r\nasync function fastAutomate() {\r\n    console.clear();\r\n    console.log(count);\r\n    updateUI();\r\n    updateSettings();\r\n    autoFarm();\r\n    autoRefresh();\r\n    autoBattle();\r\n    if (inEvolution()) {\r\n        // Evolution Automation\r\n        if(settings.autoEvolution) {\r\n            autoEvolution();\r\n            // Loading buttons again to get DNA button\r\n            loadFarm();\r\n        }\r\n    } else {\r\n        // Civilization Automation\r\n        var priorityData = null;\r\n        if (settings.autoPriority) {\r\n            priorityData = await autoPriority(count);\r\n        }\r\n        else {\r\n            if (settings.autoSmelter && count % settings.smelterSettings.Interval == 0) {\r\n                await autoSmelter();\r\n            }\r\n            if (settings.autoFactory && count % settings.factorySettings.Interval == 0) {\r\n                await autoFactory();\r\n            }\r\n            if (settings.autoDroid && count % settings.droidSettings.Interval == 0) {\r\n                await autoDroid();\r\n            }\r\n            if (settings.autoGraphene && count % settings.grapheneSettings.Interval == 0) {\r\n                await autoGraphene();\r\n            }\r\n            if (settings.autoSupport && count % settings.supportSettings.Interval == 0) {\r\n                await autoSupport();\r\n            }\r\n        }\r\n        if (settings.autoTrade){autoTrade(priorityData);}\r\n        if (settings.autoEjector) {autoEjector();}\r\n        if (settings.autoCraft){\r\n            autoCraft();\r\n        }\r\n        if (settings.autoEmploy){\r\n            autoEmploy(priorityData);\r\n        }\r\n        if (settings.autoTax) {\r\n            autoTax();\r\n        }\r\n        if (settings.autoMarket){\r\n            autoMarket();\r\n        }\r\n        if (settings.autoStorage) {\r\n            autoStorage();\r\n        }\r\n        if (settings.autoPrestige) {\r\n            autoPrestige();\r\n        }\r\n    }\r\n    count += 1;\r\n}\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/utility.js":
/*!************************!*\
  !*** ./src/utility.js ***!
  \************************/
/*! exports provided: default, getMultiplier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return sleep; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMultiplier\", function() { return getMultiplier; });\n// Stores generic utility functions\r\n\r\n\r\n// async function for sleeping\r\nfunction sleep(ms) {\r\n  return new Promise(resolve => setTimeout(resolve, ms));\r\n}\r\n\r\n// Gets the multiplier on the resource\r\n// 'Global' returns the global multiplier\r\nfunction getMultiplier(res) {\r\n    let multiplier = 1;\r\n    for (let val in window.evolve.breakdown.p[res]) {\r\n        let data = window.evolve.breakdown.p[res][val];\r\n        if (data[data.length-1] == '%') {\r\n            multiplier *= 1 + (+data.substring(0, data.length - 1)/100)\r\n        }\r\n    }\r\n    return multiplier;\r\n}\r\n\r\nfunction allocate(totalNum,priorities,ratios,args) {\r\n    args = args || {};\r\n    let allocationList = [];\r\n    let curNum = [];\r\n    let totalAllocated = 0;\r\n    for (let i = 0;i < priorities.length;i++) {curNum.push(0);}\r\n    for (let i = 0;i < totalNum;i++) {\r\n        let total = i+1;\r\n        let error = null;\r\n        let choice = null;\r\n        for (let j = 0;j < priorities.length;j++) {\r\n            // Ignoring zero priority zero ratio choices\r\n            if (priorities[j] == 0 || ratios[j] == 0) {continue;}\r\n\r\n            // Checking maxes\r\n            if (args.hasOwnProperty('max') && args.max[j] != -1 && curNum[j] >= args.max[j]) {continue;}\r\n\r\n            // Checking requirement function\r\n            if (args.hasOwnProperty('requireFunc') && !args.requireFunc(j, curNum[j])) {continue;}\r\n\r\n            // Checking mins\r\n            if (args.hasOwnProperty('min') && curNum[j] < args.min[j]) {\r\n                choice = j;\r\n                break;\r\n            }\r\n\r\n            // Finding error differential\r\n            let tempError = (((curNum[j]+1) / total) - ratios[j]) ** 2;\r\n            if (total != 1) {tempError -= ((curNum[j] / (total-1)) - ratios[j]) ** 2;}\r\n\r\n            if (error === null || tempError < error) {\r\n                error = tempError;\r\n                choice = j;\r\n            }\r\n        }\r\n        if (choice === null) {\r\n            break;\r\n        }\r\n        allocationList[i] = choice;\r\n        curNum[choice] += 1;\r\n        totalAllocated += 1;\r\n        if (args.hasOwnProperty('allocFunc')) {\r\n            args.allocFunc(choice, curNum[choice]);\r\n        }\r\n    }\r\n    return {seq:allocationList,alloc:curNum,total:totalAllocated};\r\n}\r\n\r\nfunction messageQueue(msg,color){\r\n    color = color || 'warning';\r\n    var new_message = $('<p class=\"has-text-'+color+'\">'+msg+'</p>');\r\n    $('#autolog').prepend(new_message);\r\n    if ($('#autolog').children().length > 30){\r\n        $('#autolog').children().last().remove();\r\n    }\r\n}\r\n\r\nfunction getTotalGameDays() {\r\n    try {\r\n    let str = $('#statsPanel')[0].children[$('#statsPanel')[0].children.length-1].innerText;\r\n    let reg = /Game Days Played: ([\\d]+)/.exec(str);\r\n    return parseInt(reg[1]);\r\n    } catch(e) {\r\n        console.log('Error in getting total game days');\r\n        return null;\r\n    }\r\n}\r\nfunction getYear() {\r\n    try {\r\n        return parseInt($('.year > .has-text-warning')[0].innerText);\r\n    } catch(e) {\r\n        console.log('Error in getting current year');\r\n        return null;\r\n    }\r\n}\r\nfunction getDay() {\r\n    try {\r\n        return parseInt($('.day > .has-text-warning')[0].innerText);\r\n    } catch(e) {\r\n        console.log('Error: Day');\r\n        return null;\r\n    }\r\n}\r\nfunction getLunarPhase() {\r\n    let moon = document.querySelector('.calendar > .is-primary');\r\n    if (moon !== null) {\r\n        return moon.attributes['data-label'].value;\r\n    } else {\r\n        console.log(\"Error: Lunar Phase\");\r\n        return \"\";\r\n    }\r\n}\r\nfunction getRace() {\r\n    try {\r\n        return $('#race > .column > span')[0].innerText;\r\n    } catch(e) {\r\n        console.log('Error in getting current race');\r\n        return null;\r\n    }\r\n}\r\n\r\n// Forces keyup event for all the multiplier keys\r\nfunction disableMult() {\r\n    var evt = new KeyboardEvent('keyup', {'ctrlKey':false, 'shiftKey':false, 'altKey':false});\r\n    document.dispatchEvent (evt);\r\n}\r\n// Finds total key multiplier from keyEvent\r\nfunction keyMult(e) {\r\n    let mult = 1;\r\n    mult *= (e.ctrlKey) ? 10 : 1;\r\n    mult *= (e.shiftKey) ? 25 : 1;\r\n    mult *= (e.altKey) ? 100 : 1;\r\n    return mult;\r\n}\r\n\r\n// Convert from abbreviated value to actual number\r\nfunction getRealValue(num){\r\n    var suffix = {\r\n        K:1000,\r\n        M:1000000\r\n    }\r\n    var currSuff = /([-]?)([\\.0-9]+)([^\\d\\.])/.exec(num);\r\n    if(currSuff !== null && currSuff.length == 4){\r\n        var sign = (currSuff[1] == \"-\") ? -1 : 1;\r\n        var n = parseFloat(currSuff[2]);\r\n        var suff = currSuff[3];\r\n        if (suffix[suff] !== null) {n *= suffix[suff];}\r\n        n *= sign;\r\n        return n;\r\n    }\r\n    return parseFloat(num);\r\n}\r\n// Determines if the research given has already been researched\r\nfunction researched(id) {\r\n    return researches[id].researched;\r\n}\r\n// Determines if stage is currently in evolution\r\nfunction inEvolution() {\r\n    return window.evolve.global.race.species == 'protoplasm';\r\n}\r\n// Determines if the civics tab has been unlocked\r\nfunction civicsOn() {\r\n    let civicsTabLabel = getTabLabel(\"Civics\");\r\n    if (civicsTabLabel === null) {return false;}\r\n    return civicsTabLabel.style.display != 'none';\r\n}\r\n// Finding tab-items\r\nfunction getTab(name) {\r\n    let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');\r\n    for (let i = 0;i < nav.length;i++) {\r\n        if (nav[i].innerText.trim() == name) {\r\n            let nth=i+1\r\n            nav = null;\r\n            return document.querySelector('#mainColumn > .content > .b-tabs > .tab-content > div:nth-child('+nth+')')\r\n        }\r\n    }\r\n    nav = null;\r\n    return null;\r\n}\r\nfunction getTabLabel(name) {\r\n    let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');\r\n    for (let i = 0;i < nav.length;i++) {\r\n        if (nav[i].innerText.trim() == name) {\r\n            let nth=i+1\r\n            return document.querySelector('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+nth+')')\r\n        }\r\n    }\r\n    return null;\r\n}\r\n\r\n// Determines if a perk has been unlocked\r\nfunction perkUnlocked(perk) {\r\n    let pat = \"\";\r\n    switch(perk) {\r\n        case 'Morphogenesis':\r\n            pat = /Evolution costs decreased/;\r\n            break;\r\n        default:\r\n            return false;\r\n    }\r\n    let divList = $('#perksPanel > div');\r\n    for (let i = 0;i < divList.length;i++) {\r\n        if (pat.exec(divList[i].innerText) !== null) {\r\n            return true;\r\n        }\r\n    }\r\n    return false;\r\n}\r\n// Determines if an achievement has been unlocked\r\n// Returns the achievement level (1-5) if unlocked\r\n// Returns -1 if not unlocked\r\nfunction achievementUnlocked(achievement) {\r\n    let divList = $('.achievement');\r\n    for (let i = 0;i < divList.length;i++) {\r\n        if (divList[i].children[0].innerText == achievement) {\r\n            return $('.achievement')[0].children[2].children[0].attributes.class.value[4];\r\n        }\r\n    }\r\n    return -1;\r\n}\r\n\r\nfunction getMinMoney() {\r\n    if (settings.minimumMoney < 1) {\r\n        return settings.minimumMoney * resources.Money.storage;\r\n    } else {\r\n        return settings.minimumMoney;\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/utility.js?");

/***/ })

/******/ });