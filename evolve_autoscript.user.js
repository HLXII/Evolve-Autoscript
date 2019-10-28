// ==UserScript==
// @name         Evolve_HLXII
// @namespace    http://tampermonkey.net/
// @version      1.2.10.1
// @description  try to take over the world!
// @author       HLXII
// @match        https://pmotschmann.github.io/Evolve/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/pieroxy/lz-string/master/libs/lz-string.min.js
// ==/UserScript==
(async function() {
    setTimeout(main,2000);
})();
function main() {
    window.evolve = unsafeWindow.evolve;
    console.log(window.evolve);
    'use strict';
    var settings = {};
    var jsonSettings = localStorage.getItem('settings');
    if(jsonSettings != null){settings = JSON.parse(jsonSettings);}

    let url = 'https://github.com/HLXII/Evolve-Autoscript';
    let version = '1.2.10.1';

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
                          "evo-cath", "evo-wolven", "evo-centaur",
                          "evo-mantis", "evo-scorpid", "evo-antid",
                          "evo-sharkin", "evo-octigoran", "evo-balorg", "evo-imp",'evo-seraph','evo-unicorn'];
    let evoChallengeActions = ['evo-plasmid', 'evo-mastery', 'evo-trade', 'evo-craft', 'evo-crispr', 'evo-junker', 'evo-joyless', 'evo-decay'];
    let evoHardChallengeActions = ['evo-junker', 'evo-joyless', 'evo-decay'];
    let evoUniverses = ['uni-standard','uni-heavy','uni-antimatter','uni-evil','uni-micro'];
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
        "centaur":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-centaur"],
        "mantis":["evo-phagocytosis", "evo-athropods", "evo-mantis"],
        "scorpid":["evo-phagocytosis", "evo-athropods", "evo-scorpid"],
        "antid":["evo-phagocytosis", "evo-athropods", "evo-antid"],
        "sharkin":["evo-phagocytosis", "evo-aquatic", "evo-sharkin"],
        "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
        "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
        "balorg":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-balorg"],
        "imp":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-imp"],
        "seraph":["evo-phagocytosis", "evo-mammals", "evo-angelic", "evo-seraph"],
        "unicorn":["evo-phagocytosis", "evo-mammals", "evo-angelic", "evo-unicorn"],
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

    let advancedResources = ['Deuterium','Neutronium','Adamantite','Infernite','Elerium','Nano_Tube','Graphene','Stanene'];
    class Resource {
        constructor(id) {
            this.id = id;
            this.color = 'has-text-info';
            if (id == 'Money') {this.color = 'has-text-success';}
            if (advancedResources.includes(id)) {this.color = 'has-text-advanced';}
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('basePriority')) {settings.resources[this.id].basePriority = 0;}
            if (this.crateable) {
                if (!settings.resources[this.id].hasOwnProperty('storePriority')) {settings.resources[this.id].storePriority = 0;}
                if (!settings.resources[this.id].hasOwnProperty('storeMin')) {settings.resources[this.id].storeMin = 0;}
                if (!settings.resources[this.id].hasOwnProperty('storeMax')) {settings.resources[this.id].storeMax = -1;}
            }
            if (this.ejectable) {
                if (!settings.resources[this.id].hasOwnProperty('eject')) {
                    settings.resources[this.id].eject = false;
                }
            }

        }

        get name() {
            return window.evolve.global.resource[this.id].name;
        }

        get unlocked() {
            return window.evolve.global.resource[this.id].display;
        }

        get amount() {
            return window.evolve.global.resource[this.id].amount;
        }
        get storage() {
            return window.evolve.global.resource[this.id].max;
        }
        get ratio() {
            return this.amount / this.storage;
        }
        get rate() {
            return window.evolve.global.resource[this.id].diff;
        }

        get storePriority() {return settings.resources[this.id].storePriority};
        set storePriority(storePriority) {settings.resources[this.id].storePriority = storePriority;}
        get storeMin() {return settings.resources[this.id].storeMin;}
        set storeMin(storeMin) {settings.resources[this.id].storeMin = storeMin;}
        get storeMax() {return settings.resources[this.id].storeMax;}
        set storeMax(storeMax) {settings.resources[this.id].storeMax = storeMax;}

        get eject() {return settings.resources[this.id].eject;};
        set eject(eject) {settings.resources[this.id].eject = eject;};
        get ejectable() {
            return window.evolve.atomic_mass.hasOwnProperty(this.id);
        }
        get ejectRate() {
            return window.evolve.global.interstellar.mass_ejector[this.id];
        }
        get ejectMass() {
            return window.evolve.atomic_mass[this.id].mass / window.evolve.atomic_mass[this.id].size;
        }
        ejectInc(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#eject${this.id} .trade .add`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }
        ejectDec(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#eject${this.id} .trade .sub`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }

        get crateNum() {
            return window.evolve.global.resource[this.id].crates;
        }
        get containerNum() {
            return window.evolve.global.resource[this.id].containers;
        }
        get crateable() {
            return window.evolve.global.resource[this.id].stackable;
        }
        crateInc(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(1) .add`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }
        crateDec(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(1) .sub`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }
        containerInc(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(2) .add`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }
        containerDec(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(2) .sub`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return false;
        }


        decStorePriority(mult) {
            if (this.storePriority == 0) {return;}
            this.storePriority -= mult;
            if (this.storePriority < 0) {this.storePriority = 0;}
            updateSettings();
            console.log("Decrementing Store Priority", this.id, this.storePriority);
        }
        incStorePriority(mult) {
            this.storePriority += mult;
            updateSettings();
            console.log("Incrementing Store Priority", this.id, this.storePriority);
        }
        decStoreMin(mult) {
            if (this.storeMin == 0) {return;}
            this.storeMin -= mult;
            if (this.storeMin < 0) {this.storeMin = 0;}
            updateSettings();
            console.log("Decrementing Store Minimum", this.id, this.storeMin);
        }
        incStoreMin(mult) {
            this.storeMin += mult;
            updateSettings();
            console.log("Incrementing Store Minimum", this.id, this.storeMin);
        }
        decStoreMax(mult) {
            if (this.storeMax == -1) {return;}
            this.storeMax -= mult;
            if (this.storeMax < -1) {this.storeMax = -1;}
            updateSettings();
            console.log("Decrementing Store Maximum", this.id, this.storeMax);
        }
        incStoreMax(mult) {
            this.storeMax += mult;
            updateSettings();
            console.log("Incrementing Store Maximum", this.id, this.storeMax);
        }

        get basePriority() {return settings.resources[this.id].basePriority;}
        set basePriority(basePriority) {settings.resources[this.id].basePriority = basePriority;}
        get priority() {return settings.resources[this.id].basePriority;}

        decBasePriority(mult) {
            if (this.basePriority == 0) {return;}
            this.basePriority -= mult;
            if (this.basePriority < 0) {this.basePrioriity = 0;}
            updateSettings();
            console.log("Decrementing Base Priority", this.id, this.basePriority);
        }
        incBasePriority(mult) {
            this.basePriority += mult;
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

        buyDec(mult) {
            if (this.buyRatio > 0) {
                this.buyRatio = parseFloat(Number(this.buyRatio - 0.1 * mult).toFixed(1));
                if (this.buyRatio < 0) {this.buyRatio = 0;}
                updateSettings();
                console.log(this.id, "Decrementing Buy Ratio", this.buyRatio);
            }
        }
        buyInc(mult) {
            if (this.buyRatio < 1) {
                this.buyRatio = parseFloat(Number(this.buyRatio + 0.1 * mult).toFixed(1));
                if (this.buyRatio > 1) {this.buyRatio = 0;}
                updateSettings();
                console.log(this.id, "Incrementing Buy Ratio", this.buyRatio);
            }
        }
        sellDec(mult) {
            if (this.sellRatio > 0) {
                this.sellRatio = parseFloat(Number(this.sellRatio - 0.1 * mult).toFixed(1));
                if (this.sellRatio < 0) {this.sellRatio = 0;}
                updateSettings();
                console.log(this.id, "Decrementing Sell Ratio", this.sellRatio);
            }
        }
        sellInc(mult) {
            if (this.sellRatio < 1) {
                this.sellRatio = parseFloat(Number(this.sellRatio + 0.1 * mult).toFixed(1));
                if (this.sellRatio > 1) {this.sellRatio = 1;}
                updateSettings();
                console.log(this.id, "Incrementing Sell Ratio", this.sellRatio);
            }
        }

        get tradeLabel() {
            return document.querySelector('#market-'+this.id+' > .trade > .current');
        }
        get tradeDecSpan() {
            return document.querySelector(`#market-${this.id} .trade span:nth-child(4)`);
        }
        get tradeIncSpan() {
            return document.querySelector(`#market-${this.id} .trade span:nth-child(2)`);
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

        tradeDec(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#market-${this.id} .trade .add`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }
        tradeInc(num) {
            num = (num === undefined) ? 1 : num;
            let btn = document.querySelector(`#market-${this.id} .trade .sub`);
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }

        get tradeNum() {
            return window.evolve.global.resource[this.id].trade;
        }
        get tradeBuyCost() {
            if (this.tradeDecSpan !== null) {
                let dataStr = this.tradeDecSpan.attributes['data-label'].value;
                var reg = /.*([\d\.]+).*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[2]);
            } else {
                console.log("Error:", this.id, "Trade Buy Cost");
                return -1;
            }
        }
        get tradeSellCost() {
            if (this.tradeIncSpan !== null) {
                let dataStr = this.tradeIncSpan.attributes['data-label'].value;
                var reg = /.*([\d\.]+).*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[2]);
            } else {
                console.log("Error:", this.id, "Trade Sell Cost");
                return -1;
            }
        }
        get tradeAmount() {
            return window.evolve.tradeRatio[this.id];
        }
    }
    var resources = [];
    function loadResources() {
        if (!settings.hasOwnProperty('resources')) {settings.resources = {};}
        Object.keys(window.evolve.global.resource).forEach(function(res) {
            // Craftable Resources
            if (window.evolve.craftCost[res] !== undefined) {
                //console.log("Craftable Resource:", res);
                resources[res] = new CraftableResource(res);
            }
            // Tradeable Resources
            else if (window.evolve.global.resource[res].trade !== undefined) {
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
            this.color = 'has-text-danger';
            this.sources = window.evolve.craftCost[id];
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
            }
        }
    }

    // Gets the multiplier on the resource
    // 'Global' returns the global multiplier
    function getMultiplier(res) {
        let multiplier = 1;
        for (let val in window.evolve.breakdown.p[res]) {
            let data = window.evolve.breakdown.p[res][val];
            if (data[data.length-1] == '%') {
                multiplier *= 1 + (+data.substring(0, data.length - 1)/100)
            }
        }
        return multiplier;
    }
    // Finds the total resource consumption (returns the negative value)
    function getConsumed(res) {
        let consumed = 0;
        for (let val in window.evolve.breakdown.p.consume[res]) {
            consumed += window.evolve.breakdown.p.consume[res][val];
        }
        return consumed;
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
        decBasePriority(mult) {
            this.basePriority -= mult;
            updateSettings();
            console.log("Decrementing Priority", this.id, this.basePriority);
        }
        incBasePriority(mult) {
            this.basePriority += mult;
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
            if (title === undefined) {
                return this.id;
            }
            else if (typeof title != 'string') {
                return title();
            }
            return title;
        }

        get def() {
            let details = window.evolve.actions;
            for (let i = 0;i < this.loc.length;i++) {
                details = details[this.loc[i]];
            }
            return details;
        }

        get data() {
            let type = this.loc[0];
            let action = this.loc[this.loc.length-1];
            if (window.evolve.global[type] === undefined || window.evolve.global[type][action] == undefined) {
                return null;
            }
            return window.evolve.global[type][action];
        }

        getResDep(resid) {
            if (this.btn === null) {return null;}
            let data = this.btn.querySelector('.button');
            if (data === null) {return null;}
            data = data.attributes[`data-${resid.toLowerCase()}`];
            if (data === undefined) {return null;}
            data = +data.value;
            return data;
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
            this.color = 'has-text-warning';
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

        get unlocked() {
            return this.btn !== null;
        }

        get numTotal() {
            if (this.data === null) {
                return 0;
            }
            return this.data.count;
        }

        decAtLeast(mult) {
            if (this.atLeast == 0) {return;}
            this.atLeast -= mult;
            if (this.atLeast < 0) {this.atLeast = 0;}
            updateSettings();
            console.log("Decrementing At Least", this.id, this.atLeast);
        }
        incAtLeast(mult) {
            this.atLeast += mult;
            updateSettings();
            console.log("Incrementing At Least", this.id, this.atLeast);
        }

        decLimit(mult) {
            if (this.limit == -1) {return;}
            this.limit -= mult;
            if (this.limit < -1) {this.limit = -1;}
            updateSettings();
            console.log("Decrementing Limit", this.id, this.limit);
        }
        incLimit(mult) {
            this.limit += mult;
            updateSettings();
            console.log("Incrementing Limit", this.id, this.limit);
        }

        decSoftCap(mult) {
            if (this.softCap == -1) {return;}
            this.softCap -= mult;
            if (this.softCap < -1) {this.softCap = 1;}
            updateSettings();
            console.log("Decrementing SoftCap", this.id, this.softCap);
        }
        incSoftCap(mult) {
            this.softCap += mult;
            updateSettings();
            console.log("Incrementing SoftCap", this.id, this.softCap);
        }

    }
    function checkPowerRequirements(c_action){
        var isMet = true;
        if (c_action['power_reqs']){
            Object.keys(c_action.power_reqs).forEach(function (req){
                if (!window.evolve.global.tech.hasOwnProperty(req)) {
                    isMet = false;
                }
                else if (window.evolve.global.tech[req] < c_action.power_reqs[req]){
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
        console.log(id, def);
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
            case "space-vr_center":
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
                //produce.push({res:"red_support",cost:1});
                if (researched('tech-subspace_signal')) {
                    produce.push({res:"red_support",cost:1});
                }
                break;
            case "space-moon_base":
                produce = [{res:"moon_support",cost:2}];
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
                effectStr = def.effect();
                test = /[^\d\.]*([\d\.]+)[^\d\.]*/.exec(effectStr);
                produce = [{res:"swarm_support",cost:+test[1]}];
                break;
            case "space-swarm_satellite":
                effectStr = def.effect();
                test = /\+([\d\.]+)kW.*/.exec(effectStr);
                produce = [{res:"electricity",cost:+test[1]}];
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
            case "interstellar-habitat":
                produce = [{res:"alpha_support",cost:1}];
                break;
            case "interstellar-fusion":
                produce = [{res:"electricity",cost:-def.powered()}];
                break;
            case "interstellar-xfer_station":
                produce = [{res:"alpha_support",cost:1}];
                break;
            case "interstellar-nexus":
                produce = [{res:"nebula_support",cost:2}];
                break;
            case "interstellar-harvester":
                effectStr = def.effect();
                test = /\+([\d\.]+) Helium/.exec(effectStr);
                produce = [{res:"Helium_3",cost:+test[1]}];
                test = /\+([\d\.]+) Deuterium/.exec(effectStr);
                produce.push({res:"Deuterium",cost:+test[1]});
                break;
            case "interstellar-elerium_prospector":
                effectStr = def.effect();
                test = /\+([\d\.]+) Elerium/.exec(effectStr);
                produce = [{res:"Elerium",cost:+test[1]}];
                break;
            case "interstellar-neutron_miner":
                effectStr = def.effect();
                test = /\+([\d\.]+) Neutronium/.exec(effectStr);
                produce = [{res:"Neutronium",cost:+test[1]}];
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
            case "space-vr_center":
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
            case "interstellar-habitat":
                consume = [{res:"electricity",cost:def.powered()}];
                break;
            case "interstellar-mining_droid":
            case "interstellar-laboratory":
            case "interstellar-processing":
            case "interstellar-exchange":
            case "interstellar-g_factory":
                consume = [{res:"alpha_support",cost:-def.support}];
                break;
            case "interstellar-fusion":
                consume = [{res:"alpha_support",cost:-def.support}];
                effectStr = def.effect();
                test = /-([\d\.]+) Deuterium/.exec(effectStr);
                consume.push({res:"Deuterium",cost:test[1]});
                break;
            case "interstellar-xfer_station":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Uranium/.exec(effectStr);
                consume.push({res:"Uranium",cost:test[1]});
                break;
            case "interstellar-nexus":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-\$([\d\.]+)/.exec(effectStr);
                consume.push({res:"Money",cost:test[1]});
                break
            case "interstellar-harvester":
            case "interstellar-elerium_prospector":
                consume = [{res:"nebula_support",cost:-def.support}];
                break;
            case "interstellar-cruiser":
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume.push({res:"Helium_3",cost:test[1]});
                break;
            case "interstellar-neutron_miner":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume.push({res:"Helium_3",cost:test[1]});
                break;
            case "interstellar-far_reach":
                consume = [{res:"electricity",cost:def.powered()}];
                break;
            case "portal-turret":
            case "portal-war_droid":
            case "portal-war_drone":
            case "portal-sensor_drone":
            case "portal-attractor":
                consume = [{res:"electricity",cost:def.powered()}];
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

        incPower(num) {
            num = (num === undefined) ? 1 : num;
            if (this.incBtn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                this.incBtn.click();
            }
            return true;
        }
        decPower(num) {
            num = (num === undefined) ? 1 : num;
            if (this.decBtn === null) {return false;}
            for (let i = 0;i < num;i++) {
                this.decBtn.click();
            }
            return true;
        }

        decPowerPriority(mult) {
            if (this.powerPriority == 0) {return;}
            this.powerPriority -= mult;
            if (this.powerPriority < 0) {this.powerPriority = 0;}
            updateSettings();
            console.log("Decrementing Power Priority", this.id, this.powerPriority);
        }
        incPowerPriority(mult) {
            this.powerPriority += mult;
            updateSettings();
            console.log("Incrementing Priority", this.id, this.powerPriority);
        }
    }
    class SpaceDockBuilding extends Building {
        constructor(id, loc) {
            super(id, loc);
        }

        get unlocked() {
            if (buildings['space-star_dock'].numTotal > 0) {
                if (this.id == 'spcdock-seeder') {
                    return researched('tech-genesis_ship');
                } else {
                    return true;
                }
            }
            return false;
        }

        get data() {
            let [type, action] = this.id.split('-');
            return window.evolve.global['starDock'][action];
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
        for (let action in window.evolve.actions.city) {
            // Remove manual buttons
            if (action == 'food' || action == 'lumber' || action == 'stone' || action == 'slaughter') {continue;}
            let id = window.evolve.actions.city[action].id;
            if (window.evolve.actions.city[action].powered || window.evolve.actions.city[action].support) {
                //console.log(action,"POWER", window.evolve.actions.city[action].powered, "SUPPORT", window.evolve.actions.city[action].support);
                buildings[id] = new PoweredBuilding(id, ['city', action]);
                continue;
            }
            // Windmill doesn't have powered/support prop, but still produces electricity
            if (action == 'windmill') {
                //console.log(action,"POWER", window.evolve.actions.city[action].powered, "SUPPORT", window.evolve.actions.city[action].support);
                buildings[id] = new PoweredBuilding(id, ['city', action]);
                continue;
            }
            buildings[id] = new Building(id, ['city', action]);
        }
        // Space
        for (let location in window.evolve.actions.space) {
            for (let action in window.evolve.actions.space[location]) {
                // Remove info
                if (action == 'info') {continue;}
                let id = window.evolve.actions.space[location][action].id;
                if (window.evolve.actions.space[location][action].powered || window.evolve.actions.space[location][action].support) {
                    //console.log(action,"POWER", window.evolve.actions.space[location][action].powered, "SUPPORT", window.evolve.actions.space[location][action].support);
                    buildings[id] = new PoweredBuilding(id, ['space', location, action]);
                    continue;
                }
                buildings[id] = new Building(id, ['space', location, action]);
            }
        }
        // Star Dock
        for (let action in window.evolve.actions.starDock) {
            // Remove reset actions
            if (action == 'prep_ship' || action == 'launch_ship') {continue;}
            let id = window.evolve.actions.starDock[action].id;
            buildings[id] = new SpaceDockBuilding(id, ['starDock', action]);
        }
        // Interstellar
        for (let location in window.evolve.actions.interstellar) {
            for (let action in window.evolve.actions.interstellar[location]) {
                // Remove info
                if (action == 'info') {continue;}
                let id = window.evolve.actions.interstellar[location][action].id;
                if (window.evolve.actions.interstellar[location][action].powered || window.evolve.actions.interstellar[location][action].support) {
                    buildings[id] = new PoweredBuilding(id, ['interstellar', location, action]);
                    continue;
                }
                buildings[id] = new Building(id, ['interstellar', location, action]);
            }
        }
        // Portal
        for (let location in window.evolve.actions.portal) {
            for (let action in window.evolve.actions.portal[location]) {
                // Remove info
                if (action == 'info') {continue;}
                let id = window.evolve.actions.portal[location][action].id;
                if (window.evolve.actions.portal[location][action].powered || window.evolve.actions.portal[location][action].support) {
                    buildings[id] = new PoweredBuilding(id, ['portal', location, action]);
                    continue;
                }
                buildings[id] = new Building(id, ['portal', location, action]);
            }
        }
        console.log(buildings);
    }
    class Research extends Action {
        constructor(id, loc) {
            super(id, loc);
            this.color = 'has-text-danger';
        }

        get researched() {

            let [grant, val] = this.def.grant;
            let old = false;
            if (window.evolve.global.tech[grant] !== undefined) {
                if (window.evolve.global.tech[grant] >= val) {
                    old = true;
                }
            }
            return old;
        }
    }
    var researches = {};
    function loadResearches() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        // Tech
        for (let action in window.evolve.actions.tech) {
            // Remove reset tech
            if (action == 'exotic_infusion' || action == 'infusion_check' || action == 'infusion_confirm') {continue;}
            let id = window.evolve.actions.tech[action].id;
            researches[id] = new Research(id, ['tech', action]);
        }
    }
    class MiscAction extends Action {
        constructor(id) {
            super(id, ['misc']);
            this.color = 'has-text-advanced';
        }
    }
    class ArpaAction extends Building {
        constructor(id, res) {
            super(id, ['misc']);
            this.loc.push('arpa');
            this.res = res;
            this.color = 'has-text-special';
        }

        get label() {
            return document.querySelector('#arpa'+this.id+' > .head > .desc');
        }
        get btn() {
            return document.querySelector('#arpa'+this.id+' > div.buy > button.button.x25');
        }

        get name() {
            if (this.label === null) {
                return this.id;
            }
            return this.label.innerText;
        }

        get unlocked() {
            if (!window.evolve.global.arpa.hasOwnProperty(this.id)) {return false;}
            if (this.id === 'launch_facility') {
                return window.evolve.global.arpa[this.id].rank !== 1;
            }
            return true;
        }

        get numTotal() {
            if (window.evolve.global.arpa[this.id] !== undefined) {
                return window.evolve.global.arpa[this.id].rank
            }
            return 0;
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid] * (1.05 ** this.numTotal) / 4;
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
    class StorageAction extends MiscAction {
        constructor(id, res) {
            super(id);
            this.loc.push('storage');
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
    class GeneAction extends MiscAction {
        constructor(id) {
            super(id);
            this.res = {Knowledge:200000};
        }

        get btn() {
            let btn = $("#arpaSequence > span > button").not(".has-text-success");
            return (btn.length) ? btn[0] : null;
        }

        get unlocked() {
            return this.btn !== null;
        }

        get name() {
            return "Assemble Gene";
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
            btn.click();
            return true;
        }
    }
    class MercenaryAction extends MiscAction {
        constructor(id) {
            super(id);
            this.loc.push('mercenary');
            this.res = {};
        }

        get btn() {
            let btn = $('button.first');
            return (btn.length) ? btn[0] : null;
        }

        get unlocked() {
            return window.evolve.global.civic.garrison.mercs;
        }

        get name() {
            return "Hire Garrison Mercenary";
        }

        getResDep(resid) {
            //let str = window.evolve.vues.civ_garrison.hireLabel();
            let str = $('.hire > span')[0].attributes['data-label'].value;
            let val = /[^\d]*([\d]+)[^\d]*/.exec(str);
            this.res.Money = val[1];
            if (this.res === null) {
                return null;
            }
            return this.res[resid];
        }

        click() {
            if (getAvailableSoldiers() === getMaxSoldiers()) {return false;}
            let btn = this.btn;
            if (btn === null) {return false;}
            btn.click();
            return true;
        }
    }
    class FortressMercenaryAction extends MercenaryAction {
        constructor(id) {
            super(id);
        }

        get btn() {
            let btn = $('button.merc');
            return (btn.length) ? btn[0] : null;
        }

        get name() {
            return "Hire Fortress Mercenary";
        }
    }
    class AlterAction extends MiscAction {
       constructor(id) {
            super(id);
            this.res = {};
        }
        get btn() {
            let btn = $("#city-s_alter > a");
            return (btn.length) ? btn[0] : null;
        }
        get unlocked() {
            let exists = (window.evolve.global.city.hasOwnProperty('s_alter') && window.evolve.global.city.s_alter.count == 1);
            let populationCheck = false;
            for (let x in window.evolve.global.resource) {
                if (Object.keys(window.evolve.races).includes(x)) {
                    populationCheck = window.evolve.global.resource[x].amount == window.evolve.global.resource[x].max;
                    break;
                }
            }
            return exists && populationCheck;
        }

        get name() {
            return "Sacrifice";
        }

        getResDep(resid) {
            return null;
        }

        click() {
            let btn = this.btn;
            if (btn === null) {return false;}
            btn.click();
            return true;
        }
    }
    var miscActions = {};
    function loadMiscActions() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        miscActions.Gene = new GeneAction("Gene");
        miscActions.Mercenary = new MercenaryAction("Mercenary");
        miscActions.FortressMercenary = new FortressMercenaryAction("FortressMercenary");
        miscActions.Sacrifice = new AlterAction("Sacrifice");
    }

    class Job {
        constructor(id, priority) {
            this.id = id;
            if (!settings.jobs.hasOwnProperty(this.id)) {settings.jobs[this.id] = {};}
            if (!settings.jobs[this.id].hasOwnProperty('priority')) {settings.jobs[this.id].priority = priority;}
        }

        get _priority() {return settings.jobs[this.id].priority;}
        set _priority(priority) {settings.jobs[this.id].priority = priority;}

        get hireBtn() {
            return document.querySelector('#civ-'+this.id+' > .controls > .add');
        }
        get fireBtn() {
            return document.querySelector('#civ-'+this.id+' > .controls > .sub');
        }

        get name() {
            return window.evolve.global.civic[this.id].name;
        }

        get employed() {
            return window.evolve.global.civic[this.id].workers;
        }
        get maxEmployed() {
            return window.evolve.global.civic[this.id].max;
        }

        get priority() {
            return this._priority;
        }

        lowerPriority(mult) {
            if (this._priority == 0) {return;}
            this._priority -= mult;
            if (this._priority < 0) {this._priority = 0;}
            updateSettings();
            console.log("Lowering", this.name, "Priority", this._priority);
        }
        higherPriority(mult) {
            this._priority += mult;
            updateSettings();
            console.log("Increasing", this.name, "Priority", this._priority);
        }

        get unlocked() {
            return window.evolve.global.civic[this.id].display;
        }

        hire(num) {
            if (num === undefined) {num = 1;}
            let btn = this.hireBtn;
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
        }
        fire(num) {
            if (num === undefined) {num = 1;}
            let btn = this.fireBtn;
            if (btn === null) {return false;}
            disableMult();
            for (let i = 0;i < num;i++) {
                btn.click();
            }
            return true;
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

        get hireFunc() {
            return function() {};
        }
        get fireFunc() {
            return function() {};
        }

        get name() {
             window.evolve.global.race['carnivore'] || window.evolve.global.race['soul_eater'] ? 'Hunter' : 'Unemployed';
        }

        get employed() {
            return window.evolve.global.civic[this.id];
        }
        get maxEmployed() {
            return -1;
        }

        get unlocked() {
            return true;
        }

    }
    class Craftsman extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get hireBtn() {
            return document.querySelector('#foundry .job:nth-child(2) > .controls > .add')
        }
        get fireBtn() {
            return document.querySelector('#foundry .job:nth-child(2) > .controls > .sub')
        }

    }
    var jobs = {};
    function loadJobs() {
        if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
        jobs.free = new Unemployed('free', 0);
        for (var x in window.evolve.global.civic) {
            if (window.evolve.global.civic[x].hasOwnProperty('job')) {
                if (x == 'craftsman') {
                    jobs[x] = new Craftsman(x, 0);
                }
                else {
                    jobs[x] = new Job(x, 0);
                }
            }
        }
    }
    class CraftJob extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get hireBtn() {
            return document.getElementById('craft'+this.id).parentNode.children[1].children[1];
        }
        get fireBtn() {
            return document.getElementById('craft'+this.id).parentNode.children[1].children[0];
        }

        get name() {
            return window.evolve.global.resource[this.id].name;
        }

        get unlocked() {
            return window.evolve.global.resource[this.id].display;
        }

        get employed() {
            return window.evolve.global.city.foundry[this.id];
        }
        get maxEmployed() {
            return -1;
        }
    }
    var craftJobs = {};
    function loadCraftJobs() {
        if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
        Object.keys(window.evolve.global.resource).forEach(function(res) {
            // Craftable Resources
            if (window.evolve.craftCost[res] !== undefined) {
                craftJobs[res] = new CraftJob(res, 5);
            }
        });
    }

    let foodBtn = null;
    let lumberBtn = null;
    let stoneBtn = null;
    let rnaBtn = null;
    let dnaBtn = null;
    let slaughterBtn = null;
    function loadFarm () {
        rnaBtn = document.querySelector('#evo-rna > a');
        dnaBtn = document.querySelector('#evo-dna > a');
        foodBtn = document.querySelector('#city-food > a');
        lumberBtn = document.querySelector('#city-lumber > a');
        stoneBtn = document.querySelector('#city-stone > a');
        slaughterBtn = document.querySelector('#city-slaughter > a');
    }

    function loadSmelter() {
        if (!settings.hasOwnProperty('smelterSettings')) {settings.smelterSettings = {};}
        if (!settings.smelterSettings.hasOwnProperty('pqCheck')) {settings.smelterSettings.pqCheck = true;}
        if (!settings.smelterSettings.hasOwnProperty('Wood')) {settings.smelterSettings.Wood = 1;}
        if (!settings.smelterSettings.hasOwnProperty('Coal')) {settings.smelterSettings.Coal = 1;}
        if (!settings.smelterSettings.hasOwnProperty('Oil')) {settings.smelterSettings.Oil = 1;}
        if (!settings.smelterSettings.hasOwnProperty('Iron')) {settings.smelterSettings.Iron = 2;}
        if (!settings.smelterSettings.hasOwnProperty('Steel')) {settings.smelterSettings.Steel = 3;}
    }
    function loadFactory() {
        if (!settings.hasOwnProperty('factorySettings')) {settings.factorySettings = {};}
        if (!settings.factorySettings.hasOwnProperty('pqCheck')) {settings.factorySettings.pqCheck = true;}
        if (!settings.factorySettings.hasOwnProperty('Luxury_Goods')) {settings.factorySettings.Luxury_Goods = 0;}
        if (!settings.factorySettings.hasOwnProperty('Alloy')) {settings.factorySettings.Alloy = 3;}
        if (!settings.factorySettings.hasOwnProperty('Polymer')) {settings.factorySettings.Polymer = 3;}
        if (!settings.factorySettings.hasOwnProperty('Nano_Tube')) {settings.factorySettings.Nano_Tube = 7;}
        if (!settings.factorySettings.hasOwnProperty('Stanene')) {settings.factorySettings.Stanene = 4;}
    }
    function loadDroid() {
        if (!settings.hasOwnProperty('droidSettings')) {settings.droidSettings = {};}
        if (!settings.droidSettings.hasOwnProperty('pqCheck')) {settings.droidSettings.pqCheck = true;}
        if (!settings.droidSettings.hasOwnProperty('Adamantite')) {settings.droidSettings.Adamantite = 10;}
        if (!settings.droidSettings.hasOwnProperty('Uranium')) {settings.droidSettings.Uranium = 0;}
        if (!settings.droidSettings.hasOwnProperty('Coal')) {settings.droidSettings.Coal = 0;}
        if (!settings.droidSettings.hasOwnProperty('Aluminium')) {settings.droidSettings.Aluminium = 0;}
    }
    function loadGraphene() {
        if (!settings.hasOwnProperty('grapheneSettings')) {settings.grapheneSettings = {};}
        if (!settings.grapheneSettings.hasOwnProperty('pqCheck')) {settings.grapheneSettings.pqCheck = true;}
        if (!settings.grapheneSettings.hasOwnProperty('Wood')) {settings.grapheneSettings.Wood = 0;}
        if (!settings.grapheneSettings.hasOwnProperty('Coal')) {settings.grapheneSettings.Coal = 10;}
        if (!settings.grapheneSettings.hasOwnProperty('Oil')) {settings.grapheneSettings.Oil = 5;}
    }

    let printSettings = ['Buildings','Researches','Misc'];

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
        // Misc Actions
        loadMiscActions();
        // Research
        loadResearches();
        // Buildings
        loadBuildings();
        // Jobs
        loadJobs();
        loadCraftJobs();
        // ARPA
        loadArpas();
        // Smelter
        loadSmelter();
        // Factory
        loadFactory();
        // Mining Droid
        loadDroid();
        // Graphene Plant
        loadGraphene();

        if (!settings.hasOwnProperty('autoPrint')) {
            settings.autoPrint = true;
        }
        if (!settings.hasOwnProperty('printSettings')) {
            settings.printSettings = {};
        }
        for (let i = 0;i < printSettings.length;i++) {
            if (!settings.hasOwnProperty(printSettings[i])) {
                settings.printSettings[printSettings[i]] = true;
            }
        }
        if (!settings.hasOwnProperty('autoFarm')) {
            settings.autoFarm = false;
        }
        if (!settings.hasOwnProperty('farmRate')) {
            settings.farmRate = 10;
        }
        if (!settings.hasOwnProperty('autoRefresh')) {
            settings.autoRefresh = false;
        }
        if (!settings.hasOwnProperty('autoPrestige')) {
            settings.autoPrestige = false;
        }
        if (!settings.hasOwnProperty('prestige')) {
            settings.prestige = 'mad';
        }

        if (!settings.hasOwnProperty('autoEvolution')) {
            settings.autoEvolution = false;
        }
        for (let i = 0;i < evoChallengeActions.length;i++) {
            if (!settings.hasOwnProperty(evoChallengeActions[i])) {
                settings[evoChallengeActions[i]] = false;
            }
        }
        if (!settings.hasOwnProperty('evolution')) {
            settings.evolution = "antid";
        }

        if (!settings.hasOwnProperty('autoTax')) {
            settings.autoTax = false;
        }
        if (!settings.hasOwnProperty('minimumMorale')) {
            settings.minimumMorale = 100;
        }
        if (!settings.hasOwnProperty('autoEmploy')) {
            settings.autoEmploy = false;
        }
        if (!settings.hasOwnProperty('autoBattle')) {
            settings.autoBattle = false;
        }
        if (!settings.hasOwnProperty('minWinRate')) {
            settings.minWinRate = 60;
        }
        if (!settings.hasOwnProperty('maxCampaign')) {
            settings.maxCampaign = 4;
        }
        if (!settings.hasOwnProperty('woundedCheck')) {
            settings.woundedCheck = false;
        }
        if (!settings.hasOwnProperty('campaignFailCheck')) {
            settings.campaignFailCheck = false;
        }
        if (!settings.hasOwnProperty('campaignFailInterval')) {
            settings.campaignFailInterval = 5;
        }
        if (!settings.hasOwnProperty('autoFortress')) {
            settings.autoFortress = false;
        }

        if (!settings.hasOwnProperty('autoCraft')) {
            settings.autoCraft = false;
        }
        if (!settings.hasOwnProperty('autoMarket')) {
            settings.autoMarket = false;
        }
        if (!settings.hasOwnProperty('marketVolume')) {
            settings.marketVolume = 1;
        }
        if (!settings.hasOwnProperty('minimumMoney')) {
            settings.minimumMoney = 0;
        }
        if (!settings.hasOwnProperty('autoTrade')) {
            settings.autoTrade = false;
        }
        if (!settings.hasOwnProperty('autoStorage')) {
            settings.autoStorage = false;
        }
        if (!settings.hasOwnProperty('autoEjector')) {
            settings.autoEjector = false;
        }

        if (!settings.hasOwnProperty('autoSupport')) {
            settings.autoSupport = false;
        }
        if (!settings.hasOwnProperty('autoSmelter')) {
            settings.autoSmelter = false;
        }
        if (!settings.hasOwnProperty('autoFactory')) {
            settings.autoFactory = false;
        }
        if (!settings.hasOwnProperty('autoDroid')) {
            settings.autoDroid = false;
        }
        if (!settings.hasOwnProperty('autoGraphene')) {
            settings.autoGraphene = false;
        }

        if (!settings.hasOwnProperty('autoResearch')) {
            settings.autoResearch = false;
        }
        if (!settings.hasOwnProperty('religion1')) {
            settings.religion1 = "fanaticism";
        }
        if (!settings.hasOwnProperty('religion2')) {
            settings.religion2 = "study";
        }
        if (!settings.hasOwnProperty('unify')) {
            settings.unify = 'unify';
        }

        if (!settings.hasOwnProperty('autoPriority')) {
            settings.autoPriority = false;
        }
        if (!settings.hasOwnProperty('showAll')) {
            settings.showAll = false;
        }
        if (!settings.hasOwnProperty('showBuilding')) {
            settings.showBuilding = false;
        }
        if (!settings.hasOwnProperty('showResearch')) {
            settings.showResearch = false;
        }
        if (!settings.hasOwnProperty('showMisc')) {
            settings.showMisc = false;
        }

        if (!settings.hasOwnProperty('log')) {settings.log = []};
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
            console.log("Setting farm interval");
            farmInterval = setInterval(farm, settings.farmRate);
        } else {
            if (!settings.autoFarm && !(farmInterval === null)) {
                clearInterval(farmInterval);
                farmInterval = null;
            }
        }
    }

    let refreshInterval = null;
    function autoRefresh() {
        if(settings.autoRefresh && refreshInterval === null) {
            refreshInterval = setInterval(function() {location.reload();}, 200 * 1000);
        } else {
            if (!settings.autoRefresh && !(refreshInterval === null)) {
                clearInterval(refreshInterval);
                refreshInterval = null;
            }
        }
    }

    let prestigeCheck = false;
    function autoPrestige() {
        switch(settings.prestige) {
            case 'mad': {
                // Checking if MAD unlocked
                if (!window.evolve.vues.mad.display) {return;}
                // Checking if already clicked
                if (prestigeCheck) {return;}
                window.evolve.vues.mad.launch();
                prestigeCheck = true;
                break;
            }
            case 'bioseed': {
                // Checking if seeder is available
                if (!window.evolve.global.starDock.hasOwnProperty('seeder')) {return;}
                // Checking if seeding is complete
                let seedCount = window.evolve.global.starDock.seeder.count;
                if (seedCount !== 100) {return;}
                // Checking if already clicked
                if (prestigeCheck) {return;}
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
                setTimeout(function() {
                    // Getting buttons
                    let prep_ship = document.querySelector('#spcdock-prep_ship > a');
                    let launch_ship = document.querySelector('#spcdock-launch_ship > a');
                    if (prep_ship) {prep_ship.click();}
                    if (launch_ship) {launch_ship.click();}
                    // Closing modal
                    let closeBtn = $('.modal-close')[0];
                    if (closeBtn !== undefined) {closeBtn.click();}
                    modal = false;
                }, 100);
                prestigeCheck = true;
                break;
            }
            case 'blackhole': {
                // Loading reset tech buttons
                let exotic_infusion = document.querySelector('#tech-exotic_infusion > .button')
                let infusion_check = document.querySelector('#tech-infusion_check > .button')
                let infusion_confirm = document.querySelector('#tech-infusion_confirm > .button')
                // Clicking if available
                if (exotic_infusion) {exotic_infusion.click();}
                if (infusion_check) {infusion_check.click();}
                if (infusion_confirm) {infusion_confirm.click();}
                break;
            }
        }
    }

    function autoEvolution() {
        let actions = document.querySelectorAll('#evolution .action');
        let chosenAction = null;
        let chosenPriority = 0;
        let transition = false;
        for (let i = 0; i < actions.length; i++) {
            // Checking if purchasable
            let action = actions[i];
            // Not purchasable
            if (action.className.indexOf("cna") >= 0) {continue;}
            // Farming button
            if(evoFarmActions.includes(action.id)) {continue;}
            // Reached max in maxEvo
            if(action.id in maxEvo && parseInt($('#'+action.id+' > a > .count')[0].innerText) >= maxEvo[action.id]) {continue;}
            // Don't take planets
            if(/\w+\d+/.exec(action.id) !== null) {continue;}
            // Don't take universes
            if (evoUniverses.includes(action.id)) {continue;}
            // Checking for race decision tree
            if(evoRaceActions.includes(action.id) && !evoRaceTrees[settings.evolution].includes(action.id)) {continue;}
            let newPriority = 0;
            // If it is a challenge Action
            if (evoChallengeActions.includes(action.id)) {
                // Hard Challenge
                if (evoHardChallengeActions.includes(action.id)) {
                    // Junker will start automatically
                    if (action.id == 'evo-junker' && settings[action.id]) {
                        newPriority = 2;
                    }
                    // Other Hard Challenges will need to be toggled
                    else {
                        if (!action.classList.contains('hl') === settings[action.id]) {
                            newPriority = 10;
                        }
                    }
                }
                // Normal Challenge
                else {
                    // Normal Challenges will need to be toggled
                    if (!action.classList.contains('hl') === settings[action.id]) {
                        newPriority = 10;
                    }
                }
            }
            // Race Actions
            else if (evoRaceActions.includes(action.id)) {
                newPriority = 6;
                // Final race action
                if (action.id == evoRaceTrees[settings.evolution][evoRaceTrees[settings.evolution].length-1]) {
                    newPriority = 5;
                }
            }
            // Sentience
            else if (action.id == 'evo-sentience') {
                newPriority = 1;
            }
            // Other actions
            else {
                newPriority = 20;
            }
            // Checking if chosen action needs to be replaced
            if (newPriority > chosenPriority) {
                chosenPriority = newPriority;
                chosenAction = action;
            }
        }
        if (chosenAction !== null) {
            chosenAction.children[0].click();
            if (chosenPriority <= 5) {
                loadSettings();
                resetUI();
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
        let totalCrates = window.evolve.global.resource.Crates.amount;
        let totalContainers = window.evolve.global.resource.Containers.amount;
        // Creating crateable object
        let storage = [];
        let totalPriority = 0;
        for (let x in resources) {
            if (resources[x].unlocked && resources[x].crateable) {
                storage.push(resources[x]);
                totalCrates += resources[x].crateNum;
                totalContainers += resources[x].containerNum;
                totalPriority += resources[x].storePriority;

                resources[x].wanted_crates = 0;
                resources[x].wanted_containers = 0;
            }
        }
        storage.sort(function(a,b) {
            return b.storePriority - a.storePriority;
        });

        //console.log("Current Crate Usage", totalCrates);
        //console.log("Current Container Usage", totalContainers);
        //console.log(storage);
        // Getting minStorage
        let minStorage = [];
        for (let i = 0;i < storage.length;i++) {if (storage[i].storeMin != 0) {minStorage.push(storage[i]);}}

        let remainingCrates = totalCrates;
        let remainingContainers = totalContainers;

        // Allocating minStorage first
        for (let i = 0;i < minStorage.length;i++) {
            let givenCrates = Math.min(remainingCrates, minStorage[i].storeMin);
            minStorage[i].wanted_crates += givenCrates;
            remainingCrates -= givenCrates;
        }

        // Allocating normal storage
        for (let i = 0;i < storage.length;i++) {
            let givenCrates = Math.ceil(totalCrates * storage[i].storePriority / totalPriority);
            givenCrates = Math.min(givenCrates, remainingCrates);
            if (storage[i].storeMax != -1) {
                givenCrates = Math.min(givenCrates, storage[i].storeMax);
            }
            // Has minStorage assigned
            if (storage[i].wanted_crates != 0) {
                givenCrates = Math.max(storage[i].wanted_crates, givenCrates);
                remainingCrates -= givenCrates - storage[i].wanted_crates;
                storage[i].wanted_crates = givenCrates;
            }
            else {
                storage[i].wanted_crates = givenCrates;
                remainingCrates -= givenCrates;
            }
            let givenContainers = Math.ceil(totalContainers * storage[i].storePriority / totalPriority);
            givenContainers = Math.min(givenContainers, remainingContainers);
            if (storage[i].storeMax != -1) {
                givenContainers = Math.min(givenContainers, storage[i].storeMax);
            }
            storage[i].wanted_containers = givenContainers;
            remainingContainers -= givenContainers;

            //console.log(storage[i].name, "CR_WANT", storage[i].wanted_crates, "CO_WANT", storage[i].wanted_containers);
        }

        // Removing extra storage
        for (let i = 0;i < storage.length;i++) {
            if (storage[i].wanted_crates < storage[i].crateNum) {
                storage[i].crateDec(storage[i].crateNum - storage[i].wanted_crates);
            }
            if (researched('tech-steel_containers') && storage[i].wanted_containers < storage[i].containerNum) {
                storage[i].containerDec(storage[i].containerNum - storage[i].wanted_containers);
            }
        }
        // Allocating storage
        for (let i = 0;i < storage.length;i++) {
            if (storage[i].wanted_crates > storage[i].crateNum) {
                storage[i].crateInc(storage[i].wanted_crates - storage[i].crateNum);
            }
            if (researched('tech-steel_containers') && storage[i].wanted_containers > storage[i].containerNum) {
                storage[i].containerInc(storage[i].wanted_containers - storage[i].containerNum);
            }
        }
    }

    function autoEjector() {
        // Don't do autoEjector if haven't unlocked mass ejectors
        if (!window.evolve.global.interstellar.hasOwnProperty('mass_ejector')) {return;}
        if (window.evolve.global.interstellar.mass_ejector.count == 0) {return;}
        // Don't do autoEjector if none are turned on
        let totalEjection = window.evolve.global.interstellar.mass_ejector.on * 1000;
        if (totalEjection == 0) {return;}

        // Getting ejectable resources
        let ejectables = [];
        for (let x in resources) {
            if (resources[x].ejectable) {
                ejectables.push(resources[x]);
            }
        }
        // Sort by ejectMass
        ejectables.sort(function(a,b) {
            return b.ejectMass - a.ejectMass;
        });
        console.log("SORTED:", ejectables);
        // Finding sequence of selling trade routes
        let ejectAllocation = [];
        for (let i = 0;i < ejectables.length;i++) {
            let res = ejectables[i];
            // Ignoring non-full, non-enabled resources
            if (res.ratio != 1 && !res.eject) {
                ejectAllocation.push(0);
                continue;
            }
            let maxEject = Math.floor(res.temp_rate);
            let ejection = (maxEject < totalEjection) ? maxEject : totalEjection;
            ejectAllocation.push(ejection);
            totalEjection -= ejection;
        }
        console.log("EJECTABLE:", ejectables, ejectAllocation);
        /*
        // Allocating
        for (let i = 0;i < ejectables.length;i++) {
            let res = ejectables[i];
            // Removing ejections
            if (res.ejectRate > ejectAllocation[i]) {
                res.ejectDec(res.ejectRate - ejectAllocation[i]);
            }
        }
        for (let i = 0;i < ejectables.length;i++) {
            let res = ejectables[i];
            // Adding ejections
            if (res.ejectRate < ejectAllocation[i]) {
                res.ejectInc(ejectAllocation[i] - res.ejectRate);
            }
        }
        */
        for (let i = 0;i < ejectables.length;i++) {
            let res = ejectables[i];
            window.evolve.global.interstellar.mass_ejector[res.id] = 0;
        }
        for (let i = 0;i < ejectables.length;i++) {
            let res = ejectables[i];
            window.evolve.global.interstellar.mass_ejector[res.id] = ejectAllocation[i];
        }
    }

    function getWounded() {
        return window.evolve.global.civic.garrison.wounded;
    }
    function getTotalSoldiers() {
        return window.evolve.global.civic.garrison.max;
    }
    function getFortressSoldiers() {
        if (window.evolve.global.portal.hasOwnProperty('fortress')) {
            return window.evolve.global.portal.fortress.assigned;
        }
        return 0;
    }
    function getMaxSoldiers() {
        return getTotalSoldiers() - getFortressSoldiers();
    }
    function getAvailableSoldiers() {
        if (window.evolve.global.portal.hasOwnProperty('fortress')) {
            return window.evolve.global.civic.garrison.workers - window.evolve.global.portal.fortress.assigned;
        }
        return window.evolve.global.civic.garrison.workers;
    }
    function getCurrentSoldiers() {
        return window.evolve.global.civic.garrison.raid;
    }
    function armyRating() {
        let armyRating = document.querySelector('#garrison > .header > span >  span:nth-child(2)');
        if (armyRating === null) {return 0;}
        return parseInt(armyRating);
    }
    function decCampaign(num) {
        num = (num === undefined) ? 1 : num;
        let decCampaignBtn = document.querySelector('#tactics > .sub');
        if (decCampaignBtn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            decCampaignBtn.click();
        }
    }
    function incCampaign(num) {
        num = (num === undefined) ? 1 : num;
        let incCampaignBtn = document.querySelector('#tactics > .add');
        if (incCampaignBtn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            incCampaignBtn.click();
        }
    }
    function getCurrentCampaign() {
        return window.evolve.global.civic.garrison.tactic;
    }
    function addSoldiers(num) {
        num = num ? num : 1;
        let btn = document.querySelector('#battalion > .add');
        if (btn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
    }
    function subSoldiers(num) {
        num = num ? num : 1;
        let btn = document.querySelector('#battalion > .sub');
        if (btn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
    }
    function getWinRate() {
        let span = document.querySelector('#garrison > div:nth-child(4) > div:nth-child(2) > span');
        if (span === null) {return 0;}
        span = span.attributes['data-label'].value;
        span = /([\d\.]+)% ([\w]+)/.exec(span);
        let [ meh, winRate, advantage] = span;
        winRate = parseFloat(winRate);
        winRate *= (advantage == 'advantage') ? 1 : -1;
        return winRate;
    }
    function runCampaign() {
        let btn = document.querySelector('#garrison > div:nth-child(4) > div:nth-child(2) > span > button');
        if (btn === null) {return;}
        btn.click();
    }
    let armyStatus = false;
    let armySetupStage = 0;
    let chosenCampaign = false;
    let failTimer = 0;
    function battle() {
        // Don't autoBattle if garrison not unlocked
        if (!researched('tech-garrison')) {return;}
        // Don't autoBattle if unified
        if (window.evolve.global.tech['world_control']) {return;}
        // Don't autoBattle if failed recently
        if (settings.campaignFailCheck && failTimer > 0) {
            failTimer -= 1;
            return;
        }
        // If army isn't ready, wait until it is
        let avaSoldiers = getAvailableSoldiers();
        let maxSoldiers = getMaxSoldiers();
        let wounded = getWounded();
        let healthy = getTotalSoldiers() - wounded;
        //console.log(avaSoldiers, maxSoldiers, wounded);
        // Determining of army is ready
        if (avaSoldiers && avaSoldiers == maxSoldiers) {
            if (!(settings.woundedCheck && wounded > 0)) {
                armyStatus = true;
            }
        } else {
            armyStatus = false;
            chosenCampaign = false;
            armySetupStage = 0;
        }
        // Army is ready
        if (armyStatus) {
            switch(armySetupStage) {
                // Initial Stage
                case 0: {
                    // Setting campaign to max campaign setting
                    decCampaign(4);
                    incCampaign(settings.maxCampaign);
                    // Setting army size to max
                    addSoldiers(maxSoldiers);
                    armySetupStage += 1;
                    //console.log("Campaign Ready - Setting up soldiers");
                    break;
                }
                // Decrement Stage
                case 1: {
                    // Checking winrate
                    let winrate = getWinRate();
                    //console.log("WIN:", winrate);
                    // Lower Win Rate
                    if (winrate <= settings.minWinRate) {
                        // Checking if campaign chosen
                        if (chosenCampaign) {
                            //console.log("Chosen Campaign", getCurrentCampaign(), "Win", winrate, settings.minWinRate);
                            addSoldiers();
                            if (getCurrentSoldiers() <= healthy) {
                                runCampaign();
                            }
                            armyStatus = false;
                            chosenCampaign = false;
                            armySetupStage = 0;
                        }
                        // Campaign not chosen yet
                        else {
                            if (getCurrentCampaign() == 0) {
                                //console.log("Cannot beat Ambush, resetting army algorithm");
                                armyStatus = false;
                                chosenCampaign = false;
                                armySetupStage = 0;
                                // Setting fail timer if enabled
                                if (settings.campaignFailCheck) {
                                    failTimer = settings.campaignFailInterval * 1000 / 25;
                                }
                            } else {
                                //console.log("Cannot win at this campaign", getCurrentCampaign(), " decrementing campaign");
                                decCampaign();
                            }
                        }
                    }
                    // Higher Win Rate
                    else {
                        //console.log("Can win at this campaign",getWinRate(), getCurrentCampaign(),"subtracting soldiers");
                        chosenCampaign = true;
                        subSoldiers();
                        if (getCurrentSoldiers() == 0) {
                            addSoldiers();
                            if (getCurrentSoldiers() < healthy) {
                                runCampaign();
                            }
                            armyStatus = false;
                            chosenCampaign = false;
                            armySetupStage = 0;
                        }
                    }
                    break;
                }
            }

        }
    }
    let battleInterval = null;
    function autoBattle() {
        if(settings.autoBattle && battleInterval === null) {
            battleInterval = setInterval(battle, 25);
        } else {
            if (!settings.autoBattle && !(battleInterval === null)) {
                clearInterval(battleInterval);
                battleInterval = null;
            }
        }
    }

    function autoEmploy(priorityData) {
        let sortedJobs = [];
        var x;
        let population = 0;
        let totalPriority = 0;
        let priorities = [];
        let ratios = [];
        let maxes = [];
        for (x in jobs) {
            if (jobs[x].unlocked) {
                sortedJobs.push(jobs[x]);
                population += jobs[x].employed;
                totalPriority += jobs[x].priority;
                priorities.push(jobs[x].priority);
            }
        }
        for (let i = 0;i < sortedJobs.length;i++) {
            ratios.push(sortedJobs[i].priority / totalPriority);
            maxes.push(sortedJobs[i].maxEmployed);
        }

        // Allocating jobs
        let allocation = allocate(population,priorities,ratios,{max:maxes});
        console.log("JOBS:", sortedJobs, priorities, ratios, allocation.alloc);
        console.log(allocation.seq);

        // Firing extra employees
        for (let i = 0;i < allocation.alloc.length;i++) {
            //console.log(i, sortedJobs[i].name, sortedJobs[i].employed, "->", allocation.alloc[i]);
            if (sortedJobs[i].employed > allocation.alloc[i]) {
                sortedJobs[i].fire(sortedJobs[i].employed - allocation.alloc[i]);
            }
        }
        // Hiring required employees
        for (let i = 0;i < allocation.alloc.length;i++) {
            if (sortedJobs[i].employed < allocation.alloc[i]) {
                sortedJobs[i].hire(allocation.alloc[i] - sortedJobs[i].employed);
            }
        }

        // Allocating craftsman
        if (!jobs.craftsman.unlocked) {return;}
        //console.log("Divying up Craftsman");
        // Delay to get new craftman number
        setTimeout(function() {
            let totalCraftsman = window.evolve.global.civic.craftsman.workers;
            let totalPriority = 0;
            let cjobs = [];
            let priorities = [];
            let ratios = [];
            // Finding availible craftsman positions, as well as total priority and craftsman numbers
            for (x in craftJobs) {
                if (!craftJobs[x].unlocked) {continue;}
                cjobs.push(craftJobs[x]);
                totalPriority += craftJobs[x].priority;
                priorities.push(craftJobs[x].priority);
            }
            // Calculating wanted ratios
            for (let i = 0;i < cjobs.length;i++) {
                ratios.push(cjobs[i].priority / totalPriority);
            }
            // Optimizing craftsman placement
            let allocation = allocate(totalCraftsman,priorities,ratios);

            console.log("CRAFTJOBS:", cjobs, priorities, ratios, allocation.alloc);

            // Firing all unneeded
            for (let i = 0;i < cjobs.length;i++) {
                if (allocation.alloc[i] < cjobs[i].employed) {
                    cjobs[i].fire(cjobs[i].employed - allocation.alloc[i]);
                }
            }
            // Hiring all needed
            for (let i = 0;i < cjobs.length;i++) {
                if (allocation.alloc[i] > cjobs[i].employed) {
                    cjobs[i].hire(allocation.alloc[i] - cjobs[i].employed);
                }
            }
        }, 50);
    }

    function getCurrentMorale() {
        let totalMorale = 100;
        for (var x in window.evolve.global.city.morale) {
            if (x == 'current') {continue;}
            totalMorale += window.evolve.global.city.morale[x];
        }
        return totalMorale;
    }
    function getMaxMorale() {
        let maxMorale = 100;
        maxMorale += buildings['city-amphitheatre'].numTotal;
        maxMorale += buildings['city-casino'].numTotal;
        maxMorale += buildings['space-vr_center'].numOn * 2;
        if (researched('tech-superstars')) {maxMorale += window.evolve.global.civic.entertainer.workers;}
        maxMorale += arpas['monument'].numTotal * 2;
        if (window.evolve.global.civic.taxes.tax_rate < 20){
            maxMorale += 10 - Math.floor(window.evolve.global.civic.taxes.tax_rate / 2);
        }
        return maxMorale;
    }
    function decTax(num) {
        num = (num === undefined) ? 1 : num;
        let decTaxBtn = $('#tax_rates > .sub');
        disableMult();
        for (let i = 0;i < num;i++) {
            decTaxBtn.click();
        }
    }
    function incTax(num) {
        num = (num === undefined) ? 1 : num;
        let incTaxBtn = $('#tax_rates > .add');
        disableMult();
        for (let i = 0;i < num;i++) {
            incTaxBtn.click();
        }
    }
    function autoTax(priorityData) {
        // Don't start taxes if haven't researched
        if (!researched('tech-tax_rates')) {return;}
        let morale = getCurrentMorale();
        let maxMorale = getMaxMorale();
        let moneyRate = resources.Money.temp_rate || resources.Money.rate;
        //console.log(morale, maxMorale, moneyRate);
        // Setting to lowest taxes to get the max morale bonus (since taxes aren't needed)
        if (resources.Money.ratio == 1) {
            //TODO Figure out a good way of doing this
            //decTax();
        }
        // Currently above max Morale
        else if (morale >= maxMorale) {
            incTax(morale - maxMorale);
        }
        // Currently below minimum Morale
        else if (morale <= settings.minimumMorale) {
            decTax(settings.minimumMorale - morale);
        } else {
            if (resources.Money.ratio < 0.99 || moneyRate < 0) {
                incTax();
            }
            else {
                decTax();
            }
        }
    }

    function autoMarket() {
        // Don't start autoMarket if haven't unlocked market
        if (!researched('tech-market')) {return;}
        let curMoney = resources.Money.amount;
        let maxMoney = resources.Money.storage;
        let multipliers = $('#market-qty').children();
        // If multipliers don't exist (aka cannot manual buy/sell) don't autoMarket
        if (multipliers === null || multipliers === undefined || multipliers.length == 0) {return;}
        let curMarketVolume = Math.min(settings.marketVolume,multipliers.length);
        multipliers[curMarketVolume].click();
        let qty = 25;
        switch(curMarketVolume) {
            case 1: qty = 10; break;
            case 2: qty = 25; break;
            case 3: qty = 100; break;
            case 4: qty = 250; break;
            case 5: qty = 1000; break;
            case 6: qty = 2500; break;
            case 7: qty = 10000; break;
            case 8: qty = 25000; break;
        }
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

    let smelterModal = null;
    function loadSmelterModal() {
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        // Opening Modal
        $('#city-smelter > .special').click();
        setTimeout(function() {
            smelterModal = window.evolve.vues['specialModal'];

            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }
    function getSmelterData() {
        let data = {};
        // Wood (Lumber/Souls/Flesh)
        if (!window.evolve.global.race['kindling_kindred'] && !window.evolve.global.race['evil']) {
            data.Wood = {};
            let str = smelterModal.buildLabel('wood');
            str = /Consume ([\d\.]+) ([\w]+)/.exec(str);
            data.Wood.num = window.evolve.global.city.smelter.Wood;
            data.Wood.fuel = parseFloat(str[1]);
            data.Wood.name = str[2];
        }
        // Coal
        if (window.evolve.global.resource.Coal.display) {
            data.Coal = {};
            let str = smelterModal.buildLabel('coal');
            data.Coal.fuel = parseFloat(/Burn ([\d\.]+).*/.exec(str)[1]);
            data.Coal.num = window.evolve.global.city.smelter.Coal;
        }
        // Oil
        if (window.evolve.global.resource.Oil.display) {
            data.Oil = {};
            let str = smelterModal.buildLabel('oil');
            data.Oil.fuel = parseFloat(/Burn ([\d\.]+).*/.exec(str)[1]);
            data.Oil.num = window.evolve.global.city.smelter.Oil;
        }

        // Iron
        data.Iron = {};
        data.Iron.num = window.evolve.global.city.smelter.Iron;
        let ironVal = smelterModal.ironLabel();
        data.Iron.percent = parseInt(/[^\d]+([\d]+)%/.exec(ironVal)[1]);

        // Steel
        if (window.evolve.global.resource.Steel.display && window.evolve.global.tech.smelting >= 2) {
            data.Steel = {};
            data.Steel.num = window.evolve.global.city.smelter.Steel;
            let steelVal = smelterModal.steelLabel();
            let temp = /[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*/.exec(steelVal);
            data.Steel.Coal = parseFloat(temp[1]);
            data.Steel.Iron = parseFloat(temp[2]);;
            data.Steel.produce = parseFloat(temp[3]);;
        }
        return data;
    }
    function autoSmelter(limits) {
        // Don't Auto smelt if not unlocked
        if (!researched('tech-steel')) {return;}
        // Loading Smelter Vue
        if (smelterModal === null) {
            loadSmelterModal();
            return;
        }

        // Finding relevent elements
        let data = getSmelterData();
        console.log('Smelter Data:', data);

        let totalSmelters = buildings['city-smelter'].numTotal;

        // Reverting current allocation
        if (data.hasOwnProperty('Wood')) {
            switch(data.Wood.name) {
                case 'Lumber': {
                    resources.Lumber.temp_rate += data.Wood.fuel * data.Wood.num;
                    break;
                }
                case 'Souls': {
                    resources.Food.temp_rate += data.Wood.fuel * data.Wood.num;
                    break;
                }
                case 'Flesh': {
                    resources.Furs.temp_rate += data.Wood.fuel * data.Wood.num;
                    break;
                }
            }
        }
        if (data.hasOwnProperty('Coal')) {
            resources.Coal.temp_rate += data.Coal.fuel * data.Coal.num;
        }
        if (data.hasOwnProperty('Oil')) {
            resources.Oil.temp_rate += data.Oil.fuel * data.Oil.num;
        }
        resources.Iron.temp_rate += data.Steel.Iron * data.Steel.num;
        resources.Coal.temp_rate += data.Steel.Coal * data.Steel.num;
        resources.Steel.temp_rate -= data.Steel.produce * data.Steel.num;
        resources.Iron.temp_rate /= (1 + data.Iron.percent * data.Iron.num / 100);

        // Calculating Fuel
        let fuelKeys = [];
        let fuelPriorities = [];
        let fuelTotalPriority = 0;
        let fuelRatios = [];
        if (data.hasOwnProperty('Wood')) {
            fuelKeys.push('Wood');
            let priority = settings.smelterSettings.Wood;
            if (limits) {
                switch(data.Wood.name) {
                    case 'Lumber': {
                        if (limits.Lumber !== null) {
                            priority /= limits.Lumber.priority;
                        } else {
                            priority = 10**5;
                        }
                        break;
                    }
                    case 'Souls': {
                        if (limits.Food !== null) {
                            priority /= limits.Food.priority;
                        } else {
                            priority = 10**5;
                        }
                        break;
                    }
                    case 'Flesh': {
                        if (limits.Furs !== null) {
                            priority /= limits.Furs.priority;
                        } else {
                            priority = 10**5;
                        }
                        break;
                    }
                }
            }
            fuelPriorities.push(priority);
        }
        if (data.hasOwnProperty('Coal')) {
            fuelKeys.push('Coal');
            let priority = settings.smelterSettings.Coal;
            if (limits) {
                if (limits.Coal !== null) {
                    priority /= limits.Coal.priority;
                } else {
                    priority = 10**10;
                }
            }
            fuelPriorities.push(priority);
        }
        if (data.hasOwnProperty('Oil')) {
            fuelKeys.push('Oil');
            let priority = settings.smelterSettings.Oil;
            if (limits) {
                if (limits.Oil !== null) {
                    priority /= limits.Oil.priority;
                } else {
                    priority = 10**20;
                }
            }
            fuelPriorities.push(priority);
        }
        for (let i = 0;i < fuelPriorities.length;i++) {fuelTotalPriority += fuelPriorities[i];}
        for (let i = 0;i < fuelPriorities.length;i++) {fuelRatios.push(fuelPriorities[i] / fuelTotalPriority);}
        let resourceCheck = function(index, curNum) {
            switch(fuelKeys[index]) {
                case 'Wood': {
                    switch(data.Wood.name) {
                        case 'Lumber': return resources.Lumber.temp_rate > data.Wood.fuel;
                        case 'Souls': return resources.Food.temp_rate > data.Wood.fuel;
                        case 'Flesh': return resources.Furs.temp_rate > data.Wood.fuel;
                    }
                    break;
                }
                case 'Coal': return resources.Coal.temp_rate > data.Coal.fuel;
                case 'Oil': return resources.Oil.temp_rate > data.Oil.fuel;
            }
            return false;
        };
        let allocFunc = function(index, curNum) {
            switch(fuelKeys[index]) {
                case 'Wood': {
                    switch(data.Wood.name) {
                        case 'Lumber': {resources.Lumber.temp_rate -= data.Wood.fuel;break;}
                        case 'Souls': {resources.Food.temp_rate -= data.Wood.fuel;break;}
                        case 'Flesh': {resources.Furs.temp_rate -= data.Wood.fuel;break;}
                    }
                    break;
                }
                case 'Coal': {resources.Coal.temp_rate -= data.Coal.fuel;break;}
                case 'Oil': {resources.Oil.temp_rate -= data.Oil.fuel;break;}
            }
        };
        let fuelAllocation = allocate(totalSmelters,fuelPriorities,fuelRatios,{requireFunc:resourceCheck, allocFunc:allocFunc});

        console.log("SMELTER FUEL:", fuelAllocation);

        // Calculating Production
        let prodKeys = [];
        let prodPriorities = [];
        let prodTotalPriority = 0;
        let prodRatios = [];
        if (data.hasOwnProperty('Iron')) {
            prodKeys.push('Iron');
            let priority = settings.smelterSettings.Iron;
            if (limits) {
                if (limits.Iron !== null) {
                    priority /= limits.Iron.priority;
                } else {
                    priority = 0;
                }
            }
            prodPriorities.push(priority);
        }
        if (data.hasOwnProperty('Steel')) {
            prodKeys.push('Steel');
            let priority = settings.smelterSettings.Steel;
            if (limits) {
                if (limits.Steel !== null) {
                    priority /= limits.Steel.priority;
                } else {
                    priority = 0;
                }
            }
            prodPriorities.push(priority);
        }
        for (let i = 0;i < prodPriorities.length;i++) {prodTotalPriority += prodPriorities[i];}
        for (let i = 0;i < prodPriorities.length;i++) {prodRatios.push(prodPriorities[i] / prodTotalPriority);}
        resourceCheck = function(index, curNum) {
            switch(prodKeys[index]) {
                case 'Iron': {
                    return true;
                }
                case 'Steel': {
                    let coalCheck = resources.Coal.temp_rate > data.Steel.Coal;
                    let ironCheck = resources.Iron.temp_rate > data.Steel.Iron;
                    return coalCheck && ironCheck;
                }
            }
            return false;
        }
        // Setting up data variable for storing temp Iron/Steel nums
        data.Iron.num = 0;
        data.Steel.num = 0;
        allocFunc = function(index, curNum) {
            switch(prodKeys[index]) {
                case 'Iron': {

                    // Removing steel influence
                    resources.Iron.temp_rate += data.Steel.Iron * data.Steel.num;

                    // Applying percent change
                    resources.Iron.temp_rate /= (1 + data.Iron.percent*(curNum-1)/100);
                    resources.Iron.temp_rate *= (1 + data.Iron.percent*curNum/100);

                    // Reapplying steel influence
                    resources.Iron.temp_rate -= data.Steel.Iron * data.Steel.num;
                    data.Iron.num = curNum;

                    break;
                }
                case 'Steel': {
                    resources.Iron.temp_rate -= data.Steel.Iron;
                    resources.Coal.temp_rate -= data.Steel.Coal;
                    data.Steel.num = curNum;
                    break;
                }
            }
        }

        let produceAllocation = allocate(fuelAllocation.total,prodPriorities,prodRatios,{requireFunc:resourceCheck, allocFunc:allocFunc});

        console.log("SMELTER PRODUCE:", produceAllocation);

        // Removing extra fuel
        for (let i = 0;i < fuelKeys.length;i++) {
            if (data[fuelKeys[i]].num > fuelAllocation.alloc[i]) {
                for (let j = 0;j < data[fuelKeys[i]].num - fuelAllocation.alloc[i];j++) {
                    switch(fuelKeys[i]) {
                        case 'Wood': {
                            smelterModal.subWood();
                            break;
                        }
                        case 'Coal': {
                            smelterModal.subCoal();
                            break;
                        }
                        case 'Oil': {
                            smelterModal.subOil();
                            break;
                        }
                    }
                }
            }
        }
        // Allocating fuel
        for (let i = 0;i < fuelKeys.length;i++) {
            if (data[fuelKeys[i]].num < fuelAllocation.alloc[i]) {
                for (let j = 0;j < fuelAllocation.alloc[i] - data[fuelKeys[i]].num;j++) {
                    switch(fuelKeys[i]) {
                        case 'Wood': {
                            smelterModal.addWood();
                            break;
                        }
                        case 'Coal': {
                            smelterModal.addCoal();
                            break;
                        }
                        case 'Oil': {
                            smelterModal.addOil();
                            break;
                        }
                    }
                }
            }
        }
        // Pushing all allocation to iron
        for (let i = 0;i < totalSmelters;i++) {
            smelterModal.ironSmelting()
        }
        // Adding steel
        if (produceAllocation.alloc.length == 2) {
            for (let i = 0;i < produceAllocation.alloc[1];i++) {
                smelterModal.steelSmelting()
            }
        }
    }

    let factoryModal = null;
    function loadFactoryModal() {
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        // Opening Modal
        $('#city-factory > .special').click();
        setTimeout(function() {
            factoryModal = window.evolve.vues['specialModal'];

            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }
    function getFactoryData() {
        let data = {};

        let factoryLevel = window.evolve.global.tech['factory'] ? window.evolve.global.tech['factory'] : 0;

        // Luxury Goods
        data.Lux = {};
        let str = factoryModal.buildLabel('Lux')
        let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)/.exec(str)
        data.Lux.Furs = temp[1];
        data.Lux.Money = temp[2];

        // Alloy
        data.Alloy = {};
        str = factoryModal.buildLabel('Alloy')
        temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
        data.Alloy.Copper = temp[1];
        data.Alloy.Aluminium = temp[2];
        // Alloy Production
        let factory_output = window.evolve.f_rate.Alloy.output[factoryLevel];
        if (window.evolve.global.race['toxic']){
            factory_output *= 1.20;
        }
        if (window.evolve.global.tech['alloy']){
            factory_output *= 1.37;
        }
        if (window.evolve.global.race['metallurgist']){
            factory_output *= 1 + (window.evolve.global.race['metallurgist'] * 0.04);
        }
        factory_output *= getMultiplier('Alloy') * getMultiplier('Global');
        data.Alloy.produce = factory_output;

        // Polymer
        if (window.evolve.global.tech['polymer']) {
            data.Polymer = {};
            let str = factoryModal.buildLabel('Polymer')
            let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)?[^\d\.]+/.exec(str)
            data.Polymer.Oil = temp[1];
            // Kindred Kindling
            data.Polymer.Lumber = (temp[2]) ? temp[2] : 0;
            // Polymer Production
            let factory_output = window.evolve.f_rate.Polymer.output[factoryLevel];
            if (window.evolve.global.race['toxic']) {
                factory_output *= 1.20;
            }
            if (window.evolve.global.tech['polymer'] >= 2){
                factory_output *= 1.42;
            }
            factory_output *= getMultiplier('Polymer') * getMultiplier('Global');
            data.Polymer.produce = factory_output;
        }
        // Nano Tube
        if (window.evolve.global.tech['nano']) {
            data.Nano = {};
            let str = factoryModal.buildLabel('Nano')
            let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
            data.Nano.Coal = temp[1];
            data.Nano.Neutronium = temp[2];
            data.Nano.produce = 0;
            // Nano Tube Production
            let factory_output = window.evolve.f_rate.Nano_Tube.output[factoryLevel];
            if (window.evolve.global.race['toxic']) {
                factory_output *= 1.08;
            }
            if (window.evolve.global.tech['polymer'] >= 2){
                factory_output *= 1.42;
            }
            factory_output *= getMultiplier('Nano_Tube') * getMultiplier('Global');
            data.Nano.produce = factory_output;
        }
        // Stanene
        if (window.evolve.global.tech['stanene']) {
            data.Stanene = {};
            let str = factoryModal.buildLabel('Stanene')
            let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
            data.Stanene.Aluminium = temp[1];
            data.Stanene.Nano_Tube = temp[2];
            // Stanene Production
            let factory_output = window.evolve.f_rate.Stanene.output[factoryLevel];
            factory_output *= getMultiplier('Stanene') * getMultiplier('Global');
            data.Stanene.produce = factory_output;
        }
        return data;
    }
    function autoFactory(limits) {
        // Don't Auto factory if not unlocked
        if (!researched('tech-industrialization')) {return;}
        // Don't Auto factory if you don't have any
        if (buildings['city-factory'].numTotal < 1) {return;}
        // Loading Factory Vue
        if (factoryModal === null) {
            loadFactoryModal();
            return;
        }
        let totalFactories = buildings['city-factory'].numOn + buildings['space-red_factory'].numOn;

        let data = getFactoryData();
        console.log('FACTORY DATA:', data);

        // Reverting current allocation
        if (factoryModal.Lux) {
            resources.Furs.temp_rate += data.Lux.Furs * factoryModal.Lux;
            resources.Money.temp_rate += data.Lux.Money * factoryModal.Lux;
        }
        if (factoryModal.Alloy) {
            resources.Copper.temp_rate += data.Alloy.Copper * factoryModal.Alloy;
            resources.Aluminium.temp_rate += data.Alloy.Aluminium * factoryModal.Alloy;
            resources.Alloy.temp_rate -= data.Alloy.produce * factoryModal.Alloy;
        }
        if (factoryModal.Polymer) {
            resources.Lumber.temp_rate += data.Polymer.Lumber * factoryModal.Polymer;
            resources.Oil.temp_rate += data.Polymer.Oil * factoryModal.Polymer;
            resources.Polymer.temp_rate -= data.Polymer.produce * factoryModal.Polymer;
        }
        if (factoryModal.Nano) {
            resources.Coal.temp_rate += data.Nano.Coal * factoryModal.Nano;
            resources.Neutronium.temp_rate += data.Nano.Neutronium * factoryModal.Nano;
            resources.Nano_Tube.temp_rate -= data.Nano.produce * factoryModal.Nano;
        }
        if (factoryModal.Stanene) {
            resources.Aluminium.temp_rate += data.Stanene.Aluminium * factoryModal.Stanene;
            resources.Nano_Tube.temp_rate += data.Stanene.Nano_Tube * factoryModal.Stanene;
            resources.Stanene.temp_rate -= data.Stanene.produce * factoryModal.Stanene;
        }

        // Finding Allocation
        let keys = [];
        let priorities = [];
        let totalPriority = 0;
        let ratios = [];
        if (data.hasOwnProperty('Lux')) {
            keys.push('Lux');
            let priority = settings.factorySettings.Luxury_Goods;
            if (limits) {
                if (limits.Money !== null) {
                    priority *= limits.Money.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Alloy')) {
            keys.push('Alloy');
            let priority = settings.factorySettings.Alloy;
            if (limits) {
                if (limits.Alloy !== null) {
                    priority *= limits.Alloy.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Polymer')) {
            keys.push('Polymer');
            let priority = settings.factorySettings.Polymer;
            if (limits) {
                if (limits.Polymer !== null) {
                    priority *= limits.Polymer.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Nano')) {
            keys.push('Nano');
            let priority = settings.factorySettings.Nano_Tube;
            if (limits) {
                if (limits.Nano_Tube !== null) {
                    priority *= limits.Nano_Tube.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Stanene')) {
            keys.push('Stanene');
            let priority = settings.factorySettings.Stanene;
            if (limits) {
                if (limits.Stanene !== null) {
                    priority *= limits.Stanene.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        for (let i = 0;i < priorities.length;i++) {
            ratios[i] = priorities[i] / totalPriority;
        }
        let resourceCheck = function(index, curNum) {
            switch(keys[index]) {
                case 'Lux': {
                    return resources.Furs.temp_rate > data.Lux.Furs;
                }
                case 'Alloy': {
                    let copperCheck = resources.Copper.temp_rate > data.Alloy.Copper;
                    let aluminiumCheck = resources.Aluminium.temp_rate > data.Alloy.Aluminium;
                    return copperCheck && aluminiumCheck;
                }
                case 'Polymer': {
                    let lumberCheck = resources.Lumber.temp_rate > data.Polymer.Lumber;
                    let oilCheck = resources.Oil.temp_rate > data.Polymer.Oil;
                    return lumberCheck && oilCheck;
                }
                case 'Nano': {
                    let coalCheck = resources.Coal.temp_rate > data.Nano.Coal;
                    let neutroniumCheck = resources.Neutronium.temp_rate > data.Nano.Neutronium;
                    return coalCheck && neutroniumCheck;
                }
                case 'Stanene': {
                    let aluminiumCheck = resources.Aluminium.temp_rate > data.Stanene.Aluminium;
                    let nanoTubeCheck = resources.Nano_Tube.temp_rate > data.Stanene.Nano_Tube;
                    return aluminiumCheck && nanoTubeCheck;
                }
            }
            return false;
        };
        let allocFunc = function(index, curNum) {
            switch(keys[index]) {
                case 'Lux': {
                    resources.Furs.temp_rate -= data.Lux.Furs;
                    resources.Money.temp_rate += data.Lux.Money;
                    break;
                }
                case 'Alloy': {
                    resources.Copper.temp_rate -= data.Alloy.Copper;
                    resources.Aluminium.temp_rate -= data.Alloy.Aluminium;
                    resources.Alloy.temp_rate += data.Alloy.produce;
                    break;
                }
                case 'Polymer': {
                    resources.Lumber.temp_rate -= data.Polymer.Lumber;
                    resources.Oil.temp_rate -= data.Polymer.Oil;
                    resources.Polymer.temp_rate += data.Polymer.produce;
                    break;
                }
                case 'Nano': {
                    resources.Coal.temp_rate -= data.Nano.Coal;
                    resources.Neutronium.temp_rate -= data.Nano.Neutronium;
                    resources.Nano_Tube.temp_rate += data.Nano.produce;
                    break;
                }
                case 'Stanene': {
                    resources.Aluminium.temp_rate -= data.Stanene.Aluminium;
                    resources.Nano_Tube.temp_rate -= data.Stanene.Nano_Tube;
                    resources.Stanene.temp_rate += data.Stanene.produce;
                    break;
                }
            }
        };

        // Creating allocation list
        let allocation = allocate(totalFactories,priorities,ratios,{requireFunc:resourceCheck, allocFunc:allocFunc});

        console.log('FACTORY PRIO:', priorities, 'FACTORY RATIO:', ratios);
        console.log('FACTORY ALLOC:', allocation);

        // Allocating
        for (let i = 0;i < keys.length;i++) {
            if (factoryModal[keys[i]] > allocation.alloc[i]) {
                for (let j = 0;j < factoryModal[keys[i]] - allocation.alloc[i];j++) {
                    factoryModal.subItem([keys[i]]);
                }
            }
        }
        for (let i = 0;i < keys.length;i++) {
            if (factoryModal[keys[i]] < allocation.alloc[i]) {
                for (let j = 0;j < allocation.alloc[i] - factoryModal[keys[i]];j++) {
                    factoryModal.addItem([keys[i]]);
                }
            }
        }
    }

    let droidModal = null;
    function loadDroidModal() {
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        // Opening Modal
        $('#interstellar-mining_droid > .special').click();
        setTimeout(function() {
            droidModal = window.evolve.vues['specialModal'];

            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }
    function getDroidData() {
        let data = {};

        // Adamantite
        data.Adamantite = {};
        data.Adamantite.produce = 0.075 * window.evolve.zigguratBonus();

        // Uranium
        data.Uranium = {};
        data.Uranium.produce = 0.12 * window.evolve.zigguratBonus();

        // Coal
        data.Coal = {};
        data.Coal.produce = 3.75 * window.evolve.zigguratBonus();

        // Aluminium
        data.Aluminium = {};
        data.Aluminium.produce = 2.75 * window.evolve.zigguratBonus();

        return data;
    }
    function autoDroid(limits) {
        // Don't Auto Droid if not unlocked
        if (window.evolve.global.tech['alpha'] < 2) {return;}
        // Don't Auto Droid if you don't have any
        if (buildings['interstellar-mining_droid'].numTotal < 1) {return;}
        // Loading Droid Vue
        if (droidModal === null) {
            loadDroidModal();
            return;
        }
        let totalDroids = buildings['interstellar-mining_droid'].numOn;

        let data = getDroidData();
        console.log('DROID DATA:', data);

        // Reverting current allocation
        if (factoryModal.adam) {
            resources.Adamantite.temp_rate -= data.Adamantite.produce * factoryModal.adam;
        }
        if (factoryModal.uran) {
            resources.Uranium.temp_rate -= data.Uranium.produce * factoryModal.uran;
        }
        if (factoryModal.coal) {
            resources.Coal.temp_rate -= data.Coal.produce * factoryModal.coal;
        }
        if (factoryModal.alum) {
            resources.Aluminium.temp_rate -= data.Aluminium.produce * factoryModal.alum;
        }

        // Finding Allocation
        let keys = [];
        let priorities = [];
        let totalPriority = 0;
        let ratios = [];
        if (data.hasOwnProperty('Adamantite')) {
            keys.push('adam');
            let priority = settings.droidSettings.Adamantite;
            if (limits) {
                if (limits.Adamantite !== null) {
                    priority *= limits.Adamantite.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Uranium')) {
            keys.push('uran');
            let priority = settings.droidSettings.Uranium;
            if (limits) {
                if (limits.Uranium !== null) {
                    priority *= limits.Uranium.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Coal')) {
            keys.push('coal');
            let priority = settings.droidSettings.Coal;
            if (limits) {
                if (limits.Coal !== null) {
                    priority *= limits.Coal.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        if (data.hasOwnProperty('Aluminium')) {
            keys.push('alum');
            let priority = settings.droidSettings.Aluminium;
            if (limits) {
                if (limits.Aluminium !== null) {
                    priority *= limits.Aluminium.priority;
                } else {
                    priority /= 10e10;
                }
            }
            priorities.push(priority);
            totalPriority += priority;
        }
        for (let i = 0;i < priorities.length;i++) {
            ratios[i] = priorities[i] / totalPriority;
        }
        let allocFunc = function(index, curNum) {
            switch(keys[index]) {
                case 'adam': {
                    resources.Adamantite.temp_rate += data.Adamantite.produce;
                    break;
                }
                case 'uran': {
                    resources.Uranium.temp_rate += data.Uranium.produce;
                    break;
                }
                case 'coal': {
                    resources.Coal.temp_rate += data.Coal.produce;
                    break;
                }
                case 'alum': {
                    resources.Aluminium.temp_rate += data.Aluminium.produce;
                    break;
                }
            }
        };

        // Creating allocation list
        let allocation = allocate(totalDroids,priorities,ratios,{allocFunc:allocFunc});

        console.log('DROID PRIO:', priorities, 'DROID RATIO:', ratios);
        console.log('DROID ALLOC:', allocation);

        // Allocating
        for (let i = 0;i < keys.length;i++) {
            if (droidModal[keys[i]] > allocation.alloc[i]) {
                for (let j = 0;j < droidModal[keys[i]] - allocation.alloc[i];j++) {
                    droidModal.subItem([keys[i]]);
                }
            }
        }
        for (let i = 0;i < keys.length;i++) {
            if (droidModal[keys[i]] < allocation.alloc[i]) {
                for (let j = 0;j < allocation.alloc[i] - droidModal[keys[i]];j++) {
                    droidModal.addItem([keys[i]]);
                }
            }
        }
    }

    let grapheneModal = null;
    function loadGrapheneModal() {
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        // Opening Modal
        $('#interstellar-g_factory > .special').click();
        setTimeout(function() {
            grapheneModal = window.evolve.vues['specialModal'];

            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }
    function getGrapheneData() {
        let data = {};
        // Lumber
        if (!window.evolve.global.race['kindling_kindred']) {
            data.Lumber = {};
            let str = grapheneModal.buildLabel('wood');
            data.Lumber.fuel = parseFloat(/Consume ([\d\.]+).*/.exec(str)[1]);
            data.Lumber.num = window.evolve.global.interstellar.g_factory.Lumber;

        }
        // Coal
        if (window.evolve.global.resource.Coal.display) {
            data.Coal = {};
            let str = grapheneModal.buildLabel('coal');
            data.Coal.fuel = parseFloat(/Consume ([\d\.]+).*/.exec(str)[1]);
            data.Coal.num = window.evolve.global.interstellar.g_factory.Coal;
        }
        // Oil
        if (window.evolve.global.resource.Oil.display) {
            data.Oil = {};
            let str = grapheneModal.buildLabel('oil');
            data.Oil.fuel = parseFloat(/Consume ([\d\.]+).*/.exec(str)[1]);
            data.Oil.num = window.evolve.global.interstellar.g_factory.Oil;
        }
        return data;
    }
    function autoGraphene(limits) {
        // Don't Auto Graphene if not unlocked
        if (!researched('tech-graphene')) {return;}
        // Loading Graphene Plant Vue
        if (grapheneModal === null) {
            loadGrapheneModal();
            return;
        }

        // Finding relevent elements
        let data = getGrapheneData();
        console.log('GRAPHENE Data:', data);

        let totalFactories = buildings['interstellar-g_factory'].numOn;

        // Reverting current allocation
        if (data.hasOwnProperty('Lumber')) {
            resources.Lumber.temp_rate += data.Lumber.fuel * data.Lumber.num;
        }
        if (data.hasOwnProperty('Coal')) {
            resources.Coal.temp_rate += data.Coal.fuel * data.Coal.num;
        }
        if (data.hasOwnProperty('Oil')) {
            resources.Oil.temp_rate += data.Oil.fuel * data.Oil.num;
        }

        // Calculating Fuel
        let fuelKeys = [];
        let fuelPriorities = [];
        let fuelTotalPriority = 0;
        let fuelRatios = [];
        if (data.hasOwnProperty('Lumber')) {
            fuelKeys.push('Lumber');
            let priority = settings.grapheneSettings.Wood;
            if (limits) {
                if (limits.Lumber !== null) {
                    priority /= limits.Lumber.priority;
                } else {
                    priority *= 10e10;
                }
            }
            fuelPriorities.push(priority);
        }
        if (data.hasOwnProperty('Coal')) {
            fuelKeys.push('Coal');
            let priority = settings.grapheneSettings.Coal;
            if (limits) {
                if (limits.Coal !== null) {
                    priority /= limits.Coal.priority;
                } else {
                    priority *= 10e10;
                }
            }
            fuelPriorities.push(priority);
        }
        if (data.hasOwnProperty('Oil')) {
            fuelKeys.push('Oil');
            let priority = settings.grapheneSettings.Oil;
            if (limits) {
                if (limits.Oil !== null) {
                    priority /= limits.Oil.priority;
                } else {
                    priority *= 10e10;
                }
            }
            fuelPriorities.push(priority);
        }
        for (let i = 0;i < fuelPriorities.length;i++) {fuelTotalPriority += fuelPriorities[i];}
        for (let i = 0;i < fuelPriorities.length;i++) {fuelRatios.push(fuelPriorities[i] / fuelTotalPriority);}
        let resourceCheck = function(index, curNum) {
            switch(fuelKeys[index]) {
                case 'Lumber': return resources.Lumber.temp_rate > data.Lumber.fuel;
                case 'Coal': return resources.Coal.temp_rate > data.Coal.fuel;
                case 'Oil': return resources.Oil.temp_rate > data.Oil.fuel;
            }
            return false;
        };
        let allocFunc = function(index, curNum) {
            switch(fuelKeys[index]) {
                case 'Lumber': {resources.Lumber.temp_rate -= data.Lumber.fuel;break;}
                case 'Coal': {resources.Coal.temp_rate -= data.Coal.fuel;break;}
                case 'Oil': {resources.Oil.temp_rate -= data.Oil.fuel;break;}
            }
        };
        let fuelAllocation = allocate(totalFactories,fuelPriorities,fuelRatios,{requireFunc:resourceCheck, allocFunc:allocFunc});

        console.log("GRAPHENE PRIO:", fuelPriorities);
        console.log("GRAPHENE FUEL:", fuelAllocation);

        // Removing extra fuel
        for (let i = 0;i < fuelKeys.length;i++) {
            if (data[fuelKeys[i]].num > fuelAllocation.alloc[i]) {
                for (let j = 0;j < data[fuelKeys[i]].num - fuelAllocation.alloc[i];j++) {
                    switch(fuelKeys[i]) {
                        case 'Lumber': {
                            grapheneModal.subWood();
                            break;
                        }
                        case 'Coal': {
                            grapheneModal.subCoal();
                            break;
                        }
                        case 'Oil': {
                            grapheneModal.subOil();
                            break;
                        }
                    }
                }
            }
        }
        // Allocating fuel
        for (let i = 0;i < fuelKeys.length;i++) {
            if (data[fuelKeys[i]].num < fuelAllocation.alloc[i]) {
                for (let j = 0;j < fuelAllocation.alloc[i] - data[fuelKeys[i]].num;j++) {
                    switch(fuelKeys[i]) {
                        case 'Lumber': {
                            grapheneModal.addWood();
                            break;
                        }
                        case 'Coal': {
                            grapheneModal.addCoal();
                            break;
                        }
                        case 'Oil': {
                            grapheneModal.addOil();
                            break;
                        }
                    }
                }
            }
        }
    }

    function autoSupport(priorityData) {
        // Don't start autoSupport if haven't unlocked power
        if (!researched('tech-electricity')) {return;}
        let powered = [];
        let totalPowered = 0;
        let priorities = [];
        let totalPriority = 0;
        let ratios = [];
        let maxes = [];
        // Loading all buildings
        for (let x in buildings) {
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
            powered.push(buildings[x]);
            totalPowered += buildings[x].numTotal;
            let priority = buildings[x].powerPriority ** 5;
            totalPriority += priority;
            priorities.push(priority);
            maxes.push(buildings[x].numTotal);
        }
        for (let i = 0;i < powered.length;i++) {
            ratios.push(priorities[i] / totalPriority);
        }
        let support = {
            electricity:0,
            moon_support:0,
            red_support:0,
            swarm_support:0,
            belt_support:0,
            alpha_support:0,
            nebula_support:0
        }
        let canTurnOn = function(index, curNum) {
            let building = powered[index];
            // Checking if this building can be turned on by resources
            for (let j = 0;j < building.consume.length;j++) {
                let res = building.consume[j].res;
                let cost = building.consume[j].cost;
                if (resources[res] !== undefined) {
                    //console.log("Checking",building.id,"RES",res.id,res.temp_rate,cost);
                    if (resources[res].temp_rate < cost) {
                        return false;
                    }
                } else {
                    if (support[res] < cost) {
                        return false;
                    }
                }
            }
            return true;
        };
        let turnOn = function(index, curNum) {
            let building = powered[index];
            // Turning on building
            for (let j = 0;j < building.consume.length;j++) {
                let res = building.consume[j].res;
                let cost = building.consume[j].cost;
                if (resources[res] !== undefined) {
                    resources[res].temp_rate -= cost;
                } else {
                    support[res] -= cost;
                }
            }
            for (let j = 0;j < building.produce.length;j++) {
                let res = building.produce[j].res;
                let cost = building.produce[j].cost;
                if (resources[res] !== undefined) {
                    resources[res].temp_rate += cost * getMultiplier(res) * getMultiplier('Global');
                } else {
                    support[res] += cost;
                }
            }
        }

        let allocation = allocate(totalPowered,priorities,ratios,{max:maxes,requireFunc:canTurnOn,allocFunc:turnOn})

        console.log("POWERED:", powered, "PRIO:", priorities, "RATIO:", ratios);
        console.log("SUPPORT ALLOC:", allocation);
        console.log("REMAIN:", support);

        // Allocating
        for (let i = 0;i < powered.length;i++) {
            let building = powered[i];
            if (building.numOn < allocation.alloc[i]) {
                building.incPower(allocation.alloc[i] - building.numOn);
            }
            else {
                building.decPower(building.numOn - allocation.alloc[i]);
            }
        }

    }

    function prioCompare(a, b) {
        return b.priority - a.priority;
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
            if (btn === null) {
                if (x=='spcdock-probes'||x=='spcdock-seeder') {
                    build.push(buildings[x]);
                }
                continue;
            }
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
            // Don't check researches that don't exist
            if (btn === null) {continue;}
            if (btn.className.indexOf('cnam') >= 0) {continue;}
            // Research filters
            if (settings.autoResearch) {
                if(researches[x].id == "tech-fanaticism" && settings.religion1 == "anthropology") {continue;}
                if(researches[x].id == "tech-anthropology" && settings.religion1 == "fanaticism") {continue;}
                // Checking if study/deify ancients
                if(researches[x].id == "tech-study" && settings.religion2 == "deify") {continue;}
                if(researches[x].id == "tech-deify" && settings.religion2 == "study") {continue;}
                // Checking if unification
                if(researches[x].id.indexOf("wc") >= 0) {
                    if (settings.uniChoice == 'unify') {
                        if (researches[x].id == 'tech-wc_reject') {continue;}
                    } else {
                        if (researches[x].id == 'tech-wc_conquest' || researches[x].id == 'tech-wc_morale' || researches[x].id == 'tech-wc_money') {continue;}
                    }
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
            // Don't check ARPAs that met their limit
            if (arpas[x].limit != -1 && arpas[x].numTotal >= arpas[x].limit) {continue;}
            arpa.push(arpas[x]);
        }
        return arpa;
    }
    function getAvailableStorages() {
        let store = [];
        for (var x in storages) {
            // Don't add if not unlocked
            if (!storages[x].unlocked) {continue;}
            // Don't add if not enabled
            if (!storages[x].enabled) {continue;}
            // Don't add if no more space
            if (storages[x].full) {continue;}
            store.push(storages[x]);
        }
        return store;
    }
    function getAvailableMiscActions() {
        let misc = [];
        for (var x in miscActions) {
            // Don't add if not unlocked
            if (!miscActions[x].unlocked) {continue;}
            // Don't add if disabled
            if (!miscActions[x].enabled) {continue;}
            misc.push(miscActions[x]);
        }
        return misc;
    }
    function getAvailableActions() {
        // Getting buildings and researches
        let actions = getAvailableBuildings().concat(getAvailableResearches()).concat(getAvailableArpas()).concat(getAvailableStorages()).concat(getAvailableMiscActions());

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
    function autoPriority(count) {
        // Finding available actions
        let actions = getAvailableActions();
        //console.log(actions);

        // Storing temporary rates
        for (let x in resources) {
            resources[x].temp_rate = resources[x].rate;
        }

        // Removing trade routes (if exists) for accurate rate
        if (researched('tech-trade')) {
            // Clearing out trade routes
            for (let x in resources) {
                let resource = resources[x];
                if (!(resource instanceof TradeableResource)) {continue;}
                if (resource.tradeNum < 0) {
                    resources.Money.temp_rate -= resource.tradeSellCost * -resource.tradeNum;
                    resource.temp_rate += resource.tradeAmount * -resource.tradeNum;
                } else {
                    resources.Money.temp_rate += resource.tradeBuyCost * resource.tradeNum;
                    resource.temp_rate -= resource.tradeAmount * resource.tradeNum
                }
            }
        }

        // Removing mass ejection (if exists) for accurate rate
        if (window.evolve.global.interstellar.hasOwnProperty('mass_ejector')) {
            if (window.evolve.global.interstellar.mass_ejector.on > 0) {
                for (let x in resources) {
                    let resource = resources[x];
                    if (!resource.ejectable) {continue;}
                    resource.temp_rate += window.evolve.global.interstellar.mass_ejector[x];
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
                return aCost - bCost;
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
            for (let x in action.completion) {
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
                        if (action instanceof Building && !(action instanceof ArpaAction)) {
                            if (settings.printSettings.Buildings) {
                                messageQueue(getTotalGameDays().toString() + " [AUTO-PRIORITY] " + action.name, 'warning');
                            }
                        }
                        else if (action instanceof Research) {
                            if (settings.printSettings.Researches) {
                                messageQueue(getTotalGameDays().toString() + " [AUTO-PRIORITY] " + action.name, 'warning');
                            }
                        }
                        else {
                            if (settings.printSettings.Misc) {
                                messageQueue(getTotalGameDays().toString() + " [AUTO-PRIORITY] " + action.name, 'warning');
                            }
                        }

                    }
                    resetUICheck(action);
                    break;
                }
            }
        }

        // Starting other Auto Settings
        if (settings.autoSmelter) {
            if (settings.smelterSettings.pqCheck) {
                autoSmelter(limits);
            } else {
                autoSmelter();
            }
        }
        if (settings.autoFactory) {
            if (settings.factorySettings.pqCheck) {
                autoFactory(limits);
            } else {
                autoFactory();
            }
        }
        if (settings.autoDroid) {
            if (settings.droidSettings.pqCheck) {
                autoDroid(limits);
            } else {
                autoDroid();
            }
        }
        if (settings.autoGraphene) {
            if (settings.grapheneSettings.pqCheck) {
                autoGraphene(limits);
            } else {
                autoGraphene();
            }
        }
        if (settings.autoSupport) {
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
        // Haven't made non-AutoPriority autoTrade, so ignore otherwise
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
            return b.tradeSellCost - a.tradeSellCost;
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
        let newTradeRoutes = {};
        let curTradeRoutes = {};
        for (let x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            newTradeRoutes[x] = 0;
            curTradeRoutes[x] = resources[x].tradeNum;
        }
        let curFocus = 0;
        let curSell = 0;
        // Allocating all possible trade routes with given money
        let curFreeTradeRoutes = totalTradeRoutes;
        // Keeping fraction of base money for money
        if (wantedRatio.Money > 0) {resources.Money.temp_rate *= 1 - wantedRatio.Money;}
        //console.log(wantedRatio.Money,resources.Money.temp_rate);
        // Begin allocating algorithm
        while (curFreeTradeRoutes > 0) {
            // Checking if can buy trade route
            if (focusSequence && focusSequence.length > curFocus && resources.Money.temp_rate > resources[keys[focusSequence[curFocus]]].tradeBuyCost) {
                // Can buy trade route
                //console.log("Buying", focusSequence[curFocus], curFocus);
                newTradeRoutes[keys[focusSequence[curFocus]]] += 1;
                resources.Money.temp_rate -= resources[keys[focusSequence[curFocus]]].tradeBuyCost;
                curFreeTradeRoutes -= 1;
                curFocus += 1;
            } else {
                // Cannot buy trade route, sell instead
                if (curSell == sellSequence.length) {break;}
                newTradeRoutes[sellSequence[curSell]] -= 1;
                resources.Money.temp_rate += resources[sellSequence[curSell]].tradeSellCost;
                curFreeTradeRoutes -= 1;
                curSell += 1;
            }
        }
        console.log("OLD TRADE ROUTES:", curTradeRoutes);
        console.log("NEW TRADE ROUTES:", newTradeRoutes);
        /*
        for (let x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            window.evolve.global.resource[x].trade = 0;
        }
        for (let x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            window.evolve.global.resource[x].trade = newTradeRoutes[x];
        }
        for (let x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            if (newTradeRoutes[x] > 0) {
                resources[x].tradeDec();
                resources[x].tradeInc();
            }
            else {
                resources[x].tradeInc();
                resources[x].tradeDec();
            }
        }
        */
        
        for (let x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            // Removing routes that don't need routes
            if (newTradeRoutes[x] == 0) {
                if (curTradeRoutes[x] > 0) {
                    resources[x].tradeDec(curTradeRoutes[x]);
                    curTradeRoutes[x] = 0;
                }
                else {
                    resources[x].tradeInc(-curTradeRoutes[x]);
                    curTradeRoutes[x] = 0;
                }
            }
            // Changing all routes that require less
            else {
                if (Math.abs(newTradeRoutes[x]) <= Math.abs(curTradeRoutes[x])) {
                    let routeChange = newTradeRoutes[x] - curTradeRoutes[x];
                    if (routeChange < 0) {
                        resources[x].tradeDec(-routeChange);
                        curTradeRoutes[x] -= routeChange;
                    }
                    else {
                        resources[x].tradeInc(routeChange);
                        curTradeRoutes[x] += routeChange;
                    }
                }
            }
        }
        for (let x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            // Fixing the rest of the routes
            let routeChange = newTradeRoutes[x] - curTradeRoutes[x];
            if (routeChange < 0) {
                resources[x].tradeDec(-routeChange);
            }
            else {
                resources[x].tradeInc(routeChange);
            }
        }
        
    }

    function allocate(totalNum,priorities,ratios,args) {
        args = args || {};
        let allocationList = [];
        let curNum = [];
        let totalAllocated = 0;
        for (let i = 0;i < priorities.length;i++) {curNum.push(0);}
        for (let i = 0;i < totalNum;i++) {
            let total = i+1;
            let error = null;
            let choice = null;
            for (let j = 0;j < priorities.length;j++) {
                // Ignoring zero priority zero ratio choices
                if (priorities[j] == 0 || ratios[j] == 0) {continue;}

                // Checking maxes
                if (args.hasOwnProperty('max') && args.max[j] != -1 && curNum[j] >= args.max[j]) {continue;}

                // Checking requirement function
                if (args.hasOwnProperty('requireFunc') && !args.requireFunc(j, curNum[j])) {continue;}

                // Checking mins
                if (args.hasOwnProperty('min') && curNum[j] < args.min[j]) {
                    choice = j;
                    break;
                }

                // Finding error differential
                let tempError = (((curNum[j]+1) / total) - ratios[j]) ** 2;
                if (total != 1) {tempError -= ((curNum[j] / (total-1)) - ratios[j]) ** 2;}

                if (error === null || tempError < error) {
                    error = tempError;
                    choice = j;
                }
            }
            if (choice === null) {
                break;
            }
            allocationList[i] = choice;
            curNum[choice] += 1;
            totalAllocated += 1;
            if (args.hasOwnProperty('allocFunc')) {
                args.allocFunc(choice, curNum[choice]);
            }
        }
        return {seq:allocationList,alloc:curNum,total:totalAllocated};
    }

    let farmReset = ['tech-club', 'tech-bone_tools'];
    let jobReset = ['city-lumber_yard',
                    'city-rock_quarry',
                    'city-cement_plant',
                    'city-foundry',
                    'city-metal_refinery',
                    'city-mine',
                    'city-coal_mine',
                    'city-amphitheatre',
                    'city-university',
                    'city-wardenclyffe',
                    'tech-investing',
                    'tech-reclaimer',
                    'space-living_quarters',
                    'space-space_station',
                    'portal-carport',];
    let resourceReset = ['city-garrison',
                         'city-storage_yard',
                         'city-warehouse',
                         'city-cement_plant',
                         'city-foundry',
                         'city-factory',
                         'city-metal_refinery',
                         'city-mine',
                         'city-coal_mine',
                         'city-oil_well',
                         'space-iridium_mine',
                         'space-helium_mine',
                         'space-outpost',
                         'interstellar-mining_droid',
                         'interstellar-g_factory',
                         'interstellar-nexus',
                         'portal-carport',];
    function resetUICheck(action) {
        if (farmReset.includes(action.id)) {loadFarm();}
        if (jobReset.includes(action.id)) {
            if (settings.autoEmploy) {createEmploySettings();}
        }
        if (resourceReset.includes(action.id)) {
            if (settings.autoMarket) {createMarketSettings();}
            if (settings.autoTrade) {createTradeSettings();}
            if (settings.autoStorage) {createStorageSettings();}
            if (settings.autoEjector) {createEjectorSettings();}
        }
    }

    let count = 1;
    function fastAutomate() {
        console.clear();
        //console.log(LZString.decompressFromUTF16(window.localStorage['evolved']));
        console.log(count);
        updateUI();
        updateSettings();
        autoFarm();
        autoRefresh();
        autoBattle();
        if (inEvolution()) {
            // Evolution Automation
            if(settings.autoEvolution) {
                autoEvolution();
                // Loading buttons again to get DNA button
                loadFarm();
            }
        } else {
            // Civilization Automation
            var priorityData = null;
            if (settings.autoPriority) {
                priorityData = autoPriority(count);
            }
            else {
                if (settings.autoSmelter) {
                    autoSmelter();
                }
                if (settings.autoFactory) {
                    autoFactory();
                }
                if (settings.autoDroid) {
                    autoDroid();
                }
                if (settings.autoGraphene) {
                    autoGraphene();
                }
                if (settings.autoSupport) {
                    autoSupport();
                }
            }
            if (settings.autoTrade){autoTrade(priorityData);}
            if (settings.autoEjector) {autoEjector();}
            if (settings.autoCraft){
                autoCraft();
            }
            if (settings.autoEmploy){
                autoEmploy(priorityData);
            }
            if (settings.autoTax) {
                autoTax();
            }
            if (settings.autoMarket){
                autoMarket();
            }
            if (settings.autoStorage) {
                autoStorage();
            }
            if (settings.autoPrestige) {
                autoPrestige();
            }
        }
        count += 1;
    }
    setInterval(fastAutomate, 1000);

    /***
    *
    * Setup UI
    *
    ***/

    let toolTipClass = 'is-primary is-bottom is-small b-tooltip is-animated is-multiline';
    function createNumControl(currentValue, name, subFunc, addFunc) {
        let subBtn = $(`<span role="button" aria-label="Decrease ${name}" class="sub">«</span>`);
        let label = $(`<span id="${name}_control" class="count current" style="width:2rem;">${currentValue}</span>`);
        subBtn.on('click', function(e) {
            let mult = keyMult(e);
            document.getElementById(name+'_control').innerText = subFunc(mult);
            updateSettings();
        });
        let addBtn = $(`<span role="button" aria-label="Increase ${name}" class="add">»</span>`);
        addBtn.on('click', function(e) {
            let mult = keyMult(e);
            document.getElementById(name+'_control').innerText = addFunc(mult);
            updateSettings();
        });
        let control = $(`<div class="controls as-${name}-settings" style="display:flex"></div>`).append(subBtn).append(label).append(addBtn);
        return control;
    }
    function createToggleControl(toggleId, toggleName, args) {
        args = args || {};
        let controlName = (Array.isArray(toggleId)) ? toggleId.join('_') : toggleId;
        let checkStyle = (args.small !== undefined) ? 'style="height:5px;"' : '';
        let toggle = $(`
        <label class="switch" id="${controlName}_toggle">
        <input type="checkbox" true-value="true" value="false">
        <span class="check" ${checkStyle}></span>
        <span class="control-label"><span class="is-primary is-bottom is-small is-animated is-multiline">${toggleName}</span>
        </span>
        </label>`);
        let setting = settings;
        if (args.hasOwnProperty('path')) {
            setting = args.path[0];
            for (let i = 1;i < args.path.length-1;i++) {
                setting = setting[args.path[i]];
            }
            toggleId = args.path[args.path.length-1];
        }
        toggle.children('input').on('click', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget;
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            setting[toggleId] = state;
            console.log(`Setting ${controlName} to ${state}`);
            updateSettings();
            if (state && args.enabledCallBack !== undefined) {
                args.enabledCallBack();
            }
            else if (args.disabledCallBack !== undefined) {
                args.disabledCallBack()
            }
            if (args.onChange !== undefined) {
                args.onChange(state);
            }
        });
        if(setting[toggleId]){
            setTimeout( function() {
                console.log(`Setting ${controlName} initially to true`);
                toggle.children('span.check').click();
                toggle.children('input').attr('value', true);
            }, 1000);
        }
        return toggle;
    }
    function createDropDownControl(currentValue, id, name, values, args) {
        args = args || {};
        let option = $(`<div style="display:flex;" id="${id}_dropdown"></div>`);
        let label = $(`<span class="has-text-warning" style="width:12rem;">${name}:</span>`);
        if (args.toolTip !== undefined) {
            label.addClass(toolTipClass);
            label.attr('data-label', args.toolTip);
        }
        option.append(label);
        let decision = $(`<select style="width:12rem;"></select>`);
        for (let val in values) {
            decision.append($(`<option value="${val}">${values[val]}</option>`));
        }
        decision[0].value = settings[id];
        decision[0].onchange = function(){
            settings[id] = decision[0].value;
            console.log(`Changing ${id} to ${settings[id]}`);
            updateSettings();
            if (args.onChange !== undefined) {
                args.onChange(decision[0].value);
            }
        };
        option.append(decision);
        return option;
    }
    function createCheckBoxControl(currentValue, id, name, args) {
        args = args || {};
        let checkBox = $(`
        <label class="b-checkbox checkbox" id="${id}">
        <input type="checkbox" true-value="Yes" false-value="No" value="false">
        <span class="check is-dark"></span>
        <span class="control-label">${name}</span>
        </label>`);
        if (args.toolTip !== undefined) {
            checkBox.addClass(toolTipClass);
            checkBox.attr("data-label", args.toolTip);
        }
        let setting = settings;
        if (args.hasOwnProperty('path')) {
            setting = args.path[0];
            for (let i = 1;i < args.path.length-1;i++) {
                setting = setting[args.path[i]];
            }
            id = args.path[args.path.length-1];
        }
        checkBox.children('input').on('click', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget;
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            setting[id] = state;
            console.log("Setting", id, "to", state);
            updateSettings();
            if (state && args.enabledCallBack !== undefined){
                args.enabledCallBack();
            } else if(args.disabledCallBack !== undefined){
                args.disabledCallBack()
            }
        });
        if(setting[id]){
            setTimeout( function() {
                console.log("Setting initially to true");
                checkBox.children('span.check').click();
                checkBox.children('input').attr('value', true);
            }, 1000);
        }
        return checkBox;
    }
    function createInputControl(currentValue, id, name, args) {
        args = args || {};
        let div = $(`<div style="display:flex" id="${id}_input"></div>`);
        let label = $(`<span class="has-text-warning" style="width:12rem;">${name}:</span>`);
        if (args.toolTip !== undefined) {
            label.addClass(toolTipClass);
            label.attr('data-label', args.toolTip);
        }
        div.append(label);
        let input = $(`<input type="text" class="input is-small" style="width:10rem;"/>`);
        div.append(input);
        let setting = settings;
        if (args.hasOwnProperty('path')) {
            setting = args.path[0];
            for (let i = 1;i < args.path.length-1;i++) {
                setting = setting[args.path[i]];
            }
            id = args.path[args.path.length-1];
        }
        input.val(currentValue);
        let setBtn = $(`<a class="button is-dark is-small" id="${id}_input_set" style="width:2rem;"><span>Set</span></a>`);
        div.append(setBtn);
        setBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            let val = input.val();
            // Converting input
            if (args.convertFunc !== undefined) {val = args.convertFunc(val);}
            if (val === null) {input.val(setting[id]);return;}
            console.log(`Setting input ${name} to ${val}`);
            setting[id] = val;
            input.val(val);
            updateSettings();
            // CallBack function
            if (args.setFunc !== undefined) {args.setFunc(setting.id);}
        });
        return div;
    }

    function updateUI(){
        if ($('.as-autolog').length == 0) {
            createAutoLog();
        }
        if ($('#autoSettingTab').length == 0) {
            createSettingTab();
        }
        if (settings.autoStorage && $('.as-storage-settings').length == 0) {
            createStorageSettings();
        }
        if (settings.autoEmploy && $('.as-employ-settings').length == 0) {
            createEmploySettings();
        }
        if (settings.autoMarket && $('.as-market-settings').length == 0) {
            createMarketSettings();
        }
        if (settings.autoTrade && $('.as-trade-settings').length == 0) {
            createTradeSettings();
        }
        if ($('#autoSettings').length == 0) {
            createAutoSettings();
        }
        if ($('#as-watermark').length == 0) {
            createScriptWatermark();
        }
    }

    function resetUI() {
        console.log("Resetting UI");
        removeStorageSettings();
        removeMarketSettings();
        removeTradeSettings();
        removeEmploySettings();
        $('.as-autolog').remove();
        $('.as-settings').remove();
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
        importBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            importSettings();
        });
        let exportBtn = $('<button class="button">Export Settings</button>');
        exportBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            exportSettings();
        });
        mainDiv.append(control).append(importBtn).append(exportBtn);
        parent.append(mainDiv[0]);
    }

    function createStorageSetting(id) {
        if (!resources[id].unlocked) {return;}
        if (!resources[id].crateable) {return;}
        let resourceSpan = $('#stack-'+resources[id].id);
        let div = $('<div class="as-storage-settings" style="display:flex"></div>');
        let prioritySub = function(mult) {
            resources[id].decStorePriority(mult);
            loadStorageUI();
            return resources[id].storePriority;
        }
        let priorityAdd = function(mult) {
            resources[id].incStorePriority(mult);
            loadStorageUI();
            return resources[id].storePriority;
        }
        let priorityControls = createNumControl(resources[id].storePriority, id+"-store-priority", prioritySub, priorityAdd);
        div.append(priorityControls)

        let minSub = function(mult) {
            resources[id].decStoreMin(mult);
            loadStorageUI();
            return resources[id].storeMin;
        }
        let minAdd = function(mult) {
            resources[id].incStoreMin(mult);
            loadStorageUI();
            return resources[id].storeMin;
        }
        let minControls = createNumControl(resources[id].storeMin, id+"-store-min", minSub, minAdd);
        div.append(minControls)

        let maxSub = function(mult) {
            resources[id].decStoreMax(mult);
            loadStorageUI();
            return resources[id].storeMax;
        }
        let maxAdd = function(mult) {
            resources[id].incStoreMax(mult);
            loadStorageUI();
            return resources[id].storeMax;
        }
        let maxControls = createNumControl(resources[id].storeMax, id+"-store-max", maxSub, maxAdd);
        div.append(maxControls);

        resourceSpan.append(div);
    }
    function createStorageSettings() {
        // Don't render if haven't researched crates
        if (!researched('tech-containerization')) {return;}
        removeStorageSettings();
        // Creating labels
        let labelSpan = $('#createHead');
        let prioLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:2rem"><span class="has-text-warning">Priority</span></div>');
        let minLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:3rem"><span class="has-text-warning">Min</span></div>');
        let maxLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:3rem"><span class="has-text-warning">Max</span></div>');
        labelSpan.append(prioLabel).append(minLabel).append(maxLabel);
        // Creating individual counters
        for (var x in resources) {
            createStorageSetting(x);
        }
    }
    function removeStorageSettings() {
        $('.as-storage-settings').remove();
    }

    function createMarketSetting(resource){
        let marketDiv = $(`<div style="display:flex;" class="as-market-settings as-market-${resource.id}"></div>`);



        let manualBuy = $('<div style="display:flex;"></div>');
        marketDiv.append(manualBuy);
        let buyToggleOnChange = function(state) {
            let sellToggle = $(`#${resource.id}-autoSell_toggle`);
            let otherState = sellToggle.children('input').attr('value') === 'true';
            if(state && otherState){
                sellToggle.click();
                console.log("Turning off sellToggle");
                resource.autoSell = false;
                sellToggle.children('input')[0].setAttribute('value',false);
            }
            loadTradeUI();
        }
        let buyToggle = createToggleControl(resource.id+'-autoBuy', '', {path:[resources, resource.id, 'autoBuy'],small:true,onChange:buyToggleOnChange});
        manualBuy.append(buyToggle);

        let buyRatioSub = function(mult) {
            resource.buyDec(mult);
            loadTradeUI();
            return resource.buyRatio;
        }
        let buyRatioAdd = function(mult) {
            resource.buyInc(mult);
            loadTradeUI();
            return resource.buyRatio;
        }
        let buyRatioControl = createNumControl(resource.buyRatio, resource.id+'-buy-ratio',buyRatioSub,buyRatioAdd);
        manualBuy.append(buyRatioControl);

        let manualSell = $('<div style="display:flex;"></div>');
        marketDiv.append(manualSell);
        let sellToggleOnChange = function(state) {
            let buyToggle = $(`#${resource.id}-autoBuy_toggle`);
            let otherState = sellToggle.children('input').attr('value') === 'true';
            if(state && otherState){
                buyToggle.click();
                console.log("Turning off buyToggle");
                resource.autoBuy = false;
                buyToggle.children('input')[0].setAttribute('value',false);
            }
            loadTradeUI();
        }
        let sellToggle = createToggleControl(resource.id+'-autoSell', '', {path:[resources, resource.id, 'autoSell'],small:true,onChange:sellToggleOnChange});
        manualSell.append(sellToggle);

        let sellRatioSub = function(mult) {
            resource.sellDec(mult);
            loadTradeUI();
            return resource.sellRatio;
        }
        let sellRatioAdd = function(mult) {
            resource.sellInc(mult);
            loadTradeUI();
            return resource.sellRatio;
        }
        let sellRatioControl = createNumControl(resource.sellRatio, resource.id+'-sell-ratio',sellRatioSub,sellRatioAdd);
        manualSell.append(sellRatioControl);

        return [marketDiv, manualBuy, manualSell];
    }
    function createMarketSettings(){
        // Don't render if haven't researched markets
        if (!researched('tech-market')) {return;}
        removeMarketSettings();
        let mainDiv = document.getElementById('market');
        mainDiv.insertBefore($('<div class="as-market-settings"><br></div>')[0],mainDiv.children[1]);
        let firstRow = false;
        // Creating settings for TradeableResources
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            let [marketDiv, manualBuy, manualSell] = createMarketSetting(resources[x]);
            if (!firstRow) {
                firstRow = true;
                let buyLabel = $('<div style="position:absolute;top:1.5rem;"><span>Manual Buy</span></div>');
                manualBuy.prepend(buyLabel[0]);
                let sellLabel = $('<div style="position:absolute;top:1.5rem;"><span>Manual Sell</span></div>');
                manualSell.prepend(sellLabel[0]);
            }
            let marketRow = $('#market-'+resources[x].id);
            marketRow.append(marketDiv);
        }
    }
    function removeMarketSettings(){
        $('.as-market-settings').remove();
    }

    function createTradeSetting(resource) {
        let marketDiv = $(`<div style="display:flex;" class="as-trade-settings as-trade-${resource.id}"></div>`);

        let prioritySub = function(mult) {
            resource.decBasePriority(mult);
            loadTradeUI();
            return resource.basePriority;
        }
        let priorityAdd = function(mult) {
            resource.incBasePriority(mult);
            loadTradeUI();
            return resource.basePriority;
        }
        let priorityControl = createNumControl(resource.basePriority, resource.id+'-trade-priority',prioritySub,priorityAdd);
        marketDiv.append(priorityControl);

        return [marketDiv, priorityControl];
    }
    function createTradeSettings() {
        // Don't render if haven't researched markets
        if (!researched('tech-trade')) {return;}
        removeTradeSettings();
        let mainDiv = document.getElementById('market');
        if ($('.as-market-settings > br').length == 0) {
            mainDiv.insertBefore($('<div class="as-trade-settings"><br></div>')[0],mainDiv.children[1]);
        }
        let firstRow = false;
        let lastRow = null;
        // Creating settings for TradeableResources
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            let [marketDiv, tradeControl] = createTradeSetting(resources[x]);
            if (!firstRow) {
                firstRow = true;
                let tradeLabel = $('<div style="position:absolute;top:1.5rem;"><span>Trade</span></div>');
                tradeControl.prepend(tradeLabel[0]);
            }
            let marketRow = $('#market-'+resources[x].id);
            marketRow.append(marketDiv);
            if (marketRow[0].style.display != 'none') {lastRow = [tradeControl, marketDiv, marketRow];}
        }

        // Creating trade setting for money
        let tradeRow = document.getElementById("tradeTotal");
        let moneyLabel = $('<div style="position:absolute;bottom:4rem;width:5.25rem;text-align:center;"><span>$$$</span></div>');
        lastRow[0].prepend(moneyLabel);
        let priorityDiv = $('<div style="position:absolute;bottom:3rem;width:5.25rem;text-align:center;"</div>');
        let prioritySub = function(mult) {
            resources.Money.decBasePriority(mult);
            loadTradeUI();
            return resources.Money.basePriority;
        }
        let priorityAdd = function(mult) {
            resources.Money.incBasePriority(mult);
            loadTradeUI();
            return resources.Money.basePriority;
        }
        let priorityControl = createNumControl(resources.Money.basePriority,"Money-trade-priority",prioritySub,priorityAdd);
        priorityDiv.append(priorityControl);
        lastRow[0].prepend(priorityDiv[0]);
    }
    function removeTradeSettings() {
        $('.as-trade-settings').remove();
    }

    function createEjectorSetting(resource) {

    }
    function createEjectorSettings() {
        // Don't render if haven't unlocked mass ejectors
        if (!window.evolve.global.interstellar.hasOwnProperty('mass_ejector')) {return;}
        if (window.evolve.global.interstellar.mass_ejector.count == 0) {return;}
        removeEjectorSettings();

    }
    function removeEjectorSettings() {
        $('.as-ejector-settings').remove();
    }

    function createEmploySettings() {
        removeEmploySettings();
        for (var x in jobs) {
            let job = jobs[x];
            if (!job.unlocked) {continue;}
            let prioritySub = function(mult) {
                job.lowerPriority(mult);
                loadEmployUI();
                return job._priority;
            }
            let priorityAdd = function(mult) {
                job.higherPriority(mult);
                loadEmployUI();
                return job._priority;
            }
            let priorityControl = createNumControl(job._priority, job.id+'-priority',prioritySub,priorityAdd);
            if (job.id != "free" || job.name == 'Hunter') {
                if (job.id == "craftsman") {
                    let parent = $('#foundry > .job > .foundry').parent();
                    let div = $('<div class="foundry as-employ-settings" style="text-align:right;margin-left:4.5rem"></div>');
                    parent.append(div);
                    div.append(priorityControl);
                    //parent.append(priorityControl);
                } else if (job.id == 'free') {
                    let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:4.5rem"></div>');
                    $('#civ-'+job.id).append(div);
                    div.append(priorityControl);
                }else {
                    let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:1.25rem"></div>');
                    $('#civ-'+job.id).append(div);
                    div.append(priorityControl);
                }

            } else {
                let parent = document.getElementById("civ-"+job.id);
                let priorityLabel = $('<span class="has-text-warning as-employ-settings" style="text-align:right;min-width:9.25rem">Priority</span>');
                $('#civ-'+job.id).append(priorityLabel);
            }
        }

        for (x in craftJobs) {
            let cjob = craftJobs[x];
            if (!cjob.unlocked) {continue;}
            let prioritySub = function(mult) {
                cjob.lowerPriority(mult);
                loadEmployUI();
                return cjob._priority;
            }
            let priorityAdd = function(mult) {
                cjob.higherPriority(mult);
                loadEmployUI();
                return cjob._priority;
            }
            let priorityControl = createNumControl(cjob._priority, cjob.id+'-priority',prioritySub,priorityAdd);
            let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:1.25rem">');
            div.append(priorityControl);
            $('#craft'+cjob.id).parent().append(div);
        }

    }
    function removeEmploySettings() {
        $('.as-employ-settings').remove();
    }

    function createAutoSettingPage(name, labelElm, contentElm) {
        let label = $('<li class="as-settings"><a><span>'+name+'</span></a></li>');
        let tab = $('<div id="'+name+'_setting_tab'+'" class="tab-item as-settings" style="display:none"><h2 class="is-sr-only">'+name+'</h2></div>');
        label.on('click',function(e) {
            if (e.which != 1) {return;}
            for (let i = 0;i < labelElm.children().length;i++) {
                let tabLabel = labelElm.children()[i];
                let tabItem = contentElm.children()[i];
                if (tabLabel.classList.contains("is-active")) {
                    tabLabel.classList.remove("is-active");
                    tabItem.style.display = 'none';
                }
            }
            label.addClass("is-active");
            tab[0].style.display = '';
        });
        labelElm.append(label);
        contentElm.append(tab);
        return tab;
    }
    function createSettingTab() {
        let settingTabLabel = $('<li class="as-settings"><a><span>Auto Settings</span></a></li>');
        let settingTab = $('<div id="autoSettingTab" class="tab-item as-settings" style="display:none"><h2 class="is-sr-only">Auto Settings</h2></div>');
        // Creating click functions for other tabs
        for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
            let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
            let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
            tabLabel.on('click',function(e) {
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
        settingTabLabel.on('click',function(e) {
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

        let tabDiv = $('<div class="b-tabs resTabs"></div>');
        let nav = $('<nav class="tabs"></nav>');
        tabDiv.append(nav);
        let section = $('<section class="tab-content"></section>');
        tabDiv.append(section);
        let ul = $('<ul></ul>');
        nav.append(ul);
        settingTab.append(tabDiv);

        let generalTab = createAutoSettingPage("General", ul, section);
        createAutoSettingGeneralPage(generalTab);
        let evolutionTab = createAutoSettingPage("Evolution", ul, section);
        createAutoSettingEvolutionPage(evolutionTab);
        let jobTab = createAutoSettingPage("Jobs/Army", ul, section);
        createAutoSettingJobPage(jobTab);
        let resourceTab = createAutoSettingPage("Resources", ul, section);
        createAutoSettingResourcePage(resourceTab);
        let buildingTab = createAutoSettingPage("Buildings", ul, section);
        createAutoSettingBuildingPage(buildingTab);
        let researchTab = createAutoSettingPage("Research", ul, section);
        createAutoSettingResearchPage(researchTab);
        let priorityTab = createAutoSettingPage("Priority", ul, section);
        createAutoSettingPriorityPage(priorityTab);
    }
    function createAutoSettingToggle(id, name, description, hasContent, tab, enabledCallBack, disabledCallBack) {
        let titleDiv = $('<div style="display:flex;justify-content:space-between;"></div>');
        tab.append(titleDiv);
        let toggle = createToggleControl(id, name, {enabledCallBack:enabledCallBack, disabledCallBack:disabledCallBack});
        titleDiv.append(toggle);
        let details = $(`<div><span>${description}</span></div>`);
        tab.append(details);
        tab.append($('<br></br>'));
        let content = null;
        if (hasContent) {
            let contentId = 'as-' + id + '-content';
            content = $(`<div style="margin-left:2em;" id="${contentId}"></div>`);
            tab.append(content);
            tab.append($('<br></br>'));
        }
        return [titleDiv, content];
    }

    function createAutoSettingGeneralPage(tab) {

        // Auto Print
        let autoPrintDesc = 'Prints out script details in the script printing window. Currently only action details are implemented. Toggle to ignore certain actions from appearing in the message queue.';
        let [autoPrintTitle, autoPrintContent] = createAutoSettingToggle('autoPrint', 'Auto Print', autoPrintDesc, true, tab);

        let printOption = $('<div style="display:flex;"></div>');
        autoPrintContent.append(printOption);
        let printToolTip = 'Checking these will send the print messages to the script message queue.';
        printOption.append($(`<div><span class="has-text-warning ${toolTipClass}" style="width:12rem;" data-label="${printToolTip}">Print Settings:</span></div>`));
        let printToggles = $('<div></div>');
        printOption.append(printToggles);
        for (let i = 0;i < printSettings.length;i++) {
            let toggleVal = settings.printSettings[printSettings[i]];
            let toggleId = printSettings[i];
            let str = evoChallengeActions[i].split('-')[1];
            let toggleName = printSettings[i];
            let toggle = createCheckBoxControl(toggleVal, toggleId, toggleName, {path:[settings, 'printSettings', toggleId]});
            let toggleDiv = $('<div></div>');
            toggleDiv.append(toggle);
            printToggles.append(toggleDiv);
        }

        // Auto Farm
        let autoFarmDesc = 'Auto-clicks the manual farming buttons that exist on the screen. If the buttons are not being auto-clicked, try reloading the UI. Defaults to click at 100/s (10 ms).';
        let [autoFarmTitle, autoFarmContent] = createAutoSettingToggle('autoFarm', 'Auto Farm', autoFarmDesc, true, tab);

        let farmToolTip = 'Determines how fast the manual buttons will be clicked (every # milliseconds)';
        let convertFunc = function(val) {
            if (isNaN(val)) {return null;}
            val = parseInt(val);
            if (val <= 0) {return null;}
            return val;
        }
        let setFunc = function(val) {
            // Clearing farmInterval to refresh with new farm rate
            if (farmInterval !== null) {
                clearInterval(farmInterval);
                farmInterval = null;
            }
        }
        let farmRateInput = createInputControl(settings.farmRate, 'farmRate', 'Farm Rate', {convertFunc:convertFunc,setFunc:setFunc,toolTip:farmToolTip});
        autoFarmContent.append(farmRateInput);

        // Auto Refresh
        let autoRefreshDesc = 'Automatically reloads the page every 200 seconds. This setting was made due to the modal windows lagging after too many launches. Refreshing will remove this lag.';
        let [autoRefreshTitle, autoRefreshContent] = createAutoSettingToggle('autoRefresh', 'Auto Refresh', autoRefreshDesc, false, tab);
        let reloadBtnDetails = 'Resets the UI and reloads the backend variables.';
        let reloadBtn = $(`<div role="button" class="is-primary is-bottom is-small b-tooltip is-animated is-multiline" data-label="${reloadBtnDetails}"><button class="button is-primary"><span>Reset UI</span></button></div>`);
        reloadBtn.on('click', function(e){
            if (e.which != 1) {return;}
            resetUI();
            updateSettings();
            loadSettings();
        });
        autoRefreshTitle.append(reloadBtn);

        // Auto Prestige
        let autoPrestigeDesc = 'Automatically prestiges when the options are availible. Maybe will add min prestige resource gain setting if wanted.';
        let [autoPrestigeTitle, autoPrestigeContent] = createAutoSettingToggle('autoPrestige', 'Auto Prestige', autoPrestigeDesc, true, tab);

        let prestige = createDropDownControl(settings.prestige, 'prestige', 'Prestige Choice', {mad:'MAD',bioseed:'Bioseed',blackhole:'Blackhole'});
        autoPrestigeContent.append(prestige);

        // Advanced

    }

    function createAutoSettingEvolutionPage(tab) {

        // Auto Evolution/Challenge
        let autoEvolutionDesc = 'Automatically plays the Evolution stage. It will buy the mininum amount of RNA/DNA storage for evolving, as well as automatically purchase challenges.';
        let [autoEvolutionTitle, autoEvolutionContent] = createAutoSettingToggle('autoEvolution', 'Auto Evolution', autoEvolutionDesc, true, tab);

        let raceValues = {};
        for (let race in window.evolve.races) {
            if (race == 'protoplasm' || race == 'junker') {continue;}
            raceValues[race] = window.evolve.races[race].name;
        }
        let raceOption = createDropDownControl(settings.evolution, 'evolution', 'Evolution Decision', raceValues);
        autoEvolutionContent.append(raceOption);
        autoEvolutionContent.append($('<br></br>'));

        let challengeOption = $('<div style="display:flex;"></div>');
        autoEvolutionContent.append(challengeOption);
        challengeOption.append($('<h3 class="has-text-warning" style="width:12rem;">Challenges:</h3>'));
        let challengeToggles = $('<div></div>');
        challengeOption.append(challengeToggles);
        for (let i = 0;i < evoChallengeActions.length;i++) {
            let toggleVal = settings[evoChallengeActions[i]];
            let toggleId = evoChallengeActions[i];
            let str = evoChallengeActions[i].split('-')[1];
            let toggleName = str.charAt(0).toUpperCase() + str.slice(1);
            let toggle = createCheckBoxControl(toggleVal, toggleId+'_checkbox', toggleName, {path:[settings, toggleId]});
            let toggleDiv = $('<div></div>');
            toggleDiv.append(toggle);
            challengeToggles.append(toggleDiv);
        }
    }

    function loadEmployUI(content) {
        if (content === null || content == undefined) {content = $('#as-autoEmploy-content');}
        $('.as-employui').remove();
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item as-employui"></div>');
        content.append(labelDiv);
        let jobLabel = $('<span class="has-text-warning" style="width:12rem;">Job</span>');
        labelDiv.append(jobLabel);
        let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
        labelDiv.append(priorityLabel);

        for (let x in jobs) {
            let id = x;
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-employui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-employui"></div>');
            }
            content.append(div);

            // Setting Hunter priority
            let name = (x == 'free') ? 'Hunter' : jobs[x].name;
            let label = $(`<span class="has-text-info" style="width:12rem;">${name}</h3>`);
            div.append(label);

            let priorityDiv = $('<div style="width:12rem;"></div>');
            div.append(priorityDiv);
            let prioritySub = function(mult) {
                jobs[id].lowerPriority(mult);
                createEmploySettings();
                return jobs[id]._priority;
            }
            let priorityAdd = function(mult) {
                jobs[id].higherPriority(mult);
                createEmploySettings();
                return jobs[id]._priority;
            }
            let priorityControl = createNumControl(jobs[id]._priority, jobs[id].id+'_priority',prioritySub,priorityAdd);
            priorityDiv.append(priorityControl);
        }
        for (let x in craftJobs) {
            let id = x;
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-employui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-employui"></div>');
            }
            content.append(div);

            let label = $(`<span class="has-text-danger" style="width:12rem;">${craftJobs[x].name}</h3>`);
            div.append(label);

            let priorityDiv = $('<div style="width:12rem;"></div>');
            div.append(priorityDiv);
            let prioritySub = function(mult) {
                craftJobs[id].lowerPriority(mult);
                createEmploySettings();
                return craftJobs[id]._priority;
            }
            let priorityAdd = function(mult) {
                craftJobs[id].higherPriority(mult);
                createEmploySettings();
                return craftJobs[id]._priority;
            }
            let priorityControl = createNumControl(craftJobs[id]._priority, craftJobs[id].id+'_priority',prioritySub,priorityAdd);
            priorityDiv.append(priorityControl);
        }
    }
    function loadBattleUI(content) {

        // FirstDiv contains Max Campaign and Check Unwounded

        let firstDiv = $('<div style="display:flex;"></div>');
        content.append(firstDiv);

        let maxCampaignOptions = {0:'Ambush',1:'Raid',2:'Pillage',3:'Assault',4:'Siege'};
        let maxCampaignOption = createDropDownControl(settings.maxCampaign, 'maxCampaign', 'Max Campaign', maxCampaignOptions);
        firstDiv.append(maxCampaignOption);

        firstDiv.append($('<div style="width:6rem;"></div>'));

        let woundedCheckToolTip = 'Enable to stop running campaigns if there are wounded soldiers. Disable to run campaigns as soon as there are enough healthy soldiers to fight. Disabling causes more lag due to the algorithm running continously.';
        let woundedCheck = createCheckBoxControl(settings.woundedCheck, 'woundedCheck', "Check Wounded", {toolTip:woundedCheckToolTip});
        firstDiv.append(woundedCheck);

        content.append($('<br></br>'));

        // Minimum Win Rate

        let convertFunc = function(val) {
            if (isNaN(val)) {return null;}
            val = parseFloat(val);
            if (val < 0 || val > 100) {return null;}
            return val;
        }
        let minWinRateInput = createInputControl(settings.minWinRate, 'minWinRate', 'Minimum Win Rate', {convertFunc:convertFunc});
        content.append(minWinRateInput);
        content.append($('<br></br>'));

        // SecondDiv contains Campaign Fail Interval and Campaign Fail Check

        let secondDiv = $('<div style="display:flex;"></div>');
        content.append(secondDiv);

        let campaignFailIntervalInputToolTip = 'Sets the time in seconds to wait after a failed campaign check.';
        convertFunc = function(val) {
            if (isNaN(val)) {return null;}
            val = parseFloat(val);
            if (val < 0) {return null;}
            return val;
        }
        let campaignFailIntervalInput = createInputControl(settings.campaignFailInterval, 'campaignFailInterval', 'Campaign Fail Interval', {convertFunc:convertFunc,toolTip:campaignFailIntervalInputToolTip});
        secondDiv.append(campaignFailIntervalInput);

        secondDiv.append($('<div style="width:6rem;"></div>'));

        let campaignFailCheckStr = 'Enable to stop Auto Battle for an time if the campaign algorithm fails. This is to stop infinite loops when the algorithm cannot find a optimal battle.';
        let campaignFailCheck = createCheckBoxControl(settings.campaignFailCheck, 'campaignFailCheck', "Fail Check", {toolTip:campaignFailCheckStr});
        secondDiv.append(campaignFailCheck);

    }
    function createAutoSettingJobPage(tab) {

        // Auto Tax
        let autoTaxDesc = 'Manages the tax rate for optimal morale and taxes.';
        let [autoTaxTitle, autoTaxContent] = createAutoSettingToggle('autoTax', 'Auto Tax', autoTaxDesc, true, tab);

        let minMoraleDiv = $('<div style="display:flex;"></div>');
        autoTaxContent.append(minMoraleDiv);
        let minMoraleTxt = $('<span class="has-text-warning" style="width:12rem;">Minimum Morale:</span>')
        minMoraleDiv.append(minMoraleTxt);

        let minMoraleSub = function(mult) {
            settings.minimumMorale -= mult;
            if (settings.minimumMorale < 50) {settings.minimumMorale = 50;}
            return settings.minimumMorale;
        }
        let minMoraleAdd = function(mult) {
            settings.minimumMorale += mult;
            return settings.minimumMorale;
        }
        let minMoraleControl = createNumControl(settings.minimumMorale, "minimum_morale", minMoraleSub, minMoraleAdd);
        minMoraleDiv.append(minMoraleControl);

        // Auto Employ
        let autoEmployDesc = 'Allocates the population to jobs. May add min/max settings later on.';
        let [autoEmployTitle, autoEmployContent] = createAutoSettingToggle('autoEmploy', 'Auto Employ', autoEmployDesc, true, tab, createEmploySettings, removeEmploySettings);
        loadEmployUI(autoEmployContent);

        // Auto Battle
        let autoBattleDesc = 'Automatically runs battle campaigns. Will choose the highest campaign that allows for the minimum win rate. You can limit the highest campaign as well, as Siege is always less efficient.';
        let [autoBattleTitle, autoBattleContent] = createAutoSettingToggle('autoBattle', 'Auto Battle', autoBattleDesc, true, tab);
        loadBattleUI(autoBattleContent);

        // Auto Fortress
        let autoFortressDesc = 'Manages soldier allocation in the fortress. Currently not yet implemented.';
        let [autoFortressTitle, autoFortressContent] = createAutoSettingToggle('autoFortress', 'Auto Fortress', autoFortressDesc, true, tab);

    }

    function loadTradeUI(content) {
        if (content === null || content == undefined) {content = $('#as-autoTrade-content');}
        $('.as-tradeui').remove();
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item as-tradeui"></div>');
        content.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Tradeable Resource</h3>');
        labelDiv.append(resourceLabel);
        let buyLabel = $('<span class="has-text-warning" style="width:12rem;">Manual Buy</h3>');
        labelDiv.append(buyLabel);
        let sellLabel = $('<span class="has-text-warning" style="width:12rem;">Manual Sell</h3>');
        labelDiv.append(sellLabel);
        let tradeLabel = $('<span class="has-text-warning" style="width:12rem;">Trade Priority</h3>');
        labelDiv.append(tradeLabel);
        i += 1;
        let moneyDiv = $('<div style="display:flex" class="market-item as-tradeui"></div>');
        content.append(moneyDiv);
        let moneyLabel = $('<span class="has-text-advanced" style="width:12rem;">Money</span>');
        moneyDiv.append(moneyLabel);
        let padding = $('<div style="width:24rem;"></div>');
        moneyDiv.append(padding);
        let moneyPrioritySub = function(mult) {
            resources['Money'].decBasePriority(mult);
            createMarketSettings();
            return resources['Money'].basePriority;
        }
        let moneyPriorityAdd = function(mult) {
            resources['Money'].incBasePriority(mult);
            createMarketSettings();
            return resources['Money'].basePriority;
        }
        let moneyPriorityControl = createNumControl(resources['Money'].basePriority, resources['Money'].id+'_priority',moneyPrioritySub,moneyPriorityAdd);
        moneyDiv.append(moneyPriorityControl);
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            let id = x;
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-tradeui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-tradeui"></div>');
            }
            content.append(div);

            var label = $(`<span class="has-text-info" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);

            let manualBuy = $('<div style="width:12rem;display:flex;"></div>');
            div.append(manualBuy);

            let buyToggleOnChange = function(state) {
                let sellToggle = $(`#${id}_autoSell_toggle`);
                let otherState = sellToggle.children('input').attr('value') === 'true';
                if(state && otherState){
                    sellToggle.click();
                    console.log("Turning off sellToggle");
                    resources[id].autoSell = false;
                    sellToggle.children('input')[0].setAttribute('value',false);
                }
                createMarketSettings();
            }
            let buyToggle = createToggleControl(id+'_autoBuy', '', {path:[resources, id, 'autoBuy'],small:true,onChange:buyToggleOnChange});
            manualBuy.append(buyToggle);

            let buyDec = function(mult) {
                resources[id].buyDec(mult);
                createMarketSettings();
                return resources[id].buyRatio;
            }
            let buyInc = function(mult) {
                resources[id].buyInc(mult);
                createMarketSettings();
                return resources[id].buyRatio;
            }
            let buyVal = resources[id].buyRatio;
            let buyControls = createNumControl(buyVal,resources[id].name+"_buy_ratio",buyDec,buyInc);
            manualBuy.append(buyControls);

            let manualSell = $('<div style="width:12rem;display:flex;"></div>');
            div.append(manualSell);

            let sellToggleOnChange = function(state) {
                let buyToggle = $(`#${id}_autoBuy_toggle`);
                let otherState = buyToggle.children('input').attr('value') === 'true';
                if(state && otherState){
                    buyToggle.click();
                    console.log("Turning off buyToggle");
                    resources[id].autoBuy = false;
                    buyToggle.children('input')[0].setAttribute('value',false);
                }
                createMarketSettings();
            }
            let sellToggle = createToggleControl(id+'_autoSell', '', {path:[resources, id, 'autoSell'],small:true,onChange:sellToggleOnChange});
            manualSell.append(sellToggle);

            let sellDec = function(mult) {
                resources[id].sellDec(mult);
                createMarketSettings();
                return resources[id].sellRatio;
            }
            let sellInc = function(mult) {
                resources[id].sellInc(mult);
                createMarketSettings();
                return resources[id].sellRatio;
            }
            let sellVal = resources[id].sellRatio;
            let sellControls = createNumControl(sellVal,resources[id].name+"_sell_ratio",sellDec,sellInc);
            manualSell.append(sellControls);

            let prioritySub = function(mult) {
                resources[id].decBasePriority(mult);
                createMarketSettings();
                return resources[id].basePriority;
            }
            let priorityAdd = function(mult) {
                resources[id].incBasePriority(mult);
                createMarketSettings();
                return resources[id].basePriority;
            }
            let priorityControl = createNumControl(resources[id].basePriority, resources[id].id+'_priority',prioritySub,priorityAdd);
            div.append(priorityControl);
        }
    }
    function loadStorageUI(content) {
        if (content === null || content == undefined) {content = $('#as-autoStorage-content');}
        $('.as-storageui').remove();
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item as-storageui"></div>');
        content.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Storable Resource</span>');
        labelDiv.append(resourceLabel);
        let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
        labelDiv.append(priorityLabel);
        let minLabel = $('<span class="has-text-warning" style="width:12rem;">Minimum Storage</h3>');
        labelDiv.append(minLabel);
        let maxLabel = $('<span class="has-text-warning" style="width:12rem;">Maximum Storage</h3>');
        labelDiv.append(maxLabel);

        for (var x in resources) {
            let id = x;
            if (!(resources[x].crateable)) {continue;}
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-storageui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-storageui"></div>');
            }
            content.append(div);

            var label = $(`<span class="has-text-info" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);

            let storePriorityDiv = $('<div style="width:12rem;"></div>');
            div.append(storePriorityDiv);
            let storePrioritySub = function(mult) {
                resources[id].decStorePriority(mult);
                createStorageSettings();
                return resources[id].storePriority;
            }
            let storePriorityAdd = function(mult) {
                resources[id].incStorePriority(mult);
                createStorageSettings();
                return resources[id].storePriority;
            }
            let storePriorityControl = createNumControl(resources[id].storePriority, resources[id].id+'_store_priority',storePrioritySub,storePriorityAdd);
            storePriorityDiv.append(storePriorityControl);

            let storeMinDiv = $('<div style="width:12rem;"></div>');
            div.append(storeMinDiv);
            let storeMinSub = function(mult) {
                resources[id].decStoreMin(mult);
                createStorageSettings();
                return resources[id].storeMin;
            }
            let storeMinAdd = function(mult) {
                resources[id].incStoreMin(mult);
                createStorageSettings();
                return resources[id].storeMin;
            }
            let storeMinControl = createNumControl(resources[id].storeMin, resources[id].id+'_store_min',storeMinSub,storeMinAdd);
            storeMinDiv.append(storeMinControl);

            let storeMaxDiv = $('<div style="width:12rem;"></div>');
            div.append(storeMaxDiv);
            let storeMaxSub = function(mult) {
                resources[id].decStoreMax(mult);
                createStorageSettings();
                return resources[id].storeMax;
            }
            let storeMaxAdd = function(mult) {
                resources[id].incStoreMax(mult);
                createStorageSettings();
                return resources[id].storeMax;
            }
            let storeMaxControl = createNumControl(resources[id].storeMax, resources[id].id+'_store_max',storeMaxSub,storeMaxAdd);
            storeMaxDiv.append(storeMaxControl);
        }
    }
    function loadEjectorUI(content) {
        let labelDiv = $('<div style="display:flex" class="alt market-item"></div>');
        content.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Ejectable Resource</h3>');
        labelDiv.append(resourceLabel);
        let enableLabel = $('<span class="has-text-warning" style="width:12rem;">Enable</h3>');
        labelDiv.append(enableLabel);
        let i = 0;
        for (var x in resources) {
            if (!(resources[x].ejectable)) {continue;}
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item"></div>');
            }
            content.append(div);
            let label = $(`<span class="${resources[x].color}" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);
            let id = x;
            let toggle = createToggleControl(id+'_eject', '', {path:[resources, id, 'eject'],small:true});
            div.append(toggle);
        }
    }
    function createAutoSettingResourcePage(tab) {

        // Auto Craft
        let autoCraftDesc = 'Crafts resources if the required resources are above 90% full. Only works when Manual Crafting is enabled (disabled in No Craft challenge).';
        let [autoCraftTitle, autoCraftContent] = createAutoSettingToggle('autoCraft', 'Auto Craft', autoCraftDesc, true, tab);
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item"></div>');
        autoCraftContent.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Craftable Resource</h3>');
        labelDiv.append(resourceLabel);
        let enableLabel = $('<span class="has-text-warning" style="width:12rem;">Enable</h3>');
        labelDiv.append(enableLabel);
        for (var x in resources) {
            if (!(resources[x] instanceof CraftableResource)) {continue;}
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item"></div>');
            }
            autoCraftContent.append(div);
            let label = $(`<span class="has-text-danger" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);
            let id = x;
            let toggle = createToggleControl(id+'_enabled', '', {path:[resources, id, 'enabled'],small:true});
            div.append(toggle);
        }

        // Auto Market
        let autoMarketDesc = 'Buys/sells resources when they are below/above a certain storage ratio. This also makes sure when buying that the money never goes under the minimum value. Only works when Manual Trading is enabled (disabled in No Trade challenge).';
        let [autoMarketTitle, autoMarketContent] = createAutoSettingToggle('autoMarket', 'Auto Market', autoMarketDesc, true, tab, createMarketSettings, removeMarketSettings);
        let volumeOption = $('<div style="display:flex;"></div>');
        autoMarketContent.append(volumeOption);
        autoMarketContent.append($('<br></br>'));
        volumeOption.append($('<h3 class="has-text-warning" style="width:12rem;">Market Volume:</h3>'));
        let volumeDropdown = $(`<select style="width:12rem;">
                            <option value="1">10x</option>
                            <option value="2">25x</option>
                            <option value="3">100x</option>
                            <option value="4">250x</option>
                            <option value="5">1000x</option>
                            <option value="6">2500x</option>
                            <option value="7">10000x</option>
                            <option value="8">25000x</option>
                            </select>`);
        volumeDropdown[0].value = settings.marketVolume;
        volumeDropdown[0].onchange = function(){
            settings.marketVolume = volumeDropdown[0].value;
            console.log("Changing market volume to ", settings.marketVolume);
            updateSettings();
        };
        volumeOption.append(volumeDropdown);

        let convertFunc = function(val) {
            val = getRealValue(val);
            if (!isNaN(val)) {
                return val;
            }
            return null;
        }
        let minMoneyInput = createInputControl(settings.minimumMoney, 'minimumMoney', 'Minimum Money', {convertFunc:convertFunc});
        autoMarketContent.append(minMoneyInput);

        // Auto Trade
        let autoTradeDesc = 'Allocates trade routes based on the trade priority (as well as Auto Prioritize).';
        let [autoTradeTitle, autoTradeContent] = createAutoSettingToggle('autoTrade', 'Auto Trade', autoTradeDesc, true, tab, createTradeSettings, removeTradeSettings);
        loadTradeUI(autoTradeContent);

        // Auto Storage
        let autoStorageDesc = 'Allocates crates and containers to resources based on priority. Also has a minimum storage setting for steel and other resources that need initial storage.';
        let [autoStorageTitle, autoStorageContent] = createAutoSettingToggle('autoStorage', 'Auto Storage', autoStorageDesc, true, tab, createStorageSettings, removeStorageSettings);
        loadStorageUI(autoStorageContent);

        // Auto Ejector
        let autoEjectorDesc = 'Automatically ejects resources to maximize ejection volume. Full resources will override the enable setting (If a resource is full, it\'ll be seen as enabled). Enabling a resource will eject the resource until the rate is close to 0.';
        let [autoEjectorTitle, autoEjectorContent] = createAutoSettingToggle('autoEjector', 'Auto Ejector', autoEjectorDesc, true, tab, createEjectorSettings, removeEjectorSettings);
        loadEjectorUI(autoEjectorContent);
    }

    function createAutoSettingBuildingPage(tab) {

        // Auto Support
        let autoSupportDesc = 'Powers buildings and allocates support. Power Priority can be changed in the Priority Tab.';
        let [autoSupportTitle, autoSupportContent] = createAutoSettingToggle('autoSupport', 'Auto Support', autoSupportDesc, false, tab);

        // Auto Smelter
        let autoSmelterDesc = "Allocates the smelter building. The priorities determine how much each resource is weighted. Can choose whether to depend on the Auto Priority queue or just the priorities here.";
        let [autoSmelterTitle, autoSmelterContent] = createAutoSettingToggle('autoSmelter', 'Auto Smelter', autoSmelterDesc, true, tab);
        Object.keys(settings.smelterSettings).forEach(function(res) {
            // Ignoring obsolete Interval and pqCheck
            if (res == 'interval' || res == 'pqCheck') {return;}
            let resText = $('<span class="has-text-warning" style="width:12rem;">'+res+' Priority:</span>');
            let resSub = function(mult) {
                settings.smelterSettings[res] -= mult;
                if (settings.smelterSettings[res] < 0) {settings.smelterSettings[res] = 0;}
                return settings.smelterSettings[res];
            }
            let resAdd = function(mult) {
                settings.smelterSettings[res] += mult;
                return settings.smelterSettings[res];
            }
            let resControls = createNumControl(settings.smelterSettings[res], "smelter_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            autoSmelterContent.append(newDiv);
        });

        let smelterPQToolTip = 'Enable to make Auto Smelter depend on the Auto Priority queue.';
        let smelterPQCheck = createCheckBoxControl(settings.smelterSettings.pqCheck, 'smelterPQCheck', "Auto Priority", {path:[settings, 'smelterSettings', 'pqCheck'],toolTip:smelterPQToolTip});
        autoSmelterTitle.append(smelterPQCheck);

        // Auto Factory
        let autoFactoryDesc = "Allocates the factory building. The priorities determine how much each resource is weighted. Can choose whether to depend on the Auto Priority queue or just the priorities here.";
        let [autoFactoryTitle, autoFactoryContent] = createAutoSettingToggle('autoFactory', 'Auto Factory', autoFactoryDesc, true, tab);
        Object.keys(settings.factorySettings).forEach(function(res) {
            // Ignoring obsolete Interval and pqCheck
            if (res == 'interval' || res == 'pqCheck') {return;}
            let resText = $('<span class="has-text-warning" style="width:12rem;">'+res+' Priority:</span>');
            let resSub = function(mult) {
                settings.factorySettings[res] -= mult;
                if (settings.factorySettings[res] < 0) {settings.factorySettings[res] = 0;}
                return settings.factorySettings[res];
            }
            let resAdd = function(mult) {
                settings.factorySettings[res] += mult;
                return settings.factorySettings[res];
            }
            let resControls = createNumControl(settings.factorySettings[res], "factory_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            autoFactoryContent.append(newDiv);
        });

        let factoryPQToolTip = 'Enable to make Auto Factory depend on the Auto Priority queue.';
        let factoryPQCheck = createCheckBoxControl(settings.factorySettings.pqCheck, 'factoryPQCheck', "Auto Priority", {path:[settings, 'factorySettings', 'pqCheck'],toolTip:factoryPQToolTip});
        autoFactoryTitle.append(factoryPQCheck);

        // Auto Mining Droid
        let autoDroidDesc = "Allocates mining droids. The priorities determine how much each resource is weighted. Currently not yet implemented.";
        let [autoDroidTitle, autoDroidContent] = createAutoSettingToggle('autoDroid', 'Auto Mining Droid', autoDroidDesc, true, tab);
        Object.keys(settings.droidSettings).forEach(function(res) {
            // Ignoring pqCheck
            if (res == 'pqCheck') {return;}
            let resText = $('<span class="has-text-warning" style="width:12rem;">'+res+' Priority:</span>');
            let resSub = function(mult) {
                settings.droidSettings[res] -= mult;
                if (settings.droidSettings[res] < 0) {settings.droidSettings[res] = 0;}
                return settings.droidSettings[res];
            }
            let resAdd = function(mult) {
                settings.droidSettings[res] += mult;
                return settings.droidSettings[res];
            }
            let resControls = createNumControl(settings.droidSettings[res], "droid_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            autoDroidContent.append(newDiv);
        });

        let droidPQToolTip = 'Enable to make Auto Droid depend on the Auto Priority queue.';
        let droidPQCheck = createCheckBoxControl(settings.droidSettings.pqCheck, 'droidPQCheck', "Auto Priority", {path:[settings, 'droidSettings', 'pqCheck'],toolTip:droidPQToolTip});
        autoDroidTitle.append(droidPQCheck);

        // Auto Graphene Plant
        let autoGrapheneDesc = "Allocates graphene plants. The priorities determine how much each resource is weighted. Currently not yet implemented.";
        let [autoGrapheneTitle, autoGrapheneContent] = createAutoSettingToggle('autoGraphene', 'Auto Graphene Plants', autoGrapheneDesc, true, tab);
        Object.keys(settings.grapheneSettings).forEach(function(res) {
            // Ignoring and pqCheck
            if (res == 'pqCheck') {return;}
            let resText = $('<span class="has-text-warning" style="width:12rem;">'+res+' Priority:</span>');
            let resSub = function(mult) {
                settings.grapheneSettings[res] -= mult;
                if (settings.grapheneSettings[res] < 0) {settings.grapheneSettings[res] = 0;}
                return settings.grapheneSettings[res];
            }
            let resAdd = function(mult) {
                settings.grapheneSettings[res] += mult;
                return settings.grapheneSettings[res];
            }
            let resControls = createNumControl(settings.grapheneSettings[res], "graphene_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            autoGrapheneContent.append(newDiv);
        });

        let graphenePQToolTip = 'Enable to make Auto Graphene depend on the Auto Priority queue.';
        let graphenePQCheck = createCheckBoxControl(settings.grapheneSettings.pqCheck, 'graphenePQCheck', "Auto Priority", {path:[settings, 'grapheneSettings', 'pqCheck'],toolTip:graphenePQToolTip});
        autoGrapheneTitle.append(graphenePQCheck);
    }

    function createAutoSettingResearchPage(tab) {

        // Research Settings

        let autoResearchDesc = 'Controls which research branches to take. Turning this off will have irregular research purchases.';
        let [autoResearchTitle, autoResearchContent] = createAutoSettingToggle('autoResearch', 'Auto Research', autoResearchDesc, true, tab);
        // Creating Fanaticism/Anthropology choice
        let religionStr1 = 'This setting chooses between Fanaticism and Anthropology. This setting becomes obsolete after getting Transcendence.';
        let religionDetails1 = $(`<div><span>${religionStr1}</span></div>`);
        autoResearchContent.append(religionDetails1);
        let religion1 = createDropDownControl(settings.religion1, 'religion1', 'Religion Tier 1', {fanaticism:'Fanaticism',anthropology:'Anthropology'});
        autoResearchContent.append(religion1);

        // Creating Fanaticism/Anthropology choice
        let religionStr2 = 'This setting chooses between Study and Deify Ancients.';
        let religionDetails2 = $(`<div><span>${religionStr2}</span></div>`);
        autoResearchContent.append(religionDetails2);
        let religion2 = createDropDownControl(settings.religion2, 'religion2', 'Religion Tier 2', {study:'Study Ancients',deify:'Deify Ancients'});
        autoResearchContent.append(religion2);

        // Creating Unification choice
        let unifyStr = 'This setting chooses between Unifying or Reject Unification.';
        let unifyDetails = $(`<div><span>${unifyStr}</span></div>`);
        autoResearchContent.append(unifyDetails);
        let unify = createDropDownControl(settings.unify, 'unify', 'Unification', {unify:'Unify',reject:'Reject'});
        autoResearchContent.append(unify);

    }

    function nameCompare(a, b) {
        return a.name.localeCompare(b.name);
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
            } else if (a == 'Gene' || a == 'Mercenary' || a == 'FortressMercenary' || a == 'Sacrifice') {
                action = miscActions[a];
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
            console.log("Sorting by", sort.value);
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
            if (!settings.showAll && !action.unlocked) {
                div.style.display = 'none';
                continue;
            }
            // Checking if type shown
            if (!settings.showBuilding && action instanceof Building && !(action instanceof ArpaAction)) {
                div.style.display = 'none';
                continue;
            }
            if (!settings.showResearch && action instanceof Research) {
                div.style.display = 'none';
                continue;
            }
            if (!settings.showMisc && (action instanceof MiscAction || action instanceof ArpaAction)) {
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
        let atLeastSub = function(mult) {
            building.decAtLeast(mult);
            return building.atLeast;
        }
        let atLeastAdd = function(mult) {
            building.incAtLeast(mult);
            return building.atLeast;
        }
        let atLeastControls = createNumControl(building.atLeast, building.id+'-min', atLeastSub, atLeastAdd);
        let atLeastDiv = $('<div style="width:10%;" title="'+building.id+' Minimum"></div>');
        atLeastDiv.append(atLeastControls);
        buildingDiv.append(atLeastDiv);

        // Building Limit
        let limSub = function(mult) {
            building.decLimit(mult);
            return building.limit;
        }
        let limAdd = function(mult) {
            building.incLimit(mult);
            return building.limit;
        }
        let limControls = createNumControl(building.limit, building.id+'-max', limSub, limAdd);
        let limDiv = $('<div style="width:10%;" title="'+building.id+' Maximum"></div>');
        limDiv.append(limControls);
        buildingDiv.append(limDiv);

        // Building SoftCap
        let softCapSub = function(mult) {
            building.decSoftCap(mult);
            return building.softCap;
        }
        let softCapAdd = function(mult) {
            building.incSoftCap(mult);
            return building.softCap;
        }
        let softCapControls = createNumControl(building.softCap, building.id+'-softcap', softCapSub, softCapAdd);
        let softCapDiv = $('<div style="width:10%;" title="'+building.id+' Soft Cap"></div>');
        softCapDiv.append(softCapControls);
        buildingDiv.append(softCapDiv);

        // Power Priority
        if (building instanceof PoweredBuilding) {
            let powerSub = function(mult) {
                building.decPowerPriority(mult);
                return building.powerPriority;
            }
            let powerAdd = function(mult) {
                building.incPowerPriority(mult);
                return building.powerPriority;
            }
            let powerControls = createNumControl(building.powerPriority, building.id+'-power-prio', powerSub, powerAdd);
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
        for (x in miscActions) {temp_l.push(miscActions[x]);}
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
            let nameDiv = $(`<span class="${toolTipClass}" style="width:20%;" data-label="Id:${action.id}, Loc:${action.loc[action.loc.length-1]}">${name}</span>`);
            nameDiv[0].classList.add(action.color);
            actionDiv.append(nameDiv);

            // Priority
            let prioSub = function(mult) {
                action.decBasePriority(mult);
                return action.basePriority;
            }
            let prioAdd = function(mult) {
                action.incBasePriority(mult);
                return action.basePriority;
            }
            let settingVal = action.basePriority;
            let prioControls = createNumControl(settingVal,"action_"+name+"_priority",prioSub,prioAdd);
            let prioDiv = $('<div style="width:10%;" title="'+action.id+' Priority"></div>');
            prioDiv.append(prioControls);
            actionDiv.append(prioDiv);

            // Enable Toggle
            let enableDiv = $('<div style="width:10%;" title="'+action.id+' Enabled"></div>');
            actionDiv.append(enableDiv);
            let toggle = createToggleControl(action.id+'_enabled', '', {path:[action, 'enabled'],small:true});
            enableDiv.append(toggle);

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
        let search = $('<input type="text" id="priorityInput" placeholder="Search for actions (ex: \'iron loc:city res:money\')" style="width:20rem;">');
        search.on('input', updatePriorityList);
        let sortLabel = $('<span style="padding-left:20px;padding-right:20px;">Sort:</span>');
        let sort = $('<select style="width:110px;" id="prioritySort"><option value="none">None</option><option value="name">Name</option><option value="priority">Priority</option><option value="powerPriority">Power Priority</option></select>');
        sort.on('change', updatePriorityList);
        topLeft.append(search).append(sortLabel).append(sort);

        let showAll = createCheckBoxControl(settings.showAll, 'showAll', 'Show All', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
        let showBuilding = createCheckBoxControl(settings.showBuilding, 'showBuilding', 'Show Buildings', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
        let showResearch = createCheckBoxControl(settings.showResearch, 'showResearch', 'Show Researches', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
        let showMisc = createCheckBoxControl(settings.showMisc, 'showMisc', 'Show Misc.', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
        bottomLeft.append(showAll).append(showBuilding).append(showResearch).append(showMisc);

        let enableLabel = $('<span style="padding-right:10px;">Enable:</span>');
        let enableAllBtn = $('<a class="button is-dark is-small" id="enable-all-btn"><span>All</span></a>');
        enableAllBtn.on('click', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
            }
            populatePriorityList();
            updatePriorityList();
        });
        let enableVisBtn = $('<a class="button is-dark is-small" id="enable-vis-btn"><span>Visible</span></a>');
        enableVisBtn.on('click', function(e){
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
        disableAllBtn.on('click', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
            }
            populatePriorityList();
            updatePriorityList();
        });
        let disableVisBtn = $('<a class="button is-dark is-small" id="disable-vis-btn"><span>Visible</span></a>');
        disableVisBtn.on('click', function(e){
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
                                    <div style="width:20%;text-align:left;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Action Name. Can be lowercase id if not currently available">Action</span></div>
                                    <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Sets the priority of this action">Priority</span></div>
                                    <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Enables this action for being automatically taken">Enabled</span></div>
                                    <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Will focus on buying this amount of this building before anything else.">Min</span></div>
                                    <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Will stop building this building after reaching this limit">Max</span></div>
                                    <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Will softcap this building after reaching this limit, however will still build if resources full">Soft Cap</span></div>
                                    <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Sets the priority for powering this building">Power</span></div>
                                    </div>`);
        priorityList.append(priorityListLabel);
        settingsTab.append(priorityList);
        populatePriorityList();
        updatePriorityList();
    }
    function createAutoSettingPriorityPage(tab) {

        // Auto Priority
        let autoPriorityDesc = 'Main Priority System. Creates a priority queue for all the buildings/research/misc. The priority queue can also be used to manage allocation for other settings (smelter, trade, etc). This will probably be heavily reworked in the future.';
        let [autoPriorityTitle, autoPriorityContent] = createAutoSettingToggle('autoPriority', 'Auto Priority', autoPriorityDesc, false, tab);

        createPriorityList(tab);

    }

    function createAutoLog() {
        let autolog = $('<div id="autolog" class="msgQueue right resource alt as-autolog"></div>');
        $('#queueColumn').append(autolog);
    }

    function createScriptWatermark() {
        let watermark = $(`<div id="as-watermark" style="text-align:center"><span>Evolve AutoScript by HLXII - Version <a href="${url}">${version}</a></span></div>`);
        $('#resources').append(watermark);
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

    // Forces keyup event for all the multiplier keys
    function disableMult() {
        var evt = new KeyboardEvent('keyup', {'ctrlKey':false, 'shiftKey':false, 'altKey':false});
        document.dispatchEvent (evt);
    }
    // Finds total key multiplier from keyEvent
    function keyMult(e) {
        let mult = 1;
        mult *= (e.ctrlKey) ? 10 : 1;
        mult *= (e.shiftKey) ? 25 : 1;
        mult *= (e.altKey) ? 100 : 1;
        return mult;
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
        return researches[id].researched;
    }
    // Determines if stage is currently in evolution
    function inEvolution() {
        return window.evolve.global.race.species == 'protoplasm';

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
                nav = null;
                return document.querySelector('#mainColumn > .content > .b-tabs > .tab-content > div:nth-child('+nth+')')
            }
        }
        nav = null;
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


