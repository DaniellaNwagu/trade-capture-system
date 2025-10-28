import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const fetchTrades = () => api.get('/trades');

export const fetchAllUsers = async () => {
  console.log("Fetching all users from the API");
  return await api.get('/users').then((res) => {return res});
};

export const createUser = (user) => api.post('/users', user);

export const fetchUserProfiles = () => api.get('/userProfiles');

export const updateUser = (id, user) => api.put(`/users/${id}`, user);

export const authenticate = (user: string, pass: string) => {
  return api.post(`/login/${user}`, null, {
    params: {
      Authorization: pass
    }
  });
}

export const getUserByLogin = (login: string) => {
    return api.get(`/users/loginId/${login}`);
}
// Settlement Instructions API functions
export const getSettlementInstructions = (tradeId: string) =>
  api.get(`/trades/${tradeId}/settlement-instructions`);

export const updateSettlementInstructions = (tradeId: string, instructions: string) =>
  api.put(`/trades/${tradeId}/settlement-instructions`, { instructions });

export const deleteSettlementInstructions = (tradeId: string) =>
  api.delete(`/trades/${tradeId}/settlement-instructions`);

// Advanced Search API functions
export const searchTrades = (params: {
  counterpartyName?: string;
  bookName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => api.get('/trades/search', { params });

export const getTradesPaginated = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) => api.get('/trades/filter', { params });

export const searchTradesRsql = (query: string) =>
  api.get('/trades/rsql', { params: { query } });

// Dashboard API functions
export const getDashboardSummary = (userId?: number) =>
  api.get('/dashboard/summary', { params: userId ? { userId } : {} });

export const getTradeBlotter = (params: {
  userId?: number;
  page?: number;
  size?: number;
  sort?: string;
}) => api.get('/dashboard/blotter', { params });

export const getTraderBlotter = (traderId: number) =>
  api.get(`/dashboard/trader/${traderId}/blotter`);

// Trade Validation API functions
export const validateTradeCreation = (tradeData: Record<string, unknown>, userId: string) =>
  api.post('/trades/validate/create', tradeData, { params: { userId } });

export const validateTradeAmendment = (tradeData: Record<string, unknown>, userId: string) =>
  api.post('/trades/validate/amend', tradeData, { params: { userId } });

export const validateTradeRead = (userId: string) =>
  api.get('/trades/validate/read', { params: { userId } });

export default api;

