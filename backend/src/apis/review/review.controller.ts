import type {Request, Response} from 'express'
import {z} from 'zod/v4'
import {
    type Review,
    insertReview, ReviewSchema,
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
 * Express controller for getting a review by its ID
 * @endpoint GET /apis/review/:ReviewId
 * @param request an object containing the review ID in params
 * @param response an object modeling the response that will be sent to the client
 * @returns response with the thread data or null if not found
 */



































