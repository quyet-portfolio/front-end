import axios from '../axios'

export interface GoldPrice {
  buyPrice: number
  sellPrice: number
  source: string
  _id: string
  createdAt: string
  updatedAt: string
}

export interface GoldPriceListResponse {
  data: GoldPrice[]
  filter: {
    days: number
    startDate: string
    endDate: string
  }
  count: number
}

export interface GoldResponse {
  price: GoldPrice
  totalGold: number
  totalInvested: number
  currentValue: number
  profit: number
}

export interface InvestmentsResponseData {
  _id: string
  date: string
  amountVND: number
  buyPrice: number
  goldGram: number
  createdAt: string
  updatedAt: string
}

export interface InvestmentsResponse {
  total: number
  data: InvestmentsResponseData[]
}

export type TimeRange = 7 | 30 | 60 | 365

export const goldApi = {
  getDataGold: async (): Promise<GoldResponse> => {
    const response = await axios.get<GoldResponse>('/gold/refresh')
    return response.data
  },

  getDataGoldPriceList: async (days: TimeRange = 30): Promise<GoldPrice[]> => {
    const response = await axios.get<GoldPriceListResponse>('/gold/list/price', {
      params: { days },
    })
    return response.data.data
  },

  getDataInvesments: async (): Promise<InvestmentsResponseData[]> => {
    const response = await axios.get<InvestmentsResponse>('/investments/list')
    return response.data.data
  },
}
