const API_URL = 'http://localhost:38080/api';

export const api = {
    // define base url and headers
    baseUrl: API_URL,

    // register user
    register: async (user) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    // login user
    login: async (user) => {
        const response = await fetch(`${API_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    // create blog
    createBlog: async (blog) => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(blog),
        });
        return response.json();
    },
    
    // get all blogs
    getBlogs: async () => {
        const response = await fetch(`${API_URL}/blogs`);
        return response.json();
    },

    // get blog by id
    getBlogById: async (id) => {
        const response = await fetch(`${API_URL}/blogs/${id}`);
        return response.json();
    },

    // get user blogs
    getUserBlogs: async () => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_URL}/user/blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    // update blog
    updateBlog: async (id, blog) => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_URL}/blogs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(blog),
        });
        return response.json();
    },

    // delete blog
    deleteBlog: async (id) => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_URL}/blogs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        return response.json();
    },

    // get user profile
    getUserProfile: async () => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    // update user profile
    updateUserProfile: async (userData) => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },
};

