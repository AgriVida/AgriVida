import type {Request, Response} from 'express'
import {z} from 'zod/v4'
import {
    type Review,
    insertReview, ReviewSchema, deleteReview, selectReviewByRecipeId, selectReviewByPrimaryKey
} from "./review.model.ts"
import {zodErrorResponse, serverErrorResponse} from '../../utils/response.utils.ts'
import type {Status} from '../../utils/interfaces/Status'

/**
 * Express controller for creating a new review/tweet
 * @endpoint POST /apis/review
 * @param request an object containing the body with review data
 * @param response an object modeling the response that will be sent to the client
 * @returns response to the client indicating whether the review creation was successful
 */

export async function postReviewController(request: Request, response: Response): Promise<void> {
    try {
        // validate the full review object from the request body

        const validationResult = ReviewSchema.safeParse(request.body)

        // if the validation is unsuccessful, return a preformatted response to the client

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        // get the user from the session

        const user = request.session?.user
        if (!user) {
            response.json({status: 401, message: 'Please login to create a review', data:null})
            return
        }

        // validate that the userId in the request matches the session UserId

        if (validationResult.data.userId !== user.id) {
            response.json({status: 403, message: 'User Id does not match authenticated user', data:null})
            return
        }

        // insert the review into the database

        const message = await insertReview(validationResult.data)

        // return success response

        const status: Status = {
            status:200,
            message,
            data:null
        }
        response.json(status)
    } catch (error:any) {
          console.error(error)
            serverErrorResponse(response, error.message)
        }
    }

/**
 * Express controller for getting a review by its recipeID
 * @endpoint GET /apis/review/:ReviewId
 * @param request an object containing the review ID in params
 * @param response an object modeling the response that will be sent to the client
 * @returns response with the thread data or null if not found
 */

export async function getReviewByRecipeIdController(request: Request, response: Response): Promise<void> {
    try {
        //validate the Review ID from params
        const validationResult = ReviewSchema.pick({recipeId: true}).safeParse({recipeId: request.params.recipeId})

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return

        }

        const {recipeId} = validationResult.data

        //get the review
        const review: Review [] = await selectReviewByRecipeId(recipeId)

        response.json({status: 200, message: null, data: review})
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, error.message)
    }
}

export async function getReviewByPrimaryKeyController(request: Request, response: Response): Promise<void> {
    try {
        console.log("we're here!")
        //validate the Review ID from params
        const validationResult = ReviewSchema.pick({recipeId: true, userId:true}).safeParse({recipeId: request.params.recipeId, userId: request.params.userId})

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return

        }

        const {recipeId, userId} = validationResult.data

        //get the review
        const review = await selectReviewByPrimaryKey(recipeId,userId)

        response.json({status: 200, message: null, data: review})
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, error.message)
    }
}

export async function deleteReviewController(request: Request, response: Response): Promise<void> {
    try {
        //validate the review ID from params
        const validationResult = ReviewSchema.pick({recipeId: true, userId: true}).safeParse({recipeId: request.params.recipeId, userId: request.params.userId})

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {recipeId, userId} = validationResult.data


        //get the user from the session

        const user = request.session?.user
        if (!user) {
            response.json({status: 401, message: 'Please login to delete a review', data:null})
            return
        }

        //check if the review exists and belongs to the user

        const review = await selectReviewByPrimaryKey(recipeId,userId)
        if (review === null) {
            response.json({ status: 404, message: 'Review not found', data:null})
            return
        }

        if (review.userId !== user.id) {
           response.json({ status: 403, message: 'You can only delete your own reviews', data:null})
            return
        }

        //delete the review
        const message = await deleteReview(recipeId, userId)

        response.json({ status: 200, message, data: null })
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, error.message)
    }
}































