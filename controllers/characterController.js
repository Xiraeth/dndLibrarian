const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const Character = require("../models/character");
const User = require("../models/user");

exports.renderCharacters = asyncHandler(async (req, res, next) => {
  res.render("myCharacters", { title: "My characters" });
});

exports.renderCharacter = asyncHandler(async (req, res, next) => {
  const characterId = req.params.id;
  const character = await Character.findById(characterId);

  console.log(character);
  res.render("characterPage", {
    character,
    title: `My characters - ${character.name}`,
  });
});

exports.get_createCharacter = asyncHandler(async (req, res, next) => {
  res.render("createCharacter", { title: "Character creation" });
});

exports.post_createCharacter = [
  body("dndName")
    .trim()
    .custom((value) => {
      if (value.length === 0) throw new Error("Name cannot be empty.");
      else if (value.length > 32)
        throw new Error("Name cannot be more than 32 characters long.");
      return true;
    })
    .escape(),
  body("dndClass", "Class field cannot be blank").escape(),
  body("dndRace", "Race field cannot be blank").escape(),
  body("dndLevel")
    .trim()
    .custom((value) => {
      if (value <= 0) throw new Error("Level cannot be less than 1.");
      return true;
    })
    .escape(),
  body("dndAlignment", "Alignment field cannot be blank").escape(),
  body("strengthInput")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("constitutionInput")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("dexterityInput")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("intelligenceInput")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("wisdomInput")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("charismaInput")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = req.user;

    const character = new Character({
      name: req.body.dndName,
      class: req.body.dndClass,
      race: req.body.dndRace,
      level: req.body.dndLevel,
      background: req.body.dndBackground,
      alignment: req.body.dndAlignment,
      abilityScores: {
        strength: req.body.strengthInput,
        dexterity: req.body.dexterityInput,
        constitution: req.body.constitutionInput,
        intelligence: req.body.intelligenceInput,
        wisdom: req.body.wisdomInput,
        charisma: req.body.charismaInput,
      },
      spells: [],
      age: req.body.ageInput,
      height: req.body.heightInput,
      weight: req.body.weightInput,
      eyes: req.body.eyesInput,
      skin: req.body.skinInput,
      hair: req.body.hairInput,
      user,
    });

    if (!errors.isEmpty()) {
      res.render("createCharacter", {
        title: "Character creation",
        errors: errors.array(),
        character,
      });
    } else {
      await character.save();
      user.characters.push(character._id);
      await user.save();
      res.redirect("/");
    }
  }),
];
