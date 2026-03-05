import axios from '../axios'

export interface GenerateSocialPostData {
  topic: string
}

export interface GenerateSocialPostResponse {
  caption: string
  image: string
}

export const socialApi = {
  generatePost: async (data: GenerateSocialPostData): Promise<GenerateSocialPostResponse> => {
    const response = await axios.post<GenerateSocialPostResponse>('/social/generate', data)
    return response.data
  },
}
