'use client'

import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Oiron
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-First Financial Planning & Analysis Platform
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Frontend Mockup Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            This is a comprehensive frontend mockup for an AI-first FP&A platform
            designed to replace IBM TM1 Cognos. The mockup demonstrates modern UI/UX
            patterns for financial reporting, analysis, and budgeting workflows.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-700 mb-2">Financial Reports</h3>
              <p className="text-sm text-primary-600">Interactive P&L, Balance Sheet, Cash Flow</p>
            </div>
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <h3 className="font-semibold text-success-700 mb-2">Scenario Analysis</h3>
              <p className="text-sm text-success-600">What-if modeling and comparisons</p>
            </div>
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <h3 className="font-semibold text-warning-700 mb-2">Cost Allocation</h3>
              <p className="text-sm text-warning-600">Visual allocation rule builder</p>
            </div>
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
              <h3 className="font-semibold text-secondary-700 mb-2">AI Assistant</h3>
              <p className="text-sm text-secondary-600">Natural language insights</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          onClick={() => {
            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 1000)
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Explore Dashboard'}
        </button>
      </div>
    </div>
  )
}