import { buildItem } from './buildItem.js';

///// Parser /////
export function tor2eParser(input) {
  console.log(`TOR2E | tor2eParser() was called`);

  let originalText = input.find('textarea#text-input').val();
  const originalTextArr = originalText.split('\n');

  const npcData = {
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

  // Gets name and add it to npcData
  console.log(`TOR 2E NPC PARSER | parsing Name`);
  npcData.name = originalTextArr[0];

  // Get description
  console.log(`TOR 2E NPC PARSER | parsing Description`);
  let nameFirst = originalTextArr[0];
  let nameCaps = originalText.match(nameFirst.toUpperCase());
  nameCaps = nameCaps[0];

  if (nameCaps.toLowerCase() === nameFirst.toLowerCase()) {
    const betweenNamesReg = new RegExp(nameFirst + '(\\D)+ ' + nameCaps, 'g');
    const mainDescriptionReg = /^\D*\n/;
    const descriptionArray = originalText.match(mainDescriptionReg);
    let description = descriptionArray[0];

    description = description.replace(/\n/gm, ' ');
    description = description.match(betweenNamesReg);
    description = description[0];
    description = description.replace(`${nameFirst} `, '');
    description = description.replace(` ${nameCaps}`, '');

    npcData.data.description.value = description;
  }

  // Gets Distinctive Features and add them to the items array
  console.log(`TOR 2E NPC PARSER | parsing Distinctive Features`);
  const distinctiveFeatureArr = originalText.match(
    /[A-Z][a-z]+-*[a-z]+, [A-Z]-*[a-z]+/
  );
  const [featureOne, featureTwo] = distinctiveFeatureArr[0].split(', ');
  npcData.items.push(buildItem(featureOne, 'trait'));
  npcData.items.push(buildItem(featureTwo, 'trait'));

  // Gets array containing attribute level, might, resolve, and parry
  console.log(`TOR 2E NPC PARSER | parsing Level, Might, Hate, and Parry`);
  const attEndMigHateParArmArray = originalText.match(/\d+$/gm);

  // Add level, might, resolve, and parry to npcData
  npcData.data.attributeLevel.value = Number(attEndMigHateParArmArray[0]);
  npcData.data.endurance.value = Number(attEndMigHateParArmArray[1]);
  npcData.data.endurance.max = Number(attEndMigHateParArmArray[1]);
  npcData.data.might.value = Number(attEndMigHateParArmArray[2]);
  npcData.data.might.max = Number(attEndMigHateParArmArray[2]);
  npcData.data.hate.value = Number(attEndMigHateParArmArray[3]);
  npcData.data.hate.max = Number(attEndMigHateParArmArray[3]);

  let parryIsDash = false;
  if (/^—/m.test(originalText)) {
    originalText = originalText.replace('—', 0);
    parryIsDash = true;
  } else {
    npcData.data.parry.value = Number(attEndMigHateParArmArray[4]);
  }

  ///// ARMOUR /////
  if (parryIsDash) {
    npcData.items.push(
      buildItem(
        'Armour',
        'armour',
        '',
        0,
        0,
        0,
        Number(attEndMigHateParArmArray[4])
      )
    );
  } else {
    npcData.items.push(
      buildItem(
        'Armour',
        'armour',
        '',
        0,
        0,
        0,
        Number(attEndMigHateParArmArray[5])
      )
    );
  }

  ///// COMBAT PROFICIENCIES /////
  console.log(`TOR 2E NPC PARSER | parsing Combat Proficiencies`);

  const weaponProfReg = /COMBAT PROFICIENCIES: .*\n.*/;

  let weaponProfs = originalText.match(weaponProfReg);
  weaponProfs = weaponProfs[0];
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

    npcData.items.push(
      buildItem(
        weaponName,
        'weapon',
        '',
        Number(weaponSkill),
        Number(weaponDamage),
        Number(weaponInjury)
      )
    );
  }

  ///// FELL ABILITIES /////
  console.log(`TOR 2E NPC PARSER | parsing Fell Abilities`);
  let allFellAbilitiesArr = originalText.match(/FELL ABILITIES: (\D*\d*)+/gm);
  allFellAbilitiesArr = allFellAbilitiesArr[0].replace('FELL ABILITIES: ', '');
  allFellAbilitiesArr = allFellAbilitiesArr.split(/\.\n/gm);

  for (let i = 0; i < allFellAbilitiesArr.length; i++) {
    allFellAbilitiesArr[i] = allFellAbilitiesArr[i].replace('\n', ' ');
    // Get name and description
    const [fellAbilitiesName, fellAbilitiesDescription] =
      allFellAbilitiesArr[i].split('.');

    npcData.items.push(
      buildItem(fellAbilitiesName, 'fell-ability', fellAbilitiesDescription)
    );
  }

  Actor.create(npcData);
}
