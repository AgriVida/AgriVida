import type { Request, Response } from 'express'

import {
    type Recipe,
    insertRecipe,
    recipeSchema
} from './recipe.model.ts'
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";


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
   // export async function getRecipeByRecipeIdcontroller(request: Request, response: Response): Promise<void> {
   //     try {
   //         const validationResult = RecipeSchema.pick({ id:true}).safeParse({ id: request.params.RecipeId })
   //         if (!validationResult.success) {
   //             return
   //         }
   //         const { id}


