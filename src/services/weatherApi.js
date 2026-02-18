import axios from 'axios';

const API_KEY = '9389cc9f5f2c15b1801bdac1ac9c838c';
const BASE_URL = 'http://api.weatherstack.com';

export const weatherApi = {
    getCurrent: async (city) => {
        try {
            const response = await axios.get(`${BASE_URL}/current`, {
                params: {
                    access_key: API_KEY,
                    query: city,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw error;
        }
    },

    getHistorical: async (city, date) => {
        try {
            const response = await axios.get(`${BASE_URL}/historical`, {
                params: {
                    access_key: API_KEY,
                    query: city,
                    historical_date: date,
                    hourly: 1,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching historical weather:', error);
            throw error;
        }
    },

    // Note: Marine data usually requires a paid plan on Weatherstack.
    // We will implement the fetcher, but it might error on free tier.
    getMarine: async (coords) => {
        try {
            // Marine endpoint often uses lat,lon
            const response = await axios.get(`${BASE_URL}/marine`, {
                params: {
                    access_key: API_KEY,
                    query: coords, // "lat,lon"
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching marine weather:', error);
            throw error;
        }
    }
};
