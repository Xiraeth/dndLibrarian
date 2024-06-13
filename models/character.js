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
  spells: [{ type: String }],
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
  return { value: this.skills.acrobatics, score: "Dexterity" };
});

CharacterSchema.virtual("animalHandling").get(function () {
  return { value: this.skills.animalHandling, score: "Wisdom" };
});

CharacterSchema.virtual("arcana").get(function () {
  return { value: this.skills.arcana, score: "Intelligence" };
});

CharacterSchema.virtual("athletics").get(function () {
  return { value: this.skills.athletics, score: "Strength" };
});

CharacterSchema.virtual("deception").get(function () {
  return { value: this.skills.deception, score: "Charisma" };
});

CharacterSchema.virtual("history").get(function () {
  return { value: this.skills.history, score: "Intelligence" };
});

CharacterSchema.virtual("insight").get(function () {
  return { value: this.skills.insight, score: "Wisdom" };
});

CharacterSchema.virtual("intimidation").get(function () {
  return { value: this.skills.intimidation, score: "Charisma" };
});

CharacterSchema.virtual("investigation").get(function () {
  return { value: this.skills.investigation, score: "Intelligence" };
});

CharacterSchema.virtual("medicine").get(function () {
  return { value: this.skills.medicine, score: "Wisdom" };
});

CharacterSchema.virtual("nature").get(function () {
  return { value: this.skills.nature, score: "Intelligence" };
});

CharacterSchema.virtual("perception").get(function () {
  return { value: this.skills.perception, score: "Wisdom" };
});

CharacterSchema.virtual("performance").get(function () {
  return { value: this.skills.performance, score: "Charisma" };
});

CharacterSchema.virtual("persuasion").get(function () {
  return { value: this.skills.persuasion, score: "Charisma" };
});

CharacterSchema.virtual("religion").get(function () {
  return { value: this.skills.religion, score: "Intelligence" };
});

CharacterSchema.virtual("sleightOfHand").get(function () {
  return { value: this.skills.sleightOfHand, score: "Dexterity" };
});

CharacterSchema.virtual("stealth").get(function () {
  return { value: this.skills.stealth, score: "Dexterity" };
});

CharacterSchema.virtual("survival").get(function () {
  return { value: this.skills.survival, score: "Wisdom" };
});

CharacterSchema.set("toJSON", { virtuals: true });
CharacterSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Character", CharacterSchema);
