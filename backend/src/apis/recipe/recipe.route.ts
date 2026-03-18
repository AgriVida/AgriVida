import { Router } from 'express'
import {
    getRecipeByIdController,
    postRecipeController,

} from './recipe.controller.ts'
import {isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'
const basePath = '/apis/recipe' as const

const router = Router ()

router.route('/')
    .post(isLoggedInController, postRecipeController)

router.route('/:id')
    .get(getRecipeByIdController)

export const recipeRoute = { basePath, router }


