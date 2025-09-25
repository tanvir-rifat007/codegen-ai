import { Link, Outlet } from "@tanstack/react-router";


export default function Layout() {
    return (
        <div className="app-layout">
            <nav className="nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <Link to="/" className="nav-logo">🚀 Codegen AI</Link>
                    </div>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/generate-code" className="nav-link">Generate</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />

            </main>
        </div>
    );
}

