import { Link, Outlet } from "@tanstack/react-router";
import { CartContext, useCart } from "./contexts";


export default function Layout() {
    const { user } = useCart()

    console.log("I ma inside layout", user)
    return (
        <div className="app-layout">
            <nav className="nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">🚀 Codegen AI</Link>
                    </div>

                    <button className="nav-toggle" id="nav-toggle">☰</button>

                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/generate-code" className="nav-link">Generate</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/register" className="nav-link">Register</Link>

                        {user && (user.activated && user.jwt ? null : <Link to="/sign-in" className="nav-link">SignIn</Link>)}
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />

            </main>
        </div>
    );
}

