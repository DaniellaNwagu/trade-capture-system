import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import Snackbar from './Snackbar';
import { validateTradeCreation, validateTradeAmendment, validateTradeRead } from '../utils/api';
import { Trade, ValidationResult } from '../utils/tradeTypes';
import { getDefaultTrade } from '../utils/tradeUtils';
import userStore from '../stores/userStore';

interface TradeValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade?: Trade;
  mode?: 'create' | 'amend' | 'read';
}

export const TradeValidationModal: React.FC<TradeValidationModalProps> = observer(({ 
  isOpen, 
  onClose, 
  trade = getDefaultTrade(), 
  mode = 'create' 
}) => {
  const [currentMode, setCurrentMode] = React.useState(mode);
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [snackbarType, setSnackbarType] = React.useState<'success' | 'error'>('success');

  const handleValidation = async () => {
    if (!userStore.user?.loginId) {
      setSnackbarMsg('User login ID not available');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      let response;
      
      if (currentMode === 'create') {
        response = await validateTradeCreation(trade, userStore.user.loginId);
      } else if (currentMode === 'amend') {
        response = await validateTradeAmendment(trade, userStore.user.loginId);
      } else {
        response = await validateTradeRead(userStore.user.loginId);
      }
      
      setValidationResult(response.data);
      setSnackbarMsg('Validation completed');
      setSnackbarType('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Validation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSnackbarType('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setValidationResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Trade Validation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Mode Selection */}
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={currentMode === 'create' ? 'primary' : 'secondary'}
              onClick={() => { setCurrentMode('create'); setValidationResult(null); }}
              size="sm"
            >
              Validate Creation
            </Button>
            <Button
              variant={currentMode === 'amend' ? 'primary' : 'secondary'}
              onClick={() => { setCurrentMode('amend'); setValidationResult(null); }}
              size="sm"
            >
              Validate Amendment
            </Button>
            <Button
              variant={currentMode === 'read' ? 'primary' : 'secondary'}
              onClick={() => { setCurrentMode('read'); setValidationResult(null); }}
              size="sm"
            >
              Validate Read Access
            </Button>
          </div>
        </div>

        {/* Trade Information */}
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-2">Trade Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Trade ID:</strong> {trade.tradeId || 'New Trade'}</div>
            <div><strong>Counterparty:</strong> {trade.counterpartyName || 'Not specified'}</div>
            <div><strong>Book:</strong> {trade.bookName || 'Not specified'}</div>
            <div><strong>Trade Type:</strong> {trade.tradeType || 'Not specified'}</div>
            <div><strong>Trade Date:</strong> {trade.tradeDate || 'Not specified'}</div>
            <div><strong>Status:</strong> {trade.tradeStatus || 'Not specified'}</div>
            <div><strong>Legs:</strong> {trade.tradeLegs?.length || 0}</div>
            <div><strong>User:</strong> {userStore.user?.loginId || 'Not logged in'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button variant="primary" onClick={handleValidation} disabled={loading}>
            {loading ? 'Validating...' : `Validate ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`}
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear Results
          </Button>
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Validation Results */}
        {validationResult && !loading && (
          <div className="mt-4">
            <div className={`p-4 rounded-lg mb-4 ${
              validationResult.isValid 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  validationResult.isValid ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <h3 className={`text-lg font-semibold ${
                  validationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.isValid ? 'Validation Passed' : 'Validation Failed'}
                </h3>
              </div>
              
              {validationResult.errors.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="mb-1">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Warnings:</h4>
                  <ul className="list-disc list-inside text-yellow-700">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index} className="mb-1">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Validation Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Validation Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Mode:</strong> {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Validation
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`ml-1 font-semibold ${
                    validationResult.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validationResult.isValid ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div>
                  <strong>Errors:</strong> {validationResult.errors.length}
                </div>
                <div>
                  <strong>Warnings:</strong> {validationResult.warnings.length}
                </div>
              </div>
            </div>
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

export default TradeValidationModal;
