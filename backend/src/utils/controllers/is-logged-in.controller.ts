import pkg from 'jsonwebtoken'
import type {NextFunction, Request, Response} from 'express'
import type {Status} from '../interfaces/Status'
import type {PublicUser} from "../../apis/user/user.model";

const { verify } = pkg

export function isLoggedInController (request: Request, response: Response, next: NextFunction): void {
    const status: Status = {status:401, message: 'Please login', data:null}
    try {
        const user: PublicUser | undefined = request.session?.user


        const signature: string | undefined = request.session?.signature ?? ''
        const unverifiedJwtToken: string | undefined = request.headers?.authorization


        if (user === undefined || signature === undefined || unverifiedJwtToken === undefined) {
            response.json(status)
            return
        }
        if (!unverifiedJwtToken || unverifiedJwtToken !== request.session?.jwt) {
            response.json(status)
            return
        }
        verify(unverifiedJwtToken, signature)
        next()
    } catch (error:unknown) {
        response.json(status)
    }
}