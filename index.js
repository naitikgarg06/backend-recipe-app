const express = require("express");
const app = express();

const { initialiseDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");

app.use(express.json());
initialiseDatabase();

// create and add new recipe to db

async function createNewRecipe(recipeData) {
  try {
    const newRecipe = new Recipe(recipeData);
    const savedRecipe = newRecipe.save();
    return savedRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const recipe = await createNewRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add recipe." });
  }
});

// get all recipes

async function readAllRecipes() {
  try {
    const allRecipes = await Recipe.find();
    return allRecipes;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();
    if (recipes.length != 0) {
      res.status(200).json(recipes);
    } else {
      res.status(404).json({ error: "No recipe found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// get recipe details by its title

async function readRecipeByTitle(recipeTitle) {
  try {
    const recipe = await Recipe.findOne({ title: recipeTitle });
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:title", async (req, res) => {
  try {
    const recipeByTitle = await readRecipeByTitle(req.params.title);

    if (!recipeByTitle) {
      res.status(404).json({ error: "Recipe does not exist" });
    }

    res.json(recipeByTitle);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// get all recipes of an author

async function readRecipesByAuthor(authorName) {
  try {
    const recipes = await Recipe.find({ author: authorName });
    return recipes;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await readRecipesByAuthor(req.params.authorName);
    if (recipes.length != 0) {
        res.status(200).json(recipes)
    }

    res.status(404).json({error: "No recipe found"})
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// get recipes by level

async function readRecipesByLevel(levelType){
    try {
        const recipes = await Recipe.find({difficulty: levelType})
        return recipes
    } catch (error) {
        throw error
    }
}

app.get("/recipes/difficulty/:difficultyType", async (req, res) => {
    try {
        const recipes = await readRecipesByLevel(req.params.difficultyType)
        if(recipes.length != 0 ){
            res.status(200).json(recipes)
        }

        res.status(404).json({error: "No recipe found"})
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipe"})
    }
})

// update recipe by id

async function updateRecipeDetailsById(recipeId, dataToUpdate){
  try {
    const recipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, { new: true })
    return recipe
  } catch (error) {
    throw error
  }
}

app.post("/recipes/:id", async (req, res) => {
  try {
    const recipe = await updateRecipeDetailsById(req.params.id, req.body)
    if(!recipe){
      res.status(404).json({error: "Recipe not found"})
    }

    res.json({message: "Recipe updated successfully", recipe: recipe})
  } catch (error) {
    res.status(500).json({error: "Failed to update recipe"})
  }
})

// update recipe details by it's title

async function updateRecipeDetailsByTitle(recipeTitle, dataToUpdate){
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, { new: true })
    return updatedRecipe
  } catch (error) {
    throw error
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const newRecipe = await updateRecipeDetailsByTitle(req.params.recipeTitle, req.body)
    if(!newRecipe){
      res.status(404).json({error: "Recipe not found"})
    }

    res.json({message: "Recipe updated successfully", recipe: newRecipe})
  } catch (error) {
    res.status(500).json({error: "Failed to update recipe"})
  }
})

// delete recipe

async function deleteRecipeById(recipeId){
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
    return deletedRecipe
  } catch (error) {
    throw error
  }
}

app.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipeById(req.params.id)
    if(!deletedRecipe){
      res.status(404).json({error: "Recipe not found"})
    }

    res.json({message: "Recipe deleted successfully"})
  } catch (error) {
    res.status(500).json({error: "Failed to delete recipe"})
  }
})

// listen requests

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
