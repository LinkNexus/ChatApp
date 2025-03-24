import {type RouteConfig, index, layout, prefix, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout(
        "routes/auth/layout.tsx", 
        prefix("/auth", [
            route("/", "routes/auth/auth.tsx"),
            route("/login", "routes/auth/login.tsx"),
            route("/register", "routes/auth/register.tsx"),
        ])
    ),
] satisfies RouteConfig;
