import { resources, TradeableResource, CraftableResource } from './resources.js';
import { Action } from './actions.js';
import { buildings, Building } from './buildings.js';
import { researches, Research, researched } from './researches.js';
import { miscActions, arpas, storages, ArpaAction } from './miscactions.js';
import { messageQueue, getTotalGameDays, prioCompare } from './utility.js';
import { resetUICheck } from './ui.js';
import { autoSmelter, autoFactory, autoDroid, autoGraphene } from './industry.js';
import { autoSupport } from './support.js';
import { settings } from './settings.js';

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
        if (!resources[x].unlocked) {continue;}
        res.push(resources[x]);
    }
    return res;
}

export async function autoPriority(count) {
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
    if (settings.autoSupport && count % settings.supportSettings.Interval == 0) {
        await autoSupport(limits);
    }

    // Determining rate priorities
    console.log("LIM:", limits);
    console.log("PQ:", PQs);

    return {limits:limits,PQs:PQs}
}