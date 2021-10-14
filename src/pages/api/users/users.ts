import api from 'services/api/apiConnector';

export const login = async (props: { email: string; password: string }) => {
  const { email, password } = props;
  try {
    const { data, headers: returnedHeaders } = await api.post(
      'http://localhost:8082/inferno/v1/users/login', // Node.js backend path
      { Username: email, Password: password }, // Login body (email + password)
      { withCredentials: true }, // Headers from the Next.js Client
    );
    //  Update headers on requester using headers from Node.js server response

    return data; // Send data from Node.js server response
  } catch (response) {
    // Send status (probably 401) so the axios interceptor can run.
    console.log(response);
  }
};
