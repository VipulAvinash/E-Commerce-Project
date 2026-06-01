import axios from 'axios'
const api = axios.create({
  baseURL: 'https://e-commerce-project-x82b.onrender.com/api'
})

export default api