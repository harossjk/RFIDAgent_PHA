export const urls = {
  list: { method: 'get', url: '/api/mold' },
  add: { method: 'put', url: '/api/mold' },
  edit: { method: 'post', url: '/api/mold' },
  delete: { method: 'post', url: '/api/mold/delete' },
  select: { method: 'get', url: '/api/mold/select' },
  selectOne: { method: 'get', url: '/api/mold/selectone' },
};
export interface MoldInEntity {
  corpCode: string;
  moldName: string;
  //factoryCode: string;
  //rfid: string;
  //inSeq: string;
  inCorpCode?: string;
  inFactoryCode?: string;
  inPosition: string;
  inDt: string;
  inUser: string;
  inGubun: string;
  remark?: string;
  poutCorpCode?: string;
  poutFactoryCode?: string;
  poutDt?: string;
  poutSeq?: string;
  outCorpCode?: string;
  outFactoryCode?: string;
  outDt?: string;
  outSeq?: string;
  pdaYN?: string;
  createUser?: string;
  createDt?: string;
  updateUser?: string;
  updateDt?: string;

}
