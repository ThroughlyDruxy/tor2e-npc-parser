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
  const originalTextArr = originalText.split('\n');

  ///// NAME /////
  console.log(`TOR 2E NPC PARSER | parsing Name`);
  npcData.name = originalTextArr[0];

  ///// DESCRIPTION /////
  console.log(`TOR 2E NPC PARSER | parsing Description`);
  let nameFirst = originalTextArr[0];
  let [nameCaps] = originalText.match(nameFirst.toUpperCase());

  if (nameCaps.toLowerCase() === nameFirst.toLowerCase()) {
    const betweenNamesReg = new RegExp(nameFirst + '(\\D)+ ' + nameCaps, 'g');
    const mainDescriptionReg = /^\D*\n/;
    let description = originalText
      .match(mainDescriptionReg)[0]
      .replace(/\n/gm, ' ')
      .match(betweenNamesReg)[0]
      .replace(`${nameFirst} `, '')
      .replace(` ${nameCaps}`, '');

    npcData.data.description.value = description;
  }

  //// ATTRIBUTE LEVEL, MIGHT, HATE, PARRY, ARMOUR /////
  console.log(`TOR 2E NPC PARSER | parsing Level, Might, Hate, and Parry`);
  const attEndMigHateParArmArray = originalText.match(/\d+$/gm);

  // Add level, might, resolve, and parry to npcData
  const [attributeLevel, endurance, might, hate] = attEndMigHateParArmArray;
  npcData.data.attributeLevel.value = Number(attributeLevel);
  npcData.data.endurance.value = Number(endurance);
  npcData.data.endurance.max = Number(endurance);
  npcData.data.might.value = Number(might);
  npcData.data.might.max = Number(might);
  npcData.data.hate.value = Number(hate);
  npcData.data.hate.max = Number(hate);

  let parryIsDash = false;
  if (/^—/m.test(originalText)) {
    originalText = originalText.replace('—', 0);
    parryIsDash = true;
  } else {
    npcData.data.parry.value = Number(attEndMigHateParArmArray[4]);
  }

  let actor = await Actor.create(npcData);

  ///// ARMOUR /////
  if (parryIsDash) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Armour',
        'armour',
        '',
        0,
        0,
        0,
        Number(attEndMigHateParArmArray[4])
      ),
    ]);
  } else {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Armour',
        'armour',
        '',
        0,
        0,
        0,
        Number(attEndMigHateParArmArray[5])
      ),
    ]);
  }

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
  console.log(`TOR 2E NPC Parser | weaponProfs ${weaponProfs}`);

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
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        fellAbilitiesName,
        'fell-ability',
        fellAbilitiesDescription + '.'
      ),
    ]);
  }
}
