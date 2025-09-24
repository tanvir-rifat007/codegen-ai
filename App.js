
const { createElement: h, useState, useEffect, useRef } = React;

function Home() {
    return h("div", { className: "home" },
        // Hero Section
        h("header", { className: "hero" },
            h("h1", { className: "title" }, "🚀 Codegen AI Agent"),
            h("p", { className: "subtitle" },
                "Generate. Deploy. Ship.",
                h("br"),
                "The future of coding, powered by AI."
            ),
            h("button", {
                className: "cta-btn", onClick: () => window.location.href = '/generate-code'
            }, "Start Generating Code")
        ),
        // Features Section
        h("section", { className: "features" },
            h("div", { className: "feature-card" },
                h("h2", null, "⚡ AI Code Generation"),
                h("p", null, "Describe what you want, and our AI writes clean, production-ready code in seconds.")
            ),
            h("div", { className: "feature-card" },
                h("h2", null, "🔗 MCP Deployment"),
                h("p", null, "Automatically deploy generated code to GitHub with our MCP-powered agent.")
            ),
            h("div", { className: "feature-card" },
                h("h2", null, "🛠 Multi-language Support"),
                h("p", null, "Works across Go, JavaScript, Python, and more. Your stack, your rules.")
            )
        ),
        // Footer
        h("footer", { className: "footer" },
            h("p", null, `© ${new Date().getFullYear()} Codegen AI Agent. Built for developers.`)
        )
    );
}

// AI Code Generator Component
function AICodeGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [formData, setFormData] = useState({
        language: 'go',
        template: 'go-gin',
        basePackage: 'github.com/user/app',
        workerCount: 4,
        model: 'o3-mini',
        prompt: '',
        projectName: ''
    });

    const consoleRef = useRef(null);
    const websocketRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const log = (type, message) => {
        if (consoleRef.current) {
            const p = document.createElement('p');
            p.className = type;
            p.textContent = message;
            consoleRef.current.appendChild(p);
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    };

    const startGeneration = () => {
        setShowResults(true);
        setIsGenerating(true);
        setDownloadUrl('');

        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }

        // Connect to WebSocket
        websocketRef.current = new WebSocket(`ws://localhost:3000/api/generate`);

        websocketRef.current.onopen = () => {
            websocketRef.current.send(JSON.stringify({
                ...formData,
                workerCount: parseInt(formData.workerCount),
                projectName: formData.projectName || `${formData.language}-project`
            }));

            log('info', 'Connected to server. Starting code generation...');
        };

        websocketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'start':
                    log('info', data.message);
                    break;
                case 'file':
                    log('info', `Writing file: ${data.file}`);
                    break;
                case 'error':
                    log('error', `Error: ${data.error}`);
                    setIsGenerating(false);
                    break;
                case 'complete':
                    log('success', data.message);
                    setDownloadUrl(data.zipUrl);
                    setIsGenerating(false);
                    break;
            }
        };

        websocketRef.current.onerror = (error) => {
            log('error', `WebSocket error: ${error}`);
            setIsGenerating(false);
        };

        websocketRef.current.onclose = () => {
            log('info', 'Connection closed');
        };
    };

    useEffect(() => {
        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, []);

    return h("div", { className: "ai-generator" },
        h("div", { className: "generator-hero" },
            h("h1", { className: "generator-title" }, "Maker - AI For Everyone"),
            h("p", { className: "generator-subtitle" }, "Generate production-ready code with AI assistance")
        ),

        h("div", { className: "generator-form-container" },
            h("div", { className: "generator-form" },
                h("div", { className: "form-grid" },
                    h("div", { className: "form-group" },
                        h("label", { className: "form-label" }, "Language"),
                        h("select", {
                            name: "language",
                            value: formData.language,
                            onChange: handleInputChange,
                            className: "form-select"
                        },
                            h("option", { value: "go" }, "Go"),
                            h("option", { value: "python" }, "Python"),
                            h("option", { value: "javascript" }, "JavaScript"),
                            h("option", { value: "java" }, "Java")
                        )
                    ),

                    h("div", { className: "form-group" },
                        h("label", { className: "form-label" }, "Template"),
                        h("select", {
                            name: "template",
                            value: formData.template,
                            onChange: handleInputChange,
                            className: "form-select"
                        },
                            h("option", { value: "go-gin" }, "Go-Gin"),
                            h("option", { value: "java-spring" }, "Java-Spring"),
                            h("option", { value: "js-express-api" }, "JS-Express-API"),
                            h("option", { value: "python-flask" }, "Python-Flask"),
                            h("option", { value: "python-django" }, "Python-Django")
                        )
                    ),

                    h("div", { className: "form-group" },
                        h("label", { className: "form-label" }, "Base Package"),
                        h("input", {
                            type: "text",
                            name: "basePackage",
                            value: formData.basePackage,
                            onChange: handleInputChange,
                            className: "form-input"
                        })
                    ),

                    h("div", { className: "form-group" },
                        h("label", { className: "form-label" }, "Workers"),
                        h("input", {
                            type: "number",
                            name: "workerCount",
                            value: formData.workerCount,
                            onChange: handleInputChange,
                            className: "form-input",
                            min: "1",
                            max: "8"
                        })
                    ),

                    h("div", { className: "form-group" },
                        h("label", { className: "form-label" }, "Model"),
                        h("select", {
                            name: "model",
                            value: formData.model,
                            onChange: handleInputChange,
                            className: "form-select"
                        },
                            h("option", { value: "o3-mini" }, "o3-mini"),
                            h("option", { value: "gpt-4o-mini" }, "GPT-4o Mini")
                        )
                    )
                ),

                h("div", { className: "form-group" },
                    h("label", { className: "form-label" }, "Prompt"),
                    h("textarea", {
                        name: "prompt",
                        value: formData.prompt,
                        onChange: handleInputChange,
                        className: "form-textarea",
                        placeholder: "Describe the code you want to generate..."
                    })
                ),

                h("div", { className: "form-group" },
                    h("label", { className: "form-label" }, "Project Name"),
                    h("input", {
                        type: "text",
                        name: "projectName",
                        value: formData.projectName,
                        onChange: handleInputChange,
                        className: "form-input",
                        placeholder: "my-project"
                    })
                ),

                h("div", { className: "form-actions" },
                    h("button", {
                        onClick: startGeneration,
                        disabled: isGenerating,
                        className: "generate-btn"
                    }, isGenerating ? 'Generating...' : 'Generate Code')
                )
            )
        ),

        showResults && h("div", { className: "results-section" },
            h("h2", { className: "results-title" }, "Generation Progress"),
            h("div", { ref: consoleRef, className: "console" }),

            downloadUrl && h("div", { className: "download-section" },
                h("a", {
                    href: downloadUrl,
                    className: "download-btn"
                }, "Download Project")
            )
        )
    );
}

// About Component (keeping it simple)
function About() {
    return h("div", { className: "home" },
        h("header", { className: "hero" },
            h("h1", { className: "title" }, "About Codegen AI"),
            h("p", { className: "subtitle" }, "Learn more about our AI-powered code generation platform")
        ),
        h("section", { className: "features" },
            h("div", { className: "feature-card" },
                h("h2", null, "🤖 AI-Powered"),
                h("p", null, "Built with advanced AI models to understand your requirements and generate high-quality code.")
            ),
            h("div", { className: "feature-card" },
                h("h2", null, "🚀 Fast & Reliable"),
                h("p", null, "Generate production-ready code in seconds with our optimized AI pipeline.")
            ),
            h("div", { className: "feature-card" },
                h("h2", null, "🌐 Open Source"),
                h("p", null, "Built with love for the developer community. Contribute and help us improve!")
            )
        )
    );
}


// Add this to your app.js file
function NotFoundRoute() {
    return h("div", { className: "home" },
        h("header", { className: "hero" },
            h("h1", { className: "title" }, "404 - Page Not Found"),
            h("p", { className: "subtitle" }, "The page you're looking for doesn't exist."),
            h("button", {
                className: "cta-btn",
                onClick: () => window.location.href = '/'
            }, "Go Home")
        )
    );
}

function App(props) {
    const pathname = props.ssrPathname || '/';

    let PageComponent;
    switch (pathname) {
        case '/':
            PageComponent = Home;
            break;
        case '/generate-code':
            PageComponent = AICodeGenerator;
            break;
        case '/about':
            PageComponent = About;
            break;
        default:
            PageComponent = NotFoundRoute
    }

    return h("div", { className: "app-layout" },
        h("nav", { className: "nav" },
            h("div", { className: "nav-container" },
                h("div", { className: "nav-brand" },
                    h("a", { href: "/", className: "nav-logo" }, "🚀 Codegen AI")
                ),
                h("div", { className: "nav-links" },
                    h("a", { href: "/", className: "nav-link" }, "Home"),
                    h("a", { href: "/generate-code", className: "nav-link" }, "Generate"),
                    h("a", { href: "/about", className: "nav-link" }, "About")
                )
            )
        ),
        h("main", { className: "main-content" }, h(PageComponent))
    );

}



globalThis.App = App;
