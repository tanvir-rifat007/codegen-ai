import { createRoot } from "react-dom/client";
import {
    createRouter,
    createRoute,
    createRootRoute,
    RouterProvider,
} from "@tanstack/react-router";
import Home from "./Home";
import AICodeGenerator from "./CodeMaker";
import Layout from "./Layout";
import About from "./About";
import NotFoundRoute from "./NotFound";
import User from "./User"
import SignIn from "./SignIn";
import { CartContext } from "./contexts";
// Define routes
const rootRoute = createRootRoute({
    component: Layout,
    notFoundComponent: NotFoundRoute
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
});

const generateCodeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/generate-code",
    component: AICodeGenerator,
});

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/about",
    component: About,
});

const registerUserRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: User,
})


const signinUserRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/sign-in",
    component: SignIn,
})

// Create route tree
const routeTree = rootRoute.addChildren([
    homeRoute,
    generateCodeRoute,
    aboutRoute,
    registerUserRoute,
    signinUserRoute,
]);

// Create router
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
});

function App() {
    return <CartContext>

        <RouterProvider router={router} />

    </CartContext>;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

