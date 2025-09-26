import { Link, Outlet } from "@tanstack/react-router";
import { useCart } from "./contexts";

export default function Layout() {
    const { user, isLoading, logoutUser } = useCart()

    console.log("I am inside layout", { user, isLoading })

    const isUserAuthenticated = () => {
        return user && user.activated && user.name && user.email;
    }

    const handleLogout = async () => {
        await logoutUser();


        window.location.href = '/';
    }

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="app-layout">
                <nav className="nav">
                    <div className="nav-container">
                        <div className="nav-brand">
                            <Link to="/" className="nav-logo">🚀 Codegen AI</Link>
                        </div>
                        <div className="nav-links">
                            <div style={{ padding: '10px', color: '#666' }}>Loading...</div>
                        </div>
                    </div>
                </nav>
                <main className="main-content">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                        fontSize: '18px',
                        color: '#666'
                    }}>
                        Loading...
                    </div>
                </main>
            </div>
        );
    }

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

                        {isUserAuthenticated() ? (
                            <Link to="/generate-code" className="nav-link">Generate</Link>
                        ) : (
                            <Link to="/sign-in" className="nav-link">Generate</Link>
                        )}

                        <Link to="/about" className="nav-link">About</Link>

                        {isUserAuthenticated() ? (
                            <>
                                <span className="nav-link user-greeting">
                                    Hello, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="nav-link logout-btn"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'inherit',
                                        fontSize: 'inherit',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="nav-link">Register</Link>
                                <Link to="/sign-in" className="nav-link">Sign In</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
