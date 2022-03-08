import axios from 'axios';

export type HttpMethod = 'get' | 'put' | 'post' | 'delete';

export type urlMethod = {
  [key: string]: {method: string; url: string};
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

const RequestHandler: <T>(
  method: HttpMethod,
  url: string,
  params: {} | [],
) => Promise<T> = (method, url, params) => {
  switch (method) {
    case 'get':
      return axios.get(url, {params});
    case 'put':
      return axios.put(url, params);
    case 'post':
      return axios.post(url, params);
    case 'delete':
      return axios.post(url, params);
  }
};
export default RequestHandler;
