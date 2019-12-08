import { sleep, inEvolution } from './utility.js';
import { loadEvolution, evoChallengeActions } from './evolution.js';
import { loadFarm } from './farm.js';
import { loadResources } from './resources.js';
import { loadMiscActions, loadArpas, loadStorages } from './miscactions.js';
import { loadResearches } from './researches.js';
import { loadBuildings } from './buildings.js';
import { loadJobs, loadCraftJobs } from './jobs.js';
import { loadGovernments } from './government.js';
import { loadSmelter, loadFactory, loadDroid, loadGraphene } from './industry.js';
import { loadSupport } from './support.js';
import { updateUI, resetUI } from './ui.js';
import { openModal, closeModal } from './modal.js';

export var settings = {};
export async function loadSettings() {
    console.log("Loading Settings");

    let jsonSettings = localStorage.getItem('settings');
    if (jsonSettings != null) {settings = JSON.parse(jsonSettings);}

    // Evolution
    try { loadEvolution(); } catch(e) {console.log('Error: Load Evolution', e);}
    // Farm
    try { loadFarm(); } catch(e) {console.log('Error: Load Farm', e);}
    // Resources
    try { loadResources(); } catch(e) {console.log('Error: Load Resources', e);}
    // Storages
    try { loadStorages(); } catch(e) {console.log('Error: Load Storage', e);}
    // Misc Actions
    try { loadMiscActions(); } catch(e) {console.log('Error: Load Misc Actions', e);}
    // Research
    try { loadResearches(); } catch(e) {console.log('Error: Load Researches', e);}
    // Buildings
    try { loadBuildings(); } catch(e) {console.log('Error: Load Buildings', e);}
    // Jobs
    try { loadJobs(); } catch(e) {console.log('Error: Load Jobs', e);}
    try { loadCraftJobs(); } catch(e) {console.log('Error: Load Craft Jobs', e);}
    // Government
    try { loadGovernments(); } catch(e) {console.log('Error: Load Governments', e);}
    // ARPA
    try { loadArpas(); } catch(e) {console.log('Error: Load ARPAs', e);}

    // Smelter
    loadSmelter();
    // Factory
    loadFactory();
    // Mining Droid
    loadDroid();
    // Graphene Plant
    loadGraphene();
    // Support
    loadSupport();

    if (!settings.hasOwnProperty('autoPrint')) {
        settings.autoPrint = true;
    }
    if (!settings.hasOwnProperty('printSettings')) {
        settings.printSettings = {};
    }
    for (let i = 0;i < printSettings.length;i++) {
        if (!settings.hasOwnProperty(printSettings[i])) {
            settings.printSettings[printSettings[i]] = true;
        }
    }
    if (!settings.hasOwnProperty('autoFarm')) {
        settings.autoFarm = false;
    }
    if (!settings.hasOwnProperty('farmRate')) {
        settings.farmRate = 10;
    }
    if (!settings.hasOwnProperty('autoRefresh')) {
        settings.autoRefresh = false;
    }
    if (!settings.hasOwnProperty('autoPrestige')) {
        settings.autoPrestige = false;
    }
    if (!settings.hasOwnProperty('prestige')) {
        settings.prestige = 'mad';
    }

    if (!settings.hasOwnProperty('autoEvolution')) {
        settings.autoEvolution = false;
    }
    for (let i = 0;i < evoChallengeActions.length;i++) {
        if (!settings.hasOwnProperty(evoChallengeActions[i])) {
            settings[evoChallengeActions[i]] = false;
        }
    }
    if (!settings.hasOwnProperty('evolution')) {
        settings.evolution = "antid";
    }

    if (!settings.hasOwnProperty('autoEmploy')) {
        settings.autoEmploy = false;
    }
    if (!settings.hasOwnProperty('autoBattle')) {
        settings.autoBattle = false;
    }
    if (!settings.hasOwnProperty('minWinRate')) {
        settings.minWinRate = 60;
    }
    if (!settings.hasOwnProperty('maxCampaign')) {
        settings.maxCampaign = 4;
    }
    if (!settings.hasOwnProperty('woundedCheck')) {
        settings.woundedCheck = false;
    }
    if (!settings.hasOwnProperty('campaignFailCheck')) {
        settings.campaignFailCheck = false;
    }
    if (!settings.hasOwnProperty('campaignFailInterval')) {
        settings.campaignFailInterval = 5;
    }
    if (!settings.hasOwnProperty('autoFortress')) {
        settings.autoFortress = false;
    }

    if (!settings.hasOwnProperty('autoTax')) {
        settings.autoTax = false;
    }
    if (!settings.hasOwnProperty('minimumMorale')) {
        settings.minimumMorale = 100;
    }
    if  (!settings.hasOwnProperty('autoGovernment')) {
        settings.autoGovernment = false;
    }
    if (!settings.hasOwnProperty('autoUnification')) {
        settings.autoUnification = false;
    }
    if (!settings.hasOwnProperty('unification')) {
        settings.unification = 'reject';
    }

    if (!settings.hasOwnProperty('autoCraft')) {
        settings.autoCraft = false;
    }
    if (!settings.hasOwnProperty('autoMarket')) {
        settings.autoMarket = false;
    }
    if (!settings.hasOwnProperty('marketVolume')) {
        settings.marketVolume = 1000;
    }
    if (!settings.hasOwnProperty('minimumMoney')) {
        settings.minimumMoney = 0;
    }
    if (!settings.hasOwnProperty('autoTrade')) {
        settings.autoTrade = false;
    }
    if (!settings.hasOwnProperty('autoStorage')) {
        settings.autoStorage = false;
    }
    if (!settings.hasOwnProperty('autoEjector')) {
        settings.autoEjector = false;
    }

    if (!settings.hasOwnProperty('autoSupport')) {
        settings.autoSupport = false;
    }
    if (!settings.hasOwnProperty('autoSmelter')) {
        settings.autoSmelter = false;
    }
    if (!settings.hasOwnProperty('autoFactory')) {
        settings.autoFactory = false;
    }
    if (!settings.hasOwnProperty('autoDroid')) {
        settings.autoDroid = false;
    }
    if (!settings.hasOwnProperty('autoGraphene')) {
        settings.autoGraphene = false;
    }

    if (!settings.hasOwnProperty('autoResearch')) {
        settings.autoResearch = false;
    }
    if (!settings.hasOwnProperty('religion1')) {
        settings.religion1 = "fanaticism";
    }
    if (!settings.hasOwnProperty('religion2')) {
        settings.religion2 = "study";
    }

    if (!settings.hasOwnProperty('autoPriority')) {
        settings.autoPriority = false;
    }
    if (!settings.hasOwnProperty('showAll')) {
        settings.showAll = false;
    }
    if (!settings.hasOwnProperty('showBuilding')) {
        settings.showBuilding = false;
    }
    if (!settings.hasOwnProperty('showResearch')) {
        settings.showResearch = false;
    }
    if (!settings.hasOwnProperty('showMisc')) {
        settings.showMisc = false;
    }
    if (!settings.hasOwnProperty('loadPQ')) {
        settings.loadPQ = false;
    }

    if (!settings.hasOwnProperty('log')) {settings.log = []};
}

export const printSettings = ['Buildings','Researches','Misc'];

export function updateSettings(){
    localStorage.setItem('settings', JSON.stringify(settings));
}

export function importSettings() {
    console.log("Importing Settings");
    if ($('textarea#settingsImportExport').val().length > 0){
        let settingStr = $('textarea#settingsImportExport').val();
        settings = JSON.parse(LZString.decompressFromBase64(settingStr));
        updateSettings();
        resetUI();
    }
}
export function exportSettings() {
    console.log("Exporting Settings");
    $('textarea#settingsImportExport').val(LZString.compressToBase64(JSON.stringify(settings)));
    $('textarea#settingsImportExport').select();
    document.execCommand('copy');
}

let refreshInterval = null;
export function autoRefresh() {
    if(settings.autoRefresh && refreshInterval === null) {
        refreshInterval = setInterval(function() {location.reload();}, 200 * 1000);
    } else {
        if (!settings.autoRefresh && !(refreshInterval === null)) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    }
}

let prestigeCheck = false;
export async function autoPrestige() {
    switch(settings.prestige) {
        case 'mad': {
            // Checking if MAD unlocked
            let mad = document.getElementById('mad');
            if (mad === null || mad.style.display == 'none') {return;}
            // Checking if already clicked
            if (prestigeCheck) {return;}
            // Checking if armed
            if (mad.classList.contains('armed')) {
                // Launch
                mad.querySelector('.button:not(.arm)').click();
                prestigeCheck = true;
            }
            else {
                mad.querySelector('.button.arm').click();
            }
            break;
        }
        case 'bioseed': {
            // Checking if seeder is available
            if (!window.evolve.global.starDock.hasOwnProperty('seeder')) {return;}
            // Checking if seeding is complete
            let seedCount = window.evolve.global.starDock.seeder.count;
            if (seedCount !== 100) {return;}
            // Checking if already clicked
            if (prestigeCheck) {return;}

            let opened = await openModal($('#space-star_dock > .special'));
            if (!opened) {return;}

            // Getting buttons
            let prep_ship = document.querySelector('#spcdock-prep_ship > a');
            let launch_ship = document.querySelector('#spcdock-launch_ship > a');
            if (prep_ship) {prep_ship.click();}
            if (launch_ship) {launch_ship.click();}
            // Closing modal
            await closeModal();

            prestigeCheck = true;
            break;
        }
        case 'blackhole': {
            // Loading reset tech buttons
            let exotic_infusion = document.querySelector('#tech-exotic_infusion > .button')
            let infusion_check = document.querySelector('#tech-infusion_check > .button')
            let infusion_confirm = document.querySelector('#tech-infusion_confirm > .button')
            // Clicking if available
            if (exotic_infusion) {exotic_infusion.click();}
            if (infusion_check) {infusion_check.click();}
            if (infusion_confirm) {infusion_confirm.click();}
            break;
        }
    }
}

