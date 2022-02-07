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

  const itemData = {};

  // Gets name and add it to npcData
  const nameArr = originalText.match(/^[A-Z]*[a-z]* *[A-Z]*[a-z]*$/m);
  npcData.name = nameArr[0];

  // Gets Distinctive Features
  ///// fix this /////
  const distinctiveFeatureArr = originalText.match(
    /^[A-Z]*[a-z]*, *[A-Z]*[a-z]*$/m
  );
  const [featureOne, featureTwo] = distinctiveFeatureArr[0].split(', ');

  // Gets array containing attribute level, might, resolve, and armour
  const attEndMigHateParArmArray = originalText.match(/\d{1,3}$/gm);
  console.log(attEndMigHateParArmArray);

  const [attributeLevel, endurance, might, hate, parry, armour] =
    attEndMigHateParArmArray;

  npcData.data.attributeLevel.value = attEndMigHateParArmArray[0];
  npcData.data.endurance.value = attEndMigHateParArmArray[1];
  npcData.data.endurance.max = attEndMigHateParArmArray[1];
  npcData.data.might.value = attEndMigHateParArmArray[2];
  npcData.data.might.max = attEndMigHateParArmArray[2];
  npcData.data.hate.value = attEndMigHateParArmArray[3];
  npcData.data.hate.max = attEndMigHateParArmArray[3];
  npcData.data.parry.value = attEndMigHateParArmArray[4];

  buildNPC(npcData);
}

function buildNPC(data) {
  Actor.create(data);
}

function buildItem(data) {
  Item.create(data);
}

// Hooks.on('createItem', () => {
//   console.log(`TOR2e NPC Parser | called on createItem`);
//   console.log(ItemDirectory);
//   for (let i = 0; i < arr.length; i++) {
//     // find item with same name as was just created
//   }
// });
