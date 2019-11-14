// These variables and functions were stolen from the original game scripts
// If any of these change with game updates, they need to be updated here as well

// From actions.js
// Determines the factory output
export const f_rate = {
    Lux: {
        demand: [0.14,0.21,0.28,0.35],
        fur: [2,3,4,5]
    },
    Alloy: {
        copper: [0.75,1.12,1.49,1.86],
        aluminium: [1,1.5,2,2.5],
        output: [0.075,0.112,0.149,0.186]
    },
    Polymer: {
        oil_kk: [0.22,0.33,0.44,0.55],
        oil: [0.18,0.27,0.36,0.45],
        lumber: [15,22,29,36],
        output: [0.125,0.187,0.249,0.311],
    },
    Nano_Tube: {
        coal: [8,12,16,20],
        neutronium: [0.05,0.075,0.1,0.125],
        output: [0.2,0.3,0.4,0.5],
    },
    Stanene: {
        aluminium: [30,45,60,75],
        nano: [0.02,0.03,0.04,0.05],
        output: [0.6,0.9,1.2,1.5],
    }
};

// From space.js
// Determines the mining droid output bonus
export default function zigguratBonus(){
    let bonus = 1;
    if (window.evolve.global.space['ziggurat'] && window.evolve.global.space['ziggurat'].count > 0){
        let study = window.evolve.global.tech['ancient_study'] ? 0.006 : 0.004;
        bonus += (window.evolve.global.space.ziggurat.count * window.evolve.global.civic.colonist.workers * study);
    }
    return bonus;
}