import axios from 'axios';

const API_URL = 'http://92.118.159.12:3001';

export const getAllVectorLayers = async () => {
  try {
    const response = await axios.get(`${API_URL}/getVectorLayerRegion`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all vector layers:', error);
    throw error;
  }
};
