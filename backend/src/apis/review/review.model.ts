import {z} from 'zod/v4'
import {sql} from '../../utils/database.utils.ts'

/**
 * Schema for validating thread objects
 * @shape id: string the primary key for the thread
 * @shape profileId: string the foreign key to the profile that created the thread
 * @shape replyThreadId: string | null the foreign key to the thread being replied to
 * @shape content: string the content of the thread (max 140 characters)
 * @shape datetime: Date the timestamp when the thread was created
 * @shape imageUrl: string | null optional image URL for the thread
 */

export const ReviewSchema = z.object({
    recipeId: z.uuidv7('please provide a recipe Id'),
    userId: z.uuidv7('please provide a user id'),
    body: z.string('Please provide a review'),
    createdAt: z.date('please provide a review date'),
    rating: z.number('please provide a review rating number'),
})
/**
 * review type inferred from schema
 *Im
 */

export type Review = z.infer<typeof ReviewSchema>

/**
 * Insert a new review into the database
 * @param review the review object to insert
 * @returns "Thread successfully created"
 */

export async function insertReview(review: Review): Promise<string> {
    // Validate the Review object against the ReviewSchema
    ReviewSchema.parse(review)

    await sql`
         INSERT INTO reviews (recipe_id,user_id, body, created_at, rating) 
         VALUES (${review.recipeId}, ${review.userId}, ${review.body}, ${review.rating})`

    return 'review successfully created'
}

// export async function selectReviewByReplyUserId(replyUserId: string): Promise<Review[]> {
//     return ReviewSchema.array().parse(rowlist)
// }

/** select recent reviews from profiles that the given profile is following
// * Select recent reviews from profiles that the given profile is following
// * @param UserId the id of the profile whose following list to check
// * @param limit the maximum number of threads to return (default 50)
// * @returns array of reviews
// */
