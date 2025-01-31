import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

const registerUser = async (userData) => {
    try{
      const response = await api.post('/auth/register', userData);
       return response.data
    } catch(error){
        throw new Error(error.response?.data?.message || 'Error registering user');
    }
}

const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error logging in');
  }
};

const fetchUserProfile = async (token) => {
  try {
    const response = await api.get('/auth/profile',{
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching user profile');
  }
};

const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching books');
    }
  };

const fetchBookById = async (bookId) => {
    try {
      const response = await api.get('/books/'+bookId);
      return response.data;
    } catch (error) {
          throw new Error(error.response?.data?.message || 'Error fetching book details');
    }
  };

const fetchReviewsByBookId = async (bookId) => {
    try {
    const response = await api.get('/books/'+bookId+'/reviews');
    return response.data;
  } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching reviews');
  }
};
const createReview = async (bookId, reviewData, token) => {
   try {
        const response = await api.post('/books/'+bookId+'/reviews', reviewData, {
         headers: {
                Authorization: 'Bearer ' + token,
         },
       });
      return response.data.review;
    } catch (error) {
       throw new Error(error.response?.data?.message || 'Error creating review');
    }
  };
export { loginUser, registerUser, fetchBooks, fetchBookById, fetchReviewsByBookId, createReview, fetchUserProfile };
