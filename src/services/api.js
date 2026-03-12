import axios from "axios";

const api = axios.create({
  baseURL: "https://estoquebackend-po9n.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;