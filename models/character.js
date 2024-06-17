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
  spells: [{ type: String }],
  inspiration: { type: Number },
  armorClass: { type: Number },
  initiative: { type: Number },
  speed: { type: Number },
  maxHP: { type: Number },
  currentHP: { type: Number },
  temporaryHP: { type: Number },
  hitDice: { type: Number },
  equipment: [{ type: String }],
  personalityTraits: { type: String },
  ideals: { type: String },
  bonds: { type: String },
  flaws: { type: String },
  age: { type: Number, required: false },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  eyes: { type: String, required: false },
  skin: { type: String, required: false },
  hair: { type: String, required: false },
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
CharacterSchema.virtual("acrobatics").get(function () {
  return Math.floor((this.abilityScores.dexterity - 10) / 2);
});

CharacterSchema.virtual("animalHandling").get(function () {
  return Math.floor((this.abilityScores.wisdom - 10) / 2);
});

CharacterSchema.virtual("arcana").get(function () {
  return Math.floor((this.abilityScores.intelligence - 10) / 2);
});

CharacterSchema.virtual("athletics").get(function () {
  return Math.floor((this.abilityScores.strength - 10) / 2);
});

CharacterSchema.virtual("deception").get(function () {
  return Math.floor((this.abilityScores.charisma - 10) / 2);
});

CharacterSchema.virtual("history").get(function () {
  return Math.floor((this.abilityScores.intelligence - 10) / 2);
});

CharacterSchema.virtual("insight").get(function () {
  return Math.floor((this.abilityScores.wisdom - 10) / 2);
});

CharacterSchema.virtual("intimidation").get(function () {
  return Math.floor((this.abilityScores.charisma - 10) / 2);
});

CharacterSchema.virtual("investigation").get(function () {
  return Math.floor((this.abilityScores.intelligence - 10) / 2);
});

CharacterSchema.virtual("medicine").get(function () {
  return Math.floor((this.abilityScores.wisdom - 10) / 2);
});

CharacterSchema.virtual("nature").get(function () {
  return Math.floor((this.abilityScores.intelligence - 10) / 2);
});

CharacterSchema.virtual("perception").get(function () {
  return Math.floor((this.abilityScores.wisdom - 10) / 2);
});

CharacterSchema.virtual("performance").get(function () {
  return Math.floor((this.abilityScores.charisma - 10) / 2);
});

CharacterSchema.virtual("persuasion").get(function () {
  return Math.floor((this.abilityScores.charisma - 10) / 2);
});

CharacterSchema.virtual("religion").get(function () {
  return Math.floor((this.abilityScores.intelligence - 10) / 2);
});

CharacterSchema.virtual("sleightOfHand").get(function () {
  return Math.floor((this.abilityScores.dexterity - 10) / 2);
});

CharacterSchema.virtual("stealth").get(function () {
  return Math.floor((this.abilityScores.dexterity - 10) / 2);
});

CharacterSchema.virtual("survival").get(function () {
  return Math.floor((this.abilityScores.wisdom - 10) / 2);
});

CharacterSchema.virtual("CalculateProficiencyBonus").get(function () {
  if (this.level >= 17) return 6;
  if (this.level >= 13) return 5;
  if (this.level >= 9) return 4;
  if (this.level >= 5) return 3;
  return 2;
});

CharacterSchema.set("toJSON", { virtuals: true });
CharacterSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Character", CharacterSchema);
