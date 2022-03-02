import { buildItem } from './buildItem.js';

///// Parser /////
export async function tor2eParser(input) {
  console.log(`TOR2E | tor2eParser() was called`);

  // Statblock format
  const statblockFormat = input.find('select#text-format').val();

  const npcData = {
    name: 'Generated Actor',
    type: 'adversary',
    img: 'systems/tor2e/assets/images/tokens/token_adversary.png',
    data: {
      attributeLevel: {
        value: null,
      },
      endurance: {
        value: null,
        max: null,
      },
      description: {
        value: '',
      },
      might: {
        value: null,
        max: null,
      },
      hate: {
        value: null,
        max: null,
      },
      parry: {
        value: 0,
      },
    },
    token: {
      img: 'systems/tor2e/assets/images/tokens/token_adversary.png',
      displayBars: 40,
      bar1: {
        attribute: 'endurance',
      },
      bar2: {
        attribute: 'hate',
      },
    },
    items: [],
  };

  // Creates actor for things to embed into
  let actor = await Actor.create(npcData);

  let originalText = input.find('textarea#text-input').val();

  ///// NAME /////
  console.log(`TOR 2E NPC PARSER | parsing Name`);
  const [nameFirst] = originalText.split('\n');
  let nameArray = nameFirst.split(' ');
  for (let i = 0; i < nameArray.length; i++) {
    nameArray[i] =
      nameArray[i][0].toUpperCase() + nameArray[i].substr(1).toLowerCase();
  }
  npcData.name = nameArray.join(' ');

  ///// DESCRIPTION /////
  console.log(`TOR 2E NPC PARSER | parsing Description`);
  if (originalText.match(nameFirst.toUpperCase())) {
    let [nameCaps] = originalText.match(nameFirst.toUpperCase());

    if (nameCaps.toLowerCase() === nameFirst.toLowerCase()) {
      const betweenNamesReg = new RegExp(nameFirst + '(\\D)+ ' + nameCaps, 'g');
      let description = originalText.match(/^\D*\n/)[0].replace(/\n/gm, ' ');

      if (description.match(betweenNamesReg)) {
        npcData.data.description.value = description
          .match(betweenNamesReg)[0]
          .replace(`${nameFirst} `, '')
          .replace(` ${nameCaps}`, '');
      } else {
        ui.notifications.warn(
          game.i18n.localize(
            'TOR2E-NPC-PARSER.notifications.descriptionNotFound'
          )
        );
      }
    }
  } else {
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.descriptionNotFound')
    );
  }

  //// ATTRIBUTE LEVEL, MIGHT, HATE, PARRY, ARMOUR /////
  console.log(
    `TOR 2E NPC PARSER | parsing Level, Endurance, Might, Hate, Parry, and Armour`
  );

  ///// ATTRIBUTE LEVEL /////
  try {
    const attributeLevel = originalText
      .match(/ATTRIBUTE LEVEL\n\d+/i)[0]
      .match(/\d+/)[0];
    npcData.data.attributeLevel.value = Number(attributeLevel);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize(
        'TOR2E-NPC-PARSER.notifications.attributeLevelNotFound'
      )
    );
    npcData.data.attributeLevel.value = 0;
  }

  ///// ENDURANCE /////
  try {
    const endurance = originalText.match(/ENDURANCE\n\d+/i)[0].match(/\d+/)[0];
    npcData.data.endurance.value = endurance;
    npcData.data.endurance.max = endurance;
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.enduranceNotFound')
    );
    npcData.data.endurance.value = 0;
    npcData.data.endurance.max = 0;
  }

  ///// MIGHT /////
  try {
    const might = originalText.match(/MIGHT\n\d+/i)[0].match(/\d+/)[0];
    npcData.data.might.value = Number(might);
    npcData.data.might.max = Number(might);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.mightNotFound')
    );
    npcData.data.might.value = 0;
    npcData.data.might.max = 0;
  }

  ///// HATE /////
  try {
    const hate = originalText.match(/(RESOLVE|HATE)\n\d+/i)[0].match(/\d+/)[0];
    npcData.data.hate.value = Number(hate);
    npcData.data.hate.max = Number(hate);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.hateNotFound')
    );
    npcData.data.hate.value = 0;
    npcData.data.hate.max = 0;
  }

  ///// PARRY /////
  try {
    const parry = originalText
      .match(/PARRY\n(\+*\d|\D)/i)[0]
      .match(/\d+|\D$/)[0];
    Number(parry)
      ? (npcData.data.parry.value = Number(parry))
      : (npcData.data.parry.value = 0);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.parryNotFound')
    );
    npcData.data.parry.value = 0;
  }

  ///// ARMOUR /////
  try {
    const armour = originalText.match(/ARMOUR\n\d/i)[0].match(/\d+/)[0];
    actor.createEmbeddedDocuments('Item', [
      buildItem('Armour', 'armour', '', 0, 0, 0, Number(armour)),
    ]);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.armourNotFound')
    );
  }

  ///// DISTINCTIVE FEATURES /////
  console.log(`TOR 2E NPC PARSER | parsing Distinctive Features`);
  try {
    const [featureOne, featureTwo] = originalText
      .match(/[A-Z][a-z]+-*[a-z]+, [A-Z][a-z]+-*[a-z]+/)[0]
      .split(', ');
    actor.createEmbeddedDocuments('Item', [buildItem(featureOne, 'trait')]);
    actor.createEmbeddedDocuments('Item', [buildItem(featureTwo, 'trait')]);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize(
        'TOR2E-NPC-PARSER.notifications.distinctiveFeaturesNotFound'
      )
    );
  }

  ///// COMBAT PROFICIENCIES /////
  console.log(`TOR 2E NPC PARSER | parsing Combat Proficiencies`);
  try {
    let [weaponProfs] = originalText.match(/COMBAT PROFICIENCIES: .*\n.*/i);
    weaponProfs = weaponProfs.split(/\),|\.\n/);

    for (let i = 0; i < weaponProfs.length; i++) {
      if (/COMBAT PROFICIENCIES/i.test(weaponProfs[i])) {
        weaponProfs[i] = weaponProfs[i].replace(/COMBAT PROFICIENCIES: /i, '');
      } else if (/ATTRIBUTE LEVEL/i.test(weaponProfs[i])) {
        break;
      }
      // Weapon name
      let [weaponName] = weaponProfs[i].match(/\D*/);
      const wepSkillDamageInjuryReg = /\d+/g;
      let [weaponSkill, weaponDamage, weaponInjury] = weaponProfs[i].match(
        wepSkillDamageInjuryReg
      );
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          weaponName,
          'weapon',
          '',
          Number(weaponSkill),
          Number(weaponDamage),
          Number(weaponInjury)
        ),
      ]);
    }
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.combatProfsNotFound')
    );
  }

  ///// FELL ABILITIES /////
  console.log(`TOR 2E NPC PARSER | parsing Fell Abilities`);
  try {
    let allFellAbilitiesArr = originalText
      .match(/FELL ABILITIES: (\D*\d*)+/gim)[0]
      .replace(/FELL ABILITIES: /i, '')
      .split(/\.\n/gm);

    for (let i = 0; i < allFellAbilitiesArr.length; i++) {
      const [fellAbilitiesName, fellAbilitiesDescription] = allFellAbilitiesArr[
        i
      ]
        .replace('\n', ' ')
        .split('.');

      if (typeof fellAbilitiesDescription !== 'undefined') {
        actor.createEmbeddedDocuments('Item', [
          buildItem(
            fellAbilitiesName,
            'fell-ability',
            fellAbilitiesDescription + '.'
          ),
        ]);
      }
    }
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilityNotFound')
    );
  }

  ///// FELL ABILITIES BY TYPE /////
  if (/Orc|Goblin|Uruk|Snaga|Lugburz|Hags|Pale Ones/i.test(npcData.name)) {
    if (statblockFormat === 'crb') {
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          'Hatred (subject)',
          'fell-ability',
          'Not all orcs have this ability, but the LM may add it if they desire. Simply remove if not desired. Description can be found on page 148 of the Core Rule Book.'
        ),
      ]);
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          'Hate Sunlight',
          'fell-ability',
          'Description can be found on page 148 of the Core Rule Book.'
        ),
      ]);
      ui.notifications.info(
        'Hatred (subject) and Hate Sunlight ' +
          game.i18n.localize(
            'TOR2E-NPC-PARSER.notifications.fellAbilitiesByType'
          )
      );
    } else if (statblockFormat === 'adversary-conversion') {
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          'Hatred (subject)',
          'fell-ability',
          'Description can be found on page 4  of the Adversary Conversion pdf.'
        ),
      ]);
      ui.notifications.info(
        'Hatred (subject) ' +
          game.i18n.localize(
            'TOR2E-NPC-PARSER.notifications.fellAbilitiesByType'
          )
      );
    }
  } else if (/Troll|Ettins|Ogre/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Hideous Toughness',
        'fell-ability',
        'Description can be found on page 151 of the Core Rule Book or page 8 of the Adversary Conversion pdf.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Dull-witted',
        'fell-ability',
        'Description can be found on page 151 of the Core Rule Book or page 8 of the Adversary Conversion pdf.'
      ),
    ]);
    ui.notifications.info(
      'Hideous Toughness and Dull-witted ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Wight|Marsh|Wraith|Bog Soldiers|Spectres/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Deathless',
        'fell-ability',
        'Description can be found on page 154'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Heartless',
        'fell-ability',
        'Description can be found on page 154'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Strike Fear',
        'fell-ability',
        'Description can be found on page 154'
      ),
    ]);
    ui.notifications.info(
      'Deathless, Heartless, and Strike Fear ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Wolf|Hound/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Great Leap',
        'fell-ability',
        'Description can be found on page 156'
      ),
    ]);
    ui.notifications.info(
      'Great Leap ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Attercop|Spider/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Poison',
        'fell-ability',
        'If a Sting attack results in a Wound, the target is also poisoned.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Web',
        'fell-ability',
        'If and attack with the Web quality successfully hits a target, that target is webbed and unable to move. The webbed target cannot change stance and suffers –4 to their Parry rating. The webbed target may free themselves by succeeding on an ATHLETICS roll.'
      ),
    ]);
    ui.notifications.info(
      'Poison and Web ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Bat|Shadow/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Hate Sunlight',
        'fell-ability',
        'The creature loses 1 Hate at the start of each round it is exposed to the full light of the sun.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Denizen of the Dark',
        'fell-ability',
        'All attack rolls are Favoured while in darkness.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Fell Speed',
        'fell-ability',
        'At the beginning of each turn, this creature can choose which hero it engages regardless of restrictions, or it can abandon combat entirely.'
      ),
    ]);
    ui.notifications.info(
      'Hate Sunlight, Deizen of the Dark, and Fell Speed ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Huorns/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Wandering Huorn',
        'fell-ability',
        'A wandering Huorn is most often a young tree whose heart darkened rapidly, and who is still quick of limb and root. (The Huorn template below is a Wandering Huorn).'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Denizen of the Dark',
        'fell-ability',
        'A dark-hearted Huorn may be a young tree awakened by a deep hatred, or an ancient monster brooding since uncounted centuries. (Increase Endurance by 15, Add +2 Hate Score, Add +1 Armor, Add +1 to Bough Lash Rating, Add Fell Ability Horrible Strength).'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Fell Speed',
        'fell-ability',
        'A dark-hearted Huorn may be a young tree awakened by a deep hatred, or an ancient monster brooding since uncounted centuries. (Increase Endurance by 25, Add +3 Hate Score, Add +1 to Bough Lash Rating, Remove Fell Ability Hatred, Add Fell Abilities Horrible Strength, Strike Fear, and Thick Hide).'
      ),
    ]);
    ui.notifications.info(
      'Wandering Huorn, Denizen of the Dark, and Fell Speed ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  }

  // Makes sure the actor has the latest data added and displays the new sheet.
  actor.update(npcData);
  const torSheet = Actors.registeredSheets.find(
    x => x.name === 'Tor2eAdversarySheet'
  );
  const sheet = new torSheet(actor);
  sheet.render(true);
}
