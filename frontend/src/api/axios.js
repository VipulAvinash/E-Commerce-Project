import axios from 'axios'
const api = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5001/api' 
    : 'https://e-commerce-project-x82b.onrender.com/api'
})

export default api