# Evolve-Autoscript
My personal userscript for the game Evolve by Demagorddon - https://pmotschmann.github.io/Evolve/

# Known Issues (AKA I won't fix)
If the game is run for long enough without refreshing, then clicking buttons on the modal windows (smelter, factory, etc) will lag the game. I don't know why this is, and I don't know how to fix it. So... I added an Auto Refresh setting to reload the page every 200 seconds. Use if you want (but most people don't).

Some Auto Setting tabs aren't loaded during the Evolution Stage. This is because the script pulls game info from the global. However, during the evolution stage, some of the info isn't loaded. This causes the tabs to load incorrectly/crash. I don't feel like figuring out a clean solution, so I'm choosing to ignore it. You only really need the General and Evolution tabs during the evolution stage anyways.

# Stuff to do

## Bugfix

## Small
* Update autoCraft to use multiplier buttons, as large storage values cause clicks to crash/not trigger
* Add click rate setting for Auto Farm
* Add granularity to Auto Print (Auto Settings / Auto Battle / ???)
* Add install instructions to README
* Add Sacrifical Alter to MiscActions
* Add Slave Market to MiscActions
* Add setting to display/hide inline UI
* Add quick menu under resources (non-specific buttons)
* Refactor some Auto Settings to use Vues object rather than parsing DOM for buttons, which increases performance (Auto Tax, Auto Battle)
* add Auto Ejector inline settings
* Add special settings column to Priority List (percent buy for ARPA, crate/container buy, mercs max money)

## Large
* Auto Fortress
* Refactor priority system to use single priority queue
* Once refactored, add way of viewing priority queue (probably on demand, since loading the DOM will be expensive)
* Refactor Auto settings that depend on Auto Priority Limits to have Auto Priority mode and Normal Priority Mode (independent of autoPriority Limits) (AutoEmploy, AutoTax, AutoCraft[?], AutoTrade, AutoSupport, AutoSmelter, AutoFactory, AutoDroid, AutoGraphene)
* Auto Gene
* Cheat Menu (Demagorddon plz ignore). Will allow editing the global variable of the save. Hopefully for people wanting to restore some lost resources or fixing a save bug.
