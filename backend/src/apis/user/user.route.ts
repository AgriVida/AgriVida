import { Router } from 'express'
import { putUpdateProfileController, getPublicUserController } from './user.controller.ts'

const basePath = '/apis/user' as const

const router = Router()

router.route('/update-profile').put(putUpdateProfileController)
router.route('/:userId').get(getPublicUserController)

export const userRoute = { basePath, router }
