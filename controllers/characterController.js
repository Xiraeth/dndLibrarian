const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const Character = require("../models/character");
const User = require("../models/user");
const {
  calculateProficiencyBonus,
  decideSavingThrowsProficiencies,
  decideLanguages,
} = require("../public/javascripts/functions.js");

const ABILITIES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

// exports.renderCharacters = asyncHandler(async (req, res, next) => {
//   res.render("myCharacters", { title: "My characters" });
// });

exports.renderCharacter = asyncHandler(async (req, res, next) => {
  const characterId = req.params.id;
  const character = await Character.findById(characterId);
  const user = req.user;

  if (!user) {
    res.redirect("/");
  }

  const allUserCharacters = await Character?.find({
    _id: { $in: user.characters },
  });

  res.render("characterPage", {
    character,
    allUserCharacters,
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
      if (value === "") throw new Error("Name cannot be empty.");
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
      if (value > 20) throw new Error("Level cannot be more than 20.");
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
  body("armorClassInput")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Armor class' must be a positive integer.");
      return true;
    })
    .escape(),
  body("speedInput")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Speed' must be a positive integer.");
      return true;
    })
    .escape(),
  body("initiativeInput")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Initiative' must be a positive integer.");
      return true;
    })
    .escape(),
  body("hpInput")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Hitpoints' must be a positive integer.");
      return true;
    })
    .escape(),

  asyncHandler(async (req, res) => {
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
      savingThrows: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      proficiencyBonus: 0,
      inspiration: 0,
      skillProficiencies: [],
      savingThrowProficiencies: [],
      otherProficiencies: [],
      languages: [],
      combatStats: {
        spells: [],
        armorClass: req.body.armorClassInput,
        initiative: req.body.initiativeInput,
        speed: req.body.speedInput,
        maxHP: req.body.hpInput,
        currentHP: req.body.hpInput,
        temporaryHP: 0,
        hitDice: req.body.hpInput,
        equipment: [],
      },
      personality: {
        personalityTraits: req.body.personalityTraitsInput,
        ideals: req.body.idealsInput,
        bonds: req.body.bondsInput,
        flaws: req.body.flawsInput,
      },
      appearance: {
        age: req.body.ageInput,
        height: req.body.heightInput,
        weight: req.body.weightInput,
        eyes: req.body.eyesInput,
        skin: req.body.skinInput,
        hair: req.body.hairInput,
      },
      user,
    });

    if (!errors.isEmpty()) {
      res.render("createCharacter", {
        title: "Character creation",
        errors: errors.array(),
        character,
      });
    } else {
      character.proficiencyBonus = calculateProficiencyBonus(character.level);
      character.savingThrowProficiencies = decideSavingThrowsProficiencies(
        character.class
      );

      const savingThrows = {};

      ABILITIES.forEach((ability) => {
        savingThrows[ability] =
          character[`${ability}Modifier`] +
          (character.savingThrowProficiencies.includes(ability)
            ? character.proficiencyBonus
            : 0);
      });
      character.savingThrows = savingThrows;
      character.languages = decideLanguages(character.race);

      try {
        await character.save();
        user.characters.push(character._id);
        await user.save();
        res.redirect("/");
      } catch (err) {
        console.error(err);
        res.status(500).render("createCharacter", {
          title: "Character creation",
          errors: [{ msg: "Internal server error. Please try again." }],
          character,
        });
      }
    }
  }),
];

exports.post_deleteCharacter = asyncHandler(async (req, res) => {
  const characterId = req.params.id;
  const character = await Character.findByIdAndDelete(characterId);

  if (!character) {
    return res.status(404).send("Character not found");
  }

  await User.updateOne(
    { characters: characterId },
    { $pull: { characters: characterId } }
  );

  res.redirect("/");
});

exports.get_editCharacter = asyncHandler(async (req, res) => {
  const characterId = req.params.id;
  const character = await Character.findById(characterId);

  const user = req.user;

  if (!user) {
    res.redirect("/");
  }

  const allUserCharacters = await Character?.find({
    _id: { $in: user.characters },
  });

  res.render("editCharacter", {
    character,
    title: `Edit character ${character.name}`,
    allUserCharacters,
    mode: "edit",
  });
});

exports.post_editCharacter = [
  body("dndName")
    .trim()
    .custom((value) => {
      if (value === "") throw new Error("Name cannot be empty.");
      else if (value.length > 32)
        throw new Error("Name cannot be more than 32 characters long.");
      return true;
    })
    .escape(),
  body("dndClass", "Class field cannot be blank").escape(),
  body("dndRace", "Race field cannot be blank").escape(),
  body("level")
    .trim()
    .custom((value) => {
      if (value <= 0) throw new Error("Level cannot be less than 1.");
      if (value > 20) throw new Error("Level cannot be more than 20.");
      return true;
    })
    .escape(),
  body("dndAlignment", "Alignment field cannot be blank").escape(),
  body("strength")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("constitution")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("dexterity")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("intelligence")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("wisdom")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("charisma")
    .trim()
    .custom((value) => {
      if (value < 0) throw new Error("Ability scores cannot be less than 0.");
      return true;
    })
    .escape(),
  body("armorClass")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Armor class' must be a positive integer.");
      return true;
    })
    .escape(),
  body("speed")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Speed' must be a positive integer.");
      return true;
    })
    .escape(),
  body("initiative")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Initiative' must be a positive integer.");
      return true;
    })
    .escape(),
  body("hitpoints")
    .trim()
    .custom((value) => {
      if (value === "" || value < 0)
        throw new Error("'Hitpoints' must be a positive integer.");
      return true;
    })
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const charId = req.params.id;
    const user = req.user;

    // Find the character by ID
    const character = await Character.findById(charId);

    if (!character) {
      return res.status(404).render("error", {
        message: "Character not found",
        status: 404,
      });
    }

    if (!errors.isEmpty()) {
      return res.render("editCharacter", {
        title: "Edit Character",
        errors: errors.array(),
        character,
      });
    } else {
      try {
        // Update character fields
        character.name = req.body.dndName;
        character.class = req.body.dndClass;
        character.race = req.body.dndRace;
        character.level = req.body.level;
        character.alignment = req.body.dndAlignment;
        character.inspiration = req.body.inspiration;
        character.abilityScores = {
          strength: req.body.strength,
          dexterity: req.body.dexterity,
          constitution: req.body.constitution,
          intelligence: req.body.intelligence,
          wisdom: req.body.wisdom,
          charisma: req.body.charisma,
        };
        character.combatStats = {
          armorClass: req.body.armorClass,
          speed: req.body.speed,
          initiative: req.body.initiative,
          currentHP: req.body.hitpoints,
          maxHP: req.body.hitpoints, // Or handle this differently if required
        };

        // Update calculated fields
        character.proficiencyBonus = calculateProficiencyBonus(character.level);
        character.savingThrowProficiencies = decideSavingThrowsProficiencies(
          character.class
        );

        const savingThrows = {};
        ABILITIES.forEach((ability) => {
          savingThrows[ability] =
            character.abilityScores[`${ability}`] +
            (character.savingThrowProficiencies.includes(ability)
              ? character.proficiencyBonus
              : 0);
        });
        character.savingThrows = savingThrows;
        character.languages = decideLanguages(character.race);

        // Save the character
        await character.save();

        // Update the user document
        const charIndex = user.characters.findIndex(
          (charId) => charId.toString() === character._id.toString()
        );
        if (charIndex !== -1) {
          user.characters[charIndex] = character._id; // Redundant but ensures consistency
        } else {
          user.characters.push(character._id); // Add the character if missing
        }
        await user.save();

        // Redirect to a success page or character's detail view
        res.redirect(`/myCharacters/${character._id}`);
      } catch (err) {
        console.error(err);
        res.status(500).render("editCharacter", {
          title: "Edit Character",
          errors: [{ msg: "Internal server error. Please try again." }],
          character,
        });
      }
    }
  }),
];
