import { url, version, workingVersion } from './main.js';
import { keyMult, inEvolution, getTab, getRealValue } from './utility.js';
import { settings, loadSettings, updateSettings, printSettings, importSettings, exportSettings } from './settings.js';
import { evoChallengeActions } from './evolution.js';
import { loadFarm } from './farm.js';
import { resources, TradeableResource, CraftableResource } from './resources.js';
import { Action } from './actions.js';
import { miscActions, arpas, storages, MiscAction, ArpaAction, StorageAction, MercenaryAction } from './miscactions.js';
import { researches, Research, researched } from './researches.js';
import { buildings, Building, PoweredBuilding } from './buildings.js';
import { jobs, craftJobs } from './jobs.js';
import { governments } from './government.js';

let farmReset = ['tech-club', 'tech-bone_tools'];
let jobReset = ['city-lumber_yard',
                'city-rock_quarry',
                'city-cement_plant',
                'city-foundry',
                'city-metal_refinery',
                'city-mine',
                'city-coal_mine',
                'city-amphitheatre',
                'city-university',
                'city-wardenclyffe',
                'tech-investing',
                'tech-reclaimer',
                'space-living_quarters',
                'space-space_station',
                'portal-carport',];
let resourceReset = ['city-garrison',
                     'city-storage_yard',
                     'city-warehouse',
                     'city-cement_plant',
                     'city-foundry',
                     'city-factory',
                     'city-metal_refinery',
                     'city-mine',
                     'city-coal_mine',
                     'city-oil_well',
                     'space-iridium_mine',
                     'space-helium_mine',
                     'space-outpost',
                     'interstellar-mining_droid',
                     'interstellar-g_factory',
                     'interstellar-nexus',
                     'portal-carport',];
export function resetUICheck(action) {
    if (farmReset.includes(action.id)) {loadFarm();}
    if (jobReset.includes(action.id)) {
        if (settings.autoEmploy) {createEmploySettings();}
    }
    if (resourceReset.includes(action.id)) {
        if (settings.autoMarket) {createMarketSettings();}
        if (settings.autoTrade) {createTradeSettings();}
        if (settings.autoStorage) {createStorageSettings();}
        if (settings.autoEjector) {createEjectorSettings();}
    }
}

let toolTipClass = 'is-primary is-bottom is-small b-tooltip is-animated is-multiline';
function createNumControl(currentValue, name, subFunc, addFunc, args) {
    args = args || {};
    let subBtn = $(`<span role="button" aria-label="Decrease ${name}" class="sub">«</span>`);
    let label = $(`<span id="${name}_control" class="count current" style="width:2rem;">${currentValue}</span>`);
    subBtn.on('click', function(e) {
        let mult = keyMult(e);
        document.getElementById(name+'_control').innerText = subFunc(mult);
        updateSettings();
    });
    let addBtn = $(`<span role="button" aria-label="Increase ${name}" class="add">»</span>`);
    addBtn.on('click', function(e) {
        let mult = keyMult(e);
        document.getElementById(name+'_control').innerText = addFunc(mult);
        updateSettings();
    });
    let control = $(`<div class="controls as-${name}-settings" style="display:flex"></div>`).append(subBtn).append(label).append(addBtn);
    if (args.toolTip !== undefined) {
        control.addClass(toolTipClass);
        control.attr('data-label', args.toolTip);
    }
    return control;
}
function createToggleControl(toggleId, toggleName, args) {
    args = args || {};
    let controlName = (Array.isArray(toggleId)) ? toggleId.join('_') : toggleId;
    let checkStyle = (args.small !== undefined) ? 'style="height:5px;"' : '';
    let toggle = $(`
    <label class="switch" id="${controlName}_toggle">
    <input type="checkbox" true-value="true" value="false">
    <span class="check" ${checkStyle}></span>
    <span class="control-label"><span class="is-primary is-bottom is-small is-animated is-multiline">${toggleName}</span>
    </span>
    </label>`);
    let setting = settings;
    if (args.hasOwnProperty('path')) {
        setting = args.path[0];
        for (let i = 1;i < args.path.length-1;i++) {
            setting = setting[args.path[i]];
        }
        toggleId = args.path[args.path.length-1];
    }
    toggle.children('input').on('click', function(e){
        if (e.which != 1) {return;}
        let input = e.currentTarget;
        let state = !(input.getAttribute('value') === "true");
        input.setAttribute('value', state);
        setting[toggleId] = state;
        console.log(`Setting ${controlName} to ${state}`);
        updateSettings();
        if (state && args.enabledCallBack !== undefined) {
            args.enabledCallBack();
        }
        else if (args.disabledCallBack !== undefined) {
            args.disabledCallBack()
        }
        if (args.onChange !== undefined) {
            args.onChange(state);
        }
    });
    if(setting[toggleId]){
        setTimeout( function() {
            console.log(`Setting ${controlName} initially to true`);
            toggle.children('span.check').click();
            toggle.children('input').attr('value', true);
        }, 1000);
    }
    return toggle;
}
function createDropDownControl(currentValue, id, name, values, args) {
    args = args || {};
    let option = $(`<div style="display:flex;" id="${id}_dropdown"></div>`);
    let label = $(`<span class="has-text-warning" style="width:12rem;">${name}:</span>`);
    if (args.toolTip !== undefined) {
        label.addClass(toolTipClass);
        label.attr('data-label', args.toolTip);
    }
    option.append(label);
    let decision = $(`<select style="width:12rem;"></select>`);
    for (let val in values) {
        decision.append($(`<option value="${val}">${values[val]}</option>`));
    }
    decision[0].value = settings[id];
    decision[0].onchange = function(){
        settings[id] = decision[0].value;
        console.log(`Changing ${id} to ${settings[id]}`);
        updateSettings();
        if (args.onChange !== undefined) {
            args.onChange(decision[0].value);
        }
    };
    option.append(decision);
    return option;
}
function createCheckBoxControl(currentValue, id, name, args) {
    args = args || {};
    let checkBox = $(`
    <label class="b-checkbox checkbox" id="${id}">
    <input type="checkbox" true-value="Yes" false-value="No" value="false">
    <span class="check is-dark"></span>
    <span class="control-label">${name}</span>
    </label>`);
    if (args.toolTip !== undefined) {
        checkBox.addClass(toolTipClass);
        checkBox.attr("data-label", args.toolTip);
    }
    let setting = settings;
    if (args.hasOwnProperty('path')) {
        setting = args.path[0];
        for (let i = 1;i < args.path.length-1;i++) {
            setting = setting[args.path[i]];
        }
        id = args.path[args.path.length-1];
    }
    checkBox.children('input').on('click', function(e){
        if (e.which != 1) {return;}
        let input = e.currentTarget;
        let state = !(input.getAttribute('value') === "true");
        input.setAttribute('value', state);
        setting[id] = state;
        console.log("Setting", id, "to", state);
        updateSettings();
        if (state && args.enabledCallBack !== undefined){
            args.enabledCallBack();
        } else if(args.disabledCallBack !== undefined){
            args.disabledCallBack()
        }
    });
    if(setting[id]){
        setTimeout( function() {
            console.log("Setting initially to true");
            checkBox.children('span.check').click();
            checkBox.children('input').attr('value', true);
        }, 1000);
    }
    return checkBox;
}
function createInputControl(currentValue, id, name, args) {
    args = args || {};
    let div = $(`<div style="display:flex" id="${id}_input"></div>`);
    let label = $(`<span class="has-text-warning" style="width:12rem;">${name}:</span>`);
    if (args.toolTip !== undefined) {
        label.addClass(toolTipClass);
        label.attr('data-label', args.toolTip);
    }
    div.append(label);
    let input = $(`<input type="text" class="input is-small" style="width:10rem;"/>`);
    div.append(input);
    let setting = settings;
    if (args.hasOwnProperty('path')) {
        setting = args.path[0];
        for (let i = 1;i < args.path.length-1;i++) {
            setting = setting[args.path[i]];
        }
        id = args.path[args.path.length-1];
    }
    input.val(currentValue);
    let setBtn = $(`<a class="button is-dark is-small" id="${id}_input_set" style="width:2rem;"><span>Set</span></a>`);
    div.append(setBtn);
    setBtn.on('click', function(e) {
        if (e.which != 1) {return;}
        let val = input.val();
        // Converting input
        if (args.convertFunc !== undefined) {val = args.convertFunc(val);}
        if (val === null) {input.val(setting[id]);return;}
        console.log(`Setting input ${name} to ${val}`);
        setting[id] = val;
        input.val(val);
        updateSettings();
        // CallBack function
        if (args.setFunc !== undefined) {args.setFunc(setting.id);}
    });
    return div;
}

export function updateUI(){
    if ($('.as-autolog').length == 0) {
        createAutoLog();
    }
    if ($('#autoSettingTab').length == 0) {
        createSettingTab();
    }
    if (settings.autoStorage && $('.as-storage-settings').length == 0) {
        createStorageSettings();
    }
    if (settings.autoEmploy && $('.as-employ-settings').length == 0) {
        createEmploySettings();
    }
    if (settings.autoMarket && $('.as-market-settings').length == 0) {
        createMarketSettings();
    }
    if (settings.autoTrade && $('.as-trade-settings').length == 0) {
        createTradeSettings();
    }
    if ($('#autoSettings').length == 0) {
        createAutoSettings();
    }
    if ($('#as-watermark').length == 0) {
        createScriptWatermark();
    }
}

export function resetUI() {
    console.log("Resetting UI");
    removeStorageSettings();
    removeMarketSettings();
    removeTradeSettings();
    removeEmploySettings();
    $('.as-autolog').remove();
    $('.as-settings').remove();
    $('#autoSettings').remove();
}

function createAutoSettings() {
    let parent = getTab("Settings");
    parent.append($('<br></br>')[0]);
    let mainDiv = $('<div id="autoSettings"></div>');
    let label = $('<label class="label">Import/Export Auto Settings</label>');
    let ctrlDiv = $('<div class="control is-clearfix"></div>');
    let textArea = $('<textarea id="settingsImportExport" class="textarea"></textarea>');
    ctrlDiv.append(textArea);
    let control = $('<div class="field"></div>');
    control.append(label).append(ctrlDiv);
    let importBtn = $('<button class="button">Import Settings</button><text> </text>');
    importBtn.on('click', function(e) {
        if (e.which != 1) {return;}
        importSettings();
    });
    let exportBtn = $('<button class="button">Export Settings</button>');
    exportBtn.on('click', function(e) {
        if (e.which != 1) {return;}
        exportSettings();
    });
    mainDiv.append(control).append(importBtn).append(exportBtn);
    parent.append(mainDiv[0]);
}

function createStorageSetting(id) {
    if (!resources[id].unlocked) {return;}
    if (!resources[id].crateable) {return;}
    let resourceSpan = $('#stack-'+resources[id].id);
    let div = $('<div class="as-storage-settings" style="display:flex"></div>');
    let prioritySub = function(mult) {
        resources[id].decStorePriority(mult);
        loadStorageUI();
        return resources[id].storePriority;
    }
    let priorityAdd = function(mult) {
        resources[id].incStorePriority(mult);
        loadStorageUI();
        return resources[id].storePriority;
    }
    let priorityControls = createNumControl(resources[id].storePriority, id+"-store-priority", prioritySub, priorityAdd);
    div.append(priorityControls)

    let minSub = function(mult) {
        resources[id].decStoreMin(mult);
        loadStorageUI();
        return resources[id].storeMin;
    }
    let minAdd = function(mult) {
        resources[id].incStoreMin(mult);
        loadStorageUI();
        return resources[id].storeMin;
    }
    let minControls = createNumControl(resources[id].storeMin, id+"-store-min", minSub, minAdd);
    div.append(minControls)

    let maxSub = function(mult) {
        resources[id].decStoreMax(mult);
        loadStorageUI();
        return resources[id].storeMax;
    }
    let maxAdd = function(mult) {
        resources[id].incStoreMax(mult);
        loadStorageUI();
        return resources[id].storeMax;
    }
    let maxControls = createNumControl(resources[id].storeMax, id+"-store-max", maxSub, maxAdd);
    div.append(maxControls);

    resourceSpan.append(div);
}
function createStorageSettings() {
    // Don't render if haven't researched crates
    if (!researched('tech-containerization')) {return;}
    removeStorageSettings();
    // Creating labels
    let labelSpan = $('#createHead');
    let prioLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:2rem"><span class="has-text-warning">Priority</span></div>');
    let minLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:3rem"><span class="has-text-warning">Min</span></div>');
    let maxLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:3rem"><span class="has-text-warning">Max</span></div>');
    labelSpan.append(prioLabel).append(minLabel).append(maxLabel);
    // Creating individual counters
    for (var x in resources) {
        createStorageSetting(x);
    }
}
function removeStorageSettings() {
    $('.as-storage-settings').remove();
}

function createMarketSetting(resource){
    let marketDiv = $(`<div style="display:flex;" class="as-market-settings as-market-${resource.id}"></div>`);

    let manualBuy = $('<div style="display:flex;"></div>');
    marketDiv.append(manualBuy);
    let buyToggleOnChange = function(state) {
        let sellToggle = $(`#${resource.id}-autoSell_toggle`);
        let otherState = sellToggle.children('input').attr('value') === 'true';
        if(state && otherState){
            sellToggle.click();
            console.log("Turning off sellToggle");
            resource.autoSell = false;
            sellToggle.children('input')[0].setAttribute('value',false);
        }
        loadTradeUI();
    }
    let buyToggle = createToggleControl(resource.id+'-autoBuy', '', {path:[resources, resource.id, 'autoBuy'],small:true,onChange:buyToggleOnChange});
    manualBuy.append(buyToggle);

    let buyRatioSub = function(mult) {
        resource.buyDec(mult);
        loadTradeUI();
        return resource.buyRatio;
    }
    let buyRatioAdd = function(mult) {
        resource.buyInc(mult);
        loadTradeUI();
        return resource.buyRatio;
    }
    let buyRatioControl = createNumControl(resource.buyRatio, resource.id+'-buy-ratio',buyRatioSub,buyRatioAdd);
    manualBuy.append(buyRatioControl);

    let manualSell = $('<div style="display:flex;"></div>');
    marketDiv.append(manualSell);
    let sellToggleOnChange = function(state) {
        let buyToggle = $(`#${resource.id}-autoBuy_toggle`);
        let otherState = buyToggle.children('input').attr('value') === 'true';
        if(state && otherState){
            buyToggle.click();
            console.log("Turning off buyToggle");
            resource.autoBuy = false;
            buyToggle.children('input')[0].setAttribute('value',false);
        }
        loadTradeUI();
    }
    let sellToggle = createToggleControl(resource.id+'-autoSell', '', {path:[resources, resource.id, 'autoSell'],small:true,onChange:sellToggleOnChange});
    manualSell.append(sellToggle);

    let sellRatioSub = function(mult) {
        resource.sellDec(mult);
        loadTradeUI();
        return resource.sellRatio;
    }
    let sellRatioAdd = function(mult) {
        resource.sellInc(mult);
        loadTradeUI();
        return resource.sellRatio;
    }
    let sellRatioControl = createNumControl(resource.sellRatio, resource.id+'-sell-ratio',sellRatioSub,sellRatioAdd);
    manualSell.append(sellRatioControl);

    return [marketDiv, manualBuy, manualSell];
}
function createMarketSettings(){
    // Don't render if haven't researched markets
    if (!researched('tech-market')) {return;}
    removeMarketSettings();
    let mainDiv = document.getElementById('market');
    mainDiv.insertBefore($('<div class="as-market-settings"><br></div>')[0],mainDiv.children[1]);
    let firstRow = false;
    // Creating settings for TradeableResources
    for (var x in resources) {
        if (!(resources[x] instanceof TradeableResource)) {continue;}
        let [marketDiv, manualBuy, manualSell] = createMarketSetting(resources[x]);
        if (!firstRow) {
            firstRow = true;
            let buyLabel = $('<div style="position:absolute;top:1.5rem;"><span>Manual Buy</span></div>');
            manualBuy.prepend(buyLabel[0]);
            let sellLabel = $('<div style="position:absolute;top:1.5rem;"><span>Manual Sell</span></div>');
            manualSell.prepend(sellLabel[0]);
        }
        let marketRow = $('#market-'+resources[x].id);
        marketRow.append(marketDiv);
    }
}
function removeMarketSettings(){
    $('.as-market-settings').remove();
}

function createTradeSetting(resource) {
    let marketDiv = $(`<div style="display:flex;" class="as-trade-settings as-trade-${resource.id}"></div>`);

    let prioritySub = function(mult) {
        resource.decBasePriority(mult);
        loadTradeUI();
        return resource.basePriority;
    }
    let priorityAdd = function(mult) {
        resource.incBasePriority(mult);
        loadTradeUI();
        return resource.basePriority;
    }
    let priorityControl = createNumControl(resource.basePriority, resource.id+'-trade-priority',prioritySub,priorityAdd);
    marketDiv.append(priorityControl);

    return [marketDiv, priorityControl];
}
function createTradeSettings() {
    // Don't render if haven't researched markets
    if (!researched('tech-trade')) {return;}
    removeTradeSettings();
    let mainDiv = document.getElementById('market');
    if ($('.as-market-settings > br').length == 0) {
        mainDiv.insertBefore($('<div class="as-trade-settings"><br></div>')[0],mainDiv.children[1]);
    }
    let firstRow = false;
    let lastRow = null;
    // Creating settings for TradeableResources
    for (var x in resources) {
        if (!(resources[x] instanceof TradeableResource)) {continue;}
        let [marketDiv, tradeControl] = createTradeSetting(resources[x]);
        if (!firstRow) {
            firstRow = true;
            let tradeLabel = $('<div style="position:absolute;top:1.5rem;"><span>Trade</span></div>');
            tradeControl.prepend(tradeLabel[0]);
        }
        let marketRow = $('#market-'+resources[x].id);
        marketRow.append(marketDiv);
        if (marketRow[0].style.display != 'none') {lastRow = [tradeControl, marketDiv, marketRow];}
    }

    // Creating trade setting for money
    let tradeRow = document.getElementById("tradeTotal");
    let moneyLabel = $('<div style="position:absolute;bottom:4rem;width:5.25rem;text-align:center;"><span>$$$</span></div>');
    lastRow[0].prepend(moneyLabel);
    let priorityDiv = $('<div style="position:absolute;bottom:3rem;width:5.25rem;text-align:center;"</div>');
    let prioritySub = function(mult) {
        resources.Money.decBasePriority(mult);
        loadTradeUI();
        return resources.Money.basePriority;
    }
    let priorityAdd = function(mult) {
        resources.Money.incBasePriority(mult);
        loadTradeUI();
        return resources.Money.basePriority;
    }
    let priorityControl = createNumControl(resources.Money.basePriority,"Money-trade-priority",prioritySub,priorityAdd);
    priorityDiv.append(priorityControl);
    lastRow[0].prepend(priorityDiv[0]);
}
function removeTradeSettings() {
    $('.as-trade-settings').remove();
}

function createEjectorSetting(resource) {

}
function createEjectorSettings() {
    // Don't render if haven't unlocked mass ejectors
    if (!window.evolve.global.interstellar.hasOwnProperty('mass_ejector')) {return;}
    if (window.evolve.global.interstellar.mass_ejector.count == 0) {return;}
    removeEjectorSettings();

}
function removeEjectorSettings() {
    $('.as-ejector-settings').remove();
}

function createEmploySettings() {
    removeEmploySettings();
    for (var x in jobs) {
        let job = jobs[x];
        if (!job.unlocked) {continue;}
        let prioritySub = function(mult) {
            job.lowerPriority(mult);
            loadEmployUI();
            return job._priority;
        }
        let priorityAdd = function(mult) {
            job.higherPriority(mult);
            loadEmployUI();
            return job._priority;
        }
        let priorityControl = createNumControl(job._priority, job.id+'-priority',prioritySub,priorityAdd);
        if (job.id != "free" || job.name == 'Hunter') {
            if (job.id == "craftsman") {
                let parent = $('#foundry > .job > .foundry').parent();
                let div = $('<div class="foundry as-employ-settings" style="text-align:right;margin-left:4.5rem"></div>');
                parent.append(div);
                div.append(priorityControl);
                //parent.append(priorityControl);
            } else if (job.id == 'free') {
                let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:4.5rem"></div>');
                $('#civ-'+job.id).append(div);
                div.append(priorityControl);
            }else {
                let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:1.25rem"></div>');
                $('#civ-'+job.id).append(div);
                div.append(priorityControl);
            }

        } else {
            let parent = document.getElementById("civ-"+job.id);
            let priorityLabel = $('<span class="has-text-warning as-employ-settings" style="text-align:right;min-width:9.25rem">Priority</span>');
            $('#civ-'+job.id).append(priorityLabel);
        }
    }

    for (x in craftJobs) {
        let cjob = craftJobs[x];
        if (!cjob.unlocked) {continue;}
        let prioritySub = function(mult) {
            cjob.lowerPriority(mult);
            loadEmployUI();
            return cjob._priority;
        }
        let priorityAdd = function(mult) {
            cjob.higherPriority(mult);
            loadEmployUI();
            return cjob._priority;
        }
        let priorityControl = createNumControl(cjob._priority, cjob.id+'-priority',prioritySub,priorityAdd);
        let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:1.25rem">');
        div.append(priorityControl);
        $('#craft'+cjob.id).parent().append(div);
    }

}
function removeEmploySettings() {
    $('.as-employ-settings').remove();
}

function createAutoSettingPage(name, labelElm, contentElm) {
    let label = $('<li class="as-settings"><a><span>'+name+'</span></a></li>');
    let tab = $('<div id="'+name+'_setting_tab'+'" class="tab-item as-settings" style="display:none;margin-left:1rem;"><h2 class="is-sr-only">'+name+'</h2></div>');
    label.on('click',function(e) {
        if (e.which != 1) {return;}
        for (let i = 0;i < labelElm.children().length;i++) {
            let tabLabel = labelElm.children()[i];
            let tabItem = contentElm.children()[i];
            if (tabLabel.classList.contains("is-active")) {
                tabLabel.classList.remove("is-active");
                tabItem.style.display = 'none';
            }
        }
        label.addClass("is-active");
        tab[0].style.display = '';
    });
    labelElm.append(label);
    contentElm.append(tab);
    return tab;
}
function createSettingTab() {
    let settingTabLabel = $('<li class="as-settings"><a><span>Auto Settings</span></a></li>');
    let settingTab = $('<div id="autoSettingTab" class="tab-item as-settings" style="display:none"><h2 class="is-sr-only">Auto Settings</h2></div>');
    // Creating click functions for other tabs
    for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
        let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
        let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
        tabLabel.on('click',function(e) {
            if (e.which != 1) {return;}
            if (settingTabLabel.hasClass("is-active")) {
                settingTabLabel.removeClass("is-active");
                tabItem.style.display = '';
            }
            settingTab[0].style.display = 'none';
            if (!tabLabel.hasClass("is-active")) {tabLabel.addClass("is-active");}
        });
    }
    $('#mainColumn > .content > .b-tabs > .tabs > ul').append(settingTabLabel);
    $('#mainColumn > .content > .b-tabs > .tab-content').append(settingTab);
    settingTabLabel.on('click',function(e) {
        if (e.which != 1) {return;}
        // For every other tab
        for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length-1;i++) {
            let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
            let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
            tabLabel.removeClass("is-active");
            tabItem.style.display = 'none';
        }
        settingTabLabel.addClass("is-active");
        settingTab[0].style.display = '';
    });

    let tabDiv = $('<div class="b-tabs resTabs"></div>');
    let nav = $('<nav class="tabs"></nav>');
    tabDiv.append(nav);
    let section = $('<section class="tab-content"></section>');
    tabDiv.append(section);
    let ul = $('<ul></ul>');
    nav.append(ul);
    settingTab.append(tabDiv);

    let generalTab = createAutoSettingPage("General", ul, section);
    createAutoSettingGeneralPage(generalTab);
    let evolutionTab = createAutoSettingPage("Evolution", ul, section);
    createAutoSettingEvolutionPage(evolutionTab);
    if (!inEvolution()) {
        let jobTab = createAutoSettingPage("Jobs/Army", ul, section);
        createAutoSettingJobPage(jobTab);
        let govTab = createAutoSettingPage("Government", ul, section);
        createAutoSettingGovPage(govTab);
        let resourceTab = createAutoSettingPage("Resources", ul, section);
        createAutoSettingResourcePage(resourceTab);
        let buildingTab = createAutoSettingPage("Buildings", ul, section);
        createAutoSettingBuildingPage(buildingTab);
        let researchTab = createAutoSettingPage("Research", ul, section);
        createAutoSettingResearchPage(researchTab);
        let priorityTab = createAutoSettingPage("Priority", ul, section);
        createAutoSettingPriorityPage(priorityTab);
    }
}
function createAutoSettingToggle(id, name, description, hasContent, tab, enabledCallBack, disabledCallBack) {
    tab.append($('<br></br>'));
    let settingDiv = $(`<div id=as-${id}-title></div>`)
    tab.append(settingDiv)
    let titleDiv = $('<div style="display:flex;justify-content:space-between;"></div>');
    settingDiv.append(titleDiv);
    let toggle = createToggleControl(id, name, {enabledCallBack:enabledCallBack, disabledCallBack:disabledCallBack});
    titleDiv.append(toggle);
    let details = $(`<span>${description}</span>`);
    settingDiv.append(details);
    let content = null;
    if (hasContent) {
        let contentId = 'as-' + id + '-content';
        let style = 'margin-left:0.5em;overflow:hidden;max-height:0;transition:max-height 0.2s ease-out;'
        content = $(`<div style="${style}" id="${contentId}"></div>`);
        tab.append(content);
        content.append($('<br></br>'));
        let btn = $(`<div class="sub" style="position:absolute;left:0px;width:1.5rem;height:25px;">+</button>`);
        settingDiv.prepend(btn);
        btn.on('click', function(e) {
            if (content[0].style.maxHeight != '0px'){
              content[0].style.maxHeight = '0px';
              btn[0].innerText = '+';
              content[0].style.overflow = 'hidden';
            } else {
              content[0].style.maxHeight = content[0].scrollHeight + 'px';
              btn[0].innerText = '-';
              content[0].style.overflow = '';
            }
        });
    }
    return [titleDiv, content];
}

function createAutoSettingGeneralPage(tab) {

    // Auto Print
    let autoPrintDesc = 'Prints out script details in the script printing window. Currently only action details are implemented. Toggle to ignore certain actions from appearing in the message queue.';
    let [autoPrintTitle, autoPrintContent] = createAutoSettingToggle('autoPrint', 'Auto Print', autoPrintDesc, true, tab);

    let printOption = $('<div style="display:flex;"></div>');
    autoPrintContent.append(printOption);
    let printToolTip = 'Checking these will send the print messages to the script message queue.';
    printOption.append($(`<div><span class="has-text-warning ${toolTipClass}" style="width:12rem;" data-label="${printToolTip}">Print Settings:</span></div>`));
    let printToggles = $('<div></div>');
    printOption.append(printToggles);
    for (let i = 0;i < printSettings.length;i++) {
        let toggleVal = settings.printSettings[printSettings[i]];
        let toggleId = printSettings[i];
        let str = evoChallengeActions[i].split('-')[1];
        let toggleName = printSettings[i];
        let toggle = createCheckBoxControl(toggleVal, toggleId, toggleName, {path:[settings, 'printSettings', toggleId]});
        let toggleDiv = $('<div></div>');
        toggleDiv.append(toggle);
        printToggles.append(toggleDiv);
    }

    // Auto Farm
    let autoFarmDesc = 'Auto-clicks the manual farming buttons that exist on the screen. If the buttons are not being auto-clicked, try reloading the UI. Defaults to click at 100/s (10 ms).';
    let [autoFarmTitle, autoFarmContent] = createAutoSettingToggle('autoFarm', 'Auto Farm', autoFarmDesc, true, tab);

    let farmToolTip = 'Determines how fast the manual buttons will be clicked (every # milliseconds)';
    let convertFunc = function(val) {
        if (isNaN(val)) {return null;}
        val = parseInt(val);
        if (val <= 0) {return null;}
        return val;
    }
    let setFunc = function(val) {
        // Clearing farmInterval to refresh with new farm rate
        if (farmInterval !== null) {
            clearInterval(farmInterval);
            farmInterval = null;
        }
    }
    let farmRateInput = createInputControl(settings.farmRate, 'farmRate', 'Farm Rate', {convertFunc:convertFunc,setFunc:setFunc,toolTip:farmToolTip});
    autoFarmContent.append(farmRateInput);

    // Auto Refresh
    let autoRefreshDesc = 'Automatically reloads the page every 200 seconds. This setting was made due to the modal windows lagging after too many launches. Refreshing will remove this lag.';
    let [autoRefreshTitle, autoRefreshContent] = createAutoSettingToggle('autoRefresh', 'Auto Refresh', autoRefreshDesc, false, tab);
    let reloadBtnDetails = 'Resets the UI and reloads the backend variables.';
    let reloadBtn = $(`<div role="button" class="is-primary is-bottom is-small b-tooltip is-animated is-multiline" data-label="${reloadBtnDetails}"><button class="button is-primary"><span>Reset UI</span></button></div>`);
    reloadBtn.on('click', function(e){
        if (e.which != 1) {return;}
        resetUI();
        updateSettings();
        loadSettings();
    });
    autoRefreshTitle.append(reloadBtn);

    // Auto Prestige
    let autoPrestigeDesc = 'Automatically prestiges when the options are availible. Maybe will add min prestige resource gain setting if wanted.';
    let [autoPrestigeTitle, autoPrestigeContent] = createAutoSettingToggle('autoPrestige', 'Auto Prestige', autoPrestigeDesc, true, tab);

    let prestige = createDropDownControl(settings.prestige, 'prestige', 'Prestige Choice', {mad:'MAD',bioseed:'Bioseed',blackhole:'Blackhole'});
    autoPrestigeContent.append(prestige);

    // Advanced
}

function createAutoSettingEvolutionPage(tab) {

    // Auto Evolution/Challenge
    let autoEvolutionDesc = 'Automatically plays the Evolution stage. It will buy the mininum amount of RNA/DNA storage for evolving, as well as automatically purchase challenges.';
    let [autoEvolutionTitle, autoEvolutionContent] = createAutoSettingToggle('autoEvolution', 'Auto Evolution', autoEvolutionDesc, true, tab);

    let raceValues = {};
    for (let race in window.evolve.races) {
        if (race == 'protoplasm' || race == 'junker') {continue;}
        raceValues[race] = window.evolve.races[race].name;
    }
    let raceOption = createDropDownControl(settings.evolution, 'evolution', 'Evolution Decision', raceValues);
    autoEvolutionContent.append(raceOption);
    autoEvolutionContent.append($('<br></br>'));

    let challengeOption = $('<div style="display:flex;"></div>');
    autoEvolutionContent.append(challengeOption);
    challengeOption.append($('<h3 class="has-text-warning" style="width:12rem;">Challenges:</h3>'));
    let challengeToggles = $('<div></div>');
    challengeOption.append(challengeToggles);
    for (let i = 0;i < evoChallengeActions.length;i++) {
        let toggleVal = settings[evoChallengeActions[i]];
        let toggleId = evoChallengeActions[i];
        let str = evoChallengeActions[i].split('-')[1];
        let toggleName = str.charAt(0).toUpperCase() + str.slice(1);
        let toggle = createCheckBoxControl(toggleVal, toggleId+'_checkbox', toggleName, {path:[settings, toggleId]});
        let toggleDiv = $('<div></div>');
        toggleDiv.append(toggle);
        challengeToggles.append(toggleDiv);
    }
}

function loadEmployUI(content) {
    if (content === null || content == undefined) {content = $('#as-autoEmploy-content');}
    $('.as-employui').remove();
    let i = 0;
    let labelDiv = $('<div style="display:flex" class="alt market-item as-employui"></div>');
    content.append(labelDiv);
    let jobLabel = $('<span class="has-text-warning" style="width:12rem;">Job</span>');
    labelDiv.append(jobLabel);
    let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
    labelDiv.append(priorityLabel);

    for (let x in jobs) {
        let id = x;
        let div = null;
        i += 1;
        if (i % 2) {
            div = $('<div style="display:flex" class="market-item as-employui"></div>');
        } else {
            div = $('<div style="display:flex" class="alt market-item as-employui"></div>');
        }
        content.append(div);

        // Setting Hunter priority
        let name = (x == 'free') ? 'Hunter' : jobs[x].name;
        let label = $(`<span class="has-text-info" style="width:12rem;">${name}</h3>`);
        div.append(label);

        let priorityDiv = $('<div style="width:12rem;"></div>');
        div.append(priorityDiv);
        let prioritySub = function(mult) {
            jobs[id].lowerPriority(mult);
            createEmploySettings();
            return jobs[id]._priority;
        }
        let priorityAdd = function(mult) {
            jobs[id].higherPriority(mult);
            createEmploySettings();
            return jobs[id]._priority;
        }
        let priorityControl = createNumControl(jobs[id]._priority, jobs[id].id+'_priority',prioritySub,priorityAdd);
        priorityDiv.append(priorityControl);
    }
    for (let x in craftJobs) {
        let id = x;
        let div = null;
        i += 1;
        if (i % 2) {
            div = $('<div style="display:flex" class="market-item as-employui"></div>');
        } else {
            div = $('<div style="display:flex" class="alt market-item as-employui"></div>');
        }
        content.append(div);

        let label = $(`<span class="has-text-danger" style="width:12rem;">${craftJobs[x].name}</h3>`);
        div.append(label);

        let priorityDiv = $('<div style="width:12rem;"></div>');
        div.append(priorityDiv);
        let prioritySub = function(mult) {
            craftJobs[id].lowerPriority(mult);
            createEmploySettings();
            return craftJobs[id]._priority;
        }
        let priorityAdd = function(mult) {
            craftJobs[id].higherPriority(mult);
            createEmploySettings();
            return craftJobs[id]._priority;
        }
        let priorityControl = createNumControl(craftJobs[id]._priority, craftJobs[id].id+'_priority',prioritySub,priorityAdd);
        priorityDiv.append(priorityControl);
    }
}
function loadBattleUI(content) {

    // FirstDiv contains Max Campaign and Check Unwounded

    let firstDiv = $('<div style="display:flex;"></div>');
    content.append(firstDiv);

    let maxCampaignOptions = {0:'Ambush',1:'Raid',2:'Pillage',3:'Assault',4:'Siege'};
    let maxCampaignOption = createDropDownControl(settings.maxCampaign, 'maxCampaign', 'Max Campaign', maxCampaignOptions);
    firstDiv.append(maxCampaignOption);

    firstDiv.append($('<div style="width:6rem;"></div>'));

    let woundedCheckToolTip = 'Enable to stop running campaigns if there are wounded soldiers. Disable to run campaigns as soon as there are enough healthy soldiers to fight. Disabling causes more lag due to the algorithm running continously.';
    let woundedCheck = createCheckBoxControl(settings.woundedCheck, 'woundedCheck', "Check Wounded", {toolTip:woundedCheckToolTip});
    firstDiv.append(woundedCheck);

    content.append($('<br></br>'));

    // Minimum Win Rate

    let convertFunc = function(val) {
        if (isNaN(val)) {return null;}
        val = parseFloat(val);
        if (val < 0 || val > 100) {return null;}
        return val;
    }
    let minWinRateInput = createInputControl(settings.minWinRate, 'minWinRate', 'Minimum Win Rate', {convertFunc:convertFunc});
    content.append(minWinRateInput);
    content.append($('<br></br>'));

    // SecondDiv contains Campaign Fail Interval and Campaign Fail Check

    let secondDiv = $('<div style="display:flex;"></div>');
    content.append(secondDiv);

    let campaignFailIntervalInputToolTip = 'Sets the time in seconds to wait after a failed campaign check.';
    convertFunc = function(val) {
        if (isNaN(val)) {return null;}
        val = parseFloat(val);
        if (val < 0) {return null;}
        return val;
    }
    let campaignFailIntervalInput = createInputControl(settings.campaignFailInterval, 'campaignFailInterval', 'Campaign Fail Interval', {convertFunc:convertFunc,toolTip:campaignFailIntervalInputToolTip});
    secondDiv.append(campaignFailIntervalInput);

    secondDiv.append($('<div style="width:6rem;"></div>'));

    let campaignFailCheckStr = 'Enable to stop Auto Battle for an time if the campaign algorithm fails. This is to stop infinite loops when the algorithm cannot find a optimal battle.';
    let campaignFailCheck = createCheckBoxControl(settings.campaignFailCheck, 'campaignFailCheck', "Fail Check", {toolTip:campaignFailCheckStr});
    secondDiv.append(campaignFailCheck);
}
function createAutoSettingJobPage(tab) {

    // Auto Employ
    let autoEmployDesc = 'Allocates the population to jobs. May add min/max settings later on.';
    let [autoEmployTitle, autoEmployContent] = createAutoSettingToggle('autoEmploy', 'Auto Employ', autoEmployDesc, true, tab, createEmploySettings, removeEmploySettings);
    loadEmployUI(autoEmployContent);

    // Auto Battle
    let autoBattleDesc = 'Automatically runs battle campaigns. Will choose the highest campaign that allows for the minimum win rate. You can limit the highest campaign as well, as Siege is always less efficient.';
    let [autoBattleTitle, autoBattleContent] = createAutoSettingToggle('autoBattle', 'Auto Battle', autoBattleDesc, true, tab);
    loadBattleUI(autoBattleContent);

    // Auto Fortress
    let autoFortressDesc = 'Manages soldier allocation in the fortress. Currently not yet implemented.';
    let [autoFortressTitle, autoFortressContent] = createAutoSettingToggle('autoFortress', 'Auto Fortress', autoFortressDesc, true, tab);
}

function createAutoSettingGovPage(tab) {

    // Auto Tax
    let autoTaxDesc = 'Manages the tax rate for optimal morale and taxes.';
    let [autoTaxTitle, autoTaxContent] = createAutoSettingToggle('autoTax', 'Auto Tax', autoTaxDesc, true, tab);

    let minMoraleDiv = $('<div style="display:flex;"></div>');
    autoTaxContent.append(minMoraleDiv);
    let minMoraleTxt = $('<span class="has-text-warning" style="width:12rem;">Minimum Morale:</span>')
    minMoraleDiv.append(minMoraleTxt);

    let minMoraleSub = function(mult) {
        settings.minimumMorale -= mult;
        if (settings.minimumMorale < 50) {settings.minimumMorale = 50;}
        return settings.minimumMorale;
    }
    let minMoraleAdd = function(mult) {
        settings.minimumMorale += mult;
        return settings.minimumMorale;
    }
    let minMoraleControl = createNumControl(settings.minimumMorale, "minimum_morale", minMoraleSub, minMoraleAdd);
    minMoraleDiv.append(minMoraleControl);

    // Auto Government
    let autoGovDesc = 'Manages changing government types. Will choose the highest priority government type available.';
    let [autoGovTitle, autoGovContent] = createAutoSettingToggle('autoGovernment', 'Auto Government', autoGovDesc, true, tab);

    // Government Priority
    let labelDiv = $('<div style="display:flex" class="alt market-item"></div>');
    autoGovContent.append(labelDiv);
    let govLabel = $('<span class="has-text-warning" style="width:12rem;">Government Types:</span>');
    labelDiv.append(govLabel);
    let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
    labelDiv.append(priorityLabel);
    for (let i = 0;i < governments.length;i++) {
        let gov = governments[i];
        let div = null;
        if (i % 2) {
            div = $('<div style="display:flex" class="alt market-item"></div>');
        } else {
            div = $('<div style="display:flex" class="market-item"></div>');
        }
        autoGovContent.append(div);

        let label = $(`<span class="has-text-danger" style="width:12rem;">${gov}</span>`);
        div.append(label);

        let prioDec = function(mult) {
            settings.government[gov].priority -= mult;
            if (settings.government[gov].priority < 0) {settings.government[gov].priority = 0;}
            return settings.government[gov].priority;
        }
        let prioInc = function(mult) {
            settings.government[gov].priority += mult;
            return settings.government[gov].priority;
        }
        let value = settings.government[gov].priority;
        let prioControls = createNumControl(value,gov+"_priority",prioDec,prioInc);
        div.append(prioControls);
    }

    // Auto Unification

    let autoUniDesc = 'Manages spies for unification. Automatically purchases the research as well when available.';
    let [autoUniTitle, autoUniContent] = createAutoSettingToggle('autoUnification', 'Auto Unification', autoUniDesc, true, tab);

    let optionToolTips = {};
    optionToolTips['reject'] = 'Does not do any espionage, and automatically rejects unity';
    optionToolTips['conquest'] = 'Always sabotages and begins sieges when available.';
    optionToolTips['money'] = 'Does no espionage.';
    optionToolTips['morale'] = 'Always influences until max relations, then incites.';
    let unify = createDropDownControl(settings.unification, 'unification', 'Unification', {reject:'Reject Unity',conquest:'Conquest',morale:'Cultural Supremacy',money:'Buy the World'}, {optionToolTips:optionToolTips});
    autoUniContent.append(unify);
}

function loadTradeUI(content) {
    if (content === null || content == undefined) {content = $('#as-autoTrade-content');}
    $('.as-tradeui').remove();
    let i = 0;
    let labelDiv = $('<div style="display:flex" class="alt market-item as-tradeui"></div>');
    content.append(labelDiv);
    let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Tradeable Resource</h3>');
    labelDiv.append(resourceLabel);
    let buyLabel = $('<span class="has-text-warning" style="width:12rem;">Manual Buy</h3>');
    labelDiv.append(buyLabel);
    let sellLabel = $('<span class="has-text-warning" style="width:12rem;">Manual Sell</h3>');
    labelDiv.append(sellLabel);
    let tradeLabel = $('<span class="has-text-warning" style="width:12rem;">Trade Priority</h3>');
    labelDiv.append(tradeLabel);
    i += 1;
    let moneyDiv = $('<div style="display:flex" class="market-item as-tradeui"></div>');
    content.append(moneyDiv);
    let moneyLabel = $('<span class="has-text-advanced" style="width:12rem;">Money</span>');
    moneyDiv.append(moneyLabel);
    let padding = $('<div style="width:24rem;"></div>');
    moneyDiv.append(padding);
    let moneyPrioritySub = function(mult) {
        resources['Money'].decBasePriority(mult);
        createMarketSettings();
        return resources['Money'].basePriority;
    }
    let moneyPriorityAdd = function(mult) {
        resources['Money'].incBasePriority(mult);
        createMarketSettings();
        return resources['Money'].basePriority;
    }
    let moneyPriorityControl = createNumControl(resources['Money'].basePriority, resources['Money'].id+'_priority',moneyPrioritySub,moneyPriorityAdd);
    moneyDiv.append(moneyPriorityControl);
    for (var x in resources) {
        if (!(resources[x] instanceof TradeableResource)) {continue;}
        let id = x;
        let div = null;
        i += 1;
        if (i % 2) {
            div = $('<div style="display:flex" class="market-item as-tradeui"></div>');
        } else {
            div = $('<div style="display:flex" class="alt market-item as-tradeui"></div>');
        }
        content.append(div);

        var label = $(`<span class="has-text-info" style="width:12rem;">${resources[x].name}</h3>`);
        div.append(label);

        let manualBuy = $('<div style="width:12rem;display:flex;"></div>');
        div.append(manualBuy);

        let buyToggleOnChange = function(state) {
            let sellToggle = $(`#${id}_autoSell_toggle`);
            let otherState = sellToggle.children('input').attr('value') === 'true';
            if(state && otherState){
                sellToggle.click();
                console.log("Turning off sellToggle");
                resources[id].autoSell = false;
                sellToggle.children('input')[0].setAttribute('value',false);
            }
            createMarketSettings();
        }
        let buyToggle = createToggleControl(id+'_autoBuy', '', {path:[resources, id, 'autoBuy'],small:true,onChange:buyToggleOnChange});
        manualBuy.append(buyToggle);

        let buyDec = function(mult) {
            resources[id].buyDec(mult);
            createMarketSettings();
            return resources[id].buyRatio;
        }
        let buyInc = function(mult) {
            resources[id].buyInc(mult);
            createMarketSettings();
            return resources[id].buyRatio;
        }
        let buyVal = resources[id].buyRatio;
        let buyControls = createNumControl(buyVal,resources[id].name+"_buy_ratio",buyDec,buyInc);
        manualBuy.append(buyControls);

        let manualSell = $('<div style="width:12rem;display:flex;"></div>');
        div.append(manualSell);

        let sellToggleOnChange = function(state) {
            let buyToggle = $(`#${id}_autoBuy_toggle`);
            let otherState = buyToggle.children('input').attr('value') === 'true';
            if(state && otherState){
                buyToggle.click();
                console.log("Turning off buyToggle");
                resources[id].autoBuy = false;
                buyToggle.children('input')[0].setAttribute('value',false);
            }
            createMarketSettings();
        }
        let sellToggle = createToggleControl(id+'_autoSell', '', {path:[resources, id, 'autoSell'],small:true,onChange:sellToggleOnChange});
        manualSell.append(sellToggle);

        let sellDec = function(mult) {
            resources[id].sellDec(mult);
            createMarketSettings();
            return resources[id].sellRatio;
        }
        let sellInc = function(mult) {
            resources[id].sellInc(mult);
            createMarketSettings();
            return resources[id].sellRatio;
        }
        let sellVal = resources[id].sellRatio;
        let sellControls = createNumControl(sellVal,resources[id].name+"_sell_ratio",sellDec,sellInc);
        manualSell.append(sellControls);

        let prioritySub = function(mult) {
            resources[id].decBasePriority(mult);
            createMarketSettings();
            return resources[id].basePriority;
        }
        let priorityAdd = function(mult) {
            resources[id].incBasePriority(mult);
            createMarketSettings();
            return resources[id].basePriority;
        }
        let priorityControl = createNumControl(resources[id].basePriority, resources[id].id+'_priority',prioritySub,priorityAdd);
        div.append(priorityControl);
    }
}
function loadStorageUI(content) {
    if (content === null || content == undefined) {content = $('#as-autoStorage-content');}
    $('.as-storageui').remove();
    let i = 0;
    let labelDiv = $('<div style="display:flex" class="alt market-item as-storageui"></div>');
    content.append(labelDiv);
    let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Storable Resource</span>');
    labelDiv.append(resourceLabel);
    let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
    labelDiv.append(priorityLabel);
    let minLabel = $('<span class="has-text-warning" style="width:12rem;">Minimum Storage</h3>');
    labelDiv.append(minLabel);
    let maxLabel = $('<span class="has-text-warning" style="width:12rem;">Maximum Storage</h3>');
    labelDiv.append(maxLabel);

    for (var x in resources) {
        let id = x;
        if (!(resources[x].crateable)) {continue;}
        let div = null;
        i += 1;
        if (i % 2) {
            div = $('<div style="display:flex" class="market-item as-storageui"></div>');
        } else {
            div = $('<div style="display:flex" class="alt market-item as-storageui"></div>');
        }
        content.append(div);

        var label = $(`<span class="has-text-info" style="width:12rem;">${resources[x].name}</h3>`);
        div.append(label);

        let storePriorityDiv = $('<div style="width:12rem;"></div>');
        div.append(storePriorityDiv);
        let storePrioritySub = function(mult) {
            resources[id].decStorePriority(mult);
            createStorageSettings();
            return resources[id].storePriority;
        }
        let storePriorityAdd = function(mult) {
            resources[id].incStorePriority(mult);
            createStorageSettings();
            return resources[id].storePriority;
        }
        let storePriorityControl = createNumControl(resources[id].storePriority, resources[id].id+'_store_priority',storePrioritySub,storePriorityAdd);
        storePriorityDiv.append(storePriorityControl);

        let storeMinDiv = $('<div style="width:12rem;"></div>');
        div.append(storeMinDiv);
        let storeMinSub = function(mult) {
            resources[id].decStoreMin(mult);
            createStorageSettings();
            return resources[id].storeMin;
        }
        let storeMinAdd = function(mult) {
            resources[id].incStoreMin(mult);
            createStorageSettings();
            return resources[id].storeMin;
        }
        let storeMinControl = createNumControl(resources[id].storeMin, resources[id].id+'_store_min',storeMinSub,storeMinAdd);
        storeMinDiv.append(storeMinControl);

        let storeMaxDiv = $('<div style="width:12rem;"></div>');
        div.append(storeMaxDiv);
        let storeMaxSub = function(mult) {
            resources[id].decStoreMax(mult);
            createStorageSettings();
            return resources[id].storeMax;
        }
        let storeMaxAdd = function(mult) {
            resources[id].incStoreMax(mult);
            createStorageSettings();
            return resources[id].storeMax;
        }
        let storeMaxControl = createNumControl(resources[id].storeMax, resources[id].id+'_store_max',storeMaxSub,storeMaxAdd);
        storeMaxDiv.append(storeMaxControl);
    }
}
function loadEjectorUI(content) {
    let labelDiv = $('<div style="display:flex" class="alt market-item"></div>');
    content.append(labelDiv);
    let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Ejectable Resource</h3>');
    labelDiv.append(resourceLabel);
    let enableLabel = $('<span class="has-text-warning" style="width:12rem;">Enable</h3>');
    labelDiv.append(enableLabel);
    let i = 0;
    for (var x in resources) {
        if (!(resources[x].ejectable)) {continue;}
        let div = null;
        i += 1;
        if (i % 2) {
            div = $('<div style="display:flex" class="market-item"></div>');
        } else {
            div = $('<div style="display:flex" class="alt market-item"></div>');
        }
        content.append(div);
        let label = $(`<span class="${resources[x].color}" style="width:12rem;">${resources[x].name}</h3>`);
        div.append(label);
        let id = x;
        let toggle = createToggleControl(id+'_eject', '', {path:[resources, id, 'eject'],small:true});
        div.append(toggle);
    }
}
function createAutoSettingResourcePage(tab) {

    // Auto Craft
    let autoCraftDesc = 'Crafts resources if the required resources are above 90% full. Only works when Manual Crafting is enabled (disabled in No Craft challenge).';
    let [autoCraftTitle, autoCraftContent] = createAutoSettingToggle('autoCraft', 'Auto Craft', autoCraftDesc, true, tab);
    let i = 0;
    let labelDiv = $('<div style="display:flex" class="alt market-item"></div>');
    autoCraftContent.append(labelDiv);
    let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Craftable Resource</h3>');
    labelDiv.append(resourceLabel);
    let enableLabel = $('<span class="has-text-warning" style="width:12rem;">Enable</h3>');
    labelDiv.append(enableLabel);
    for (var x in resources) {
        if (!(resources[x] instanceof CraftableResource)) {continue;}
        let div = null;
        i += 1;
        if (i % 2) {
            div = $('<div style="display:flex" class="market-item"></div>');
        } else {
            div = $('<div style="display:flex" class="alt market-item"></div>');
        }
        autoCraftContent.append(div);
        let label = $(`<span class="has-text-danger" style="width:12rem;">${resources[x].name}</h3>`);
        div.append(label);
        let id = x;
        let toggle = createToggleControl(id+'_enabled', '', {path:[resources, id, 'enabled'],small:true});
        div.append(toggle);
    }

    // Auto Market
    let autoMarketDesc = 'Buys/sells resources when they are below/above a certain storage ratio. This also makes sure when buying that the money never goes under the minimum value. Only works when Manual Trading is enabled (disabled in No Trade challenge).';
    let [autoMarketTitle, autoMarketContent] = createAutoSettingToggle('autoMarket', 'Auto Market', autoMarketDesc, true, tab, createMarketSettings, removeMarketSettings);
    let volumeOption = $('<div style="display:flex;"></div>');
    autoMarketContent.append(volumeOption);
    autoMarketContent.append($('<br></br>'));
    let volumeConvert = function(val) {
        val = getRealValue(val);
        if (isNaN(val)) {return null;}
        if (val <= 0) {return 1;}
        if (val > 1000000) {return 1000000;}
        return val;
    }
    let volumeInput = createInputControl(settings.marketVolume, 'marketVolume', 'Market Volume', {convertFunc:volumeConvert});
    volumeOption.append(volumeInput);

    let convertFunc = function(val) {
        val = getRealValue(val);
        if (!isNaN(val)) {
            return val;
        }
        return null;
    }
    let minMoneyInput = createInputControl(settings.minimumMoney, 'minimumMoney', 'Minimum Money', {convertFunc:convertFunc});
    autoMarketContent.append(minMoneyInput);

    // Auto Trade
    let autoTradeDesc = 'Allocates trade routes based on the trade priority (as well as Auto Prioritize).';
    let [autoTradeTitle, autoTradeContent] = createAutoSettingToggle('autoTrade', 'Auto Trade', autoTradeDesc, true, tab, createTradeSettings, removeTradeSettings);
    loadTradeUI(autoTradeContent);

    // Auto Storage
    let autoStorageDesc = 'Allocates crates and containers to resources based on priority. Also has a minimum storage setting for steel and other resources that need initial storage.';
    let [autoStorageTitle, autoStorageContent] = createAutoSettingToggle('autoStorage', 'Auto Storage', autoStorageDesc, true, tab, createStorageSettings, removeStorageSettings);
    loadStorageUI(autoStorageContent);

    // Auto Ejector
    let autoEjectorDesc = 'Automatically ejects resources to maximize ejection volume. Full resources will override the enable setting (If a resource is full, it\'ll be seen as enabled). Enabling a resource will eject the resource until the rate is close to 0.';
    let [autoEjectorTitle, autoEjectorContent] = createAutoSettingToggle('autoEjector', 'Auto Ejector', autoEjectorDesc, true, tab, createEjectorSettings, removeEjectorSettings);
    loadEjectorUI(autoEjectorContent);
}

function createBuildingSetting(loc, id, name, toolTip) {
    let resText = $(`<span class="has-text-warning" style="width:12rem;">${name}:</span>`);
    if (toolTip) {
        resText.addClass(toolTipClass);
        resText.attr("data-label", toolTip);
    }
    let resSub = function(mult) {
        settings[loc][id] -= mult;
        if (settings[loc][id] < 0) {settings[loc][id] = 0;}
        return settings[loc][id];
    }
    let resAdd = function(mult) {
        settings[loc][id] += mult;
        return settings[loc][id];
    }
    let resControls = createNumControl(settings[loc][id], `${loc}_${id}`, resSub, resAdd);
    let div = $('<div style="display:flex"></div>').append(resText).append(resControls);
    return div;
}
function loadSmelterUI(content) {

    let woodControl = createBuildingSetting('smelterSettings', 'Wood', 'Wood Priority');
    let coalControl = createBuildingSetting('smelterSettings', 'Coal', 'Coal Priority');
    let oilControl = createBuildingSetting('smelterSettings', 'Oil', 'Oil Priority');
    content.append(woodControl);
    content.append(coalControl);
    content.append(oilControl);
    content.append($('<br>'));

    let ironControl = createBuildingSetting('smelterSettings', 'Iron', 'Iron Priority');
    let steelControl = createBuildingSetting('smelterSettings', 'Steel', 'Steel Priority');
    content.append(ironControl);
    content.append(steelControl);
}
function loadFactoryUI(content) {

    let luxControl = createBuildingSetting('factorySettings', 'Luxury_Goods', 'Luxury Goods Priority');
    let alloyControl = createBuildingSetting('factorySettings', 'Alloy', 'Alloy Priority');
    let polymerControl = createBuildingSetting('factorySettings', 'Polymer', 'Polymer Priority');
    let nanoControl = createBuildingSetting('factorySettings', 'Nano_Tube', 'Nano Tube Priority');
    let staneneControl = createBuildingSetting('factorySettings', 'Stanene', 'Stanene Priority');
    content.append(luxControl);
    content.append(alloyControl);
    content.append(polymerControl);
    content.append(nanoControl);
    content.append(staneneControl);
}
function loadDroidUI(content) {

    let adamControl = createBuildingSetting('droidSettings', 'Adamantite', 'Adamantite Priority');
    let uranControl = createBuildingSetting('droidSettings', 'Uranium', 'Uranium Priority');
    let coalControl = createBuildingSetting('droidSettings', 'Coal', 'Coal Priority');
    let alumControl = createBuildingSetting('droidSettings', 'Aluminium', 'Aluminium Priority');
    content.append(adamControl);
    content.append(uranControl);
    content.append(coalControl);
    content.append(alumControl);
}
function loadGrapheneUI(content) {

    let woodControl = createBuildingSetting('grapheneSettings', 'Wood', 'Wood Priority');
    let coalControl = createBuildingSetting('grapheneSettings', 'Coal', 'Coal Priority');
    let oilControl = createBuildingSetting('grapheneSettings', 'Oil', 'Oil Priority');
    content.append(woodControl);
    content.append(coalControl);
    content.append(oilControl);
    content.append($('<br>'));
}
function createAutoSettingBuildingPage(tab) {

    // Auto Support
    let autoSupportDesc = 'Powers buildings and allocates support. Power Priority can be changed in the Priority Tab.';
    let [autoSupportTitle, autoSupportContent] = createAutoSettingToggle('autoSupport', 'Auto Support', autoSupportDesc, false, tab);

    // Auto Smelter
    let autoSmelterDesc = "Allocates the smelter building. The priorities determine how much each resource is weighted. Can choose whether to depend on the Auto Priority queue or just the priorities here.";
    let [autoSmelterTitle, autoSmelterContent] = createAutoSettingToggle('autoSmelter', 'Auto Smelter', autoSmelterDesc, true, tab);
    loadSmelterUI(autoSmelterContent);

    let smelterPQToolTip = 'Enable to make Auto Smelter depend on the Auto Priority queue.';
    let smelterPQCheck = createCheckBoxControl(settings.smelterSettings.pqCheck, 'smelterPQCheck', "Auto Priority", {path:[settings, 'smelterSettings', 'pqCheck'],toolTip:smelterPQToolTip});
    autoSmelterTitle.append(smelterPQCheck);

    // Auto Factory
    let autoFactoryDesc = "Allocates the factory building. The priorities determine how much each resource is weighted. Can choose whether to depend on the Auto Priority queue or just the priorities here.";
    let [autoFactoryTitle, autoFactoryContent] = createAutoSettingToggle('autoFactory', 'Auto Factory', autoFactoryDesc, true, tab);
    loadFactoryUI(autoFactoryContent);

    let factoryPQToolTip = 'Enable to make Auto Factory depend on the Auto Priority queue.';
    let factoryPQCheck = createCheckBoxControl(settings.factorySettings.pqCheck, 'factoryPQCheck', "Auto Priority", {path:[settings, 'factorySettings', 'pqCheck'],toolTip:factoryPQToolTip});
    autoFactoryTitle.append(factoryPQCheck);

    // Auto Mining Droid
    let autoDroidDesc = "Allocates mining droids. The priorities determine how much each resource is weighted. Can choose whether to depend on the Auto Priority queue or just the priorities here.";
    let [autoDroidTitle, autoDroidContent] = createAutoSettingToggle('autoDroid', 'Auto Mining Droid', autoDroidDesc, true, tab);
    loadDroidUI(autoDroidContent);

    let droidPQToolTip = 'Enable to make Auto Droid depend on the Auto Priority queue.';
    let droidPQCheck = createCheckBoxControl(settings.droidSettings.pqCheck, 'droidPQCheck', "Auto Priority", {path:[settings, 'droidSettings', 'pqCheck'],toolTip:droidPQToolTip});
    autoDroidTitle.append(droidPQCheck);

    // Auto Graphene Plant
    let autoGrapheneDesc = "Allocates graphene plants. The priorities determine how much each resource is weighted. Can choose whether to depend on the Auto Priority queue or just the priorities here.";
    let [autoGrapheneTitle, autoGrapheneContent] = createAutoSettingToggle('autoGraphene', 'Auto Graphene Plants', autoGrapheneDesc, true, tab);
    loadGrapheneUI(autoGrapheneContent);

    let graphenePQToolTip = 'Enable to make Auto Graphene depend on the Auto Priority queue.';
    let graphenePQCheck = createCheckBoxControl(settings.grapheneSettings.pqCheck, 'graphenePQCheck', "Auto Priority", {path:[settings, 'grapheneSettings', 'pqCheck'],toolTip:graphenePQToolTip});
    autoGrapheneTitle.append(graphenePQCheck);
}

function createAutoSettingResearchPage(tab) {

    // Research Settings

    let autoResearchDesc = 'Controls which research branches to take. Turning this off will have irregular research purchases.';
    let [autoResearchTitle, autoResearchContent] = createAutoSettingToggle('autoResearch', 'Auto Research', autoResearchDesc, true, tab);
    // Creating Fanaticism/Anthropology choice
    let religionStr1 = 'This setting chooses between Fanaticism and Anthropology. This setting becomes obsolete after getting Transcendence.';
    let religionDetails1 = $(`<div><span>${religionStr1}</span></div>`);
    autoResearchContent.append(religionDetails1);
    let religion1 = createDropDownControl(settings.religion1, 'religion1', 'Religion Tier 1', {fanaticism:'Fanaticism',anthropology:'Anthropology'});
    autoResearchContent.append(religion1);

    // Creating Fanaticism/Anthropology choice
    let religionStr2 = 'This setting chooses between Study and Deify Ancients.';
    let religionDetails2 = $(`<div><span>${religionStr2}</span></div>`);
    autoResearchContent.append(religionDetails2);
    let religion2 = createDropDownControl(settings.religion2, 'religion2', 'Religion Tier 2', {study:'Study Ancients',deify:'Deify Ancients'});
    autoResearchContent.append(religion2);
}

function nameCompare(a, b) {
    return a.name.localeCompare(b.name);
}
function priorityCompare(a, b) {
    return b.basePriority - a.basePriority;
}
function powerCompare(a, b) {
    let bPP = (b instanceof PoweredBuilding) ? b.powerPriority : -1;
    let aPP = (a instanceof PoweredBuilding) ? a.powerPriority : -1;
    return bPP - aPP;
}
function getActionFromId(id) {
    let [a, t] = id.split('-');
    let action = null;
    if (t === undefined) {
        if (a == "Container" || a == "Crate") {
            action = storages[a];
        } else if (a == 'Gene' || a == 'Mercenary' || a == 'FortressMercenary' || a == 'Sacrifice') {
            action = miscActions[a];
        } else {
            action = arpas[a];
        }
    } else {
        if (a == 'tech') {
            action = researches[id];
        } else {
            action = buildings[id];
        }
    }
    return action;
}
function updatePriorityList() {
    console.log("Updating Priority List");
    let search = $('#priorityInput')[0];
    let sort = $('#prioritySort')[0];
    let priorityList = $('#priorityList')[0];

    // Finding search parameters
    let terms = search.value.split(' ');
    let names = [];
    let locs = [];
    let res = [];
    for (let i = 0;i < terms.length;i++) {
        let locCheck = /loc:(.+)/.exec(terms[i]);
        let resCheck = /res:(.+)/.exec(terms[i]);
        //console.log(terms[i], tagCheck, resCheck);
        if (locCheck !== null) {
            locs.push(locCheck[1]);
        } else if (resCheck !== null) {
            res.push(resCheck[1]);
        } else {
            names.push(terms[i]);
        }
    }

    // Sorting if necessary
    let sortMethod = null;
    if (sort.value == 'name') {
        sortMethod = nameCompare;
    } else if (sort.value == 'priority') {
        sortMethod = priorityCompare;
    } else if (sort.value == 'powerPriority') {
        sortMethod = powerCompare;
    }
    if (sortMethod !== null) {
        console.log("Sorting by", sort.value);
        var newPriorityList = priorityList.cloneNode(false);

        let header = priorityList.childNodes[0];
        // Add all lis to an array
        var divs = [];
        for(let i = 1;i < priorityList.childNodes.length;i++){
                divs.push(priorityList.childNodes[i]);
        }
        // Sort the lis in descending order
        divs.sort(function(a, b){
            let bAction = getActionFromId(b.id.split('=')[0]);
            let aAction = getActionFromId(a.id.split('=')[0]);
            return sortMethod(aAction, bAction);
        });
        console.log(divs[0]);

        // Add them into the ul in order
        newPriorityList.appendChild(header);
        for (let i = 0; i < divs.length; i++) {
            newPriorityList.appendChild(divs[i]);
        }
        priorityList.parentNode.replaceChild(newPriorityList, priorityList);
        priorityList = newPriorityList;
    }

    for (let i = 1;i < priorityList.children.length;i++) {
        // Getting action
        let div = priorityList.children[i];
        let id = div.id.split('=')[0];
        let action = getActionFromId(id);

        // Checking if available
        if (!settings.showAll && !action.unlocked) {
            div.style.display = 'none';
            continue;
        }
        // Checking if type shown
        if (!settings.showBuilding && action instanceof Building && !(action instanceof ArpaAction)) {
            div.style.display = 'none';
            continue;
        }
        if (!settings.showResearch && action instanceof Research) {
            div.style.display = 'none';
            continue;
        }
        if (!settings.showMisc && (action instanceof MiscAction || action instanceof ArpaAction)) {
            div.style.display = 'none';
            continue;
        }
        // Searching for if any names appear in building name
        if (names.length != 0) {
            let pass = false;
            for (let i = 0;i < names.length;i++) {
                var name;
                if (action.name !== null) {
                    name = action.name;
                } else {
                    name = action.id.split('-')[1];
                }
                if (name.toLowerCase().indexOf(names[i]) >= 0) {
                    pass = true;
                    break;
                }
            }
            if (!pass) {
                div.style.display = 'none';
                continue;
            }
        }
        // Searching for if any tags appear in research name
        if (locs.length != 0) {
            let pass = false;
            for (let i = 0;i < locs.length;i++) {
                if (action.loc.includes(locs[i])) {
                    pass = true;
                    break;
                }
            }
            if (!pass) {
                div.style.display = 'none';
                continue;
            }
        }
        // Searching for if any resources appear in research requirements
        if (res.length != 0 && action.res !== null) {
            let pass = false;
            for (let i = 0;i < res.length;i++) {
                console.log(action.id, res, action.def.cost, action.getResDep(res[i]));
                if (action.getResDep(res[i]) !== null && action.getResDep(res[i]) > 0) {
                    pass = true;
                    break;
                }
            }
            if (!pass) {
                div.style.display = 'none';
                continue;
            }
        }

        div.style.display = 'flex';

    }

    // Set focus back on search
    search.focus();
}
function drawBuildingItem(building, buildingDiv) {

    // Building At Least
    let atLeastSub = function(mult) {
        building.decAtLeast(mult);
        return building.atLeast;
    }
    let atLeastAdd = function(mult) {
        building.incAtLeast(mult);
        return building.atLeast;
    }
    let atLeastControls = createNumControl(building.atLeast, building.id+'-min', atLeastSub, atLeastAdd);
    let atLeastDiv = $('<div style="width:10%;" title="'+building.id+' Minimum"></div>');
    atLeastDiv.append(atLeastControls);
    buildingDiv.append(atLeastDiv);

    // Building Limit
    let limSub = function(mult) {
        building.decLimit(mult);
        return building.limit;
    }
    let limAdd = function(mult) {
        building.incLimit(mult);
        return building.limit;
    }
    let limControls = createNumControl(building.limit, building.id+'-max', limSub, limAdd);
    let limDiv = $('<div style="width:10%;" title="'+building.id+' Maximum"></div>');
    limDiv.append(limControls);
    buildingDiv.append(limDiv);

    // Building SoftCap
    let softCapSub = function(mult) {
        building.decSoftCap(mult);
        return building.softCap;
    }
    let softCapAdd = function(mult) {
        building.incSoftCap(mult);
        return building.softCap;
    }
    let softCapControls = createNumControl(building.softCap, building.id+'-softcap', softCapSub, softCapAdd);
    let softCapDiv = $('<div style="width:10%;" title="'+building.id+' Soft Cap"></div>');
    softCapDiv.append(softCapControls);
    buildingDiv.append(softCapDiv);

    // Power Priority
    if (building instanceof PoweredBuilding) {
        let powerSub = function(mult) {
            building.decPowerPriority(mult);
            return building.powerPriority;
        }
        let powerAdd = function(mult) {
            building.incPowerPriority(mult);
            return building.powerPriority;
        }
        let powerControls = createNumControl(building.powerPriority, building.id+'-power-prio', powerSub, powerAdd);
        let powerDiv = $('<div style="width:10%;" title="'+building.id+' Power Priority"></div>');
        powerDiv.append(powerControls);
        buildingDiv.append(powerDiv);
    }
}
function drawArpaItem(arpa, arpaDiv) {

    // Adding filler
    arpaDiv.append($('<div style="width:10%;"></div>'));

    // Arpa Increments
    let sizeSub = function(mult) {
        arpa.decSize();
        return arpa.size;
    }
    let sizeAdd = function(mult) {
        arpa.incSize();
        return arpa.size;
    }

    let toolTip = 'Determines what increment size to build. Used in case 25x is beyond storage cap.';
    let sizeControls = createNumControl(arpa.size, arpa.id+'-size', sizeSub, sizeAdd, {toolTip:toolTip});
    let sizeDiv = $('<div style="width:10%;"></div>');
    sizeDiv.append(sizeControls);
    arpaDiv.append(sizeDiv);
}
function drawStorageItem(storage, storageDiv) {

    // Adding filler
    storageDiv.append($('<div style="width:40%;"></div>'));

    // Arpa Increments
    let sizeSub = function(mult) {
        storage.decSize(mult);
        return storage.size;
    }
    let sizeAdd = function(mult) {
        storage.incSize(mult);
        return storage.size;
    }

    let toolTip = 'Determines how many to build each time.';
    let sizeControls = createNumControl(storage.size, storage.id+'-size', sizeSub, sizeAdd, {toolTip:toolTip});
    let sizeDiv = $('<div style="width:10%;"></div>');
    sizeDiv.append(sizeControls);
    storageDiv.append(sizeDiv);
}
function drawMercenaryItem(action, actionDiv) {

    // Adding filler
    actionDiv.append($('<div style="width:40%;"></div>'));

    // Increments
    let priceSub = function(mult) {
        action.decMaxPrice(mult);
        return action.maxPrice;
    }
    let priceAdd = function(mult) {
        action.incMaxPrice(mult);
        return action.maxPrice;
    }

    let toolTip = 'Determines the max price to buy mercenaries. Set to -1 to ignore.';
    let priceControls = createNumControl(action.maxPrice, action.id+'-maxPrice', priceSub, priceAdd, {toolTip:toolTip});
    let priceDiv = $('<div style="width:10%;"></div>');
    priceDiv.append(priceControls);
    actionDiv.append(priceDiv);
}
function populatePriorityList() {
    let priorityList = $('#priorityList')[0];
    var x;
    var name;
    let temp_l = [];
    for (x in buildings) {temp_l.push(buildings[x]);}
    for (x in researches) {temp_l.push(researches[x]);}
    for (x in arpas) {temp_l.push(arpas[x]);}
    for (x in storages) {temp_l.push(storages[x]);}
    for (x in miscActions) {temp_l.push(miscActions[x]);}
    while(priorityList.childNodes.length != 1) {
        priorityList.removeChild(priorityList.lastChild);
    }
    // Drawing buildings into list
    for (let i = 0;i < temp_l.length;i++) {
        let action = temp_l[i];
        var actionDiv;
        if (i % 2) {
            actionDiv = $('<div id="'+action.id+'=prio" style="display:flex" class="market-item"></div>');
        } else {
            actionDiv = $('<div id="'+action.id+'=prio" style="display:flex" class="resource alt market-item"></div>');
        }
        priorityList.appendChild(actionDiv[0]);

        // Name Label
        if (action.name === null) {
            name = action.id.split('-')[1];
        } else {
            name = action.name;
        }
        let nameDiv = $(`<span class="${toolTipClass}" style="width:20%;" data-label="Id:${action.id}, Loc:${action.loc[action.loc.length-1]}">${name}</span>`);
        nameDiv[0].classList.add(action.color);
        actionDiv.append(nameDiv);

        // Priority
        let prioSub = function(mult) {
            action.decBasePriority(mult);
            return action.basePriority;
        }
        let prioAdd = function(mult) {
            action.incBasePriority(mult);
            return action.basePriority;
        }
        let settingVal = action.basePriority;
        let prioControls = createNumControl(settingVal,"action_"+action.id+"_priority",prioSub,prioAdd);
        let prioDiv = $('<div style="width:10%;" title="'+action.id+' Priority"></div>');
        prioDiv.append(prioControls);
        actionDiv.append(prioDiv);

        // Enable Toggle
        let enableDiv = $('<div style="width:10%;" title="'+action.id+' Enabled"></div>');
        actionDiv.append(enableDiv);
        let toggle = createToggleControl(action.id+'_enabled', '', {path:[action, 'enabled'],small:true});
        enableDiv.append(toggle);

        if (action instanceof Building) {
            drawBuildingItem(action,actionDiv);
        }

        if (action instanceof ArpaAction) {
            drawArpaItem(action,actionDiv);
        }

        if (action instanceof StorageAction) {
            drawStorageItem(action,actionDiv);
        }

        if (action instanceof MercenaryAction) {
            drawMercenaryItem(action,actionDiv);
        }
    }
}
function createPriorityList(settingsTab) {
    // Creation Priority List
    let priorityLabel = $('<div><h3 class="name has-text-warning" title="Set the Priority settings">Actions:</h3></div></br>');
    settingsTab.append(priorityLabel);
    let prioritySettingsDiv = $('<div id="prioritySettingsDiv" style="overflow:auto"></div>');
    let prioritySettingsLeft = $('<div id="prioritySettingsLeft" style="float:left"></div>');
    let prioritySettingsRight = $('<div id="prioritySettingsRight" style="float:right"></div>');

    let topLeft = $('<div id="prioritySettingsTopLeft"></div>');
    let bottomLeft = $('<div id="prioritySettingsBottomLeft"></div>');
    let topRight = $('<div id="prioritySettingsTopRight" style="float:right"></div>');
    let bottomRight = $('<div id="prioritySettingsBottomRight"></div>');
    let search = $('<input type="text" id="priorityInput" placeholder="Search for actions (ex: \'iron loc:city res:money\')" style="width:20rem;">');
    search.on('input', updatePriorityList);
    let sortLabel = $('<span style="padding-left:20px;padding-right:20px;">Sort:</span>');
    let sort = $('<select style="width:110px;" id="prioritySort"><option value="none">None</option><option value="name">Name</option><option value="priority">Priority</option><option value="powerPriority">Power Priority</option></select>');
    sort.on('change', updatePriorityList);
    topLeft.append(search).append(sortLabel).append(sort);

    let showAll = createCheckBoxControl(settings.showAll, 'showAll', 'Show All', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
    let showBuilding = createCheckBoxControl(settings.showBuilding, 'showBuilding', 'Show Buildings', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
    let showResearch = createCheckBoxControl(settings.showResearch, 'showResearch', 'Show Researches', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
    let showMisc = createCheckBoxControl(settings.showMisc, 'showMisc', 'Show Misc.', {enabledCallBack:updatePriorityList, disabledCallBack:updatePriorityList});
    bottomLeft.append(showAll).append(showBuilding).append(showResearch).append(showMisc);

    let enableLabel = $('<span style="padding-right:10px;">Enable:</span>');
    let enableAllBtn = $('<a class="button is-dark is-small" id="enable-all-btn"><span>All</span></a>');
    enableAllBtn.on('click', function(e){
        if (e.which != 1) {return;}
        let priorityList = $('#priorityList')[0];
        for (let i = 1;i < priorityList.childNodes.length;i++) {
            getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
        }
        populatePriorityList();
        updatePriorityList();
    });
    let enableVisBtn = $('<a class="button is-dark is-small" id="enable-vis-btn"><span>Visible</span></a>');
    enableVisBtn.on('click', function(e){
        if (e.which != 1) {return;}
        let priorityList = $('#priorityList')[0];
        for (let i = 1;i < priorityList.childNodes.length;i++) {
            if (priorityList.childNodes[i].style.display !== 'none') {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
            }
        }
        populatePriorityList();
        updatePriorityList();
    });
    topRight.append(enableLabel).append(enableAllBtn).append(enableVisBtn);

    let disableLabel = $('<span style="padding-right:10px;">Disable:</span>');
    let disableAllBtn = $('<a class="button is-dark is-small" id="disable-all-btn"><span>All</span></a>');
    disableAllBtn.on('click', function(e){
        if (e.which != 1) {return;}
        let priorityList = $('#priorityList')[0];
        for (let i = 1;i < priorityList.childNodes.length;i++) {
            getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
        }
        populatePriorityList();
        updatePriorityList();
    });
    let disableVisBtn = $('<a class="button is-dark is-small" id="disable-vis-btn"><span>Visible</span></a>');
    disableVisBtn.on('click', function(e){
        if (e.which != 1) {return;}
        let priorityList = $('#priorityList')[0];
        for (let i = 1;i < priorityList.childNodes.length;i++) {
            if (priorityList.childNodes[i].style.display !== 'none') {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
            }
        }
        populatePriorityList();
        updatePriorityList();
    });
    bottomRight.append(disableLabel).append(disableAllBtn).append(disableVisBtn);

    prioritySettingsLeft.append(topLeft).append(bottomLeft);
    prioritySettingsRight.append(topRight).append(bottomRight);
    prioritySettingsDiv.append(prioritySettingsLeft).append(prioritySettingsRight);
    settingsTab.append(prioritySettingsDiv);

    let priorityList = $('<div id="priorityList"></div>');
    let priorityListLabel = $(`<div style="display:flex;">
                                <div style="width:20%;text-align:left;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Action Name. Can be lowercase id if not currently available">Action</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Sets the priority of this action">Priority</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Enables this action for being automatically taken">Enabled</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Will focus on buying this amount of this building before anything else.">Min</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Will stop building this building after reaching this limit">Max</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Will softcap this building after reaching this limit, however will still build if resources full">Soft Cap</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Sets the priority for powering this building">Power</span></div>
                                <div style="width:10%;text-align:center;padding-left:1rem;"><span class="name has-text-warning ${toolTipClass}" data-label="Special settings for this action. Hover over for details.">Special</span></div>
                                </div>`);
    priorityList.append(priorityListLabel);
    settingsTab.append(priorityList);
    populatePriorityList();
    updatePriorityList();
}
function createAutoSettingPriorityPage(tab) {

    // Auto Priority
    let autoPriorityDesc = 'Main Priority System. Creates a priority queue for all the buildings/research/misc. The priority queue can also be used to manage allocation for other settings (smelter, trade, etc). This will probably be heavily reworked in the future.';
    let [autoPriorityTitle, autoPriorityContent] = createAutoSettingToggle('autoPriority', 'Auto Priority', autoPriorityDesc, false, tab);

    createPriorityList(tab);
}

function createAutoLog() {
    let autolog = $('<div id="autolog" class="msgQueue right resource alt as-autolog"></div>');
    $('#queueColumn').append(autolog);
}

function createScriptWatermark() {
    let watermark = $(`<div id="as-watermark" style="text-align:center"><span>Evolve AutoScript by HLXII - Version <a href="${url}">${version}</a></span></div>`);
    $('#resources').append(watermark);
    watermark = $(`<div id="as-watermark-2" style="text-align:center"><span>Working for Game Version ${workingVersion}</span></div>`);
    $('#resources').append(watermark);
}
