import React, { useState } from "react";
import Button from "./Button";
import AdvancedSearchModal from "./AdvancedSearchModal";
import DashboardModal from "./DashboardModal";
import TradeValidationModal from "./TradeValidationModal";
import { getDefaultTrade } from "../utils/tradeUtils";

export const HomeContent: React.FC = () => {
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
    const [validationModalOpen, setValidationModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-8">
            <h1 className="text-3xl font-bold mb-8">Welcome to the Trade Platform</h1>
            <p className="text-lg text-gray-600 mb-8">Use the navigation to access trades, entities, and admin features.</p>
            
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {/* Advanced Search Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
                        <p className="text-gray-600 mb-4">Search trades using multiple criteria, RSQL queries, and pagination.</p>
                        <Button 
                            variant="primary" 
                            onClick={() => setSearchModalOpen(true)}
                            className="w-full"
                        >
                            Open Search
                        </Button>
                    </div>
                </div>

                {/* Dashboard Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Trading Dashboard</h3>
                        <p className="text-gray-600 mb-4">View summary statistics, trade blotter, and personalized trading insights.</p>
                        <Button 
                            variant="primary" 
                            onClick={() => setDashboardModalOpen(true)}
                            className="w-full"
                        >
                            Open Dashboard
                        </Button>
                    </div>
                </div>

                {/* Validation Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Trade Validation</h3>
                        <p className="text-gray-600 mb-4">Validate trades for creation, amendment, and read access with comprehensive business rules.</p>
                        <Button 
                            variant="primary" 
                            onClick={() => setValidationModalOpen(true)}
                            className="w-full"
                        >
                            Validate Trade
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AdvancedSearchModal 
                isOpen={searchModalOpen} 
                onClose={() => setSearchModalOpen(false)} 
            />
            <DashboardModal 
                isOpen={dashboardModalOpen} 
                onClose={() => setDashboardModalOpen(false)} 
            />
            <TradeValidationModal 
                isOpen={validationModalOpen} 
                onClose={() => setValidationModalOpen(false)}
                trade={getDefaultTrade()}
                mode="create"
            />
        </div>
    );
}