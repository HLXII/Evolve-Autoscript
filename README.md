# Evolve-Autoscript
My personal userscript for the game Evolve by Demagorddon - https://pmotschmann.github.io/Evolve/

# Known Issues (AKA I won't fix)
If the game is run for long enough without refreshing, then clicking buttons on the modal windows (smelter, factory, etc) will lag the game. I don't know why this is, and I don't know how to fix it. So... I added an Auto Refresh setting to reload the page every 200 seconds. Use if you want (but most people don't).

Some Auto Setting tabs aren't loaded during the Evolution Stage. This is because the script pulls game info from the global. However, during the evolution stage, some of the info isn't loaded. This causes the tabs to load incorrectly/crash. I don't feel like figuring out a clean solution, so I'm choosing to ignore it. You only really need the General and Evolution tabs during the evolution stage anyways.

The inline Auto Employ settings don't update after a job is unlocked. You can fix this by using the Reset UI button on the General tab.

# Stuff to do

## Bugfix
* Money is attached to the helium control in the inline trade settings. Need to connect it to the one that's currently visible. However, the inline settings don't update unless you click Reset UI. Maybe reset UI in a timer?

## Small
* Update autoCraft to use multiplier buttons, as large storage values cause clicks to crash/not trigger
* Add click rate setting for Auto Farm
* Add granularity to Auto Print (only Auto Priority right now, idk what else I could split it into)
* Add install instructions to README
* Maybe add sacrifical alter? Never played new mantis yet
* Add multiplier functionality to custom UI
* Add hover text to some labels for more details (see Reset UI button for dom class and syntax)
* Add setting to display/hide inline UI
* Add quick menu under resources (non-specific buttons)

## Large
* Auto Fortress
* Auto Ejector
* Refactor priority system to use single priority queue
* Refactor Auto settings that depend on Auto Priority Limits to have Auto Priority mode and Normal Priority Mode (independent of autoPriority Limits) (AutoEmploy, AutoTax, AutoCraft[?], AutoTrade, AutoSupport, AutoSmelter, AutoFactory, AutoDroid, AutoGraphene)
* Auto Prestige
* Auto Gene
* Update ArpaActions to take into account rank