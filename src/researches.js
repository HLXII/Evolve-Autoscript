import { Action } from './actions.js';
import { settings } from './settings.js';

export class Research extends Action {
    constructor(id, loc) {
        super(id, loc);
        this.color = 'has-text-danger';
    }

    get researched() {

        let [grant, val] = this.def.grant;
        let old = false;
        if (window.evolve.global.tech[grant] !== undefined) {
            if (window.evolve.global.tech[grant] >= val) {
                old = true;
            }
        }
        return old;
    }
}

export var researches = {};
export function loadResearches() {
    if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
    // Tech
    for (let action in window.evolve.actions.tech) {
        // Remove reset tech
        if (action == 'exotic_infusion' || action == 'infusion_check' || action == 'infusion_confirm') {continue;}
        // Remove unification tech
        if (action == 'wc_conquest' || action == 'wc_money' || action == 'wc_morale' || action == 'wc_reject') {continue;}
        let id = window.evolve.actions.tech[action].id;
        researches[id] = new Research(id, ['tech', action]);
    }
}

// Determines if the research given has already been researched
export function researched(id) {
    return researches[id].researched;
}