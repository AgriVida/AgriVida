import { Router } from 'express'
import {
    postRecipeController,

} from './recipe.controller.ts'
import {isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'
const basePath = '/apis/recipe' as const

const router = Router ()

router.route('/')
    .post(isLoggedInController, postRecipeController)

export const recipeRoute = { basePath, router }


