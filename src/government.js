import { settings } from './settings.js';
import { disableMult } from './utility.js';
import { resources } from './resources.js';
import { buildings } from './buildings.js';
import { researched } from './researches.js';
import { arpas } from './miscactions.js';
import { openModal, closeModal } from './modal.js';

export const governments = [
					'Anarchy',
					'Autocracy',
					'Democracy',
					'Oligarchy',
					'Theocracy',
					'Republic',
					'Socialist',
					'Corpocracy',
					'Technocracy',
					'Federation',
					];

export function loadGovernments() {
	if (!settings.hasOwnProperty('government')) {settings.government = {};}
	for (let i = 0;i < governments.length;i++) {
		if (!settings.government.hasOwnProperty(governments[i])) {settings.government[governments[i]] = {};}
		if (!settings.government[governments[i]].hasOwnProperty('priority')) {settings.government[governments[i]].priority = 0;}
	}
}

function getCurrentMorale() {
    let totalMorale = 100;
    for (var x in window.evolve.global.city.morale) {
        if (x == 'current') {continue;}
        totalMorale += window.evolve.global.city.morale[x];
    }
    return totalMorale;
}
function getMaxMorale() {
    let maxMorale = 100;
    maxMorale += buildings['city-amphitheatre'].numTotal;
    maxMorale += buildings['city-casino'].numTotal;
    maxMorale += buildings['space-vr_center'].numOn * 2;
    if (researched('tech-superstars')) {maxMorale += window.evolve.global.civic.entertainer.workers;}
    maxMorale += arpas['monument'].numTotal * 2;
    if (window.evolve.global.civic.taxes.tax_rate < 20){
        maxMorale += 10 - Math.floor(window.evolve.global.civic.taxes.tax_rate / 2);
    }
    return maxMorale;
}
function decTax(num) {
    num = (num === undefined) ? 1 : num;
    let decTaxBtn = $('#tax_rates > .sub');
    disableMult();
    for (let i = 0;i < num;i++) {
        decTaxBtn.click();
    }
}
function incTax(num) {
    num = (num === undefined) ? 1 : num;
    let incTaxBtn = $('#tax_rates > .add');
    disableMult();
    for (let i = 0;i < num;i++) {
        incTaxBtn.click();
    }
}
export function autoTax(priorityData) {
    // Don't start taxes if haven't researched
    if (!researched('tech-tax_rates')) {return;}
    let morale = getCurrentMorale();
    let maxMorale = getMaxMorale();
    let moneyRate = resources.Money.temp_rate || resources.Money.rate;
    console.log(morale, maxMorale, moneyRate);
    // Currently below minimum morale
    if (morale < settings.minimumMorale) {
        decTax();
    }
    // Setting to lowest taxes to get the max morale bonus (since taxes aren't needed)
    else if (resources.Money.ratio == 1) {
        //TODO Figure out a good way of doing this
        //decTax();
    }
    // Currently above max Morale
    else if (morale >= maxMorale) {
        incTax(morale - maxMorale);
    }
    else {
        if (resources.Money.ratio < 0.99 || moneyRate < 0) {
        	if (morale >= settings.minimumMorale + 1) {
        		incTax();
        	}
        }
        else {
            decTax();
        }
    }
}

function getCurGovernment() {
	let label = document.getElementById('govLabel')
	if (label !== null) {
		return label.innerText;
	}
	return null;
}

function getGovernmentChangeSpan() {
	return document.querySelector('#govType > div:nth-child(2) > span');
}
function getGovernmentChangeBtn() {
	let span = getGovernmentChangeSpan();
	if (span === null) {return null;}
	return span.querySelector('.button');
}
function canChangeGovernment() {
	let btn = getGovernmentChangeBtn();
	if (btn === null) {return false;}
	return !btn.attributes.hasOwnProperty('disabled');
}

function governmentAvailable(government) {
	switch(government) {
		case 'Anarchy': {
			return true;
		}
		case 'Autocracy': {
			return true;
		}
		case 'Democracy': {
			return true;
		}
		case 'Oligarchy': {
			return true;
		}
		case 'Theocracy': {
			return window.evolve.global.tech['gov_theo'];
		}
		case 'Republic,': {
			return window.evolve.global.tech['govern'] >= 2;
		}
		case 'Socialist': {
			return window.evolve.global.tech['gov_soc'];
		}
		case 'Corpocracy': {
			return window.evolve.global.tech['gov_corp'];
		}
		case 'Technocracy': {
			return window.evolve.global.tech['govern'] >= 3;
		}
		case 'Federation': {
			return false;
		}
	}
}

export async function autoGovernment() {
	// Don't start Auto Government if can't change
	if (!canChangeGovernment()) {return;}

	let choices = [];
	let curGovt = getCurGovernment();
	let curPriority = settings.government[curGovt].priority;

	console.log("GOV CUR: ", curGovt, " PRIO: ", curPriority)

	for (let i = 0;i < governments.length;i++) {
		// Checking if government is available
		if (governmentAvailable(governments[i])) {
			// Checking if higher priority
			if (settings.government[governments[i]].priority > curPriority) {
				choices.push(governments[i]);
			}
		}
	}
	
	// Stopping if no choices
	if (choices.length == 0) {return;}

	// Finding highest priority choice
	for (let i = 0;i < choices.length;i++) {
		if (settings.government[choices[i]].priority > curPriority) {
			curGovt = choices[i];
			curPriority = settings.government[choices[i]].priority;
		}
	}

	console.log("GOV CHOICES: ", choices);
	console.log("GOV CHOICE: ", curGovt, " PRIO: ", curPriority);

	// Opening Modal
 	let opened = await openModal(getGovernmentChangeBtn());
 	if (!opened) {return;}

	let options = document.getElementById('govModal').children;
	for (let i = 0;i < options.length;i++) {
		let type = options[i].attributes['data-gov'].value;
		if (type == curGovt.toLowerCase()) {
			options[i].click();
		}
	}

 	// Closing Modal
 	await closeModal();
}

