// src/components/ViewResults.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const ViewResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedElection, setSelectedElection] = useState('');
    const [elections, setElections] = useState([]);
    const { getVoteCountsByElection, getAllElections } = useApi();
    const { userRole } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const electionsData = await getAllElections();
                setElections(electionsData);

                if (electionsData.length > 0) {
                    setSelectedElection(electionsData[0].id);
                }
            } catch (error) {
                console.error('Failed to load elections:', error);
            }
        };

        if (userRole === 'admin') {
            fetchData();
        }
    }, [getAllElections, userRole]);

    useEffect(() => {
        const fetchResults = async () => {
            if (selectedElection) {
                try {
                    const data = await getVoteCountsByElection(selectedElection);
                    setResults(data);
                } catch (error) {
                    console.error('Failed to load results:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (userRole === 'admin') {
            fetchResults();
        }
    }, [selectedElection, getVoteCountsByElection, userRole]);

    // Calculate total votes for percentage calculation
    const totalVotes = results.reduce((sum, [_, count]) => sum + count, 0);

    // Function to get status color based on election status
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
                    <span className="ml-3 text-lg text-gray-700">Loading results...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Results</h1>
                <p className="text-gray-600">View vote tallies and statistics for completed elections.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Filter Results</h2>
                        <p className="text-sm text-gray-500">Select an election to view results</p>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="election-select" className="mr-3 text-sm font-medium text-gray-700">Election:</label>
                        <select
                            id="election-select"
                            value={selectedElection}
                            onChange={(e) => setSelectedElection(e.target.value)}
                            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                        >
                            {elections.map(election => (
                                <option key={election.id} value={election.id}>
                                    {election.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedElection && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2">Selected Election:</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                {elections.find(e => e.id == selectedElection)?.name}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(elections.find(e => e.id == selectedElection)?.status)}`}>
                                {elections.find(e => e.id == selectedElection)?.status?.charAt(0).toUpperCase() + elections.find(e => e.id == selectedElection)?.status?.slice(1)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {results.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Voting Results</h2>
                        <p className="text-sm text-gray-500 mt-1">Total votes cast: {totalVotes}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map(([candidate, voteCount], index) => {
                                    const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100) : 0;
                                    return (
                                        <tr key={candidate.candidateId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-600 font-medium">
                                                                {candidate.voter?.firstName?.charAt(0)}{candidate.voter?.lastName?.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {candidate.voter?.firstName} {candidate.voter?.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{candidate.post}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{voteCount}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{percentage.toFixed(1)}%</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-teal-600 h-2.5 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{results.length}</span> candidates
                            </p>
                            <p className="text-sm text-gray-700 mt-2 sm:mt-0">
                                Election status: <span className="font-medium">
                                    {elections.find(e => e.id == selectedElection)?.status?.charAt(0).toUpperCase() + elections.find(e => e.id == selectedElection)?.status?.slice(1) || 'Unknown'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No results available</h3>
                    <p className="mt-2 text-gray-500">No votes have been recorded for the selected election yet.</p>
                </div>
            )}

            {/* Footer with copyright and contact information */}
            <footer className="mt-12 rounded-lg bg-gradient-to-r from-teal-700 to-teal-900 text-white p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="text-sm">
                        <p>© 2025 Online Voting Platform. All rights reserved.</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-sm">
                        <p>Developed by: Shillah Naigaga</p>
                        <p className="mt-1">Contact: shillahnaigaga5@gmail.com</p>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm opacity-90">
                    <p>Courtesy of the Online Voting Platform Development Team</p>
                </div>
            </footer>
        </div>
    );
};

export default ViewResults;