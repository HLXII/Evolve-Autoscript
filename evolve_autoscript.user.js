// ==UserScript==
// @name         Evolve_HLXII
// @namespace    http://tampermonkey.net/
// @version      1.1.13
// @description  try to take over the world!
// @author       Fafnir
// @author       HLXII
// @match        https://pmotschmann.github.io/Evolve/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/pieroxy/lz-string/master/libs/lz-string.min.js
// ==/UserScript==

(function($) {
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
            if (this.mainDiv !== null) {
                return this.mainDiv.children[0].innerText
            } else {
                return this.id;
            }
        }

        get unlocked() {
            return (this.mainDiv !== null && this.mainDiv.style.display != 'none');
        }

        get amount() {
            if (this.cntLabel !== null) {
                let data = this.cntLabel.innerHTML.split(' / ');
                if (data.length == 0) {
                    console.log("Error:", this.id, "Amount");
                    return -1;
                } else {
                    return getRealValue(data[0]);
                }
            } else {
                console.log("Error:", this.id, "Amount");
                return -1;
            }
        }
        get storage() {
            if (this.cntLabel !== null) {
                let data = this.cntLabel.innerHTML.split(' / ');
                if (data.length != 2) {
                    console.log("Error:", this.id, "Storage");
                    return -1;
                } else {
                    return getRealValue(data[1]);
                }
            } else {
                console.log("Error:", this.id, "Amount");
                return -1;
            }
        }
        get ratio() {
            return this.amount / this.storage;
        }
        get rate() {
            if (this.rateLabel !== null) {
                return getRealValue(this.rateLabel.innerText.substr(0, this.rateLabel.innerText.length - 3));
            } else {
                console.log("Error:", this.id, "Rate");
                return -1;
            }
        }
    }

    class TradeableResource extends Resource {
        constructor(id, autoBuy, autoSell, buyRatio, sellRatio, storePriority, storeMin) {
            super(id);
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('autoSell')) {settings.resources[this.id].autoSell = autoSell;}
            if (!settings.resources[this.id].hasOwnProperty('autoBuy')) {settings.resources[this.id].autoBuy = autoBuy;}
            if (!settings.resources[this.id].hasOwnProperty('buyRatio')) {settings.resources[this.id].buyRatio = buyRatio;}
            if (!settings.resources[this.id].hasOwnProperty('sellRatio')) {settings.resources[this.id].sellRatio = sellRatio;}
            if (!settings.resources[this.id].hasOwnProperty('storePriority')) {settings.resources[this.id].storePriority = storePriority;}
            if (!settings.resources[this.id].hasOwnProperty('storeMin')) {settings.resources[this.id].storeMin = storeMin;}
        }

        get autoSell() {return settings.resources[this.id].autoSell};
        set autoSell(autoSell) {settings.resources[this.id].autoSell = autoSell;}
        get autoBuy() {return settings.resources[this.id].autoBuy};
        set autoBuy(autoBuy) {settings.resources[this.id].autoBuy = autoBuy;}
        get buyRatio() {return settings.resources[this.id].buyRatio};
        set buyRatio(buyRatio) {settings.resources[this.id].buyRatio = buyRatio;}
        get sellRatio() {return settings.resources[this.id].sellRatio};
        set sellRatio(sellRatio) {settings.resources[this.id].sellRatio = sellRatio;}
        get storePriority() {return settings.resources[this.id].storePriority};
        set storePriority(storePriority) {settings.resources[this.id].storePriority = storePriority;}
        get storeMin() {return settings.resources[this.id].storeMin;}
        set storeMin(storeMin) {settings.resources[this.id].storeMin = storeMin;}

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
        get crateIncBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 0) {
                return storageDiv[0].children[3]
            } else {
                return null;
            }
        }
        get crateSpan() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 0) {
                return storageDiv[0].children[2]
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
        get containerSpan() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 1) {
                return storageDiv[1].children[2]
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
            if (this.tradeLabel !== null) {
                return parseInt(this.tradeLabel.innerText);
            } else {
                console.log("Error:", this.id, "Trade Num");
                return -1;
            }
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
            if (this.tradeIncSpan !== null) {
                let dataStr = this.tradeIncSpan.attributes['data-label'].value;
                var reg = /Auto-sell\s([\d\.]+)[\w\s]*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[1]);
            } else {
                console.log("Error:", this.id, "Trade Amount");
                return -1;
            }
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

        get crateNum() {
            if (this.crateSpan !== null) {
                return +this.crateSpan.innerText;
            } else {
                return 0;
            }
        }
        get containerNum() {
            if (this.containerSpan !== null) {
                return +this.containerSpan.innerText;
            } else {
                return 0;
            }
        }
        get crateable() {
            return this.crateSpan !== null;
        }
        openStorage() {
            try {
                let storageBtn = $('#con'+this.id)[0];
                storageBtn.click();
            } catch(e) {
                console.log("Error:", this.id, "OpenStorage");
            }
        }

        decStorePriority() {
            if (this.storePriority == 0) {return;}
            this.storePriority -= 1;
            updateSettings();
            console.log("Decrementing Store Priority", this.id, this.storePriority);
        }
        incStorePriority() {
            if (this.storePriority == 99) {return;}
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
            if (this.storeMin == 99) {return;}
            this.storeMin += 1;
            updateSettings();
            console.log("Incrementing Store Minimum", this.id, this.storeMin);
        }

    }
    var resources = [];
    function loadResources() {
        if (!settings.hasOwnProperty('resources')) {settings.resources = {};}
        resources.Money = new Resource("Money");
        resources.Knowledge = new Resource("Knowledge");
        resources.Food = new TradeableResource("Food", false, false, .5, .9, 0, 0);
        resources.Lumber = new TradeableResource("Lumber", false, false, .5, .9, 3, 0);
        resources.Stone = new TradeableResource("Stone", false, false, .5, .9, 3, 0);
        resources.Furs = new TradeableResource("Furs", false, false, .5, .9, 2, 0);
        resources.Copper = new TradeableResource("Copper", false, false, .5, .9, 2, 0);
        resources.Iron = new TradeableResource("Iron", false, false, .5, .9, 2, 0);
        resources.Aluminium = new TradeableResource("Aluminium", false, false, .5, .9, 2, 0);
        resources.Cement = new TradeableResource("Cement", false, false, .5, .9, 2, 0);
        resources.Coal = new TradeableResource("Coal", false, false, .5, .9, 0, 0);
        resources.Oil = new TradeableResource("Oil", false, false, .5, .9, 0, 0);
        resources.Uranium = new TradeableResource("Uranium", false, false, .5, .9, 0, 0);
        resources.Steel = new TradeableResource("Steel", false, false, .5, .9, 3, 10);
        resources.Titanium = new TradeableResource("Titanium", false, false, .5, .9, 3, 10);
        resources.Alloy = new TradeableResource("Alloy", false, false, .5, .9, 3, 10);
        resources.Polymer = new TradeableResource("Polymer", false, false, .5, .9, 3, 10);
        resources.Iridium = new TradeableResource("Iridium", false, false, .5, .9, 3, 10);
        resources.Helium_3 = new TradeableResource("Helium_3", false, false, .5, .9, 0, 0);
        resources.Neutronium = new Resource("Neutronium");
        resources.Elerium = new Resource("Elerium");
        resources.Nano_Tube = new Resource("Nano_Tube");
    }

    class CraftableResource extends Resource {
        constructor(id, enabled, sources) {
            super(id);
            this.sources = sources;
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('enabled')) {settings.resources[this.id].enabled = enabled;}
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
                    return element.res.ratio > 0.9;
                })) {
                    //console.log("Can Craft", this.name);
                    // Determining number of crafts
                    let total_crafts = 100000000000;
                    for (let i = 0;i < this.sources.length;i++) {
                        let res = this.sources[i].res;
                        let cost = this.sources[i].cost * 5;
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

        get rate() {
            //TODO: Somehow figure out how to find the rate (number of craftsmen can be found, but not how much per craftsman)
            return 0.000001;
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
    var craftableResources = {};
    function loadCraftableResources() {
        if (!settings.hasOwnProperty('resources')) {settings.resources = {};}
        craftableResources.Plywood = new CraftableResource("Plywood", false, [{res:resources.Lumber,cost:100}]);
        craftableResources.Brick = new CraftableResource("Brick", false, [{res:resources.Cement,cost:40}]);
        craftableResources.Wrought_Iron = new CraftableResource("Wrought_Iron", false, [{res:resources.Iron,cost:160}]);
        craftableResources.Sheet_Metal = new CraftableResource("Sheet_Metal", false, [{res:resources.Aluminium,cost:120}]);
        craftableResources.Mythril = new CraftableResource("Mythril", false, [{res:resources.Alloy,cost:100}, {res:resources.Iridium,cost:250}]);
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
        constructor(id, tags, priority) {
            this.id = id;
            this.tags = tags;
            if (!settings.actions.hasOwnProperty(this.id)) {settings.actions[this.id] = {};}
            if (!settings.actions[this.id].hasOwnProperty('priority')) {settings.actions[this.id].priority = priority;}
            this.res = {};
        }

        get priority() {return settings.actions[this.id].priority;}
        set priority(priority) {settings.actions[this.id].priority = priority;}

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
            if (this.label !== null) {
                return this.label.innerText;
            } else {
                return this.id;
            }
        }

        decPriority() {
            if (this.priority == -99) {return;}
            this.priority -= 1;
            updateSettings();
            console.log("Decrementing Priority", this.id, this.priority);
        }
        incPriority() {
            if (this.priority == 99) {return;}
            this.priority += 1;
            updateSettings();
            console.log("Incrementing Priority", this.id, this.priority);
        }

        getResDep(resid) {
            try {
                // Loading res
                this.res = {};
                let data = $('#' + this.id + ' > a')[0];
                for (let i = 0;i < data.attributes.length;i++) {
                    let name = data.attributes[i].name;
                    let cost = data.attributes[i].value;
                    if (name.indexOf('data-') >= 0) {
                        this.res[name.substr(5, name.length)] = parseInt(cost);
                    }
                }
                return this.res[resid.toLowerCase()];
            } catch(e) {
                console.log("Error:", this.id, "getResDep");
                return null;
            }
        }

        click() {
            if (this.btn !== null) {
                if (this.btn.className.indexOf('cna') < 0) {
                    this.btn.getElementsByTagName("a")[0].click();
                    return true;
                }
                return false;
            } else {
                return false;
            }
        }
    }

    class Building extends Action {
        constructor(id, tags, enabled, limit, priority) {
            super(id, tags, priority);
            if (!settings.actions[this.id].hasOwnProperty('enabled')) {settings.actions[this.id].enabled = enabled;}
            if (!settings.actions[this.id].hasOwnProperty('limit')) {settings.actions[this.id].limit = limit;}
            if (!settings.actions[this.id].hasOwnProperty('softCap')) {settings.actions[this.id].softCap = -1;}
        }

        get enabled() {return settings.actions[this.id].enabled;}
        set enabled(enabled) {settings.actions[this.id].enabled = enabled;}
        get limit() {return settings.actions[this.id].limit;}
        set limit(limit) {settings.actions[this.id].limit = limit;}
        get softCap() {return settings.actions[this.id].softCap;}
        set softCap(softCap) {settings.actions[this.id].softCap = softCap;}

        get amountLabel() {
            return document.querySelector('#'+this.id+' > a > .count')
        }

        get numTotal() {
            if (this.amountLabel !== null) {
                return +this.amountLabel.innerText
            } else {
                return 0;
            }
        }

        decLimit() {
            if (this.limit == -1) {return;}
            this.limit -= 1;
            updateSettings();
            console.log("Decrementing Limit", this.id, this.limit);
        }
        incLimit() {
            if (this.limit == 99) {return;}
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
            if (this.softCap == 99) {return;}
            this.softCap += 1;
            updateSettings();
            console.log("Incrementing SoftCap", this.id, this.softCap);
        }

    }
    class PoweredBuilding extends Building {
        constructor(id, tags, enabled, limit, priority, powerPriority, consume, produce, unlockResearch) {
            super(id, tags, enabled, limit, priority);
            this.produce = produce;
            this.consume = consume;
            if (!settings.actions[this.id].hasOwnProperty('powerPriority')) {settings.actions[this.id].powerPriority = powerPriority;}
            this.unlockResearch = unlockResearch;
        }

        get powerPriority() {return settings.actions[this.id].powerPriority;}
        set powerPriority(powerPriority) {settings.actions[this.id].powerPriority = powerPriority;}

        get powerUnlocked() {
            try {
                if (this.unlockResearch !== undefined) {
                    return $('#'+this.id).length > 0 && researched(this.unlockResearch);
                }
                return $('#'+this.id).length > 0;
            } catch(e) {
                console.log("Error:", this.id, "powerUnlocked");
                return false;
            }
        }

        get incBtn() {
            return document.querySelector('#'+this.id+' > .on');
        }
        get decBtn() {
            return document.querySelector('#'+this.id+' > .off');
        }

        get numOn() {
            if (this.incBtn !== null) {
                return +this.incBtn.innerText
            } else {
                return 0;
            }
        }
        get numOff() {
            if (this.decBtn !== null) {
                return +this.decBtn.innerText
            } else {
                return 0;
            }
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
    var buildings = {};
    function loadBuildings() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        buildings['city-house']             = new Building(         'city-house',
                                                                    ['city', 'citizen'],
                                                                    false, -1, 1);
        buildings['city-cottage']           = new Building(         'city-cottage',
                                                                    ['city', 'citizen'],
                                                                    false, -1, 0);
        buildings['city-apartment']         = new PoweredBuilding(  'city-apartment',
                                                                    ['city', 'citizen', 'power'],
                                                                    false, -1, 5,
                                                                    9,
                                                                    [{res:'electricity',cost:1}],
                                                                    []);
        buildings['city-lodge']             = new Building(         'city-lodge',
                                                                    ['city', 'citizen'],
                                                                    false, -1, 1);
        buildings['city-smokehouse']        = new Building(         'city-smokehouse',
                                                                    ['city', 'food'],
                                                                    false, -1, 1);
        buildings['city-soul_well']         = new Building(         'city-soul_well',
                                                                    ['city', 'food', 'evil'],
                                                                    false, -1, 1);
        buildings['city-slave_pen']         = new Building(         'city-slave_pen',
                                                                    ['city', 'evil'],
                                                                    false, -1, 1);
        buildings['city-farm']              = new Building(         'city-farm',
                                                                    ['city', 'food'],
                                                                    false, -1, 1);
        buildings['city-mill']              = new PoweredBuilding(  'city-mill',
                                                                    ['city', 'food', 'power'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:resources.Food,cost:0.1}],
                                                                    [{res:'electricity',cost:1}],
                                                                    'tech-windturbine');
        buildings['city-windmill']          = new PoweredBuilding(  'city-windmill',
                                                                    ['city', 'power', 'evil'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [],
                                                                    [{res:'electricity',cost:1}]);
        buildings['city-silo']              = new Building(         'city-silo',
                                                                    ['city', 'food'],
                                                                    false, -1, 0);
        buildings['city-garrison']          = new Building(         'city-garrison',
                                                                    ['city', 'army'],
                                                                    false, -1, 4);
        buildings['city-hospital']          = new Building(         'city-hospital',
                                                                    ['city', 'army'],
                                                                    false, -1, 3);
        buildings['city-boot_camp']         = new Building(         'city-boot_camp',
                                                                    ['city', 'army'],
                                                                    false, -1, 3);
        buildings['city-shed']              = new Building(         'city-shed',
                                                                    ['city', 'storage'],
                                                                    false, -1, 2);
        buildings['city-storage_yard']      = new Building(         'city-storage_yard',
                                                                    ['city', 'storage'],
                                                                    false, -1, 0);
        buildings['city-warehouse']         = new Building(         'city-warehouse',
                                                                    ['city', 'storage'],
                                                                    false, -1, 0);
        buildings['city-bank']              = new Building(         'city-bank',
                                                                    ['city', 'money'],
                                                                    false, -1, 5);
        buildings['city-lumber_yard']       = new Building(         'city-lumber_yard',
                                                                    ['city','lumber'],
                                                                    false, -1, 1);
        buildings['city-sawmill']           = new PoweredBuilding(  'city-sawmill',
                                                                    ['city', 'power', 'lumber'],
                                                                    false, -1, 1,
                                                                    1,
                                                                    [{res:'electricity',cost:1}],
                                                                    [{res:resources.Lumber,cost:0}]); //TODO Create function to find Lumber
        buildings['city-rock_quarry']       = new PoweredBuilding(  'city-rock_quarry',
                                                                    ['city', 'power', 'stone', 'aluminium'],
                                                                    false, -1, 1,
                                                                    1,
                                                                    [{res:'electricity',cost:1}],
                                                                    [{res:resources.Stone,cost:0}], //TODO Create function to find Stone
                                                                    'tech-mine_conveyor');
        buildings['city-cement_plant']      = new PoweredBuilding(  'city-cement_plant',
                                                                    ['city', 'power', 'cement'],
                                                                    false, -1, 5,
                                                                    3,
                                                                    [{res:'electricity',cost:2}],
                                                                    [{res:resources.Cement,cost:0}], //TODO Create function to find Cement
                                                                    'tech-screw_conveyor');
        buildings['city-foundry']           = new Building(         'city-foundry',
                                                                    ['city', 'craftsman'],
                                                                    false, -1, 5);
        buildings['city-factory']           = new PoweredBuilding(  'city-factory',
                                                                    ['city', 'power', 'money', 'alloy', 'polymer', 'nano_tube'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:3}],
                                                                    []);
        buildings['city-smelter']           = new Building(         'city-smelter',
                                                                    ['city', 'iron', 'steel', 'titanium'],
                                                                    false, -1, 1);
        buildings['city-metal_refinery']    = new Building(         'city-metal_refinery',
                                                                    ['city', 'aluminium'],
                                                                    false, -1, 1);
        buildings['city-mine']              = new PoweredBuilding(  'city-mine',
                                                                    ['city', 'power', 'iron', 'copper'],
                                                                    false, -1, 1,
                                                                    2,
                                                                    [{res:'electricity',cost:1}],
                                                                    [],
                                                                    'tech-mine_conveyor');
        buildings['city-coal_mine']         = new PoweredBuilding(  'city-coal_mine',
                                                                    ['city', 'power', 'coal', 'uranium'],
                                                                    false, -1, 1,
                                                                    2,
                                                                    [{res:'electricity',cost:1}],
                                                                    [],
                                                                    'tech-mine_conveyor');
        buildings['city-oil_well']          = new Building(         'city-oil_well',
                                                                    ['city', 'oil'],
                                                                    false, -1, 6);
        buildings['city-oil_depot']         = new Building(         'city-oil_depot',
                                                                    ['city', 'oil'],
                                                                    false, -1, 2);
        buildings['city-trade']             = new Building(         'city-trade',
                                                                    ['city', 'trade'],
                                                                    false, -1, 3);
        buildings['city-wharf']             = new Building(         'city-wharf',
                                                                    ['city', 'storage', 'trade'],
                                                                    false, -1, 1);
        buildings['city-tourist_center']    = new PoweredBuilding(  'city-tourist_center',
                                                                    ['city', 'power', 'money'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:resources.Food,cost:50}],
                                                                    [{res:resources.Money,cost:0}]); //TODO Create function to get money
        buildings['city-amphitheatre']      = new Building(         'city-amphitheatre',
                                                                    ['city', 'morale'],
                                                                    false, -1, 6);
        buildings['city-casino']            = new PoweredBuilding(  'city-casino',
                                                                    ['city', 'power', 'money', 'morale'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:'electricity',cost:5}],
                                                                    [{res:resources.Money,cost:0}]); //TODO Create function to get money
        buildings['city-temple']            = new Building(         'city-temple',
                                                                    ['city', 'trade'],
                                                                    false, -1, 5);
        buildings['city-university']        = new Building(         'city-university',
                                                                    ['city', 'knowledge'],
                                                                    false, -1, 8);
        buildings['city-library']           = new Building(         'city-library',
                                                                    ['city', 'knowledge'],
                                                                    false, -1, 2);
        buildings['city-wardenclyffe']      = new PoweredBuilding(  'city-wardenclyffe',
                                                                    ['city', 'power', 'knowledge', 'morale'],
                                                                    false, -1, 9,
                                                                    9,
                                                                    [{res:'electricity',cost:2}],
                                                                    []);
        buildings['city-biolab']            = new PoweredBuilding(  'city-biolab',
                                                                    ['city', 'power', 'knowledge'],
                                                                    false, -1, 6,
                                                                    9,
                                                                    [{res:'electricity',cost:2}],
                                                                    []);
        buildings['city-coal_power']        = new PoweredBuilding(  'city-coal_power',
                                                                    ['city', 'power', 'coal'],
                                                                    false, -1, 4,
                                                                    9,
                                                                    [{res:resources.Coal,cost:0.35}],
                                                                    [{res:'electricity',cost:5}]);
        buildings['city-oil_power']         = new PoweredBuilding(  'city-oil_power',
                                                                    ['city', 'power', 'oil'],
                                                                    false, -1, 4,
                                                                    9,
                                                                    [{res:resources.Oil,cost:0.65}],
                                                                    [{res:'electricity',cost:6}]);
        buildings['city-fission_power']     = new PoweredBuilding(  'city-fission_power',
                                                                    ['city', 'power', 'uranium'],
                                                                    false, -1, 5,
                                                                    9,
                                                                    [{res:resources.Uranium,cost:0.1}],
                                                                    [{res:'electricity',cost:14}]);     //TODO Update to 18 kW after tech-breeder_reactor
        buildings['city-mass_driver']       = new PoweredBuilding(  'city-mass_driver',
                                                                    ['city', 'power', 'oil', 'helium_3'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:5}],
                                                                    []);
        buildings['space-test_launch']      = new Building(         'space-test_launch',
                                                                    ['space', 'home', 'mission'],
                                                                    false, -1, 10);
        buildings['space-satellite']        = new Building(         'space-satellite',
                                                                    ['space', 'home', 'knowledge'],
                                                                    false, -1, 1);
        buildings['space-gps']              = new Building(         'space-gps',
                                                                    ['space', 'home', 'trade'],
                                                                    false, -1, 0);
        buildings['space-propellant_depot'] = new Building(         'space-propellant_depot',
                                                                    ['space', 'home', 'oil', 'helium_3'],
                                                                    false, -1, 1);
        buildings['space-nav_beacon']       = new PoweredBuilding(  'space-nav_beacon',
                                                                    ['space', 'home', 'power'],
                                                                    false, -1, 2,
                                                                    9,
                                                                    [{res:'electricity',cost:2}],
                                                                    [{res:'moon_support',cost:1}]);
        buildings['space-moon_mission']     = new Building(         'space-moon_mission',
                                                                    ['space', 'moon', 'mission'],
                                                                    false, -1, 10);
        buildings['space-moon_base']        = new PoweredBuilding(  'space-moon_base',
                                                                    ['space', 'moon', 'power', 'oil'],
                                                                    false, -1, 2,
                                                                    9,
                                                                    [{res:'electricity',cost:4},{res:resources.Oil,cost:2}],
                                                                    [{res:'moon_support',cost:2}]);
        buildings['space-iridium_mine']     = new PoweredBuilding(  'space-iridium_mine',
                                                                    ['space', 'moon', 'power', 'iridium'],
                                                                    false, -1, 3,
                                                                    9,
                                                                    [{res:'moon_support',cost:1}],
                                                                    [{res:resources.Iridium,cost:0}]); //TODO create function for iridium
        buildings['space-helium_mine']      = new PoweredBuilding(  'space-helium_mine',
                                                                    ['space', 'moon', 'power', 'helium_3'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'moon_support',cost:1}],
                                                                    [{res:resources.Helium_3,cost:0}]); //TODO create function for helium_3
        buildings['space-observatory']      = new PoweredBuilding(  'space-observatory',
                                                                    ['space', 'moon', 'knowledge', 'power'],
                                                                    false, -1, 2,
                                                                    9,
                                                                    [{res:'moon_support',cost:1}],
                                                                    []);
        buildings['space-red_mission']      = new Building(         'space-red_mission',
                                                                    ['space', 'red', 'mission'],
                                                                    false, -1, 10);
        buildings['space-spaceport']        = new PoweredBuilding(  'space-spaceport',
                                                                    ['space', 'red', 'power', 'helium_3', 'food'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:5},{res:resources.Helium_3,cost:1.25},{res:resources.Food,cost:25}],
                                                                    [{res:'red_support',cost:3}]);
        buildings['space-red_tower']        = new PoweredBuilding(  'space-red_tower',
                                                                    ['space', 'red', 'power'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:2}],
                                                                    [{res:'red_support',cost:1}]);
        buildings['space-living_quarters']  = new PoweredBuilding(  'space-living_quarters',
                                                                    ['space', 'red', 'citizen', 'power'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'red_support',cost:1}],
                                                                    []);
        buildings['space-garage']           = new Building(         'space-garage',
                                                                    ['space', 'red', 'storage'],
                                                                    false, -1, 1);
        buildings['space-red_mine']         = new PoweredBuilding(  'space-red_mine',
                                                                    ['space', 'red', 'power', 'copper', 'titanium'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'red_support',cost:1}],
                                                                    [{res:resources.Copper,cost:0},{res:resources.Titanium,cost:0}]); //TODO Create function to find copper/titanium
        buildings['space-fabrication']      = new PoweredBuilding(  'space-fabrication',
                                                                    ['space', 'red', 'power', 'craftsman'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'red_support',cost:1}],
                                                                    []);
        buildings['space-red_factory']      = new PoweredBuilding(  'space-red_factory',
                                                                    ['space', 'red', 'power', 'money', 'alloy', 'polymer', 'nano_tube'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:3},{res:resources.Helium_3,cost:1}],
                                                                    []);
        buildings['space-biodome']          = new PoweredBuilding(  'space-biodome',
                                                                    ['space', 'red', 'food', 'power'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:'red_support',cost:1}],
                                                                    [{res:resources.Food,cost:0}]); //TODO Create function to find food
        buildings['space-exotic_lab']       = new PoweredBuilding(  'space-exotic_lab',
                                                                    ['space', 'red', 'knowledge', 'power', 'elerium'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:'red_support',cost:1}],
                                                                    []);
        buildings['space-ziggurat']         = new Building(         'space-ziggurat',
                                                                    ['space', 'red'],
                                                                    false, -1, 3);
        buildings['space-space_barracks']   = new Building(         'space-space_barracks',
                                                                    ['space', 'red', 'army'],
                                                                    false, -1, 0);
        buildings['space-hell_mission']     = new Building(         'space-hell_mission',
                                                                    ['space', 'hell', 'mission'],
                                                                    false, -1, 10);
        buildings['space-geothermal']       = new PoweredBuilding(  'space-geothermal',
                                                                    ['space', 'hell', 'power', 'oil'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:resources.Helium_3,cost:0.5}],
                                                                    [{res:'electricity',cost:8}]);
        buildings['space-swarm_plant']      = new Building(         'space-swarm_plant',
                                                                    ['space', 'hell', 'swarm'],
                                                                    false, -1, 0);
        buildings['space-sun_mission']      = new Building(         'space-sun_mission',
                                                                    ['space', 'sun', 'mission'],
                                                                    false, -1, 10);
        buildings['space-swarm_control']    = new PoweredBuilding(  'space-swarm_control',
                                                                    ['space', 'sun', 'power', 'swarm'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [],
                                                                    [{res:'swarm_support',cost:4}]); //TODO This changes to 6 after tech-swarm_control_ai
        buildings['space-swarm_satellite']  = new PoweredBuilding(  'space-swarm_satellite',
                                                                    ['space', 'sun', 'power', 'swarm'],
                                                                    false, -1, 3,
                                                                    9,
                                                                    [{res:'swarm_support',cost:1}],
                                                                    [{res:'electricity',cost:1}]);
        buildings['space-gas_mission']      = new Building(         'space-gas_mission',
                                                                    ['space', 'gas', 'mission'],
                                                                    false, -1, 10);
        buildings['space-gas_mining']       = new PoweredBuilding(  'space-gas_mining',
                                                                    ['space', 'gas', 'power', 'helium_3'],
                                                                    false, -1, 4,
                                                                    9,
                                                                    [{res:'electricity',cost:2}],
                                                                    [{res:resources.Helium_3,cost:0.5}]); //TODO this changes to 0.65 after tech-helium_attractor
        buildings['space-gas_storage']      = new Building(         'space-gas_storage',
                                                                    ['space', 'gas', 'helium_3'],
                                                                    false, -1, 2);
        buildings['space-star_dock']        = new Building(         'space-star_dock',
                                                                    ['space', 'gas'],
                                                                    false, 1, 6);
        buildings['space-gas_moon_mission'] = new Building(         'space-gas_moon_mission',
                                                                    ['space', 'gas_moon', 'mission'],
                                                                    false, -1, 10);
        buildings['space-outpost']          = new PoweredBuilding(  'space-outpost',
                                                                    ['space', 'gas_moon', 'power', 'oil'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:3},{res:resources.Oil,cost:2}],
                                                                    [{res:resources.Neutronium,cost:0.025}]);
        buildings['space-drone']            = new Building(         'space-drone',
                                                                    ['space', 'gas_moon'],
                                                                    false, -1, 0);
        buildings['space-oil_extractor']    = new PoweredBuilding(  'space-oil_extractor',
                                                                    ['space', 'gas_moon', 'power', 'oil'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:'electricity',cost:1}],
                                                                    [{res:resources.Oil,cost:0.4}]); //TODO this changes by oil research
        buildings['space-belt_mission']     = new Building(         'space-belt_mission',
                                                                    ['space', 'belt', 'mission'],
                                                                    false, -1, 10);
        buildings['space-space_station']    = new PoweredBuilding(  'space-space_station',
                                                                    ['space', 'belt', 'power', 'helium_3', 'food'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:3},{res:resources.Helium_3,cost:2.5},{res:resources.Food,cost:20}],
                                                                    [{res:'belt_support',cost:3}]);
        buildings['space-elerium_ship']     = new PoweredBuilding(  'space-elerium_ship',
                                                                    ['space', 'belt', 'power', 'elerium'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'belt_support',cost:2}],
                                                                    [{res:resources.Elerium,cost:0.005}]); //TODO this changes by tech-laser_mining to 0.0075
        buildings['space-iridium_ship']     = new PoweredBuilding(  'space-iridium_ship',
                                                                    ['space', 'belt', 'power', 'iridium'],
                                                                    false, -1, 2,
                                                                    9,
                                                                    [{res:'belt_support',cost:1}],
                                                                    [{res:resources.Iridium,cost:0.055}]); //TODO this changes by tech-laser_mining to 0.08
        buildings['space-iron_ship']        = new PoweredBuilding(  'space-iron_ship',
                                                                    ['space', 'belt', 'power', 'iron', 'swarm'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:'belt_support',cost:1}],
                                                                    [{res:resources.Iron,cost:2}]); //TODO this changes by tech-laser_mining to 3
        buildings['space-dwarf_mission']    = new Building(         'space-dwarf_mission',
                                                                    ['space', 'dwarf', 'mission'],
                                                                    false, -1, 10);
        buildings['space-elerium_contain']  = new PoweredBuilding(  'space-elerium_contain',
                                                                    ['space', 'dwarf', 'power', 'elerium'],
                                                                    false, -1, 1,
                                                                    9,
                                                                    [{res:'electricity',cost:6}],
                                                                    []);
        buildings['space-e_reactor']        = new PoweredBuilding(  'space-e_reactor',
                                                                    ['space', 'dwarf', 'power', 'elerium'],
                                                                    false, -1, 0,
                                                                    9,
                                                                    [{res:resources.Elerium,cost:0.05}], //TODO This might be wierd but I don't know
                                                                    [{res:'electricity',cost:25}]);
        buildings['space-world_collider']   = new Building(         'space-world_collider',
                                                                    ['space', 'dwarf'],
                                                                    false, 1859, 0);
        buildings['space-world_controller'] = new PoweredBuilding(  'space-world_controller',
                                                                    ['space', 'dwarf', 'power', 'knowledge'],
                                                                    false, 1, 0,
                                                                    9,
                                                                    [{res:'electricity',cost:20}],
                                                                    []);
    }

    class Research extends Action {
        constructor(id, tags, priority) {
            super(id, tags, priority);
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
    var researches = [];
    function loadResearches() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        researches['tech-club']                         = new Research(     'tech-club',
                                                                            ['food'],
                                                                            1);
        researches['tech-bone_tools']                   = new Research(     'tech-bone_tools',
                                                                            ['stone'],
                                                                            1);
        researches['tech-sundial']                      = new Research(     'tech-sundial',
                                                                            ['knowledge'],
                                                                            5);
        researches['tech-housing']                      = new Research(     'tech-housing',
                                                                            ['citizen'],
                                                                            5);
        researches['tech-cottage']                      = new Research(     'tech-cottage',
                                                                            ['citizen'],
                                                                            0);
        researches['tech-apartment']                    = new Research(     'tech-apartment',
                                                                            ['citzen', 'power'],
                                                                            5);
        researches['tech-steel_beams']                  = new Research(     'tech-steel_beams',
                                                                            ['citizen'],
                                                                            1);
        researches['tech-mythril_beams']                = new Research(     'tech-mythril_beams',
                                                                            ['citizen'],
                                                                            1);
        researches['tech-neutronium_walls']             = new Research(     'tech-neutronium_walls',
                                                                            ['citizen'],
                                                                            1);
        researches['tech-aphrodisiac']                  = new Research(     'tech-aphrodisiac',
                                                                            ['citizen'],
                                                                            0);
        researches['tech-smokehouse']                   = new Research(     'tech-smokehouse',
                                                                            ['food'],
                                                                            1);
        researches['tech-lodge']                        = new Research(     'tech-lodge',
                                                                            ['citizen'],
                                                                            1);
        researches['tech-soul_well']                    = new Research(     'tech-soul_well',
                                                                            [],
                                                                            1);
        researches['tech-agriculture']                  = new Research(     'tech-agriculture',
                                                                            ['food'],
                                                                            0);
        researches['tech-farm_house']                   = new Research(     'tech-farm_house',
                                                                            ['food', 'citizen'],
                                                                            5);
        researches['tech-irrigation']                   = new Research(     'tech-irrigation',
                                                                            ['food'],
                                                                            1);
        researches['tech-silo']                         = new Research(     'tech-silo',
                                                                            ['food'],
                                                                            0);
        researches['tech-mill']                         = new Research(     'tech-mill',
                                                                            ['food'],
                                                                            1);
        researches['tech-windmill']                     = new Research(     'tech-windmill',
                                                                            ['food'],
                                                                            1);
        researches['tech-windturbine']                  = new Research(     'tech-windturbine',
                                                                            ['food', 'power'],
                                                                            5);
        researches['tech-wind_plant']                   = new Research(     'tech-wind_plant',
                                                                            ['food'],
                                                                            1);
        researches['tech-evil_wind_plant']              = new Research(     'tech-evil_wind_plant',
                                                                            [],
                                                                            0);
        researches['tech-gmfood']                       = new Research(     'tech-gmfood',
                                                                            ['food'],
                                                                            0);
        researches['tech-foundry']                      = new Research(     'tech-foundry',
                                                                            ['craft'],
                                                                            7);
        researches['tech-artisans']                     = new Research(     'tech-artisans',
                                                                            ['craft'],
                                                                            4);
        researches['tech-apprentices']                  = new Research(     'tech-apprentices',
                                                                            ['craft'],
                                                                            4);
        researches['tech-carpentry']                    = new Research(     'tech-carpentry',
                                                                            ['craft'],
                                                                            4);
        researches['tech-demonic_craftsman']            = new Research(     'tech-demonic_craftsman',
                                                                            ['craft'],
                                                                            4);
        researches['tech-master_craftsman']             = new Research(     'tech-master_craftsman',
                                                                            ['craft'],
                                                                            4);
        researches['tech-brickworks']                   = new Research(     'tech-brickworks',
                                                                            ['craft'],
                                                                            4);
        researches['tech-machinery']                    = new Research(     'tech-machinery',
                                                                            ['factory'],
                                                                            4);
        researches['tech-cnc_machine']                  = new Research(     'tech-cnc_machine',
                                                                            ['craft'],
                                                                            4);
        researches['tech-vocational_training']          = new Research(     'tech-vocational_training',
                                                                            ['craft'],
                                                                            4);
        researches['tech-assembly_line']                = new Research(     'tech-assembly_line',
                                                                            ['factory'],
                                                                            4);
        researches['tech-automation']                   = new Research(     'tech-automation',
                                                                            ['factory'],
                                                                            4);
        researches['tech-laser_cutters']                = new Research(     'tech-laser_cutters',
                                                                            ['craft'],
                                                                            3);
        researches['tech-theatre']                      = new Research(     'tech-theatre',
                                                                            ['morale'],
                                                                            7);
        researches['tech-playwright']                   = new Research(     'tech-playwright',
                                                                            ['morale'],
                                                                            6);
        researches['tech-magic']                        = new Research(     'tech-magic',
                                                                            ['morale'],
                                                                            7);
        researches['tech-radio']                        = new Research(     'tech-radio',
                                                                            ['morale'],
                                                                            7);
        researches['tech-tv']                           = new Research(     'tech-tv',
                                                                            ['morale'],
                                                                            7);
        researches['tech-casino']                       = new Research(     'tech-casino',
                                                                            ['casino', 'power'],
                                                                            0);
        researches['tech-dazzle']                       = new Research(     'tech-dazzle',
                                                                            ['casino'],
                                                                            0);
        researches['tech-casino_vault']                 = new Research(     'tech-casino_vault',
                                                                            ['casino'],
                                                                            0);
        researches['tech-mining']                       = new Research(     'tech-mining',
                                                                            ['mine'],
                                                                            7);
        researches['tech-bayer_process']                = new Research(     'tech-bayer_process',
                                                                            ['aluminum'],
                                                                            10);
        researches['tech-smelting']                     = new Research(     'tech-smelting',
                                                                            ['mine'],
                                                                            2);
        researches['tech-steel']                        = new Research(     'tech-steel',
                                                                            ['smelter', 'steel'],
                                                                            8);
        researches['tech-blast_furnace']                = new Research(     'tech-blast_furnace',
                                                                            ['smelter', 'iron'],
                                                                            2);
        researches['tech-bessemer_process']             = new Research(     'tech-bessemer_process',
                                                                            ['smelter', 'steel'],
                                                                            2);
        researches['tech-oxygen_converter']             = new Research(     'tech-oxygen_converter',
                                                                            ['smelter', 'steel'],
                                                                            2);
        researches['tech-electric_arc_furnace']         = new Research(     'tech-electric_arc_furnace',
                                                                            ['copper'],
                                                                            2);
        researches['tech-rotary_kiln']                  = new Research(     'tech-rotary_kiln',
                                                                            ['copper'],
                                                                            2);
        researches['tech-metal_working']                = new Research(     'tech-metal_working',
                                                                            ['copper'],
                                                                            7);
        researches['tech-iron_mining']                  = new Research(     'tech-iron_mining',
                                                                            ['iron'],
                                                                            7);
        researches['tech-coal_mining']                  = new Research(     'tech-coal_mining',
                                                                            ['coal'],
                                                                            7);
        researches['tech-storage']                      = new Research(     'tech-storage',
                                                                            ['storage'],
                                                                            5);
        researches['tech-reinforced_shed']              = new Research(     'tech-reinforced_shed',
                                                                            ['storage'],
                                                                            5);
        researches['tech-barns']                        = new Research(     'tech-barns',
                                                                            ['storage'],
                                                                            5);
        researches['tech-warehouse']                    = new Research(     'tech-warehouse',
                                                                            ['storage'],
                                                                            5);
        researches['tech-cameras']                      = new Research(     'tech-cameras',
                                                                            ['storage'],
                                                                            5);
        researches['tech-pocket_dimensions']            = new Research(     'tech-pocket_dimensions',
                                                                            ['storage'],
                                                                            5);
        researches['tech-containerization']             = new Research(     'tech-containerization',
                                                                            ['storage', 'crate'],
                                                                            5);
        researches['tech-reinforced_crates']            = new Research(     'tech-reinforced_crates',
                                                                            ['storage', 'crate'],
                                                                            5);
        researches['tech-cranes']                       = new Research(     'tech-cranes',
                                                                            ['storage', 'crate'],
                                                                            5);
        researches['tech-titanium_crates']              = new Research(     'tech-titanium_crates',
                                                                            ['storage', 'crate'],
                                                                            5);
        researches['tech-mythril_crates']               = new Research(     'tech-mythril_crates',
                                                                            ['storage', 'crate'],
                                                                            5);
        researches['tech-steel_containers']             = new Research(     'tech-steel_containers',
                                                                            ['storage', 'container'],
                                                                            5);
        researches['tech-gantry_crane']                 = new Research(     'tech-gantry_crane',
                                                                            ['storage', 'container'],
                                                                            5);
        researches['tech-alloy_containers']             = new Research(     'tech-alloy_containers',
                                                                            ['storage', 'container'],
                                                                            5);
        researches['tech-mythril_containers']           = new Research(     'tech-mythril_containers',
                                                                            ['storage', 'container'],
                                                                            5);
        researches['tech-currency']                     = new Research(     'tech-currency',
                                                                            ['money'],
                                                                            10);
        researches['tech-market']                       = new Research(     'tech-market',
                                                                            ['money', 'market'],
                                                                            3);
        researches['tech-tax_rates']                    = new Research(     'tech-tax_rates',
                                                                            ['money', 'tax'],
                                                                            1);
        researches['tech-large_trades']                 = new Research(     'tech-large_trades',
                                                                            ['money', 'market'],
                                                                            0);
        researches['tech-corruption']                   = new Research(     'tech-corruption',
                                                                            ['money', 'tax'],
                                                                            1);
        researches['tech-massive_trades']               = new Research(     'tech-massive_trades',
                                                                            ['money', 'market'],
                                                                            0);
        researches['tech-trade']                        = new Research(     'tech-trade',
                                                                            ['trade'],
                                                                            7);
        researches['tech-diplomacy']                    = new Research(     'tech-diplomacy',
                                                                            ['trade'],
                                                                            3);
        researches['tech-freight']                      = new Research(     'tech-freight',
                                                                            ['trade'],
                                                                            3);
        researches['tech-wharf']                        = new Research(     'tech-wharf',
                                                                            ['trade', 'storage', 'crate', 'container'],
                                                                            1);
        researches['tech-banking']                      = new Research(     'tech-banking',
                                                                            ['money'],
                                                                            1);
        researches['tech-investing']                    = new Research(     'tech-investing',
                                                                            ['money'],
                                                                            5);
        researches['tech-vault']                        = new Research(     'tech-vault',
                                                                            ['money'],
                                                                            2);
        researches['tech-bonds']                        = new Research(     'tech-bonds',
                                                                            ['money'],
                                                                            0);
        researches['tech-steel_vault']                  = new Research(     'tech-steel_vault',
                                                                            ['money'],
                                                                            0);
        researches['tech-eebonds']                      = new Research(     'tech-eebonds',
                                                                            ['money'],
                                                                            0);
        researches['tech-swiss_banking']                = new Research(     'tech-swiss_banking',
                                                                            ['money'],
                                                                            0);
        researches['tech-safety_deposit']               = new Research(     'tech-safety_deposit',
                                                                            ['money'],
                                                                            0);
        researches['tech-stock_market']                 = new Research(     'tech-stock_market',
                                                                            ['money'],
                                                                            0);
        researches['tech-hedge_funds']                  = new Research(     'tech-hedge_funds',
                                                                            ['money'],
                                                                            0);
        researches['tech-four_oh_one']                  = new Research(     'tech-four_oh_one',
                                                                            ['money'],
                                                                            0);
        researches['tech-mythril_vault']                = new Research(     'tech-mythril_vault',
                                                                            ['money'],
                                                                            0);
        researches['tech-neutronium_vault']             = new Research(     'tech-neutronium_vault',
                                                                            ['money'],
                                                                            0);
        researches['tech-home_safe']                    = new Research(     'tech-home_safe',
                                                                            ['money'],
                                                                            0);
        researches['tech-fire_proof_safe']              = new Research(     'tech-fire_proof_safe',
                                                                            ['money'],
                                                                            0);
        researches['tech-monument']                     = new Research(     'tech-monument',
                                                                            ['morale'],
                                                                            0);
        researches['tech-tourism']                      = new Research(     'tech-tourism',
                                                                            ['money'],
                                                                            0);
        researches['tech-science']                      = new Research(     'tech-science',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-library']                      = new Research(     'tech-library',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-thesis']                       = new Research(     'tech-thesis',
                                                                            ['knowledge'],
                                                                            9);
        researches['tech-research_grant']               = new Research(     'tech-research_grant',
                                                                            ['knowledge'],
                                                                            9);
        researches['tech-scientific_journal']           = new Research(     'tech-scientific_journal',
                                                                            ['knowledge'],
                                                                            9);
        researches['tech-adjunct_professor']            = new Research(     'tech-adjunct_professor',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-tesla_coil']                   = new Research(     'tech-tesla_coil',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-internet']                     = new Research(     'tech-internet',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-observatory']                  = new Research(     'tech-observatory',
                                                                            ['knowledge'],
                                                                            8);
        researches['tech-world_collider']               = new Research(     'tech-world_collider',
                                                                            [],
                                                                            5);
        researches['tech-bioscience']                   = new Research(     'tech-bioscience',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-genetics']                     = new Research(     'tech-genetics',
                                                                            ['gene'],
                                                                            0);
        researches['tech-crispr']                       = new Research(     'tech-crispr',
                                                                            ['gene'],
                                                                            0);
        researches['tech-shotgun_sequencing']           = new Research(     'tech-shotgun_sequencing',
                                                                            ['gene'],
                                                                            0);
        researches['tech-de_novo_sequencing']           = new Research(     'tech-de_novo_sequencing',
                                                                            ['gene'],
                                                                            0);
        researches['tech-dna_sequencer']                = new Research(     'tech-dna_sequencer',
                                                                            ['gene'],
                                                                            0);
        researches['tech-mad_science']                  = new Research(     'tech-mad_science',
                                                                            ['knowledge'],
                                                                            10);
        researches['tech-electricity']                  = new Research(     'tech-electricity',
                                                                            ['power'],
                                                                            9);
        researches['tech-industrialization']            = new Research(     'tech-industrialization',
                                                                            [],
                                                                            9);
        researches['tech-electronics']                  = new Research(     'tech-electronics',
                                                                            ['power'],
                                                                            9);
        researches['tech-fission']                      = new Research(     'tech-fission',
                                                                            ['power', 'uranium'],
                                                                            7);
        researches['tech-arpa']                         = new Research(     'tech-arpa',
                                                                            [],
                                                                            5);
        researches['tech-rocketry']                     = new Research(     'tech-rocketry',
                                                                            [],
                                                                            9);
        researches['tech-robotics']                     = new Research(     'tech-robotics',
                                                                            [],
                                                                            9);
        researches['tech-lasers']                       = new Research(     'tech-lasers',
                                                                            [],
                                                                            9);
        researches['tech-artifical_intelligence']       = new Research(     'tech-artifical_intelligence',
                                                                            [],
                                                                            9);
        researches['tech-quantum_computing']            = new Research(     'tech-quantum_computing',
                                                                            [],
                                                                            9);
        researches['tech-thermomechanics']              = new Research(     'tech-thermomechanics',
                                                                            ['factory', 'alloy'],
                                                                            5);
        researches['tech-quantum_manufacturing']        = new Research(     'tech-quantum_manufacturing',
                                                                            ['factory'],
                                                                            5);
        researches['tech-worker_drone']                 = new Research(     'tech-worker_drone',
                                                                            ['neutronium'],
                                                                            10);
        researches['tech-uranium']                      = new Research(     'tech-uranium',
                                                                            ['uranium'],
                                                                            7);
        researches['tech-uranium_storage']              = new Research(     'tech-uranium_storage',
                                                                            ['uranium'],
                                                                            6);
        researches['tech-uranium_ash']                  = new Research(     'tech-uranium_ash',
                                                                            ['uranium'],
                                                                            6);
        researches['tech-breeder_reactor']              = new Research(     'tech-breeder_reactor',
                                                                            ['power'],
                                                                            4);
        researches['tech-mine_conveyor']                = new Research(     'tech-mine_conveyor',
                                                                            ['mine', 'power'],
                                                                            4);
        researches['tech-oil_well']                     = new Research(     'tech-oil_well',
                                                                            ['oil'],
                                                                            5);
        researches['tech-oil_depot']                    = new Research(     'tech-oil_depot',
                                                                            ['oil'],
                                                                            5);
        researches['tech-oil_power']                    = new Research(     'tech-oil_power',
                                                                            ['oil', 'power'],
                                                                            7);
        researches['tech-titanium_drills']              = new Research(     'tech-titanium_drills',
                                                                            ['oil'],
                                                                            5);
        researches['tech-alloy_drills']                 = new Research(     'tech-alloy_drills',
                                                                            ['oil'],
                                                                            4);
        researches['tech-fracking']                     = new Research(     'tech-fracking',
                                                                            ['oil'],
                                                                            4);
        researches['tech-mythril_drills']               = new Research(     'tech-mythril_drills',
                                                                            ['oil'],
                                                                            2);
        researches['tech-mass_driver']                  = new Research(     'tech-mass_driver',
                                                                            ['power'],
                                                                            0);
        researches['tech-polymer']                      = new Research(     'tech-polymer',
                                                                            ['factory', 'polymer'],
                                                                            10);
        researches['tech-fluidized_bed_reactor']        = new Research(     'tech-fluidized_bed_reactor',
                                                                            ['factory', 'polymer'],
                                                                            4);
        researches['tech-nano_tubes']                   = new Research(     'tech-nano_tubes',
                                                                            ['factory', 'nano_tubes'],
                                                                            5);
        researches['tech-stone_axe']                    = new Research(     'tech-stone_axe',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-copper_axes']                  = new Research(     'tech-copper_axes',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-iron_saw']                     = new Research(     'tech-iron_saw',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-steel_saw']                    = new Research(     'tech-steel_saw',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-iron_axes']                    = new Research(     'tech-iron_axes',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-steel_axes']                   = new Research(     'tech-steel_axes',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-titanium_axes']                = new Research(     'tech-titanium_axes',
                                                                            ['lumber'],
                                                                            1);
        researches['tech-copper_sledgehammer']          = new Research(     'tech-copper_sledgehammer',
                                                                            ['stone'],
                                                                            1);
        researches['tech-iron_sledgehammer']            = new Research(     'tech-iron_sledgehammer',
                                                                            ['stone'],
                                                                            1);
        researches['tech-steel_sledgehammer']           = new Research(     'tech-steel_sledgehammer',
                                                                            ['stone'],
                                                                            1);
        researches['tech-titanium_sledgehammer']        = new Research(     'tech-titanium_sledgehammer',
                                                                            ['stone'],
                                                                            1);
        researches['tech-copper_pickaxe']               = new Research(     'tech-copper_pickaxe',
                                                                            ['mine'],
                                                                            2);
        researches['tech-iron_pickaxe']                 = new Research(     'tech-iron_pickaxe',
                                                                            ['mine'],
                                                                            2);
        researches['tech-steel_pickaxe']                = new Research(     'tech-steel_pickaxe',
                                                                            ['mine'],
                                                                            2);
        researches['tech-jackhammer']                   = new Research(     'tech-jackhammer',
                                                                            ['mine'],
                                                                            2);
        researches['tech-jackhammer_mk2']               = new Research(     'tech-jackhammer_mk2',
                                                                            ['mine'],
                                                                            2);
        researches['tech-copper_hoe']                   = new Research(     'tech-copper_hoe',
                                                                            ['food'],
                                                                            2);
        researches['tech-iron_hoe']                     = new Research(     'tech-iron_hoe',
                                                                            ['food'],
                                                                            2);
        researches['tech-steel_hoe']                    = new Research(     'tech-steel_hoe',
                                                                            ['food'],
                                                                            2);
        researches['tech-titanium_hoe']                 = new Research(     'tech-titanium_hoe',
                                                                            ['food'],
                                                                            2);
        researches['tech-slave_pens']                   = new Research(     'tech-slave_pens',
                                                                            ['slave'],
                                                                            5);
        researches['tech-garrison']                     = new Research(     'tech-garrison',
                                                                            ['army'],
                                                                            9);
        researches['tech-mercs']                        = new Research(     'tech-mercs',
                                                                            ['army', 'money'],
                                                                            0);
        researches['tech-signing_bonus']                = new Research(     'tech-signing_bonus',
                                                                            ['army', 'money'],
                                                                            0);
        researches['tech-hospital']                     = new Research(     'tech-hospital',
                                                                            ['army'],
                                                                            9);
        researches['tech-boot_camp']                    = new Research(     'tech-boot_camp',
                                                                            ['army'],
                                                                            7);
        researches['tech-bows']                         = new Research(     'tech-bows',
                                                                            ['army'],
                                                                            2);
        researches['tech-flintlock_rifle']              = new Research(     'tech-flintlock_rifle',
                                                                            ['army'],
                                                                            2);
        researches['tech-machine_gun']                  = new Research(     'tech-machine_gun',
                                                                            ['army'],
                                                                            2);
        researches['tech-bunk_beds']                    = new Research(     'tech-bunk_beds',
                                                                            ['army'],
                                                                            10);
        researches['tech-rail_guns']                    = new Research(     'tech-rail_guns',
                                                                            ['army'],
                                                                            1);
        researches['tech-laser_rifles']                 = new Research(     'tech-laser_rifles',
                                                                            ['army'],
                                                                            1);
        researches['tech-space_marines']                = new Research(     'tech-space_marines',
                                                                            ['army'],
                                                                            0);
        researches['tech-armor']                        = new Research(     'tech-armor',
                                                                            ['army'],
                                                                            2);
        researches['tech-plate_armor']                  = new Research(     'tech-plate_armor',
                                                                            ['army'],
                                                                            2);
        researches['tech-kevlar']                       = new Research(     'tech-kevlar',
                                                                            ['army'],
                                                                            2);
        researches['tech-black_powder']                 = new Research(     'tech-black_powder',
                                                                            [],
                                                                            0);
        researches['tech-dynamite']                     = new Research(     'tech-dynamite',
                                                                            ['mine'],
                                                                            3);
        researches['tech-anfo']                         = new Research(     'tech-anfo',
                                                                            ['mine'],
                                                                            3);
        researches['tech-mad']                          = new Research(     'tech-mad',
                                                                            [],
                                                                            10);
        researches['tech-cement']                       = new Research(     'tech-cement',
                                                                            ['cement'],
                                                                            5);
        researches['tech-rebar']                        = new Research(     'tech-rebar',
                                                                            ['cement'],
                                                                            4);
        researches['tech-steel_rebar']                  = new Research(     'tech-steel_rebar',
                                                                            ['cement'],
                                                                            4);
        researches['tech-portland_cement']              = new Research(     'tech-portland_cement',
                                                                            ['cement'],
                                                                            4);
        researches['tech-screw_conveyor']               = new Research(     'tech-screw_conveyor',
                                                                            ['cement', 'power'],
                                                                            4);
        researches['tech-hunter_process']               = new Research(     'tech-hunter_process',
                                                                            ['smelter', 'titanium'],
                                                                            9);
        researches['tech-kroll_process']                = new Research(     'tech-kroll_process',
                                                                            ['smelter', 'titanium'],
                                                                            3);
        researches['tech-cambridge_process']            = new Research(     'tech-cambridge_process',
                                                                            ['smelter', 'titanium'],
                                                                            9);
        researches['tech-pynn_partical']                = new Research(     'tech-pynn_partical',
                                                                            ['storage'],
                                                                            8);
        researches['tech-matter_compression']           = new Research(     'tech-matter_compression',
                                                                            ['storage', 'container'],
                                                                            7);
        researches['tech-higgs_boson']                  = new Research(     'tech-higgs_boson',
                                                                            ['storage'],
                                                                            7);
        researches['tech-dimensional_compression']      = new Research(     'tech-dimensional_compression',
                                                                            ['storage', 'garage'],
                                                                            5);
        researches['tech-theology']                     = new Research(     'tech-theology',
                                                                            ['religion'],
                                                                            4);
        researches['tech-fanaticism']                   = new Research(     'tech-fanaticism',
                                                                            ['religion'],
                                                                            4);
        researches['tech-ancient_theology']             = new Research(     'tech-ancient_theology',
                                                                            ['religion'],
                                                                            4);
        researches['tech-study']                        = new Research(     'tech-study',
                                                                            ['religion'],
                                                                            4);
        researches['tech-deify']                        = new Research(     'tech-deify',
                                                                            ['religion'],
                                                                            4);
        researches['tech-indoctrination']               = new Research(     'tech-indoctrination',
                                                                            ['religion', 'knowledge'],
                                                                            4);
        researches['tech-missionary']                   = new Research(     'tech-missionary',
                                                                            ['religion', 'trade'],
                                                                            4);
        researches['tech-zealotry']                     = new Research(     'tech-zealotry',
                                                                            ['religion', 'army'],
                                                                            4);
        researches['tech-anthropology']                 = new Research(     'tech-anthropology',
                                                                            ['religion'],
                                                                            4);
        researches['tech-mythology']                    = new Research(     'tech-mythology',
                                                                            ['religion', 'knowledge'],
                                                                            4);
        researches['tech-archaeology']                  = new Research(     'tech-archaeology',
                                                                            ['religion', 'knowledge'],
                                                                            4);
        researches['tech-merchandising']                = new Research(     'tech-merchandising',
                                                                            ['religion', 'money', 'tax'],
                                                                            0);
        researches['tech-astrophysics']                 = new Research(     'tech-astrophysics',
                                                                            ['space'],
                                                                            5);
        researches['tech-rover']                        = new Research(     'tech-rover',
                                                                            ['space'],
                                                                            10);
        researches['tech-probes']                       = new Research(     'tech-probes',
                                                                            ['space'],
                                                                            10);
        researches['tech-starcharts']                   = new Research(     'tech-starcharts',
                                                                            ['space'],
                                                                            5);
        researches['tech-colonization']                 = new Research(     'tech-colonization',
                                                                            ['space'],
                                                                            10);
        researches['tech-red_tower']                    = new Research(     'tech-red_tower',
                                                                            ['space', 'power'],
                                                                            3);
        researches['tech-space_manufacturing']          = new Research(     'tech-space_manufacturing',
                                                                            ['space', 'factory'],
                                                                            3);
        researches['tech-energy_lab']                   = new Research(     'tech-energy_lab',
                                                                            ['space', 'knowledge', 'power'],
                                                                            0);
        researches['tech-dyson_sphere']                 = new Research(     'tech-dyson_sphere',
                                                                            ['space', 'power', 'swarm'],
                                                                            0);
        researches['tech-dyson_swarm']                  = new Research(     'tech-dyson_swarm',
                                                                            ['space', 'power', 'swarm'],
                                                                            0);
        researches['tech-swarm_plant']                  = new Research(     'tech-swarm_plant',
                                                                            ['space', 'power', 'swarm'],
                                                                            0);
        researches['tech-space_sourced']                = new Research(     'tech-space_sourced',
                                                                            ['space', 'swarm', 'iron'],
                                                                            0);
        researches['tech-swarm_plant_ai']               = new Research(     'tech-swarm_plant_ai',
                                                                            ['space', 'power', 'swarm'],
                                                                            0);
        researches['tech-swarm_control_ai']             = new Research(     'tech-swarm_control_ai',
                                                                            ['space', 'swarm', 'power'],
                                                                            0);
        researches['tech-quantum_swarm']                = new Research(     'tech-quantum_swarm',
                                                                            ['space', 'swarm', 'power'],
                                                                            0);
        researches['tech-gps']                          = new Research(     'tech-gps',
                                                                            ['space',' trade'],
                                                                            0);
        researches['tech-nav_beacon']                   = new Research(     'tech-nav_beacon',
                                                                            ['space', 'power'],
                                                                            3);
        researches['tech-atmospheric_mining']           = new Research(     'tech-atmospheric_mining',
                                                                            ['space', 'mine', 'helium_3'],
                                                                            7);
        researches['tech-helium_attractor']             = new Research(     'tech-helium_attractor',
                                                                            ['space', 'helium_3'],
                                                                            7);
        researches['tech-zero_g_mining']                = new Research(     'tech-zero_g_mining',
                                                                            ['space', 'mine'],
                                                                            0);
        researches['tech-elerium_mining']               = new Research(     'tech-elerium_mining',
                                                                            ['space', 'elerium'],
                                                                            10);
        researches['tech-laser_mining']                 = new Research(     'tech-laser_mining',
                                                                            ['space', 'mine'],
                                                                            4);
        researches['tech-elerium_tech']                 = new Research(     'tech-elerium_tech',
                                                                            ['space', 'elerium'],
                                                                            10);
        researches['tech-elerium_reactor']              = new Research(     'tech-elerium_reactor',
                                                                            ['space', 'elerium', 'power'],
                                                                            0);
        researches['tech-neutronium_housing']           = new Research(     'tech-neutronium_housing',
                                                                            ['space', 'citizen'],
                                                                            0);
        researches['tech-unification']                  = new Research(     'tech-unification',
                                                                            ['unification'],
                                                                            10);
        researches['tech-wc_conquest']                  = new Research(     'tech-wc_conquest',
                                                                            ['unification'],
                                                                            10);
        researches['tech-wc_morale']                    = new Research(     'tech-wc_morale',
                                                                            ['unification'],
                                                                            10);
        researches['tech-wc_money']                     = new Research(     'tech-wc_money',
                                                                            ['unification'],
                                                                            10);
        researches['tech-wc_reject']                    = new Research(     'tech-wc_reject',
                                                                            ['unification'],
                                                                            10);
        researches['tech-genesis']                      = new Research(     'tech-genesis',
                                                                            ['space'],
                                                                            10);
        researches['tech-star_dock']                    = new Research(     'tech-star_dock',
                                                                            ['space'],
                                                                            10);
        researches['tech-interstellar']                 = new Research(     'tech-interstellar',
                                                                            ['space'],
                                                                            5);
        researches['tech-genesis_ship']                 = new Research(     'tech-genesis_ship',
                                                                            ['space'],
                                                                            10);
        researches['tech-genetic_decay']                = new Research(     'tech-genetic_decay',
                                                                            ['gene'],
                                                                            10);
    }

    class ArpaAction extends Action {
        constructor(id, tags, priority, res) {
            super(id, tags, priority);
            this.res = res;
        }

        get label() {
            return document.querySelector('#arpa'+this.id+' > .head > .desc');
        }
        get btn() {
            return document.querySelector('#arpa'+this.id+' > div.buy > button.button.x10');
        }
        get rankLabel() {
            return document.querySelector('#arpa'+this.id+' > .head > .rank');
        }

        get enabled() {
            return settings.arpa[this.id];
        }

        get rank() {
            if (this.rankLabel !== null) {
                let rankStr = this.rankLabel.innerText;
                let reg = /Level - ([\d]+)/.exec(rankStr);
                return parseInt(reg[1]);
            } else {
                console.log("Error:", this.id, "Rank");
                return -1;
            }
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid.toLowerCase()] * (1.05 ** this.rank) / 10;
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
    var arpas = {};
    function loadArpas() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        arpas.lhc = new ArpaAction('lhc',
                                   ['arpa'],
                                   5,
                                   {money:2500000,
                                   knowledge:500000,
                                   copper:125000,
                                   cement:250000,
                                   steel:187500,
                                   titanium:50000,
                                   polymer:12000});
        arpas.stock_exchange = new ArpaAction('stock_exchange',
                                              ['arpa'],
                                              5,
                                              {money:3000000,
                                               plywood:25000,
                                               brick:20000,
                                               wrought_Iron:10000});
        arpas.launch_facility = new ArpaAction('launch_facility',
                                        ['arpa'],
                                        10,
                                        {money:2000000,
                                        knowledge:500000,
                                        cement:150000,
                                        oil:20000,
                                        sheet_metal:15000,
                                        alloy:25000});
        arpas.monument = new ArpaAction('monument', ['arpa'], 5);
        if (arpas.monument.label !== null) {
            switch(arpas.monument.label.innerText) {
                case "Obelisk":
                    {
                        arpas.monument.res = {stone:1000000};
                        break;
                    }
                case "Statue":
                    {
                        arpas.monument.res = {aluminium:350000};
                        break;
                    }
                case "Sculpture":
                    {
                        arpas.monument.res = {steel:300000};
                        break;
                    }
                case "Monolith":
                    {
                        arpas.monument.res = {cement:300000};
                        break;
                    }
            }
        }
    }

    class StorageAction extends Action {
        constructor(id, tags, priority, res) {
            super(id, tags, priority);
            this.res = res;
        }

        get countLabel() {
            return document.querySelector('#cnt'+this.name+'s');
        }
        get btn() {
            let div = document.querySelector('.'+this.id);
            if (div === null) {return null;}
            return div.children[0];
        }

        get unlocked() {
            if (this.id == 'crate') {
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
            return this.res[resid.toLowerCase()];
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
        storages.Crate = new StorageAction('crate',
                                           ['storage'], 0,
                                           (resources.Lumber.unlocked) ?
                                           {plywood:100}
                                           :
                                           {stone:2000});
        storages.Container = new StorageAction('container',
                                               ['storage'], 0,
                                               {steel:1250});
    }

    class SupportProducer {
        constructor(name, id, type, produce, consume, unlock_research) {
            this.name = name;
            this.id = id;
            this.type = type;
            this.produce = produce;
            this.consume = consume;
            this.unlock_research = unlock_research;
            this.numLabel = null;
            this.decBtn = null;
            this.incBtn = null;
            try {
                this.numLabel = $('#'+this.id+' > a > .count')[0];
                this.decBtn = $('#'+this.id+' > .off')[0];
                this.incBtn = $('#'+this.id+' > .on')[0];
            } catch(e) {
                //console.log("Error: Could not load support producer", this.name);
            }
        }

        get unlocked() {
            if (this.unlock_research !== undefined) {
                return $('#'+this.id).length > 0 && researched(this.unlock_research);
            }
            return $('#'+this.id).length > 0;
        }

        get numTotal() {
            return parseInt(this.numLabel.innerText);
        }

        get numOn() {
            return parseInt(this.incBtn.innerText);
        }

        get numOff() {
            return parseInt(this.decBtn.innerText);
        }
    }
    var elecProducers = {}
    function loadElecProducers() {
        elecProducers.Coal = new SupportProducer("Coal Powerplant", "city-coal_power", "electricity", 5, [{res:resources.Coal,cost:0.35}]);
        elecProducers.Oil = new SupportProducer("Oil Powerplant", "city-oil_power", "electricity", 6, [{res:resources.Oil,cost:0.65}]);
        elecProducers.Wind = new SupportProducer("Wind Turbine", "city-mill", "electricity", 1, [{res:resources.Food,cost:0.1}], "tech-windturbine");
        elecProducers.Fission = new SupportProducer("Fission Reactor", "city-fission_power", "electricity",
                                                    researched('tech-breeder_reactor') ? 16 : 14,
                                                    [{res:resources.Uranium, cost:0.1}]);
    }

    class SupportConsumer {
        constructor(name, id, type, consume, priority, unlock_research) {
            this.name = name;
            this.id = id;
            this.type = type;
            this.consume = consume;
            this.unlock_research = unlock_research;
            let skey = 'sup-prio' + this.id;
            if(settings.hasOwnProperty(skey)){
                this.priority = settings[skey];
            } else {
                this.priority = priority;
                settings[skey] = priority;
            }
            this.numLabel = null;
            this.decBtn = null;
            this.incBtn = null;
            try {
                this.numLabel = $('#'+this.id+' > a > .count')[0];
                this.decBtn = $('#'+this.id+' > .off')[0];
                this.incBtn = $('#'+this.id+' > .on')[0];
            } catch(e) {
                //console.log("Error: Could not load support consumer", this.name);
            }
        }

        get unlocked() {
            if (this.unlock_research !== undefined) {
                return $('#'+this.id).length > 0 && researched(this.unlock_research);
            }
            return $('#'+this.id).length > 0;
        }

        get numTotal() {
            return parseInt(this.numLabel.innerText);
        }

        get numOn() {
            return parseInt(this.incBtn.innerText);
        }

        get numOff() {
            return parseInt(this.decBtn.innerText);
        }

        lowerPriority() {
            if (this.priority != 0) {
                this.priority -= 1;
                console.log("Lowering", this.name, "Priority", this.priority);
                settings['sup-prio' + this.id] = this.priority;
            }
        }

        higherPriority() {
            if (this.priority != 99) {
                this.priority += 1;
                console.log("Increasing", this.name, "Priority", this.priority);
                settings['sup-prio' + this.id] = this.priority;
            }
        }
    }
    var elecConsumers = {}
    function loadElecConsumers() {
        elecConsumers["Rock Quarry"] = new SupportConsumer("Rock Quarry", "city-rock_quarry", "electricity", 1, 1, "tech-mine_conveyor");
        elecConsumers.Sawmill = new SupportConsumer("Sawmill", "city-sawmill", "electricity", 1, 1);
        elecConsumers.Mine = new SupportConsumer("Mine", "city-mine", "electricity", 1, 2, "tech-mine_conveyor");
        elecConsumers["Coal Mine"] = new SupportConsumer("Coal Mine", "city-coal_mine", "electricity", 1, 2, "tech-mine_conveyor");
        elecConsumers["Cement Plant"] = new SupportConsumer("Cement Plant", "city-cement_plant", "electricity", 2, 3, "tech-screw_conveyor");
        elecConsumers.Apartment = new SupportConsumer("Apartment", "city-apartment", "electricity", 1, 9);
        elecConsumers.Factory = new SupportConsumer("Factory", "city-factory", "electricity", 3, 9);
        elecConsumers.Wardenclyffe = new SupportConsumer("Wardenclyffe", "city-wardenclyffe", "electricity", 2, 9);
        elecConsumers["Bioscience Lab"] = new SupportConsumer("Bioscience Lab", "city-biolab", "electricity", 2, 9);
        elecConsumers["Moon Base"] = new SupportConsumer("Moon Base", "space-moon_base", "electricity", 4, 9);
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

    /***
    *
    * Settings
    *
    ***/

    function loadSettings() {
        // Evolution
        loadEvolution();
        // Farm
        loadFarm();
        // Resources
        loadResources();
        // Storages
        loadStorages();
        // Crafting
        loadCraftableResources();
        // Buildings
        loadBuildings();
        // Support
        loadElecProducers();
        loadElecConsumers();
        // Jobs
        loadJobs();
        loadCraftJobs();
        // Research
        loadResearches();
        // ARPA
        loadArpas();
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
        //console.log("AutoCrafting", craftableResources);
        var x;
        for (x in craftableResources) {
            let craftableResource = craftableResources[x];
            craftableResource.craft();
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
            for (x in craftJobs) {
                let cjob = craftJobs[x];
                if (!cjob.unlocked) {continue;}
                total_priority += cjob.priority;
                totalCraftsman += cjob.employed;
            }
            for (x in craftJobs) {
                let cjob = craftJobs[x];
                if (!cjob.unlocked) {continue;}
                cjob.want = Math.ceil(totalCraftsman * cjob.priority / total_priority)
                cjob.need = cjob.want - cjob.employed;
                if (cjob.need < 0) {
                    for (let j = 0;j < -cjob.need;j++) {
                        cjob.fire();
                    }
                }
            }
            for (x in craftJobs) {
                let cjob = craftJobs[x];
                if (!cjob.unlocked) {continue;}
                if (cjob.need > 0) {
                    for (let j = 0;j < cjob.need;j++) {
                        cjob.hire();
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

    function autoBuild(){
        for (var x in buildings) {
            let building = buildings[x];
            if (!building.unlocked) {
                continue;
            }
            if (building.limit != -1 && building.numTotal >= building.limit) {
                continue;
            }
            let btn = document.getElementById(building.id);
            if (building.enabled && btn.className.indexOf('cna') < 0) {
                btn.getElementsByTagName("a")[0].click();
                if (settings.autoPrint){messageQueue("[AUTO-BUILD] " + btn.getElementsByTagName("a")[0].children[0].innerText, 'dark');}
                return;
            }
        }
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

        console.log("Auto Smelting");
        // Opening modal
        $('#city-smelter > .special').click();
        // Delaying for modal animation
        setTimeout(function() {
            // Finding relevent elements
            let decBtns = $('#specialModal > div:nth-child(2) > .sub');
            let incBtns = $('#specialModal > div:nth-child(2) > .add');
            let labels = $('#specialModal > div:nth-child(2) > span > .current');
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
            let ironBtn = $('#specialModal > div:nth-child(3) > span > button')[0];
            let steelBtn = $('#specialModal > div:nth-child(3) > span > button')[1];
            let ironNum = $('#specialModal > div:nth-child(3) > span')[0].innerText;
            let steelNum = $('#specialModal > div:nth-child(3) > span')[1].innerText;
            ironNum = parseInt(/Iron Smelting: ([\d]+)/.exec(ironNum)[1]);
            steelNum = parseInt(/Steel Smelting: ([\d]+)/.exec(steelNum)[1]);
            let ironVal = $('#specialModal > div:nth-child(3) > span')[0].attributes[0].value;
            let steelVal = $('#specialModal > div:nth-child(3) > span')[1].attributes[0].value;
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

            console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel);
            let pos_coal_rate = resources.Coal.temp_rate - wantedCoal*coalFuel - wantedSteel*steelCoalFuel;
            console.log(pos_coal_rate, resources.Coal, resources.Coal.temp_rate, coalFuel, steelCoalFuel)
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
            console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel);
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
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;

        console.log("Auto Factory");
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
            //console.log("L", luxNum, luxFurCost, luxMoneyProduct, "A", alloyNum, alloyCopperCost, alloyAluminiumCost, "P", polymerNum, polymerOilCost, polymerLumberCost, "N", nanoTubeNum, nanoTubeCoalCost ,nanoTubeNeutroniumCost);
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
            // TODO: Bring priomultipliers into editable settings
            let prioMultipliers = {
                0:.1,
                1:5,
                2:4,
                3:5
            }
            if (limits.Money !== null && limits.Money !== undefined) {luxPriority = limits.Money.priority * prioMultipliers[0]; totalPriority += luxPriority; }
            if (limits.Alloy !== null && limits.Alloy !== undefined) {alloyPriority = limits.Alloy.priority * prioMultipliers[1]; totalPriority += alloyPriority;}
            if (limits.Polymer !== null && limits.Polymer !== undefined) {polymerPriority = limits.Polymer.priority * prioMultipliers[2]; totalPriority += polymerPriority;}
            if (limits.Nano_Tube !== null && limits.Nano_Tube !== undefined) {nanoTubePriority = limits.Nano_Tube.priority * prioMultipliers[3]; totalPriority += nanoTubePriority;}
            //console.log("L", luxPriority, "A", alloyPriority, "P", polymerPriority, "N", nanoTubePriority);
            // Creating allocation list
            let allocation = [];
            for (let i = 0;i < totalFactories;i++) {
                // Attempting to allocate
                // Must be possible (positive temp_rates), as well as lowers ratio error
                let posAllocation = null
                let posAllocationError = 100000000000;
                for (let j = 0;j < decBtns.length;j++) {
                    let tempError = 0;
                    switch(j) {
                        case 0: {
                            // Luxury Goods
                            if (limits.Money !== null && resources.Furs.temp_rate > luxFurCost) {
                                tempError += ((wantedLux+1)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                            }
                            break;
                        }
                        case 1: {
                            // Alloy
                            if (limits.Alloy !== null && resources.Copper.temp_rate > alloyCopperCost && resources.Aluminium.temp_rate > alloyAluminiumCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy+1)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                            }
                            break;
                        }
                        case 2: {
                            // Polymer
                            if (limits.Polymer !== null && resources.Oil.temp_rate > polymerOilCost && resources.Lumber.temp_rate > polymerLumberCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer+1)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                            }
                            break;
                        }
                        case 3: {
                            // Nano Tubes
                            if (limits.Nano_Tube !== null && resources.Coal.temp_rate > nanoTubeCoalCost && resources.Neutronium.temp_rate > nanoTubeNeutroniumCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube+1)/(i+1) - nanoTubePriority/totalPriority)**2
                            }
                            break;
                        }
                        default:
                            break;
                    }
                    // Availible Choice
                    //console.log(j, tempError)
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
            //console.log("L",wantedLux,"A",wantedAlloy,"P",wantedPolymer,"N",wantedNanoTube);
            //console.log(allocation);
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

    function autoSupport(priorityData) {
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

    function _autoSupport(priorityData) {
        // Don't start autoSupport if haven't unlocked power
        if (!researched('tech-electricity')) {return;}
        var x;
        // Getting support categories
        var resourceConsumers;
        var resourceProducers;
        var electricityConsumers;
        var moonConsumers;
        var redConsumers;
        var beltConsumers;

        // Calculating base values of resource production
        // Constant Consumption

        // Percent Gain
    }

    function autoResearch(){
        let items = document.querySelectorAll('#tech .action');
        for(let i = 0; i < items.length; i++){
            if(items[i].className.indexOf("cna") < 0){
                // Checking if fanaticism or anthropology
                if(items[i].id == "tech-fanaticism" && settings.fanORanth == "anthropology") {continue;}
                if(items[i].id == "tech-anthropology" && settings.fanORanth == "fanaticism") {continue;}
                // Checking if study/deify ancients
                if(items[i].id == "tech-study" && settings.studyORdeify == "deify") {continue;}
                if(items[i].id == "tech-deify" && settings.studyORdeify == "study") {continue;}
                // Checking if unification
                if(items[i].id.indexOf("wc") >= 0) {
                    if (settings.uniChoice == 'unify') {
                        if (items[i].id == 'tech-wc_reject') {continue;}
                    } else {
                        if (items[i].id == 'tech-wc_conquest' || items[i].id == 'tech-wc_morale' || items[i].id == 'tech-wc_money') {continue;}
                    }
                }
                items[i].children[0].click();
                if(items[i].id.indexOf("wc") >= 0) {continue;}
                if(settings.autoPrint){messageQueue("[AUTO-RESEARCH] " + items[i].children[0].children[0].innerText,'dark');}
                setTimeout(resetUI, 2000);
                return;
            }
        }
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
            // Don't check resources that aren't unlocked
            if (!resources[x].unlocked) {continue;}
            res.push(resources[x]);
        }
        for (x in craftableResources) {
            // Don't check resources that aren't unlocked
            if (!craftableResources[x].unlocked) {continue;}
            res.push(craftableResources[x]);
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
        resources.Money.temp_rate = resources.Money.rate;
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
                //console.log(actions[j].id, cost);
                if (cost !== null && cost !== NaN && cost > 0) {

                    pq.push(actions[j]);
                    // Setting up completion attribute
                    actions[j].completion[curRes.id.toLowerCase()] = false;
                }
            }
            // Sorting actions by scaled priority
            pq.sort(function(a,b) {
                let aCost = priorityScale(a.getResDep(curRes.id.toLowerCase()), a.priority, a);
                let bCost = priorityScale(b.getResDep(curRes.id.toLowerCase()), b.priority, b);
                return aCost > bCost;
            });

            // Finding completion time and limiting resource
            for (let j = 0;j < pq.length;j++) {
                let action = pq[j];
                // Already completed with current resources
                // Scaling by 1.01 for rounding error
                if (curRes.amount >= action.getResDep(curRes.id) * 1.01) {
                    action.completionTime[curRes.id] = 0;
                } else {
                    let time = 0;
                    if (researched('tech-trade') && res instanceof TradeableResource) {
                        time = (action.getResDep(curRes.id) - curRes.amount) / curRes.temp_rate;
                    } else {
                        time = (action.getResDep(curRes.id) - curRes.amount) / curRes.rate;
                    }

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
                    // Scaling by 1.01 for rounding error
                    if (action.getResDep(curRes.id) * 1.01 <= curAmount) {
                        // Action can be achieved with this resource
                        action.completion[curRes.id.toLowerCase()] = true;
                        // Determining how much of the resource to save for this action
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

        if (settings.autoSmelter && (count % 20 == 0)) {
            autoSmelter(limits);
            return {limits:limits,PQs:PQs}
        }
        if (settings.autoFactory && (count % 23 == 0)) {
            autoFactory(limits);
            return {limits:limits,PQs:PQs}
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
            if (x == "Coal" || x == "Oil") {continue;}
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
        let buyRes = null;
        let focusList = [];
        for (x in limits) {
            // There exists an action that requires this resource
            if (limits[x] === null) {continue;}
            // Excluding craftable resources
            if (!(x in resources)) {continue;}
            // Excluding untradeable resources
            if (x == 'Knowledge') {continue;}
            if (x == 'Nano_Tube') {continue;}
            if (x == 'Elerium') {continue;}  //TODO: Make a tradeable property so I don't have to do this
            // Excluding actions whose resource is already filled
            if (limits[x].completion[x] == true) {continue;}
            if (buyRes === null) {
                buyRes = x;
            } else {
                let curPriority = isFinite(limits[buyRes].completionTime[buyRes]) ? limits[buyRes].completionTime[buyRes] : 10000;
                let nextPriority = isFinite(limits[x].completionTime[x]) ? limits[x].completionTime[x] : 10000;
                curPriority = priorityScale(Math.log(curPriority), limits[buyRes].priority);
                nextPriority = priorityScale(Math.log(nextPriority), limits[x].priority);
                //if (limits[buyRes].priority <= limits[x].priority) {buyRes = x;}
                if (curPriority > nextPriority) {buyRes = x;}
                //if (limits[buyRes].completionTime[buyRes] < limits[x].completionTime[x]) {buyRes = x;}
            }
            focusList.push({action:limits[x], res:x});
            //console.log(x, limits[x].id, limits[x].completionTime, priorityScale(Math.log(limits[x].completionTime[x]), limits[x].priority), limits[x].priority);
        }
        if (focusList.length > 0) {
            focusList.sort(function(a,b) {
                return prioCompare(a.action, b.action);
            });
        }
        // TODO: Move this to front end for users to change
        let prioMultiplier = {
            Money:20,
            Food:0,
            Lumber:0,
            Stone:0,
            Furs:1,
            Copper:1,
            Iron:1,
            Aluminium:1,
            Cement:10,
            Coal:20,
            Oil:20,
            Uranium:30,
            Steel:30,
            Titanium:40,
            Alloy:40,
            Polymer:40,
            Iridium:60,
            Helium_3:40
        };
        console.log("FOC LIST:", focusList);
        let focusSequence = [];
        let curNum = {};
        let curRatio = {};
        let wantedRatio = {};
        let totalPriority = 0;
        if (focusList.length > 0) {
            // Creating sequence of trade route allocations to match priority ratios
            let curError = 0;
            for (let i = 0;i < focusList.length;i++) {totalPriority += prioMultiplier[focusList[i].res] * focusList[i].action.priority;}
            for (let i = 0;i < focusList.length;i++) {
                curNum[focusList[i].res] = 0;
                wantedRatio[focusList[i].res] = prioMultiplier[focusList[i].res] * focusList[i].action.priority / totalPriority;
                console.log(focusList[i].res, focusList[i].action.priority , prioMultiplier[focusList[i].res], wantedRatio[focusList[i].res], totalPriority);
            }
            for (let i = 0;i < totalTradeRoutes;i++) {
                // Calculating error based on next value choice
                let error = -1;
                let choice = -1;
                for (let j = 0;j < focusList.length;j++) {
                    // There is no trade route for money
                    if (focusList[j].res == 'Money') {continue;}
                    let total = i+1;
                    let tempError = 0;
                    // Finding new error based on adding this trade route
                    for (let k = 0;k < focusList.length;k++) {
                        if (j == k) {
                            // Currently attempting to add a trade route to this resource
                            tempError += (((curNum[focusList[k].res]+1) / total) - wantedRatio[focusList[k].res]) ** 2;
                        } else {
                            tempError += ((curNum[focusList[k].res] / total) - wantedRatio[focusList[k].res]) ** 2;
                        }
                    }
                    if (error == -1 || tempError < error) {
                        error = tempError;
                        choice = j;
                    }
                }
                focusSequence[i] = focusList[choice].res;
                curNum[focusList[choice].res] += 1;
            }
            console.log("FOC SEQ:", focusSequence);
        }

        // Allocating trade routes
        let curFocus = 0;
        let curSell = 0;
        if (focusList.length > 0) {
            // Allocating all possible trade routes with given money
            let curFreeTradeRoutes = totalTradeRoutes;
            // Keeping fraction of base money for money
            if (wantedRatio.Money > 0) {resources.Money.temp_rate *= wantedRatio.Money;}
            // Begin allocating algorithm
            while (resources.Money.temp_rate > 0 && curFreeTradeRoutes > 0) {
                // Checking if can buy trade route
                if (resources.Money.temp_rate > resources[focusSequence[curFocus]].tradeBuyCost) {
                    // Can buy trade route
                    //console.log("Buying", focusSequence[curFocus], curFocus);
                    resources[focusSequence[curFocus]].tradeInc();
                    resources.Money.temp_rate -= resources[focusSequence[curFocus]].tradeBuyCost;
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

    function autoArpa(){
        // If haven't unlocked ARPA, don't autoArpa
        if (!researched('tech-arpa')) {return;}
        if(settings.arpa.lhc){
            let btn = document.querySelector("#arpalhc > div.buy > button.button.x1");
            if(btn != null && !wouldBreakMoneyFloor(26500)){
                btn.click();
            }
        }
        if(settings.arpa.stock_exchange){
            let btn = document.querySelector("#arpastock_exchange > div.buy > button.button.x1");
            if(btn != null && ! wouldBreakMoneyFloor(30000)){
                btn.click();
            }
        }
        if(settings.arpa.monument){
            let btn = document.querySelector("#arpamonument > div.buy > button.button.x1");
            if(btn != null){
                btn.click();
            }
        }
        if(settings.arpa.launch_facility){
            let btn = document.querySelector("#arpalaunch_facility > div.buy > button.button.x1");
            if(btn != null && ! wouldBreakMoneyFloor(20000)){
                btn.click();
            }
        }
    }

    let count = 1;
    function fastAutomate() {
        console.clear();
        console.log(count);
        updateUI();
        loadSettings();
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
            if(settings.autoBuild && !settings.autoPrioritize){
                autoBuild();
            }
            if(settings.autoSupport) {
                autoSupport(priorityData);
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
            if(settings.autoResearch && !settings.autoPrioritize){
                autoResearch();
            }
            if(settings.autoMarket){
                autoMarket();
            }
            if(settings.autoARPA && !settings.autoPrioritize){
                autoArpa();
            }
            if (settings.autoStorage) {
                autoStorage();
            }
        }
        count += 1;
    }
    setInterval(fastAutomate, 1000);

    function midAutomate() {
        if (!inEvolution()) {
            if (settings.autoStorage) {
                autoStorage();
            }
        }
    }
    setInterval(midAutomate, 100000);

    //Temporary
    let stardockBtn = $('#space-star_dock > .special');
    function temp() {
        stardockBtn.click();
        setTimeout(function() {
            let seederBtn = $('#spcdock-seeder > .button')[0];
            let probeBtn = $('#spcdock-probes > .button')[0];
            seederBtn.click();
            probeBtn.click();
            setTimeout(function() {
                let exitBtn = $('.modal > .modal-close').click();
            }, 1000);

        }, 1000);
    }
    //setInterval(temp, 4000);
    function temp2() {
        if (resources.Knowledge.amount > 200000) {
            $('#arpaSequence > span > button')[1].click();
        }
        //resetUI();
    }
    //setInterval(temp2, 20000);

    // Refreshing page every 150s to update data-values in elements
    setInterval(function() {
        location.reload();
    }, 150 * 1000)

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
        // If not currently in the evolution stage (thus civilization stage
        if(!inEvolution()) {
            // These toggles only appear after the evolution stage is over
            // Creating Buildings Tab
            if ($('.ea-buildings-tab').length == 0) {
                createBuildingsTab();
            }
            // Create Research Tab
            if ($('.ea-research-tab').length == 0) {
                createResearchTab();
            }
            // Crafting requires foundries
            if ($('#autoStorage').length == 0 && researched('tech-containerization')) {
                createSettingToggle('autoStorage', 'Automatically assigns crates and containers to resources', createStorageSettings, removeStorageSettings);
            } else if (settings.autoStorage && $('.ea-storage-settings').length == 0 && researched('tech-containerization')) {
                createStorageSettings();
            }
            if ($('#autoCraft').length == 0 && researched('tech-foundry')) {
                createSettingToggle('autoCraft', 'Automatically crafts craftable resources when resource ratio is above 0.9', createCraftSettings, removeCraftSettings);
            } else if (settings.autoCraft && $('.ea-craft-settings').length == 0 && researched('tech-foundry')) {
                createCraftSettings();
            }
            if ($('#autoBuild').length == 0) {
                createSettingToggle('autoBuild', 'Automatically builds buildings when available. Can disable specific buildings with unique toggles', createBuildingSettings, removeBuildingSettings);
            } else if (settings.autoBuild && $('.ea-building-settings').length == 0) {
                createBuildingSettings();
            }
            if ($('#autoSmelter').length == 0 && researched('tech-smelting')) {
                createSettingToggle('autoSmelter', 'Automatically allocates resources in the smelter. See Buildings tab for more settings', createSmelterSettings, removeSmelterSettings);
            } else if (settings.autoSmelter && $('.ea-smelter-settings').length == 0 && researched('tech-smelting')) {
                createSmelterSettings();
            }
            if ($('#autoFactory').length == 0 && researched('tech-industrialization')) {
                createSettingToggle('autoFactory', 'Automatically allocates resources in the factory. See Buildings tab for more settings', createFactorySettings, removeFactorySettings);
            } else if (settings.autoFactory && $('.ea-factory-settings').length == 0 && researched('tech-industrialization')) {
                createFactorySettings();
            }
            // Support requires electricity
            if ($('#autoSupport').length == 0 && researched("tech-electricity")) {
                createSettingToggle('autoSupport', 'Automatically powers buildings and supports space buildings. See the Support Tab for more settings', createSupportSettings, removeSupportSettings);
            } else if (settings.autoSupport && $('.ea-support-settings').length == 0 && researched("tech-electricity")) {
                createSupportSettings();
            }
            if ($('#autoEmploy').length == 0) {
                createSettingToggle('autoEmploy', 'Autoemploys workers. See Civics page for job priorities', createEmploySettings, removeEmploySettings);
            } else if(settings.autoEmploy && ($('.ea-employ-settings').length == 0 || $('.ea-employ-craft-settings').length == 0)) {
                createEmploySettings();
            }
            // Tax requires tax rates researched
            if ($('#autoTax').length == 0 && researched('tech-tax_rates')) {
                createSettingToggle('autoTax', 'Automatically changes tax rate to match desired morale level', createTaxSettings, removeTaxSettings);
            }
            // Battles require garrisions
            if ($('#autoBattle').length == 0 && researched('tech-garrison') && !(researched('tech-wc_conquest')||researched('tech-wc_morale')||researched('tech-wc_money')||researched('tech-wc_reject'))) {
                createSettingToggle('autoBattle', 'Automatically battles when all soldiers are ready. Changes the campaign type to match army rating');
            }
            if ($('#autoResearch').length == 0) {
                createSettingToggle('autoResearch', 'Automatically researches. See Research > Auto Settings tab for more settings');
            }
            // Markets require market researched
            if ($('#autoMarket').length == 0 && researched('tech-market')) {
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
            if ($('#autoARPA').length == 0 && researched('tech-arpa')){
                createSettingToggle('autoARPA', 'Automatically funds A.R.P.A. research projects. See the A.R.P.A. tab for more settings', createArpaToggles, removeArpaToggles);
            }else if(settings.autoArpa && $('.ea-arpa-toggle').length == 0) {
                createArpaToggles();
            }
            if ($('#autoPrioritize').length == 0) {
                createSettingToggle('autoPrioritize', 'Complex priority system to control purchasing buildings and research');
            }
        }else{
            // Currently in the evolution stage, reset civilization settings
            if ($('#autoEvolution').length == 0) {
                createSettingToggle("autoEvolution", "Automatically plays the evolution stage", createEvolutionSettings, removeEvolutionSettings);
            } else if (settings.autoEvolution && $('.ea-evolution-settings').length == 0) {
                createEvolutionSettings();
            }
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
        removeBuildingSettings();
        removeSmelterSettings();
        removeFactorySettings();
        removeSupportSettings();
        removeMarketSettings();
        removeEmploySettings();
        removeTaxSettings();
        removeArpaToggles();
        $('.ea-buildings-tab').remove();
        $('.ea-research-tab').remove();
        $('.ea-autolog').remove();
        $('#reload').remove();
        $('#autoPrint').remove();
        $('#autoFarm').remove();
        $('#autoEvolution').remove();
        $('#autoStorage').remove();
        $('#autoCraft').remove();
        $('#autoBuild').remove();
        $('#autoSmelter').remove();
        $('#autoFactory').remove();
        $('#autoSupport').remove();
        $('#autoPrioritize').remove();
        $('#autoEmploy').remove();
        $('#autoTax').remove();
        $('#autoBattle').remove();
        $('#autoResearch').remove();
        $('#autoMarket').remove();
        $('#ea-settings').remove();
        $('#autoARPA').remove();
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
        let prioritySub = $('<span role="button" aria-label="Decrease '+resources[id].name+' Priority" class="sub ea-storage-settings">«</span>');
        prioritySub.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resources[id].decStorePriority();
            priorityLabel[0].removeChild(priorityLabel[0].firstChild);
            priorityLabel[0].appendChild(document.createTextNode(resources[id].storePriority));
        });
        let priorityAdd = $('<span role="button" aria-label="Increase '+resources[id].name+' Priority" class="add ea-storage-settings">»</span>');
        priorityAdd.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resources[id].incStorePriority();
            priorityLabel[0].removeChild(priorityLabel[0].firstChild);
            priorityLabel[0].appendChild(document.createTextNode(resources[id].storePriority));
        });
        let priorityLabel = $('<span class="count current" style="width:2rem;">'+resources[id].storePriority+'</span>');
        let priorityControls = $('<div class="trade controls ea-storage-settings" style="min-width:0;">').append(prioritySub).append(priorityLabel).append(priorityAdd).append('</div>');
        resourceSpan.append(priorityControls)

        let minSub = $('<span role="button" aria-label="Decrease '+resources[id].name+' Minimum" class="sub ea-storage-settings">«</span>');
        minSub.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resources[id].decStoreMin();
            minLabel[0].removeChild(minLabel[0].firstChild);
            minLabel[0].appendChild(document.createTextNode(resources[id].storeMin));
        });
        let minAdd = $('<span role="button" aria-label="Increase '+resources[id].name+' Minimum" class="add ea-storage-settings">»</span>');
        minAdd.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resources[id].incStoreMin();
            minLabel[0].removeChild(minLabel[0].firstChild);
            minLabel[0].appendChild(document.createTextNode(resources[id].storeMin));
        });
        let minLabel = $('<span class="count current" style="width:2rem;">'+resources[id].storeMin+'</span>');
        let minControls = $('<div class="controls trade ea-storage-settings" style="min-width:0;">').append(minSub).append(minLabel).append(minAdd).append('</div>');
        resourceSpan.append(minControls)
    }
    function createStorageSettings() {
        removeStorageSettings();
        // Creating labels
        let labelSpan = $('#createHead');
        let prioLabel = $('<div class="ea-storage-settings" style="display:inline-flex;margin-left:2.8rem"><span class="has-text-warning">Priority</span></div>');
        let minLabel = $('<div class="ea-storage-settings" style="display:inline-flex;margin-left:3.8rem"><span class="has-text-warning">Min</span></div>');
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
            craftableResources[resource.id].enabled = state;
        });
    }
    function createCraftSettings(){
        removeCraftSettings();
        var x;
        for (x in craftableResources) {
            createCraftToggle(craftableResources[x]);
        }
    }
    function removeCraftSettings(){
        $('.ea-craft-settings').remove();
    }

    function createBuildingsTab() {
        let buildingsTabLabel = $('<li class="ea-buildings-tab"><a><span>Buildings</span></a></li>');
        let buildingsTab = $('<div id="buildingsTab" class="tab-item ea-buildings-tab" style="display:none"><h2 class="is-sr-only">Buildings Settings</h2></div>');
        // Creating click functions for other tabs
        for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
            let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
            let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
            tabLabel.on('mouseup',function(e) {
                if (e.which != 1) {return;}
                if (buildingsTabLabel.hasClass("is-active")) {
                    buildingsTabLabel.removeClass("is-active");
                    tabItem.style.display = '';
                }
                buildingsTab[0].style.display = 'none';
                if (!tabLabel.hasClass("is-active")) {tabLabel.addClass("is-active");}
            });
        }
        // Inserting Buildings tab after Space tab
        let navTab = $('#mainColumn > .content > .b-tabs > .tabs > ul')[0];
        let conTab = $('#mainColumn > .content > .b-tabs > .tab-content')[0];
        navTab.insertBefore(buildingsTabLabel[0], navTab.children[3]);
        conTab.insertBefore(buildingsTab[0], conTab.children[3]);
        // Creating click function for Buildings tab
        buildingsTabLabel.on('mouseup',function(e) {
            if (e.which != 1) {return;}
            // For every other tab
            for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
                let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
                let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
                // Ignore Building tab
                if (tabLabel[0].class !== undefined) {
                    continue;
                }
                tabLabel.removeClass("is-active");
                tabItem.style.display = 'none';
            }
            buildingsTabLabel.addClass("is-active");
            buildingsTab[0].style.display = '';
        });

        // Creating Smelter Settings
        let smelterLabel = $('<div><h3 class="name has-text-warning" title="Set the smelter settings">Smelter:</h3></div></br>');
        buildingsTab.append(smelterLabel);

        // Creating Factory Settings
        let factoryLabel = $('<div><h3 class="name has-text-warning" title="Set the factory settings">Factory:</h3></div></br>');
        buildingsTab.append(factoryLabel);

        // Creating Building Settings
        let buildingLabel = $('<div><h3 class="name has-text-warning" title="Set the building settings">Buildings:</h3></div></br>');
        buildingsTab.append(buildingLabel);
        let buildSettingsDiv = $('<div id="buildSettingsDiv" style="overflow:auto"></div>');
        let buildSettingsLeft = $('<div id="buildSettingsLeft" style="float:left"></div>');
        let buildSettingsRight = $('<div id="buildSettingsRight" style="float:right"></div>');

        let topLeft = $('<div id="buildSettingsTopLeft"></div>');
        let bottomLeft = $('<div id="buildSettingsBottomLeft"></div>');
        let topRight = $('<div id="buildSettingsTopRight" style="float:right"></div>');
        let bottomRight = $('<div id="buildSettingsBottomRight"></div>');

        let search = $('<input type="text" id="buildingInput" placeholder="Search for buildings (ex: \'iron tag:city res:money\')" style="width:400px;">');
        search.on('input', populateBuildingList);
        let sortLabel = $('<span style="padding-left:20px;padding-right:20px;">Sort:</span>');
        let sort = $('<select style="width:110px;" id="buildingSort"><option value="none">None</option><option value="name">Name</option><option value="priority">Priority</option><option value="power_priority">Power Priority</option></select>');
        sort.on('change', populateBuildingList);
        topLeft.append(search).append(sortLabel).append(sort);

        let showToggle = $('<label tabindex="0" class="switch" id="show_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>Show All</span></label>');
        showToggle.on('change', populateBuildingList);
        showToggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
        });
        bottomLeft.append(showToggle);

        let enableLabel = $('<span style="padding-right:10px;">Enable:</span>');
        let enableAllBtn = $('<a class="button is-dark is-small" id="enable-all-btn"><span>All</span></a>');
        enableAllBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            for (var x in buildings) {
                buildings[x].enabled = true;
            }
            populateBuildingList();
            createBuildingSettings();
        });
        let enableVisBtn = $('<a class="button is-dark is-small" id="enable-vis-btn"><span>Visible</span></a>');
        enableVisBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            for (let i = 0;i < shownBuildings.length;i++) {
                buildings[shownBuildings[i].id].enabled = true;
            }
            populateBuildingList();
            createBuildingSettings();
        });
        topRight.append(enableLabel).append(enableAllBtn).append(enableVisBtn);

        let disableLabel = $('<span style="padding-right:10px;">Disable:</span>');
        let disableAllBtn = $('<a class="button is-dark is-small" id="disable-all-btn"><span>All</span></a>');
        disableAllBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            for (var x in buildings) {
                buildings[x].enabled = false;
            }
            populateBuildingList();
            createBuildingSettings();
        });
        let disableVisBtn = $('<a class="button is-dark is-small" id="disable-vis-btn"><span>Visible</span></a>');
        disableVisBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            for (let i = 0;i < shownBuildings.length;i++) {
                buildings[shownBuildings[i].id].enabled = false;
            }
            populateBuildingList();
            createBuildingSettings();
        });
        bottomRight.append(disableLabel).append(disableAllBtn).append(disableVisBtn);

        buildSettingsLeft.append(topLeft).append(bottomLeft);
        buildSettingsRight.append(topRight).append(bottomRight);
        buildSettingsDiv.append(buildSettingsLeft).append(buildSettingsRight);
        buildingsTab.append(buildSettingsDiv);

        let buildingList = $('<div id="buildingList"></div>');
        let buildingListLabel = $(`<div style="display:flex;">
                                    <span class="name has-text-warning" style="width:20%;" title="Building Name. Can be lowercase id if not currently available">Building</span>
                                    <span class="name has-text-warning" style="width:20%;text-align:center;" title="Will stop building this building after reaching this limit">Limit</span>
                                    <span class="name has-text-warning" style="width:20%;text-align:center;" title="Will softcap this building after reaching this limit, however will still build if resources full">Soft Cap</span>
                                    <span class="name has-text-warning" style="width:10%;" title="Enables this building for being automatically built">Enabled</span>
                                    <span class="name has-text-warning" style="width:20%;text-align:center;" title="Sets the priority of this building to be built">Priority</span>
                                    <span class="name has-text-warning" style="width:20%;text-align:center;" title="Sets the priority for powering this building">Power Priority</span>
                                    </div>`);
        buildingList.append(buildingListLabel);
        buildingsTab.append(buildingList);
        populateBuildingList();
    }
    function nameCompare(a, b) {
        return b.id.split('-')[1] < a.id.split('-')[1];
    }
    function priorityCompare(a, b) {
        return b.priority - a.priority;
    }
    function powerCompare(a, b) {
        return b.priority - a.priority;
    }
    let shownBuildings = [];
    function populateBuildingList() {
        let search = $('#buildingInput')[0];
        let sort = $('#buildingSort')[0];
        let showToggle = $('#show_toggle')[0];
        let buildingList = $('#buildingList')[0];
        while(buildingList.childNodes.length != 1) {
            buildingList.removeChild(buildingList.lastChild);
        }
        //console.log("Populating Building List");
        let terms = search.value.split(' ');
        let names = [];
        let tags = [];
        let res = [];
        for (let i = 0;i < terms.length;i++) {
            let tagCheck = /tag:(.+)/.exec(terms[i]);
            let resCheck = /res:(.+)/.exec(terms[i]);
            //console.log(terms[i], tagCheck, resCheck);
            if (tagCheck !== null) {
                tags.push(tagCheck[1]);
            } else if (resCheck !== null) {
                res.push(resCheck[1]);
            } else {
                names.push(terms[i]);
            }
        }
        //console.log(names, tags, res);
        shownBuildings = [];
        for (var x in buildings) {
            let building = buildings[x];


            // Checking if available
            if (showToggle.children[0].value == 'false' && !building.unlocked) {
                continue;
            }

            // Searching for if any names appear in building name
            if (names.length != 0) {
                let pass = false;
                for (let i = 0;i < names.length;i++) {
                    var name;
                    if (building.name !== null) {
                        name = building.name;
                    } else {
                        name = building.id.split('-')[1];
                    }
                    if (name.toLowerCase().indexOf(names[i]) >= 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    continue;
                }
            }
            // Searching for if any tags appear in building name
            if (tags.length != 0) {
                let pass = false;
                for (let i = 0;i < tags.length;i++) {
                    if (building.tags.includes(tags[i])) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    continue;
                }
            }

            // Searching for if any resources appear in building requirements
            if (res.length != 0 && building.res !== null) {
                let pass = false;
                for (let i = 0;i < res.length;i++) {
                    if (building.getResDep(res[i]) !== null && building.getResDep(res[i]) > 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    continue;
                }
            }

            shownBuildings.push(building);
        }
        //console.log(shownBuildings);

        // Sorting if necessary
        if (sort.value == 'name') {
            shownBuildings.sort(nameCompare);
        } else if (sort.value == 'priority') {
            shownBuildings.sort(priorityCompare);
        } else if (sort.value == 'power_priority') {
            shownBuildings.sort(powerCompare);
        }

        // Drawing buildings into list
        for (let i = 0;i < shownBuildings.length;i++) {
            let building = shownBuildings[i];
            var buildingDiv;
            if (i % 2) {
                buildingDiv = $('<div style="display:flex" class="market-item"></div>');
            } else {
                buildingDiv = $('<div style="display:flex" class="resource alt market-item"></div>');
            }
            buildingList.appendChild(buildingDiv[0]);

            // Name Label
            if (building.name === null) {
                name = building.id.split('-')[1];
            } else {
                name = building.name;
            }
            buildingDiv.append($('<span style="width:20%;">'+name+'</span>'));

            // Building Limit
            let limSub = $('<span role="button" aria-label="Decrease Build Limit" class="sub ea-buildings-tab">«</span>');
            limSub.on('mouseup', function(e) {
                buildings[building.id].decLimit();
                let count = $('#'+building.id+'-limit')[0];
                count.removeChild(count.firstChild);
                count.appendChild(document.createTextNode(buildings[building.id].limit));
            });
            let limAdd = $('<span role="button" aria-label="Increase Build Limit" class="add ea-buildings-tab">»</span>');
            limAdd.on('mouseup', function(e) {
                buildings[building.id].incLimit();
                let count = $('#'+building.id+'-limit')[0];
                count.removeChild(count.firstChild);
                count.appendChild(document.createTextNode(buildings[building.id].limit));
            });
            let limLabel = $('<span class="count current" id="'+building.id+'-limit" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:2rem;">'+buildings[building.id].limit+'</span>');
            let limControls = $('<div class="controls trade ea-buildings-tab" style="width:20%;text-align:center;margin-left:0">').append(limSub).append(limLabel).append(limAdd).append('</div>');
            buildingDiv.append(limControls);

            // Building SoftCap
            let softCapSub = $('<span role="button" aria-label="Decrease SoftCap Limit" class="sub ea-buildings-tab">«</span>');
            softCapSub.on('mouseup', function(e) {
                buildings[building.id].decSoftCap();
                let count = $('#'+building.id+'-softcap')[0];
                count.removeChild(count.firstChild);
                count.appendChild(document.createTextNode(buildings[building.id].softCap));
            });
            let softCapAdd = $('<span role="button" aria-label="Increase SoftCap Limit" class="add ea-buildings-tab">»</span>');
            softCapAdd.on('mouseup', function(e) {
                buildings[building.id].incSoftCap();
                let count = $('#'+building.id+'-softcap')[0];
                count.removeChild(count.firstChild);
                count.appendChild(document.createTextNode(buildings[building.id].softCap));
            });
            let softCapLabel = $('<span class="count current" id="'+building.id+'-softcap" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:2rem;">'+buildings[building.id].softCap+'</span>');
            let softCapControls = $('<div class="controls trade ea-buildings-tab" style="width:20%;text-align:center;margin-left:0">').append(softCapSub).append(softCapLabel).append(softCapAdd).append('</div>');
            buildingDiv.append(softCapControls);

            // Building Toggle
            let toggle = $('<label tabindex="0" class="switch ea-buildings-tab" style="margin-top: 4px;width:10%;"><input type="checkbox" value=false> <span class="check" style="height:5px;"></span></label>');
            buildingDiv.append(toggle);
            if(buildings[building.id].enabled){
                toggle.click();
                toggle.children('input').attr('value', true);
            }
            toggle.on('mouseup', function(e){
                if (e.which != 1) {return;}
                let input = e.currentTarget.children[0];
                let state = !(input.getAttribute('value') === "true");
                console.log("Updated build state", building.id, state);
                input.setAttribute('value', state);
                buildings[building.id].enabled = state;
                createBuildingSettings();
            });

            // Building Priority
            let prioSub = $('<span role="button" aria-label="Decrease Build Priority" class="sub ea-buildings-tab">«</span>');
            prioSub.on('mouseup', function(e) {
                buildings[building.id].decPriority();
                let count = $('#'+building.id+'-prio')[0];
                count.removeChild(count.firstChild);
                count.appendChild(document.createTextNode(buildings[building.id].priority));
            });
            let prioAdd = $('<span role="button" aria-label="Increase Build Priority" class="add ea-buildings-tab">»</span>');
            prioAdd.on('mouseup', function(e) {
                buildings[building.id].incPriority();
                let count = $('#'+building.id+'-prio')[0];
                count.removeChild(count.firstChild);
                count.appendChild(document.createTextNode(buildings[building.id].priority));
            });
            let prioLabel = $('<span class="count current" id="'+building.id+'-prio" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:2rem;">'+buildings[building.id].priority+'</span>');
            let prioControls = $('<div class="controls trade ea-buildings-tab" style="width:20%;text-align:center;margin-left:0">').append(prioSub).append(prioLabel).append(prioAdd).append('</div>');
            buildingDiv.append(prioControls);

            // Power Priority
            if (building instanceof PoweredBuilding) {
                let powerSub = $('<span role="button" aria-label="Decrease Power Priority" class="sub ea-buildings-tab">«</span>');
                powerSub.on('mouseup', function(e) {
                    buildings[building.id].decPowerPriority();
                    let count = $('#'+building.id+'-power-prio')[0];
                    count.removeChild(count.firstChild);
                    count.appendChild(document.createTextNode(buildings[building.id].powerPriority));
                });
                let powerAdd = $('<span role="button" aria-label="Increase Power Priority" class="add ea-buildings-tab">»</span>');
                powerAdd.on('mouseup', function(e) {
                    buildings[building.id].incPowerPriority();
                    let count = $('#'+building.id+'-power-prio')[0];
                    count.removeChild(count.firstChild);
                    count.appendChild(document.createTextNode(buildings[building.id].powerPriority));
                });
                let powerLabel = $('<span class="count current" id="'+building.id+'-power-prio" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:2rem;">'+buildings[building.id].powerPriority+'</span>');
                let powerControls = $('<div class="controls trade ea-buildings-tab" style="width:20%;text-align:center;margin-left:0">').append(powerSub).append(powerLabel).append(powerAdd).append('</div>');
                buildingDiv.append(powerControls);
            } else {
                let temp = $('<div class="ea-buildings-tab" style="width:20%;">');
                buildingDiv.append(temp);
            }

        }

        // Set focus back on search
        search.focus();
    }

    function createBuildingToggle(building){
        var batElmt;
        var key;
        batElmt = $('#'+building.id);
        let toggle = $('<label tabindex="0" class="switch ea-building-settings" style="position:absolute; margin-top: 30px;left:13%;top:-13%;"><input type="checkbox" value=false> <span class="check" style="height:5px; max-width:15px"></span></label>');
        batElmt.append(toggle);
        if(buildings[building.id].enabled){
            toggle.click();
            toggle.children('input').attr('value', true);
        }
        toggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            buildings[building.id].enabled = state;
        });
    }
    function createBuildingSettings(){
        removeBuildingSettings();
        // Creating building toggles for Village and Space tabs
        var x;
        for (x in buildings) {
            if (buildings[x].unlocked) {
                createBuildingToggle(buildings[x]);
            }
        }

        // Create generic Build All button for main settings div
        let buildAllBtn = $('<a class="button is-dark is-small ea-building-settings" id="build-all"><span>Set All</span></a>');
        buildAllBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            for (x in buildings) {
                buildings[x].enabled = true;
            }
            populateBuildingList();
            createBuildingSettings();
        });
        // Create generic Build None button for main settings div
        let buildNoneBtn = $('<a class="button is-dark is-small ea-building-settings" id="build-all"><span>Set None</span></a>');
        buildNoneBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            for (x in buildings) {
                buildings[x].enabled = false;
            }
            populateBuildingList();
            createBuildingSettings();
        });
        $('#autoBuild_right').append(buildAllBtn).append(buildNoneBtn);
    }
    function removeBuildingSettings(){
        $('.ea-building-settings').remove();
    }

    function createSmelterSettings() {
        // Create manual button for Auto Smelting
        let autoSmelterBtn = $('<a class="button is-dark is-small ea-smelter-settings" id="smelter-manual" title="Manually trigger Auto Smelting"><span>Manual</span></a>');
        autoSmelterBtn.on('mouseup', function(e){
            if (e.which != 1) {return;}
            count = 0;
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
            count = 0;
        });
        $('#autoFactory_right').append(autoFactoryBtn);
    }
    function removeFactorySettings() {
        $('.ea-factory-settings').remove();
    }

    function createSupportSettings() {
        let supportTabLabel = $('<li class="ea-support-settings"><a><span>Support</span></a></li>');
        let supportTab = $('<div id="supportSettings" class="tab-item ea-support-settings" style="display:none"><h2 class="is-sr-only">Auto Support Settings</h2></div>');
        // Creating click functions for other tabs
        for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
            let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
            let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
            tabLabel.on('mouseup',function(e) {
                if (e.which != 1) {return;}
                if (supportTabLabel.hasClass("is-active")) {
                    supportTabLabel.removeClass("is-active");
                    tabItem.style.display = '';
                }
                supportTab[0].style.display = 'none';
                if (!tabLabel.hasClass("is-active")) {tabLabel.addClass("is-active");}
            });
        }
        $('#mainColumn > .content > .b-tabs > .tabs > ul').append(supportTabLabel);
        $('#mainColumn > .content > .b-tabs > .tab-content').append(supportTab);
        supportTabLabel.on('mouseup',function(e) {
            if (e.which != 1) {return;}
            // For every other tab
            for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length-1;i++) {
                let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
                let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
                tabLabel.removeClass("is-active");
                tabItem.style.display = 'none';
            }
            supportTabLabel.addClass("is-active");
            supportTab[0].style.display = '';
        });
        // Filling support tab
        if(researched('tech-electricity')) {
            let label = $('<div><h3 class="name has-text-warning" title="Set the priority of buildings that require electricity">Electricity:</h3></div>');
            supportTab.append(label);
            for (var x in elecConsumers) {
                let c = elecConsumers[x];
                if (!c.unlocked) {continue;}
                let btnDiv = $('<div class="action cna"></div>');
                let btnLabel = $('<a class="button is-dark"><span class="aTitle">'+c.name+'</span><span class="count" title="'+c.name+' Priority">'+c.priority+'</span></a>');
                let btnInc = $('<span role="button" title="Increase '+c.name+' Priority" class="on">+</span>');
                let btnDec = $('<span role="button" title="Decrease '+c.name+' Priority" class="off">-</span>');
                btnDec.on('mouseup',function(e) {
                    if (e.which != 1) {return;}
                    elecConsumers[c.name].lowerPriority();
                    btnLabel[0].children[1].innerText = elecConsumers[c.name].priority;
                    updateSettings();
                });
                btnInc.on('mouseup',function(e) {
                    if (e.which != 1) {return;}
                    elecConsumers[c.name].higherPriority();
                    btnLabel[0].children[1].innerText = elecConsumers[c.name].priority;
                    updateSettings();
                });
                btnDiv.append(btnLabel).append(btnDec).append(btnInc);
                supportTab.append(btnDiv);
            }
        }
    }
    function removeSupportSettings() {
        $('.ea-support-settings').remove();
    }

    function createMarketSetting(resource){
        let marketRow = $('#market-'+resource.id);

        let toggleBuy = $('<label tabindex="0" class="switch ea-market-settings" style=""><input type="checkbox" value=false> <span class="check" style="height:5px;"></span><span class="control-label" style="font-size: small;">auto buy</span><span class="state"></span></label>');
        let buyRatioLabel = $('<span class="ea-market-settings count current" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:2.5rem;font-size:.8rem">(&lt'+resource.buyRatio+')</span>');
        let buyRatioSub = $('<span role="button" aria-label="Decrease '+resource.name+' Buy Ratio" class="sub ea-market-settings">«</span>');
        buyRatioSub.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resource.buyDec();
            buyRatioLabel[0].removeChild(buyRatioLabel[0].firstChild);
            buyRatioLabel[0].appendChild(document.createTextNode('(<'+resource.buyRatio+')'));
        });
        let buyRatioAdd = $('<span role="button" aria-label="Increase '+resource.name+' Buy Ratio" class="add ea-market-settings">»</span>');
        buyRatioAdd.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resource.buyInc();
            buyRatioLabel[0].removeChild(buyRatioLabel[0].firstChild);
            buyRatioLabel[0].appendChild(document.createTextNode('(<'+resource.buyRatio+')'));
        });
        marketRow.append(toggleBuy);
        marketRow.append(buyRatioSub).append(buyRatioLabel).append(buyRatioAdd);

        let toggleSell = $('<label tabindex="0" class="switch ea-market-settings" style=""><input type="checkbox" value=false> <span class="check" style="height:5px;"></span><span class="control-label" style="font-size: small;">auto sell</span><span class="state"></span></label>');
        let sellRatioLabel = $('<span class="ea-market-settings count current" style="padding-right:5px;padding-left:5px;vertical-align:bottom;width:2.5rem;font-size:.8rem">(&gt'+resource.sellRatio+')</span>');
        let sellRatioSub = $('<span role="button" aria-label="Decrease '+resource.name+' Sell Ratio" class="sub ea-market-settings">«</span>');
        sellRatioSub.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resource.sellDec();
            sellRatioLabel[0].removeChild(sellRatioLabel[0].firstChild);
            sellRatioLabel[0].appendChild(document.createTextNode('(>'+resource.sellRatio+')'));
        });
        let sellRatioAdd = $('<span role="button" aria-label="Increase '+resource.name+' Sell Ratio" class="add ea-market-settings">»</span>');
        sellRatioAdd.on('mouseup', function(e) {
            if (e.which != 1) {return;}
            resource.sellInc();
            sellRatioLabel[0].removeChild(sellRatioLabel[0].firstChild);
            sellRatioLabel[0].appendChild(document.createTextNode('(>'+resource.sellRatio+')'));
        });
        marketRow.append(toggleSell);
        marketRow.append(sellRatioSub).append(sellRatioLabel).append(sellRatioAdd);

        if(resource.autoBuy){
            toggleBuy.click();
            toggleBuy.children('input').attr('value', true);
        }
        if(resource.autoSell){
            toggleSell.click();
            toggleSell.children('input').attr('value', true);
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

        if($('#bulk-sell').length == 0 && researched('tech-market')){
            let bulkSell = $('<a class="ea-market-settings button is-dark is-small" id="bulk-sell"><span>Bulk Sell</span></a>');
            $('#autoMarket_right').append(bulkSell);
            bulkSell.on('mouseup', function(e){
                if (e.which != 1) {return;}
                autoMarket(true, true);
            });
        }
    }
    function createMarketSettings(){
        removeMarketSettings();
        for (var x in resources) {
            createMarketSetting(resources[x]);
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

    function createResearchTab() {
        // Creating Auto Research Tab
        let researchSettingTabLabel = $('<li class="ea-research-tab"><a><span>Auto Settings</span></a></li>');
        let mainResearchTab = getTab("Research");
        let newTab = mainResearchTab.querySelector('.b-tabs > .tabs > ul > li:nth-child(1)');
        let completeTab = mainResearchTab.querySelector('.b-tabs > .tabs > ul > li:nth-child(2)');
        let newTabItem = $('#tech');
        let completeTabItem = $('#oldTech');


        mainResearchTab.querySelector('.b-tabs > .tabs > ul').append(researchSettingTabLabel[0]);
        let researchSettingTab = $('<div id="researchSettings" class="tab-item ea-research-tab" style="display:none"><h2 class="is-sr-only">Auto Research Settings</h2></div>');
        mainResearchTab.querySelector('.b-tabs > .tab-content').append(researchSettingTab[0]);
        newTab.onmouseup = function(e) {
            if (e.which != 1) {return;}
            if (researchSettingTabLabel.hasClass("is-active")) {
                researchSettingTabLabel.removeClass("is-active");
                newTabItem[0].style.display = '';
            }
            researchSettingTab[0].style.display = 'none';
            if (!newTab.classList.contains("is-active")) {newTab.classList.add("is-active");}
        };
        completeTab.onmouseup = function(e) {
            if (e.which != 1) {return;}
            if (researchSettingTabLabel.hasClass("is-active")) {
                researchSettingTabLabel.removeClass("is-active");
                completeTabItem[0].style.display = '';
            }
            researchSettingTab[0].style.display = 'none';
            if (!completeTab.classList.contains("is-active")) {completeTab.classList.add("is-active");}
        };
        researchSettingTabLabel.on('mouseup',function(e) {
            if (e.which != 1) {return;}
            newTab.classList.remove("is-active");
            completeTab.classList.remove("is-active");
            newTabItem[0].style.display = 'none';
            completeTabItem[0].style.display = 'none';
            researchSettingTabLabel.addClass("is-active");
            researchSettingTab[0].style.display = '';
        });

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
        researchSettingTab.append(label).append(target1).append(target2);

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
        researchSettingTab.append(label2).append(target3);

        // Creating research list
        let label3 = $('<div><h3 class="name has-text-warning" title="Research list and priorities">Research List:</h3></div></br>');
        researchSettingTab.append(label3);

        let listParamDiv = $('<div id="listParamDiv" style="overflow:auto"></div>');
        let listParamLeft = $('<div id="listParamLeft" style="float:left"></div>');
        let listParamRight = $('<div id="listParamRight" style="float:right"></div>');

        let topLeft = $('<div id="listParamTopLeft"></div>');
        let bottomLeft = $('<div id="listParamBottomLeft"></div>');
        let topRight = $('<div id="listParamTopRight" style="float:right"></div>');
        let bottomRight = $('<div id="listParamBottomRight"></div>');

        let search = $('<input type="text" id="researchInput" placeholder="Search for research (ex: \'crate tag:mine res:knowledge\')" style="width:400px;">');
        search.on('input', populateResearchList);
        let sortLabel = $('<span style="padding-left:20px;padding-right:20px;">Sort:</span>');
        let sort = $('<select style="width:110px;" id="researchSort"><option value="none">None</option><option value="name">Name</option><option value="priority">Priority</option></select>');
        sort.on('change', populateResearchList);
        topLeft.append(search).append(sortLabel).append(sort);

        let showToggle = $('<label tabindex="0" class="switch" id="show_research_toggle" style=""><input type="checkbox" value=false> <span class="check"></span><span>Show All</span></label>');
        showToggle.on('change', populateResearchList);
        showToggle.on('mouseup', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
        });
        bottomLeft.append(showToggle);

        listParamLeft.append(topLeft).append(bottomLeft);
        listParamRight.append(topRight).append(bottomRight);
        listParamDiv.append(listParamLeft).append(listParamRight);
        researchSettingTab.append(listParamDiv);

        let researchList = $('<div id="researchList"></div>');
        let researchListLabel = $(`<div style="display:flex;">
                                    <span class="name has-text-warning" style="width:30%;" title="Research Name. Can be lowercase id if not currently available">Research</span>
                                    <span class="name has-text-warning" style="width:20%;text-align:center;" title="Sets the priority of this building to be built">Priority</span>
                                    </div>`);
        researchList.append(researchListLabel);
        researchSettingTab.append(researchList);
        populateResearchList();
    }
    let shownResearches = [];
    function populateResearchList() {
        let search = $('#researchInput')[0];
        let sort = $('#researchSort')[0];
        let showToggle = $('#show_research_toggle')[0];
        let researchList = $('#researchList')[0];
        while(researchList.childNodes.length != 1) {
            researchList.removeChild(researchList.lastChild);
        }
        //console.log("Populating Research List");
        let terms = search.value.split(' ');
        let names = [];
        let tags = [];
        let res = [];
        for (let i = 0;i < terms.length;i++) {
            let tagCheck = /tag:(.+)/.exec(terms[i]);
            let resCheck = /res:(.+)/.exec(terms[i]);
            //console.log(terms[i], tagCheck, resCheck);
            if (tagCheck !== null) {
                tags.push(tagCheck[1]);
            } else if (resCheck !== null) {
                res.push(resCheck[1]);
            } else {
                names.push(terms[i]);
            }
        }
        //console.log(names, tags, res);
        shownResearches = [];
        let temp_r = [];
        for (var x in researches) {temp_r.push(researches[x])}
        for (x in arpas) {temp_r.push(arpas[x]);}
        for (let i = 0;i < temp_r.length;i++) {
            let research = temp_r[i];

            // Checking if available
            if (showToggle.children[0].value == 'false' &&!research.unlocked) {
                continue;
            }
            // Searching for if any names appear in building name
            if (names.length != 0) {
                let pass = false;
                for (let i = 0;i < names.length;i++) {
                    var name;
                    if (research.name !== null) {
                        name = research.name;
                    } else {
                        name = research.id.split('-')[1];
                    }
                    if (name.toLowerCase().indexOf(names[i]) >= 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    continue;
                }
            }
            // Searching for if any tags appear in research name
            if (tags.length != 0) {
                let pass = false;
                for (let i = 0;i < tags.length;i++) {
                    if (research.tags.includes(tags[i])) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    continue;
                }
            }
            // Searching for if any resources appear in research requirements
            if (res.length != 0 && research.res !== null) {
                let pass = false;
                for (let i = 0;i < res.length;i++) {
                    if (research.getResDep(res[i]) !== null && research.getResDep(res[i]) > 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    continue;
                }
            }

            shownResearches.push(research);
        }

        // Sorting if necessary
        if (sort.value == 'name') {
            shownResearches.sort(nameCompare);
        } else if (sort.value == 'priority') {
            shownResearches.sort(priorityCompare);
        }

        // Drawing buildings into list
        for (let i = 0;i < shownResearches.length;i++) {
            let research = shownResearches[i];
            var researchDiv;
            if (i % 2) {
                researchDiv = $('<div style="display:flex" class="market-item"></div>');
            } else {
                researchDiv = $('<div style="display:flex" class="resource alt market-item"></div>');
            }
            researchList.appendChild(researchDiv[0]);

            // Name Label
            if (research.name === null) {
                name = research.id.split('-')[1];
            } else {
                name = research.name;
            }
            researchDiv.append($('<span style="width:30%;">'+name+'</span>'));

            // Research Priority
            let prioSub = $('<span role="button" aria-label="Decrease Research Priority" class="sub ea-research-tab">«</span>');
            prioSub.on('mouseup', function(e) {
                if (research.tags.includes('arpa')) {
                    arpas[research.id].decPriority();
                } else {
                    researches[research.id].decPriority();
                }
                let count = $('#'+research.id+'-prio')[0];
                count.removeChild(count.firstChild);
                if (research.tags.includes('arpa')) {
                    count.appendChild(document.createTextNode(arpas[research.id].priority));
                } else {
                    count.appendChild(document.createTextNode(researches[research.id].priority));
                }
            });
            let prioAdd = $('<span role="button" aria-label="Increase Research Priority" class="add ea-research-tab">»</span>');
            prioAdd.on('mouseup', function(e) {
                if (research.tags.includes('arpa')) {
                    arpas[research.id].incPriority();
                } else {
                    researches[research.id].incPriority();
                }

                let count = $('#'+research.id+'-prio')[0];
                count.removeChild(count.firstChild);
                if (research.tags.includes('arpa')) {
                    count.appendChild(document.createTextNode(arpas[research.id].priority));
                } else {
                    count.appendChild(document.createTextNode(researches[research.id].priority));
                }
            });
            let temp = (research.tags.includes('arpa')) ? arpas[research.id].priority : researches[research.id].priority;
            let prioLabel = $('<span class="count current" id="'+research.id+'-prio" >'+temp+'</span>');
            let prioControls = $('<div class="trade controls ea-research-tab" style="margin-left:0;text-align:center;">').append(prioSub).append(prioLabel).append(prioAdd).append('</div>');
            researchDiv.append(prioControls);
        }

        // Set focus back on search
        search.focus();
    }

    function createArpaToggle(name){
        let arpaDiv = $('#arpa'+name +' .head');
        let toggle = $('<label tabindex="0" class="switch ea-arpa-toggle" style="position:relative; max-width:75px;margin-top: -36px;left:45%;float:left;"><input type="checkbox" value=false> <span class="check" style="height:5px;"></span></label>');
        arpaDiv.append(toggle);
        if(settings.arpa[name]){
            toggle.click();
            toggle.children('input').attr('value', true);
        }
        toggle.on('mouseup', function(e){
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            settings.arpa[name] = state;
            updateSettings();
        });
    }
    function createArpaToggles(){
        removeArpaToggles();
        createArpaToggle('lhc');
        createArpaToggle('stock_exchange');
        createArpaToggle('monument');
        createArpaToggle('launch_facility');
    }
    function removeArpaToggles(){
        $('.ea-arpa-toggle').remove();
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
        let evolutionTabLabel = getTabLabel("Evolution");
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
            if (nav[i].innerText == name) {
                let nth=i+1
                return document.querySelector('#mainColumn > .content > .b-tabs > .tab-content > div:nth-child('+nth+')')
            }
        }
        return null;
    }
    function getTabLabel(name) {
        let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');
        for (let i = 0;i < nav.length;i++) {
            if (nav[i].innerText == name) {
                let nth=i+1
                return document.querySelector('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+nth+')')
            }
        }
        return null;
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
})($);
