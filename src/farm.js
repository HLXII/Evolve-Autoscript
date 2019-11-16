import { settings } from './settings.js';


var foodBtn = null;
var lumberBtn = null;
var stoneBtn = null;
var rnaBtn = null;
var dnaBtn = null;
var slaughterBtn = null;
export function loadFarm () {
    rnaBtn = document.querySelector('#evo-rna > a');
    dnaBtn = document.querySelector('#evo-dna > a');
    foodBtn = document.querySelector('#city-food > a');
    lumberBtn = document.querySelector('#city-lumber > a');
    stoneBtn = document.querySelector('#city-stone > a');
    slaughterBtn = document.querySelector('#city-slaughter > a');
}

function farm() {
    if(foodBtn!==null){foodBtn.click();}
    if(lumberBtn!==null){lumberBtn.click();}
    if(stoneBtn!==null){stoneBtn.click();}
    if(rnaBtn!==null){rnaBtn.click();}
    if(dnaBtn!==null){dnaBtn.click();}
    if(slaughterBtn!==null){slaughterBtn.click();}
}

var farmInterval = null;
export function autoFarm() {
    if(settings.autoFarm && farmInterval === null) {
        console.log("Setting farm interval");
        farmInterval = setInterval(farm, settings.farmRate);
    } else {
        if (!settings.autoFarm && !(farmInterval === null)) {
            clearInterval(farmInterval);
            farmInterval = null;
        }
    }
}