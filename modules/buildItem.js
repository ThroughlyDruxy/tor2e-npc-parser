export function buildItem(
  name,
  type,
  description,
  skill,
  damage,
  injury,
  protection
) {
  console.log(`TOR 2E NPC PARSER | started buildItem() with ${name}`);
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

  const weaponData = {
    name: '',
    type: 'weapon',
    img: '',
    data: {
      equipped: {
        value: false,
      },
      damage: {
        value: null,
      },
      injury: {
        value: null,
      },
      group: {
        value: '',
      },
      skill: {
        value: null,
        favoured: {
          value: false,
        },
        roll: {
          associatedAttribute: 'strength',
        },
      },
      ranged: {
        value: false,
        type: 'Boolean',
        short: {
          value: 5,
        },
        medium: {
          value: 10,
        },
        long: {
          value: 20,
        },
      },
      twoHandWeapon: {
        value: false,
      },
      notes: {
        value: '-',
      },
    },
  };

  const armourData = {
    name: 'Armour',
    type: 'armour',
    img: 'systems/tor2e/assets/images/icons/adversary_armour.png',
    data: {
      load: {
        value: 0,
      },
      equipped: {
        value: false,
      },
      protection: {
        value: 0,
      },
      group: {
        value: 'leather',
      },
    },
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
  } else if (type === 'weapon') {
    weaponData.name = name;
    weaponData.type = type;
    weaponData.data.skill.value = skill;
    weaponData.data.damage.value = damage;
    weaponData.data.injury.value = injury;
    // Choose correct image and group
    if (/axe|cudgel|knife|club/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon_close.png';
      weaponData.data.group = 'brawling';
    } else if (/bow/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon_ranged.png';
      weaponData.data.group = 'bows';
    } else if (/crush|bite|touch|claws|fangs/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon_bestial.png';
      weaponData.data.group = 'bestial';
    } else if (/spear/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon-spear.png';
      weaponData.data.group = 'spears';
    } else if (/sword|scimitar|blade/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon-scimitar.png';
      weaponData.data.group = 'swords';
    }
    return weaponData;
  } else if (type === 'armour') {
    armourData.name = 'Armour';
    armourData.data.protection.value = protection;
    return armourData;
  } else {
    console.log(`Type ${type} not found`);
  }
}
