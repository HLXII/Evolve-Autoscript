
import sleep from './utility.js';
import { f_rate, zigguratBonus } from './gameScripts.js';
import { loadEvolution } from './evolution.js';

(async function() {
    console.log("Waiting for game to load...");
    await sleep(2000);
    main();
})();

async function main() {

    window.evolve = unsafeWindow.evolve;
    console.log(window.evolve);
    'use strict';
    var settings = {};
    var jsonSettings = localStorage.getItem('settings');
    if(jsonSettings != null){settings = JSON.parse(jsonSettings);}

    var url = 'https://github.com/HLXII/Evolve-Autoscript';
    var version = '1.2.12';

    // Used to ensure no modal window conflicts
    var modal = false;

    var resources = {};
    var buildings = {};
    var researches = {};

    loadSettings();

    // Main script loop
    var count = 1;
    while(1) {
        await sleep(2000);
        await fastAutomate();
    }
}

async function fastAutomate() {
    console.clear();
    console.log(count);
    updateUI();
    updateSettings();
    autoFarm();
    autoRefresh();
    autoBattle();
    if (inEvolution()) {
        // Evolution Automation
        if(settings.autoEvolution) {
            autoEvolution();
            // Loading buttons again to get DNA button
            loadFarm();
        }
    } else {
        // Civilization Automation
        var priorityData = null;
        if (settings.autoPriority) {
            priorityData = await autoPriority(count);
        }
        else {
            if (settings.autoSmelter && count % settings.smelterSettings.Interval == 0) {
                await autoSmelter();
            }
            if (settings.autoFactory && count % settings.factorySettings.Interval == 0) {
                await autoFactory();
            }
            if (settings.autoDroid && count % settings.droidSettings.Interval == 0) {
                await autoDroid();
            }
            if (settings.autoGraphene && count % settings.grapheneSettings.Interval == 0) {
                await autoGraphene();
            }
            if (settings.autoSupport && count % settings.supportSettings.Interval == 0) {
                await autoSupport();
            }
        }
        if (settings.autoTrade){autoTrade(priorityData);}
        if (settings.autoEjector) {autoEjector();}
        if (settings.autoCraft){
            autoCraft();
        }
        if (settings.autoEmploy){
            autoEmploy(priorityData);
        }
        if (settings.autoTax) {
            autoTax();
        }
        if (settings.autoMarket){
            autoMarket();
        }
        if (settings.autoStorage) {
            autoStorage();
        }
        if (settings.autoPrestige) {
            autoPrestige();
        }
    }
    count += 1;
}