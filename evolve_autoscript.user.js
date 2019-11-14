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
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./evolution.js":
/*!**********************!*\
  !*** ./evolution.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return loadEvolution; });\n// Auto Evolution\r\n\r\nconst evoFarmActions = [\"evo-rna\", \"evo-dna\"];\r\nconst evoRaceActions = [\r\n\t\"evo-phagocytosis\", \"evo-chitin\", \"evo-chloroplasts\",\r\n\t\"evo-eggshell\", \"evo-mammals\", \"evo-athropods\",\r\n\t\"evo-ectothermic\", \"evo-endothermic\",\r\n\t\"evo-humanoid\", \"evo-gigantism\", \"evo-animalism\", \"evo-dwarfism\",\r\n\t\"evo-aquatic\", \"evo-demonic\",\r\n\t\"evo-entish\", \"evo-cacti\",\r\n\t\"evo-sporgar\", \"evo-shroomi\",\r\n\t\"evo-arraak\", \"evo-pterodacti\", \"evo-dracnid\",\r\n\t\"evo-tortoisan\", \"evo-gecko\", \"evo-slitheryn\",\r\n\t\"evo-human\", \"evo-elven\", \"evo-orc\",\r\n\t\"evo-orge\", \"evo-cyclops\", \"evo-troll\",\r\n\t\"evo-kobold\", \"evo-goblin\", \"evo-gnome\",\r\n\t\"evo-cath\", \"evo-wolven\", \"evo-centaur\",\r\n\t\"evo-mantis\", \"evo-scorpid\", \"evo-antid\",\r\n\t\"evo-sharkin\", \"evo-octigoran\", \"evo-balorg\", \"evo-imp\",'evo-seraph','evo-unicorn'];\r\nconst evoChallengeActions = ['evo-plasmid', 'evo-mastery', 'evo-trade', 'evo-craft', 'evo-crispr', 'evo-junker', 'evo-joyless', 'evo-decay'];\r\nconst evoHardChallengeActions = ['evo-junker', 'evo-joyless', 'evo-decay'];\r\nconst evoUniverses = ['uni-standard','uni-heavy','uni-antimatter','uni-evil','uni-micro'];\r\nconst evoRaceTrees = {\r\n    \"entish\":[\"evo-chloroplasts\", \"evo-entish\"],\r\n    \"cacti\":[\"evo-chloroplasts\", \"evo-cacti\"],\r\n    \"sporgar\":[\"evo-chitin\", \"evo-sporgar\"],\r\n    \"shroomi\":[\"evo-chitin\", \"evo-shroomi\"],\r\n    \"arraak\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-endothermic\", \"evo-arraak\"],\r\n    \"pterodacti\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-endothermic\", \"evo-pterodacti\"],\r\n    \"dracnid\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-endothermic\", \"evo-dracnid\"],\r\n    \"tortoisan\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-ectothermic\", \"evo-tortoisan\"],\r\n    \"gecko\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-ectothermic\", \"evo-gecko\"],\r\n    \"slitheryn\":[\"evo-phagocytosis\", \"evo-eggshell\", \"evo-ectothermic\", \"evo-slitheryn\"],\r\n    \"human\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-humanoid\", \"evo-human\"],\r\n    \"elven\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-humanoid\", \"evo-elven\"],\r\n    \"orc\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-humanoid\", \"evo-orc\"],\r\n    \"orge\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-gigantism\", \"evo-orge\"],\r\n    \"cyclops\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-gigantism\", \"evo-cyclops\"],\r\n    \"troll\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-gigantism\", \"evo-troll\"],\r\n    \"kobold\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-dwarfism\", \"evo-kobold\"],\r\n    \"goblin\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-dwarfism\", \"evo-goblin\"],\r\n    \"gnome\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-dwarfism\", \"evo-gnome\"],\r\n    \"cath\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-animalism\", \"evo-cath\"],\r\n    \"wolven\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-animalism\", \"evo-wolven\"],\r\n    \"centaur\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-animalism\", \"evo-centaur\"],\r\n    \"mantis\":[\"evo-phagocytosis\", \"evo-athropods\", \"evo-mantis\"],\r\n    \"scorpid\":[\"evo-phagocytosis\", \"evo-athropods\", \"evo-scorpid\"],\r\n    \"antid\":[\"evo-phagocytosis\", \"evo-athropods\", \"evo-antid\"],\r\n    \"sharkin\":[\"evo-phagocytosis\", \"evo-aquatic\", \"evo-sharkin\"],\r\n    \"octigoran\":[\"evo-phagocytosis\", \"evo-aquatic\", \"evo-octigoran\"],\r\n    \"octigoran\":[\"evo-phagocytosis\", \"evo-aquatic\", \"evo-octigoran\"],\r\n    \"balorg\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-demonic\", \"evo-balorg\"],\r\n    \"imp\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-demonic\", \"evo-imp\"],\r\n    \"seraph\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-angelic\", \"evo-seraph\"],\r\n    \"unicorn\":[\"evo-phagocytosis\", \"evo-mammals\", \"evo-angelic\", \"evo-unicorn\"],\r\n};\r\nvar maxEvo = {}\r\nfunction loadEvolution() {\r\n    // Loading all maximum values for evolution upgrades\r\n    maxEvo = {};\r\n    // Need these to unlock next upgrades\r\n    maxEvo['evo-organelles'] = 2;\r\n    maxEvo['evo-nucleus'] = 1;\r\n    // Determining how much storage is necessary\r\n    let needed = 320\r\n    if (perkUnlocked('Morphogenesis')) {\r\n        needed *= 0.8;\r\n    }\r\n    let baseStorage = 100;\r\n    // Adding to baseStorage if Creator is unlocked\r\n    if (achievementUnlocked('Creator') != -1) {\r\n        baseStorage += (achievementUnlocked('Creator')-1)*50;\r\n    }\r\n    // Finding most optimal maxes to reach sentience\r\n    let total = 1000;\r\n    for (let i = 0;i < 10;i++) {\r\n        let numEuk = i;\r\n        let numMit = Math.ceil((((needed-baseStorage) / numEuk) - 10)/10)\r\n        if ((numEuk + numMit) <= total) {\r\n            maxEvo['evo-eukaryotic_cell'] = numEuk;\r\n            maxEvo['evo-mitochondria'] = numMit;\r\n            total = numEuk + numMit\r\n        }\r\n    }\r\n    maxEvo['evo-membrane'] = Math.ceil((needed-baseStorage) / (5 * maxEvo['evo-mitochondria'] + 5))\r\n    // Setting minimum to 1 for unlocking next upgrades\r\n    maxEvo['evo-membrane'] = (maxEvo['evo-membrane'] <= 0) ? 1 : maxEvo['evo-membrane'];\r\n    maxEvo['evo-eukaryotic_cell'] = (maxEvo['evo-eukaryotic_cell'] <= 0) ? 1 : maxEvo['evo-eukaryotic_cell'];\r\n    maxEvo['evo-mitochondria'] = (maxEvo['evo-mitochondria'] <= 0) ? 1 : maxEvo['evo-mitochondria'];\r\n}\n\n//# sourceURL=webpack:///./evolution.js?");

/***/ }),

/***/ "./gameScripts.js":
/*!************************!*\
  !*** ./gameScripts.js ***!
  \************************/
/*! exports provided: f_rate, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"f_rate\", function() { return f_rate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return zigguratBonus; });\n// These variables and functions were stolen from the original game scripts\r\n// If any of these change with game updates, they need to be updated here as well\r\n\r\n// From actions.js\r\n// Determines the factory output\r\nconst f_rate = {\r\n    Lux: {\r\n        demand: [0.14,0.21,0.28,0.35],\r\n        fur: [2,3,4,5]\r\n    },\r\n    Alloy: {\r\n        copper: [0.75,1.12,1.49,1.86],\r\n        aluminium: [1,1.5,2,2.5],\r\n        output: [0.075,0.112,0.149,0.186]\r\n    },\r\n    Polymer: {\r\n        oil_kk: [0.22,0.33,0.44,0.55],\r\n        oil: [0.18,0.27,0.36,0.45],\r\n        lumber: [15,22,29,36],\r\n        output: [0.125,0.187,0.249,0.311],\r\n    },\r\n    Nano_Tube: {\r\n        coal: [8,12,16,20],\r\n        neutronium: [0.05,0.075,0.1,0.125],\r\n        output: [0.2,0.3,0.4,0.5],\r\n    },\r\n    Stanene: {\r\n        aluminium: [30,45,60,75],\r\n        nano: [0.02,0.03,0.04,0.05],\r\n        output: [0.6,0.9,1.2,1.5],\r\n    }\r\n};\r\n\r\n// From space.js\r\n// Determines the mining droid output bonus\r\nfunction zigguratBonus(){\r\n    let bonus = 1;\r\n    if (window.evolve.global.space['ziggurat'] && window.evolve.global.space['ziggurat'].count > 0){\r\n        let study = window.evolve.global.tech['ancient_study'] ? 0.006 : 0.004;\r\n        bonus += (window.evolve.global.space.ziggurat.count * window.evolve.global.civic.colonist.workers * study);\r\n    }\r\n    return bonus;\r\n}\n\n//# sourceURL=webpack:///./gameScripts.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility.js */ \"./utility.js\");\n/* harmony import */ var _gameScripts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameScripts.js */ \"./gameScripts.js\");\n/* harmony import */ var _evolution_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./evolution.js */ \"./evolution.js\");\n\r\n\r\n\r\n\r\n\r\n(async function() {\r\n    console.log(\"Waiting for game to load...\");\r\n    await Object(_utility_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(2000);\r\n    main();\r\n})();\r\n\r\nasync function main() {\r\n\r\n    window.evolve = unsafeWindow.evolve;\r\n    console.log(window.evolve);\r\n    'use strict';\r\n    var settings = {};\r\n    var jsonSettings = localStorage.getItem('settings');\r\n    if(jsonSettings != null){settings = JSON.parse(jsonSettings);}\r\n\r\n    var url = 'https://github.com/HLXII/Evolve-Autoscript';\r\n    var version = '1.2.12';\r\n\r\n    // Used to ensure no modal window conflicts\r\n    var modal = false;\r\n\r\n}\n\n//# sourceURL=webpack:///./main.js?");

/***/ }),

/***/ "./utility.js":
/*!********************!*\
  !*** ./utility.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return sleep; });\n// Stores generic utility functions\r\n\r\n\r\nfunction sleep(ms) {\r\n  return new Promise(resolve => setTimeout(resolve, ms));\r\n}\r\n\n\n//# sourceURL=webpack:///./utility.js?");

/***/ })

/******/ });