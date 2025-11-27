// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Assuming useApi isn't strictly needed here since we are using 'fetch' directly
// import { useApi } from '../hooks/useApi'; 

const LoginPage = () => {
    const [role, setRole] = useState('voter'); // Default to voter

    // Voter State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [universityId, setUniversityId] = useState('');

    // ➡️ 1. NEW ADMIN STATE: State variables for admin credentials
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // General State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { loginVoter, loginAdmin } = useAuth(); // Get the login functions from context
    // const { loginVoter: apiLoginVoter } = useApi(); // Commented out unused hook

    // --- VOTER LOGIN LOGIC (No changes needed here for admin feature) ---
    const handleVoterLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginData = {
                firstName,
                lastName,
                email,
                universityId
            };

            const response = await fetch('http://localhost:8080/api/v1/voters/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const voterData = await response.json();
                loginVoter(voterData);
                navigate('/voter/dashboard', { replace: true });
            } else if (response.status === 403) {
                setError('Your account is pending admin approval');
            } else if (response.status === 404) {
                setError('Invalid credentials or account not found');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------------------------------------


    // ➡️ 2. UPDATED ADMIN LOGIN LOGIC: Now handles credentials and API call
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare the admin login data
            const loginData = {
                username: adminUsername,
                password: adminPassword
            };

            // ⚠️ This is the new API call for the admin backend endpoint
            const response = await fetch('http://localhost:8080/api/v1/admins/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const adminData = await response.json();
                // Pass the admin data to your AuthContext function
                loginAdmin(adminData);
                // Clear the form fields upon success
                setAdminUsername('');
                setAdminPassword('');
                navigate('/admin/dashboard', { replace: true });
            } else if (response.status === 401) {
                setError('Invalid admin credentials.');
            } else {
                setError('Admin login failed. Please try again.');
            }

        } catch (err) {
            console.error('Admin Login error:', err);
            setError('Network error or server unavailable.');
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------------------------------------

    // Helper to reset the form states when switching roles
    const switchRole = (newRole) => {
        setRole(newRole);
        setError('');
        setLoading(false);
        // Reset admin fields when switching to voter
        if (newRole === 'voter') {
            setAdminUsername('');
            setAdminPassword('');
        }
        // Reset voter fields when switching to admin
        if (newRole === 'admin') {
            setFirstName('');
            setLastName('');
            setEmail('');
            setUniversityId('');
        }
    };

    // --- Conditional Rendering ---

    if (role === 'voter') {
        // ... (Voter Login form remains the same) ...
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-700 to-teal-900 p-6 text-center">
                        <h2 className="text-2xl font-bold text-white">Voter Login</h2>
                        <p className="text-teal-100 mt-1">Access the Online Voting Platform</p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleVoterLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                        placeholder="Enter your last name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                        placeholder="your.email@university.edu"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University ID</label>
                                    <input
                                        type="text"
                                        value={universityId}
                                        onChange={(e) => setUniversityId(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                        placeholder="Enter your university ID"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-6 py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium hover:from-teal-700 hover:to-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </div>
                                ) : 'Login as Voter'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-medium text-blue-800">Not Registered?</h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>Contact your administrator to get registered in the system.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => switchRole('admin')}
                                    className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center group"
                                >
                                    Login as Admin instead
                                    <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // ➡️ 3. UPDATED ADMIN LOGIN UI: Added input fields for credentials
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-700 to-teal-900 p-6 text-center">
                        <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                        <p className="text-teal-100 mt-1">Access Administrative Dashboard</p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleAdminLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={adminUsername}
                                        onChange={(e) => setAdminUsername(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                        placeholder="Enter your admin username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-6 py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium hover:from-teal-700 hover:to-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </div>
                                ) : 'Login as Admin'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <button
                                onClick={() => switchRole('voter')}
                                className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center group"
                            >
                                <svg className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Login as Voter instead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default LoginPage;