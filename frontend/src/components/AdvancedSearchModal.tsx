import React from 'react';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@tanstack/react-query';
import Button from './Button';
import Input from './Input';
import Dropdown from './Dropdown';
import AGGridTable from './AGGridTable';
import LoadingSpinner from './LoadingSpinner';
import Snackbar from './Snackbar';
import { searchTrades, getTradesPaginated, searchTradesRsql } from '../utils/api';
import { Trade, SearchParams, PaginationParams } from '../utils/tradeTypes';
import staticStore from '../stores/staticStore';
import { getColDefFromResult, getRowDataFromData } from '../utils/agGridUtils';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = observer(({ isOpen, onClose }) => {
  const [searchParams, setSearchParams] = React.useState<SearchParams>({});
  const [paginationParams, setPaginationParams] = React.useState<PaginationParams>({
    page: 0,
    size: 20,
    sortBy: 'tradeDate',
    sortDir: 'desc'
  });
  const [rsqlQuery, setRsqlQuery] = React.useState<string>('');
  const [searchMode, setSearchMode] = React.useState<'basic' | 'advanced' | 'rsql'>('basic');
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [snackbarType, setSnackbarType] = React.useState<'success' | 'error'>('success');

  // Load static data
  const { isSuccess } = useQuery({
    queryKey: ["staticValues"],
    queryFn: () => staticStore.fetchAllStaticValues(),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (isSuccess) {
      staticStore.isLoading = false;
    }
  }, [isSuccess]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchMode === 'rsql') {
        response = await searchTradesRsql(rsqlQuery);
      } else if (searchMode === 'advanced') {
        response = await getTradesPaginated(paginationParams);
      } else {
        response = await searchTrades(searchParams);
      }
      
      setTrades(response.data || []);
      setSnackbarMsg(`Found ${response.data?.length || 0} trades`);
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSnackbarType('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({});
    setRsqlQuery('');
    setTrades([]);
    setPaginationParams({
      page: 0,
      size: 20,
      sortBy: 'tradeDate',
      sortDir: 'desc'
    });
  };

  const handleParamChange = (key: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value || undefined }));
  };

  const handlePaginationChange = (key: keyof PaginationParams, value: string | number) => {
    setPaginationParams(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const columnDefs = getColDefFromResult(trades);
  const rowData = getRowDataFromData(trades);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Advanced Trade Search</h2>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>

        {/* Search Mode Selection */}
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={searchMode === 'basic' ? 'primary' : 'secondary'}
              onClick={() => setSearchMode('basic')}
              size="sm"
            >
              Basic Search
            </Button>
            <Button
              variant={searchMode === 'advanced' ? 'primary' : 'secondary'}
              onClick={() => setSearchMode('advanced')}
              size="sm"
            >
              Paginated Search
            </Button>
            <Button
              variant={searchMode === 'rsql' ? 'primary' : 'secondary'}
              onClick={() => setSearchMode('rsql')}
              size="sm"
            >
              RSQL Query
            </Button>
          </div>
        </div>

        {/* Basic Search */}
        {searchMode === 'basic' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Counterparty</label>
              <Dropdown
                options={staticStore.counterpartyValues?.map(cp => ({ value: cp, label: cp })) || []}
                value={searchParams.counterpartyName || ''}
                onChange={(e) => handleParamChange('counterpartyName', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Book</label>
              <Dropdown
                options={staticStore.bookValues?.map(book => ({ value: book, label: book })) || []}
                value={searchParams.bookName || ''}
                onChange={(e) => handleParamChange('bookName', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Dropdown
                options={staticStore.tradeStatusValues?.map(status => ({ value: status, label: status })) || []}
                value={searchParams.status || ''}
                onChange={(e) => handleParamChange('status', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={searchParams.startDate || ''}
                onChange={(e) => handleParamChange('startDate', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={searchParams.endDate || ''}
                onChange={(e) => handleParamChange('endDate', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Advanced Paginated Search */}
        {searchMode === 'advanced' && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Page</label>
              <Input
                type="number"
                value={paginationParams.page || 0}
                onChange={(e) => handlePaginationChange('page', parseInt(e.target.value) || 0)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <Input
                type="number"
                value={paginationParams.size || 20}
                onChange={(e) => handlePaginationChange('size', parseInt(e.target.value) || 20)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <Dropdown
                options={[
                  { value: 'tradeDate', label: 'Trade Date' },
                  { value: 'tradeId', label: 'Trade ID' },
                  { value: 'counterpartyName', label: 'Counterparty' },
                  { value: 'bookName', label: 'Book' },
                  { value: 'tradeStatus', label: 'Status' }
                ]}
                value={paginationParams.sortBy || 'tradeDate'}
                onChange={(e) => handlePaginationChange('sortBy', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Direction</label>
              <Dropdown
                options={[
                  { value: 'asc', label: 'Ascending' },
                  { value: 'desc', label: 'Descending' }
                ]}
                value={paginationParams.sortDir || 'desc'}
                onChange={(e) => handlePaginationChange('sortDir', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* RSQL Query */}
        {searchMode === 'rsql' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">RSQL Query</label>
            <textarea
              value={rsqlQuery}
              onChange={(e) => setRsqlQuery(e.target.value)}
              className="w-full h-20 p-2 border border-gray-300 rounded"
              placeholder="Enter RSQL query (e.g., counterparty.name==Goldman;tradeStatus.tradeStatus==LIVE)"
            />
            <div className="text-sm text-gray-600 mt-1">
              Examples: <br/>
              • counterparty.name==Goldman <br/>
              • tradeStatus.tradeStatus==LIVE <br/>
              • tradeDate=ge=2024-01-01;tradeDate=le=2024-12-31
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {/* Results */}
        {loading && <LoadingSpinner />}
        
        {trades.length > 0 && !loading && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Search Results ({trades.length} trades)</h3>
            <AGGridTable
              columnDefs={columnDefs}
              rowData={rowData}
              onSelectionChanged={() => {}}
              rowSelection="single"
            />
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

export default AdvancedSearchModal;

