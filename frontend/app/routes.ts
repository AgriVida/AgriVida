import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home/home.tsx"),
    route("/recipe", "routes/recipe/recipe.tsx"),
<<<<<<< HEAD
    route("/meals", "routes/meals/meals.tsx"),
] satisfies RouteConfig;
=======
    route('/meals','routes/meals/meals.tsx')
] satisfies RouteConfig
>>>>>>> c177fc6a97072b3e0750e0774dc028afa8b68bbc
