import React from 'react';

interface GAnalyticsProps {
  currentRows: {
    dimensionValues: { value: string }[];
    metricValues: { value: string }[];
  }[];
  handlePageChange: (pageNumber: number) => void;
  currentPage: number;
  indexOfLastRow: number;
  totalRows: number;
}

const GAnalytics = ({ currentRows, handlePageChange, currentPage, indexOfLastRow, totalRows }: GAnalyticsProps) => {
  return (
    <>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-start">Page Path</th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-start">Active Users</th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-start">Sessions</th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-start">Bounce Rate</th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-start">Average Session Duration</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{row.dimensionValues[0]?.value || 'N/A'}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{row.metricValues[0]?.value || 'N/A'}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{row.metricValues[1]?.value || 'N/A'}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{row.metricValues[2]?.value || 'N/A'}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{row.metricValues[3]?.value || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastRow >= totalRows}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default GAnalytics;