import {RecipeRating} from "~/components/recipe-rating";
import type {Recipe} from "~/utils/models/recipe.model";

export function RecipeCard(props: {recipe: Recipe}) {
    return (
        <>

            <div className="md:mx-0 mx-16 flex flex-col">
                <div className="md:mx-0 w-60 mx-16">
                    <img className="mb-2" src={props.recipe.imageUrl ?? "./public/image400.png"} alt={props.recipe.title}/>
                </div>
                <p className="p-4 text-center flex-grow">{props.recipe.title}</p>
                <div className="flex justify-center w-full mb-8">
                    {/*<RecipeRating stars={props.recipe.stars}/>*/}
                </div>
            </div>

        </>
    )
}
