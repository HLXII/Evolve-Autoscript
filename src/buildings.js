// Stores details about buildings

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

class SpaceDockBuilding extends Building {
    constructor(id, loc) {
        super(id, loc);
        this.res = {};
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

    loadRes() {
        let data = $('#' + this.id + ' > a')[0];
        for (let i = 0;i < data.attributes.length;i++) {
            let name = data.attributes[i].name;
            let cost = data.attributes[i].value;
            if (name.indexOf('data-') >= 0) {
                this.res[name.substr(5, name.length)] = parseInt(cost);
            }
        }
    }

    getResDep(resid) {
        return this.res[resid.toLowerCase()];
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

function loadBuildings() {
    if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
    // City
    for (let action in window.evolve.actions.city) {
        // Remove manual buttons
        if (action == 'food' || action == 'lumber' || action == 'stone' || action == 'slaughter') {continue;}
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

function loadSpaceDockBuildings() {
    if (buildings['space-star_dock'].numTotal < 1) {return;}
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
        // Getting info
        buildings['spcdock-probes'].num = buildings['spcdock-probes'].numTotal;
        buildings['spcdock-probes'].loadRes();
        buildings['spcdock-seeder'].num = buildings['spcdock-seeder'].numTotal;
        buildings['spcdock-seeder'].loadRes();
        //console.log(buildings['spcdock-probes'].num,buildings['spcdock-seeder'].num);
        // Closing modal
        let closeBtn = $('.modal-close')[0];
        if (closeBtn !== undefined) {closeBtn.click();}
        modal = false;
    }, 100);
}