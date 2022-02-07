///// Parser /////
export function tor2eParser(input) {
  console.log(`TOR2E || tor2eParser() was called`);
  const originalText = input.find('textarea#text-input').val();
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
  console.log(`TOR 2E NPC PARSER || parsing Name`);
  npcData.name = originalTextArr[0];
  console.log(npcData.name);

  // Get description
  console.log(`TOR 2E NPC PARSER || parsing Description`);
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
  console.log(`TOR 2E NPC PARSER || parsing Distinctive Features`);
  const distinctiveFeatureArr = originalText.match(
    /^[A-Z]*[a-z]*, *[A-Z]*[a-z]*$/m
  );
  const [featureOne, featureTwo] = distinctiveFeatureArr[0].split(', ');
  npcData.items.push(buildItem(featureOne, 'trait', ''));
  npcData.items.push(buildItem(featureTwo, 'trait', ''));

  // Gets array containing attribute level, might, resolve, and parry
  console.log(`TOR 2E NPC PARSER || parsing Level, Might, Hate, and Parry`);
  const attEndMigHateParArmArray = originalText.match(/\d{1,3}$/gm);

  // Add level, might, resolve, and parry to npcData
  npcData.data.attributeLevel.value = attEndMigHateParArmArray[0];
  npcData.data.endurance.value = attEndMigHateParArmArray[1];
  npcData.data.endurance.max = attEndMigHateParArmArray[1];
  npcData.data.might.value = attEndMigHateParArmArray[2];
  npcData.data.might.max = attEndMigHateParArmArray[2];
  npcData.data.hate.value = attEndMigHateParArmArray[3];
  npcData.data.hate.max = attEndMigHateParArmArray[3];
  npcData.data.parry.value = attEndMigHateParArmArray[4];

  ///// FELL ABILITIES /////
  console.log(`TOR 2E NPC PARSER || parsing Fell Abilities`);
  let allFellAbilitiesArr = originalText.match(/FELL ABILITIES: (\D*\d*)+/gm);
  allFellAbilitiesArr = allFellAbilitiesArr[0].replace('FELL ABILITIES: ', '');
  allFellAbilitiesArr = allFellAbilitiesArr.split(/\.\n/gm);

  for (let i = 0; i < allFellAbilitiesArr.length; i++) {
    allFellAbilitiesArr[i] = allFellAbilitiesArr[i].replace('\n', ' ');
    // Get name
    const [fellAbilitiesName] = allFellAbilitiesArr[i].split('.');
    console.log(fellAbilitiesName);
    // Get description
    const [, fellAbilitiesDescription] = allFellAbilitiesArr[i].split('.');

    npcData.items.push(
      buildItem(fellAbilitiesName, 'fell-ability', fellAbilitiesDescription)
    );
  }

  Actor.create(npcData);
}

function buildItem(name, type, description) {
  const distinctiveFeatureData = {
    name: '',
    type: 'trait',
    img: 'systems/tor2e/assets/images/icons/distinctive_feature.png',
    data: {
      description: {
        value: '',
        type: 'String',
        label: 'tor2e.common.description',
      },
      group: {
        value: 'distinctiveFeature',
        type: 'String',
        label: 'tor2e.traits.details.traitGroup',
      },
    },
    effects: [],
    flags: {},
  };

  const fellAbilityData = {
    name: '',
    type: 'fell-ability',
    img: 'systems/tor2e/assets/images/icons/adversary_fell-ability.png',
    data: {
      description: {
        value: '',
        type: 'String',
        label: 'tor2e.common.description',
      },
      active: {
        value: false,
        type: 'Boolean',
        label: 'tor2e.fellAbilities.details.active',
      },
      cost: {
        value: 0,
        type: 'Number',
        label: 'tor2e.fellAbilities.details.cost',
      },
    },
    effects: [],
    flags: {},
  };

  if (type === 'trait') {
    distinctiveFeatureData.name = name;
    distinctiveFeatureData.type = type;
    return distinctiveFeatureData;
  } else if (type === 'fell-ability') {
    fellAbilityData.name = name;
    fellAbilityData.type = type;
    fellAbilityData.data.description.value = description;
    return fellAbilityData;
  }
}

// Hooks.on('createItem', () => {
//   console.log(`TOR2e NPC Parser | called on createItem`);
//   console.log(ItemDirectory);
//   for (let i = 0; i < arr.length; i++) {
//     // find item with same name as was just created
//   }
// });
