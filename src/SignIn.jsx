import React, { useState } from "react";

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('User signin data:', formData);
            setIsSubmitting(false);
            // Handle successful sign in here
            // Example: redirect to dashboard
        }, 2000);
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic
        console.log('Forgot password clicked');
    };

    return (
        <div className="user-register">
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    <div className="generator-form">
                        <div className="register-header">
                            <h1 className="register-title">Welcome Back</h1>
                            <p className="register-subtitle">Sign in to your Maker account</p>
                        </div>

                        <div className="form-grid">
                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    name="email"
                                    id="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <div className="form-error">
                                        ⚠️ {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        className="form-input password-input"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="form-error">
                                        ⚠️ {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="form-options">
                                <div className="remember-me">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="checkbox-input"
                                    />
                                    <label htmlFor="rememberMe" className="checkbox-label">
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="generate-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="auth-divider">
                            <span className="divider-line"></span>
                            <span className="divider-text">or</span>
                            <span className="divider-line"></span>
                        </div>

                        {/* Social Sign In Options */}
                        <div className="social-signin">
                            <button type="button" className="social-btn google-btn">
                                <span className="social-icon">🔍</span>
                                Continue with Google
                            </button>
                            <button type="button" className="social-btn github-btn">
                                <span className="social-icon">⚫</span>
                                Continue with GitHub
                            </button>
                        </div>

                        {/* Auth Links */}
                        <div className="auth-links">
                            <p>Don't have an account? <a href="/register" className="auth-link">Create Account</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignIn;
