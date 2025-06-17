import axios from "axios";
import { baseURL } from '../common/SummaryApi';

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default Axios;
