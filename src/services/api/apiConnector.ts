import axios from 'axios';

const urls = {
  production: ``,
  development: `http://localhost:8082/inferno/v1`,
  test: ``,
};

const api = axios.create({
  baseURL: `${urls[process.env.NODE_ENV]}`,
});

export default api;
