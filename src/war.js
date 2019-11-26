import { disableMult } from './utility.js'; 
import { settings } from './settings.js';
import { researched } from './researches.js';

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
export function getMaxSoldiers() {
    return getTotalSoldiers() - getFortressSoldiers();
}
export function getAvailableSoldiers() {
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
function getWinRate(num) {
    let span = document.querySelector(`#garrison > div:nth-child(4) > div:nth-child(${num+1}) > span`);
    if (span === null) {return 0;}
    span = span.attributes['data-label'].value;
    span = /([\d\.]+)% ([\w]+)/.exec(span);
    if (span === null) {return 0;}
    let [ meh, winRate, advantage] = span;
    winRate = parseFloat(winRate);
    winRate *= (advantage == 'advantage') ? 1 : -1;
    return winRate;
}
function runCampaign(num) {
    let btn = document.querySelector(`#garrison > div:nth-child(4) > div:nth-child(${num+1}) > span > button`);
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
                let winrate = getWinRate(1);
                //console.log("WIN:", winrate);
                // Lower Win Rate
                if (winrate <= settings.minWinRate) {
                    // Checking if campaign chosen
                    if (chosenCampaign) {
                        //console.log("Chosen Campaign", getCurrentCampaign(), "Win", winrate, settings.minWinRate);
                        addSoldiers();
                        if (getCurrentSoldiers() <= healthy) {
                            runCampaign(1);
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
                            runCampaign(1);
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
export function autoBattle() {
    if(settings.autoBattle && battleInterval === null) {
        battleInterval = setInterval(battle, 25);
    } else {
        if (!settings.autoBattle && !(battleInterval === null)) {
            clearInterval(battleInterval);
            battleInterval = null;
        }
    }
}