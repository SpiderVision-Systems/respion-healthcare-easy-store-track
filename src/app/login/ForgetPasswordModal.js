import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
    const [email, setEmail] = useState("");



    // Password strength validation function
    const validatePasswordStrength = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigits = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasDigits && hasSpecialChar,
            message: {
                minLength: password.length >= minLength ? "" : `Password must be at least ${minLength} characters long.`,
                upperCase: hasUpperCase ? "" : "Password must contain at least one uppercase letter.",
                lowerCase: hasLowerCase ? "" : "Password must contain at least one lowercase letter.",
                digits: hasDigits ? "" : "Password must contain at least one digit.",
                specialChar: hasSpecialChar ? "" : "Password must contain at least one special character.",
            },
        };
    };

    const passwordStrength = validatePasswordStrength(newPassword);


    useEffect(() => {
        let timer;
        if (step === 2 && countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);



    const handleNext = async () => {
        setError({});
        setMessage("");
        setLoading(true);

        if (step === 1) {
            if (!email) {
                setError((prev) => ({ ...prev, email: "Please enter your email." }));
                setLoading(false);
                return;
            }

            const res = await fetch("/api/auth/forget-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json", 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(data.message || "OTP sent successfully!");
                setStep(2);
                setCountdown(1200);
            } else {
                const data = await res.json();
                setError((prev) => ({ ...prev, server: data.error || "Failed to send OTP" }));
            }
        } else if (step === 2) {
            const res = await fetch("/api/auth/forget-password", {
                method: "PUT",
                body: JSON.stringify({ email, otp }),
                headers: { "Content-Type": "application/json", 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "OTP verified successfully!");
                setStep(3);
                setOtp('');
            } else {
                setError((prev) => ({ ...prev, otp: data.error || "Failed to verify OTP" }));
                setOtp('');
            }
        } else if (step === 3) {
            if (!newPassword || !confirmPassword) {
                setError((prev) => ({ ...prev, password: "Both fields are required" }));
                setLoading(false);
                return;
            }

            if (newPassword !== confirmPassword) {
                setError((prev) => ({ ...prev, password: "Passwords do not match" }));
                setLoading(false);
                return;
            }

            if (!passwordStrength.isValid) {
                toast.error('weak password! please provide a strong password.');
                setLoading(false);
                return;
            }

            const res = await fetch("/api/auth/forget-password", {
                method: "PATCH",
                body: JSON.stringify({ email, newPassword }),
                headers: { "Content-Type": "application/json", 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(data.message || "Password reset successfully!");
                onClose();
                setEmail("");
                setNewPassword('');
                setConfirmPassword('');
                setOtp('');
                setStep(1);
                toast.success("Password reset successfully!");
            } else {
                const data = await res.json();
                setError((prev) => ({ ...prev, server: data.error || "Failed to reset password" }));
            }
        }

        setLoading(false);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-center text-black">
                        {step === 1 && "Enter Your Email Address"}
                        {step === 2 && "Enter OTP"}
                        {step === 3 && "Set New Password"}
                    </h2>

                    <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {error.server && (
                            <p className="p-2 text-sm text-center text-red-500 bg-red-100 rounded">
                                {error.server}
                            </p>
                        )}

                        {message && (
                            <p className="p-2 text-sm text-center text-green-500 bg-green-100 rounded">
                                {message}
                            </p>
                        )}

                        {step === 1 && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {error.email && (
                                    <p className="text-red-500 text-sm">{error.email}</p>
                                )}
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="OTP"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <p className="text-sm text-gray-600 text-center">
                                    OTP expires in 2 minutes
                                </p>
                                {error.otp && <p className="text-red-500 text-sm">{error.otp}</p>}
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                {/* Password strength validation messages */}
                                {newPassword && (
                                    <div className="text-sm text-gray-500">
                                        <p className={passwordStrength.message.minLength ? "text-red-500" : "text-green-500"}>
                                            {passwordStrength.message.minLength}
                                        </p>
                                        <p className={passwordStrength.message.upperCase ? "text-red-500" : "text-green-500"}>
                                            {passwordStrength.message.upperCase}
                                        </p>
                                        <p className={passwordStrength.message.lowerCase ? "text-red-500" : "text-green-500"}>
                                            {passwordStrength.message.lowerCase}
                                        </p>
                                        <p className={passwordStrength.message.digits ? "text-red-500" : "text-green-500"}>
                                            {passwordStrength.message.digits}
                                        </p>
                                        <p className={passwordStrength.message.specialChar ? "text-red-500" : "text-green-500"}>
                                            {passwordStrength.message.specialChar}
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                {error.password && <p className="text-red-500 text-sm">{error.password}</p>}


                            </>
                        )}

                        <div className="flex justify-between">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="button"
                                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                onClick={handleNext}
                                disabled={loading}
                            >
                                {loading ? "verifying..." : step === 3 ? "Submit" : "Next"}
                            </button>
                        </div>
                    </form>

                    <button
                        className="mt-4 text-sm text-center text-gray-600 hover:underline"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    );
};

export default ForgotPasswordModal;
