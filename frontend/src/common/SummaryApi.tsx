export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    url: "/api/utilisateur/register",
    method: 'post',
  },
  login: {
    url: '/api/utilisateur/login',
    method: 'post'
  },
  verifieEmail: {
    url: '/api/utilisateur/verifie-email',
    method: 'post'
  }
};

export default SummaryApi;
