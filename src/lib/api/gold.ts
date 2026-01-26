import axios from '../axios'

export interface GoldResponse {
  price: {
    buyPrice: number
    sellPrice: number
    source: string
    _id: string
    createdAt: string
    updatedAt: string
  }
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

export const goldApi = {
  getDataGold: async (): Promise<GoldResponse> => {
    const response = await axios.get<GoldResponse>('/gold/refresh')
    return response.data
  },
  getDataInvesments: async (): Promise<InvestmentsResponseData[]> => {
    const response = await axios.get<InvestmentsResponse>('/investments/list')
    return response.data.data
  },
}
