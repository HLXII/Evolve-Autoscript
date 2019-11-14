// Stores details on jobs


class Job {
    constructor(id, priority) {
        this.id = id;
        if (!settings.jobs.hasOwnProperty(this.id)) {settings.jobs[this.id] = {};}
        if (!settings.jobs[this.id].hasOwnProperty('priority')) {settings.jobs[this.id].priority = priority;}
    }

    get _priority() {return settings.jobs[this.id].priority;}
    set _priority(priority) {settings.jobs[this.id].priority = priority;}

    get hireBtn() {
        return document.querySelector('#civ-'+this.id+' > .controls > .add');
    }
    get fireBtn() {
        return document.querySelector('#civ-'+this.id+' > .controls > .sub');
    }

    get name() {
        return window.evolve.global.civic[this.id].name;
    }

    get employed() {
        return window.evolve.global.civic[this.id].workers;
    }
    get maxEmployed() {
        return window.evolve.global.civic[this.id].max;
    }

    get priority() {
        return this._priority;
    }

    lowerPriority(mult) {
        if (this._priority == 0) {return;}
        this._priority -= mult;
        if (this._priority < 0) {this._priority = 0;}
        updateSettings();
        console.log("Lowering", this.name, "Priority", this._priority);
    }
    higherPriority(mult) {
        this._priority += mult;
        updateSettings();
        console.log("Increasing", this.name, "Priority", this._priority);
    }

    get unlocked() {
        return window.evolve.global.civic[this.id].display;
    }

    hire(num) {
        if (num === undefined) {num = 1;}
        let btn = this.hireBtn;
        if (btn === null) {return false;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
        return true;
    }
    fire(num) {
        if (num === undefined) {num = 1;}
        let btn = this.fireBtn;
        if (btn === null) {return false;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
        return true;
    }

}
class Unemployed extends Job {
    constructor(id, priority) {
        super(id, priority);
    }

    get priority() {
        if (this.name == 'Hunter') {
            return this._priority;
        } else {
            return 0;
        }
    }

    get hireFunc() {
        return function() {};
    }
    get fireFunc() {
        return function() {};
    }

    get name() {
        return window.evolve.global.race['carnivore'] || window.evolve.global.race['soul_eater'] ? 'Hunter' : 'Unemployed';
    }

    get employed() {
        return window.evolve.global.civic[this.id];
    }
    get maxEmployed() {
        return -1;
    }

    get unlocked() {
        return true;
    }

}
class Craftsman extends Job {
    constructor(id, priority) {
        super(id, priority);
    }

    get hireBtn() {
        return document.querySelector('#foundry .job:nth-child(2) > .controls > .add')
    }
    get fireBtn() {
        return document.querySelector('#foundry .job:nth-child(2) > .controls > .sub')
    }

}
var jobs = {};
function loadJobs() {
    if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
    jobs.free = new Unemployed('free', 0);
    for (var x in window.evolve.global.civic) {
        if (window.evolve.global.civic[x].hasOwnProperty('job')) {
            if (x == 'craftsman') {
                jobs[x] = new Craftsman(x, 0);
            }
            else {
                jobs[x] = new Job(x, 0);
            }
        }
    }
}
class CraftJob extends Job {
    constructor(id, priority) {
        super(id, priority);
    }

    get hireBtn() {
        return document.getElementById('craft'+this.id).parentNode.children[1].children[1];
    }
    get fireBtn() {
        return document.getElementById('craft'+this.id).parentNode.children[1].children[0];
    }

    get name() {
        return window.evolve.global.resource[this.id].name;
    }

    get unlocked() {
        return window.evolve.global.resource[this.id].display;
    }

    get employed() {
        return window.evolve.global.city.foundry[this.id];
    }
    get maxEmployed() {
        return -1;
    }
}
var craftJobs = {};
function loadCraftJobs() {
    if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
    Object.keys(window.evolve.global.resource).forEach(function(res) {
        // Craftable Resources
        if (window.evolve.craftCost[res] !== undefined) {
            craftJobs[res] = new CraftJob(res, 5);
        }
    });
}

function autoEmploy(priorityData) {
    let sortedJobs = [];
    var x;
    let population = 0;
    let totalPriority = 0;
    let priorities = [];
    let ratios = [];
    let maxes = [];
    for (x in jobs) {
        if (jobs[x].unlocked) {
            sortedJobs.push(jobs[x]);
            population += jobs[x].employed;
            totalPriority += jobs[x].priority;
            priorities.push(jobs[x].priority);
        }
    }
    for (let i = 0;i < sortedJobs.length;i++) {
        ratios.push(sortedJobs[i].priority / totalPriority);
        maxes.push(sortedJobs[i].maxEmployed);
    }

    // Allocating jobs
    let allocation = allocate(population,priorities,ratios,{max:maxes});
    console.log("JOBS:", sortedJobs, priorities, ratios, allocation.alloc);
    console.log(allocation.seq);

    // Firing extra employees
    for (let i = 0;i < allocation.alloc.length;i++) {
        //console.log(i, sortedJobs[i].name, sortedJobs[i].employed, "->", allocation.alloc[i]);
        if (sortedJobs[i].employed > allocation.alloc[i]) {
            sortedJobs[i].fire(sortedJobs[i].employed - allocation.alloc[i]);
        }
    }
    // Hiring required employees
    for (let i = 0;i < allocation.alloc.length;i++) {
        if (sortedJobs[i].employed < allocation.alloc[i]) {
            sortedJobs[i].hire(allocation.alloc[i] - sortedJobs[i].employed);
        }
    }

    // Allocating craftsman
    if (!jobs.craftsman.unlocked) {return;}
    //console.log("Divying up Craftsman");
    // Delay to get new craftman number
    setTimeout(function() {
        let totalCraftsman = window.evolve.global.civic.craftsman.workers;
        let totalPriority = 0;
        let cjobs = [];
        let priorities = [];
        let ratios = [];
        // Finding availible craftsman positions, as well as total priority and craftsman numbers
        for (x in craftJobs) {
            if (!craftJobs[x].unlocked) {continue;}
            cjobs.push(craftJobs[x]);
            totalPriority += craftJobs[x].priority;
            priorities.push(craftJobs[x].priority);
        }
        // Calculating wanted ratios
        for (let i = 0;i < cjobs.length;i++) {
            ratios.push(cjobs[i].priority / totalPriority);
        }
        // Optimizing craftsman placement
        let allocation = allocate(totalCraftsman,priorities,ratios);

        console.log("CRAFTJOBS:", cjobs, priorities, ratios, allocation.alloc);

        // Firing all unneeded
        for (let i = 0;i < cjobs.length;i++) {
            if (allocation.alloc[i] < cjobs[i].employed) {
                cjobs[i].fire(cjobs[i].employed - allocation.alloc[i]);
            }
        }
        // Hiring all needed
        for (let i = 0;i < cjobs.length;i++) {
            if (allocation.alloc[i] > cjobs[i].employed) {
                cjobs[i].hire(allocation.alloc[i] - cjobs[i].employed);
            }
        }
    }, 50);
}