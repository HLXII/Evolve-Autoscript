// Contains all the resource definitions

// List of all advanced resources for coloring
let advancedResources = ['Deuterium','Neutronium','Adamantite','Infernite','Elerium','Nano_Tube','Graphene','Stanene'];

// Base class for resources
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
        let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(2) .add`);
        if (btn === null) {return false;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
        return true;
    }
    crateDec(num) {
        num = (num === undefined) ? 1 : num;
        let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(2) .sub`);
        if (btn === null) {return false;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
        return true;
    }
    containerInc(num) {
        num = (num === undefined) ? 1 : num;
        let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(3) .add`);
        if (btn === null) {return false;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
        return true;
    }
    containerDec(num) {
        num = (num === undefined) ? 1 : num;
        let btn = document.querySelector(`#stack-${this.id} .trade:nth-child(3) .sub`);
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

// Class for resources that can be traded
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
    get tradeSellCost() {
        if (this.tradeDecSpan !== null) {
            let dataStr = this.tradeDecSpan.attributes['data-label'].value;
            var reg = /.*([\d\.]+).*\$([\d\.]+)/.exec(dataStr);
            return parseFloat(reg[2]);
        } else {
            console.log("Error:", this.id, "Trade Buy Cost");
            return -1;
        }
    }
    get tradeBuyCost() {
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

// Loads resource data from the global
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

// Class for resources that can be crafted
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
        let amt = Math.min(50,this.canCraft);
        for (let j = 0;j < amt;j++) {
            btn.click();
        }
    }
}

// Finds the total resource consumption (returns the negative value)
function getConsumed(res) {
    let consumed = 0;
    for (let val in window.evolve.breakdown.p.consume[res]) {
        consumed += window.evolve.breakdown.p.consume[res][val];
    }
    return consumed;
}

function autoCraft() {
    //console.log("AutoCrafting");
    for (var x in resources) {
        if (resources[x] instanceof CraftableResource) {
            resources[x].craft();
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
                    if (counter > 50) {
                        break;
                    }
                }
            }

            if (resource.autoBuy && resource.ratio < resource.buyRatio && resource.buyBtn !== null) {
                //console.log("Autobuying", resource.name);
                let buyValue = getRealValue(resource.buyBtn.innerHTML.substr(1));
                let counter = 0;
                //console.log("CURM:", curMoney, "sellV", buyValue, "MAXM", maxMoney, "CURR", curResource, "MAXR", maxResource, "MINM", getMinMoney());
                while(true) {
                    // Break if too little money, too much resources, or buy ratio reached
                    if (curMoney - buyValue < getMinMoney() || curResource + qty > resource.storage || curResource / maxResource > resource.buyRatio) {
                        break;
                    }
                    resource.buyBtn.click();
                    curMoney -= buyValue;
                    curResource += qty;
                    if (counter > 50) {
                        break;
                    }
                }
            }
        }
    }, 25);
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
            resources[keys[focusSequence[curFocus]]].temp_rate += resources[keys[focusSequence[curFocus]]].tradeAmount;
            resources.Money.temp_rate -= resources[keys[focusSequence[curFocus]]].tradeBuyCost;
            curFreeTradeRoutes -= 1;
            curFocus += 1;
        } else {
            // Cannot buy trade route, sell instead
            if (curSell == sellSequence.length) {break;}
            newTradeRoutes[sellSequence[curSell]] -= 1;
            resources[sellSequence[curSell]].temp_rate -= resources[sellSequence[curSell]].tradeAmount;
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
    /*
    for (let i = 0;i < ejectables.length;i++) {
        let res = ejectables[i];
        window.evolve.global.interstellar.mass_ejector[res.id] = 0;
    }
    for (let i = 0;i < ejectables.length;i++) {
        let res = ejectables[i];
        window.evolve.global.interstellar.mass_ejector[res.id] = ejectAllocation[i];
    }
    */
}