# Evolve-Autoscript
My personal userscript for the game Evolve by Demagorddon - https://pmotschmann.github.io/Evolve/

# Stuff to do

## Bugfix
* Fix research settings, because I don't think it works correctly (also doesn't take into account new crispr for both religions)

## Small
* Update autoCraft to use multiplier buttons, as large storage values cause clicks to crash/not trigger
* Add click rate setting for Auto Farm
* Add granularity to Auto Print (only Auto Priority right now, idk what else I could split it into)
* Add install instructions to README
* Maybe add sacrifical alter? Never played new mantis yet
* Add multiplier functionality to custom UI
* Replace some toggles with checkboxes (copy UI from fortress) (replace priority show toggles and challenge setting toggles)

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