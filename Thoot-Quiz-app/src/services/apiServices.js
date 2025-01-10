import axios from 'axios';

class ApiService {
    static async getSessionToken() {
        try {
            const response = await axios.get('https://opentdb.com/api_token.php?command=request');
            return response.data.token;
        } catch (error) {
            throw new Error('Failed to get session token');
        }
    }
    static async getCategories() {
        try {
            const response = await axios.get('https://opentdb.com/api_category.php');
            return response.data.trivia_categories;
        } catch (error) {
            throw new Error('Failed to fetch categories');
        }
    }

    static async getQuestions(amount = 10, category = '', difficulty = '', type = '') {
        try {
            const token = await this.getSessionToken();
            let url = `https://opentdb.com/api.php?amount=${amount}&token=${token}`;
            
            if (category) url += `&category=${category}`;
            if (difficulty) url += `&difficulty=${difficulty}`;
            if (type) url += `&type=${type}`;
            
            const response = await axios.get(url);
            
            if (response.data.response_code === 0) {
                return response.data.results;
            } else {
                throw new Error('Failed to fetch questions');
            }
        } catch (error) {
            throw new Error('Failed to fetch questions');
        }
    }

    static async resetToken(token) {
        try {
            const response = await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
            return response.data.token;
        } catch (error) {
            throw new Error('Failed to reset token');
        }
    }
}

export default ApiService;