# Evolve-Autoscript
My personal userscript for the game Evolve by Demagorddon - https://pmotschmann.github.io/Evolve/

# Known Issues (AKA I won't fix)
If the game is run for long enough without refreshing, then clicking buttons on the modal windows (smelter, factory, etc) will lag the game. I don't know why this is, and I don't know how to fix it. So... I added an Auto Refresh setting to reload the page every 200 seconds. Use if you want (but most people don't).

Some Auto Setting tabs aren't loaded during the Evolution Stage. This is because the script pulls game info from the global. However, during the evolution stage, some of the info isn't loaded. This causes the tabs to load incorrectly/crash. I don't feel like figuring out a clean solution, so I'm choosing to ignore it. You only really need the General and Evolution tabs during the evolution stage anyways.

The inline Auto Employ settings don't update after a job is unlocked. You can fix this by using the Reset UI button on the General tab.

Also thinking of moving some buttons back under the resource section for easy access, rather than searching the Auto Settings tab.

# Stuff to do

## Bugfix
* Fix research settings, because I don't think it works correctly (also doesn't take into account new crispr for both religions)
* Clicking somewhere random, then releasing the click above the tab navigators makes the label look focused (green in night mode). This is because of something weird I did in the UI code. I think I know a fix, but I'm too lazy to check.

## Small
* Update autoCraft to use multiplier buttons, as large storage values cause clicks to crash/not trigger
* Add click rate setting for Auto Farm
* Add granularity to Auto Print (only Auto Priority right now, idk what else I could split it into)
* Add install instructions to README
* Maybe add sacrifical alter? Never played new mantis yet
* Add multiplier functionality to custom UI
* Replace some toggles with checkboxes (copy UI from fortress) (replace priority show toggles and challenge setting toggles) This is definitely necessary as there is a bug with the current toggles.

## Large
* Update Auto Support. Currently simplistic allocation, and support buildings not implemented
* Auto Fortress
* Auto Mass Ejector
* Refactor priority system to use single priority queue
* Refactor Auto settings that depend on Auto Priority Limits to have Auto Priority mode and Normal Priority Mode (independent of autoPriority Limits)
* Update Auto Battle for more optimal battles (optimal calculations, enemy power checks, max soldier/campaign, etc)
* Refactor Auto Employ for more granularity (Specifically craftsmen. Can't get exactly one worker easily)
* Add support for Auto Prestige
* Auto Gene
* Update ArpaActions to take into account rank
* Add Auto Prioritize support to Auto Employ (probably only effecting craftsman allocation somehow)