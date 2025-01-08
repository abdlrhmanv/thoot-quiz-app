import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const TRIVIA_API_URL = process.env.REACT_APP_OPEN_TRIVIA_API || 'https://opentdb.com/api.php';

const apiService = {
    
    register: (userData) => axios.post(`${BASE_URL}/auth/register`, userData),
    login: (credentials) => axios.post(`${BASE_URL}/auth/login`, credentials),
    
    getUserProfile: () => axios.get(`${BASE_URL}/users/profile`),
    updateUserProfile: (userData) => axios.put(`${BASE_URL}/users/profile`, userData),
    
    getQuizzes: () => axios.get(`${BASE_URL}/quizzes`),
    getQuizById: (quizId) => axios.get(`${BASE_URL}/quizzes/${quizId}`),
    createQuiz: (quizData) => axios.post(`${BASE_URL}/quizzes`, quizData),
    updateQuiz: (quizId, quizData) => axios.put(`${BASE_URL}/quizzes/${quizId}`, quizData),
    deleteQuiz: (quizId) => axios.delete(`${BASE_URL}/quizzes/${quizId}`),
    
    getTriviaCategoriesQuiz: () => axios.get('https://opentdb.com/api_category.php'),
    getTriviaQuestions: (params) => axios.get(`${TRIVIA_API_URL}`, { params }),
    
    saveScore: (scoreData) => axios.post(`${BASE_URL}/scores`, scoreData),
    getLeaderboard: () => axios.get(`${BASE_URL}/scores/leaderboard`)
};

export default apiService;
