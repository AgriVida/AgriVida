import {Router} from 'express'
import {
    getFriendsController,
    postFriendController,
    postFriendByEmailController,
    putFriendController,
    deleteFriendController,
} from './friend.controller.ts'

import { isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts"

const basepath = '/apis/friend' as const
const router = Router()

/**
 * GET /apis/friend
 * Get accepted friends and pending requests for the logged-in user
 *
 * POST /apis/friend
 * Request new friend by user IDs (requires authentication)
 */
router.route('/')
    .get(isLoggedInController, getFriendsController)
    .post(isLoggedInController, postFriendController)
    .put(isLoggedInController, putFriendController)
    .delete(isLoggedInController, deleteFriendController)

/**
 * POST /apis/friend/email
 * Send a friend request by searching for user by email
 */
router.route('/email')
    .post(isLoggedInController, postFriendByEmailController)

export const friendRoute = {basepath, router}