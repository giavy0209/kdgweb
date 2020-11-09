import axios from "axios";

import {API_DOMAIN} from './constant'
import { storage } from "./helpers";


const callapi = ()=>{
  const JWT = storage.getJWT()
  return axios.create({
    baseURL: API_DOMAIN,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT}`,
    }
  });
}

export default callapi