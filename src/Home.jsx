import { Link } from "@tanstack/react-router"


const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <header className="hero">
                <h1 className="title">🚀 Codegen AI Agent</h1>
                <p className="subtitle">
                    Generate. Deploy. Ship. <br /> The future of coding, powered by AI.
                </p>
                <Link to="/generate-code">

                    <button className="cta-btn">Start Generating Code</button>
                </Link>
            </header>

            {/* Features Section */}
            <section className="features">
                <div className="feature-card">
                    <h2>⚡ AI Code Generation</h2>
                    <p>
                        Describe what you want, and our AI writes clean, production-ready
                        code in seconds.
                    </p>
                </div>
                <div className="feature-card">
                    <h2>🔗 MCP Deployment</h2>
                    <p>
                        Automatically deploy generated code to GitHub with our MCP-powered
                        agent.
                    </p>
                </div>
                <div className="feature-card">
                    <h2>🛠 Multi-language Support</h2>
                    <p>
                        Works across Go, JavaScript, Python, and more. Your stack, your
                        rules.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© {new Date().getFullYear()} Codegen AI Agent. Built for developers.</p>
            </footer>
        </div>
    );
};

export default Home;

