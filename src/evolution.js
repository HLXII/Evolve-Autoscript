import { settings, loadSettings } from './settings.js';
import { resetUI } from './ui.js';
import { perkUnlocked, achievementUnlocked } from './utility.js';

// IDs of the farming buttons
const evoFarmActions = ["evo-rna", "evo-dna"];

// IDs of all the race decision actions
const evoRaceActions = [
	"evo-phagocytosis", "evo-chitin", "evo-chloroplasts",
	"evo-eggshell", "evo-mammals", "evo-athropods",
	"evo-ectothermic", "evo-endothermic",
	"evo-humanoid", "evo-gigantism", "evo-animalism", "evo-dwarfism",
	"evo-aquatic", "evo-demonic",
    "evo-fey", "evo-sand", "evo-heat", "evo-polar",
	"evo-entish", "evo-cacti",
	"evo-sporgar", "evo-shroomi",
	"evo-arraak", "evo-pterodacti", "evo-dracnid",
	"evo-tortoisan", "evo-gecko", "evo-slitheryn",
	"evo-human", "evo-elven", "evo-orc",
	"evo-orge", "evo-cyclops", "evo-troll",
	"evo-kobold", "evo-goblin", "evo-gnome",
	"evo-cath", "evo-wolven", "evo-centaur",
	"evo-mantis", "evo-scorpid", "evo-antid",
	"evo-sharkin", "evo-octigoran", "evo-balorg", "evo-imp",'evo-seraph','evo-unicorn',
    "evo-dryad", "evo-satyr", "evo-phoenix", "evo-salamander", "evo-yeti", "evo-wendigo", "evo-tuskin", "evo-kamel"];

// IDs of all the challenge options
export const evoChallengeActions = ['evo-plasmid', 'evo-mastery', 'evo-trade', 'evo-craft', 'evo-crispr', 'evo-junker', 'evo-joyless', 'evo-decay'];
// IDs of all the harder challenge options
const evoHardChallengeActions = ['evo-junker', 'evo-joyless', 'evo-decay'];

// IDs of all the universe options
const evoUniverses = ['uni-standard','uni-heavy','uni-antimatter','uni-evil','uni-micro'];

// Contains all the race option decisions for each race
const evoRaceTrees = {
    "entish":["evo-chloroplasts", "evo-entish"],
    "cacti":["evo-chloroplasts", "evo-cacti"],
    "sporgar":["evo-chitin", "evo-sporgar"],
    "shroomi":["evo-chitin", "evo-shroomi"],
    "arraak":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-arraak"],
    "pterodacti":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-pterodacti"],
    "dracnid":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-dracnid"],
    "tortoisan":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-tortoisan"],
    "gecko":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-gecko"],
    "slitheryn":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-slitheryn"],
    "human":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-human"],
    "elven":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-elven"],
    "orc":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-orc"],
    "orge":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-orge"],
    "cyclops":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-cyclops"],
    "troll":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-troll"],
    "kobold":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-kobold"],
    "goblin":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-goblin"],
    "gnome":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-gnome"],
    "cath":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-cath"],
    "wolven":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-wolven"],
    "centaur":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-centaur"],
    "mantis":["evo-phagocytosis", "evo-athropods", "evo-mantis"],
    "scorpid":["evo-phagocytosis", "evo-athropods", "evo-scorpid"],
    "antid":["evo-phagocytosis", "evo-athropods", "evo-antid"],
    "sharkin":["evo-phagocytosis", "evo-aquatic", "evo-sharkin"],
    "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
    "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
    "balorg":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-balorg"],
    "imp":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-imp"],
    "seraph":["evo-phagocytosis", "evo-mammals", "evo-angelic", "evo-seraph"],
    "unicorn":["evo-phagocytosis", "evo-mammals", "evo-angelic", "evo-unicorn"],
    "dryad":["evo-phagocytosis", "evo-fey", "evo-dryad"],
    "satyr":["evo-phagocytosis", "evo-fey", "evo-satyr"],
    "phoenix":["evo-phagocytosis", "evo-heat", "evo-"],
    "salamander":["evo-phagocytosis", "evo-heat", "evo-"],
    "yeti":["evo-phagocytosis", "evo-polar", "evo-yeti"],
    "wendigo":["evo-phagocytosis", "evo-polar", "evo-wendigo"],
    "tuskin":["evo-phagocytosis", "evo-sand", "evo-tuskin"],
    "kamel":["evo-phagocytosis", "evo-sand", "evo-kamel"],
};

// Will contain the minimum amount of each evolution building to move onto civilization
// Is loaded by loadEvolution
var maxEvo = {}

// Loads maxEvo
export function loadEvolution() {
    // Loading all maximum values for evolution upgrades
    maxEvo = {};
    // Need these to unlock next upgrades
    maxEvo['evo-organelles'] = 2;
    maxEvo['evo-nucleus'] = 1;
    // Determining how much storage is necessary
    let needed = 320
    if (perkUnlocked('Morphogenesis')) {
        needed *= 0.8;
    }
    let baseStorage = 100;
    // Adding to baseStorage if Creator is unlocked
    if (achievementUnlocked('Creator') != -1) {
        baseStorage += (achievementUnlocked('Creator')-1)*50;
    }
    // Finding most optimal maxes to reach sentience
    let total = 1000;
    for (let i = 0;i < 10;i++) {
        let numEuk = i;
        let numMit = Math.ceil((((needed-baseStorage) / numEuk) - 10)/10)
        if ((numEuk + numMit) <= total) {
            maxEvo['evo-eukaryotic_cell'] = numEuk;
            maxEvo['evo-mitochondria'] = numMit;
            total = numEuk + numMit
        }
    }
    maxEvo['evo-membrane'] = Math.ceil((needed-baseStorage) / (5 * maxEvo['evo-mitochondria'] + 5))
    // Setting minimum to 1 for unlocking next upgrades
    maxEvo['evo-membrane'] = (maxEvo['evo-membrane'] <= 0) ? 1 : maxEvo['evo-membrane'];
    maxEvo['evo-eukaryotic_cell'] = (maxEvo['evo-eukaryotic_cell'] <= 0) ? 1 : maxEvo['evo-eukaryotic_cell'];
    maxEvo['evo-mitochondria'] = (maxEvo['evo-mitochondria'] <= 0) ? 1 : maxEvo['evo-mitochondria'];
}

export function autoEvolution() {
    let actions = document.querySelectorAll('#evolution .action');
    let chosenAction = null;
    let chosenPriority = 0;
    let transition = false;
    for (let i = 0; i < actions.length; i++) {
        // Checking if purchasable
        let action = actions[i];
        // Not purchasable
        if (action.className.indexOf("cna") >= 0) {continue;}
        // Farming button
        if(evoFarmActions.includes(action.id)) {continue;}
        // Reached max in maxEvo
        if(action.id in maxEvo && parseInt($('#'+action.id+' > a > .count')[0].innerText) >= maxEvo[action.id]) {continue;}
        // Don't take planets
        if(/\w+\d+/.exec(action.id) !== null) {continue;}
        // Don't take universes
        if (evoUniverses.includes(action.id)) {continue;}
        // Checking for race decision tree
        if(evoRaceActions.includes(action.id) && !evoRaceTrees[settings.evolution].includes(action.id)) {continue;}
        let newPriority = 0;
        // If it is a challenge Action
        if (evoChallengeActions.includes(action.id)) {
            // Hard Challenge
            if (evoHardChallengeActions.includes(action.id)) {
                // Junker will start automatically
                if (action.id == 'evo-junker' && settings[action.id]) {
                    newPriority = 2;
                }
                // Other Hard Challenges will need to be toggled
                else {
                    if (!action.classList.contains('hl') === settings[action.id]) {
                        newPriority = 10;
                    }
                }
            }
            // Normal Challenge
            else {
                // Normal Challenges will need to be toggled
                if (!action.classList.contains('hl') === settings[action.id]) {
                    newPriority = 10;
                }
            }
        }
        // Race Actions
        else if (evoRaceActions.includes(action.id)) {
            newPriority = 6;
            // Final race action
            if (action.id == evoRaceTrees[settings.evolution][evoRaceTrees[settings.evolution].length-1]) {
                newPriority = 5;
            }
        }
        // Sentience
        else if (action.id == 'evo-sentience') {
            newPriority = 1;
        }
        // Other actions
        else {
            newPriority = 20;
        }
        // Checking if chosen action needs to be replaced
        if (newPriority > chosenPriority) {
            chosenPriority = newPriority;
            chosenAction = action;
        }
    }
    if (chosenAction !== null) {
        chosenAction.children[0].click();
        if (chosenPriority <= 5) {
            loadSettings();
            resetUI();
        }
    }
}