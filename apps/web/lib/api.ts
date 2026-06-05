import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const userId = localStorage.getItem('userId')
        const refreshToken = localStorage.getItem('refreshToken')
        if (!userId || !refreshToken) throw new Error('no tokens')

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { userId, refreshToken })
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: unknown) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const invoicesApi = {
  list: (params?: Record<string, unknown>) => api.get('/invoices', { params }),
  get: (id: string) => api.get(`/invoices/${id}`),
  create: (data: unknown) => api.post('/invoices', data),
  submit: (id: string) => api.patch(`/invoices/${id}/submit`),
  cancel: (id: string) => api.patch(`/invoices/${id}/cancel`),
  stats: (year?: number) => api.get('/invoices/stats', { params: { year } }),
}

export const reportsApi = {
  dashboard: () => api.get('/reports/dashboard'),
  zatcaMonthly: (month: number, year: number) => api.get('/reports/zatca-monthly', { params: { month, year } }),
}

export const tenantApi = {
  get: () => api.get('/tenant'),
  update: (data: unknown) => api.patch('/tenant', data),
}

export const aiApi = {
  fraudAnalysis:   () => api.get('/ai/fraud-analysis'),
  dataCleansing:   () => api.get('/ai/data-cleansing'),
  forecast:        () => api.get('/ai/forecast'),
  advisoryReport:  () => api.get('/ai/advisory-report'),
  extractInvoice:  (text: string) => api.post('/ai/extract-invoice', { text }),
}
