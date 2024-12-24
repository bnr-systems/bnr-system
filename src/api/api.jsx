import axios from 'axios';


const api = axios.create({
  baseURL: "https://vps55372.publiccloud.com.br/api",
});

export default api;
