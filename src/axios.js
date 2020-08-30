import axios from "axios";

import {API_DOMAIN} from './constant'

const callapi = axios.create({
    baseURL: API_DOMAIN,
    headers: {
      // 'Authorization': 'Bearer my-token',
    }
});


export default callapi