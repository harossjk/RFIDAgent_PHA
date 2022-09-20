
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export type HttpMethod = 'get' | 'put' | 'post' | 'delete';

export type urlMethod = {
  [key: string]: { method: string; url: string };
};

export type eventMethod = {
  [key: string]: HttpMethod;
};

export const httpMethods: eventMethod = {
  select: 'get',
  add: 'put',
  edit: 'post',
  delete: 'delete',
  export: 'get',
  etc1: 'post',
  etc2: 'post',
  etc3: 'post',
  etc4: 'post',
  etc5: 'post',
};

const RequestHandler: <T>(method: HttpMethod, url: string, params: {} | []) => Promise<T> = async (method, url, params) => {

  const isNullToken = await AsyncStorage.getItem("auth-token") === null ? "" : { 'Authorization': `Bearer ${(await AsyncStorage.getItem("auth-token")).toString()}` };
  const headers: any = isNullToken;

  switch (method) {
    case "get":
      return axios.get(url, { params, headers: headers });
    case "put":
      return axios.put(url, params, { headers: headers });
    case "post":
      return axios.post(url, params, { headers: headers });
    case "delete":
      return axios.post(url, params, { headers: headers });
  }
}
export default RequestHandler;
