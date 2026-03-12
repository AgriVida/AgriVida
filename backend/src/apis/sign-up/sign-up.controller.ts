import type { Request, Response} from 'express'
import {type Status} from '../../utils/interfaces/Status'
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import {setActivationToken, setHash} from "../../utils/auth.utils.ts";
import { type PrivateUser, insertUser,} from "../user/user.model.ts";
import {SignUpUserSchema} from "./sign-up.schema.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";




export async function signupUserController(request: Request, response: Response) {
    try {
        const validationResult = SignUpUserSchema.safeParse(request.body)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const mailgun: Mailgun = new Mailgun(formData)
        const mailgunClient = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY as string })

        const {username, email, password, id } = validationResult.data

        const hash = await setHash(password)

        const activationToken = setActivationToken ()

        const avatarUrl = 'https://res.cloudinary.com/cnm-ingenuity.png'
            // 'add our https for imagen'

        const basePath: string = `${request.protocol}://${request.hostname}:8080${request.originalUrl}activation/${activationToken}`

        const message = `<h2>Welcome to our-great-meals.</h2>
        <p>In order to get your recipe you must confirm your account. </p>
        <p><a href="${basePath}">${basePath}</a></p>`

        const mailgunMessage = {
            from: `Mailgun Sandbox <ourmealers@${process.env.MAILGUN_DOMAIN as string}>`,
            to: email,
            subject: 'one step closer to Sticky head -- Account Activation',
            html: message
        }
    const user: PrivateUser = {
            id: id,
            activationToken,
            avatarUrl,
            bio: null,
            createdAt: null,
            email,
            hash,
            username

       }

       await insertUser(user)

       await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN as string, mailgunMessage)

        const status: Status = {
            status: 200,
            message: 'User successfully created please check your email.',
            data: null
        }
            response.status(200).json(status)

        } catch (error: any) {


            const status: Status = {
                status: 500,
                message: error.message,
                data: null
            }
            response.status(200).json(status)
        }
    }