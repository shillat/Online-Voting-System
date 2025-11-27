// src/components/ApplicationPage.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ApplicationPage = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        voter: null,
        elections: null,
        post: '',
        bio: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { getAllElections, createCandidate } = useApi();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const data = await getAllElections();
                setElections(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load elections:', error);
                setErrorMessage('Failed to load elections. Please make sure the backend server is running.');
                setLoading(false);
            }
        };

        fetchElections();
    }, [getAllElections]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleElectionChange = (e) => {
        const electionId = parseInt(e.target.value);
        const selectedElection = elections.find(el => el.id === electionId);
        setFormData(prev => ({
            ...prev,
            elections: selectedElection
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form data
        if (!formData.elections) {
            setErrorMessage('Please select an election');
            return;
        }

        if (!currentUser || !currentUser.id) {
            setErrorMessage('User not logged in properly. Please log in again.');
            return;
        }

        try {
            // Create the candidate application data with the correct structure
            const applicationData = {
                voter: { id: currentUser.id },
                elections: { id: formData.elections.id },
                post: formData.post,
                bio: formData.bio
            };

            const result = await createCandidate(applicationData, formData.image);
            setSuccessMessage('Application submitted successfully! Waiting for admin approval.');
            // Reset form
            setFormData({
                voter: null,
                elections: null,
                post: '',
                bio: '',
                image: null
            });
            setImagePreview(null);
        } catch (error) {
            console.error('Error submitting application:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to submit application. Please make sure the backend server is running.');
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-xl font-semibold">Loading elections...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-teal-800 mb-3">Apply to be a Candidate</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Fill out the form below to apply for a position in an upcoming election.
                    Your application will be reviewed by administrators before approval.
                </p>
            </div>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 transition-all duration-300 ease-in-out">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 transition-all duration-300 ease-in-out">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{errorMessage}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-800">
                    <h2 className="text-xl font-semibold text-white">Candidate Application Form</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label htmlFor="election" className="block text-gray-700 font-medium mb-2">
                            Select Election
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            Choose the election you wish to participate in. Make sure you meet all eligibility requirements.
                        </p>
                        <select
                            id="election"
                            onChange={handleElectionChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                        >
                            <option value="">-- Select an Election --</option>
                            {elections.map(election => (
                                <option key={election.id} value={election.id}>
                                    {election.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="post" className="block text-gray-700 font-medium mb-2">
                            Position Applying For
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            Specify the exact position/title you are running for (e.g., President, Secretary, Treasurer).
                        </p>
                        <input
                            type="text"
                            id="post"
                            name="post"
                            value={formData.post}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                            placeholder="e.g., President, Secretary, Treasurer"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                            Candidate Bio/Statement
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            Share your background, qualifications, and reasons for running. This will be visible to voters.
                        </p>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            required
                            rows="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                            placeholder="Tell us about yourself and why you're running for this position..."
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                            Candidate Photo
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            Upload a clear, professional photo of yourself. This helps voters recognize you.
                            Supported formats: JPG, PNG, GIF (Max size: 10MB).
                        </p>
                        <div className="flex items-start space-x-6">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                                />
                            </div>
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-teal-300 shadow-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg hover:from-teal-700 hover:to-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Application Process</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                After submitting your application, it will be reviewed by administrators.
                                You will receive a notification once your application is approved or rejected.
                                Approved candidates will appear on the voting ballot for their respective elections.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationPage;