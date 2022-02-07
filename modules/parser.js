///// Parser /////
export function tor2eParser(input) {
  console.log(`TOR2E || tor2eParser() was called`);
  const originalText = input.find('textarea#text-input').val();

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
  const nameArr = originalText.match(/^[A-Z]*[a-z]* *[A-Z]*[a-z]*$/m);
  npcData.name = nameArr[0];

  // Get description
  let nameFirst = nameArr[0];
  let nameCaps = originalText.match(/^[A-Z]* *[A-Z]*$/m);
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
  const distinctiveFeatureArr = originalText.match(
    /^[A-Z]*[a-z]*, *[A-Z]*[a-z]*$/m
  );
  const [featureOne, featureTwo] = distinctiveFeatureArr[0].split(', ');
  npcData.items.push(buildItem(featureOne, 'trait'));
  npcData.items.push(buildItem(featureTwo, 'trait'));

  // Gets array containing attribute level, might, resolve, and armour
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

  Actor.create(npcData);
}

function buildItem(name, type) {
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

  distinctiveFeatureData.name = name;

  return distinctiveFeatureData;
  console.log(`${distinctiveFeatureData} added to actor`);
}

// Hooks.on('createItem', () => {
//   console.log(`TOR2e NPC Parser | called on createItem`);
//   console.log(ItemDirectory);
//   for (let i = 0; i < arr.length; i++) {
//     // find item with same name as was just created
//   }
// });
