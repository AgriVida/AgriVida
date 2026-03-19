import {type Request, response, type Response} from 'express'

import {
    type Recipe,
    insertRecipe,
    recipeSchema, selectRecipeById, selectRecipesByUserId, selectRecipeByCuisineAndMealCategory
} from './recipe.model.ts'
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import {request} from "node:http";


export async function postRecipeController(request: Request, response: Response): Promise<void> {
   try {
       // validate the full recipe object from the request body
       const validationResult = recipeSchema.safeParse(request.body)
       if (!validationResult.success) {
           zodErrorResponse(response, validationResult.error)
           return
       }
       const user = request.session?.user
       if (!user) {
           response.json({status: 401, message: 'Please login to create a recipe', data: null})
           return
       }
       if (validationResult.data.userId !== user.id) {
           response.json({status: 403, message: 'User Id in request does not match authenticated user', data: null})
           return
       }
       const message = await insertRecipe(validationResult.data)
       const status: Status = {
           status: 200,
           message,
           data: null
       }
       response.json(status)
   } catch (error: any) {
       console.error(error)
       serverErrorResponse(response, error.message)
   }
   }

   export async function getRecipeByIdController(request: Request, response: Response): Promise<void> {
       try {
           const validationResult = recipeSchema.pick({id: true}).safeParse({id: request.params.id})
           if (!validationResult.success) {
               return
           }
           const {id} = validationResult.data

           // get the recipe
           const recipe: Recipe | null = await selectRecipeById(id)

           response.json({status: 200, message: null, data: recipe})
       } catch (error: any) {
           console.error(error)
           serverErrorResponse(response, error.message)
       }
   }

export async function getRecipesByUserIdController(request: Request, response: Response): Promise<void> {
    try {
        const validationResult = recipeSchema.pick({userId: true}).safeParse({userId: request.params.userId})
        if (!validationResult.success) {
            return
        }
        const {userId} = validationResult.data

        // get the recipe
        const recipes: Recipe[] = await selectRecipesByUserId(userId)

        response.json({status: 200, message: null, data: recipes})
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, error.message)
    }
}

export async function getRecipeByCuisineController(request: Request, response: Response): Promise<void> {
        try {
        const validationResult = recipeSchema.pick({cuisine: true, mealCategory: true}).safeParse({cuisine: request.params.cuisine, mealCategory: request.params.mealCategory})
            if (!validationResult.success) {
                console.log(validationResult)
            return
        }
        const {cuisine, mealCategory} = validationResult.data

        // get the recipe
        const recipes: Recipe[] = await selectRecipeByCuisineAndMealCategory(cuisine, mealCategory)

        response.json({status: 200, message: null, data: recipes})
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, error.message)
    }
}

