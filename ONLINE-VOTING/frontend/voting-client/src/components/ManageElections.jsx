
// src/components/ManageElections.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ManageElections = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'upcoming'
    });

    const { getAllElections, createElection, updateElectionStatus, deleteElection } = useApi();
    const { userRole } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllElections();
                setElections(data);
            } catch (error) {
                console.error('Failed to load elections:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userRole === 'admin') {
            fetchData();
        }
    }, [getAllElections, userRole]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure start_time and end_time are provided (existing logic)
            if (!formData.start_time || !formData.end_time) {
                alert('Both start time and end time are required.');
                return;
            }

            // CORRECTED LOGIC: Append ':00Z' to the local datetime string.
            // This sends a valid, UTC-aware ISO string directly to the Java Instant.
            const formattedData = {
                ...formData,
                // Example: "2025-11-27T10:00" + ":00Z" => "2025-11-27T10:00:00Z"
                start_time: formData.start_time ? formData.start_time + ':00Z' : null,
                end_time: formData.end_time ? formData.end_time + ':00Z' : null
            };

            // Additional validation to ensure times are not null (existing logic)
            if (!formattedData.start_time || !formattedData.end_time) {
                alert('Both start time and end time must be provided.');
                return;
            }

            await createElection(formattedData);
            // Refresh elections list
            const data = await getAllElections();
            setElections(data);
            // Reset form
            setFormData({
                name: '',
                description: '',
                start_time: '',
                end_time: '',
                status: 'upcoming'
            });
            setShowForm(false);
        } catch (error) {
            console.error('Failed to create election:', error);
            alert('Failed to create election. Please try again.');
        }
    };

    const handleStatusChange = async (electionId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change the status of election ID ${electionId} to ${newStatus}?`)) {
            return;
        }
        try {
            await updateElectionStatus(electionId, newStatus);
            // Refresh the list immediately after success
            const data = await getAllElections();
            setElections(data);
        } catch (error) {
            console.error(`Failed to update status for election ${electionId}:`, error);
            alert('Failed to update election status. Check console for details.');
        }
    };

    const handleDeleteElection = async (electionId) => {
        if (!window.confirm(`Are you sure you want to delete election ID ${electionId}? This action cannot be undone.`)) {
            return;
        }
        try {
            await deleteElection(electionId);
            // Refresh the list immediately after success
            const data = await getAllElections();
            setElections(data);
        } catch (error) {
            console.error(`Failed to delete election ${electionId}:`, error);
            alert('Failed to delete election. Check console for details.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                    <span className="ml-3 text-lg text-gray-700">Loading elections...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Elections</h1>
                <p className="text-gray-600">Create and manage elections for the voting platform.</p>
            </div>

            <div className="mb-8">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    {showForm ? (
                        <>
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancel
                        </>
                    ) : (
                        <>
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create New Election
                        </>
                    )}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Election</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Election Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                placeholder="Annual General Election"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                placeholder="Describe the purpose and scope of this election"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                                <input
                                    type="datetime-local"
                                    id="start_time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                                <input
                                    type="datetime-local"
                                    id="end_time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Create Election
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Existing Elections</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {elections.length} {elections.length === 1 ? 'Election' : 'Elections'}
                </span>
            </div>

            {elections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {elections.map(election => (
                        <div key={election.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900">{election.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                                        {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm text-gray-600">
                                    {election.description || 'No description provided'}
                                </p>

                                <div className="mt-4 space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Start Time</p>
                                        <p className="text-sm text-gray-900">{formatDate(election.start_time)}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-gray-500">End Time</p>
                                        <p className="text-sm text-gray-900">{formatDate(election.end_time)}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor={`status-${election.id}`} className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        id={`status-${election.id}`}
                                        value={election.status}
                                        onChange={(e) => handleStatusChange(election.id, e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={() => handleDeleteElection(election.id)}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"></path>
                                        </svg>
                                        Delete Election
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No elections found</h3>
                    <p className="mt-2 text-gray-500">Get started by creating a new election.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create Election
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageElections;