export interface TradeLeg {
  legId: string;
  legType: string;
  notional: number | string;
  currency: string;
  rate?: number | string;
  index?: string;
  calculationPeriodSchedule?: string;
  paymentBusinessDayConvention?: string;
  payReceiveFlag?: string;
  [key: string]: unknown;
}

export interface Trade {
  tradeId: string;
  version?: string;
  bookName?: string;
  counterpartyName?: string;
  traderUserName?: string;
  inputterUserName?: string;
  tradeType?: string;
  tradeSubType?: string;
  tradeStatus?: string;
  tradeDate?: string;
  startDate?: string;
  maturityDate?: string;
  executionDate?: string;
  utiCode?: string;
  lastTouchTimestamp?: string;
  validityStartDate?: string;
  settlementInstructions?: string;
  tradeLegs: TradeLeg[];
  [key: string]: unknown;
}

export interface CashflowDTO {
  id?: number;
  paymentValue: number | string;
  valueDate: string;
  payRec: string;
  paymentType: string;
  paymentBusinessDayConvention?: string;
  rate?: number | string;
}

export interface CashflowGenerationLegDTO {
  legType: string;
  notional: number;
  rate?: number;
  index?: string;
  calculationPeriodSchedule?: string;
  paymentBusinessDayConvention?: string;
  payReceiveFlag?: string;
}

// Dashboard Types
export interface DashboardSummaryDTO {
  totalTrades: number;
  activeTrades: number;
  newTrades: number;
  amendedTrades: number;
  terminatedTrades: number;
  totalNotional: number;
  notionalToday: number;
  notionalThisWeek: number;
  notionalThisMonth: number;
  tradesToday: number;
  tradesThisWeek: number;
  tradesThisMonth: number;
  mostActiveCounterparty: string;
  mostActiveBook: string;
  lastTradeDate: string;
}

export interface TradeBlotterDTO {
  tradeId: number;
  version: number;
  tradeDate: string;
  tradeStartDate: string;
  tradeMaturityDate: string;
  active: boolean;
  createdDate: string;
  lastTouchTimestamp: string;
  tradeStatus: string;
  counterpartyName: string;
  bookName: string;
  traderUserName: string;
  inputterUserName: string;
  tradeType: string;
  tradeSubType: string;
  leg1Notional: number;
  leg1Currency: string;
  leg1Type: string;
  leg1Rate: number;
  leg2Notional: number;
  leg2Currency: string;
  leg2Type: string;
  leg2Rate: number;
  totalNotional: number;
  primaryCurrency: string;
  cashflowCount: number;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Search Types
export interface SearchParams {
  counterpartyName?: string;
  bookName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
