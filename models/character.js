const {
  calculateProficiencyBonus,
} = require("../public/javascripts/functions.js");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  name: { type: String, required: true, minglength: 1 },
  class: { type: String, required: true },
  race: { type: String, required: true },
  level: { type: Number, required: true },
  background: { type: String, required: false },
  alignment: { type: String, required: true },
  abilityScores: {
    strength: { type: Number, required: true, min: 0 },
    dexterity: { type: Number, required: true, min: 0 },
    constitution: { type: Number, required: true, min: 0 },
    intelligence: { type: Number, required: true, min: 0 },
    wisdom: { type: Number, required: true, min: 0 },
    charisma: { type: Number, required: true, min: 0 },
  },
  savingThrows: {
    strength: { type: Number },
    dexterity: { type: Number },
    constitution: { type: Number },
    intelligence: { type: Number },
    wisdom: { type: Number },
    charisma: { type: Number },
  },
  proficiencyBonus: { type: Number },
  skillProficiencies: [{ type: String }],
  savingThrowProficiencies: [{ type: String }],
  otherProficiencies: [{ type: String }],
  languages: [{ type: String }],
  inspiration: { type: Number },
  combatStats: {
    spells: [{ type: String }],
    armorClass: { type: Number, required: true },
    initiative: { type: Number, required: true },
    speed: { type: Number, required: true },
    maxHP: { type: Number, required: true },
    currentHP: { type: Number },
    temporaryHP: { type: Number },
    hitDice: { type: Number },
    equipment: [{ type: String }],
  },
  personality: {
    personalityTraits: { type: String },
    ideals: { type: String },
    bonds: { type: String },
    flaws: { type: String },
  },
  appearance: {
    age: { type: Number, required: false },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    eyes: { type: String, required: false },
    skin: { type: String, required: false },
    hair: { type: String, required: false },
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CharacterSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtuals for modifiers
CharacterSchema.virtual("strengthModifier").get(function () {
  return Math.floor((this.abilityScores.strength - 10) / 2);
});

CharacterSchema.virtual("dexterityModifier").get(function () {
  return Math.floor((this.abilityScores.dexterity - 10) / 2);
});

CharacterSchema.virtual("constitutionModifier").get(function () {
  return Math.floor((this.abilityScores.constitution - 10) / 2);
});

CharacterSchema.virtual("intelligenceModifier").get(function () {
  return Math.floor((this.abilityScores.intelligence - 10) / 2);
});

CharacterSchema.virtual("wisdomModifier").get(function () {
  return Math.floor((this.abilityScores.wisdom - 10) / 2);
});

CharacterSchema.virtual("charismaModifier").get(function () {
  return Math.floor((this.abilityScores.charisma - 10) / 2);
});

// Virtuals for skills
const skills = [
  { name: "acrobatics", ability: "dexterity" },
  { name: "animalHandling", ability: "wisdom" },
  { name: "arcana", ability: "intelligence" },
  { name: "athletics", ability: "strength" },
  { name: "deception", ability: "charisma" },
  { name: "history", ability: "intelligence" },
  { name: "insight", ability: "wisdom" },
  { name: "intimidation", ability: "charisma" },
  { name: "investigation", ability: "intelligence" },
  { name: "medicine", ability: "wisdom" },
  { name: "nature", ability: "intelligence" },
  { name: "perception", ability: "wisdom" },
  { name: "performance", ability: "charisma" },
  { name: "persuasion", ability: "charisma" },
  { name: "religion", ability: "intelligence" },
  { name: "sleightOfHand", ability: "dexterity" },
  { name: "stealth", ability: "dexterity" },
  { name: "survival", ability: "wisdom" },
];

skills.forEach((skill) => {
  CharacterSchema.virtual(skill.name).get(function () {
    const abilityModifier = Math.floor(
      (this.abilityScores[skill.ability] - 10) / 2
    );
    if (this.skillProficiencies.includes(skill.name))
      return abilityModifier + this.proficiencyBonus;
    else return abilityModifier;
  });
});

CharacterSchema.virtual("CalculateProficiencyBonus").get(function () {
  // if (this.level >= 17) return 6;
  // if (this.level >= 13) return 5;
  // if (this.level >= 9) return 4;
  // if (this.level >= 5) return 3;
  // return 2;
  return calculateProficiencyBonus(this.level);
});

CharacterSchema.set("toJSON", { virtuals: true });
CharacterSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Character", CharacterSchema);
