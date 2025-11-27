// src/components/VoterLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To handle logout

const VoterLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Navigation items
    const navItems = [
        { name: 'Dashboard', path: '/voter/dashboard' },
        { name: 'Elections & Candidates', path: '/voter/candidates' },
        { name: 'Apply for Post', path: '/voter/apply' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Voter Navigation Bar - Fixed at the top */}
            <nav className="navbar fixed top-0 left-0 right-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 text-white font-bold text-lg">
                                Voter Portal
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-8 flex items-baseline space-x-3">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`nav-link text-sm ${location.pathname === item.path ? 'nav-link-active' : ''}`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="btn-danger text-sm px-3 py-1"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu (optional) - Fixed at the top */}
            <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-gray-800 shadow-md">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`nav-link block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? 'nav-link-active' : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main content - Added padding top to account for fixed navbar */}
            <main className="content pt-24">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default VoterLayout;