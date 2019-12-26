import { resources } from './resources.js';
import { buildings, PoweredBuilding } from './buildings.js';
import { disableMult, getMultiplier, allocate } from './utility.js';
import { settings, updateSettings } from './settings.js';
import { researched } from './researches.js';

export function checkPowerRequirements(c_action){
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
export const poweredBuildingList = {
    'city-apartment': ['electricity'],
    'city-mill': [],
    'city-windmill': [],
    'city-sawmill': ['electricity'],
    'city-rock_quarry': ['electricity'],
    'city-cement_plant': ['electricity'],
    'city-factory': ['electricity'],
    'city-metal_refinery': ['electricity'],
    'city-mine': ['electricity'],
    'city-coal_mine': ['electricity'],
    'city-tourist_center': ['Food'],
    'city-casino': ['electricity', 'Money'],
    'city-wardenclyffe': ['electricity'],
    'city-biolab': ['electricity'],
    'city-coal_power': ['electricity', 'Coal'],
    'city-oil_power': ['electricity', 'Oil'],
    'city-fission_power': ['electricity', 'Uranium'],
    'city-mass_driver': ['electricity'],

    'space-nav_beacon': ['electricity', 'moon_support', 'red_support'],
    'space-moon_base': ['moon_support', 'Oil', 'electricity'],
    'space-iridium_mine': ['moon_support', 'Iridium'],
    'space-helium_mine': ['moon_support', 'Helium_3'],
    'space-observatory': ['moon_support'],
    'space-spaceport': ['red_support', 'Helium_3', 'electricity', 'Food'],
    'space-red_tower': ['red_support', 'electricity'],
    'space-living_quarters': ['red_support'],
    'space-vr_center': ['red_support'],
    'space-red_mine': ['red_support'],
    'space-fabrication': ['red_support'],
    'space-red_factory': ['electricity', 'Helium_3'],
    'space-biodome': ['red_support'],
    'space-exotic_lab': ['red_support'],
    'space-space_barracks': ['Oil', 'Food'],
    'space-geothermal': ['electricity', 'Helium_3'],
    'space-swarm_control': ['swarm_support'],
    'space-swarm_satellite': ['swarm_support', 'electricity'],
    'space-gas_mining': ['Helium_3', 'electricity'],
    'space-outpost': ['Neutronium', 'Oil', 'electricity'],
    'space-oil_extractor': ['Oil', 'electricity'],
    'space-space_station': ['belt_support', 'Helium_3', 'Food', 'electricity'],
    'space-elerium_ship': ['belt_support', 'Elerium'],
    'space-iridium_ship': ['belt_support', 'Iridium'],
    'space-iron_ship': ['belt_support', 'Iron'],
    'space-elerium_contain': ['electricity'],
    'space-e_reactor': ['electricity', 'Elerium'],
    'space-world_controller': ['electricity'],

    'interstellar-starport': ['alpha_support', 'Helium_3', 'electricity', 'Food'],
    'interstellar-habitat': ['alpha_support', 'electricity'],
    'interstellar-mining_droid': ['alpha_support'],
    'interstellar-processing': ['alpha_support'],
    'interstellar-fusion': ['alpha_support', 'electricity', 'Deuterium'],
    'interstellar-laboratory': ['alpha_support'],
    'interstellar-exchange': ['alpha_support'],
    'interstellar-g_factory': ['alpha_support'],
    'interstellar-xfer_station': ['alpha_support', 'Uranium', 'electricity'],
    'interstellar-cruiser': ['Helium_3'],
    'interstellar-dyson': ['electricity'],
    'interstellar-nexus': ['nebula_support', 'electricity', 'Money'],
    'interstellar-harvester': ['nebula_support', 'Helium_3', 'Deuterium'],
    'interstellar-elerium_prospector': ['nebula_support', 'Elerium'],
    'interstellar-neutron_miner': ['Neutronium', 'Helium_3', 'electricity'],
    //'interstellar-citadel': TOOD Implement
    'interstellar-far_reach': ['electricity'],
    'interstellar-stellar_engine': ['electricity'],
    'interstellar-mass_ejector': ['electricity'],

    'portal-turret': ['electricity'],
    'portal-war_droid': ['electricity'],
    'portal-war_drone': ['electricity'],
    'portal-sensor_drone': ['electricity'],
    'portal-attractor': ['electricity'],
}
export function getBaseCP(baseCPList, effect) {
    let consume = [];
    let produce = [];
    //console.log(`Getting base consume/produce:${baseCPList} ${effect}`);
    for (let i = 0;i < baseCPList.length;i++) {
        switch(baseCPList[i]) {
            case 'Money': {
                let money = /generates \$([\d\.]+)/.exec(effect);
                if (money) {
                    produce.push({res:'Money',cost:+money[1]});
                    break;
                }
                money = /([+-]?)\$([\d\.]+)\/s/.exec(effect);
                if (money !== null) {
                    //console.log(money[1], money[2]);
                    if (money[1] == '-') {
                        consume.push({res:'Money',cost:+money[2]});
                    }
                    else {
                        produce.push({res:'Money',cost:+money[2]});
                    }
                }
                break;
            }
            case 'Food': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let food = reg.exec(effect);
                if (food) {
                    //console.log(food[1], food[2]);
                    if (food[1] == '-') {
                        consume.push({res:'Food',cost:+food[2]});
                    }
                    else {
                        produce.push({res:'Food',cost:+food[2]});
                    }
                }
                break;
            }
            case 'Iron': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Iron = reg.exec(effect);
                if (Iron) {
                    //console.log(Iron[1], Iron[2]);
                    if (Iron[1] == '-') {
                        consume.push({res:'Iron',cost:+Iron[2]});
                    }
                    else {
                        produce.push({res:'Iron',cost:+Iron[2]});
                    }
                }
                break;
            }
            case 'Coal': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Coal = reg.exec(effect);
                if (Coal) {
                    //console.log(Coal[1], Coal[2]);
                    if (Coal[1] == '-') {
                        consume.push({res:'Coal',cost:+Coal[2]});
                    }
                    else {
                        produce.push({res:'Coal',cost:+Coal[2]});
                    }
                }
                break;
            }
            case 'Oil': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Oil = reg.exec(effect);
                if (Oil) {
                    //console.log(Oil[1], Oil[2]);
                    if (Oil[1] == '-') {
                        consume.push({res:'Oil',cost:+Oil[2]});
                    }
                    else {
                        produce.push({res:'Oil',cost:+Oil[2]});
                    }
                }
                break;
            }
            case 'Uranium': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Uranium = reg.exec(effect);
                if (Uranium) {
                    //console.log(Uranium[1], Uranium[2]);
                    if (Uranium[1] == '-') {
                        consume.push({res:'Uranium',cost:+Uranium[2]});
                    }
                    else {
                        produce.push({res:'Uranium',cost:+Uranium[2]});
                    }
                }
                break;
            }
            case 'Iridium': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Iridium = reg.exec(effect);
                if (Iridium) {
                    //console.log(Iridium[1], Iridium[2]);
                    if (Iridium[1] == '-') {
                        consume.push({res:'Iridium',cost:+Iridium[2]});
                    }
                    else {
                        produce.push({res:'Iridium',cost:+Iridium[2]});
                    }
                }
                break;
            }
            case 'Helium_3': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Helium_3 = reg.exec(effect);
                if (Helium_3) {
                    //console.log(Helium_3[1], Helium_3[2]);
                    if (Helium_3[1] == '-') {
                        consume.push({res:'Helium_3',cost:+Helium_3[2]});
                    }
                    else {
                        produce.push({res:'Helium_3',cost:+Helium_3[2]});
                    }
                }
                break;
            }
            case 'Deuterium': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Deuterium = reg.exec(effect);
                if (Deuterium) {
                    //console.log(Deuterium[1], Deuterium[2]);
                    if (Deuterium[1] == '-') {
                        consume.push({res:'Deuterium',cost:+Deuterium[2]});
                    }
                    else {
                        produce.push({res:'Deuterium',cost:+Deuterium[2]});
                    }
                }
                break;
            }
            case 'Neutronium': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Neutronium = reg.exec(effect);
                if (Neutronium) {
                    //console.log(Neutronium[1], Neutronium[2]);
                    if (Neutronium[1] == '-') {
                        consume.push({res:'Neutronium',cost:+Neutronium[2]});
                    }
                    else {
                        produce.push({res:'Neutronium',cost:+Neutronium[2]});
                    }
                }
                break;
            }
            case 'Elerium': {
                let name = window.evolve.global.resource[baseCPList[i]].name;
                let reg = new RegExp(`([+-]?)([\\d\\.]+) ` + name);
                let Elerium = reg.exec(effect);
                if (Elerium) {
                    //console.log(Elerium[1], Elerium[2]);
                    if (Elerium[1] == '-') {
                        consume.push({res:'Elerium',cost:+Elerium[2]});
                    }
                    else {
                        produce.push({res:'Elerium',cost:+Elerium[2]});
                    }
                }
                break;
            }
            case 'electricity': {
                let electricity = /(Uses|uses|Consumes|consumes) ([\d\.]+)kW/.exec(effect);
                if (electricity) {
                    //console.log('-', electricity[2]);
                    consume.push({res:'electricity',cost:+electricity[2]});
                    break;
                }
                electricity = /([+-]?)([\d\.]+)kW/.exec(effect);
                if (electricity) {
                    //console.log(electricity[1], electricity[2]);
                    if (electricity[1] == '-') {
                        consume.push({res:'electricity',cost:+electricity[2]});
                    }
                    else {
                        produce.push({res:'electricity',cost:+electricity[2]});
                    }
                }
                break;
            }
            case 'moon_support': {
                let moon_support = /([+-]?)([\d\.]+) Moon/.exec(effect);
                if (moon_support !== null) {
                    //console.log(moon_support[1], moon_support[2]);
                    if (moon_support[1] == '-') {
                        consume.push({res:'moon_support',cost:+moon_support[2]});
                    }
                    else {
                        produce.push({res:'moon_support',cost:+moon_support[2]});
                    }
                }
                break;
            }
            case 'red_support': {
                let race = window.evolve.global.race.species;
                let red = window.evolve.races[race].solar.red;
                let reg = new RegExp(`([+-])?([\\d\\.]+) ` + red);
                let red_support = reg.exec(effect);
                if (red_support !== null) {
                    //console.log(red_support[1], red_support[2]);
                    if (red_support[1] == '-') {
                        consume.push({res:'red_support',cost:+red_support[2]});
                    }
                    else {
                        produce.push({res:'red_support',cost:+red_support[2]});
                    }
                }
                break;
            }
            case 'swarm_support': {
                let swarm_support = /([+-]?)([\d\.]+) Swarm/.exec(effect);
                if (swarm_support !== null) {
                    //console.log(swarm_support[1], swarm_support[2]);
                    if (swarm_support[1] == '-') {
                        consume.push({res:'swarm_support',cost:+swarm_support[2]});
                    }
                    else {
                        produce.push({res:'swarm_support',cost:+swarm_support[2]});
                    }
                }
                break;
            }
            case 'belt_support': {
                let belt_support = /\+([\d\.]+) Max Space Miner/.exec(effect);
                if (belt_support) {
                    //console.log('+', belt_support[1]);
                    produce.push({res:'belt_support',cost:+belt_support[1]});
                    break;
                }
                belt_support = /Requires ([\d\.]+) Space Miner/.exec(effect);
                if (belt_support) {
                    //console.log('-', belt_support[1]);
                    consume.push({res:'belt_support',cost:+belt_support[1]});
                }
                break;
            }
            case 'alpha_support': {
                let alpha_support = /([+-]?)([\d\.]+) Alpha/.exec(effect);
                if (alpha_support) {
                    //console.log(alpha_support[1], alpha_support[2]);
                    if (alpha_support[1] == '-') {
                        consume.push({res:'alpha_support',cost:+alpha_support[2]});
                    }
                    else {
                        produce.push({res:'alpha_support',cost:+alpha_support[2]});
                    }
                }
                break;
            }
            case 'nebula_support': {
                let nebula_support = /([+-]?)([\d\.]+) (Nebula|Helix Nebula)/.exec(effect);
                if (nebula_support) {
                    //console.log(nebula_support[1], nebula_support[2]);
                    if (nebula_support[1] == '-') {
                        consume.push({res:'nebula_support',cost:+nebula_support[2]});
                    }
                    else {
                        produce.push({res:'nebula_support',cost:+nebula_support[2]});
                    }
                }
                break;
            }
        }
    }
    return [consume,produce];
}

export function loadSupport() {
    if (!settings.hasOwnProperty('supportSettings')) {settings.supportSettings = {};}
    if (!settings.supportSettings.hasOwnProperty('Interval')) {settings.supportSettings.Interval = 23;}
}

export async function autoSupport(priorityData) {
    // Don't start autoSupport if haven't unlocked power
    if (!researched('tech-electricity')) {return;}
    let powered = [];
    let totalPowered = 0;
    let priorities = [];
    let totalPriority = 0;
    let ratios = [];
    let maxes = [];
    let support = {
        electricity:0,
        moon_support:0,
        red_support:0,
        swarm_support:0,
        belt_support:0,
        alpha_support:0,
        nebula_support:0
    }
    // Loading all buildings
    for (let x in buildings) {
        // Ignore not unlocked buildings
        if (!buildings[x].unlocked) {continue;}
        // Ignore non powered buildings
        if (!(buildings[x] instanceof PoweredBuilding)) {continue;}
        // Ignore not power unlocked buildings
        if (!buildings[x].powerUnlocked) {continue;}
        // Ignore non-powered buildings
        if (!(buildings[x] instanceof PoweredBuilding)) {continue;}

        // Loading production/consumption
        [buildings[x].consume, buildings[x].produce] = await buildings[x].getCP();

        // Checking for dyson net / stellar engine
        if (buildings[x].id == 'interstellar-stellar_engine') {
            if (buildings[x].numTotal == 100) {
                support.electricity += buildings[x].produce[0].cost;
                console.log("STELLAR: ", buildings[x].produce[0].cost);
            }
            continue;
        }
        if (buildings[x].id == 'interstellar-dyson') {
            if (buildings[x].numTotal == 100) {
                support.electricity += buildings[x].produce[0].cost;
                console.log("DYSON: ", buildings[x].produce[0].cost);
            }
            continue;
        }

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

    let allocation = allocate(totalPowered,priorities,{max:maxes,requireFunc:canTurnOn,allocFunc:turnOn})

    console.log("POWERED:", powered, "PRIO:", priorities, "RATIO:", ratios);
    console.log("SUPPORT ALLOC:", allocation);
    console.log("REMAIN:", support);

    // Allocating
    for (let i = 0;i < powered.length;i++) {
        let building = powered[i];
        /*
        for (let j = 0;j < building.consume.length;j++) {
            if (building.consume[j].res == 'electricity') {
                console.log(building.id, allocation.alloc[i], building.consume[j].cost, '-', allocation.alloc[i] * building.consume[j].cost);
                break;
            }
        }
        for (let j = 0;j < building.produce.length;j++) {
            if (building.produce[j].res == 'electricity') {
                console.log(building.id, allocation.alloc[i], building.produce[j].cost, '+', allocation.alloc[i] * building.produce[j].cost);
                break;
            }
        }
        */
        if (building.numOn < allocation.alloc[i]) {
            building.incPower(allocation.alloc[i] - building.numOn);
        }
        else {
            building.decPower(building.numOn - allocation.alloc[i]);
        }
    }
}