import {Router} from 'express'
import {
    postReviewController,
    // deleteReviewController,
    getReviewByRecipeIdController, getReviewByPrimaryKeyController, deleteReviewController,

} from './review.controller.ts'

import { isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts"

const basepath = '/apis/review' as const
const router = Router()

/**
 * POST /apis/review
 * Create a new review/tweet (requires authentication)
 */

router.route('/')
.post(isLoggedInController, postReviewController)

/**
 * GET /apis/review/:recipeId-userId
 * Get a specific review by its ID
 *
 * DELETE /apis/review/:recipeId-userId
 * Delete a thread by its ID (requires authentication and ownership)
 */
router.route('/recipeId-userId/:recipeId/:userId')
    .get(getReviewByPrimaryKeyController)
    .delete(isLoggedInController, deleteReviewController)

router.route('/recipeId/:recipeId')
    .get(getReviewByRecipeIdController)

export const reviewRoute = {basepath, router}











