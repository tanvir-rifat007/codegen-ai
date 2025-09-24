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

// Create route tree
const routeTree = rootRoute.addChildren([
    homeRoute,
    generateCodeRoute,
    aboutRoute,
]);

// Create router
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
});

function App() {
    return <RouterProvider router={router} />;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

