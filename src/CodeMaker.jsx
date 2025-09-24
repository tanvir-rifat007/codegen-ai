import React, { useState, useRef, useEffect } from 'react';

const AICodeGenerator = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        startGeneration();
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
            console.log(data)

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

    return (
        <div className="ai-generator">
            <div className="generator-hero">
                <h1 className="generator-title">Maker - AI For Everyone</h1>
                <p className="generator-subtitle">Generate production-ready code with AI assistance</p>
            </div>

            <div className="generator-form-container">
                <div className="generator-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="go">Go</option>
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Template</label>
                            <select
                                name="template"
                                value={formData.template}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="go-gin">Go-Gin</option>
                                <option value="java-spring">Java-Spring</option>
                                <option value="js-express-api">JS-Express-API</option>
                                <option value="python-flask">Python-Flask</option>
                                <option value="python-django">Python-Django</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Base Package</label>
                            <input
                                type="text"
                                name="basePackage"
                                value={formData.basePackage}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Workers</label>
                            <input
                                type="number"
                                name="workerCount"
                                value={formData.workerCount}
                                onChange={handleInputChange}
                                className="form-input"
                                min="1"
                                max="8"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Model</label>
                            <select
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="o3-mini">o3-mini</option>
                                <option value="gpt-4o-mini">GPT-4o Mini</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Prompt</label>
                        <textarea
                            name="prompt"
                            value={formData.prompt}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Describe the code you want to generate..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="my-project"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            onClick={startGeneration}
                            disabled={isGenerating}
                            className="generate-btn"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Code'}
                        </button>
                    </div>
                </div>
            </div>

            {showResults && (
                <div className="results-section">
                    <h2 className="results-title">Generation Progress</h2>
                    <div ref={consoleRef} className="console"></div>

                    {downloadUrl && (
                        <div className="download-section">
                            <a
                                href={downloadUrl}
                                className="download-btn"
                            >
                                Download Project
                            </a>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default AICodeGenerator;
