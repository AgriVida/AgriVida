import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    layout('layouts/main.tsx', [
    index("routes/home/home.tsx"),
    route("/recipe", "routes/recipe/recipe.tsx"),
    route('/meals','routes/meals/meals.tsx'),
    route('/login', 'routes/login-newaccount/login.tsx'),
<<<<<<< HEAD
    route('/friends', 'routes/friends/friends.tsx'),
<<<<<<< HEAD
    route('/accountset', 'routes/account/accountset.tsx'),
=======
        route('/items-list', 'routes/items-list-page/items-list.tsx'),
>>>>>>> items-list
=======
    route("/friends", "routes/friends/friends.tsx"),
    route("allfriends", "routes/friends/allfriends.tsx"),
>>>>>>> allfriends
    ])
] satisfies RouteConfig

