const calculateProficiencyBonus = (level) => {
  return 2 + Math.floor((level - 1) / 4);
};

const decideSavingThrowsProficiencies = (dndClass) => {
  switch (dndClass?.toLowerCase()) {
    case "barbarian":
      return ["strength", "constitution"];
    case "bard":
      return ["dexterity", "charisma"];
    case "cleric":
      return ["wisdom", "charisma"];
    case "druid":
      return ["intelligence", "wisdom"];
    case "fighter":
      return ["strength", "constitution"];
    case "monk":
      return ["strength", "dexterity"];
    case "paladin":
      return ["wisdom", "charisma"];
    case "ranger":
      return ["strength", "dexterity"];
    case "rogue":
      return ["dexterity", "intelligence"];
    case "sorcerer":
      return ["constitution", "charisma"];
    case "warlock":
      return ["wisdom", "charisma"];
    case "wizard":
      return ["intelligence", "wisdom"];
    default:
      throw new Error("Invalid class name");
  }
};

const decideLanguages = (race) => {
  switch (race?.toLowerCase()) {
    case "dwarf":
      return ["Common", "Dwarvish"];
    case "elf":
      return ["Common", "Elvish"];
    case "halfling":
      return ["Common", "Halfling"];
    case "human":
      return ["Common", "one of your choice"];
    case "dragonborn":
      return ["Common", "Draconic"];
    case "gnome":
      return ["Common", "Gnomish"];
    case "half-elf":
      return ["Common", "Elvish", "two others of your choice"];
    case "half-orc":
      return ["Common", "Orc"];
    case "tiefling":
      return ["Common", "Infernal"];
    case "custom":
      return ["Common"];
    default:
      throw new Error("Invalid race");
  }
};

module.exports = {
  calculateProficiencyBonus,
  decideSavingThrowsProficiencies,
  decideLanguages,
};
