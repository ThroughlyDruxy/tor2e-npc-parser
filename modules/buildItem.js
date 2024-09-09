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
    system: {
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
    system: {
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
    system: {
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
    system: {
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
    fellAbilityData.system.description.value = description;
    return fellAbilityData;
  } else if (type === 'weapon') {
    weaponData.name = name;
    weaponData.type = type;
    weaponData.system.skill.value = skill;
    weaponData.system.damage.value = damage;
    weaponData.system.injury.value = injury;
    // Choose correct image and group
    if (/axe|cudgel|knife|club/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon_close.png';
      weaponData.system.group = 'brawling';
    } else if (/bow/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon_ranged.png';
      weaponData.system.group = 'bows';
    } else if (/crush|bite|touch|claws|fangs/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon_bestial.png';
      weaponData.system.group = 'bestial';
    } else if (/spear/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon-spear.png';
      weaponData.system.group = 'spears';
    } else if (/sword|scimitar|blade/i.test(name)) {
      weaponData.img =
        'systems/tor2e/assets/images/icons/adversary_weapon-scimitar.png';
      weaponData.system.group = 'swords';
    }
    return weaponData;
  } else if (type === 'armour') {
    armourData.name = 'Armour';
    armourData.system.protection.value = protection;
    return armourData;
  } else {
    console.log(`Type ${type} not found`);
  }
}
