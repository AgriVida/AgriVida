import { Router } from 'express'
import {
    getAllRecipesController,
    getRecipeByCuisineController,
    getRecipeByIdController, getRecipesByIngredientController, getRecipesByUserIdController,
    postRecipeController, deleteRecipeController,

} from './recipe.controller.ts'
import {isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'
const basePath = '/apis/recipe' as const

const router = Router ()

router.route('/')
    .post(isLoggedInController, postRecipeController)
    .get(getAllRecipesController)

router.route('/:id')
    .get(getRecipeByIdController)
    .delete(isLoggedInController, deleteRecipeController)

router.route('/userId/:userId')
    .get(getRecipesByUserIdController)

router.route('/cuisine-and-meal-category/:cuisine/:mealCategory')
    .get(getRecipeByCuisineController)

router.route('/ingredient/:ingredient')
    .get(getRecipesByIngredientController)

export const recipeRoute = { basePath, router }


