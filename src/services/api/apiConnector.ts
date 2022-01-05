import axios from 'axios';
import Cookies from 'js-cookie';

const urls = {
  production: `https://api.litaniasports.com/inferno/v1`,
  development: `http://127.0.0.1:8082/inferno/v1`,
  test: ``,
};

const initAPIConnection = ({ headers = {} }) => {
  const authToken = Cookies.get('lsgweb_token');

  if (!authToken) {
    console.log('Error creating API client: No auth token found');
    return null;
  } else {
    console.log('Creating API client with auth token: ', authToken);
  }

  return axios.create({
    baseURL: `${urls[process.env.NODE_ENV]}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      ...headers,
    },
    withCredentials: true,
  });
};

export default initAPIConnection;
