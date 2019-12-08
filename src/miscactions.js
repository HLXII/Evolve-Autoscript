import { resources } from './resources.js';
import { Action } from './actions.js';
import { Building } from './buildings.js';
import { researched } from './researches.js';
import { getAvailableSoldiers, getMaxSoldiers } from './war.js';
import { settings, updateSettings } from './settings.js';

export class MiscAction extends Action {
    constructor(id) {
        super(id, ['misc']);
        this.color = 'has-text-advanced';
    }
}

export class ArpaAction extends Building {
    constructor(id, res, multiplier) {
        super(id, ['misc']);
        this.loc.push('arpa');
        this.res = res;
        this.multiplier = multiplier;
        this.color = 'has-text-special';
        if (!settings.actions[this.id].hasOwnProperty('size')) {settings.actions[this.id].size = 25;}
    }

    get size() {return settings.actions[this.id].size;}
    set size(size) {settings.actions[this.id].size = size;}

    get label() {
        return document.querySelector('#arpa'+this.id+' > .head > .desc');
    }
    get btn() {
        return document.querySelector(`#arpa${this.id} > div.buy > button.button.x${this.size}`);
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

    decSize() {
        if (this.size == 1) {return;}
        switch(this.size) {
            case 25: {this.size = 10;break;}
            case 10: {this.size = 1;break;}
        }
        updateSettings();
        console.log("Decrementing Button Size", this.id, this.size);
    }
    incSize() {
        if (this.size == 25) {return;}
        switch(this.size) {
            case 1: {this.size = 10;break;}
            case 10: {this.size = 25;break;}
        }
        updateSettings();
        console.log("Incrementing Button Size", this.id, this.size);
    }

    getRes(resid) {
        if (this.res === null) {
            return null;
        }
        let multiplier = this.multiplier;
        if (window.evolve.global.race['creative']){
            multiplier -= 0.01;
        }
        return this.res[resid] * (multiplier ** this.numTotal) / (100 / this.size);
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

export class MonumentAction extends ArpaAction {
    constructor(id, multiplier) {
        super(id, {}, multiplier);
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

export function loadMonumentRes() {
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

export var arpas = {};
export function loadArpas() {
    if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
    arpas.lhc = new ArpaAction('lhc',
                               {Money:2500000,
                               Knowledge:500000,
                               Copper:125000,
                               Cement:250000,
                               Aluminium:350000,
                               Titanium:50000,
                               Polymer:12000},
                               1.05);
    arpas.stock_exchange = new ArpaAction('stock_exchange',
                                          {Money:3000000,
                                           Plywood:25000,
                                           Brick:20000,
                                           Wrought_Iron:10000},
                                           1.06);
    arpas.launch_facility = new ArpaAction('launch_facility',
                                    {Money:2000000,
                                    Knowledge:500000,
                                    Cement:150000,
                                    Oil:20000,
                                    Sheet_Metal:15000,
                                    Alloy:25000},
                                    1.1);
    arpas.monument = new MonumentAction('monument', 1.1);
    arpas.railway = new ArpaAction('railway',
                                    {Money:2500000,
                                    Lumber:750000,
                                    Iron:300000,
                                    Steel:450000},
                                    1.08);
    loadMonumentRes();
}

export class StorageAction extends MiscAction {
    constructor(id, res) {
        super(id);
        this.loc.push('storage');
        this.res = res;
        if (!settings.actions[this.id].hasOwnProperty('size')) {settings.actions[this.id].size = 10;}
    }

    get size() {return settings.actions[this.id].size;}
    set size(size) {settings.actions[this.id].size = size;}

    decSize(mult) {
        if (this.size == 1) {return;}
        this.size -= mult;
        if (this.size <= 0) {this.size = 1;}
        updateSettings();
        console.log("Decrementing Craft Size", this.id, this.size);
    }
    incSize(mult) {
        this.size += mult;
        updateSettings();
        console.log("Incrementing Craft Size", this.id, this.size);
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

    getRes(resid) {
        if (this.res === null) {
            return null;
        }
        return this.res[resid] * this.size;
    }

    click() {
        let btn = this.btn;
        if (btn === null) {return false;}
        for (let i = 0;i < this.size;i++) {
            btn.click();
        }
        return true;
    }
}

export var storages = {};
export function loadStorages() {
    if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
    storages.Crate = new StorageAction('Crate',
                                       (resources.Lumber.unlocked) ?
                                       {Plywood:10}
                                       :
                                       {Stone:200});
    storages.Container = new StorageAction('Container',
                                           {Steel:125});
}

export class GeneAction extends MiscAction {
    constructor(id) {
        super(id);
        this.res = {Knowledge:200000};
    }

    get btn() {
        let btn = $("#arpaSequence > span > button").not(".has-text-success");
        return (btn.length) ? btn[0] : null;
    }

    get unlocked() {
        return resources.Knowledge.max > 200000 && this.btn !== null;
    }

    get name() {
        return "Assemble Gene";
    }

    getRes(resid) {
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

export class MercenaryAction extends MiscAction {
    constructor(id) {
        super(id);
        this.loc.push('mercenary');
        this.res = {};
        if (!settings.actions[this.id].hasOwnProperty('maxPrice')) {settings.actions[this.id].maxPrice = 25001;}
    }

    get maxPrice() {return settings.actions[this.id].maxPrice;}
    set maxPrice(maxPrice) {settings.actions[this.id].maxPrice = maxPrice;}

    decMaxPrice(mult) {
        if (this.maxPrice == -1) {return;}
        this.maxPrice -= mult;
        if (this.maxPrice < -1) {this.maxPrice = -1;}
        updateSettings();
        console.log("Decrementing Max Price", this.id, this.maxPrice);
    }
    incMaxPrice(mult) {
        this.maxPrice += mult;
        updateSettings();
        console.log("Incrementing Max Price", this.id, this.maxPrice);
    }

    get btn() {
        let btn = $('button.first');
        return (btn.length) ? btn[0] : null;
    }

    get unlocked() {
        let unlocked = window.evolve.global.civic.garrison.mercs;
        let canBuySoldiers = getAvailableSoldiers() != getMaxSoldiers();
        let belowMaxPrice = (this.maxPrice == -1) ? true : this.getRes('Money') < this.maxPrice;
        return unlocked && canBuySoldiers && belowMaxPrice;
    }

    get name() {
        return "Hire Garrison Mercenary";
    }

    getRes(resid) {
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

export class FortressMercenaryAction extends MercenaryAction {
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

export class AlterAction extends MiscAction {
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

    getRes(resid) {
        return 0;
    }

    click() {
        let btn = this.btn;
        if (btn === null) {return false;}
        btn.click();
        return true;
    }
}

export var miscActions = {};
export function loadMiscActions() {
    if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
    miscActions.Gene = new GeneAction("Gene");
    miscActions.Mercenary = new MercenaryAction("Mercenary");
    miscActions.FortressMercenary = new FortressMercenaryAction("FortressMercenary");
    miscActions.Sacrifice = new AlterAction("Sacrifice");
}