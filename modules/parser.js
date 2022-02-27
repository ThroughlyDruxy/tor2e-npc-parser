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

  ///// NAME /////
  const [nameFirst] = originalText.split('\n');
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

  ///// ATTRIBUTE LEVEL /////
  const attributeLevelReg = /ATTRIBUTE LEVEL\n\d+/i;
  const attributeLevel = originalText
    .match(attributeLevelReg)[0]
    .match('\\d+')[0];

  npcData.data.attributeLevel.value = Number(attributeLevel);

  ///// ENDURANCE /////
  // const endReg = /ENDURANCE\n\d+/i;
  const endurance = originalText.match(/ENDURANCE\n\d+/i)[0].match('\\d+')[0];
  npcData.data.endurance.value = endurance;
  npcData.data.endurance.max = endurance;

  ///// MIGHT /////
  const mightReg = /MIGHT\n\d+/i;
  const might = originalText.match(mightReg)[0].match('\\d+')[0];
  npcData.data.might.value = Number(might);
  npcData.data.might.max = Number(might);

  ///// HATE /////
  const hateReg = /(RESOLVE|HATE)\n\d+/i;
  const hate = originalText.match(hateReg)[0].match('\\d+')[0];
  npcData.data.hate.value = Number(hate);
  npcData.data.hate.max = Number(hate);

  ///// PARRY /////
  const parryReg = /PARRY\n(\+\d|—)/i;
  const parry = originalText.match(parryReg)[0].match('\\d+|—')[0];
  Number(parry)
    ? (npcData.data.parry.value = Number(parry))
    : (npcData.data.parry.value = 0);

  let actor = await Actor.create(npcData);

  ///// ARMOUR /////
  const armourReg = /ARMOUR\n\d/i;
  const armour = originalText.match(armourReg)[0].match('\\d')[0];

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

  const weaponProfReg = /COMBAT PROFICIENCIES: .*(,|\.)\n.*/i;

  let [weaponProfs] = originalText.match(weaponProfReg);
  weaponProfs = weaponProfs.split(/\),|\.\n/);

  for (let i = 0; i < weaponProfs.length; i++) {
    if (/COMBAT PROFICIENCIES/i.test(weaponProfs[i])) {
      weaponProfs[i] = weaponProfs[i].replace(/COMBAT PROFICIENCIES: /i, '');
    }
    // Weapon name
    let [weaponName] = weaponProfs[i].match(/\D*/);
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
    .match(/FELL ABILITIES: (\D*\d*)+/gim)[0]
    .replace(/FELL ABILITIES: /i, '')
    .split(/\.\n/gm);

  for (let i = 0; i < allFellAbilitiesArr.length; i++) {
    const [fellAbilitiesName, fellAbilitiesDescription] = allFellAbilitiesArr[i]
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
