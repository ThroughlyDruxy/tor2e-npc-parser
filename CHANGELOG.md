## v0.7.1
Added V12 backwards compatibility

## v0.7.0
Updated to work with V13.

## v0.6.0
Updated to work with V12 and briefly checked compatibility with Moria supplement adversaries.

## v0.5.5
Now it should finally work with both V10 and V11 of FoundryVTT.

## v0.5.2
Updated manifest to be compatible with V11

## v0.5.1
Newly created sheet now opens after being created.

## v0.5.0
Added support for Adversary Conversion.pdf. Before clicking "Go", make sure to select the source from the dropdown in the dialog. Options are "Core Rules" and "Adversary Conversion.pdf".
Added error reporting for when parts fail to be parsed.
Parser now correctly parses creatures with a single weapon.

## v0.0.5
Now pressing "Enter" simple does carriage return instead of submitting the text in the dialog.

## v0.0.4
Added localization support for notifications
Corrected error when parsing with statblocks that included a parry of "-"
Added error reporting when description cannot be parsed.
If fell abilities contains only "-" it adds no fell ability
Automatically adds fell abilities that apply to all of one type

Resolved issues

- Fell Abilities that apply to all of one type are not automatically added with the description being a page reference for the ability description.
- Marsh-dweller statblock now parses but without description. This will continue to be looked into but it seems to be a typo so we'll see.

## v0.0.3
Initial release

Known issues

- Fell Abilities that apply to all of one type are not added and will need to be manually added after creation by the LM
  - All Orcs should have **Hatred (subject)** and **Hate Sunlight**
  - All Trolls should have **Hideous Toughness** and **Dull-Witted**
  - All Undead should have **Deathless**, **Heartless**, and **Strike Fear**
- Marsh-dweller statblock will fail due to the dash being inconsistant in the name.
