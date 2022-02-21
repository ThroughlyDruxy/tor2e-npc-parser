import { buildItem } from './buildItem.js';

///// Parser /////
export async function tor2eParser(input) {
  console.log(`TOR2E | tor2eParser() was called`);

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

  let originalText = input.find('textarea#text-input').val();
  const [nameFirst] = originalText.split('\n');

  ///// NAME /////
  console.log(`TOR 2E NPC PARSER | parsing Name`);
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
      const mainDescriptionReg = /^\D*\n/;
      let description = originalText
        .match(mainDescriptionReg)[0]
        .replace(/\n/gm, ' ');
      console.log(description.match(betweenNamesReg));

      if (description.match(betweenNamesReg)) {
        npcData.data.description.value = description
          .match(betweenNamesReg)[0]
          .replace(`${nameFirst} `, '')
          .replace(` ${nameCaps}`, '');
      } else {
        ui.notifications.error(
          game.i18n.localize(
            'TOR2E-NPC-PARSER.notifications.descriptionNotFound'
          )
        );
      }
    }
  } else {
    ui.notifications.error(
      game.i18n.localize('TOR2E-NPC-PARSER.notifications.descriptionNotFound')
    );
  }

  //// ATTRIBUTE LEVEL, MIGHT, HATE, PARRY, ARMOUR /////
  console.log(
    `TOR 2E NPC PARSER | parsing Level, Endurance, Might, Hate, Parry, and Armour`
  );

  const attEndMigHateParArmArray = originalText.match(/^–*—*\+*\d*$/gm);

  // Add level, endurance, might, resolve, and parry to npcData
  const [attributeLevel, endurance, might, hate, parry, armour] =
    attEndMigHateParArmArray;
  npcData.data.attributeLevel.value = Number(attributeLevel);
  npcData.data.endurance.value = Number(endurance);
  npcData.data.endurance.max = Number(endurance);
  npcData.data.might.value = Number(might);
  npcData.data.might.max = Number(might);
  npcData.data.hate.value = Number(hate);
  npcData.data.hate.max = Number(hate);

  console.log(attEndMigHateParArmArray);
  if (/\d/.test(parry)) {
    npcData.data.parry.value = Number(attEndMigHateParArmArray[4]);
  } else {
    npcData.data.parry.value = 0;
  }

  let actor = await Actor.create(npcData);

  ///// ARMOUR /////
  actor.createEmbeddedDocuments('Item', [
    buildItem('Armour', 'armour', '', 0, 0, 0, Number(armour)),
  ]);

  ///// DISTINCTIVE FEATURES /////
  console.log(`TOR 2E NPC PARSER | parsing Distinctive Features`);
  const distinctiveFeatureArr = originalText.match(
    /[A-Z][a-z]+-*[a-z]+, [A-Z][a-z]+-*[a-z]+/
  );
  const [featureOne, featureTwo] = distinctiveFeatureArr[0].split(', ');
  actor.createEmbeddedDocuments('Item', [buildItem(featureOne, 'trait')]);
  actor.createEmbeddedDocuments('Item', [buildItem(featureTwo, 'trait')]);

  ///// COMBAT PROFICIENCIES /////
  console.log(`TOR 2E NPC PARSER | parsing Combat Proficiencies`);

  const weaponProfReg = /COMBAT PROFICIENCIES: .*\n.*/;

  let [weaponProfs] = originalText.match(weaponProfReg);
  weaponProfs = weaponProfs.split('),');

  for (let i = 0; i < weaponProfs.length; i++) {
    if (/COMBAT PROFICIENCIES/.test(weaponProfs[i])) {
      weaponProfs[i] = weaponProfs[i].replace('COMBAT PROFICIENCIES: ', '');
    }
    // Weapon name
    let [weaponName] = weaponProfs[i].match('\\D*');
    const wepSkillDamageInjuryReg = /\d+/g;
    // Weapon skill, damage, and injury
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

  ///// FELL ABILITIES /////
  console.log(`TOR 2E NPC PARSER | parsing Fell Abilities`);
  let allFellAbilitiesArr = originalText
    .match(/FELL ABILITIES: (\D*\d*)+/gm)[0]
    .replace('FELL ABILITIES: ', '')
    .split(/\.\n/gm);

  for (let i = 0; i < allFellAbilitiesArr.length; i++) {
    const [fellAbilitiesName, fellAbilitiesDescription] = allFellAbilitiesArr[i]
      .replace('\n', ' ')
      .split('.');

    console.log(fellAbilitiesName, fellAbilitiesDescription);

    if (typeof fellAbilitiesDescription !== 'undefined') {
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          fellAbilitiesName,
          'fell-ability',
          fellAbilitiesDescription + '.'
        ),
      ]);
    } else {
      ui.notifications.error(
        game.i18n.localize(
          'TOR2E-NPC-PARSER.notifications.fellAbilitiesNotFound'
        )
      );
    }
  }

  ///// FELL ABILITIES BY TYPE /////
  if (npcData.name.match('Orc|Goblin')) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Hate Sunlight',
        'fell-ability',
        'Description can be found on page 148'
      ),
    ]);
    ui.notifications.info(
      'Hate Sunlight ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (npcData.name.match('troll|Troll')) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Hideous Toughness',
        'fell-ability',
        'Description can be found on page 151'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Dull-witted',
        'fell-ability',
        'Description can be found on page 151'
      ),
    ]);
    ui.notifications.info(
      'Hideous Toughness and Dull-witted ' +
        game.i18n.localize('TOR2E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (npcData.name.match('wight|Marsh|Wraith')) {
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
  } else if (npcData.name.match('Wolf|Hound')) {
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
  }
}
