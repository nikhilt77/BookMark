import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Update to correct port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Add this for CORS credentials
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    throw error;
  },
);

const registerUser = async (userData) => {
  try {
    console.log("Attempting to register user:", userData);
    const response = await api.post("/auth/register", userData);
    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error registering user");
  }
};

const loginUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error logging in");
  }
};

const fetchUserProfile = async (token) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      console.error("Profile fetch error:", error.response?.data || error),
      error.response?.data?.message || "Error fetching user profile",
    );
  }
};

const fetchBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await api.get("/books");

    // Map through the books and use the correct path for images
    const booksWithImages = response.data.map((book) => ({
      ...book,
      coverImage: book.coverImage
        ? `/images/${book.coverImage}` // Update path to match your public folder structure
        : "public/images/to_kill.jpg",
    }));

    return booksWithImages;
  } catch (error) {
    if (error.message === "No token found") {
      throw new Error("Please login to view books");
    }
    throw new Error(error.response?.data?.message || "Error fetching books");
  }
};

const fetchBookById = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching book details",
    );
  }
};

const fetchReviewsByBookId = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    // Add authorization header
    const response = await api.get(`/books/${bookId}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response.data exists and has reviews
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.reviews)) {
      return response.data.reviews;
    } else {
      return []; // Return empty array if no reviews
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    if (error.response?.status === 404) {
      return []; // Return empty array if no reviews found
    }
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error fetching reviews",
    );
  }
};

const createReview = async (bookId, reviewData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.post(`/books/${bookId}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response has the expected structure
    if (response.data && response.data.review) {
      return response.data.review;
    } else if (response.data) {
      return response.data;
    }

    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Error creating review",
    );
  }
};

// Optional: Add a function to delete a review
const deleteReview = async (bookId, reviewId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    await api.delete(`/books/${bookId}/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Error deleting review",
    );
  }
};

// Optional: Add a function to update a review
const updateReview = async (bookId, reviewId, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.put(
      `/books/${bookId}/reviews/${reviewId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data && response.data.review) {
      return response.data.review;
    }
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Error updating review",
    );
  }
};

// Add a function to set token in headers
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export {
  loginUser,
  registerUser,
  fetchBooks,
  fetchBookById,
  fetchReviewsByBookId,
  createReview,
  deleteReview,
  updateReview,
  fetchUserProfile,
  setAuthToken,
};
