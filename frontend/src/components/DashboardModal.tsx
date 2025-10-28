import React from 'react';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@tanstack/react-query';
import AGGridTable from './AGGridTable';
import LoadingSpinner from './LoadingSpinner';
import Snackbar from './Snackbar';
import { getDashboardSummary, getTradeBlotter, getTraderBlotter } from '../utils/api';
import { TradeBlotterDTO } from '../utils/tradeTypes';
import { getColDefFromResult, getRowDataFromData } from '../utils/agGridUtils';
import userStore from '../stores/userStore';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = observer(({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'summary' | 'blotter' | 'trader'>('summary');
  const [paginationParams, setPaginationParams] = React.useState({
    page: 0,
    size: 20,
    sort: 'tradeDate,desc'
  });
  const [blotterData, setBlotterData] = React.useState<TradeBlotterDTO[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [snackbarType, setSnackbarType] = React.useState<'success' | 'error'>('success');

  // Fetch dashboard summary
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => getDashboardSummary(),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  // Fetch trade blotter
  const { data: blotterResponse, isLoading: blotterLoading } = useQuery({
    queryKey: ['dashboard-blotter', paginationParams],
    queryFn: () => getTradeBlotter(paginationParams),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (blotterResponse?.data?.content) {
      setBlotterData(blotterResponse.data.content);
    }
  }, [blotterResponse]);

  const handleTraderBlotter = async () => {
    if (!userStore.user?.id) {
      setSnackbarMsg('User ID not available');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await getTraderBlotter(userStore.user.id);
      setBlotterData(response.data || []);
      setActiveTab('trader');
      setSnackbarMsg(`Loaded ${response.data?.length || 0} trades for trader`);
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Failed to load trader blotter: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSnackbarType('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  const columnDefs = getColDefFromResult(blotterData);
  const rowData = getRowDataFromData(blotterData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Trading Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'blotter' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('blotter')}
          >
            Trade Blotter
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'trader' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={handleTraderBlotter}
          >
            My Trades
          </button>
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            {summaryLoading ? (
              <LoadingSpinner />
            ) : summaryData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Trade Counts */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Total Trades</h3>
                  <p className="text-2xl font-bold text-blue-600">{summaryData.totalTrades}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Active Trades</h3>
                  <p className="text-2xl font-bold text-green-600">{summaryData.activeTrades}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800">New Trades</h3>
                  <p className="text-2xl font-bold text-yellow-600">{summaryData.newTrades}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800">Terminated</h3>
                  <p className="text-2xl font-bold text-red-600">{summaryData.terminatedTrades}</p>
                </div>

                {/* Financial Metrics */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Total Notional</h3>
                  <p className="text-xl font-bold text-purple-600">{formatCurrency(summaryData.totalNotional)}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-800">Today&apos;s Notional</h3>
                  <p className="text-xl font-bold text-indigo-600">{formatCurrency(summaryData.notionalToday)}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-800">This Week</h3>
                  <p className="text-xl font-bold text-teal-600">{formatCurrency(summaryData.notionalThisWeek)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800">This Month</h3>
                  <p className="text-xl font-bold text-orange-600">{formatCurrency(summaryData.notionalThisMonth)}</p>
                </div>

                {/* Activity Metrics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Trades Today</h3>
                  <p className="text-2xl font-bold text-gray-600">{summaryData.tradesToday}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Trades This Week</h3>
                  <p className="text-2xl font-bold text-gray-600">{summaryData.tradesThisWeek}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Trades This Month</h3>
                  <p className="text-2xl font-bold text-gray-600">{summaryData.tradesThisMonth}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Last Trade Date</h3>
                  <p className="text-lg font-bold text-gray-600">{formatDate(summaryData.lastTradeDate)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No summary data available</div>
            )}

            {/* Activity Insights */}
            {summaryData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Most Active Counterparty</h3>
                  <p className="text-xl font-bold text-blue-600">{summaryData.mostActiveCounterparty}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Most Active Book</h3>
                  <p className="text-xl font-bold text-green-600">{summaryData.mostActiveBook}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blotter Tab */}
        {activeTab === 'blotter' && (
          <div>
            {blotterLoading ? (
              <LoadingSpinner />
            ) : blotterData.length > 0 ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Trade Blotter ({blotterData.length} trades)</h3>
                  {blotterResponse?.data && (
                    <p className="text-sm text-gray-600">
                      Page {paginationParams.page + 1} of {blotterResponse.data.totalPages} 
                      ({blotterResponse.data.totalElements} total trades)
                    </p>
                  )}
                </div>
                <AGGridTable
                  columnDefs={columnDefs}
                  rowData={rowData}
                  onSelectionChanged={() => {}}
                  rowSelection="single"
                />
                
                {/* Pagination Controls */}
                {blotterResponse?.data && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={paginationParams.page === 0}
                        onClick={() => setPaginationParams(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        Previous
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={paginationParams.page >= blotterResponse.data.totalPages - 1}
                        onClick={() => setPaginationParams(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Showing {paginationParams.page * paginationParams.size + 1} to{' '}
                      {Math.min((paginationParams.page + 1) * paginationParams.size, blotterResponse.data.totalElements)} of{' '}
                      {blotterResponse.data.totalElements} trades
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">No trade data available</div>
            )}
          </div>
        )}

        {/* Trader Tab */}
        {activeTab === 'trader' && (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : blotterData.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">My Trades ({blotterData.length} trades)</h3>
                <AGGridTable
                  columnDefs={columnDefs}
                  rowData={rowData}
                  onSelectionChanged={() => {}}
                  rowSelection="single"
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">No trades found for this trader</div>
            )}
          </div>
        )}

        <Snackbar
          open={snackbarOpen}
          message={snackbarMsg}
          type={snackbarType}
          onClose={() => setSnackbarOpen(false)}
        />
      </div>
    </div>
  );
});

export default DashboardModal;
