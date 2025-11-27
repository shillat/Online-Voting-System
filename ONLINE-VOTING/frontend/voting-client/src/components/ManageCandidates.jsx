// src/components/ManageCandidates.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ManageCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState('');
    const [elections, setElections] = useState([]);
    const [error, setError] = useState('');
    const { getCandidatesByElection, getAllElections, updateCandidate, deleteCandidate } = useApi();
    const { userRole } = useAuth();

    // Refs to prevent race conditions
    const isMountedRef = useRef(false);
    const loadingRef = useRef(false);

    // Load elections data - run only once on component mount
    useEffect(() => {
        isMountedRef.current = true;
        loadingRef.current = true;

        const loadElections = async () => {
            if (userRole !== 'admin' || !isMountedRef.current) return;

            try {
                setError('');
                const electionsData = await getAllElections();
                if (!isMountedRef.current) return;

                setElections(electionsData);

                // Set the first election as selected if none is selected and we have elections
                if (electionsData.length > 0 && !selectedElection) {
                    setSelectedElection(electionsData[0].id.toString());
                }
            } catch (error) {
                if (!isMountedRef.current) return;
                console.error('Failed to load elections:', error);
                setError('Failed to load elections. Please make sure the backend server is running.');
            } finally {
                if (isMountedRef.current) {
                    loadingRef.current = false;
                }
            }
        };

        loadElections();

        return () => {
            isMountedRef.current = false;
        };
    }, [getAllElections, userRole]); // Removed selectedElection from dependencies to prevent loop

    // Load candidates data when election changes
    useEffect(() => {
        const loadCandidates = async () => {
            if (userRole !== 'admin' || !selectedElection || !isMountedRef.current) return;

            try {
                setLoading(true);
                setError('');
                const data = await getCandidatesByElection(selectedElection);
                if (!isMountedRef.current) return;
                setCandidates(data);
            } catch (error) {
                if (!isMountedRef.current) return;
                console.error('Failed to load candidates:', error);
                setError('Failed to load candidates. Please make sure the backend server is running.');
                setCandidates([]);
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        };

        loadCandidates();
    }, [selectedElection, getCandidatesByElection, userRole]); // Only depend on selectedElection

    const handleApprovalChange = async (candidateId, currentApproved) => {
        // Find the candidate in the local state to preserve all fields
        const candidate = candidates.find(c => c.candidateId === candidateId);
        if (!candidate) {
            console.error('Candidate not found');
            return;
        }

        try {
            // Send all candidate data with updated approval status
            const updatedCandidateData = {
                ...candidate,
                approved: !currentApproved
            };

            await updateCandidate(candidateId, updatedCandidateData);

            // Update local state
            if (isMountedRef.current) {
                setCandidates(prev => prev.map(c =>
                    c.candidateId === candidateId
                        ? { ...c, approved: !currentApproved }
                        : c
                ));
            }
        } catch (error) {
            console.error('Failed to update approval status:', error);
            alert('Failed to update approval status. Please make sure the backend server is running.');
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        // Find the candidate name for the confirmation message
        const candidate = candidates.find(c => c.candidateId === candidateId);
        const candidateName = candidate ? `${candidate.voter?.firstName} ${candidate.voter?.lastName}` : 'this candidate';

        if (!window.confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteCandidate(candidateId);

            // Update local state to remove the deleted candidate
            if (isMountedRef.current) {
                setCandidates(prev => prev.filter(c => c.candidateId !== candidateId));
            }
        } catch (error) {
            console.error('Failed to delete candidate:', error);
            // Provide more detailed error information
            let errorMessage = 'Failed to delete candidate. ';
            if (error.response) {
                // Server responded with an error status
                errorMessage += `Server responded with status ${error.response.status}. `;
                if (error.response.data) {
                    errorMessage += `Message: ${error.response.data}. `;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage += 'No response received from server. Please make sure the backend server is running and accessible. ';
            } else {
                // Something else happened
                errorMessage += `Error: ${error.message}. `;
            }
            alert(errorMessage);
        }
    };

    // Handle election selection change
    const handleElectionChange = (e) => {
        setSelectedElection(e.target.value);
    };

    // Show loading state only on initial load
    if ((loading || loadingRef.current) && candidates.length === 0 && elections.length === 0) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                    <span className="ml-3 text-lg text-gray-700">Loading candidates and elections...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Candidates</h1>
                <p className="text-gray-600">Review and approve candidate applications for elections.</p>
            </div>

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

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Filter Candidates</h2>
                        <p className="text-sm text-gray-500">Select an election to view candidates</p>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="election-select" className="mr-3 text-sm font-medium text-gray-700">Election:</label>
                        <select
                            id="election-select"
                            value={selectedElection}
                            onChange={handleElectionChange}
                            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            disabled={elections.length === 0}
                        >
                            <option value="">-- Select Election --</option>
                            {elections.map(election => (
                                <option key={election.id} value={election.id}>
                                    {election.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Show loading indicator when switching elections */}
            {(loading || loadingRef.current) && candidates.length > 0 && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
                    <span className="ml-3 text-gray-700">Loading candidates for selected election...</span>
                </div>
            )}

            {!selectedElection ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Select an Election</h3>
                    <p className="mt-2 text-gray-500">Please select an election from the dropdown above to view candidates.</p>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Candidates {selectedElection && `for ${elections.find(e => e.id == selectedElection)?.name}`}
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {candidates.length} {candidates.length === 1 ? 'Candidate' : 'Candidates'}
                        </span>
                    </div>

                    {(!loading && !loadingRef.current) && candidates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {candidates.map(candidate => (
                                <div key={candidate.candidateId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {candidate.voter?.firstName} {candidate.voter?.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{candidate.voter?.email}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.approved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {candidate.approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            <div className="flex justify-center">
                                                {candidate.imageUrl ? (
                                                    <img
                                                        src={`http://localhost:8080${candidate.imageUrl}`}
                                                        alt={`${candidate.voter?.firstName} ${candidate.voter?.lastName}`}
                                                        className="w-20 h-20 object-cover rounded-full border-2 border-white shadow"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.parentElement.innerHTML = '<div class="w-20 h-20 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xl text-gray-500">👤</div>';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center text-xl text-gray-500 shadow">
                                                        👤
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Position</p>
                                                <p className="text-gray-900">{candidate.post || 'N/A'}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Bio</p>
                                                <p className="text-gray-900 text-sm">
                                                    {candidate.bio || 'No bio provided'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Registered</p>
                                                <p className="text-gray-900 text-sm">
                                                    {candidate.dateRegistered ? new Date(candidate.dateRegistered).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            <button
                                                onClick={() => handleApprovalChange(candidate.candidateId, candidate.approved)}
                                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${candidate.approved
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    } transition-colors duration-200`}
                                            >
                                                {candidate.approved ? 'Disapprove' : 'Approve'}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteCandidate(candidate.candidateId)}
                                                className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        (!loading && !loadingRef.current) && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No candidates found</h3>
                                <p className="mt-2 text-gray-500">No candidates have applied for the selected election yet.</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageCandidates;