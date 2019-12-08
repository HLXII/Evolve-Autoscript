import { resources, TradeableResource, CraftableResource } from './resources.js';
import { Action } from './actions.js';
import { buildings, Building } from './buildings.js';
import { researches, Research, researched } from './researches.js';
import { miscActions, arpas, storages, ArpaAction } from './miscactions.js';
import { messageQueue, getTotalGameDays, prioCompare } from './utility.js';
import { resetUICheck, loadPriorityQueue } from './ui.js';
import { autoSmelter, autoFactory, autoDroid, autoGraphene } from './industry.js';
import { autoSupport } from './support.js';
import { settings } from './settings.js';

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
        res.push(resources[x]);
    }
    return res;
}

export async function autoPriority(count) {
    // Finding available resources
    let res = getAvailableResources();
    // Finding available actions
    let actions = getAvailableActions(res);

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

    // Initializing resource allocation
    for (let x in res) {
        res[x].remainingAmount = res[x].amount;
    }

    // Loading priorities
    for (let i = 0;i < actions.length;i++) {
        actions[i].temp_priority = actions[i].priority;
    }

    // Sorting
    actions.sort(prioCompare);

    let limits = {};

    // Allocating
    for (let i = 0;i < actions.length;i++) {
        let action = actions[i];
        // Finding limiting resource
        action.completion = {};
        action.completionTime = {};
        action.maxCompletionTime = 0;
        for (let j = 0;j < res.length;j++) {
            let resource = res[j];
            let resDep = action.getRes(resource.id);
            // Doesn't depend on this resource
            if (!resDep) {continue;}
            // Resource is full or has enough to complete
            if (resource.unlocked && (resource.ratio == 1 || resource.remainingAmount >= resDep)) {
                action.completionTime[resource.id] = 0;
                action.completion[resource.id] = true;
                continue;
            }
            action.completion[resource.id] = false;
            let resRate = resource.temp_rate;
            // Resource doesn't have enough and is negative
            if (resRate <= 0) {
                action.completionTime[resource.id] = -1;
                action.maxCompletionTime = -1;
                continue;
            }
            // Finding completion time
            let time = (resDep - resource.remainingAmount) / resRate;
            action.completionTime[resource.id] = time;
            if (action.maxCompletionTime != -1 && action.maxCompletionTime < time) {
                action.maxCompletionTime = time;
            }
        }

        // Allocating kept resources based on limiting completion time
        for (let j = 0;j < res.length;j++) {
            let resource = res[j];
            let resDep = action.getRes(resource.id);
            // Doesn't depend on this resource
            if (!resDep) {continue;}
            // Don't keep if there is an impossible completion time
            if (action.maxCompletionTime == -1) {
                // Keeping all the availble resource that's not being produced
                if (action.completionTime[resource.id] == -1) {
                    let amt = Math.min(resource.remainingAmount, resDep)
                    action.keptRes[resource.id] = amt;
                    resource.remainingAmount -= amt;
                }
                // Keeping none of the other resources since it'll never be completed
                else {
                    action.keptRes[resource.id] = 0;
                }

            }
            // Finding total amount to allocate to this action
            else {
                let giveAmount = (action.maxCompletionTime - action.completionTime[resource.id]) * resource.temp_rate;
                let give = Math.min(giveAmount,resource.remainingAmount);
                action.keptRes[resource.id] = Math.min(action.getRes(resource.id), resource.remainingAmount - give);
                resource.remainingAmount -= action.keptRes[resource.id];
            }
            // Setting limiting action
            if (resource.remainingAmount == 0 && limits[resource.id] === undefined) {
                limits[resource.id] = action;
            }
        }

    }

    // Purchasing complete actions
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
            if (clicked) {
                // Auto Print
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
                // Checking to reset UI
                resetUICheck(action);
                break;
            }
        }
    }

    // Starting other Auto Settings
    if (settings.autoSmelter) {
        if (settings.smelterSettings.pqCheck) {
            await autoSmelter(limits);
        } else {
            await autoSmelter();
        }
    }
    if (settings.autoFactory) {
        if (settings.factorySettings.pqCheck) {
            await autoFactory(limits);
        } else {
            await autoFactory();
        }
    }
    if (settings.autoDroid) {
        if (settings.droidSettings.pqCheck) {
            await autoDroid(limits);
        } else {
            await autoDroid();
        }
    }
    if (settings.autoGraphene) {
        if (settings.grapheneSettings.pqCheck) {
            await autoGraphene(limits);
        } else {
            await autoGraphene();
        }
    }
    if (settings.autoSupport) {
        await autoSupport(limits);
    }

    // Determining rate priorities
    console.log("ACT:", actions);
    console.log("LIM:", limits);

    let priorityData = {limits:limits,actions:actions};

    if (settings.loadPQ || (settings.pqInterval && count % settings.pqInterval == 0)) {
        settings.loadPQ = false;
        loadPriorityQueue(priorityData, count)
    }

    return priorityData;
}