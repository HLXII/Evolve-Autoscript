# Evolve-Autoscript
My personal userscript for the game Evolve by Demagorddon - https://pmotschmann.github.io/Evolve/

# Installation
Install the [Tampermonkey](https://www.tampermonkey.net) plugin. (I tried my script with Greasemonkey but it didn't work).

Goto this [page](https://github.com/HLXII/Evolve-Autoscript/raw/master/evolve_autoscript.user.js) to install the plugin. Tampermonkey should redirect you to an install page. Or just create a new script in Tampermonkey and copy/paste this script into the editor.

Make sure to toggle the Enable Script Support setting in the Settings tab, otherwise this script will not work.

It is highly recommended to import settings from [Saved Settings](https://github.com/HLXII/Evolve-Autoscript/blob/master/Saved%20Settings). The script does not have settings at initialization, and using the exported saves can give you a starting point for changing priorities.

All priority settings are very opaque. As in, it is not very clear how changes in priorities affects the underlying script decisions. Thus, asking about what a 'good' priority setting to have is a bit hard to answer. I suggest playing around with the values until you're happy with the result. If you are very curious of how the priorities affect the script, you'll have to dig into the algorithm.

# Known Issues (AKA I won't fix)
If the game is run for long enough without refreshing, then clicking buttons on the modal windows (smelter, factory, etc) will lag the game. I don't know why this is, and I don't know how to fix it. So... I added an Auto Refresh setting to reload the page every 200 seconds. Use if you want (but most people don't).

# Stuff to do

## Bugfix
* Theoretical bug: Calculating smelter rate changes may be inaccurate if there is something that also consumes Iron.

## Small
* Add click limit settings (Currently limiting to 50 clicks)
* Add granularity to Auto Print (Auto Settings / Auto Battle / Auto Fortress / Auto Craft / Auto Market)
* Add setting to display/hide inline UI
* Add additional settings to Auto Ejector (max rate, min rate, ratio?)
* Update Auto Tax to not suck (Need to figure out a better solution for max money)
* Add Balorg slave catching setting to Auto Battle (If can get more slaves, override max campaign to ambush)
* Add Slave Market Action
* Maybe create a backend refresh script for Auto Support so the poppers don't need to be read every time (maybe?)
* Add Priority Ignore setting for Auto Priority (Turns it into old Auto Build)
* Re-Add manual buttons for Auto Buildings

## Large
* Auto Fortress - Manage hell soldiers for both defense and patrols
* Refactor priority system to use single priority queue
* Once refactored, add way of viewing priority queue (probably on demand, since loading the DOM will be expensive)
* Refactor Auto settings that depend on Auto Priority Limits to have Auto Priority mode and Normal Priority Mode (independent of autoPriority Limits) (AutoEmploy, AutoTax, AutoCraft[?], AutoTrade, AutoSupport, AutoDroid, AutoGraphene)
* Auto Gene - Automatically buy traits with genes
* Improve Auto Employ (Depending on Auto Priority for craftsman, manage morale with entertainers, manage farmers with food rate)
* Create additional setting templates in Saved Settings
