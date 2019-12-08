import { disableMult } from './utility.js';
import { settings, updateSettings } from './settings.js';
import { Action } from './actions.js';
import { researched } from './researches.js';
import { checkPowerRequirements, getBaseCP, poweredBuildingList } from './support.js';
import { openModal, closeModal } from './modal.js';

const missions =   ['space-test_launch', 'space-moon_mission', 'space-red_mission', 'space-hell_mission', 
                    'space-sun_mission', 'space-gas_mission', 'space-gas_moon_mission', 'space-belt_mission', 'space-dwarf_mission',
                    'interstellar-alpha_mission' , 'interstellar-proxima_mission', 'interstellar-nebula_mission' ,'interstellar-neutron_mission' ,'interstellar-blackhole_mission'];

export class Building extends Action {
    constructor(id, loc) {
        super(id, loc);
        if (!settings.actions[this.id].hasOwnProperty('decay')) {settings.actions[this.id].decay = 0.95;}
        if (!settings.actions[this.id].hasOwnProperty('min')) {settings.actions[this.id].min = 0;}
        if (!settings.actions[this.id].hasOwnProperty('max')) {settings.actions[this.id].max = -1;}
        this.color = 'has-text-warning';
    }

    get decay() {return settings.actions[this.id].decay;}
    set decay(decay) {settings.actions[this.id].decay = decay;}
    get min() {return settings.actions[this.id].min;}
    set min(min) {settings.actions[this.id].min = min;}
    get max() {return settings.actions[this.id].max;}
    set max(max) {settings.actions[this.id].max = max;}

    get priority() {
        // Setting priority to 100 if building hasn't reached the min amount
        if (this.min != 0 && this.numTotal < this.min) {
            return 100;
        }
        let priority = this.basePriority;
        // Scaling by decay
        priority *= this.decay ** this.numTotal;

        return priority;
    }

    get unlocked() {
        if (missions.includes(this.id)) {
            return this.label !== null;
        }
        return this.data !== null;
    }

    get numTotal() {
        if (this.data === null) {
            return 0;
        }
        return this.data.count;
    }

    decDecay(mult) {
        if (this.decay == 0.01) {return;}
        this.decay -= mult * 0.01;
        this.decay = parseFloat(Number(this.decay).toFixed(2));
        if (this.decay < 0.01) {this.decay = 0.01;}
        updateSettings();
        console.log("Decrementing Decay", this.id, this.decay);
    }
    incDecay(mult) {
        if (this.decay == 1) {return;}
        this.decay += mult * 0.01;
        this.decay = parseFloat(Number(this.decay).toFixed(2));
        if (this.decay > 1) {this.decay = 1;}
        updateSettings();
        console.log("Incrementing Decay", this.id, this.decay);
    }
    decMin(mult) {
        if (this.min == 0) {return;}
        this.min -= mult;
        if (this.min < 0) {this.min = 0;}
        updateSettings();
        console.log("Decrementing Min", this.id, this.min);
    }
    incmin(mult) {
        this.min += mult;
        updateSettings();
        console.log("Incrementing Min", this.id, this.min);
    }

    decMax(mult) {
        if (this.max == -1) {return;}
        this.max -= mult;
        if (this.max < -1) {this.max = -1;}
        updateSettings();
        console.log("Decrementing Max", this.id, this.max);
    }
    incMax(mult) {
        this.max += mult;
        updateSettings();
        console.log("Incrementing Max", this.id, this.max);
    }
}

export class PoweredBuilding extends Building {
    constructor(id, loc) {
        super(id, loc);
        if (!settings.actions[this.id].hasOwnProperty('powerPriority')) {settings.actions[this.id].powerPriority = 0;}
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
        if (this.data && this.data.on) {
            return this.data.on;
        }
        return 0;
    }

    async getCP() {
        let consume = [];
        let produce = [];
        let effect = this.effect;
        if (effect === null) {return;}
        [consume,produce] = getBaseCP(poweredBuildingList[this.id],effect);

        // Special since we can't read this info easily from the effect
        switch(this.id) {
            case 'city-mill': {
                consume.push({res:'Food',cost:100});
                produce.push({res:'electricity',cost:1});
                break;
            }
            case 'city-tourist_center': {
                // TODO calculate money gain
                break;
            }
            case 'city-windmill': {
                produce.push({res:'electricity',cost:1});
                break;
            }
        }

        return [consume,produce];
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

export class SpaceDockBuilding extends Building {
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

    async click() {
        if (!this.unlocked) {return false;}

        let def = this.def;
        if (def === null) {return false;}
        return def.action();
    }
}

export var buildings = {};
export function loadBuildings() {
    if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
    // City
    for (let action in window.evolve.actions.city) {
        // Remove manual buttons
        if (action == 'food' || action == 'lumber' || action == 'stone' || action == 'slaughter' || action == 'slave_market') {continue;}
        let id = window.evolve.actions.city[action].id;
        if (id in poweredBuildingList) {
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
            if (id in poweredBuildingList) {
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
            if (id in poweredBuildingList) {
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
            if (id in poweredBuildingList) {
                buildings[id] = new PoweredBuilding(id, ['portal', location, action]);
                continue;
            }
            buildings[id] = new Building(id, ['portal', location, action]);
        }
    }
    console.log(buildings);
}