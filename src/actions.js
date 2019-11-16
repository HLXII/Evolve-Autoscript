import { settings, updateSettings } from './settings.js'

export class Action {
    constructor(id, loc) {
        this.id = id;
        this.loc = loc;
        if (!settings.actions.hasOwnProperty(this.id)) {settings.actions[this.id] = {};}
        if (!settings.actions[this.id].hasOwnProperty('basePriority')) {settings.actions[this.id].basePriority = 0;}
        if (!settings.actions[this.id].hasOwnProperty('enabled')) {settings.actions[this.id].enabled = false;}
    }

    get enabled() {return settings.actions[this.id].enabled;}
    set enabled(enabled) {settings.actions[this.id].enabled = enabled;}
    get basePriority() {return settings.actions[this.id].basePriority;}
    set basePriority(basePriority) {settings.actions[this.id].basePriority = basePriority;}
    decBasePriority(mult) {
        this.basePriority -= mult;
        updateSettings();
        console.log("Decrementing Priority", this.id, this.basePriority);
    }
    incBasePriority(mult) {
        this.basePriority += mult;
        updateSettings();
        console.log("Incrementing Priority", this.id, this.basePriority);
    }
    get priority() {return this.basePriority;}

    get label() {
        return document.querySelector('#'+this.id+' > a > .aTitle');
    }
    get btn() {
        return document.getElementById(this.id);
    }

    get unlocked() {
        return this.label !== null;
    }
    get name() {
        let title = this.def.title;
        if (title === undefined) {
            return this.id;
        }
        else if (typeof title != 'string') {
            return title();
        }
        return title;
    }

    async effect(btn) {
        return new Promise(resolve => {
            // Opening popper window
            btn.dispatchEvent(new Event('mouseover'));
            setTimeout(function() {
                // Reading effect
                let data = document.querySelector(`#pop${btn.id}.popper > div:nth-child(3)`);
                let effect = data ? data.innerHTML : "";
                //Closing popper window
                setTimeout(function() {
                    btn.dispatchEvent(new Event('mouseout'));
                    resolve(effect);
                }, 25);
            }, 25);
        });
    }

    get def() {
        let details = window.evolve.actions;
        for (let i = 0;i < this.loc.length;i++) {
            details = details[this.loc[i]];
        }
        return details;
    }

    get data() {
        let type = this.loc[0];
        let action = this.loc[this.loc.length-1];
        if (window.evolve.global[type] === undefined || window.evolve.global[type][action] == undefined) {
            return null;
        }
        return window.evolve.global[type][action];
    }

    getResDep(resid) {
        if (this.btn === null) {return null;}
        let data = this.btn.querySelector('.button');
        if (data === null) {return null;}
        data = data.attributes[`data-${resid.toLowerCase()}`];
        if (data === undefined) {return null;}
        data = +data.value;
        return data;
    }

    click() {
        if (this.btn !== null) {
            if (this.btn.className.indexOf('cna') < 0) {
                this.btn.getElementsByTagName("a")[0].click();
                if (this.onBuy !== undefined) {
                    this.onBuy();
                }
                return true;
            }
            return false;
        } else {
            return false;
        }
    }
}

