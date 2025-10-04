import { Link } from "@tanstack/react-router";
import Footer from "./Footer";

export default function NotFoundRoute() {
    return (
        <div className="home">
            <header className="hero">
                <h1 className="title">404 - Page Not Found</h1>
                <p className="subtitle">The page you're looking for doesn't exist.</p>
                <Link to="/" className="cta-btn" style={{ textDecoration: 'none' }}>
                    Go Home
                </Link>
            </header>
            <Footer />
        </div>
    )
}
