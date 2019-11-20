import { resources } from './resources.js';
import { researched } from './researches.js';
import { buildings } from './buildings.js';
import { sleep, getMultiplier, allocate } from './utility.js';
import { f_rate, zigguratBonus } from './gameScripts.js';
import { settings } from './settings.js';
import { openModal, closeModal } from './modal.js';

export function loadSmelter() {
    if (!settings.hasOwnProperty('smelterSettings')) {settings.smelterSettings = {};}
    if (!settings.smelterSettings.hasOwnProperty('Interval')) {settings.smelterSettings.Interval = 10;}
    if (!settings.smelterSettings.hasOwnProperty('pqCheck')) {settings.smelterSettings.pqCheck = true;}
    if (!settings.smelterSettings.hasOwnProperty('Wood')) {settings.smelterSettings.Wood = 1;}
    if (!settings.smelterSettings.hasOwnProperty('Coal')) {settings.smelterSettings.Coal = 1;}
    if (!settings.smelterSettings.hasOwnProperty('Oil')) {settings.smelterSettings.Oil = 1;}
    if (!settings.smelterSettings.hasOwnProperty('Iron')) {settings.smelterSettings.Iron = 2;}
    if (!settings.smelterSettings.hasOwnProperty('Steel')) {settings.smelterSettings.Steel = 3;}
}
function getSmelterData() {
    let spans = $('.fuels > span');
    let data = {};
    // Wood (Lumber/Souls/Flesh)
    if (!window.evolve.global.race['kindling_kindred'] || window.evolve.global.race['evil']) {
        data.Wood = {};
        data.Wood.decBtn = spans[0];
        data.Wood.incBtn = spans[2];
        let str = spans[1].attributes['data-label'].value
        str = /Consume ([\d\.]+) ([\w]+)/.exec(str);
        data.Wood.num = window.evolve.global.city.smelter.Wood;
        data.Wood.fuel = parseFloat(str[1]);
        data.Wood.name = str[2];
    }
    // Coal
    if (window.evolve.global.resource.Coal.display) {
        data.Coal = {};
        data.Coal.decBtn = (data.Wood) ? spans[3] : spans[0];
        data.Coal.incBtn = (data.Wood) ? spans[5] : spans[2];
        let str = (data.Wood) ? spans[4].attributes['data-label'].value : spans[1].attributes['data-label'].value;
        data.Coal.fuel = parseFloat(/Burn ([\d\.]+).*/.exec(str)[1]);
        data.Coal.num = window.evolve.global.city.smelter.Coal;
    }
    // Oil
    if (window.evolve.global.resource.Oil.display) {
        data.Oil = {};
        data.Oil.decBtn = (data.Wood) ? spans[6] : spans[3];
        data.Oil.incBtn = (data.Wood) ? spans[8] : spans[5];
        let str = (data.Wood) ? spans[7].attributes['data-label'].value : spans[4].attributes['data-label'].value;
        data.Oil.fuel = parseFloat(/Burn ([\d\.]+).*/.exec(str)[1]);
        data.Oil.num = window.evolve.global.city.smelter.Oil;
    }

    // Iron
    data.Iron = {};
    data.Iron.num = window.evolve.global.city.smelter.Iron;
    data.Iron.btn = document.querySelector('.smelting > span:nth-child(1) > button');
    let ironVal = data.Iron.btn.parentElement.attributes['data-label'].value;
    data.Iron.percent = parseInt(/[^\d]+([\d]+)%/.exec(ironVal)[1]);

    // Steel
    if (window.evolve.global.resource.Steel.display && window.evolve.global.tech.smelting >= 2) {
        data.Steel = {};
        data.Steel.num = window.evolve.global.city.smelter.Steel;
        data.Steel.btn = document.querySelector('.smelting > span:nth-child(2) > button');
        let steelVal = data.Steel.btn.parentElement.attributes['data-label'].value;
        let temp = /[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*/.exec(steelVal);
        data.Steel.Coal = parseFloat(temp[1]);
        data.Steel.Iron = parseFloat(temp[2]);;
        data.Steel.produce = parseFloat(temp[3]);;
    }
    return data;
}
export async function autoSmelter(limits) {
    // Don't Auto smelt if not unlocked
    if (!researched('tech-steel')) {return;}

    // Opening Modal
    let opened = await openModal($('#city-smelter > .special'));
    if (!opened) {return;}

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
    let fuelAllocation = allocate(totalSmelters,fuelPriorities,{requireFunc:resourceCheck, allocFunc:allocFunc});

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

    let produceAllocation = allocate(fuelAllocation.total,prodPriorities,{requireFunc:resourceCheck, allocFunc:allocFunc});

    console.log("SMELTER PRODUCE:", produceAllocation);

    // Removing extra fuel
    for (let i = 0;i < fuelKeys.length;i++) {
        if (data[fuelKeys[i]].num > fuelAllocation.alloc[i]) {
            for (let j = 0;j < data[fuelKeys[i]].num - fuelAllocation.alloc[i];j++) {
                data[fuelKeys[i]].decBtn.click();
            }
        }
    }
    // Allocating fuel
    for (let i = 0;i < fuelKeys.length;i++) {
        if (data[fuelKeys[i]].num < fuelAllocation.alloc[i]) {
            for (let j = 0;j < fuelAllocation.alloc[i] - data[fuelKeys[i]].num;j++) {
                data[fuelKeys[i]].incBtn.click();
            }
        }
    }
    // Pushing all allocation to iron
    for (let i = 0;i < totalSmelters;i++) {
        data.Iron.btn.click();
    }
    // Adding steel
    if (produceAllocation.alloc.length == 2) {
        for (let i = 0;i < produceAllocation.alloc[1];i++) {
            data.Steel.btn.click();
        }
    }

    // Setting data to null for garbage collector maybe
    data = null;

    // Closing modal
    await closeModal();
}

export function loadFactory() {
    if (!settings.hasOwnProperty('factorySettings')) {settings.factorySettings = {};}
    if (!settings.factorySettings.hasOwnProperty('Interval')) {settings.factorySettings.Interval = 11;}
    if (!settings.factorySettings.hasOwnProperty('pqCheck')) {settings.factorySettings.pqCheck = true;}
    if (!settings.factorySettings.hasOwnProperty('Luxury_Goods')) {settings.factorySettings.Luxury_Goods = 0;}
    if (!settings.factorySettings.hasOwnProperty('Alloy')) {settings.factorySettings.Alloy = 3;}
    if (!settings.factorySettings.hasOwnProperty('Polymer')) {settings.factorySettings.Polymer = 3;}
    if (!settings.factorySettings.hasOwnProperty('Nano_Tube')) {settings.factorySettings.Nano_Tube = 7;}
    if (!settings.factorySettings.hasOwnProperty('Stanene')) {settings.factorySettings.Stanene = 4;}
}
function getFactoryData() {
    let data = {};

    let factoryLevel = window.evolve.global.tech['factory'] ? window.evolve.global.tech['factory'] : 0;

    // Luxury Goods
    data.Lux = {};
    data.Lux.decBtn = document.querySelector('#specialModal > div:nth-child(2) > span:nth-child(2)');
    data.Lux.incBtn = document.querySelector('#specialModal > div:nth-child(2) > span:nth-child(4)');
    let str = document.querySelector('#specialModal > div:nth-child(2) > span:nth-child(1)').attributes['data-label'].value;
    let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)/.exec(str)
    data.Lux.num = window.evolve.global.city.factory.Lux;
    data.Lux.Furs = temp[1];
    data.Lux.Money = temp[2];

    // Alloy
    data.Alloy = {};
    data.Alloy.decBtn = document.querySelector('#specialModal > div:nth-child(3) > span:nth-child(2)');
    data.Alloy.incBtn = document.querySelector('#specialModal > div:nth-child(3) > span:nth-child(4)');
    str = document.querySelector('#specialModal > div:nth-child(3) > span:nth-child(1)').attributes['data-label'].value;
    temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
    data.Alloy.num = window.evolve.global.city.factory.Alloy;
    data.Alloy.Copper = temp[1];
    data.Alloy.Aluminium = temp[2];
    // Alloy Production
    let factory_output = f_rate.Alloy.output[factoryLevel];
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
        data.Polymer.decBtn = document.querySelector('#specialModal > div:nth-child(4) > span:nth-child(2)');
        data.Polymer.incBtn = document.querySelector('#specialModal > div:nth-child(4) > span:nth-child(4)');
        let str = document.querySelector('#specialModal > div:nth-child(4) > span:nth-child(1)').attributes['data-label'].value;
        let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)?[^\d\.]+/.exec(str)
        data.Polymer.num = window.evolve.global.city.factory.Polymer;
        data.Polymer.Oil = temp[1];
        // Kindred Kindling
        data.Polymer.Lumber = (temp[2]) ? temp[2] : 0;
        // Polymer Production
        let factory_output = f_rate.Polymer.output[factoryLevel];
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
        data.Nano.decBtn = document.querySelector('#specialModal > div:nth-child(5) > span:nth-child(2)');
        data.Nano.incBtn = document.querySelector('#specialModal > div:nth-child(5) > span:nth-child(4)');
        let str = document.querySelector('#specialModal > div:nth-child(5) > span:nth-child(1)').attributes['data-label'].value;
        let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
        data.Nano.num = window.evolve.global.city.factory.Nano;
        data.Nano.Coal = temp[1];
        data.Nano.Neutronium = temp[2];
        data.Nano.produce = 0;
        // Nano Tube Production
        let factory_output = f_rate.Nano_Tube.output[factoryLevel];
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
        data.Stanene.decBtn = document.querySelector('#specialModal > div:nth-child(6) > span:nth-child(2)');
        data.Stanene.incBtn = document.querySelector('#specialModal > div:nth-child(6) > span:nth-child(4)');
        let str = document.querySelector('#specialModal > div:nth-child(6) > span:nth-child(1)').attributes['data-label'].value;
        let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
        data.Stanene.num = window.evolve.global.city.factory.Stanene;
        data.Stanene.Aluminium = temp[1];
        data.Stanene.Nano_Tube = temp[2];
        // Stanene Production
        let factory_output = f_rate.Stanene.output[factoryLevel];
        factory_output *= getMultiplier('Stanene') * getMultiplier('Global');
        data.Stanene.produce = factory_output;
    }
    return data;
}
export async function autoFactory(limits) {
    // Don't Auto factory if not unlocked
    if (!researched('tech-industrialization')) {return;}
    // Don't Auto factory if you don't have any
    if (buildings['city-factory'].numTotal < 1) {return;}

    // Opening Modal
    let opened = await openModal($('#city-factory > .special'));
    if (!opened) {return;}

    let totalFactories = buildings['city-factory'].numOn + buildings['space-red_factory'].numOn;

    let data = getFactoryData();
    console.log('FACTORY DATA:', data);

    // Reverting current allocation
    if (data.Lux) {
        resources.Furs.temp_rate += data.Lux.Furs * data.Lux.num;
        resources.Money.temp_rate += data.Lux.Money * data.Lux.num;
    }
    if (data.Alloy) {
        resources.Copper.temp_rate += data.Alloy.Copper * data.Alloy.num;
        resources.Aluminium.temp_rate += data.Alloy.Aluminium * data.Alloy.num;
        resources.Alloy.temp_rate -= data.Alloy.produce * data.Alloy.num;
    }
    if (data.Polymer) {
        resources.Lumber.temp_rate += data.Polymer.Lumber * data.Polymer.num;
        resources.Oil.temp_rate += data.Polymer.Oil * data.Polymer.num;
        resources.Polymer.temp_rate -= data.Polymer.produce * data.Polymer.num;
    }
    if (data.Nano) {
        resources.Coal.temp_rate += data.Nano.Coal * data.Nano.num;
        resources.Neutronium.temp_rate += data.Nano.Neutronium * data.Nano.num;
        resources.Nano_Tube.temp_rate -= data.Nano.produce * data.Nano.num;
    }
    if (data.Stanene) {
        resources.Aluminium.temp_rate += data.Stanene.Aluminium * data.Stanene.num;
        resources.Nano_Tube.temp_rate += data.Stanene.Nano_Tube * data.Stanene.num;
        resources.Stanene.temp_rate -= data.Stanene.produce * data.Stanene.num;
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
    let allocation = allocate(totalFactories,priorities,{requireFunc:resourceCheck, allocFunc:allocFunc});

    console.log('FACTORY PRIO:', priorities, 'FACTORY RATIO:', ratios);
    console.log('FACTORY ALLOC:', allocation);

    // Allocating
    for (let i = 0;i < keys.length;i++) {
        if (data[keys[i]].num > allocation.alloc[i]) {
            for (let j = 0;j < data[keys[i]].num - allocation.alloc[i];j++) {
                data[keys[i]].decBtn.click();
            }
        }
    }
    for (let i = 0;i < keys.length;i++) {
        if (data[keys[i]].num < allocation.alloc[i]) {
            for (let j = 0;j < allocation.alloc[i] - data[keys[i]].num;j++) {
                data[keys[i]].incBtn.click();
            }
        }
    }

    // Setting data to null for garbage collector maybe
    data = null;

    // Closing modal
    await closeModal();
}

export function loadDroid() {
    if (!settings.hasOwnProperty('droidSettings')) {settings.droidSettings = {};}
    if (!settings.droidSettings.hasOwnProperty('Interval')) {settings.droidSettings.Interval = 13;}
    if (!settings.droidSettings.hasOwnProperty('pqCheck')) {settings.droidSettings.pqCheck = true;}
    if (!settings.droidSettings.hasOwnProperty('Adamantite')) {settings.droidSettings.Adamantite = 10;}
    if (!settings.droidSettings.hasOwnProperty('Uranium')) {settings.droidSettings.Uranium = 0;}
    if (!settings.droidSettings.hasOwnProperty('Coal')) {settings.droidSettings.Coal = 0;}
    if (!settings.droidSettings.hasOwnProperty('Aluminium')) {settings.droidSettings.Aluminium = 0;}
}
function getDroidData() {
    let data = {};

    // Adamantite
    data.Adamantite = {};
    data.Adamantite.produce = 0.075 * zigguratBonus();
    data.Adamantite.num = window.evolve.global.interstellar.mining_droid.adam;
    data.Adamantite.decBtn = document.querySelector('#specialModal > div:nth-child(2) > span:nth-child(2)');
    data.Adamantite.incBtn = document.querySelector('#specialModal > div:nth-child(2) > span:nth-child(4)');

    // Uranium
    data.Uranium = {};
    data.Uranium.produce = 0.12 * zigguratBonus();
    data.Uranium.num = window.evolve.global.interstellar.mining_droid.uran;
    data.Uranium.decBtn = document.querySelector('#specialModal > div:nth-child(3) > span:nth-child(2)');
    data.Uranium.incBtn = document.querySelector('#specialModal > div:nth-child(3) > span:nth-child(4)');

    // Coal
    data.Coal = {};
    data.Coal.produce = 3.75 * zigguratBonus();
    data.Coal.num = window.evolve.global.interstellar.mining_droid.coal;
    data.Coal.decBtn = document.querySelector('#specialModal > div:nth-child(4) > span:nth-child(2)');
    data.Coal.incBtn = document.querySelector('#specialModal > div:nth-child(4) > span:nth-child(4)');

    // Aluminium
    data.Aluminium = {};
    data.Aluminium.produce = 2.75 * zigguratBonus();
    data.Aluminium.num = window.evolve.global.interstellar.mining_droid.alum;
    data.Aluminium.decBtn = document.querySelector('#specialModal > div:nth-child(5) > span:nth-child(2)');
    data.Aluminium.incBtn = document.querySelector('#specialModal > div:nth-child(5) > span:nth-child(4)');

    return data;
}
export async function autoDroid(limits) {
    // Don't Auto Droid if not unlocked
    if (window.evolve.global.tech['alpha'] < 2) {return;}
    // Don't Auto Droid if you don't have any
    if (buildings['interstellar-mining_droid'].numTotal < 1) {return;}

    // Opening Modal
    let opened = await openModal($('#interstellar-mining_droid > .special'));
    if (!opened) {return;}

    let totalDroids = buildings['interstellar-mining_droid'].numOn;

    let data = getDroidData();
    console.log('DROID DATA:', data);

    // Reverting current allocation
    resources.Adamantite.temp_rate -= data.Adamantite.produce * data.Adamantite.num;
    resources.Uranium.temp_rate -= data.Uranium.produce * data.Uranium.num;
    resources.Coal.temp_rate -= data.Coal.produce * data.Coal.num;
    resources.Aluminium.temp_rate -= data.Aluminium.produce * data.Aluminium.num;

    // Finding Allocation
    let keys = [];
    let priorities = [];
    let totalPriority = 0;
    let ratios = [];
    if (data.hasOwnProperty('Adamantite')) {
        keys.push('Adamantite');
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
        keys.push('Uranium');
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
        keys.push('Coal');
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
        keys.push('Aluminium');
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
            case 'Adamantite': {
                resources.Adamantite.temp_rate += data.Adamantite.produce;
                break;
            }
            case 'Uranium': {
                resources.Uranium.temp_rate += data.Uranium.produce;
                break;
            }
            case 'Coal': {
                resources.Coal.temp_rate += data.Coal.produce;
                break;
            }
            case 'Aluminium': {
                resources.Aluminium.temp_rate += data.Aluminium.produce;
                break;
            }
        }
    };

    // Creating allocation list
    let allocation = allocate(totalDroids,priorities,{allocFunc:allocFunc});

    console.log('DROID PRIO:', priorities, 'DROID RATIO:', ratios);
    console.log('DROID ALLOC:', allocation);

    // Allocating
    for (let i = 0;i < keys.length;i++) {
        if (data[keys[i]].num > allocation.alloc[i]) {
            for (let j = 0;j < data[keys[i]].num - allocation.alloc[i];j++) {
                data[keys[i]].decBtn.click();
            }
        }
    }
    for (let i = 0;i < keys.length;i++) {
        if (data[keys[i]].num < allocation.alloc[i]) {
            for (let j = 0;j < allocation.alloc[i] - data[keys[i]].num;j++) {
                data[keys[i]].incBtn.click();
            }
        }
    }

    // Setting data to null for garbage collector maybe
    data = null;

    // Closing modal
    await closeModal();
}

export function loadGraphene() {
    if (!settings.hasOwnProperty('grapheneSettings')) {settings.grapheneSettings = {};}
    if (!settings.grapheneSettings.hasOwnProperty('Interval')) {settings.grapheneSettings.Interval = 17;}
    if (!settings.grapheneSettings.hasOwnProperty('pqCheck')) {settings.grapheneSettings.pqCheck = true;}
    if (!settings.grapheneSettings.hasOwnProperty('Wood')) {settings.grapheneSettings.Wood = 0;}
    if (!settings.grapheneSettings.hasOwnProperty('Coal')) {settings.grapheneSettings.Coal = 10;}
    if (!settings.grapheneSettings.hasOwnProperty('Oil')) {settings.grapheneSettings.Oil = 5;}
}
function getGrapheneData() {
    let data = {};
    let spans = $('#specialModal > div:nth-child(2) > span');
    // Lumber
    if (!window.evolve.global.race['kindling_kindred']) {
        data.Lumber = {};
        data.Lumber.decBtn = spans[0];
        data.Lumber.incBtn = spans[2];
        let str = spans[1].attributes['data-label'].value
        data.Lumber.fuel = parseFloat(/Consume ([\d\.]+).*/.exec(str)[1]);
        data.Lumber.num = window.evolve.global.interstellar.g_factory.Lumber;
    }
    // Coal
    if (window.evolve.global.resource.Coal.display) {
        data.Coal = {};
        data.Coal.decBtn = (data.Lumber) ? spans[3] : spans[0];
        data.Coal.incBtn = (data.Lumber) ? spans[5] : spans[2];
        let str = (data.Lumber) ? spans[4].attributes['data-label'].value : spans[1].attributes['data-label'].value;
        data.Coal.fuel = parseFloat(/Consume ([\d\.]+).*/.exec(str)[1]);
        data.Coal.num = window.evolve.global.interstellar.g_factory.Coal;
    }
    // Oil
    if (window.evolve.global.resource.Oil.display) {
        data.Oil = {};
        data.Oil.decBtn = (data.Lumber) ? spans[6] : spans[3];
        data.Oil.incBtn = (data.Lumber) ? spans[8] : spans[5];
        let str = (data.Lumber) ? spans[7].attributes['data-label'].value : spans[4].attributes['data-label'].value;
        data.Oil.fuel = parseFloat(/Consume ([\d\.]+).*/.exec(str)[1]);
        data.Oil.num = window.evolve.global.interstellar.g_factory.Oil;
    }
    return data;
}
export async function autoGraphene(limits) {
    // Don't Auto Graphene if not unlocked
    if (!researched('tech-graphene')) {return;}

    // Opening Modal
    let opened = await openModal($('#interstellar-g_factory > .special'));
    if (!opened) {return;}

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
    let fuelAllocation = allocate(totalFactories,fuelPriorities,{requireFunc:resourceCheck, allocFunc:allocFunc});

    console.log("GRAPHENE PRIO:", fuelPriorities);
    console.log("GRAPHENE FUEL:", fuelAllocation);

    // Removing extra fuel
    for (let i = 0;i < fuelKeys.length;i++) {
        if (data[fuelKeys[i]].num > fuelAllocation.alloc[i]) {
            for (let j = 0;j < data[fuelKeys[i]].num - fuelAllocation.alloc[i];j++) {
                data[fuelKeys[i]].decBtn.click();
            }
        }
    }
    // Allocating fuel
    for (let i = 0;i < fuelKeys.length;i++) {
        if (data[fuelKeys[i]].num < fuelAllocation.alloc[i]) {
            for (let j = 0;j < fuelAllocation.alloc[i] - data[fuelKeys[i]].num;j++) {
                data[fuelKeys[i]].incBtn.click();
            }
        }
    }

    // Setting data to null for garbage collector maybe
    data = null;

    // Closing Modal
    await closeModal();
}

