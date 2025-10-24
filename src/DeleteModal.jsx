
import { X, AlertTriangle } from 'lucide-react';


export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, chatTitle }) => {
    if (!isOpen) return null;

    return (
        <>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-container {
                    background: #0d0d0d;
                    border: 1px solid #333;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 450px;
                    box-shadow: 0 0 30px rgba(0, 255, 231, 0.2);
                    animation: slideUp 0.3s ease;
                    overflow: hidden;
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem;
                    border-bottom: 1px solid #222;
                    background: #111;
                }

                .modal-title-section {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .warning-icon {
                    color: #ff4d4f;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .modal-title {
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: #eaeaea;
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #777;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }

                .close-btn:hover {
                    color: #eaeaea;
                    background: #333;
                }

                .modal-body {
                    padding: 1.5rem;
                }

                .modal-message {
                    color: #bbb;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                }

                .chat-preview {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 0.75rem;
                    margin-top: 1rem;
                }

                .chat-preview-label {
                    font-size: 0.75rem;
                    color: #777;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.5rem;
                }

                .chat-preview-title {
                    color: #00ffe7;
                    font-size: 0.9rem;
                    word-break: break-word;
                }

                .modal-footer {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1.5rem;
                    border-top: 1px solid #222;
                    background: #111;
                }

                .modal-btn {
                    flex: 1;
                    padding: 0.75rem 1.5rem;
                    font-size: 0.95rem;
                    font-weight: bold;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: "Fira Code", monospace;
                }

                .cancel-btn {
                    background: #1a1a1a;
                    color: #eaeaea;
                    border: 1px solid #333;
                }

                .cancel-btn:hover {
                    background: #222;
                    border-color: #00ffe7;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 255, 231, 0.2);
                }

                .delete-btn {
                    background: #ff4d4f;
                    color: #fff;
                }

                .delete-btn:hover {
                    background: #ff7875;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
                }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title-section">
                            <AlertTriangle size={24} className="warning-icon" />
                            <h3 className="modal-title">Delete Code Generation</h3>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <p className="modal-message">
                            Are you sure you want to delete this code generation? This action cannot be undone.
                        </p>

                        {chatTitle && (
                            <div className="chat-preview">
                                <div className="chat-preview-label">Project</div>
                                <div className="chat-preview-title">{chatTitle}</div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="modal-btn cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="modal-btn delete-btn" onClick={onConfirm}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
