// src/App.jsx

import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import VoterLayout from './components/VoterLayout'; // Layout for Voter Pages
import CandidatesPage from './components/CandidatesPage';
import ApplicationPage from './components/ApplicationPage'; // <--- ADDED IMPORT HERE
import AdminLayout from './components/AdminLayout'; // Import the new layout
import ManageVoters from './components/ManageVoters';
import ManageCandidates from './components/ManageCandidates';
import ManageElections from './components/ManageElections';
import ViewResults from './components/ViewResults';

// --- Placeholder Components ---
const HomePage = () => (
  // 1. Full screen height, center contents (flex flex-col items-center justify-center)
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
    {/* Decorative elements */}
    <div className="absolute top-10 left-10 text-teal-200 opacity-50">
      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
      </svg>
    </div>

    <div className="absolute bottom-10 right-10 text-blue-200 opacity-50">
      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
      </svg>
    </div>

    {/* 2. Styled Card for content (max-w-xl limits width, mx-auto centers horizontally) */}
    <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full text-center relative z-10 border border-teal-100">
      {/* Badge for visual appeal */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6 mx-auto">
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>

      {/* 3. Title styling */}
      <h1 className="text-4xl font-extrabold text-teal-800 mb-4">
        WELCOME TO THE ONLINE VOTING PLATFORM!
      </h1>

      {/* 4. Description styling */}
      <p className="text-xl text-gray-600 mb-8">
        Your secure platform for managing and casting votes.
      </p>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <span className="text-sm text-gray-600">Secure</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <span className="text-sm text-gray-600">Transparent</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 01-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
          </div>
          <span className="text-sm text-gray-600">Efficient</span>
        </div>
      </div>

      {/* 5. Styled Button (using your existing btn-primary/btn-secondary styles) */}
      <Link to="/login" className="btn-primary inline-block mt-4 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        Click Here to Login
      </Link>

      {/* Additional info */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-gray-500 text-sm">
          Join thousands of voters in making democratic decisions
        </p>
      </div>
    </div>
  </div>
);

const VoterDashboard = () => (
  <div className="max-w-4xl mx-auto mt-10 p-6">
    <h1 className="text-3xl font-bold text-center text-teal-800 mb-4">Voter Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      {/* Cast Vote Card */}
      <div className="card bg-white shadow-lg rounded-lg p-6 border border-teal-200 hover:shadow-xl transition-shadow duration-300">
        <div className="text-center">
          <div className="text-5xl mb-4 text-teal-600">🗳️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cast Your Vote</h2>
          <p className="text-gray-600 mb-6">
            Participate in ongoing elections. Review candidates and make your voice heard.
          </p>
          <Link to="/voter/candidates" className="btn-primary inline-block">
            View Elections & Vote
          </Link>
        </div>
      </div>

      {/* Apply for Post Card */}
      <div className="card bg-white shadow-lg rounded-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow duration-300">
        <div className="text-center">
          <div className="text-5xl mb-4 text-amber-600">📢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Apply for a Post</h2>
          <p className="text-gray-600 mb-6">
            Interested in leadership? Apply to run for a position in an upcoming election.
          </p>
          <Link to="/voter/apply" className="btn-secondary inline-block">
            Apply Now
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-12 text-center">
      <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="text-blue-700 font-medium">Your participation makes a difference in our community!</span>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to the Online Voting Platform Administration Panel</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Voters Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-100">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-500">Total Voters</h3>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
          </div>
        </div>
      </div>

      {/* Candidates Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-100">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-500">Candidates</h3>
            <p className="text-2xl font-bold text-gray-900">86</p>
          </div>
        </div>
      </div>

      {/* Elections Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-amber-100">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-500">Elections</h3>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
      </div>

      {/* Votes Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-purple-100">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-500">Total Votes</h3>
            <p className="text-2xl font-bold text-gray-900">3,421</p>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Quick Actions Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/admin/voters" className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <div className="p-3 rounded-full bg-blue-100 mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <span className="font-medium text-gray-700">Manage Voters</span>
          </Link>

          <Link to="/admin/candidates" className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <div className="p-3 rounded-full bg-green-100 mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span className="font-medium text-gray-700">Manage Candidates</span>
          </Link>

          <Link to="/admin/elections" className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
            <div className="p-3 rounded-full bg-amber-100 mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span className="font-medium text-gray-700">Manage Elections</span>
          </Link>

          <Link to="/admin/results" className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <div className="p-3 rounded-full bg-purple-100 mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <span className="font-medium text-gray-700">View Results</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">New voter registration</p>
              <p className="text-sm text-gray-500">John Doe registered 2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Candidate approved</p>
              <p className="text-sm text-gray-500">Jane Smith approved for President position</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 rounded-full bg-amber-100 mr-3">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Election status updated</p>
              <p className="text-sm text-gray-500">Annual Election is now active</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 rounded-full bg-purple-100 mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Votes cast</p>
              <p className="text-sm text-gray-500">542 new votes recorded in the last hour</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* System Status */}
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">System Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <div className="p-2 rounded-full bg-green-100 mr-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">System Online</p>
            <p className="text-sm text-gray-500">All services operational</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
          <div className="p-2 rounded-full bg-blue-100 mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Performance</p>
            <p className="text-sm text-gray-500">Response time: 42ms</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-amber-50 rounded-lg">
          <div className="p-2 rounded-full bg-amber-100 mr-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Last Backup</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ------------------------------------------------------------------- */}
        {/* PARENT VOTER ROUTE: Applies ProtectedRoute and VoterLayout to ALL children */}
        <Route
          path="/voter" // <--- PARENT PATH is /voter
          element={<ProtectedRoute requiredRole="voter"><VoterLayout /></ProtectedRoute>}
        >
          {/* These routes will render INSIDE VoterLayout's <Outlet /> */}

          {/* 1. Default route for /voter (usually the dashboard) */}
          <Route index element={<VoterDashboard />} />

          {/* 2. Specific Dashboard route: /voter/dashboard */}
          <Route path="dashboard" element={<VoterDashboard />} />

          {/* 3. Candidates/Elections route: /voter/candidates */}
          <Route path="candidates" element={<CandidatesPage />} />

          {/* 4. Application route: /voter/apply */}
          <Route path="apply" element={<ApplicationPage />} />
        </Route>
        {/* ------------------------------------------------------------------- */}

        {/* ------------------------------------------------------------------- */}
        {/* PARENT ADMIN ROUTE: Applies ProtectedRoute and AdminLayout to ALL children */}
        <Route
          path="/admin" // <--- PARENT PATH is /admin
          element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}
        >
          {/* These routes will render INSIDE AdminLayout's <Outlet /> */}

          {/* 1. Default route for /admin (usually the dashboard) */}
          <Route index element={<AdminDashboard />} />

          {/* 2. Specific Dashboard route: /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* 3. Management Pages */}
          <Route path="voters" element={<ManageVoters />} />
          <Route path="candidates" element={<ManageCandidates />} />
          <Route path="elections" element={<ManageElections />} />
          <Route path="results" element={<ViewResults />} />
        </Route>
        {/* ------------------------------------------------------------------- */}

        {/* Fallback for 404 */}
        <Route path="*" element={
          <div className="card text-center">
            <h1 className="text-error">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;