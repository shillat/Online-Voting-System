// src/components/CandidatesPage.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const CandidatesPage = () => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voteCast, setVoteCast] = useState(false);
    const [votedCandidate, setVotedCandidate] = useState(null);
    const { getAllElections, getCandidatesByElection, submitVote } = useApi();
    const { currentUser } = useAuth();

    useEffect(() => {
        const loadElections = async () => {
            try {
                const data = await getAllElections();
                setElections(data);
                // Automatically select the first election if available
                if (data.length > 0) {
                    setSelectedElection(data[0]);
                }
            } catch (error) {
                console.error("Failed to load elections:", error);
            } finally {
                setLoading(false);
            }
        };

        loadElections();
    }, [getAllElections]);

    useEffect(() => {
        const loadCandidates = async () => {
            if (!selectedElection) return;

            try {
                const data = await getCandidatesByElection(selectedElection.id);
                // Show all candidates, but visually distinguish approved vs pending
                setCandidates(data);
            } catch (error) {
                console.error("Failed to load candidates:", error);
                setCandidates([]);
            }
        };

        loadCandidates();
    }, [selectedElection, getCandidatesByElection]);

    const handleElectionChange = (election) => {
        setSelectedElection(election);
        setVoteCast(false); // Reset vote status when changing elections
        setVotedCandidate(null);
    };

    const handleVote = async (candidateId, candidateName) => {
        if (!currentUser) {
            alert("You must be logged in to vote.");
            return;
        }

        const voteData = {
            voterId: currentUser.id,
            candidateId,
            electionId: selectedElection.id
        };

        try {
            await submitVote(voteData);
            setVotedCandidate(candidateName);
            setVoteCast(true);
        } catch (error) {
            alert("Vote submission failed. Please try again.");
            console.error('Vote error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-700">Loading elections...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (voteCast) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Vote Successful!</h2>
                        <p className="text-lg text-gray-600 mb-2">Thank you for participating in the election.</p>
                        <p className="text-lg text-gray-600 mb-6">Your vote for <span className="font-semibold text-teal-700">{votedCandidate}</span> has been securely recorded.</p>
                        <button
                            onClick={() => {
                                setVoteCast(false);
                                setVotedCandidate(null);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg hover:from-teal-700 hover:to-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 shadow-md hover:shadow-lg"
                        >
                            View More Elections
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Elections & Candidates</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Browse available elections and view candidates. Cast your vote for your preferred candidates.
                    </p>
                </div>

                {/* Election Selector */}
                <div className="mb-10 bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                            <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Select an Election</h2>
                    </div>
                    <p className="text-gray-600 mb-5">
                        Choose an election below to view the candidates running for various positions.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {elections.map(election => (
                            <button
                                key={election.id}
                                onClick={() => handleElectionChange(election)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedElection && selectedElection.id === election.id
                                        ? 'bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {election.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Election Details */}
                {selectedElection && (
                    <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedElection.name}</h2>
                        </div>
                        <p className="text-gray-700 mb-5">{selectedElection.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Start Time</p>
                                <p className="font-medium text-gray-900">{new Date(selectedElection.start_time).toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">End Time</p>
                                <p className="font-medium text-gray-900">{new Date(selectedElection.end_time).toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Status</p>
                                <p className={`font-medium ${selectedElection.status === 'active'
                                        ? 'text-green-600'
                                        : selectedElection.status === 'upcoming'
                                            ? 'text-amber-600'
                                            : 'text-red-600'
                                    }`}>
                                    {selectedElection.status.charAt(0).toUpperCase() + selectedElection.status.slice(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Candidates List */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Candidates {selectedElection ? `for ${selectedElection.name}` : ''}
                            </h2>
                            <p className="text-gray-600">
                                {candidates.length > 0
                                    ? `Showing ${candidates.length} candidate(s)`
                                    : 'No candidates available for this election'}
                            </p>
                        </div>
                        {selectedElection && selectedElection.status === 'active' && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <svg className="mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Voting Active
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.length > 0 ? (
                            candidates.map(candidate => (
                                <div
                                    key={candidate.candidateId}
                                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${candidate.approved
                                            ? 'border-t-4 border-green-500'
                                            : 'border-t-4 border-amber-500'
                                        }`}
                                >
                                    {/* Candidate Image */}
                                    <div className="flex justify-center mt-6">
                                        {candidate.imageUrl ? (
                                            <img
                                                src={`http://localhost:8080${candidate.imageUrl}`}
                                                alt={`${candidate.voter?.firstName} ${candidate.voter?.lastName}`}
                                                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentElement.innerHTML = '<div class="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-2xl text-gray-500">👤</div>';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white flex items-center justify-center text-2xl text-gray-500 shadow-md">
                                                👤
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-center text-gray-900 mb-1">
                                            {candidate.voter?.firstName} {candidate.voter?.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600 text-center mb-2">Running for: {candidate.post || 'N/A'}</p>

                                        <div className="my-4">
                                            <p className="text-sm text-gray-700 line-clamp-3">
                                                {candidate.bio || 'No bio available for this candidate.'}
                                            </p>
                                        </div>

                                        {/* Approval status indicator */}
                                        <div className="flex justify-center mb-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${candidate.approved
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {candidate.approved ? (
                                                    <>
                                                        <svg className="mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                                                            <circle cx="4" cy="4" r="3" />
                                                        </svg>
                                                        Approved
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="mr-1.5 h-2 w-2 text-amber-600" fill="currentColor" viewBox="0 0 8 8">
                                                            <circle cx="4" cy="4" r="3" />
                                                        </svg>
                                                        Pending Approval
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {selectedElection && selectedElection.status === 'active' ? (
                                            candidate.approved ? (
                                                <button
                                                    onClick={() => handleVote(
                                                        candidate.candidateId,
                                                        `${candidate.voter?.firstName} ${candidate.voter?.lastName}`
                                                    )}
                                                    className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg hover:from-teal-700 hover:to-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 shadow hover:shadow-md"
                                                >
                                                    Cast Vote
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full py-2.5 px-4 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                                                >
                                                    Not Approved Yet
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full py-2.5 px-4 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                                            >
                                                Voting Not Active
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full">
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                                    <p className="text-gray-500 mb-6">
                                        {selectedElection
                                            ? "There are currently no candidates registered for this election."
                                            : "Please select an election to view candidates."}
                                    </p>
                                    {selectedElection && (
                                        <a href="/voter/apply" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                            Apply to be a Candidate
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!elections.length && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No elections available</h3>
                        <p className="text-gray-500">
                            There are currently no elections scheduled. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidatesPage;