import {data, redirect} from "react-router";
import {getAllIngredients, type Ingredient} from "~/utils/models/ingredient.model";
import type { Route } from "./+types/items-list";
import {commitSession, getSession} from "~/utils/session.server";
import {GoogleGenAI} from "@google/genai";
import {fileStorage, getStorageKey} from "~/utils/image-storage.server";
import {z} from "zod/v4";
import {zodResolver} from "@hookform/resolvers/zod";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {useFieldArray} from "react-hook-form";
import {useState} from "react";

export async function loader ({ params, request }:Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    if (!session.has("user") || !session.has("ingredients")) {
        redirect('/login')
    }
    const ingredientsDictionary = session.get('ingredients')
    if (!ingredientsDictionary) {
        return redirect('/login')
    }
    const ingredientsData: Ingredient[] = await getAllIngredients()
    if (ingredientsDictionary[params.id]) {
        return data({ingredients:ingredientsDictionary[params.id], ingredientsData},{

            })
    }
    console.log(ingredientsDictionary[params.id])
    console.log('Calling Gemini')
    const storageKey = getStorageKey(params.id);
    const file = await fileStorage.get(storageKey);

    if (!file) {
        throw new Response("User avatar not found", {
            status: 404,
        });
    }
    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    const streamedFile = await file.arrayBuffer()
    const base64ImageData = Buffer.from(streamedFile).toString("base64");
    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
            responseMimeType: 'application/json'
        },
        contents: [
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64ImageData,
                },
            },
            { text: "please give us a list of ingredients from the image and list the results as a clean JSON array of ingredients" }
        ],
    });
    const resultText = result.text
    if (resultText === undefined) {
        throw new Response('Failed to get list of ingredients', {status:400})
    }
    console.log(JSON.parse(resultText))
    const ingredients = JSON.parse(resultText)
    ingredientsDictionary[params.id] = ingredients
    session.set("ingredients", ingredientsDictionary)
    const headers = new Headers()
    headers.append("Set-Cookie", await commitSession(session))
    return data({ingredients, ingredientsData},{
    headers
        })
}

const ItemsSchema = z.object({
    ingredients: z.array(z.object({ value: z.string().min(1, "Ingredient cannot be empty") })).min(1, "Must have at least one ingredient"),
    mealType: z.string().min(1, "Please select a meal type"),
    cuisine: z.string().min(1, "Please select a cuisine"),
})
const resolver = zodResolver(ItemsSchema)

type Items = z.infer<typeof ItemsSchema>

export async function action({ request }: Route.ActionArgs) {
    const { errors, data: formData } = await getValidatedFormData<Items>(request, resolver)
    if (errors) return { errors }

    const url = new URL('/recipe-generation', new URL(request.url).origin)
    formData.ingredients.forEach(i => url.searchParams.append('ingredients', i.value))
    url.searchParams.set('mealType', formData.mealType)
    url.searchParams.set('cuisine', formData.cuisine)
    return redirect(url.toString())
}

export default function ItemsList({params, loaderData}: Route.ComponentProps) {
    const {ingredients, ingredientsData} = loaderData

    const { register, control, handleSubmit, formState: { errors } } = useRemixForm<Items>({
        resolver,
        defaultValues: {
            ingredients: ingredients.map((name: string) => ({ value: name })),
            mealType: '',
            cuisine: '',
        }
    })
    const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' })

    const [selectValue, setSelectValue] = useState('')
    const [freeText, setFreeText] = useState('')

    return (
        <>
            <div className="flex w-full items-center justify-center">
                <img src={`/api/image/${params.id}`} alt=""/>
            </div>

            <form onSubmit={handleSubmit}>
                <h2 className="mx-16 mb-4 font-bold text-2xl">
                    List of items on the picture
                </h2>
                <div className="mx-16 text-left">
                    <ul className="list-none">
                        {fields.map((field, index) => (
                            <li key={field.id} className="flex items-center gap-2 text-lg py-1">
                                <input type="hidden" {...register(`ingredients.${index}.value`)} />
                                <span>{field.value}</span>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:text-red-700 font-bold leading-none"
                                    aria-label={`Remove ${field.value}`}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                    {errors.ingredients && (
                        <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>
                    )}
                </div>

                <h2 className="mx-16 mb-4 mt-8 font-bold text-2xl">
                    Is this Everything? Add items:
                </h2>

                <div className="mx-16 pr-96 space-y-4">
                    <div className="flex gap-2 items-end">
                        <select
                            value={selectValue}
                            onChange={(e) => setSelectValue(e.target.value)}
                            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs"
                        >
                            <option value="">Choose an item</option>
                            {ingredientsData.map((ingredient: Ingredient) => (
                                <option key={ingredient.id} value={ingredient.nameIng}>
                                    {ingredient.nameIng}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                if (selectValue && !fields.some(f => f.value === selectValue)) {
                                    append({ value: selectValue })
                                    setSelectValue('')
                                }
                            }}
                            className="text-white bg-blue-600 border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none whitespace-nowrap"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex gap-2 items-end">
                        <input
                            type="text"
                            value={freeText}
                            onChange={(e) => setFreeText(e.target.value)}
                            placeholder="Type an ingredient not in the list..."
                            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const trimmed = freeText.trim()
                                if (trimmed && !fields.some(f => f.value === trimmed)) {
                                    append({ value: trimmed })
                                    setFreeText('')
                                }
                            }}
                            className="text-white bg-blue-600 border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none whitespace-nowrap"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <h2 className="mx-16 mb-4 mt-8 font-bold text-2xl">
                    What type of meal do you want to eat?
                </h2>
                <div className="mx-16 pr-96">
                    <select
                        {...register('mealType')}
                        className="mt-4 block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                    >
                        <option value="">Choose a meal type</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="desert">Desert</option>
                    </select>
                    {errors.mealType && (
                        <p className="text-red-500 text-sm mt-1">{errors.mealType.message}</p>
                    )}
                </div>

                <h2 className="mx-16 mb-4 mt-8 font-bold text-2xl">
                    What cuisines do you like to experience?
                </h2>
                <div className="mx-16 pr-96">
                    <select
                        {...register('cuisine')}
                        className="mt-4 block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                    >
                        <option value="">Choose a cuisine</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Middle Eastern">Middle Eastern</option>
                        <option value="Barbeque">Barbeque</option>
                    </select>
                    {errors.cuisine && (
                        <p className="text-red-500 text-sm mt-1">{errors.cuisine.message}</p>
                    )}
                </div>

                <div className="mx-16 mb-28 mt-6">
                    <button
                        type="submit"
                        className="text-white bg-blue-600 border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >
                        Next
                    </button>
                </div>
            </form>
        </>
    )
}
