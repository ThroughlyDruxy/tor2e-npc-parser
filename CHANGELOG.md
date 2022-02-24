## v0.0.5
Now pressing "Enter" simple does carriage return instead of submitting the text in the dialog.

## v0.0.4

Added localization support for notifications
Corrected error when parsing with statblocks that included a parry of "-"
Added error reporting when description cannot be parsed.
If fell abilities contains only "-" it adds no fell ability
Automatically adds fell abilities that apply to all of one type

Resolved issues
* Fell Abilities that apply to all of one type are not automatically added with the description being a page reference for the ability description.
* Marsh-dweller statblock now parses but without description. This will continue to be looked into but it seems to be a typo so we'll see.

## v0.0.3

Initial release

Known issues
* Fell Abilities that apply to all of one type are not added and will need to be manually added after creation by the LM
  * All Orcs should have **Hatred (subject)** and **Hate Sunlight**
  * All Trolls should have **Hideous Toughness** and **Dull-Witted**
  * All Undead should have **Deathless**, **Heartless**, and **Strike Fear**
* Marsh-dweller statblock will fail due to the dash being inconsistant in the name.
