// ==UserScript==
// @name         Evolve_HLXII
// @namespace    http://tampermonkey.net/
// @version      1.1.18
// @description  try to take over the world!
// @author       Fafnir
// @author       HLXII
// @match        https://pmotschmann.github.io/Evolve/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/pieroxy/lz-string/master/libs/lz-string.min.js
// ==/UserScript==


/*
 * Script entry point, sets up unsafewindow.game.global
 * Stolen from NotOats
 */
function userscriptEntryPoint() {
    console.log(unsafeWindow.game);
    main();
}

unsafeWindow.addEventListener('customModuleAdded', userscriptEntryPoint);

$(document).ready(function() {
    let injectScript = `
import { global, vues, breakdown } from './vars.js';
import { actions } from './actions.js';
import { races } from './races.js';
import {tradeRatio, craftCost } from './resources.js';
window.game =  {
    global: global,
    vues: vues,
    breakdown: breakdown,
    actions: actions,
    races: races,
    tradeRatio: tradeRatio,
    craftCost: craftCost,
};
window.dispatchEvent(new CustomEvent('customModuleAdded'));
`;

    $('<script>')
    .attr('type', 'module')
    .text(injectScript)
    .appendTo('head');
});

function main() {
    window.game = unsafeWindow.game;
    'use strict';
    var settings = {};
    var jsonSettings = localStorage.getItem('settings');
    if(jsonSettings != null){settings = JSON.parse(jsonSettings);}

    /***
    *
    * Setup resources informations and settings
    *
    ***/

    // Used to ensure no modal window conflicts
    let modal = false;

    let evoFarmActions = ["evo-rna", "evo-dna"];
    let evoRaceActions = ["evo-phagocytosis", "evo-chitin", "evo-chloroplasts",
                          "evo-eggshell", "evo-mammals", "evo-athropods",
                          "evo-ectothermic", "evo-endothermic",
                          "evo-humanoid", "evo-gigantism", "evo-animalism", "evo-dwarfism",
                          "evo-aquatic", "evo-demonic",
                          "evo-entish", "evo-cacti",
                          "evo-sporgar", "evo-shroomi",
                          "evo-arraak", "evo-pterodacti", "evo-dracnid",
                          "evo-tortoisan", "evo-gecko", "evo-slitheryn",
                          "evo-human", "evo-elven", "evo-orc",
                          "evo-orge", "evo-cyclops", "evo-troll",
                          "evo-kobold", "evo-goblin", "evo-gnome",
                          "evo-cath", "evo-wolven", "evo-centuar",
                          "evo-mantis", "evo-scorpid", "evo-antid",
                          "evo-sharkin", "evo-octigoran", "evo-balorg", "evo-imp"];
    let evoRaceTrees = {
        "entish":["evo-chloroplasts", "evo-entish"],
        "cacti":["evo-chloroplasts", "evo-cacti"],
        "sporgar":["evo-chitin", "evo-sporgar"],
        "shroomi":["evo-chitin", "evo-shroomi"],
        "arraak":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-arraak"],
        "pterodacti":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-pterodacti"],
        "dracnid":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-dracnid"],
        "tortoisan":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-tortoisan"],
        "gecko":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-gecko"],
        "slitheryn":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-slitheryn"],
        "human":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-human"],
        "elven":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-elven"],
        "orc":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-orc"],
        "orge":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-orge"],
        "cyclops":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-cyclops"],
        "troll":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-troll"],
        "kobold":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-kobold"],
        "goblin":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-goblin"],
        "gnome":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-gnome"],
        "cath":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-cath"],
        "wolven":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-wolven"],
        "centuar":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-centuar"],
        "mantis":["evo-phagocytosis", "evo-athropods", "evo-mantis"],
        "scorpid":["evo-phagocytosis", "evo-athropods", "evo-scorpid"],
        "antid":["evo-phagocytosis", "evo-athropods", "evo-antid"],
        "sharkin":["evo-phagocytosis", "evo-aquatic", "evo-sharkin"],
        "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
        "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
        "balorg":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-balorg"],
        "imp":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-imp"]
    };
    let maxEvo = {}
    function loadEvolution() {
        // Loading all maximum values for evolution upgrades
        maxEvo = {};
        // Need these to unlock next upgrades
        maxEvo['evo-organelles'] = 2;
        maxEvo['evo-nucleus'] = 1;
        // Determining how much storage is necessary
        let needed = 320
        if (perkUnlocked('Morphogenesis')) {
            needed *= 0.8;
        }
        let baseStorage = 100;
        // Adding to baseStorage if Creator is unlocked
        if (achievementUnlocked('Creator') != -1) {
            baseStorage += (achievementUnlocked('Creator')-1)*50;
        }
        // Finding most optimal maxes to reach sentience
        let total = 1000;
        for (let i = 0;i < 10;i++) {
            let numEuk = i;
            let numMit = Math.ceil((((needed-baseStorage) / numEuk) - 10)/10)
            if ((numEuk + numMit) <= total) {
                maxEvo['evo-eukaryotic_cell'] = numEuk;
                maxEvo['evo-mitochondria'] = numMit;
                total = numEuk + numMit
            }
        }
        maxEvo['evo-membrane'] = Math.ceil((needed-baseStorage) / (5 * maxEvo['evo-mitochondria'] + 5))
        // Setting minimum to 1 for unlocking next upgrades
        maxEvo['evo-membrane'] = (maxEvo['evo-membrane'] <= 0) ? 1 : maxEvo['evo-membrane'];
        maxEvo['evo-eukaryotic_cell'] = (maxEvo['evo-eukaryotic_cell'] <= 0) ? 1 : maxEvo['evo-eukaryotic_cell'];
        maxEvo['evo-mitochondria'] = (maxEvo['evo-mitochondria'] <= 0) ? 1 : maxEvo['evo-mitochondria'];
    }

    class Resource {
        constructor(id) {
            this.id = id;
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('basePriority')) {settings.resources[this.id].basePriority = 0;}
            if (!settings.resources[this.id].hasOwnProperty('storePriority')) {settings.resources[this.id].storePriority = 0;}
            if (!settings.resources[this.id].hasOwnProperty('storeMin')) {settings.resources[this.id].storeMin = 0;}
        }

        get mainDiv() {
            return document.getElementById('res'+this.id);
        }
        get cntLabel() {
            return document.getElementById('cnt'+this.id);
        }
        get rateLabel() {
            return document.getElementById('inc'+this.id);
        }

        get name() {
            return window.game.global.resource[this.id].name;
        }

        get unlocked() {
            return window.game.global.resource[this.id].display;
        }

        get amount() {
            return window.game.global.resource[this.id].amount;
        }
        get storage() {
            return window.game.global.resource[this.id].max;
        }
        get ratio() {
            return this.amount / this.storage;
        }
        get rate() {
            return window.game.global.resource[this.id].diff;
        }

        get storePriority() {return settings.resources[this.id].storePriority};
        set storePriority(storePriority) {settings.resources[this.id].storePriority = storePriority;}
        get storeMin() {return settings.resources[this.id].storeMin;}
        set storeMin(storeMin) {settings.resources[this.id].storeMin = storeMin;}

        get crateIncBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 0) {
                return storageDiv[0].children[3]
            } else {
                return null;
            }
        }
        get crateDecBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 0) {
                return storageDiv[0].children[1]
            } else {
                return null;
            }
        }
        get containerIncBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 1) {
                return storageDiv[1].children[3]
            } else {
                return null;
            }
        }
        get containerDecBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 1) {
                return storageDiv[1].children[1]
            } else {
                return null;
            }
        }
        get crateNum() {
            return window.game.global.resource[this.id].crates;
        }
        get containerNum() {
            return window.game.global.resource[this.id].containers;
        }
        get crateable() {
            return window.game.global.resource[this.id].stackable;
        }
        crateInc(num) {
            let crateIncBtn = this.crateIncBtn;
            if (crateIncBtn !== null) {
                for (let i = 0;i < num;i++) {
                    crateIncBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        crateDec(num) {
            let crateDecBtn = this.crateDecBtn;
            if (crateDecBtn !== null) {
                for (let i = 0;i < num;i++) {
                    crateDecBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        containerInc(num) {
            let containerIncBtn = this.containerIncBtn;
            if (containerIncBtn !== null) {
                for (let i = 0;i < num;i++) {
                    containerIncBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        containerDec(num) {
            let containerDecBtn = this.containerDecBtn;
            if (containerDecBtn !== null) {
                for (let i = 0;i < num;i++) {
                    containerDecBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }

        decStorePriority() {
            if (this.storePriority == 0) {return;}
            this.storePriority -= 1;
            updateSettings();
            console.log("Decrementing Store Priority", this.id, this.storePriority);
        }
        incStorePriority() {
            this.storePriority += 1;
            updateSettings();
            console.log("Incrementing Store Priority", this.id, this.storePriority);
        }
        decStoreMin() {
            if (this.storeMin == 0) {return;}
            this.storeMin -= 1;
            updateSettings();
            console.log("Decrementing Store Minimum", this.id, this.storeMin);
        }
        incStoreMin() {
            this.storeMin += 1;
            updateSettings();
            console.log("Incrementing Store Minimum", this.id, this.storeMin);
        }

        get basePriority() {return settings.resources[this.id].basePriority;}
        set basePriority(basePriority) {settings.resources[this.id].basePriority = basePriority;}
        get priority() {return settings.resources[this.id].basePriority;}

        decBasePriority() {
            if (this.basePriority == 0) {return;}
            this.basePriority -= 1;
            updateSettings();
            console.log("Decrementing Base Priority", this.id, this.basePriority);
        }
        incBasePriority() {
            this.basePriority += 1;
            updateSettings();
            console.log("Incrementing Base Priority", this.id, this.basePriority);
        }
    }
    class TradeableResource extends Resource {
        constructor(id) {
            super(id);
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('autoSell')) {settings.resources[this.id].autoSell = false;}
            if (!settings.resources[this.id].hasOwnProperty('autoBuy')) {settings.resources[this.id].autoBuy = false;}
            if (!settings.resources[this.id].hasOwnProperty('buyRatio')) {settings.resources[this.id].buyRatio = 0.5;}
            if (!settings.resources[this.id].hasOwnProperty('sellRatio')) {settings.resources[this.id].sellRatio = 0.9;}
        }

        get autoSell() {return settings.resources[this.id].autoSell};
        set autoSell(autoSell) {settings.resources[this.id].autoSell = autoSell;}
        get autoBuy() {return settings.resources[this.id].autoBuy};
        set autoBuy(autoBuy) {settings.resources[this.id].autoBuy = autoBuy;}
        get buyRatio() {return settings.resources[this.id].buyRatio};
        set buyRatio(buyRatio) {settings.resources[this.id].buyRatio = buyRatio;}
        get sellRatio() {return settings.resources[this.id].sellRatio};
        set sellRatio(sellRatio) {settings.resources[this.id].sellRatio = sellRatio;}

        buyDec() {
            if (this.buyRatio > 0) {
                this.buyRatio = parseFloat(Number(this.buyRatio - 0.1).toFixed(1));
                updateSettings();
                console.log(this.id, "Decrementing Buy Ratio", this.buyRatio);
            }
        }
        buyInc() {
            if (this.buyRatio < 1) {
                this.buyRatio = parseFloat(Number(this.buyRatio + 0.1).toFixed(1));
                updateSettings();
                console.log(this.id, "Incrementing Buy Ratio", this.buyRatio);
            }
        }
        sellDec() {
            if (this.sellRatio > 0) {
                this.sellRatio = parseFloat(Number(this.sellRatio - 0.1).toFixed(1));
                updateSettings();
                console.log(this.id, "Decrementing Sell Ratio", this.sellRatio);
            }
        }
        sellInc() {
            if (this.sellRatio < 1) {
                this.sellRatio = parseFloat(Number(this.sellRatio + 0.1).toFixed(1));
                console.log(this.id, "Incrementing Sell Ratio", this.sellRatio);
            }
        }

        get tradeDecSpan() {
            let nodes = document.querySelectorAll('#market-'+this.id+' > .trade > .is-primary');
            if (nodes.length == 0) {
                console.log("Error:", this.id, "Trade Dec Span");
                return null;
            } else {
                return nodes[0];
            }
        }
        get tradeIncSpan() {
            let nodes = document.querySelectorAll('#market-'+this.id+' > .trade > .is-primary');
            if (nodes.length != 2) {
                console.log("Error:", this.id, "Trade Inc Span");
                return null;
            } else {
                return nodes[1];
            }
        }
        get tradeDecBtn() {
            return document.querySelector('#market-'+this.id+' > .trade > .is-primary > .add');
        }
        get tradeIncBtn() {
            return document.querySelector('#market-'+this.id+' > .trade > .is-primary > .sub');
        }
        get tradeLabel() {
            return document.querySelector('#market-'+this.id+' > .trade > .current');
        }
        get sellBtn() {
            let sellBtn = document.querySelectorAll('#market-'+this.id+' > .order');
            if (sellBtn !== null && sellBtn.length >= 2) {
                return sellBtn[1];
            } else {
                return null;
            }
        }
        get buyBtn() {
            let buyBtn = document.querySelectorAll('#market-'+this.id+' > .order');
            if (buyBtn !== null && buyBtn.length >= 1) {
                return buyBtn[0];
            } else {
                return null;
            }
        }

        tradeDec() {
            if (this.tradeDecBtn !== null) {
                this.tradeDecBtn.click();
                return true;
            } else {
                console.log("Error:", this.id, "Trade Decrement");
                return false;
            }
        }
        tradeInc() {
            if (this.tradeIncBtn !== null) {
                this.tradeIncBtn.click();
                return true;
            } else {
                console.log("Error:", this.id, "Trade Increment");
                return false;
            }
        }

        get tradeNum() {
            return window.game.global.resource[this.id].trade;
        }
        get tradeBuyCost() {
            if (this.tradeDecSpan !== null) {
                let dataStr = this.tradeDecSpan.attributes['data-label'].value;
                var reg = /Auto-buy\s([\d\.]+)[\w\s]*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[2]);
            } else {
                console.log("Error:", this.id, "Trade Buy Cost");
                return -1;
            }
        }
        get tradeSellCost() {
            if (this.tradeIncSpan !== null) {
                let dataStr = this.tradeIncSpan.attributes['data-label'].value;
                var reg = /Auto-sell\s([\d\.]+)[\w\s]*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[2]);
            } else {
                console.log("Error:", this.id, "Trade Sell Cost");
                return -1;
            }
        }
        get tradeAmount() {
            return window.game.tradeRatio[this.id];
        }
    }
    var resources = [];
    function loadResources() {
        if (!settings.hasOwnProperty('resources')) {settings.resources = {};}
        Object.keys(window.game.global.resource).forEach(function(res) {
            // Craftable Resources
            if (window.game.craftCost[res] !== undefined) {
                //console.log("Craftable Resource:", res);
                resources[res] = new CraftableResource(res);
            }
            // Tradeable Resources
            else if (window.game.global.resource[res].trade !== undefined) {
                //console.log("Tradeable Resource:", res);
                resources[res] = new TradeableResource(res);
            }
            // Normal Resources
            else {
                //console.log("Normal Resource:", res);
                resources[res] = new Resource(res);
            }
        });
    }
    class CraftableResource extends Resource {
        constructor(id) {
            super(id);
            this.sources = window.game.craftCost[id];
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('enabled')) {settings.resources[this.id].enabled = false;}
        }

        get enabled() {return settings.resources[this.id].enabled;}
        set enabled(enabled) {settings.resources[this.id].enabled = enabled;}

        get craftBtn() {
            return document.getElementById("inc" + this.id + "5")
        }

        get canCraft() {
            // Crafting if resource is unlocked and enabled
            if (this.unlocked && this.enabled) {
                // Checking if every source can be used
                //console.log("Checking crafting of", this);
                if (this.sources.every(function(element) {
                    //console.log("Checking Resource", element.res, element.res.ratio);
                    return resources[element.r].ratio > 0.9;
                })) {
                    //console.log("Can Craft", this.name);
                    // Determining number of crafts
                    let total_crafts = 100000000000;
                    for (let i = 0;i < this.sources.length;i++) {
                        let res = resources[this.sources[i].r];
                        let cost = this.sources[i].a * 5;
                        let cur_crafts = Math.round((res.amount - (res.storage * .9)) / cost);
                        //console.log("Checking", res.name, "A/S", res.amount, res.storage, cur_crafts);
                        if (cur_crafts < total_crafts) {
                            total_crafts = cur_crafts;
                        }
                    }
                    return total_crafts;
                }
            }
            return 0;
        }

        craft(num) {
            if (!this.unlocked || !this.enabled) {return false;}
            if (this.craftBtn === null) {return false;}
            let btn = this.craftBtn.children[0];
            for (let j = 0;j < this.canCraft;j++) {
                btn.click();
                return true;
            }
            return false;
        }
    }

    function getMultiplier(res) {
        let multiplier = 1;
        for (let val in window.game.breakdown.p[res]) {
            let data = window.game.breakdown.p[res][val];
            if (data[data.length-1] == '%') {
                multiplier *= 1 + (+data.substring(0, data.length - 1)/100)
            }
        }
        return multiplier;
    }

    function priorityScale(value, priority, action) {
        let scale = Math.exp(-0.25 * priority);
        if (action !== null && action !== undefined) {
            if (action instanceof Research) {
                scale /= 50;
            }
            if (action instanceof Building && action.softCap >= 0) {
                let softCap = 1 + Math.exp(0.75 * (action.numTotal - action.softCap));
                scale *= softCap;
            }
        }
        return value * scale;
    }
    class Action {
        constructor(id, loc) {
            this.id = id;
            this.loc = loc;
            if (!settings.actions.hasOwnProperty(this.id)) {settings.actions[this.id] = {};}
            if (!settings.actions[this.id].hasOwnProperty('basePriority')) {settings.actions[this.id].basePriority = 0;}
            if (!settings.actions[this.id].hasOwnProperty('enabled')) {settings.actions[this.id].enabled = false;}
        }

        get enabled() {return settings.actions[this.id].enabled;}
        set enabled(enabled) {settings.actions[this.id].enabled = enabled;}
        get basePriority() {return settings.actions[this.id].basePriority;}
        set basePriority(basePriority) {settings.actions[this.id].basePriority = basePriority;}
        decBasePriority() {
            this.basePriority -= 1;
            updateSettings();
            console.log("Decrementing Priority", this.id, this.basePriority);
        }
        incBasePriority() {
            this.basePriority += 1;
            updateSettings();
            console.log("Incrementing Priority", this.id, this.basePriority);
        }
        get priority() {return this.basePriority;}

        get label() {
            return document.querySelector('#'+this.id+' > a > .aTitle');
        }
        get btn() {
            return document.getElementById(this.id);
        }

        get unlocked() {
            return this.label !== null;
        }
        get name() {
            let title = this.def.title;
            if (typeof title != 'string') {
                return title();
            }
            return title;
        }

        get def() {
            let details = window.game.actions;
            for (let i = 0;i < this.loc.length;i++) {
                details = details[this.loc[i]];
            }
            // Because tech-exotic_lab has a different key than id
            if (this.id == 'tech-energy_lab') {
                return details['exotic_lab'];
            }
            // Because city-basic_housing has a different key than id
            if (this.id == 'city-house') {
                return details['basic_housing'];
            }
            // Because tech-fort has a different key than id
            if (this.id == 'tech-fort') {
                return details['fortifications'];
            }
            return details[this.id.split('-')[1]];
        }

        get data() {
            let [type, action] = this.id.split('-');
            if (window.game.global[type] === undefined || window.game.global[type][action] == undefined) {
                return null;
            }
            return window.game.global[type][action];
        }

        getResDep(resid) {
            if (this.def.cost[resid] !== undefined) {
                return this.def.cost[resid]();
            }
            return null;
        }

        click() {
            if (this.btn !== null) {
                if (this.btn.className.indexOf('cna') < 0) {
                    this.btn.getElementsByTagName("a")[0].click();
                    if (this.onBuy !== undefined) {
                        this.onBuy();
                    }
                    return true;
                }
                return false;
            } else {
                return false;
            }
        }
    }
    class Building extends Action {
        constructor(id, loc) {
            super(id, loc);
            if (!settings.actions[this.id].hasOwnProperty('atLeast')) {settings.actions[this.id].atLeast = 0;}
            if (!settings.actions[this.id].hasOwnProperty('limit')) {settings.actions[this.id].limit = -1;}
            if (!settings.actions[this.id].hasOwnProperty('softCap')) {settings.actions[this.id].softCap = -1;}
        }

        get atLeast() {return settings.actions[this.id].atLeast;}
        set atLeast(atLeast) {settings.actions[this.id].atLeast = atLeast;}
        get limit() {return settings.actions[this.id].limit;}
        set limit(limit) {settings.actions[this.id].limit = limit;}
        get softCap() {return settings.actions[this.id].softCap;}
        set softCap(softCap) {settings.actions[this.id].softCap = softCap;}

        get priority() {
            // Setting priority to 100 if building hasn't reached the At Least value
            if (this.atLeast != 0 && this.numTotal < this.atLeast) {
                return 100;
            }
            return this.basePriority;
        }

        get numTotal() {
            if (this.data === null) {
                return 0;
            }
            return this.data.count;
        }

        decAtLeast() {
            if (this.atLeast == 0) {return;}
            this.atLeast -= 1;
            updateSettings();
            console.log("Decrementing At Least", this.id, this.atLeast);
        }
        incAtLeast() {
            this.atLeast += 1;
            updateSettings();
            console.log("Incrementing At Least", this.id, this.atLeast);
        }

        decLimit() {
            if (this.limit == -1) {return;}
            this.limit -= 1;
            updateSettings();
            console.log("Decrementing Limit", this.id, this.limit);
        }
        incLimit() {
            this.limit += 1;
            updateSettings();
            console.log("Incrementing Limit", this.id, this.limit);
        }

        decSoftCap() {
            if (this.softCap == -1) {return;}
            this.softCap -= 1;
            updateSettings();
            console.log("Decrementing SoftCap", this.id, this.softCap);
        }
        incSoftCap() {
            this.softCap += 1;
            updateSettings();
            console.log("Incrementing SoftCap", this.id, this.softCap);
        }

    }
    function checkPowerRequirements(c_action){
        var isMet = true;
        if (c_action['power_reqs']){
            Object.keys(c_action.power_reqs).forEach(function (req){
                if (window.game.global.tech[req] && window.game.global.tech[req] < c_action.power_reqs[req]){
                    isMet = false;
                }
            });
        }
        return isMet;
    }
    function getPowerData(id, def) {
        //console.log("Getting Power Data for", id);
        let produce = [];
        let consume = [];
        let effectStr = "";
        let test = null;
        // Finding Production
        switch(id) {
            case "city-apartment":
            case "city-sawmill":
            case "city-rock_quarry":
            case "city-cement_plant":
            case "city-factory":
            case "city-metal_refinery":
            case "city-mine":
            case "city-coal_mine":
            case "city-tourist_center":
            case "city-wardenclyffe":
            case "city-biolab":
            case "city-mass_driver":
            case "space-observatory":
            case "space-living_quarters":
            case "space-vr_center": //TODO I haven't seen this yet so idk
            case "space-red_mine":
            case "space-fabrication":
            case "space-red_factory":
            case "space-biodome":
            case "space-exotic_lab":
            case "space-space_barracks":
            case "space-elerium_contain":
            case "space-world_controller":
                break;
            case "city-windmill":
                produce = [{res:"electricity",cost:1}];
                break;
            case "city-casino":
                effectStr = def.effect();
                test = /generates\s\$([\d\.]+)/.exec(effectStr);
                if (test) {produce = [{res:"Money",cost:+test[1]}];}
                break;
            case "city-mill":
            case "city-coal_power":
            case "city-oil_power":
            case "city-fission_power":
            case "space-geothermal":
            case "space-e_reactor":
                produce = [{res:"electricity",cost:-def.powered()}];
                break;
            case "space-nav_beacon":
                produce = [{res:"moon_support",cost:1}];
                break;
            case "space-moon_base":
                produce = [{res:"moon_support",cost:3}];
                break;
            case "space-iridium_mine":
                effectStr = def.effect();
                test = /\+([\d\.]+) Iridium/.exec(effectStr);
                produce = [{res:"Iridium",cost:+test[1]}];
                break;
            case "space-helium_mine":
                effectStr = def.effect();
                test = /\+([\d\.]+) Helium/.exec(effectStr);
                produce = [{res:"Helium_3",cost:+test[1]}];
                break;
            case "space-spaceport":
                produce = [{res:"red_support",cost:3}];
                break;
            case "space-red_tower":
                produce = [{res:"red_support",cost:1}];
                break;
            case "space-swarm_control":
                produce = [{res:"swarm_support",cost:def.support}];
                break;
            case "space-swarm_satellite":
                produce = [{res:"electricity",cost:1}];
                break;
            case "space-gas_mining":
                effectStr = def.effect();
                test = /\+([\d\.]+) Helium/.exec(effectStr);
                produce = [{res:"Helium_3",cost:+test[1]}];
                break;
            case "space-outpost":
                effectStr = def.effect();
                test = /\+([\d\.]+) Neutronium/.exec(effectStr);
                produce = [{res:"Neutronium",cost:+test[1]}];
                break;
            case "space-oil_extractor":
                effectStr = def.effect();
                test = /\+([\d\.]+) Oil/.exec(effectStr);
                produce = [{res:"Oil",cost:+test[1]}];
                break;
            case "space-space_station":
                produce = [{res:"belt_support",cost:3}];
                break;
            case "space-elerium_ship":
                effectStr = def.effect();
                test = /\+([\d\.]+) Elerium/.exec(effectStr);
                produce = [{res:"Elerium",cost:+test[1]}];
                break;
            case "space-iridium_ship":
                effectStr = def.effect();
                test = /\+([\d\.]+) Iridium/.exec(effectStr);
                produce = [{res:"Iridium",cost:+test[1]}];
                break;
            case "space-iron_ship":
                effectStr = def.effect();
                test = /\+([\d\.]+) Iron/.exec(effectStr);
                produce = [{res:"Iron",cost:+test[1]}];
                break;
            case "interstellar-starport":
                produce = [{res:"alpha_support",cost:5}];
                break;
            default:
                break;
        }
        // Finding Consumption
        switch(id) {
            case "city-apartment":
            case "city-sawmill":
            case "city-rock_quarry":
            case "city-cement_plant":
            case "city-factory":
            case "city-metal_refinery":
            case "city-mine":
            case "city-coal_mine":
            case "city-casino":
            case "city-wardenclyffe":
            case "city-biolab":
            case "city-mass_driver":
            case "space-nav_beacon":
            case "space-red_tower":
            case "space-gas_mining":
            case "space-oil_extractor":
            case "space-elerium_contain":
            case "space-world_controller":
                consume = [{res:"electricity",cost:def.powered()}];
                break;
            case "space-iridium_mine":
            case "space-helium_mine":
            case "space-observatory":
                consume= [{res:"moon_support",cost:-def.support}];
                break;
            case "space-living_quarters":
            case "space-vr_center": //TODO I haven't seen this yet so idk
            case "space-red_mine":
            case "space-fabrication":
            case "space-biodome":
            case "space-exotic_lab":
                consume = [{res:"red_support",cost:-def.support}];
                break;
            case "space-red_factory":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume.push({res:"Helium_3",cost:+test[1]});
                break;
            case "space-space_barracks":
                effectStr = def.effect();
                test = /-([\d\.]+) Oil/.exec(effectStr);
                consume = [{res:"Oil",cost:+test[1]}];
                test = /-([\d\.]+) (Food|Souls)/.exec(effectStr);
                consume.push({res:"Food",cost:+test[1]});
                break;
            case "city-mill":
                consume = [{res:"Food",cost:0.1}];
                break;
            case "city-tourist_center":
                effectStr = def.effect();
                test = /-([\d\.]+) (Food|Souls)/.exec(effectStr);
                consume = [{res:"Food",cost:+test[1]}];
                break;
            case "city-coal_power":
                effectStr = def.effect();
                test = /-([\d\.]+) Coal/.exec(effectStr);
                consume = [{res:"Coal",cost:+test[1]}];
                break;
            case "city-oil_power":
                effectStr = def.effect();
                test = /-([\d\.]+) Oil/.exec(effectStr);
                consume = [{res:"Oil",cost:+test[1]}];
                break;
            case "city-fission_power":
                effectStr = def.effect();
                test = /-([\d\.]+) Uranium/.exec(effectStr);
                consume = [{res:"Uranium",cost:+test[1]}];
                break;
            case "space-geothermal":
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume = [{res:"Helium_3",cost:+test[1]}];
                break;
            case "space-e_reactor":
                effectStr = def.effect();
                test = /-([\d\.]+) Elerium/.exec(effectStr);
                consume = [{res:"Elerium",cost:+test[1]}];
                break;
            case "space-moon_base":
            case "space-outpost":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Oil/.exec(effectStr);
                consume.push({res:"Oil",cost:test[1]});
                break
            case "space-spaceport":
            case "space-space_station":
            case "interstellar-starport":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume.push({res:"Helium_3",cost:test[1]});
                test = /-([\d\.]+) (Food|Souls)/.exec(effectStr);
                consume.push({res:"Food",cost:test[1]});
                break
            case "space-swarm_control":
                break;
            case "space-swarm_satellite":
                consume = [{res:"swarm_support",cost:1}];
                break;
            case "space-elerium_ship":
            case "space-iridium_ship":
            case "space-iron_ship":
                consume = [{res:"belt_support",cost:-def.support}];
                break;
            case "interstellar-mining_droid":
            case "interstellar-laboratory":
                consume = [{res:"alpha_support",cost:-def.support}];
                break;
            default:
                break;
        }
        return [consume,produce];
    }
    class PoweredBuilding extends Building {
        constructor(id, loc) {
            super(id, loc);
            if (!settings.actions[this.id].hasOwnProperty('powerPriority')) {settings.actions[this.id].powerPriority = 0;}
            try {
            [this.consume,this.produce] = getPowerData(id, this.def);
            //console.log(this.consume, this.produce);
            } catch(e) {
                console.log("Error loading power for ",this.id);
            }
        }

        get powerPriority() {return settings.actions[this.id].powerPriority;}
        set powerPriority(powerPriority) {settings.actions[this.id].powerPriority = powerPriority;}

        get powerUnlocked() {
            return checkPowerRequirements(this.def);
        }

        get incBtn() {
            return document.querySelector('#'+this.id+' > .on');
        }
        get decBtn() {
            return document.querySelector('#'+this.id+' > .off');
        }

        get numOn() {
            if (this.data === null) {
                return 0;
            }
            return this.data.on;
        }

        incPower() {
            if (this.incBtn === null) {return false;}
            this.incBtn.click();
            return true;
        }
        decPower() {
            if (this.decBtn === null) {return false;}
            this.decBtn.click();
            return true;
        }

        decPowerPriority() {
            if (this.powerPriority == 0) {return;}
            this.powerPriority -= 1;
            updateSettings();
            console.log("Decrementing Power Priority", this.id, this.powerPriority);
        }
        incPowerPriority() {
            if (this.powerPriority == 99) {return;}
            this.powerPriority += 1;
            updateSettings();
            console.log("Incrementing Priority", this.id, this.powerPriority);
        }
    }
    class SpaceDockBuilding extends Building {
        constructor(id, loc) {
            super(id, loc);
        }

        get unlocked() {
            return this.data !== undefined;
        }

        get data() {
            let [type, action] = this.id.split('-');
            return window.game.global['starDock'][action];
        }

        click() {
            if (!this.unlocked) {return false;}
            // Checking if modal already open
            if ($('.modal').length != 0) {
                return;
            }
            // Ensuring no modal conflicts
            if (modal) {return;}
            modal = true;
            // Opening modal
            $('#space-star_dock > .special').click();
            // Delaying for modal animation
            let tempID = this.id;
            setTimeout(function() {
                // Getting info
                let build = buildings[tempID];
                // Buying
                if (build.btn !== null) {
                    build.btn.getElementsByTagName("a")[0].click();
                }
                // Closing modal
                let closeBtn = $('.modal-close')[0];
                if (closeBtn !== undefined) {closeBtn.click();}
                modal = false;
            }, 100);
        }
    }
    var buildings = {};
    function loadBuildings() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        // City
        for (var action in window.game.actions.city) {
            // Remove manual buttons
            if (action == 'food' || action == 'lumber' || action == 'stone' || action == 'slaughter') {continue;}
            if (action == 'basic_housing') {
                buildings['city-house'] = new Building('city-house', ['city']);
                continue;
            }
            if (window.game.actions.city[action].powered || window.game.actions.city[action].support) {
                //console.log(action,"POWER", window.game.actions.city[action].powered, "SUPPORT", window.game.actions.city[action].support);
                buildings['city-'+action] = new PoweredBuilding('city-'+action, ['city']);
                continue;
            }
            if (action == 'windmill') {
                //console.log(action,"POWER", window.game.actions.city[action].powered, "SUPPORT", window.game.actions.city[action].support);
                buildings['city-'+action] = new PoweredBuilding('city-'+action, ['city']);
                continue;
            }
            buildings['city-'+action] = new Building('city-'+action, ['city']);
        }
        // Space
        for (var location in window.game.actions.space) {
            for (var action in window.game.actions.space[location]) {
                // Remove info
                if (action == 'info') {continue;}
                if (window.game.actions.space[location][action].powered || window.game.actions.space[location][action].support) {
                    //console.log(action,"POWER", window.game.actions.space[location][action].powered, "SUPPORT", window.game.actions.space[location][action].support);
                    buildings['space-'+action] = new PoweredBuilding('space-'+action, ['space', location]);
                    continue;
                }
                buildings['space-'+action] = new Building('space-'+action, ['space', location]);
            }
        }
        // Star Dock
        for (var action in window.game.actions.starDock) {
            // Remove reset actions
            if (action == 'prep_ship' || action == 'launch_ship') {continue;}
            buildings['spcdock-'+action] = new SpaceDockBuilding('spcdock-'+action, ['starDock']);
        }
        // Interstellar
        for (var location in window.game.actions.interstellar) {
            for (var action in window.game.actions.interstellar[location]) {
                // Remove info
                if (action == 'info') {continue;}
                if (window.game.actions.interstellar[location][action].powered || window.game.actions.interstellar[location][action].support) {
                    buildings['interstellar-'+action] = new PoweredBuilding('interstellar-'+action, ['interstellar', location]);
                    continue;
                }
                buildings['interstellar-'+action] = new Building('interstellar-'+action, ['interstellar', location]);
            }
        }
        // Portal
        for (var location in window.game.actions.portal) {
            for (var action in window.game.actions.portal[location]) {
                // Remove info
                if (action == 'info') {continue;}
                if (window.game.actions.portal[location][action].powered || window.game.actions.portal[location][action].support) {
                    buildings['portal-'+action] = new PoweredBuilding('portal-'+action, ['portal', location]);
                    continue;
                }
                buildings['portal-'+action] = new Building('portal-'+action, ['portal', location]);
            }
        }
        console.log(buildings);
    }
    class Research extends Action {
        constructor(id, loc) {
            super(id, loc);
        }

        get researched() {
            let researched = $('#oldTech > div');
            for (let i = 0;i < researched.length;i++) {
                if (this.id == researched[i].id) {
                    return true;
                }
            }
            return false;
        }
    }
    var researches = {};
    function loadResearches() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        // Tech
        for (var action in window.game.actions.tech) {
            // Because tech-exotic_lab has a different key than id
            if (action == "exotic_lab") {
                researches['tech-energy_lab'] = new Research('tech-energy_lab', ['tech']);
                continue;
            }
            if (action == "fortifications") {
                researches['tech-fort'] = new Research('tech-fort', ['tech']);
                continue;
            }
            researches['tech-'+action] = new Research('tech-'+action, ['tech']);
        }
        // Space
    }
    class ArpaAction extends Action {
        constructor(id, res) {
            super(id, ['arpa']);
            this.res = res;
        }

        get label() {
            return document.querySelector('#arpa'+this.id+' > .head > .desc');
        }
        get btn() {
            return document.querySelector('#arpa'+this.id+' > div.buy > button.button.x25');
        }
        get rankLabel() {
            return document.querySelector('#arpa'+this.id+' > .head > .rank');
        }

        get name() {
            if (this.label === null) {
                return this.id;
            }
            return this.label.innerText;
        }

        get rank() {
            return window.game.global.arpa[this.id].rank
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid] * (1.05 ** this.rank) / 4;
        }

        click() {
            if (this.btn !== null) {
                this.btn.click();
                return true;
            } else {
                return false;
            }
        }

    }
    class MonumentAction extends ArpaAction {
        constructor(id) {
            super(id, {});
        }

        click() {
            if (this.btn !== null) {
                this.btn.click();
                setTimeout(loadMonumentRes, 500);
                return true;
            } else {
                return false;
            }
        }
    }
    var arpas = {};
    function loadMonumentRes() {
        if (arpas.monument.label !== null) {
            switch(arpas.monument.label.innerText) {
                case "Obelisk":
                    {
                        arpas.monument.res = {Stone:1000000};
                        break;
                    }
                case "Statue":
                    {
                        arpas.monument.res = {Aluminium:350000};
                        break;
                    }
                case "Sculpture":
                    {
                        arpas.monument.res = {Steel:300000};
                        break;
                    }
                case "Monolith":
                    {
                        arpas.monument.res = {Cement:300000};
                        break;
                    }
            }
        }
    }
    function loadArpas() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        arpas.lhc = new ArpaAction('lhc',
                                   {Money:2500000,
                                   Knowledge:500000,
                                   Copper:125000,
                                   Cement:250000,
                                   Steel:187500,
                                   Titanium:50000,
                                   Polymer:12000});
        arpas.stock_exchange = new ArpaAction('stock_exchange',
                                              {Money:3000000,
                                               Plywood:25000,
                                               Brick:20000,
                                               Wrought_Iron:10000});
        arpas.launch_facility = new ArpaAction('launch_facility',
                                        {Money:2000000,
                                        Knowledge:500000,
                                        Cement:150000,
                                        Oil:20000,
                                        Sheet_Metal:15000,
                                        Alloy:25000});
        arpas.monument = new MonumentAction('monument');
        loadMonumentRes();
    }
    class StorageAction extends Action {
        constructor(id, res) {
            super(id, ['storage']);
            this.res = res;
        }

        get countLabel() {
            return document.querySelector('#cnt'+this.name+'s');
        }
        get btn() {
            let div = document.querySelector('.'+this.id.toLowerCase());
            if (div === null) {return null;}
            return div.children[0];
        }

        get unlocked() {
            if (this.id == 'Crate') {
                return researched('tech-containerization');
            } else {
                return researched('tech-steel_containers');
            }
        }

        get name() {
            return this.id.charAt(0).toUpperCase() + this.id.slice(1)
        }

        get full() {
            if (this.countLabel !== null) {
                let data = this.countLabel.innerText.split(' / ');
                return (parseInt(data[0]) == parseInt(data[1]));
            } else {
                console.log("Error:", this.id, "Full");
                return true;
            }
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid];
        }

        click() {
            let btn = this.btn;
            if (btn === null) {return false;}
            for (let i = 0;i < 10;i++) {
                btn.click();
            }
            return true;
        }
    }
    var storages = {};
    function loadStorages() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        storages.Crate = new StorageAction('Crate',
                                           (resources.Lumber.unlocked) ?
                                           {Plywood:100}
                                           :
                                           {Stone:2000});
        storages.Container = new StorageAction('Container',
                                               {Steel:1250});
    }

    class Job {
        constructor(id, priority) {
            this.id = id;
            if (!settings.jobs.hasOwnProperty(this.id)) {settings.jobs[this.id] = {};}
            if (!settings.jobs[this.id].hasOwnProperty('priority')) {settings.jobs[this.id].priority = priority;}
        }

        get _priority() {return settings.jobs[this.id].priority;}
        set _priority(priority) {settings.jobs[this.id].priority = priority;}

        get mainDiv() {
            return document.getElementById('civ-'+this.id);
        }
        get label() {
            return document.querySelector('#civ-'+this.id+' > .job_label > h3');
        }
        get employLabel() {
            return document.querySelector('#civ-'+this.id+' > .job_label > .count');
        }
        get hireBtn() {
            return document.querySelector('#civ-'+this.id+' > .controls > .add');
        }
        get fireBtn() {
            return document.querySelector('#civ-'+this.id+' > .controls > .sub');
        }

        get name() {
            if (this.label !== null) {
                return this.label.innerText;
            } else {
                return this.id;
            }
        }

        get employed() {
            if (this.employLabel !== null) {
                let employees = this.employLabel.innerText.split('/');
                if (employees.length == 0) {
                    console.log("Error:", this.id, "Employed");
                    return -1;
                } else {
                    return parseInt(employees[0]);
                }
            } else {
                console.log("Error:", this.id, "Employed");
                return -1;
            }
        }
        get maxEmployed() {
            if (this.employLabel !== null) {
                let employees = this.employLabel.innerText.split('/');
                if (employees.length != 2) {
                    return -1;
                } else {
                    return parseInt(employees[1]);
                }
            } else {
                console.log("Error:", this.id, "Max Employed");
                return -1;
            }
        }

        get priority() {
            return this._priority;
        }

        lowerPriority() {
            if (this._priority == 0) {return;}
            this._priority -= 1;
            updateSettings();
            console.log("Lowering", this.id, "Priority", this._priority);
        }
        higherPriority() {
            if (this._priority == 9) {return;}
            this._priority += 1;
            updateSettings();
            console.log("Increasing", this.name, "Priority", this._priority);
        }

        get unlocked() {
            return (civicsOn() && this.mainDiv !== null && this.mainDiv.style.display != 'none');
        }

        hire() {
            if (this.hireBtn !== null) {
                this.hireBtn.click();
                return true;
            } else {
                return false;
            }
        }
        fire() {
            if (this.fireBtn !== null) {
                this.fireBtn.click();
                return true;
            } else {
                return false;
            }
        }

        updateUI() {
            if (!this.unlocked) {return;}
            let priorityLabel = document.getElementById(this.id+"_priority")
            priorityLabel.removeChild(priorityLabel.firstChild);
            priorityLabel.appendChild(document.createTextNode(this.priority));
        }
    }
    class Unemployed extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get priority() {
            if (this.name == 'Hunter') {
                return this._priority;
            } else {
                return 0;
            }
        }

        updateUI() {
            if (this.name != 'Hunter') {return;}
            super.updateUI();
        }
    }
    class Craftsman extends Job {
        constructor(id, priority) {
            super(id, priority);
            //this.workPhases = ['New Moon', 'Waxing Gibbous Moon', 'Full Moon', 'Waning Crescent Moon'];
        }

        get mainDiv() {
            return document.getElementById('foundry');
        }
        get employLabel() {
            return document.querySelector('#foundry > .job > .foundry > .count');
        }
        get hireBtn() {
            return document.querySelector('#foundry .job:nth-child(2) > .controls > .add')
        }
        get fireBtn() {
            return document.querySelector('#foundry .job:nth-child(2) > .controls > .sub')
        }

        get name() {
            return "Craftsman";
        }

        get unlocked() {
            return (civicsOn() && this.mainDiv !== null && this.mainDiv.children.length > 0);
        }

        /*
        // Priority goes to zero when craftsman don't do any work
        get priority() {
            if (this.workPhases.includes(getLunarPhase())) {
                return this._priority;
            } else {
                return 0;
            }
        }*/
    }
    var jobs = {};
    function loadJobs() {
        if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
        jobs.free = new Unemployed("free", 0);
        jobs.farmer = new Job("farmer", 1);
        jobs.lumberjack = new Job("lumberjack", 3);
        jobs.quarry_worker = new Job("quarry_worker", 3);
        jobs.miner = new Job("miner", 4);
        jobs.coal_miner = new Job("coal_miner", 4);
        jobs.cement_worker = new Job("cement_worker", 4);
        jobs.entertainer = new Job("entertainer", 8);
        jobs.professor = new Job("professor", 9);
        jobs.scientist = new Job("scientist", 9);
        jobs.banker = new Job("banker", 9);
        jobs.colonist = new Job("colonist", 7);
        jobs.space_miner = new Job("space_miner", 7);
        jobs.surveyor = new Job("hell_surveyor",9);
        jobs.craftsman = new Craftsman("craftsman", 9);
    }
    class CraftJob extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get mainDiv() {
            return document.getElementById('craft'+this.id);
        }
        get label() {
            return document.querySelector('#craft'+this.id+' > h3');
        }
        get employLabel() {
            return document.querySelector('#craft'+this.id+' > .count');
        }
        get hireBtn() {
            return document.getElementById('craft'+this.id).parentNode.children[1].children[1];
        }
        get fireBtn() {
            return document.getElementById('craft'+this.id).parentNode.children[1].children[0];
        }
    }
    var craftJobs = {};
    function loadCraftJobs() {
        if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
        craftJobs.Plywood = new CraftJob("Plywood", 5);
        craftJobs.Brick = new CraftJob("Brick", 5);
        craftJobs.Wrought_Iron = new CraftJob("Wrought_Iron", 5);
        craftJobs.Sheet_Metal = new CraftJob("Sheet_Metal", 5);
        craftJobs.Mythril = new CraftJob("Mythril", 5);
    }

    let foodBtn = null;
    let lumberBtn = null;
    let stoneBtn = null;
    let rnaBtn = null;
    let dnaBtn = null;
    let slaughterBtn = null;
    function loadFarm () {
        try {
            foodBtn = document.getElementById("city-food").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error: Food button could not be loaded");
        }
        try {
            lumberBtn = document.getElementById("city-lumber").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error: Lumber button could not be loaded");
        }
        try {
            stoneBtn = document.getElementById("city-stone").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error :Stone button could not be loaded");
        }
        try {
            rnaBtn = document.getElementById("evo-rna").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error: RNA button could not be loaded");
        }
        try {
            dnaBtn = document.getElementById("evo-dna").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error :DNA button could not be loaded");
        }
        try {
            slaughterBtn = document.getElementById("city-slaughter").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error :DNA button could not be loaded");
        }
    }

    function loadSmelter() {
        if (!settings.hasOwnProperty('smelterSettings')) {settings.smelterSettings = {};}
        if (!settings.smelterSettings.hasOwnProperty('interval')) {settings.smelterSettings.interval = 20;}
        if (!settings.smelterSettings.hasOwnProperty('Iron')) {settings.smelterSettings.Iron = 2;}
        if (!settings.smelterSettings.hasOwnProperty('Steel')) {settings.smelterSettings.Steel = 3;}
    }
    function loadFactory() {
        if (!settings.hasOwnProperty('factorySettings')) {settings.factorySettings = {};}
        if (!settings.factorySettings.hasOwnProperty('interval')) {settings.factorySettings.interval = 23;}
        if (!settings.factorySettings.hasOwnProperty('Luxury_Goods')) {settings.factorySettings.Luxury_Goods = 0;}
        if (!settings.factorySettings.hasOwnProperty('Alloy')) {settings.factorySettings.Alloy = 3;}
        if (!settings.factorySettings.hasOwnProperty('Polymer')) {settings.factorySettings.Polymer = 3;}
        if (!settings.factorySettings.hasOwnProperty('Nano_Tube')) {settings.factorySettings.Nano_Tube = 7;}
        if (!settings.factorySettings.hasOwnProperty('Stanene')) {settings.factorySettings.Stanene = 4;}
    }

    /***
    *
    * Settings
    *
    ***/

    function loadSettings() {
        console.log("Loading Settings");
        // Evolution
        loadEvolution();
        // Farm
        loadFarm();
        // Resources
        loadResources();
        // Storages
        try { loadStorages(); } catch(e) {}
        // Buildings
        loadBuildings();
        // Jobs
        loadJobs();
        loadCraftJobs();
        // Research
        loadResearches();
        // ARPA
        loadArpas();
        // Smelter
        loadSmelter();
        // Factory
        loadFactory();
        if (!settings.hasOwnProperty('autoPrint')) {
            settings.autoPrint = true;
        }
        if (!settings.hasOwnProperty('autoFarm')) {
            settings.autoFarm = false;
        }
        if (!settings.hasOwnProperty('autoEvolution')) {
            settings.autoEvolution = false;
        }
        if (!settings.hasOwnProperty('evolution')) {
            settings.evolution = "antid";
        }
        if (!settings.hasOwnProperty('Plasmid')) {
            settings.Plasmid = false;
        }
        if (!settings.hasOwnProperty('Craft')) {
            settings.Craft = false;
        }
        if (!settings.hasOwnProperty('CRISPR')) {
            settings.CRISPR = false;
        }
        if (!settings.hasOwnProperty('Trade')) {
            settings.Trade = false;
        }
        if (!settings.hasOwnProperty('autoCraft')) {
            settings.autoCraft = false;
        }
        if (!settings.hasOwnProperty('autoBuild')) {
            settings.autoBuild = false;
        }
        if (!settings.hasOwnProperty('autoSmelter')) {
            settings.autoSmelter = false;
        }
        if (!settings.hasOwnProperty('autoFactory')) {
            settings.autoFactory = false;
        }
        if (!settings.hasOwnProperty('autoSupport')) {
            settings.autoSupport = false;
        }
        if (!settings.hasOwnProperty('autoEmploy')) {
            settings.autoEmploy = false;
        }
        if (!settings.hasOwnProperty('autoTax')) {
            settings.autoTax = false;
        }
        if (!settings.hasOwnProperty('defaultMorale')) {
            settings.defaultMorale = 100;
        }
        if (!settings.hasOwnProperty('autoBattle')) {
            settings.autoBattle = false;
        }
        if (!settings.hasOwnProperty('autoResearch')) {
            settings.autoResearch = false;
        }
        if (!settings.hasOwnProperty('fanORanth')) {
            settings.fanORanth = "fanaticism";
        }
        if (!settings.hasOwnProperty('studyORdeify')) {
            settings.studyORdeify = "study";
        }
        if (!settings.hasOwnProperty('uniChoice')) {
            settings.uniChoice = 'unify';
        }
        if (!settings.hasOwnProperty('autoMarket')) {
            settings.autoMarket = false;
        }
        if (!settings.hasOwnProperty('minimumMoney')) {
            settings.minimumMoney = 0;
        }
        if (!settings.hasOwnProperty('autoARPA')) {
            settings.autoARPA = false;
        }
        if (!settings.hasOwnProperty('arpa')) {
            settings.arpa = {
                lhc: false,
                stock_exchange: false,
                monument: false
            };
        }
        if (!settings.hasOwnProperty('log')) {settings.log = []};
        //console.log("Finished loading settings");
    }
    loadSettings();

    function updateSettings(){
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    function importSettings() {
        console.log("Importing Settings");
        if ($('textarea#settingsImportExport').val().length > 0){
            let settingStr = $('textarea#settingsImportExport').val();
            settings = JSON.parse(LZString.decompressFromBase64(settingStr));
            updateSettings();
            resetUI();
        }
    }

    function exportSettings() {
        console.log("Exporting Settings");
        $('textarea#settingsImportExport').val(LZString.compressToBase64(JSON.stringify(settings)));
        $('textarea#settingsImportExport').select();
        document.execCommand('copy');
    }

    /***
    *
    * automation functions
    *
    ***/

    function farm() {
        if(foodBtn!==null){foodBtn.click();}
        if(lumberBtn!==null){lumberBtn.click();}
        if(stoneBtn!==null){stoneBtn.click();}
        if(rnaBtn!==null){rnaBtn.click();}
        if(dnaBtn!==null){dnaBtn.click();}
        if(slaughterBtn!==null){slaughterBtn.click();}
    }

    let farmInterval = null;
    function autoFarm() {
        if(settings.autoFarm && farmInterval === null) {
            farmInterval = setInterval(farm, 10);
        } else {
            if (!settings.autoFarm && !(farmInterval === null)) {
                clearInterval(farmInterval);
                farmInterval = null;
            }
        }
    }

    function autoEvolution() {
        let actions = document.querySelectorAll('#evolution .action');
        for(let i = 0; i < actions.length; i++){
            // Checking if purchasable
            let action = actions[i];
            if(action.className.indexOf("cna") < 0){
                // Checking if farming button
                if(action.id == "evo-rna" || action.id == "evo-dna") {continue;}
                // Stop buying garbage you idiot
                if(action.id in maxEvo && parseInt($('#'+action.id+' > a > .count')[0].innerText) >= maxEvo[action.id]) {continue;}
                // Don't take sentience
                if(action.id == "evo-sentience") {continue;}
                // Don't take junker
                if(action.id == "evo-junker") {continue;}
                // Don't take joyless
                if(action.id == "evo-joyless") {continue;}
                // Don't take planets
                if(/\w+\d+/.exec(action.id) !== null) {continue;}
                // Check for challenge runs
                if(action.id == "evo-plasmid" && !settings.Plasmid) {continue;}
                if(action.id == "evo-craft" && !settings.Craft) {continue;}
                if(action.id == "evo-crispr" && !settings.CRISPR) {continue;}
                if(action.id == "evo-trade" && !settings.Trade) {continue;}
                // Checking for race decision tree
                if(evoRaceActions.includes(action.id) && !evoRaceTrees[settings.evolution].includes(action.id)) {continue;}
                action.children[0].click();
                if(settings.autoPrint){messageQueue("[AUTO-EVOLVE] " + action.children[0].children[0].innerText,'dark');}
                return;
            }
        }
    }

    function autoCraft() {
        //console.log("AutoCrafting");
        for (var x in resources) {
            if (resources[x] instanceof CraftableResource) {
                resources[x].craft();
            }
        }
    }

    function autoStorage() {
        // Don't do autoStorage if haven't unlocked storage
        if (!researched('tech-containerization')) {return;}
        // Finding values
        let totalCrates = parseInt($('#cntCrates')[0].innerText.split(' / ')[0]);
        let totalContainers = parseInt($('#cntContainers')[0].innerText.split(' / ')[0]);
        // Creating crateable object
        let storage = {}
        for (var x in resources) {
            if (resources[x].crateable) {storage[x]=resources[x];}
        }
        for (var x in storage) {
            totalCrates += storage[x].crateNum;
            totalContainers += storage[x].containerNum;
        }

        //console.log("Current Crate Usage", totalCrates);
        //console.log("Current Container Usage", totalContainers);

        // Getting total priority
        let totalPriority = 0;
        for (x in storage) {totalPriority += storage[x].storePriority}
        // Calculating crate differentials
        for (x in storage) {
            storage[x].wanted_crates = Math.round(totalCrates * storage[x].storePriority / totalPriority);
            storage[x].wanted_crates = Math.max(storage[x].wanted_crates, storage[x].storeMin);
            storage[x].needed_crates = storage[x].wanted_crates - storage[x].crateNum;
            storage[x].wanted_containers = Math.round(totalContainers * storage[x].storePriority / totalPriority);
            storage[x].needed_containers = storage[x].wanted_containers - storage[x].containerNum;
            //console.log(x, "CR_WANT", storage[x].wanted_crates, "CR_NEED", storage[x].needed_crates, "CO_WANT", storage[x].wanted_containers, "CO_NEED", storage[x].needed_containers);
        }
        // Removing extra storage
        let excessStorage = [];
        for (x in storage) {
            if (storage[x].needed_crates < 0) {
                storage[x].crateDec(-storage[x].needed_crates);
            }
            if (researched('tech-steel_containers') && storage[x].needed_containers < 0) {
                storage[x].containerDec(-storage[x].needed_containers);
            }
        }
        for (x in storage) {
            if (storage[x].needed_crates > 0) {
                storage[x].crateInc(storage[x].needed_crates);
            }
            if (researched('tech-steel_containers') && storage[x].needed_containers > 0) {
                storage[x].containerInc(storage[x].needed_containers);
            }
        }
    }

    class AutoBattler {
        constructor() {
            this.battleButton = document.querySelector('#garrison > div:nth-child(4) > div:nth-child(2) > span > button');
            this.addBattalion = document.querySelector('#battalion > .add');
            this.armySize = document.querySelector('#battalion > span:nth-child(3) > .current');
            this.lowerCampaign = document.querySelector('#tactics > .sub');
            this.higherCampaign = document.querySelector('#tactics > .add');
            this.campaignStrengths = [
                { name: "Ambush", rating: 10 },
                { name: "Raid", rating: 50 },
                { name: "Pillage", rating: 100 },
                { name: "Assault", rating: 200 },
                { name: "Siege", rating: 500 }
            ];
        }

        autoBattle() {
            // Don't battle if the garrison hasn't been unlocked
            if (!researched('tech-garrison')) {return;}
            // Don't battle after unification
            if (researched('tech-wc_conquest')||researched('tech-wc_morale')||researched('tech-wc_money')||researched('tech-wc_reject')) {return;}
            // Adding soldiers
            for (let i = 0;i < this.soldierCount[0] - parseInt(this.armySize.innerText);i++) {
                this.addBattalion.click();
            }
            // If no wounded and max soldiers, start battle
            if (this.woundedCount == 0 && this.soldierCount[0] == this.soldierCount[1] && this.soldierCount[0] != 0) {
                //console.log("Wounded: ", this.woundedCount, "Soldiers: ", this.soldierCount);
                // Changing campaign to match current rating
                for (let i = 0;i < 4;i++) {
                    this.lowerCampaign.click();
                }
                for (let i = 1;i <= 4;i++) {
                    //console.log(this.rating, "VS", this.campaignStrengths[i]);
                    if (this.rating < this.campaignStrengths[i].rating) {
                        break;
                    } else {
                        this.higherCampaign.click();
                    }
                }
                // Don't battle if army rating lower than lowest campaign
                if (this.rating < this.campaignStrengths[0].rating) {return;}
                // Starting battle
                this.battleButton.click();
            }
        }

        get soldierCount() {
            return document.querySelector('#garrison .barracks > span:nth-child(2)').innerText.split(' / ');
        }

        get woundedCount() {
            return document.querySelector('#garrison .barracks:nth-child(2) > span:nth-child(2)').innerText;
        }

        get rating() {
            return document.querySelector('#garrison > .header').children[1].children[1].childNodes[0].textContent;
        }
    }
    let autoBattler = new AutoBattler();

    function prioCompare(a, b) {
        return b.priority - a.priority;
    }
    function autoEmploy(priorityData) {
        // Sorting based on priority
        let sortedJobs = [];
        var x;
        for (x in jobs) {
            if (jobs[x].unlocked) {
                sortedJobs.push(jobs[x]);
            }
        }
        sortedJobs.sort(prioCompare);
        let free_agents = 0;
        let total_priority = 0;
        // Find total free agents
        for (let i = 0;i < sortedJobs.length;i++) {
            let job = sortedJobs[i];
            // Free agents are determined by the ratio of priority
            // Priority 9 would have a ratio of 9/9, thus will always have no free agents
            // Priority 0 would have a ratio of 0/9, thus always will have free agents

            //console.log("Checking", job.name);
            // If Craftsman, move all workers to Plywood for reassignment
            /*
                if (job.id == "craftsman") {
                    for (x in craftJobs) {
                        let cjob = craftJobs[x];
                        if (!cjob.unlocked) {continue;}
                        for (let k = 0;k < cjob.employed;k++) {
                            cjob.fireBtn.click();
                            craftJobs.Plywood.hireBtn.click();
                        }
                    }
                }
                */

            total_priority += job.priority;
            // Job has no max employees (Unemployed, Farmer, Lumberjack, Quarry Worker)
            // Use the one more than the current employed
            let maxEmployed = (job.maxEmployed == -1) ? job.employed + 5 : job.maxEmployed;
            job.max_employed = maxEmployed;
            job.wanted = Math.round(maxEmployed /(1+Math.pow(Math.E, -job.priority+4.5)));
            job.need = job.wanted - job.employed;
            job.temp_employed = job.employed;
            //console.log(job.name, job.priority, job.wanted, job.need);
            // If there is negative need, send to unemployed
            if (job.need < 0) {
                // Removal from craftsman requires additional work
                if (job.id == 'craftsman') {
                    let totalRemove = -job.need;
                    // Searching through craft jobs to remove
                    for (x in craftJobs) {
                        if (!craftJobs[x].unlocked) {continue;}
                        craftJobs[x].temp_employed = craftJobs[x].employed;
                        if (craftJobs[x].employed >= totalRemove) {
                            for (let j = 0;j < totalRemove;j++) {
                                craftJobs[x].fire();
                            }
                            craftJobs[x].temp_employed = craftJobs[x].employed - totalRemove;
                            free_agents += totalRemove;
                            break;
                        } else {
                            for (let j = 0;j < craftJobs[x].employed;j++) {
                                craftJobs[x].fire();
                            }
                            craftJobs[x].temp_employed = 0;
                            free_agents += craftJobs[x].employed;
                            totalRemove -= craftJobs[x].employed;
                        }
                    }
                } else {
                    for (let j = 0;j < -job.need;j++) {
                        if (job.id != 'free') {job.fire();}
                        job.temp_employed -= 1;
                        free_agents += 1;
                    }
                }
            }
        }

        //console.log("Finished freeing agents");

        // All free agents should be in unemployed
        // Now send those back that are needed
        for (let i = 0;i < sortedJobs.length;i++) {
            let job = sortedJobs[i];
            for (let i = 0;i < job.need;i++) {
                if (job.id != 'free') {job.hire();}
                job.temp_employed += 1;
                free_agents -= 1;
            }
        }

        //console.log("Finished sending initial agents");


        // Divy up the remaining free agents based on priority
        // The pie is split based on total priority points
        for (let i = 0;i < sortedJobs.length;i++) {
            let job = sortedJobs[i];
            //if (job.id == "free") {continue;}
            let pie = Math.round(free_agents * job.priority / total_priority);
            for (let j = 0;j < Math.min(pie,job.max_employed - job.temp_employed);j++) {
                if (job.id != 'free') {job.hire();}
                free_agents -= 1;
            }
            total_priority -= job.priority;
        }
        // Sometimes there's still some free agents left
        for (let j = 0;j < free_agents;j++) {
            for (let i = 0;i < sortedJobs.length;i++) {
                let job = sortedJobs[i];
                if (job.id == 'free') {continue;}
                job.hire()
            }
        }

        // Divy up Craftsmen

        if (!jobs.craftsman.unlocked) {return;}
        //console.log("Divying up Craftsman");
        // Delay to get new craftman number
        setTimeout(function() {
            let totalCraftsman = 0;
            let total_priority = 0;
            let cjobs = [];
            let cwant = [];
            let cratio = [];
            let cneed = [];
            // Finding availible craftsman positions, as well as total priority and craftsman numbers
            for (x in craftJobs) {
                if (!craftJobs[x].unlocked) {continue;}
                cjobs.push(craftJobs[x]);
                total_priority += craftJobs[x].priority;
                totalCraftsman += craftJobs[x].employed;
                craftJobs[x].want = 0;
                cwant.push(0);
            }
            // Calculating wanted ratios
            for (let i = 0;i < cjobs.length;i++) {
                cratio.push(cjobs[i].priority / total_priority);
            }
            // Optimizing craftsman placement
            for (let i = 0;i < totalCraftsman;i++) {
                // Calculating error based on next value choice
                let error = -1;
                let choice = -1;
                for (let j = 0;j < cjobs.length;j++) {
                    let total = i+1;
                    let tempError = 0;
                    // Finding new error based on adding this craftsman
                    for (let k = 0;k < cjobs.length;k++) {
                        if (j == k) {
                            // Currently attempting to add a craftsman to this position
                            tempError += (((cwant[k]+1) / total) - cratio[k]) ** 2;
                        } else {
                            tempError += ((cwant[k] / total) - cratio[k]) ** 2;
                        }
                    }
                    if (error == -1 || tempError < error) {
                        error = tempError;
                        choice = j;
                    }
                }
                cwant[choice] += 1;
            }
            // Finding differential
            for (let i = 0;i < cjobs.length;i++) {
                cneed[i] = cwant[i] - cjobs[i].employed;
            }
            // Firing all unneeded
            for (let i = 0;i < cjobs.length;i++) {
                if (cneed[i] < 0) {
                    for (let j = 0;j < -cneed[i];j++) {
                        cjobs[i].fire();
                    }
                }
            }
            // Hiring all needed
            for (let i = 0;i < cjobs.length;i++) {
                if (cneed[i] > 0) {
                    for (let j = 0;j < cneed[i];j++) {
                        cjobs[i].hire();
                    }
                }
            }
        }, 25);
    }

    let moraleLabel = $('#morale').children(1)[0];
    let incTaxBtn = $('#tax_rates > .add');
    let decTaxBtn = $('#tax_rates > .sub');
    function autoTax(priorityData) {
        // Don't start taxes if haven't researched
        if (!researched('tech-tax_rates')) {return;}
        let morale = parseInt(moraleLabel.innerText.substr(0,moraleLabel.innerText.length-1));
        if (morale > settings.defaultMorale) {
            for (let i = 0;i < morale - settings.defaultMorale;i++) {
                incTaxBtn.click();
            }
        } else {
            for (let i = 0;i < settings.defaultMorale - morale;i++) {
                decTaxBtn.click();
            }
        }
    }

    function autoMarket(bulkSell, ignoreSellRatio) {
        // Don't start autoMarket if haven't unlocked market
        if (!researched('tech-market')) {return;}
        let curMoney = resources.Money.amount;
        let maxMoney = resources.Money.storage;
        let multipliers = $('#market-qty').children();
        // If multipliers don't exist (aka cannot manual buy/sell) don't autoMarket
        if (multipliers === null || multipliers === undefined || multipliers.length == 0) {return;}
        multipliers[2].click();
        let qty = 25;
        setTimeout(function(){ //timeout needed to let the click on multiplier take effect
            for (var x in resources) {
                let resource = resources[x];
                // Continue if resource hasn't been unlocked
                if(!resource.unlocked) {continue;}
                // Continue if resource isn't tradeable
                if(!(resource instanceof TradeableResource)) {continue;}

                //console.log("Auto Market", resource.name);
                let curResource = resource.amount;
                let maxResource = resource.storage;
                // Can sell resource
                //console.log(resource.id, resource.ratio, resource.sellRatio);
                if (resource.autoSell && resource.ratio > resource.sellRatio && resource.sellBtn !== null) {
                    //console.log("Autoselling", resource.name);
                    let sellValue = getRealValue(resource.sellBtn.innerHTML.substr(1));
                    let counter = 0;
                    //console.log("CURM:", curMoney, "sellV", sellValue, "MAXM", maxMoney, "CURR", curResource, "MAXR", maxResource);
                    while(true) {
                        // Break if too much money, not enough resources, or sell ratio reached
                        if (curMoney + sellValue >= maxMoney || curResource - qty <= 0 || curResource / maxResource < resource.sellRatio) {
                            //console.log("Sold", counter*100);
                            break;
                        }
                        counter += 1;
                        resource.sellBtn.click();
                        curMoney += sellValue;
                        curResource -= qty;
                    }
                }

                if(bulkSell === true) {
                    return;
                }

                if (resource.autoBuy && resource.ratio < resource.buyRatio && resource.buyBtn !== null) {
                    //console.log("Autobuying", resource.name);
                    let buyValue = getRealValue(resource.buyBtn.innerHTML.substr(1));
                    //console.log("CURM:", curMoney, "sellV", buyValue, "MAXM", maxMoney, "CURR", curResource, "MAXR", maxResource, "MINM", getMinMoney());
                    while(true) {
                        // Break if too little money, too much resources, or buy ratio reached
                        if (curMoney - buyValue < getMinMoney() || curResource + qty > resource.storage || curResource / maxResource > resource.buyRatio) {
                            break;
                        }
                        resource.buyBtn.click();
                        curMoney -= buyValue;
                        curResource += qty;
                    }
                }
            }
        }, 25);
    }

    function autoSmelter(limits) {
        // Don't Auto smelt if not unlocked
        if (!researched('tech-steel')) {return;}
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        //console.log("Auto Smelting");
        // Opening modal
        $('#city-smelter > .special').click();
        // Delaying for modal animation
        setTimeout(function() {
            // Finding relevent elements
            let decBtns = $('#specialModal > .fuels > .sub');
            let incBtns = $('#specialModal > .fuels > .add');
            let labels = $('#specialModal > .fuels > span > .current');
            let lumberInc = null; let lumberDec = null; let coalInc = null; let coalDec = null; let oilInc = null; let oilDec = null;
            let lumberNum = null; let coalNum = null; let oilNum = null; let lumberFuel = null; let coalFuel = null; let oilFuel = null;
            // Determining which fuel types are available
            if (decBtns.length == 2) {
                // Only two buttons. Either Ent type race  with Coal/Oil, or haven't unlocked oil yet
                if (!resources.Oil.unlocked) {
                    // Oil not unlocked, thus two buttons mean Lumber/Coal
                    lumberInc = incBtns[0];
                    lumberDec = decBtns[0];
                    let temp = labels[0].attributes[0].value;
                    lumberFuel = parseFloat(/Consume ([\d\.]+).*/.exec(temp)[1]);
                    lumberNum = parseInt(/\w+ ([\d]+)/.exec(labels[0].innerText)[1]);
                    coalInc = incBtns[1];
                    coalDec = decBtns[1];
                    temp = labels[1].attributes[0].value;
                    coalFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                    coalNum = parseInt(/Coal ([\d]+)/.exec(labels[1].innerText)[1]);
                } else {
                    // Must be Ent type race with Coal/Oil
                    coalInc = incBtns[0];
                    coalDec = decBtns[0];
                    let temp = labels[0].attributes[0].value;
                    coalFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                    coalNum = parseInt(/Coal ([\d]+)/.exec(labels[0].innerText)[1]);
                    oilInc = incBtns[1];
                    oilDec = decBtns[1];
                    temp = labels[1].attributes[0].value;
                    oilFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                    oilNum = parseInt(/Oil ([\d]+)/.exec(labels[1].innerText)[1]);
                }
            } else {
                // Three buttons means all fuels unlocked
                lumberInc = incBtns[0];
                lumberDec = decBtns[0];
                let temp = labels[0].attributes[0].value;
                lumberFuel = parseFloat(/Consume ([\d\.]+).*/.exec(temp)[1]);
                lumberNum = parseInt(/\w+ ([\d]+)/.exec(labels[0].innerText)[1]);
                coalInc = incBtns[1];
                coalDec = decBtns[1];
                temp = labels[1].attributes[0].value;
                coalFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                coalNum = parseInt(/Coal ([\d]+)/.exec(labels[1].innerText)[1]);
                oilInc = incBtns[2];
                oilDec = decBtns[2];
                temp = labels[2].attributes[0].value;
                oilFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                oilNum = parseInt(/Oil ([\d]+)/.exec(labels[2].innerText)[1]);
            }
            //console.log("L", lumberNum, lumberFuel, "C", coalNum, coalFuel, "O", oilNum, oilFuel);
            if (lumberNum !== null) {resources.Lumber.temp_rate += lumberFuel * lumberNum;}
            if (coalNum !== null) {resources.Coal.temp_rate += coalFuel * coalNum;}
            if (oilNum !== null) {resources.Oil.temp_rate += oilFuel * oilNum;}
            // Finding iron/steel buttons
            let ironBtn = $('#specialModal > .smelting > span > button')[0];
            let steelBtn = $('#specialModal > .smelting > span > button')[1];
            let ironNum = $('#specialModal > .smelting > span')[0].innerText;
            let steelNum = $('#specialModal > .smelting > span')[1].innerText;
            ironNum = parseInt(/Iron Smelting: ([\d]+)/.exec(ironNum)[1]);
            steelNum = parseInt(/Steel Smelting: ([\d]+)/.exec(steelNum)[1]);
            let ironVal = $('#specialModal > .smelting > span')[0].attributes[0].value;
            let steelVal = $('#specialModal > .smelting > span')[1].attributes[0].value;
            let ironPercent = parseInt(/[^\d]+([\d]+)%/.exec(ironVal)[1]);
            let temp = /[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*/.exec(steelVal);
            let steelCoalFuel = parseFloat(temp[1]);
            let steelIronFuel = parseFloat(temp[2]);;
            let steelProduce = parseFloat(temp[3]);;
            //console.log("Iron", ironNum, ironPercent, "Steel", steelNum, steelIronFuel, steelCoalFuel, steelProduce);
            resources.Iron.temp_rate += steelIronFuel * steelNum;
            resources.Coal.temp_rate += steelCoalFuel * steelNum;
            resources.Steel.temp_rate -= steelProduce * steelNum;
            resources.Iron.temp_rate /= (1 + ironPercent*ironNum / 100);
            // Calculating changes
            let totalSmelters = buildings['city-smelter'].numTotal;
            let wantedIron = 0;
            let wantedSteel = 0;
            if (limits.Iron === null) {
                // Does not require iron, max out steel regardless
                wantedSteel = totalSmelters;
            } else {
                if (limits.Steel !== null) {
                    // Requires both, find ratio
                    wantedIron = Math.floor(limits.Iron.priority / (limits.Iron.priority + limits.Steel.priority));
                    wantedSteel = totalSmelters - wantedIron;
                } else {
                    // Requires only iron, max out
                    wantedIron = totalSmelters;
                }
            }
            // Calculating Fuel
            let wantedLumber = 0;
            let wantedCoal = 0;
            let wantedOil = 0;
            let wantedTotal = totalSmelters;
            // Oil unlocked and not needed
            if (limits.Oil === null && oilInc !== null) {
                wantedOil = Math.floor(resources.Oil.temp_rate / oilFuel);
                wantedOil = (wantedOil > wantedTotal) ? wantedTotal : wantedOil;
                wantedTotal -= wantedOil;
            }
            // Coal unlocked and not needed
            if (limits.Coal === null && coalInc !== null) {
                // If Ent type race, fill rest with coal
                if (lumberInc === null) {
                    wantedCoal = wantedTotal;
                } else {
                    wantedCoal = Math.floor(resources.Coal.temp_rate / coalFuel);
                    wantedCoal = (wantedCoal > wantedTotal) ? wantedTotal : wantedCoal;
                    wantedTotal -= wantedCoal;
                }
            }
            // Fill the rest with lumber
            if (lumberInc !== null) {
                wantedLumber = wantedTotal;
            }

            //console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel);
            let pos_coal_rate = resources.Coal.temp_rate - wantedCoal*coalFuel - wantedSteel*steelCoalFuel;
            //console.log(pos_coal_rate, resources.Coal, resources.Coal.temp_rate, coalFuel, steelCoalFuel)
            while(pos_coal_rate < 0) {
                console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel, "CR", pos_coal_rate);
                // Try getting rid of coal
                if (wantedCoal > 0) {
                    wantedCoal -= 1;
                    if (lumberInc !== null) {
                        // Put into lumber if exists
                        wantedLumber += 1;
                    } else {
                        // Nothing to put into, get rid of one
                        if (wantedSteel > 0) {
                            wantedSteel -= 1;
                        } else {
                            wantedIron -= 1;
                        }
                    }
                } else if (wantedSteel > 0) {
                    wantedSteel -= 1;
                    wantedIron += 1;
                } else {
                    break;
                }
                pos_coal_rate = resources.Coal.temp_rate - wantedCoal*coalFuel - wantedSteel*steelCoalFuel;
            }
            let pos_iron_rate = resources.Iron.temp_rate * (1 + ironPercent*wantedIron / 100) - wantedSteel*steelIronFuel;
            while(pos_iron_rate < 0) {
                //console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel, "IR", pos_iron_rate);
                // Get rid of some steel
                if (wantedSteel > 0) {
                    wantedSteel -= 1;
                    wantedIron += 1;
                } else {
                    break;
                }
                pos_iron_rate = resources.Iron.temp_rate * (1 + ironPercent*wantedIron / 100) - wantedSteel*steelIronFuel;
            }
            //console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel);
            // Removing all settings
            for (let i = 0;i < totalSmelters;i++) {
                if (lumberDec !== null) {lumberDec.click();}
                if (coalDec !== null) {coalDec.click();}
                if (oilDec !== null) {oilDec.click();}
                ironBtn.click();
            }
            for (let i = 0;i < wantedLumber;i++) {lumberInc.click();}
            for (let i = 0;i < wantedCoal;i++) {coalInc.click();}
            for (let i = 0;i < wantedOil;i++) {oilInc.click();}
            for (let i = 0;i < wantedSteel;i++) {steelBtn.click();}
            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }

    function autoFactory(limits) {
        // Don't Auto factory if not unlocked
        if (!researched('tech-industrialization')) {return;}
        // Don't Auto factory if you don't have any
        if (buildings['city-factory'].numTotal < 1) {return;}
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        //console.log("Auto Factory");
        // Opening modal
        $('#city-factory > .special').click();
        // Delaying for modal animation
        setTimeout(function() {
            // Finding relevent elements
            let decBtns = $('#specialModal > div > .sub');
            let incBtns = $('#specialModal > div > .add');
            let labels = $('#specialModal > div > span.current');
            let datas = $('#specialModal > div > span.is-primary');
            let luxNum = null; let alloyNum = null; let polymerNum = null; let nanoTubeNum = null;
            let luxFurCost = null; let luxMoneyProduct = null;
            let alloyCopperCost = null; let alloyAluminiumCost = null;
            let polymerOilCost = null; let polymerLumberCost = null;
            let nanoTubeCoalCost = null; let nanoTubeNeutroniumCost = null;
            // Getting Data values
            if (decBtns.length > 0) {
                let str = datas[0].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)/.exec(str)
                luxFurCost = temp[1];
                luxMoneyProduct = temp[2];
                luxNum = +labels[0].innerText
            }
            if (decBtns.length > 1) {
                let str = datas[1].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
                alloyCopperCost = temp[1];
                alloyAluminiumCost = temp[2];
                alloyNum = +labels[1].innerText
            }
            if (decBtns.length > 2) {
                let str = datas[2].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
                polymerOilCost = temp[1];
                polymerLumberCost = temp[2];
                polymerNum = +labels[2].innerText
            }
            if (decBtns.length > 3) {
                let str = datas[3].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
                nanoTubeCoalCost = temp[1];
                nanoTubeNeutroniumCost = temp[2];
                nanoTubeNum = +labels[3].innerText
            }
            console.log("L", luxNum, luxFurCost, luxMoneyProduct, "A", alloyNum, alloyCopperCost, alloyAluminiumCost, "P", polymerNum, polymerOilCost, polymerLumberCost, "N", nanoTubeNum, nanoTubeCoalCost ,nanoTubeNeutroniumCost);
            // Resetting temp rates
            if (luxNum !== null) {resources.Money.temp_rate -= luxMoneyProduct * luxNum; resources.Furs.temp_rate += luxFurCost * luxNum;}
            if (alloyNum !== null) {resources.Copper.temp_rate += alloyCopperCost * alloyNum; resources.Aluminium.temp_rate += alloyAluminiumCost * alloyNum;}
            if (polymerNum !== null) {resources.Oil.temp_rate += polymerOilCost * polymerNum; resources.Lumber.temp_rate += polymerLumberCost * polymerNum;}
            if (nanoTubeNum !== null) {resources.Coal.temp_rate += nanoTubeCoalCost * nanoTubeNum; resources.Neutronium.temp_rate += nanoTubeNeutroniumCost * nanoTubeNum;}
            // TODO: Alloy/Polymer/Nanotube production numbers aren't reset, since their numbers can't be found in the data values. Some how find this info
            // Calculating changes
            let totalFactories = buildings['city-factory'].numOn + buildings['space-red_factory'].numOn
            let wantedLux = 0; let luxPriority = 0;
            let wantedAlloy = 0; let alloyPriority = 0;
            let wantedPolymer = 0; let polymerPriority = 0;
            let wantedNanoTube = 0; let nanoTubePriority = 0;
            let totalPriority = 0;
            if (limits.Money !== null && limits.Money !== undefined && settings.factorySettings.Luxury_Goods) {luxPriority = limits.Money.priority * settings.factorySettings.Luxury_Goods; totalPriority += luxPriority; }
            if (limits.Alloy !== null && limits.Alloy !== undefined && settings.factorySettings.Alloy) {alloyPriority = limits.Alloy.priority * settings.factorySettings.Alloy; totalPriority += alloyPriority;}
            if (limits.Polymer !== null && limits.Polymer !== undefined && settings.factorySettings.Polymer) {polymerPriority = limits.Polymer.priority * settings.factorySettings.Polymer; totalPriority += polymerPriority;}
            if (limits.Nano_Tube !== null && limits.Nano_Tube !== undefined && settings.factorySettings.Nano_Tube) {nanoTubePriority = limits.Nano_Tube.priority * settings.factorySettings.Nano_Tube; totalPriority += nanoTubePriority;}
            console.log("L", luxPriority, "A", alloyPriority, "P", polymerPriority, "N", nanoTubePriority);
            // Creating allocation list
            let prioMultipliers = [settings.factorySettings.Luxury_Goods, settings.factorySettings.Alloy, settings.factorySettings.Polymer, settings.factorySettings.Nano_Tube];
            let allocation = [];
            for (let i = 0;i < totalFactories;i++) {
                // Attempting to allocate
                // Must be possible (positive temp_rates), as well as lowers ratio error
                let posAllocation = null
                let posAllocationError = 1e10;
                for (let j = 0;j < decBtns.length;j++) {
                    let tempError = 0;
                    switch(j) {
                        case 0: {
                            // Luxury Goods
                            if (luxPriority > 0 && resources.Furs.temp_rate > luxFurCost) {
                                tempError += ((wantedLux+1)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (luxPriority > 0 && resources.Furs.temp_rate > luxFurCost) {
                                tempError = 1e10 / prioMultipliers[0];
                            }
                            break;
                        }
                        case 1: {
                            // Alloy
                            if (alloyPriority > 0 && resources.Copper.temp_rate > alloyCopperCost && resources.Aluminium.temp_rate > alloyAluminiumCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy+1)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (alloyPriority > 0 && resources.Copper.temp_rate > alloyCopperCost && resources.Aluminium.temp_rate > alloyAluminiumCost) {
                                tempError = 1e10 / prioMultipliers[1];
                            }
                            break;
                        }
                        case 2: {
                            // Polymer
                            if (polymerPriority > 0 && resources.Oil.temp_rate > polymerOilCost && resources.Lumber.temp_rate > polymerLumberCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer+1)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (polymerPriority > 0 && resources.Oil.temp_rate > polymerOilCost && resources.Lumber.temp_rate > polymerLumberCost) {
                                tempError = 1e10 / prioMultipliers[2];
                            }
                            break;
                        }
                        case 3: {
                            // Nano Tubes
                            console.log(nanoTubePriority, resources.Coal.temp_rate, resources.Neutronium.temp_rate);
                            if (nanoTubePriority > 0 && resources.Coal.temp_rate > nanoTubeCoalCost && resources.Neutronium.temp_rate > nanoTubeNeutroniumCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube+1)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (nanoTubePriority > 0 && resources.Coal.temp_rate > nanoTubeCoalCost && resources.Neutronium.temp_rate > nanoTubeNeutroniumCost) {
                                tempError = 1e10 / prioMultipliers[3];
                            }
                            break;
                        }
                        default:
                            break;
                    }
                    // Availible Choice
                    console.log(j, tempError)
                    if (tempError != 0) {
                        if (tempError < posAllocationError) {
                            posAllocation = j;
                            posAllocationError = tempError;
                        }
                    } else {
                        continue;
                    }
                }
                if (posAllocation === null) {
                    break;
                } else {
                    allocation.push(posAllocation);
                    switch(posAllocation) {
                        case 0: {wantedLux += 1; resources.Furs.temp_rate -= luxFurCost; break;}
                        case 1: {wantedAlloy += 1; resources.Copper.temp_rate -= alloyCopperCost; resources.Aluminium.temp_rate -= alloyAluminiumCost; break;}
                        case 2: {wantedPolymer += 1; resources.Oil.temp_rate -= polymerOilCost; resources.Lumber.temp_rate -= polymerLumberCost; break;}
                        case 3: {wantedNanoTube += 1; resources.Coal.temp_rate -= nanoTubeCoalCost; resources.Neutronium.temp_rate -= nanoTubeNeutroniumCost; break;}
                        default: break;
                    }
                }
            }
            console.log("L",wantedLux,"A",wantedAlloy,"P",wantedPolymer,"N",wantedNanoTube);
            console.log(allocation);
            // Removing all settings
            for (let i = 0;i < totalFactories;i++) {
                decBtns.click();
            }
            for (let i = 0;i < allocation.length;i++) {
                incBtns[allocation[i]].click();
            }
            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }

    function _autoSupport(priorityData) {
        // Don't start autoSupport if haven't unlocked power
        if (!researched('tech-electricity')) {return;}
        var x;
        // Generating unlocked producers and consumers
        var ps = [];
        var cs = [];
        for (x in elecProducers) {
            if (elecProducers[x].unlocked) {
                ps.push(elecProducers[x]);
            }
        }
        for (x in elecConsumers) {
            if (elecConsumers[x].unlocked) {
                cs.push(elecConsumers[x]);
            }
        }
        cs.sort(prioCompare);
        //console.log(ps, cs);
        // Turn on all possible producers
        for (let i = 0;i < ps.length;i++) {
            let p = ps[i];
            p.delta = 0;
            // Calculate whether to turn off
            let needTurnOff = false;
            for (let j = 0;j < p.consume.length;j++) {
                let res = p.consume[j].res;
                if (res.rate < 0) {
                    needTurnOff = true;
                }
            }
            // A resource that this producer needs is decreasing
            if (needTurnOff && p.numOn > 0) {
                p.decBtn.click();
                p.delta = -1;
                continue;
            }
            // Calculate whether to turn on
            let canTurnOn = true;
            for (let j = 0;j < p.consume.length;j++) {
                let res = p.consume[j].res;
                let cost = p.consume[j].cost;
                if (res.rate < cost) {
                    canTurnOn = false;
                }
            }
            if (canTurnOn && p.numOn < p.numTotal) {
                p.incBtn.click();
                p.delta = 1;
            }
        }
        // Calculate total possible power
        let totalPower = 0;
        for (let i = 0;i < ps.length;i++) {
            let p = ps[i];
            totalPower += p.produce * (p.numOn + p.delta)
        }
        //console.log("Total Power:", totalPower);
        // Distribute power to needed buildings
        for (let i = 0;i < cs.length;i++) {
            let c = cs[i];
            // Have some power left to give
            if (totalPower > 0) {
                let canTurnOn = (totalPower - (totalPower % c.consume)) / c.consume;
                canTurnOn = Math.min(canTurnOn, c.numTotal);
                if (c.numOn > canTurnOn) {
                    for (let j = 0;j < c.numOn - canTurnOn;j++) {
                        c.decBtn.click();
                    }
                } else {
                    for (let j = 0;j < canTurnOn - c.numOn;j++) {
                        c.incBtn.click();
                    }
                }
                totalPower -= canTurnOn * c.consume;
                //console.log(c, canTurnOn);
            // Run out of power
            } else {
                for (let j = 0;j < c.numOn;j++) {
                    c.decBtn.click();
                }
                //console.log(c, 0);
            }
        }
    }

    function isFuelProducer(building) {
        let fuels = ['Coal', 'Oil', 'Uranium', 'Helium_3','Elerium'];
        let yes = false;
        for (let i = 0;i < building.produce.length;i++) {
            if (resources[building.produce[i].res] !== undefined) {
                if (building.produce[i].res in fuels) {
                    yes = true;
                }
            }
        }
        return yes;
    }
    function autoSupport(priorityData) {
        // Don't start autoSupport if haven't unlocked power
        if (!researched('tech-electricity')) {return;}
        let x;
        // Getting support categories
        let maximize = []; let maximize_want = [];
        let electricityConsumers = []; let electricityConsumers_want = [];
        let passiveProducers = [];
        let moonConsumers = []; let moonConsumers_want = [];
        let redConsumers = []; let redConsumers_want = [];
        let beltConsumers = []; let beltConsumers_want = [];
        let swarmConsumers = []; let swarmConsumers_want = [];
        for (x in buildings) {
            // Ignore not unlocked buildings
            if (!buildings[x].unlocked) {continue;}
            // Ignore not power unlocked buildings
            if (!buildings[x].powerUnlocked) {continue;}
            // Ignore non-powered buildings
            if (!(buildings[x] instanceof PoweredBuilding)) {continue;}
            // Reverting consumption/production
            for (let i = 0;i < buildings[x].consume.length;i++) {
                if (resources[buildings[x].consume[i].res] !== undefined) {
                    resources[buildings[x].consume[i].res].temp_rate += buildings[x].numOn * buildings[x].consume[i].cost;
                }
                else {

                }
            }
            for (let i = 0;i < buildings[x].produce.length;i++) {
                if (resources[buildings[x].produce[i].res] !== undefined) {
                    resources[buildings[x].produce[i].res].temp_rate -= buildings[x].numOn * buildings[x].produce[i].cost * getMultiplier(buildings[x].produce[i].res) * getMultiplier('Global');
                }
                else {

                }
            }
            // Splitting buildings by type
            if (buildings[x].consume.length >= 2) {
                // Multiple consumptions means a complex powered building
                maximize.push(buildings[x]);
                maximize_want.push(0);
            } else if (buildings[x].consume.length == 0) {
                // No consumption means building's always on
                passiveProducers.push(buildings[x]);
            } else if (resources[buildings[x].consume[0].res] !== undefined) {
                // Resource consumer
                maximize.push(buildings[x]);
                maximize_want.push(0);
            } else if (isFuelProducer(buildings[x])) {
                // Resource producer
                maximize.push(buildings[x]);
                maximize_want.push(0);
            } else if (buildings[x].consume[0].res == "electricity") {
                // Electricity consumer
                electricityConsumers.push(buildings[x]);
                electricityConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "moon_support") {
                // Moon Support consumer
                moonConsumers.push(buildings[x]);
                moonConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "red_support") {
                // Red Support consumer
                redConsumers.push(buildings[x]);
                redConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "belt_support") {
                // Belt Support consumer
                beltConsumers.push(buildings[x]);
                beltConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "swarm_support") {
                // Swarm Support consumer
                swarmConsumers.push(buildings[x]);
                swarmConsumers_want.push(0);
            }
        }

        //console.log("Max",maximize);
        //console.log("Passive",passiveProducers);
        //console.log("Electricity", electricityConsumers);
        //console.log("Moon", moonConsumers);
        //console.log("Red", redConsumers);
        //console.log("Belt", beltConsumers);

        let support = {
            electricity:0,
            moon_support:0,
            red_support:0,
            swarm_support:0,
            belt_support:0
        }

        // Add all passive producers
        for (let i = 0;i < passiveProducers.length;i++) {
            let pp = passiveProducers[i];
            for (let j = 0;j < pp.produce.length;j++) {
                if (resources[pp.produce[j].res] !== undefined) {
                    resources[pp.produce[j].res].temp_rate += pp.numTotal * pp.produce[j].cost;
                } else {
                    support[pp.produce[j].res] += pp.numTotal * pp.produce[j].cost;
                }
            }
        }
        // Add all swarm support (since it's only one thing

        // Maximizing the maximize category
        maximize.sort(function(a,b) {return b.powerPriority - a.powerPriority;});
        let update = true;
        // Looping until cannot turn on any more buildings
        while(true) {
            update = false;
            // Looping to find building to turn on
            for (let i = 0;i < maximize.length;i++) {
                let building = maximize[i];
                if (maximize_want[i] == building.numTotal) {continue;}
                let canTurnOn = true;
                // Checking if this building can be turned on by resources
                for (let j = 0;j < building.consume.length;j++) {
                    let res = building.consume[j].res;
                    let cost = building.consume[j].cost;
                    if (resources[res] !== undefined) {
                        //console.log("Checking",building.id,"RES",res.id,res.temp_rate,cost);
                        if (res.temp_rate < cost) {
                            canTurnOn = false;
                        }
                    } else {
                        if (support[res] < cost) {
                            canTurnOn = false;
                        }
                    }
                }
                if (canTurnOn) {
                    // Turning on building
                    update = true;
                    maximize_want[i] += 1;
                    for (let j = 0;j < building.consume.length;j++) {
                        let res = building.consume[j].res;
                        let cost = building.consume[j].cost;
                        if (resources[res] !== undefined) {
                            res.temp_rate -= cost;
                        } else {
                            support[res] -= cost;
                        }
                    }
                    for (let j = 0;j < building.produce.length;j++) {
                        let res = building.produce[j].res;
                        let cost = building.produce[j].cost;
                        if (resources[res] !== undefined) {
                            res.temp_rate += cost;
                        } else {
                            support[res] += cost;
                        }
                    }
                    //console.log("Turning on", building.id, maximize_want[i], building.numTotal);
                    break;
                }
            }
            if (!update) {
                break;
            }
        }
        console.log(maximize, maximize_want);
        electricityConsumers.sort(function(a,b) {return b.powerPriority - a.powerPriority;});
        if (electricityConsumers.length) {
            while (support.electricity > 0) {
                update = false;
                // Looping to find building to turn on
                for (let i = 0;i < electricityConsumers.length;i++) {
                    let building = electricityConsumers[i];
                    if (electricityConsumers_want[i] == building.numTotal) {continue;}
                    let canTurnOn = true;
                    // Checking if this building can be turned on by resources
                    for (let j = 0;j < building.consume.length;j++) {
                        let res = building.consume[j].res;
                        let cost = building.consume[j].cost;
                        if (resources[res] !== undefined) {
                            //console.log("Checking",building.id,"RES",res.id,res.temp_rate,cost);
                            if (res.temp_rate < cost) {
                                canTurnOn = false;
                            }
                        } else {
                            if (support[res] < cost) {
                                canTurnOn = false;
                            }
                        }
                    }
                    if (canTurnOn) {
                        // Turning on building
                        update = true;
                        electricityConsumers_want[i] += 1;
                        for (let j = 0;j < building.consume.length;j++) {
                            let res = building.consume[j].res;
                            let cost = building.consume[j].cost;
                            if (resources[res] !== undefined) {
                                res.temp_rate -= cost;
                            } else {
                                support[res] -= cost;
                            }
                        }
                        for (let j = 0;j < building.produce.length;j++) {
                            let res = building.produce[j].res;
                            let cost = building.produce[j].cost;
                            if (resources[res] !== undefined) {
                                res.temp_rate += cost;
                            } else {
                                support[res] += cost;
                            }
                        }
                        //console.log("Turning on", building.id, maximize_want[i], building.numTotal);
                        break;
                    }
                }
                if (!update) {
                    break;
                }
            }
        }
        console.log(electricityConsumers,electricityConsumers_want);
        for (let i = 0;i < maximize.length;i++) {
            if (maximize[i].numOn < maximize_want[i]) {
                for (let j = 0;j < maximize_want[i] - maximize[i].numOn;j++) {
                    maximize[i].incPower();
                }
            } else {
                for (let j = 0;j < maximize[i].numOn - maximize_want[i];j++) {
                    maximize[i].decPower();
                }
            }
        }
        for (let i = 0;i < electricityConsumers.length;i++) {
            if (electricityConsumers[i].numOn < electricityConsumers_want[i]) {
                for (let j = 0;j < electricityConsumers_want[i] - electricityConsumers[i].numOn;j++) {
                    electricityConsumers[i].incPower();
                }
            } else {
                for (let j = 0;j < electricityConsumers[i].numOn - electricityConsumers_want[i];j++) {
                    electricityConsumers[i].decPower();
                }
            }
        }
        console.log(support)
        // Optimizing each support
    }

    function getAvailableBuildings() {
        let build = [];
        for (var x in buildings) {
            // Don't check buildings that aren't unlocked
            if (!buildings[x].unlocked) {continue;}
            // Don't check buildings that aren't enabled
            if (!buildings[x].enabled) {continue;}
            // Don't check buildings that met their limit
            if (buildings[x].limit != -1 && buildings[x].numTotal >= buildings[x].limit) {continue;}
            // Don't check buildings that can't be bought
            let btn = document.getElementById(buildings[x].id);
            // If button doesn't exist but it's a space dock building, bring it anyways
            if (btn === null && (x=='spcdock-probes'||x=='spcdock-seeder')) {build.push(buildings[x]);continue;}
            if (btn.className.indexOf('cnam') >= 0) {continue;}
            build.push(buildings[x]);
        }
        //console.log(build);
        return build;
    }
    function getAvailableResearches() {
        let research = [];
        for (var x in researches) {
            // Don't check researches that aren't unlocked
            if (!researches[x].unlocked) {continue;}
            // Don't check researches that aren't enabled
            if (!researches[x].enabled) {continue;}
            // Don't check researches that have already been researched
            if (researches[x].researched) {continue;}
            // Don't check researches that can't be bought
            let btn = document.getElementById(researches[x].id);
            if (btn.className.indexOf('cnam') >= 0) {continue;}
            // Research filters
            if(researches[x].id == "tech-fanaticism" && settings.fanORanth == "anthropology") {continue;}
            if(researches[x].id == "tech-anthropology" && settings.fanORanth == "fanaticism") {continue;}
            // Checking if study/deify ancients
            if(researches[x].id == "tech-study" && settings.studyORdeify == "deify") {continue;}
            if(researches[x].id == "tech-deify" && settings.studyORdeify == "study") {continue;}
            // Checking if unification
            if(researches[x].id.indexOf("wc") >= 0) {
                if (settings.uniChoice == 'unify') {
                    if (researches[x].id == 'tech-wc_reject') {continue;}
                } else {
                    if (researches[x].id == 'tech-wc_conquest' || researches[x].id == 'tech-wc_morale' || researches[x].id == 'tech-wc_money') {continue;}
                }
            }
            research.push(researches[x]);
        }
        //console.log(research);
        return research;
    }
    function getAvailableArpas() {
        let arpa = [];
        for (var x in arpas) {
            // Don't add ARPAs that are not unlocked
            if (!arpas[x].unlocked) {continue;}
            // Don't add ARPAs that are not enabled
            if (!arpas[x].enabled) {continue;}
            arpa.push(arpas[x]);
        }
        return arpa;
    }
    function getAvailableStorages() {
        let store = [];
        for (var x in storages) {
            // Don't add if not unlocked
            if (!storages[x].unlocked) {continue;}
            // Don't add if no more space
            if (storages[x].full) {continue;}
            store.push(storages[x]);
        }
        return store;
    }
    function getAvailableActions() {
        // Getting buildings and researches
        let actions = getAvailableBuildings().concat(getAvailableResearches()).concat(getAvailableArpas()).concat(getAvailableStorages());

        for (let i = 0;i < actions.length;i++) {
            actions[i].completion = {};
            actions[i].completionTime = {};
            actions[i].maxCompletionTime = 0;
            actions[i].limitingRes = null;
            actions[i].keptRes = {};
        }
        return actions;
    }
    function getAvailableResources() {
        let res = [];
        for (var x in resources) {
            if (!resources[x].unlocked) {continue;}
            res.push(resources[x]);
        }
        return res;
    }
    function autoPrioritize(count) {
        // Finding available actions
        let actions = getAvailableActions();
        //console.log(actions);

        // Storing temporary rates
        for (var x in resources) {
            resources[x].temp_rate = resources[x].rate;
        }

        // Removing trade routes (if exists) for accurate rate
        if (researched('tech-trade')) {
            // Clearing out trade routes
            for (x in resources) {
                let resource = resources[x];
                resource.temp_rate = resource.rate;
                if (!(resource instanceof TradeableResource)) {continue;}
                if (resource.tradeNum < 0) {
                    for (let i = 0;i < -resource.tradeNum;i++) {
                        resource.tradeInc();
                        resource.temp_rate += resource.tradeAmount;
                        resources.Money.temp_rate -= resource.tradeSellCost;
                    }
                } else {
                    for (let i = 0;i < resource.tradeNum;i++) {
                        resource.tradeDec();
                        resource.temp_rate -= resource.tradeAmount;
                        resources.Money.temp_rate += resource.tradeBuyCost;
                    }
                }
            }
        }

        // Create priority queues for resources
        let res = getAvailableResources();
        let PQs = {}
        let limits = {}
        // Creating priority queues for each resource
        for (let i = 0;i < res.length;i++) {
            let curRes = res[i];
            let pq = [];
            // Checking each action for resource dependence
            for (let j = 0;j < actions.length;j++) {
                let cost = actions[j].getResDep(curRes.id);
                if (cost !== null && cost !== NaN && cost > 0) {
                    pq.push(actions[j]);
                    // Setting up completion attribute
                    actions[j].completion[curRes.id.toLowerCase()] = false;
                }
            }
            // Sorting actions by scaled priority
            pq.sort(function(a,b) {
                let aCost = priorityScale(a.getResDep(curRes.id), a.priority, a);
                let bCost = priorityScale(b.getResDep(curRes.id), b.priority, b);
                return aCost > bCost;
            });

            // Finding completion time and limiting resource
            for (let j = 0;j < pq.length;j++) {
                let action = pq[j];
                // Already completed with current resources
                // Scaling by 1.01 for rounding error
                if (curRes.amount >= action.getResDep(curRes.id)) {
                    action.completionTime[curRes.id] = 0;
                } else {
                    let time = (action.getResDep(curRes.id) - curRes.amount) / curRes.temp_rate;
                    time = (time < 0) ? 1 : time;
                    action.completionTime[curRes.id] = time;
                    //console.log(action.id, curRes.id, action.getResDep(curRes.id), curRes.amount, curRes.temp_rate, time);
                    if (time > action.maxCompletionTime) {
                        action.maxCompletionTime = time;
                        action.limitingRes = curRes.id;
                    }
                }

            }
            PQs[curRes.id] = pq;
        }

        // Determining completion
        for (let i = 0;i < res.length;i++) {
            let curRes = res[i];
            let pq = PQs[curRes.id];
            limits[curRes.id] = null;
            // Determining resource completion
            // Resource filled, set all to completion
            if (!(curRes instanceof CraftableResource) && curRes.ratio > 0.99) {
                //console.log(curRes.id, "ratio > 0.99. Set all to complete");
                for (let j = 0;j < pq.length;j++) {
                    pq[j].completion[curRes.id.toLowerCase()] = true;
                }
            // Resource not full, allocate until reached action not filled.
            } else {
                let curAmount = curRes.amount;
                //console.log(curRes.id, curAmount);
                for (let j = 0;j < pq.length;j++) {
                    let action = pq[j];
                    //console.log(pq[j].id, pq[j].getResDep(curRes.id) , curAmount);
                    if (action.getResDep(curRes.id) <= curAmount) {
                        // Action can be achieved with this resource
                        action.completion[curRes.id.toLowerCase()] = true;
                        // Determining how much of the resource to save for this action
                        /*
                        let giveAmount = (action.maxCompletionTime - action.completionTime[curRes.id]) * curRes.temp_rate;
                        let give = Math.min(giveAmount,curAmount);
                        action.keptRes[curRes.id] = curAmount - give;
                        curAmount = give;
                        */

                        if (action.limitingRes == curRes.id) {
                            // This resource is the limiting factor, give nothing to the next actions
                            action.keptRes[curRes.id] = action.getResDep(curRes.id);
                            curAmount -= action.keptRes[curRes.id];
                        } else {
                            // This resource isn't the limiting factor, give some leeway
                            // Higher priority, less leeway given
                            // Limiting resource will take a long time to complete, give more leeway
                            let priorityFactor = 1 / (1.0 + Math.exp(-0.1 * action.priority));
                            let timeFactor = Math.exp(-.005 * action.maxCompletionTime);
                            action.keptRes[curRes.id] = priorityFactor * timeFactor * action.getResDep(curRes.id)/(i+1);
                            curAmount -= action.keptRes[curRes.id];
                        }

                    } else {
                        // Action cannot be achieved with this resource
                        limits[curRes.id] = action;
                        break;
                    }
                }
            }

        }

        // Purchasing complete actions
        actions.sort(prioCompare);
        console.log("ACT:", actions);
        for (let i = 0;i < actions.length;i++) {
            let action = actions[i];
            let canBuy = true;
            for (x in action.completion) {
                if (!action.completion[x]) {
                    canBuy = false;
                    break;
                }
            }
            if (canBuy) {
                console.log(action.id, "can buy");
                let clicked = action.click();
                // Don't count unification research
                if (action.id == 'tech-wc_conquest' || action.id == 'tech-wc_morale' || action.id == 'tech-wc_money' || action.id == 'tech-wc_reject') {
                    clicked = false;
                }
                if (clicked) {
                    if (settings.autoPrint) {
                        messageQueue(getTotalGameDays().toString() + " [AUTO-PRIORITY] " + action.name, 'warning');
                        //if (action.id == 'tech-mad') {
                        //    settings.log.push(getTotalGameDays());
                        //}
                    }
                    break;
                }
            }
        }
        if (settings.autoSmelter && (count % settings.smelterSettings.interval == 0)) {
            autoSmelter(limits);
        }
        else if (settings.autoFactory && (count % settings.factorySettings.interval == 0)) {
            autoFactory(limits);
        }
        else if (settings.autoSupport) {
            autoSupport(limits);
        }

        // Determining rate priorities
        console.log("LIM:", limits);
        console.log("PQ:", PQs);

        return {limits:limits,PQs:PQs}
    }

    function autoTrade(priorityData) {
        // If haven't researched trade, don't do anything
        if (!researched('tech-trade')) {return;}
        // Haven't made non-AutoPrioritize autoTrade, so ignore otherwise
        if (priorityData === null) {return;}
        let limits = priorityData.limits
        let PQs = priorityData.PQs
        // Finding total trade routes
        let totalTradeRouteStr = $('#tradeTotal').children()[0].innerText;
        let totalTradeRoutes = parseInt(/Trade Routes [\d]+ \/ ([\d]+)/.exec(totalTradeRouteStr)[1]);
        // Finding full resources
        let sellingRes = [];
        for (var x in resources) {
            if (!resources[x].unlocked) {continue;}
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            if (resources[x].ratio < 0.99) {continue;}
            sellingRes.push(resources[x]);
        }
        // Sort by sell cost
        sellingRes.sort(function(a,b) {
            return a.tradeSellCost < b.tradeSellCost;
        });
        // Finding sequence of selling trade routes
        let sellSequence = [];
        for (let i = 0;i < sellingRes.length;i++) {
            let res = sellingRes[i];
            let maxRoutes = Math.floor(res.temp_rate / res.tradeAmount);
            let sellRoutes = (maxRoutes < totalTradeRoutes) ? maxRoutes : totalTradeRoutes;
            for (let j = 0;j < sellRoutes;j++) {sellSequence.push(res.id);}
        }
        console.log("SELL SEQ:", sellSequence);

        // Finding resource to focus on
        let focusList = [];
        for (x in limits) {
            // There exists an action that requires this resource
            if (limits[x] === null) {continue;}
            // Excluding craftable resources
            if (!(x in resources)) {continue;}
            // Excluding untradeable resources
            if (!(resources[x] instanceof TradeableResource) && x != 'Money') {continue;}
            // Excluding actions whose resource is already filled
            if (limits[x].completion[x] == true) {continue;}
            focusList.push({action:limits[x], res:x});
            //console.log(x, limits[x].id, limits[x].completionTime, priorityScale(Math.log(limits[x].completionTime[x]), limits[x].priority), limits[x].priority);
        }
        if (focusList.length > 0) {
            focusList.sort(function(a,b) {
                return prioCompare(a.action, b.action);
            });
        }
        console.log("FOC LIST:", focusList);
        let focusSequence = [];
        let curNum = {};
        let curRatio = {};
        let wantedRatio = {};
        let totalPriority = 0;
        let priorities = [];
        let ratios = [];
        let keys = [];
        let allocations = {};
        if (focusList.length > 0) {
            // Creating sequence of trade route allocations to match priority ratios
            let curError = 0;
            for (let i = 0;i < focusList.length;i++) {totalPriority += (resources[focusList[i].res].priority * focusList[i].action.priority)**2;}
            for (let i = 0;i < focusList.length;i++) {
                curNum[focusList[i].res] = 0;
                wantedRatio[focusList[i].res] = (resources[focusList[i].res].priority * focusList[i].action.priority)**2 / totalPriority;
                if (wantedRatio[focusList[i].res] * totalTradeRoutes < 1) {wantedRatio[focusList[i].res] = 0;}
                if (focusList[i].res !== 'Money') {
                    priorities.push(resources[focusList[i].res].priority);
                    ratios.push(wantedRatio[focusList[i].res]);
                    keys.push(focusList[i].res);
                }
                //if (focusList[i].res == 'Money') {wantedRatio[focusList[i].res] /= totalPriority;}
                //console.log(focusList[i].res, focusList[i].action.priority , resources[focusList[i].res].basePriority, wantedRatio[focusList[i].res],  wantedRatio[focusList[i].res] * totalTradeRoutes);
            }
            allocations = allocate(totalTradeRoutes,priorities,ratios);
        }
        // Allocating trade routes
        focusSequence = allocations['seq'];
        let curFocus = 0;
        let curSell = 0;
        if (focusList.length > 0) {
            // Allocating all possible trade routes with given money
            let curFreeTradeRoutes = totalTradeRoutes;
            // Keeping fraction of base money for money
            if (wantedRatio.Money > 0) {resources.Money.temp_rate *= 1 - wantedRatio.Money;}
            //console.log(wantedRatio.Money,resources.Money.temp_rate);
            // Begin allocating algorithm
            while (resources.Money.temp_rate > 0 && curFreeTradeRoutes > 0) {
                // Checking if can buy trade route
                if (focusSequence.length > 0 && resources.Money.temp_rate > resources[keys[focusSequence[curFocus]]].tradeBuyCost) {
                    // Can buy trade route
                    //console.log("Buying", focusSequence[curFocus], curFocus);
                    resources[keys[focusSequence[curFocus]]].tradeInc();
                    resources.Money.temp_rate -= resources[keys[focusSequence[curFocus]]].tradeBuyCost;
                    curFreeTradeRoutes -= 1;
                    curFocus += 1;
                } else {
                    // Cannot buy trade route, sell instead
                    if (curSell == sellSequence.length) {break;}
                    resources[sellSequence[curSell]].tradeDec();
                    resources.Money.temp_rate += resources[sellSequence[curSell]].tradeSellCost;
                    curFreeTradeRoutes -= 1;
                    curSell += 1;
                }
            }
        }
    }

    function allocate(totalNum,priorities,ratios) {
        let allocationList = [];
        let curNum = [];
        for (let i = 0;i < priorities.length;i++) {curNum.push(0);}
        for (let i = 0;i < totalNum;i++) {
            // Calculating error based on next value choice
            let error = -1;
            let choice = -1;
            for (let j = 0;j < priorities.length;j++) {
                if (priorities[j] == 0 || ratios[j] == 0) {continue;}
                let total = i+1;
                let tempError = 0;
                // Finding new error based on adding this trade route
                for (let k = 0;k < priorities.length;k++) {
                    if (j == k) {
                        // Currently attempting to add a trade route to this resource
                        tempError += (((curNum[k]+1) / total) - ratios[k]) ** 2;
                    } else {
                        tempError += ((curNum[k] / total) - ratios[k]) ** 2;
                    }
                }
                if (error == -1 || tempError < error) {
                    error = tempError;
                    choice = j;
                }
            }
            if (choice == -1) {
                break;
            }
            allocationList[i] = choice;
            curNum[choice] += 1;
        }
        return {seq:allocationList,alloc:curNum};
    }

    let count = 1;
    function fastAutomate() {
        console.clear();
        //console.log(LZString.decompressFromUTF16(window.localStorage['evolved']));
        console.log(count);
        updateUI();
        updateSettings();
        autoFarm();
        if (inEvolution()) {
            // Evolution Automation
            if(settings.autoEvolution) {
                autoEvolution();
            }
        } else {
            // Civilization Automation
            var priorityData = null;
            if(settings.autoPrioritize) {
                priorityData = autoPrioritize(count);
            }
            autoTrade(priorityData);
            if(settings.autoCraft){
                autoCraft();
            }
            if(settings.autoEmploy){
                autoEmploy(priorityData);
            }
            if(settings.autoTax) {
                autoTax();
            }
            if(settings.autoBattle){
                autoBattler.autoBattle();
            }
            if(settings.autoMarket){
                autoMarket();
            }
            if (settings.autoStorage) {
                autoStorage();
            }
        }
        count += 1;
    }
    setInterval(fastAutomate, 1000);


    setInterval(function() {
        location.reload();
    }, 200*1000);

    /***
    *
    * Setup UI
    *
    ***/

    function createSettingToggle(name, title, enabledCallBack, disabledCallBack){
        let parent = $('#resources');
        let toggle = $('<label tabindex="0" class="switch" id="'+name+'_toggle" style="" title="'+title+'"><input type="checkbox" value=false> <span class="check"></span><span>'+name+'</span></label>');
        let divLeft = $('<div id="'+name+'_left" style="float:left">').append(toggle).append($('</div>'));
        let divRight = $('<div id="'+name+'_right" style="float:right"></div>');
        let mainDiv = $('<div id="'+name+'" style="overflow:auto">').append(divLeft).append(divRight).append($('</div>'));
        parent.append(mainDiv);
        if(settings[name]){
            toggle.click();
            toggle.children('input').attr('value', true);
            if(enabledCallBack !== undefined){
                enabledCallBack();
            }
        }
        toggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            settings[name] = state;
            console.log("Setting", name, "to", state);
            updateSettings();
            if(state && enabledCallBack !== undefined){
                enabledCallBack();
            } else if(disabledCallBack !== undefined){
                disabledCallBack()
            }
        });
    }
    function createNumControl(settingVal,settingName,subFunc,addFunc) {
        let subBtn = $('<span role="button" aria-label="Decrease '+settingName+'" class="sub">«</span>');
        let label = $('<span id="'+settingName+'_control" class="count current" style="width:2rem;">'+settingVal+'</span>');
        subBtn.on('mouseup', function(e) {
            document.getElementById(settingName+'_control').innerText = subFunc();
            updateSettings();
        });
        let addBtn = $('<span role="button" aria-label="Increase '+settingName+'" class="add">»</span>');
        addBtn.on('mouseup', function(e) {
            document.getElementById(settingName+'_control').innerText = addFunc();
            updateSettings();
        });
        let control = $('<div class="controls ea-'+settingName+'-settings" style="display:flex">').append(subBtn).append(label).append(addBtn).append('</div>');
        return control;
    }

    function updateUI(){
        if ($('#autoPrint').length == 0) {
            createSettingToggle('autoPrint', 'Turns on print statements for autoscript messages');
        }
        if ($('.ea-autolog').length == 0) {
            createAutoLog();
        }
        if ($('#reload').length == 0) {
            let reloadBtn = $('<a class="button is-dark is-small" id="reload" title="Resets UI and internal data"><span>Reload</span></a>');
            reloadBtn.on('mouseup', function(e){
                if (e.which != 1) {return;}
                resetUI();
                updateSettings();
                loadSettings();
            });
            $('#autoPrint_right').append(reloadBtn);
        }
        if ($('#autoFarm').length == 0){
            createSettingToggle('autoFarm', 'Turns on autofarming of resources');
        }
        if ($('#autoSettingTab').length == 0) {
            createSettingTab();
        }
        if ($('#autoEvolution').length == 0) {
            createSettingToggle("autoEvolution", "Automatically plays the evolution stage", createEvolutionSettings, removeEvolutionSettings);
        } else if (settings.autoEvolution && $('.ea-evolution-settings').length == 0) {
            createEvolutionSettings();
        }
        // Crafting requires foundries
        if ($('#autoStorage').length == 0) {
            createSettingToggle('autoStorage', 'Automatically assigns crates and containers to resources', createStorageSettings, removeStorageSettings);
        } else if (settings.autoStorage && $('.ea-storage-settings').length == 0 && researched('tech-containerization')) {
            createStorageSettings();
        }
        if ($('#autoCraft').length == 0) {
            createSettingToggle('autoCraft', 'Automatically crafts craftable resources when resource ratio is above 0.9', createCraftSettings, removeCraftSettings);
        } else if (settings.autoCraft && $('.ea-craft-settings').length == 0 && researched('tech-foundry')) {
            createCraftSettings();
        }
        if ($('#autoSmelter').length == 0) {
            createSettingToggle('autoSmelter', 'Automatically allocates resources in the smelter. See Buildings tab for more settings', createSmelterSettings, removeSmelterSettings);
        } else if (settings.autoSmelter && $('.ea-smelter-settings').length == 0 && researched('tech-smelting')) {
            createSmelterSettings();
        }
        if ($('#autoFactory').length == 0) {
            createSettingToggle('autoFactory', 'Automatically allocates resources in the factory. See Buildings tab for more settings', createFactorySettings, removeFactorySettings);
        } else if (settings.autoFactory && $('.ea-factory-settings').length == 0 && researched('tech-industrialization')) {
            createFactorySettings();
        }
        if ($('#autoSupport').length == 0) {
            createSettingToggle('autoSupport', 'Automatically powers buildings and supports space buildings. See the Support Tab for more settings');
        }
        if ($('#autoEmploy').length == 0) {
            createSettingToggle('autoEmploy', 'Autoemploys workers. See Civics page for job priorities', createEmploySettings, removeEmploySettings);
        } else if(settings.autoEmploy && ($('.ea-employ-settings').length == 0 || $('.ea-employ-craft-settings').length == 0)) {
            createEmploySettings();
        }
        // Tax requires tax rates researched
        if ($('#autoTax').length == 0) {
            createSettingToggle('autoTax', 'Automatically changes tax rate to match desired morale level', createTaxSettings, removeTaxSettings);
        }
        // Battles require garrisions
        if ($('#autoBattle').length == 0) {
            createSettingToggle('autoBattle', 'Automatically battles when all soldiers are ready. Changes the campaign type to match army rating');
        }
        // Markets require market researched
        if ($('#autoMarket').length == 0) {
            createSettingToggle('autoMarket', 'Auto buys/sells resources at certain ratios. See Market tab for more settings', createMarketSettings, removeMarketSettings);
        } else if (settings.autoMarket > 0 && $('.ea-market-settings').length == 0 && researched('tech-market')) {
            createMarketSettings()
        }
        if ($('#ea-settings').length == 0) {
            let settingsDiv = $('<div id="ea-settings" style="overflow:auto;" title="Sets the minimum amount of money to keep. Can input real money value or ratio"></div>');
            let minMoneyTxt = $('<div style="float:left;">Minimum money to keep :</div>')
            let minMoneyInput = $('<input type="text" class="input is-small" style="width:20%;float:right;"/>');
            minMoneyInput.val(settings.minimumMoney);
            let setBtn = $('<a class="button is-dark is-small" id="set-min-money" style="float:right;"><span>set</span></a>');
            settingsDiv.append(minMoneyTxt).append(setBtn).append(minMoneyInput);
            $('#resources').append(settingsDiv);

            setBtn.on('mouseup', function(e) {
                if (e.which != 1) {return;}
                let val = minMoneyInput.val();
                let minMoney = getRealValue(val);
                if(!isNaN(minMoney)){
                    console.log("Setting minimum Money", minMoney);
                    settings.minimumMoney = minMoney;
                    updateSettings();
                }
            });
        }
        if ($('#autoPrioritize').length == 0) {
            createSettingToggle('autoPrioritize', 'Complex priority system to control purchasing buildings and research');
        }

        if ($('#autoSettings').length == 0) {
            createAutoSettings();
        }
    }

    function resetUI() {
        console.log("Resetting UI");
        removeEvolutionSettings();
        removeStorageSettings();
        removeCraftSettings();
        removeSmelterSettings();
        removeFactorySettings();
        removeMarketSettings();
        removeEmploySettings();
        removeTaxSettings();
        $('.ea-autolog').remove();
        $('#reload').remove();
        $('#autoPrint').remove();
        $('#autoFarm').remove();
        $('#autoEvolution').remove();
        $('#autoStorage').remove();
        $('#autoCraft').remove();
        $('#autoSmelter').remove();
        $('#autoFactory').remove();
        $('#autoSupport').remove();
        $('#autoPrioritize').remove();
        $('#autoEmploy').remove();
        $('#autoTax').remove();
        $('#autoBattle').remove();
        $('#autoMarket').remove();
        $('#ea-settings').remove();
        $('#autoSettings').remove();
    }

    function createAutoSettings() {
        let parent = getTab("Settings");
        parent.append($('<br></br>')[0]);
        let mainDiv = $('<div id="autoSettings"></div>');
        let label = $('<label class="label">Import/Export Auto Settings</label>');
        let ctrlDiv = $('<div class="control is-clearfix"></div>');
        let textArea = $('<textarea id="settingsImportExport" class="textarea"></textarea>');
        ctrlDiv.append(textArea);
        let control = $('<div class="field"></div>');
        control.append(label).append(ctrlDiv);
        let importBtn = $('<button class="button">Import Settings</button><text> </text>');
        importBtn.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            importSettings();
        });
        let exportBtn = $('<button class="button">Export Settings</button>');
        exportBtn.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            exportSettings();
        });
        mainDiv.append(control).append(importBtn).append(exportBtn);
        parent.append(mainDiv[0]);
    }

    function createEvolutionToggle(name) {
        let parent = $('#resources');
        let toggle = $('<label tabindex="0" class="switch" id="'+name+'_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>'+name+'</span></label>');
        let box = $('<div id="'+name+'" class="ea-evolution-settings" style="padding-left:20px;"></div>');
        box.append(toggle);
        parent.append(box);
        if(settings[name]){
            toggle.click();
            toggle.children('input').attr('value', true);
        }
        toggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            settings[name] = state;
            updateSettings();
        });
    }
    function createEvolutionSettings() {
        removeEvolutionSettings();
        let evoDecision = $(`<select class="ea-evolution-settings" style="width:150px;">
                            <option value="elven">Elven</option>
                            <option value="orc">Orc</option>
                            <option value="human">Human</option>
                            <option value="troll">Troll</option>
                            <option value="orge">Ogre</option>
                            <option value="cyclops">Cyclops</option>
                            <option value="kobold">Kobold</option>
                            <option value="goblin">Goblin</option>
                            <option value="gnome">Gnome</option>
                            <option value="cath">Cath</option>
                            <option value="wolven">Wolven</option>
                            <option value="centuar">Centuar</option>
                            <option value="tortoisan">Tortoisan</option>
                            <option value="gecko">Gecko</option>
                            <option value="slitheryn">Slitheryn</option>
                            <option value="arraak">Arraak</option>
                            <option value="pterodacti">Pterodacti</option>
                            <option value="dracnid">Dracnid</option>
                            <option value="sporgar">Sporgar</option>
                            <option value="shroomi">Shroomi</option>
                            <option value="mantis">Mantis</option>
                            <option value="scorpid">Scorpid</option>
                            <option value="antid">Antid</option>
                            <option value="entish">Entish</option>
                            <option value="cacti">Cacti</option>
                            <option value="sharkin">Sharkin</option>
                            <option value="octigoran">Octigoran</option>
                            <option value="balorg">Balorg</option>
                            <option value="imp">Imp</option>
                            </select>`);
        evoDecision[0].value = settings.evolution;
        evoDecision[0].onchange = function(){
            settings.evolution = evoDecision[0].value;
            console.log("Changing target to ", settings.evolution);
            updateSettings();
        };
        $('#autoEvolution_right').append(evoDecision);
        createEvolutionToggle('Plasmid');
        createEvolutionToggle('Craft');
        createEvolutionToggle('CRISPR');
        createEvolutionToggle('Trade');
    }
    function removeEvolutionSettings() {
        $('.ea-evolution-settings').remove();
    }

    function createStorageSetting(id) {
        if (!resources[id].unlocked) {return;}
        if (!resources[id].crateable) {return;}
        let resourceSpan = $('#stack-'+resources[id].id);
        let div = $('<div class="ea-storage-settings" style="display:flex"></div>');
        let prioritySub = function() {
            resources[id].decStorePriority();
            return resources[id].storePriority;
        }
        let priorityAdd = function() {
            resources[id].incStorePriority();
            return resources[id].storePriority;
        }
        let priorityControls = createNumControl(resources[id].storePriority, id+"-store-priority", prioritySub, priorityAdd);
        div.append(priorityControls)

        let minSub = function() {
            resources[id].decStoreMin();
            return resources[id].storeMin;
        }
        let minAdd = function() {
            resources[id].incStoreMin();
            return resources[id].storeMin;
        }
        let minControls = createNumControl(resources[id].storeMin, id+"-store-min", minSub, minAdd);
        div.append(minControls)

        resourceSpan.append(div);
    }
    function createStorageSettings() {
        removeStorageSettings();
        // Creating labels
        let labelSpan = $('#createHead');
        let prioLabel = $('<div class="ea-storage-settings" style="display:inline-flex;margin-left:2rem"><span class="has-text-warning">Priority</span></div>');
        let minLabel = $('<div class="ea-storage-settings" style="display:inline-flex;margin-left:3rem"><span class="has-text-warning">Min</span></div>');
        labelSpan.append(prioLabel).append(minLabel);
        // Creating individual counters
        for (var x in resources) {
            createStorageSetting(x);
        }
    }
    function removeStorageSettings() {
        $('.ea-storage-settings').remove();
    }

    function createCraftToggle(resource){
        let resourceSpan = $('#res'+resource.id);
        let toggle = $('<label tabindex="0" class="switch ea-craft-settings" style="position:absolute; max-width:75px;margin-top: 4px;left:8%;"><input type="checkbox" value=false> <span class="check" style="height:5px;"></span></label>');
        resourceSpan.append(toggle);
        if(resource.enabled){
            toggle.click();
            toggle.children('input').attr('value', true);
        }
        toggle.on('mouseup', function(e){
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            resources[resource.id].enabled = state;
        });
    }
    function createCraftSettings(){
        removeCraftSettings();
        var x;
        for (x in resources) {
            if (resources[x] instanceof CraftableResource) {
                createCraftToggle(resources[x]);
            }
        }
    }
    function removeCraftSettings(){
        $('.ea-craft-settings').remove();
    }

    function createSmelterSettings() {
        // Create manual button for Auto Smelting
        let autoSmelterBtn = $('<a class="button is-dark is-small ea-smelter-settings" id="smelter-manual" title="Manually trigger Auto Smelting"><span>Manual</span></a>');
        autoSmelterBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            count = settings.smelterSettings.interval-1;
        });
        $('#autoSmelter_right').append(autoSmelterBtn);
    }
    function removeSmelterSettings() {
        $('.ea-smelter-settings').remove();
    }

    function createFactorySettings() {
        // Create manual button for Auto Factory
        let autoFactoryBtn = $('<a class="button is-dark is-small ea-factory-settings" id="factory-manual" title="Manually trigger Auto Factory"><span>Manual</span></a>');
        autoFactoryBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            count = settings.factorySettings.interval-1;
        });
        $('#autoFactory_right').append(autoFactoryBtn);
    }
    function removeFactorySettings() {
        $('.ea-factory-settings').remove();
    }

    function createMarketSetting(resource){
        let marketRow = $('#market-'+resource.id);

        let toggleBuy = $('<label tabindex="0" class="switch ea-market-settings" style=""><input type="checkbox" value=false> <span class="check" style="height:5px;"></span><span class="state"></span></label>');
        marketRow.append(toggleBuy);
        if(resource.autoBuy){
            toggleBuy.click();
            toggleBuy.children('input').attr('value', true);
        }
        toggleBuy.on('mouseup', function(e){
            if (e.which != 1) {return;}
            console.log("TEST");
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            resources[resource.id].autoBuy = state;
            let otherState = toggleSell.children('input').attr('value') === 'true';
            if(state && otherState){
                toggleSell.click();
                console.log("Turning off toggleSell");
                resources[resource.id].autoSell = false;
                toggleSell.children('input')[0].setAttribute('value',false);
            }
            resources[resource.id].autoBuy = state;
            updateSettings();
        });

        let buyRatioSub = function() {
            resource.buyDec();
            return resource.buyRatio;
        }
        let buyRatioAdd = function() {
            resource.buyInc();
            return resource.buyRatio;
        }
        let buyRatioControl = createNumControl(resource.buyRatio, resource.id+'-buy-ratio',buyRatioSub,buyRatioAdd);
        let div = $('<div class="ea-market-settings" style="display:flex"></div>');
        div.append(buyRatioControl);
        marketRow.append(div);

        let toggleSell = $('<label tabindex="0" class="switch ea-market-settings" style=""><input type="checkbox" value=false> <span class="check" style="height:5px;"></span><span class="state"></span></label>');
        marketRow.append(toggleSell);
        toggleSell.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            resources[resource.id].autoSell = state;
            let otherState = toggleBuy.children('input').attr('value') === 'true';
            if(state && otherState){
                toggleBuy.click();
                console.log("Turning off toggleBuy");
                resources[resource.id].autoBuy = false;
                toggleBuy.children('input')[0].setAttribute('value',false);
            }
            updateSettings();
        });
        if(resource.autoSell){
            toggleSell.click();
            toggleSell.children('input').attr('value', true);
        }
        let sellRatioSub = function() {
            resource.sellDec();
            return resource.sellRatio;
        }
        let sellRatioAdd = function() {
            resource.sellInc();
            return resource.sellRatio;
        }
        let sellRatioControl = createNumControl(resource.sellRatio, resource.id+'-sell-ratio',sellRatioSub,sellRatioAdd);
        div = $('<div class="ea-market-settings" style="display:flex"></div>');
        div.append(sellRatioControl);
        marketRow.append(div);
        let prioritySub = function() {
            resource.decBasePriority();
            return resource.basePriority;
        }
        let priorityAdd = function() {
            resource.incBasePriority();
            return resource.basePriority;
        }
        let priorityControl = createNumControl(resource.basePriority, resource.id+'-priority',prioritySub,priorityAdd);
        div = $('<div class="ea-market-settings" style="display:flex"></div>');
        div.append(priorityControl);
        marketRow.append(div);
    }
    function createMarketSettings(){
        removeMarketSettings();
        let mainDiv = document.getElementById('market');
        let div = $('<div class="market-item alt ea-market-settings"></div>');
        let manualBuyLabel = $('<span style="text-align:right;display:flex;margin-left:23rem;width:6rem;" title="Toggle to auto buy resources when under this ratio. Only buys when money is over minimum amount.">Manual Buy</span>')[0];
        let manualSellLabel = $('<span style="text-align:right;display:flex;margin-left:2rem;width:6rem;" title="Toggle to auto sell resources when over this ratio. Only sells when money is not capped.">Manual Sell</span>')[0];
        let tradePriorityLabel = $('<span style="text-align:right;display:flex;margin-left:2rem;width:6rem;" title="Priority for importing this resource through trade routes.">Priority</span>')[0];
        div.append(manualBuyLabel).append(manualSellLabel).append(tradePriorityLabel);
        mainDiv.insertBefore(div[0],mainDiv.children[1]);
        // Creating settings for TradeableResources
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            createMarketSetting(resources[x]);
        }
        // Creating trade setting for money
        let tradeRow = document.getElementById("tradeTotal");
        let moneyLabel = $('<span title="Priority of money when allocating trade routes">Money Priority</span>');
        let priorityDiv = $('<div class="ea-market-settings" style="display:flex;margin-left:6rem;"</div>');
        let prioritySub = function() {
            resources.Money.decBasePriority();
            return resources.Money.basePriority;
        }
        let priorityAdd = function() {
            resources.Money.incBasePriority();
            return resources.Money.basePriority;
        }
        let priorityControl = createNumControl(resources.Money.basePriority,"Money-trade-priority",prioritySub,priorityAdd);
        priorityDiv.append(moneyLabel).append(priorityControl);
        tradeRow.append(priorityDiv[0]);

        if($('#bulk-sell').length == 0 && researched('tech-market')){
            let bulkSell = $('<a class="ea-market-settings button is-dark is-small" id="bulk-sell"><span>Bulk Sell</span></a>');
            $('#autoMarket_right').append(bulkSell);
            bulkSell.on('mouseup', function(e){
                if (e.which != 1) {return;}
                autoMarket(true, true);
            });
        }
    }
    function removeMarketSettings(){
        $('.ea-market-settings').remove();
    }

    function createEmploySettings() {
        removeEmploySettings();
        for (var x in jobs) {
            let job = jobs[x];
            if (!job.unlocked) {continue;}
            if (job.id != "free" || job.name == 'Hunter') {
                if (job.id == "craftsman") {
                    let prioritySub = $('<span role="button" aria-label="Decrease '+job.name+' Priority" class="sub ea-employ-craft-settings">«</span>');
                    prioritySub.on('mouseup', function(e) {
                        jobs[job.id].lowerPriority();
                        jobs[job.id].updateUI();
                    });
                    let priorityAdd = $('<span role="button" aria-label="Increase '+job.name+' Priority" class="add ea-employ-craft-settings">»</span>');
                    priorityAdd.on('mouseup', function(e) {
                        jobs[job.id].higherPriority();
                        jobs[job.id].updateUI();
                    });
                    let priorityLabel = $('<span class="count current" id="'+job.id+'_priority" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:1.5rem;">'+job._priority+'</span>');
                    let priorityControls = $('<div class="foundry controls ea-employ-craft-settings" style="text-align:right;display:flex;margin-left:4.5rem">').append(prioritySub).append(priorityLabel).append(priorityAdd).append('</div>');
                    let parent = $('#foundry > .job > .foundry').parent();
                    parent.append(priorityControls);
                } else if (job.id == 'free') {
                    let prioritySub = $('<span role="button" aria-label="Decrease '+job.name+' Priority" class="sub ea-employ-settings">«</span>');
                    prioritySub.on('mouseup', function(e) {
                        jobs[job.id].lowerPriority();
                        jobs[job.id].updateUI();
                    });
                    let priorityAdd = $('<span role="button" aria-label="Increase '+job.name+' Priority" class="add ea-employ-settings">»</span>');
                    priorityAdd.on('mouseup', function(e) {
                        jobs[job.id].higherPriority();
                        jobs[job.id].updateUI();
                    });
                    let priorityLabel = $('<span class="count current" id="'+job.id+'_priority" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:1.5rem;">'+job._priority+'</span>');
                    let priorityControls = $('<div class="controls ea-employ-settings" style="text-align:right;display:flex;margin-left:4.5rem">').append(prioritySub).append(priorityLabel).append(priorityAdd).append('</div>');
                    $('#civ-'+job.id).append(priorityControls)
                }else {
                    let prioritySub = $('<span role="button" aria-label="Decrease '+job.name+' Priority" class="sub ea-employ-settings">«</span>');
                    prioritySub.on('mouseup', function(e) {
                        jobs[job.id].lowerPriority();
                        jobs[job.id].updateUI();
                    });
                    let priorityAdd = $('<span role="button" aria-label="Increase '+job.name+' Priority" class="add ea-employ-settings">»</span>');
                    priorityAdd.on('mouseup', function(e) {
                        jobs[job.id].higherPriority();
                        jobs[job.id].updateUI();
                    });
                    let priorityLabel = $('<span class="count current" id="'+job.id+'_priority" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:1.5rem;">'+job._priority+'</span>');
                    let priorityControls = $('<div class="controls ea-employ-settings" style="text-align:right;display:flex;margin-left:1.25rem">').append(prioritySub).append(priorityLabel).append(priorityAdd).append('</div>');
                    $('#civ-'+job.id).append(priorityControls)
                }

            } else {
                let parent = document.getElementById("civ-"+job.id);
                let priorityLabel = $('<span class="has-text-warning ea-employ-settings" style="text-align:right;min-width:9.25rem">Priority</span>');
                $('#civ-'+job.id).append(priorityLabel);
            }
        }
        for (x in craftJobs) {
            let cjob = craftJobs[x];
            if (!cjob.unlocked) {continue;}
            let prioritySub = $('<span role="button" aria-label="Decrease '+cjob.name+' Priority" class="sub ea-employ-craft-settings">«</span>');
            prioritySub.on('mouseup', function(e) {
                craftJobs[cjob.id].lowerPriority();
                craftJobs[cjob.id].updateUI();
            });
            let priorityAdd = $('<span role="button" aria-label="Increase '+cjob.name+' Priority" class="add ea-employ-craft-settings">»</span>');
            priorityAdd.on('mouseup', function(e) {
                craftJobs[cjob.id].higherPriority();
                craftJobs[cjob.id].updateUI();
            });
            let priorityLabel = $('<span class="count current" id="'+cjob.id+'_priority" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:1.5rem;">'+cjob.priority+'</span>');
            let priorityControls = $('<div class="controls ea-employ-craft-settings" style="text-align:right;display:flex;margin-left:1.25rem">').append(prioritySub).append(priorityLabel).append(priorityAdd).append('</div>');
            $('#craft'+cjob.id).parent().append(priorityControls)
        }
    }
    function removeEmploySettings() {
        $('.ea-employ-settings').remove();
        $('.ea-employ-craft-settings').remove();
    }

    function createTaxSettings() {
        let moraleText = $('<span>Set Default Morale:</span>');
        let moraleSub = $('<span role="button" aria-label="Decrease Morale" class="sub ea-tax-settings">«</span>');
        moraleSub.on('mouseup', function(e) {
            settings.defaultMorale -= 1;
            let count = $('#autoTax > div > .ea-tax-settings > .count')[0];
            count.removeChild(count.firstChild);
            count.appendChild(document.createTextNode(settings.defaultMorale));
            updateSettings();
        });
        let moraleAdd = $('<span role="button" aria-label="Increase Morale" class="add ea-tax-settings">»</span>');
        moraleAdd.on('mouseup', function(e) {
            settings.defaultMorale += 1;
            let count = $('#autoTax > div > .ea-tax-settings > .count')[0];
            count.removeChild(count.firstChild);
            count.appendChild(document.createTextNode(settings.defaultMorale));
            updateSettings();
        });
        let moraleLabel = $('<span class="count current" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:3rem;">'+settings.defaultMorale+'</span>');
        let moraleControls = $('<div class="controls ea-tax-settings" style="text-align:right;min-width:6rem;display:flex">').append(moraleText).append(moraleSub).append(moraleLabel).append(moraleAdd).append('</div>');
        $('#autoTax_right').append(moraleControls);
    }
    function removeTaxSettings() {
        $('.ea-tax-settings').remove();
    }

    function populateSmelterSettings(settingsTab) {
        let smelterLabel = $('<div><h3 class="name has-text-warning" title="Set the smelter settings">Smelter:</h3></div></br>');
        settingsTab.append(smelterLabel);
        Object.keys(settings.smelterSettings).forEach(function(res) {
            let resText = null;
            if (res == 'interval') {
                resText = $('<div style="width:12rem" title="Update the smelter every so much seconds">Interval Rate:</div>');
            } else {
                resText = $('<div style="width:12rem">'+res+' Priority:</div>');
            }
            let resSub = function() {
                settings.smelterSettings[res] -= 1;
                return settings.smelterSettings[res];
            }
            let resAdd = function() {
                settings.smelterSettings[res] += 1;
                return settings.smelterSettings[res];
            }
            let resControls = createNumControl(settings.smelterSettings[res], "smelter_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            settingsTab.append(newDiv);
        });
    }
    function populateFactorySettings(settingsTab) {
        let factoryLabel = $('<div><h3 class="name has-text-warning" title="Set the factory settings">Factory:</h3></div></br>');
        settingsTab.append(factoryLabel);
        Object.keys(settings.factorySettings).forEach(function(res) {
            let resText = null;
            if (res == 'interval') {
                resText = $('<div style="width:12rem" title="Update the factory every so much seconds">Interval Rate:</div>');
            } else {
                resText = $('<div style="width:12rem">'+res+' Priority:</div>');
            }
            let resSub = function() {
                settings.factorySettings[res] -= 1;
                return settings.factorySettings[res];
            }
            let resAdd = function() {
                settings.factorySettings[res] += 1;
                return settings.factorySettings[res];
            }
            let resControls = createNumControl(settings.factorySettings[res], "factory_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            settingsTab.append(newDiv);
        });
    }
    function populateResearchSettings(settingsTab) {
        // Creating Fanaticism/Anthropology choice
        let label = $('<div><h3 class="name has-text-warning" title="Research choices that give different effects based on the previous runs">Theology:</h3></div></br>');
        let fanORanth = $('<select style="width:150px;"><option value="fanaticism">Fanaticism</option><option value="anthropology">Anthropology</option></select>');
        let fanDesc = "Gain a dominant trait from your progenitor race. If same race, gain a random minor trait. Gives bonuses to combat and trade. Better for long runs.";
        let anthDesc = "Gives bonuses to science and tax income. Better for short runs.";
        let target1 = $('<div style="padding-left:5%;display:flex;"><span style="width:4rem">Target 1:</span></div>');
        target1.append(fanORanth);
        fanORanth[0].value = settings.fanORanth;
        if (settings.fanORanth == "anthropology") {
            fanORanth[0].title = anthDesc;
        } else {
            fanORanth[0].title = fanDesc;
        }
        fanORanth[0].onchange = function(){
            settings.fanORanth = fanORanth[0].value;
            if (settings.fanORanth == "anthropology") {
                fanORanth[0].title = anthDesc;
            } else {
                fanORanth[0].title = fanDesc;
            }
            console.log("Changing target to ", settings.fanORanth);
            updateSettings();
        };

        // Creating Study/Deify choice
        let studyORdeify = $('<select style="width:150px;"><option value="study">Study</option><option value="deify">Deify</option></select>');
        let deifyDesc = "Gain a dominant trait from your progenitor's progenitor race. If same race, gain a random minor trait. Gives bonuses to combat and trade. Better for long runs.";
        let studyDesc = "Gives bonuses to science and tax income. Better for short runs.";
        let target2 = $('<div style="padding-left:5%;display:flex;"><span style="width:4rem">Target 2:</span></div>');
        target2.append(studyORdeify);
        studyORdeify[0].value = settings.studyORdeify;
        if (settings.studyORdeify == "study") {
            studyORdeify[0].title = studyDesc;
        } else {
            studyORdeify[0].title = deifyDesc;
        }
        studyORdeify[0].onchange = function(){
            settings.studyORdeify = studyORdeify[0].value;
            if (settings.studyORdeify == "study") {
                studyORdeify[0].title = studyDesc;
            } else {
                studyORdeify[0].title = deifyDesc;
            }
            console.log("Changing target to ", settings.studyORdeify);
            updateSettings();
        };
        settingsTab.append(label).append(target1).append(target2);

        // Creating Unification choice
        let label2 = $('<div><h3 class="name has-text-warning" title="Research choice that either gives morale boost or production increase">Unification:</h3></div></br>');
        let uniChoice = $('<select style="width:150px;"><option value="unify">Unify</option><option value="reject">Reject</option></select>');
        let unifyDesc = 'Choose Unification (Either by Conquest, Cultural Supremacy, or Buy the World). Will remove combat and give storage bonus';
        let rejectDesc = 'Choose to reject Unification. Will give morale bonus';
        let target3 = $('<div style="padding-left:5%;display:flex;"><span style="width:4rem;">Choice: </span></div>');
        target3.append(uniChoice);
        if (settings.uniChoice == "unify") {
            uniChoice[0].title = unifyDesc;
        } else {
            uniChoice[0].title = rejectDesc;
        }
        uniChoice[0].value = settings.uniChoice;
        uniChoice[0].onchange = function(){
            settings.uniChoice = uniChoice[0].value;
            if (settings.uniChoice == "unify") {
                uniChoice[0].title = unifyDesc;
            } else {
                uniChoice[0].title = rejectDesc;
            }
            console.log("Changing target to ", settings.uniChoice);
            updateSettings();
        };
        settingsTab.append(label2).append(target3);
    }
    function nameCompare(a, b) {
        return b.name < a.name;
    }
    function priorityCompare(a, b) {
        return b.basePriority - a.basePriority;
    }
    function powerCompare(a, b) {
        let bPP = (b instanceof PoweredBuilding) ? b.powerPriority : -1;
        let aPP = (a instanceof PoweredBuilding) ? a.powerPriority : -1;
        return bPP - aPP;
    }
    function getActionFromId(id) {
        let [a, t] = id.split('-');
        let action = null;
        if (t === undefined) {
            if (a == "Container" || a == "Crate") {
                action = storages[a];
            } else {
                action = arpas[a];
            }
        } else {
            if (a == 'tech') {
                action = researches[id];
            } else {
                action = buildings[id];
            }
        }
        return action;
    }
    function updatePriorityList() {
        console.log("Updating Priority List");
        let search = $('#priorityInput')[0];
        let sort = $('#prioritySort')[0];
        let showToggle = $('#show_toggle')[0];
        let showBuildingsToggle = $('#show_buildings_toggle')[0];
        let showResearchesToggle = $('#show_researches_toggle')[0];
        let showMiscToggle = $('#show_misc_toggle')[0];
        let priorityList = $('#priorityList')[0];

        // Finding search parameters
        let terms = search.value.split(' ');
        let names = [];
        let locs = [];
        let res = [];
        for (let i = 0;i < terms.length;i++) {
            let locCheck = /loc:(.+)/.exec(terms[i]);
            let resCheck = /res:(.+)/.exec(terms[i]);
            //console.log(terms[i], tagCheck, resCheck);
            if (locCheck !== null) {
                locs.push(locCheck[1]);
            } else if (resCheck !== null) {
                res.push(resCheck[1]);
            } else {
                names.push(terms[i]);
            }
        }

        // Sorting if necessary
        let sortMethod = null;
        if (sort.value == 'name') {
            sortMethod = nameCompare;
        } else if (sort.value == 'priority') {
            sortMethod = priorityCompare;
        } else if (sort.value == 'powerPriority') {
            sortMethod = powerCompare;
        }
        if (sortMethod !== null) {
            var newPriorityList = priorityList.cloneNode(false);

            let header = priorityList.childNodes[0];
            // Add all lis to an array
            var divs = [];
            for(let i = 1;i < priorityList.childNodes.length;i++){
                    divs.push(priorityList.childNodes[i]);
            }
            // Sort the lis in descending order
            divs.sort(function(a, b){
                let bAction = getActionFromId(b.id.split('=')[0]);
                let aAction = getActionFromId(a.id.split('=')[0]);
                return sortMethod(aAction, bAction);
            });
            console.log(divs[0]);

            // Add them into the ul in order
            newPriorityList.appendChild(header);
            for (let i = 0; i < divs.length; i++) {
                newPriorityList.appendChild(divs[i]);
            }
            priorityList.parentNode.replaceChild(newPriorityList, priorityList);
            priorityList = newPriorityList;
        }

        for (let i = 1;i < priorityList.children.length;i++) {
            // Getting action
            let div = priorityList.children[i];
            let id = div.id.split('=')[0];
            let action = getActionFromId(id);

            // Checking if available
            if (showToggle.children[0].value == 'false' && !action.unlocked) {
                div.style.display = 'none';
                continue;
            }
            // Checking if type shown
            if (showBuildingsToggle.children[0].value == 'false' && action instanceof Building) {
                div.style.display = 'none';
                continue;
            }
            if (showResearchesToggle.children[0].value == 'false' && action instanceof Research) {
                div.style.display = 'none';
                continue;
            }
            if (showMiscToggle.children[0].value == 'false' && (action instanceof ArpaAction || action instanceof StorageAction)) {
                div.style.display = 'none';
                continue;
            }
            // Searching for if any names appear in building name
            if (names.length != 0) {
                let pass = false;
                for (let i = 0;i < names.length;i++) {
                    var name;
                    if (action.name !== null) {
                        name = action.name;
                    } else {
                        name = action.id.split('-')[1];
                    }
                    if (name.toLowerCase().indexOf(names[i]) >= 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    div.style.display = 'none';
                    continue;
                }
            }
            // Searching for if any tags appear in research name
            if (locs.length != 0) {
                let pass = false;
                for (let i = 0;i < locs.length;i++) {
                    if (action.loc.includes(locs[i])) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    div.style.display = 'none';
                    continue;
                }
            }
            // Searching for if any resources appear in research requirements
            if (res.length != 0 && action.res !== null) {
                let pass = false;
                for (let i = 0;i < res.length;i++) {
                    console.log(action.id, res, action.def.cost, action.getResDep(res[i]));
                    if (action.getResDep(res[i]) !== null && action.getResDep(res[i]) > 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    div.style.display = 'none';
                    continue;
                }
            }

            div.style.display = 'flex';

        }

        // Set focus back on search
        search.focus();
    }
    function drawBuildingItem(building, buildingDiv) {

        // Building At Least
        let atLeastSub = function() {
            buildings[building.id].decAtLeast();
            return buildings[building.id].atLeast;
        }
        let atLeastAdd = function() {
            buildings[building.id].incAtLeast();
            return buildings[building.id].atLeast;
        }
        let atLeastControls = createNumControl(buildings[building.id].atLeast, building.id+'-at-least', atLeastSub, atLeastAdd);
        let atLeastDiv = $('<div style="width:10%;" title="'+building.id+' At Least"></div>');
        atLeastDiv.append(atLeastControls);
        buildingDiv.append(atLeastDiv);

        // Building Limit
        let limSub = function() {
            buildings[building.id].decLimit();
            return buildings[building.id].limit;
        }
        let limAdd = function() {
            buildings[building.id].incLimit();
            return buildings[building.id].limit;
        }
        let limControls = createNumControl(buildings[building.id].limit, building.id+'-limit', limSub, limAdd);
        let limDiv = $('<div style="width:10%;" title="'+building.id+' Limit"></div>');
        limDiv.append(limControls);
        buildingDiv.append(limDiv);

        // Building SoftCap
        let softCapSub = function() {
            buildings[building.id].decSoftCap();
            return buildings[building.id].softCap;
        }
        let softCapAdd = function() {
            buildings[building.id].incSoftCap();
            return buildings[building.id].softCap;
        }
        let softCapControls = createNumControl(buildings[building.id].softCap, building.id+'-softcap', softCapSub, softCapAdd);
        let softCapDiv = $('<div style="width:10%;" title="'+building.id+' Soft Cap"></div>');
        softCapDiv.append(softCapControls);
        buildingDiv.append(softCapDiv);

        // Power Priority
        if (building instanceof PoweredBuilding) {
            let powerSub = function() {
                buildings[building.id].decPowerPriority();
                return buildings[building.id].powerPriority;
            }
            let powerAdd = function() {
                buildings[building.id].incPowerPriority();
                return buildings[building.id].powerPriority;
            }
            let powerControls = createNumControl(buildings[building.id].powerPriority, building.id+'-power-prio', powerSub, powerAdd);
            let powerDiv = $('<div style="width:10%;" title="'+building.id+' Power Priority"></div>');
            powerDiv.append(powerControls);
            buildingDiv.append(powerDiv);
        }
    }
    function populatePriorityList() {
        let priorityList = $('#priorityList')[0];
        var x;
        var name;
        let temp_l = [];
        for (x in buildings) {temp_l.push(buildings[x]);}
        for (x in researches) {temp_l.push(researches[x]);}
        for (x in arpas) {temp_l.push(arpas[x]);}
        for (x in storages) {temp_l.push(storages[x]);}
        while(priorityList.childNodes.length != 1) {
            priorityList.removeChild(priorityList.lastChild);
        }
        // Drawing buildings into list
        for (let i = 0;i < temp_l.length;i++) {
            let action = temp_l[i];
            var actionDiv;
            if (i % 2) {
                actionDiv = $('<div id="'+action.id+'=prio" style="display:flex" class="market-item"></div>');
            } else {
                actionDiv = $('<div id="'+action.id+'=prio" style="display:flex" class="resource alt market-item"></div>');
            }
            priorityList.appendChild(actionDiv[0]);

            // Name Label
            if (action.name === null) {
                name = action.id.split('-')[1];
            } else {
                name = action.name;
            }
            let nameDiv = $('<span style="width:20%;" title="'+action.id+'">'+name+'</span>');
            if (action instanceof Building) {
                nameDiv[0].classList.add('has-text-warning');
            } else if (action instanceof Research) {
                nameDiv[0].classList.add('has-text-danger');
            } else {
                nameDiv[0].classList.add('has-text-special');
            }
            actionDiv.append(nameDiv);

            // Priority
            let prioSub = function() {
                if (action.loc.includes('arpa')) {
                    arpas[action.id].decBasePriority();
                    return arpas[action.id].basePriority;
                } else if (action.loc.includes('storage')) {
                    storages[action.id].decBasePriority();
                    return storages[action.id].basePriority;
                } else if (action.loc.includes('tech')) {
                    researches[action.id].decBasePriority();
                    return researches[action.id].basePriority;
                } else {
                    buildings[action.id].decBasePriority();
                    return buildings[action.id].basePriority;
                }
            }
            let prioAdd = function() {
                if (action.loc.includes('arpa')) {
                    arpas[action.id].incBasePriority();
                    return arpas[action.id].basePriority;
                } else if (action.loc.includes('storage')) {
                    storages[action.id].incBasePriority();
                    return storages[action.id].basePriority;
                } else if (action.loc.includes('tech')) {
                    researches[action.id].incBasePriority();
                    return researches[action.id].basePriority;
                } else {
                    buildings[action.id].incBasePriority();
                    return buildings[action.id].basePriority;
                }
            }
            let settingVal = "";
            if (action.loc.includes('arpa')) {
                settingVal = arpas[action.id].basePriority;
            } else if (action.loc.includes('storage')) {
                settingVal = storages[action.id].basePriority;
            } else if (action.loc.includes('tech')) {
                settingVal = researches[action.id].basePriority;
            } else {
                settingVal = buildings[action.id].basePriority;
            }
            let prioControls = createNumControl(settingVal,"action_"+name+"_priority",prioSub,prioAdd);
            let prioDiv = $('<div style="width:10%;" title="'+action.id+' Priority"></div>');
            prioDiv.append(prioControls);
            actionDiv.append(prioDiv);

            // Enable Toggle
            let toggle = $('<label tabindex="0" class="switch ea-settings-tab" style="margin-top: 4px;width:10%;"><input type="checkbox" value=false> <span class="check" style="height:5px;"></span></label>');
            actionDiv.append(toggle);
            if(action.enabled){
                toggle.click();
                toggle.children('input').attr('value', true);
            }
            toggle.on('mouseup', function(e){
                if (e.which != 1) {return;}
                let input = e.currentTarget.children[0];
                let state = !(input.getAttribute('value') === "true");
                console.log("Updated build state", action.id, state);
                input.setAttribute('value', state);
                action.enabled = state;
            });

            if (action instanceof Building) {
                drawBuildingItem(action,actionDiv);
            }
        }
    }
    function createPriorityList(settingsTab) {
        // Creation Priority List
        let priorityLabel = $('<div><h3 class="name has-text-warning" title="Set the Priority settings">Actions:</h3></div></br>');
        settingsTab.append(priorityLabel);
        let prioritySettingsDiv = $('<div id="prioritySettingsDiv" style="overflow:auto"></div>');
        let prioritySettingsLeft = $('<div id="prioritySettingsLeft" style="float:left"></div>');
        let prioritySettingsRight = $('<div id="prioritySettingsRight" style="float:right"></div>');

        let topLeft = $('<div id="prioritySettingsTopLeft"></div>');
        let bottomLeft = $('<div id="prioritySettingsBottomLeft"></div>');
        let topRight = $('<div id="prioritySettingsTopRight" style="float:right"></div>');
        let bottomRight = $('<div id="prioritySettingsBottomRight"></div>');

        let search = $('<input type="text" id="priorityInput" placeholder="Search for actions (ex: \'iron loc:city res:money\')" style="width:400px;">');
        search.on('input', updatePriorityList);
        let sortLabel = $('<span style="padding-left:20px;padding-right:20px;">Sort:</span>');
        let sort = $('<select style="width:110px;" id="prioritySort"><option value="none">None</option><option value="name">Name</option><option value="priority">Priority</option><option value="power_priority">Power Priority</option></select>');
        sort.on('change', updatePriorityList);
        topLeft.append(search).append(sortLabel).append(sort);

        let showToggle = $('<label tabindex="0" class="switch" id="show_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>Show All</span></label>');
        showToggle.on('change', updatePriorityList);
        showToggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
        });
        bottomLeft.append(showToggle);
        let showBuildingToggle = $('<label tabindex="0" class="switch" id="show_buildings_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>Show Buildings</span></label>');
        showBuildingToggle.on('change', updatePriorityList);
        showBuildingToggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
        });
        bottomLeft.append(showBuildingToggle);
        let showResearchToggle = $('<label tabindex="0" class="switch" id="show_researches_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>Show Researches</span></label>');
        showResearchToggle.on('change', updatePriorityList);
        showResearchToggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
        });
        bottomLeft.append(showResearchToggle);
        let showMiscToggle = $('<label tabindex="0" class="switch" id="show_misc_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>Show Misc.</span></label>');
        showMiscToggle.on('change', updatePriorityList);
        showMiscToggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
        });
        bottomLeft.append(showMiscToggle);

        let enableLabel = $('<span style="padding-right:10px;">Enable:</span>');
        let enableAllBtn = $('<a class="button is-dark is-small" id="enable-all-btn"><span>All</span></a>');
        enableAllBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
            }
            populatePriorityList();
            updatePriorityList();
        });
        let enableVisBtn = $('<a class="button is-dark is-small" id="enable-vis-btn"><span>Visible</span></a>');
        enableVisBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                if (priorityList.childNodes[i].style.display !== 'none') {
                    getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
                }
            }
            populatePriorityList();
            updatePriorityList();
        });
        topRight.append(enableLabel).append(enableAllBtn).append(enableVisBtn);

        let disableLabel = $('<span style="padding-right:10px;">Disable:</span>');
        let disableAllBtn = $('<a class="button is-dark is-small" id="disable-all-btn"><span>All</span></a>');
        disableAllBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
            }
            populatePriorityList();
            updatePriorityList();
        });
        let disableVisBtn = $('<a class="button is-dark is-small" id="disable-vis-btn"><span>Visible</span></a>');
        disableVisBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                if (priorityList.childNodes[i].style.display !== 'none') {
                    getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
                }
            }
            populatePriorityList();
            updatePriorityList();
        });
        bottomRight.append(disableLabel).append(disableAllBtn).append(disableVisBtn);

        prioritySettingsLeft.append(topLeft).append(bottomLeft);
        prioritySettingsRight.append(topRight).append(bottomRight);
        prioritySettingsDiv.append(prioritySettingsLeft).append(prioritySettingsRight);
        settingsTab.append(prioritySettingsDiv);

        let priorityList = $('<div id="priorityList"></div>');
        let priorityListLabel = $(`<div style="display:flex;">
                                    <span class="name has-text-warning" style="width:20%;text-align:left;padding-left:1rem;" title="Action Name. Can be lowercase id if not currently available">Action</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Sets the priority of this action">Priority</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Enables this action for being automatically taken">Enabled</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Will focus on buying this amount of this building before anything else.">At Least</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Will stop building this building after reaching this limit">Limit</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Will softcap this building after reaching this limit, however will still build if resources full">Soft Cap</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Sets the priority for powering this building">Power</span>
                                    </div>`);
        priorityList.append(priorityListLabel);
        settingsTab.append(priorityList);
        populatePriorityList();
        updatePriorityList();
    }
    function createSettingTab() {
        let settingTabLabel = $('<li class="ea-settings"><a><span>Auto Settings</span></a></li>');
        let settingTab = $('<div id="autoSettingTab" class="tab-item ea-settings" style="display:none"><h2 class="is-sr-only">Auto Settings</h2></div>');
        // Creating click functions for other tabs
        for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
            let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
            let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
            tabLabel.on('mouseup',function(e) {
                if (e.which != 1) {return;}
                if (settingTabLabel.hasClass("is-active")) {
                    settingTabLabel.removeClass("is-active");
                    tabItem.style.display = '';
                }
                settingTab[0].style.display = 'none';
                if (!tabLabel.hasClass("is-active")) {tabLabel.addClass("is-active");}
            });
        }
        $('#mainColumn > .content > .b-tabs > .tabs > ul').append(settingTabLabel);
        $('#mainColumn > .content > .b-tabs > .tab-content').append(settingTab);
        settingTabLabel.on('mouseup',function(e) {
            if (e.which != 1) {return;}
            // For every other tab
            for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length-1;i++) {
                let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
                let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
                tabLabel.removeClass("is-active");
                tabItem.style.display = 'none';
            }
            settingTabLabel.addClass("is-active");
            settingTab[0].style.display = '';
        });

        populateSmelterSettings(settingTab);
        populateFactorySettings(settingTab);
        populateResearchSettings(settingTab);
        createPriorityList(settingTab);

    }

    function createAutoLog() {
        let autolog = $('<div id="autolog" class="msgQueue right resource alt ea-autolog"></div>');
        $('#queueColumn').append(autolog);
    }

    /***
    *
    * Utilities
    *
    ***/

    function messageQueue(msg,color){
        color = color || 'warning';
        var new_message = $('<p class="has-text-'+color+'">'+msg+'</p>');
        $('#autolog').prepend(new_message);
        if ($('#autolog').children().length > 30){
            $('#autolog').children().last().remove();
        }
    }

    function getTotalGameDays() {
        try {
        let str = $('#statsPanel')[0].children[$('#statsPanel')[0].children.length-1].innerText;
        let reg = /Game Days Played: ([\d]+)/.exec(str);
        return parseInt(reg[1]);
        } catch(e) {
            console.log('Error in getting total game days');
            return null;
        }
    }
    function getYear() {
        try {
            return parseInt($('.year > .has-text-warning')[0].innerText);
        } catch(e) {
            console.log('Error in getting current year');
            return null;
        }
    }
    function getDay() {
        try {
            return parseInt($('.day > .has-text-warning')[0].innerText);
        } catch(e) {
            console.log('Error: Day');
            return null;
        }
    }
    function getLunarPhase() {
        let moon = document.querySelector('.calendar > .is-primary');
        if (moon !== null) {
            return moon.attributes['data-label'].value;
        } else {
            console.log("Error: Lunar Phase");
            return "";
        }
    }
    function getRace() {
        try {
            return $('#race > .column > span')[0].innerText;
        } catch(e) {
            console.log('Error in getting current race');
            return null;
        }
    }

    // Convert from abbreviated value to actual number
    function getRealValue(num){
        var suffix = {
            K:1000,
            M:1000000
        }
        var currSuff = /([-]?)([\.0-9]+)([^\d\.])/.exec(num);
        if(currSuff !== null && currSuff.length == 4){
            var sign = (currSuff[1] == "-") ? -1 : 1;
            var n = parseFloat(currSuff[2]);
            var suff = currSuff[3];
            if (suffix[suff] !== null) {n *= suffix[suff];}
            n *= sign;
            return n;
        }
        return parseFloat(num);
    }
    // Determines if the research given has already been researched
    function researched(id) {
        let researched = $('#oldTech > div');
        for (let i = 0;i < researched.length;i++) {
            if (id == researched[i].id) {
                return true;
            }
        }
        return false;
    }
    // Determines if stage is currently in evolution
    function inEvolution() {
        let evolutionTabLabel = getTabLabel("Evolve");
        if (evolutionTabLabel === null) {return false;}
        return evolutionTabLabel.style.display != 'none';
    }
    // Determines if the civics tab has been unlocked
    function civicsOn() {
        let civicsTabLabel = getTabLabel("Civics");
        if (civicsTabLabel === null) {return false;}
        return civicsTabLabel.style.display != 'none';
    }
    // Finding tab-items
    function getTab(name) {
        let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');
        for (let i = 0;i < nav.length;i++) {
            if (nav[i].innerText.trim() == name) {
                let nth=i+1
                return document.querySelector('#mainColumn > .content > .b-tabs > .tab-content > div:nth-child('+nth+')')
            }
        }
        return null;
    }
    function getTabLabel(name) {
        let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');
        for (let i = 0;i < nav.length;i++) {
            if (nav[i].innerText.trim() == name) {
                let nth=i+1
                return document.querySelector('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+nth+')')
            }
        }
        return null;
    }
    // Getting free support
    function getFreePower(name) {
        switch(name) {
            case 'electricity': {
                let label = document.getElementById('powerMeter');
                if (label !== null) {
                    return parseInt(label.innerText);
                } else {
                    return 0;
                }
            }
            case 'moon':
            case 'red':
            case 'swarm':
            case 'belt': {
                let label = document.querySelector('#srspc_'+name+' > span');
                if (label !== null) {
                    let data = label.innerText.split('/');
                    return data[1] - data[0];
                } else {
                    return 0;
                }
            }
            default:
                return 0;
        }
    }
    // Determines if a perk has been unlocked
    function perkUnlocked(perk) {
        let pat = "";
        switch(perk) {
            case 'Morphogenesis':
                pat = /Evolution costs decreased/;
                break;
            default:
                return false;
        }
        let divList = $('#perksPanel > div');
        for (let i = 0;i < divList.length;i++) {
            if (pat.exec(divList[i].innerText) !== null) {
                return true;
            }
        }
        return false;
    }
    // Determines if an achievement has been unlocked
    // Returns the achievement level (1-5) if unlocked
    // Returns -1 if not unlocked
    function achievementUnlocked(achievement) {
        let divList = $('.achievement');
        for (let i = 0;i < divList.length;i++) {
            if (divList[i].children[0].innerText == achievement) {
                return $('.achievement')[0].children[2].children[0].attributes.class.value[4];
            }
        }
        return -1;
    }

    function getMinMoney() {
        if (settings.minimumMoney < 1) {
            return settings.minimumMoney * resources.Money.storage;
        } else {
            return settings.minimumMoney;
        }
    }

    function wouldBreakMoneyFloor(buyValue){
        return resources.Money.amount - buyValue < getMinMoney();
    }
}

