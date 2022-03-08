import axios, {AxiosResponse} from 'axios';
import Moment from 'moment';
import stores from '../../stores';
import RequestHandler from '../../stores/RequestHandler';
import {isObject, isEmpty} from 'lodash';
import {baseURL} from '../Sever/Sever';
/**
 * 서버 응답에 따른 처리
 * code
 * -1   : 에러. 쿼리 실패.
 * 0    : 데이터 없음 or update, delete작업 대상 없음.
 * 1 ~  : 성공. 쿼리 적용 대상 갯수.
 * @param response axios 응답 데이터
 * @returns 응답 코드
 */
export const handleResponse = (response: any): number => {
  let responseCode = 0;
  if (typeof response.data === 'number') {
    responseCode = response.data;
  } else {
    responseCode = response.data.length;
  }
  if (responseCode < 0)
    stores.RFIDStore.SendToastMessage('작업에 실패하였습니다. ');
  return responseCode;
};

export const validateForm = <T extends object>(
  formDef: any,
  row: T,
): boolean => {
  for (let i = 0; i < formDef.length; i++) {
    let div = formDef[i];
    for (let j = 0; j < div.child.length; j++) {
      let el = div.child[j];
      if (!el.must) continue;
      const value = row[el.field as keyof T];
      if (
        !value ||
        isNullOrWhitespace(String(value)) ||
        (isJson(value) && isEmpty(value))
      ) {
        if (el.tag == 'DropDown')
          stores.RFIDStore.SendToastMessage(
            `${el.name}${getJosa(el.name, '을')} 선택해 주세요.`,
          );
        else if (el.tag == 'CheckList')
          stores.RFIDStore.SendToastMessage(
            `${el.name}${getJosa(el.name, '을')} 선택해 주세요.`,
          );
        else
          stores.RFIDStore.SendToastMessage(
            `${el.name}${getJosa(el.name, '을')} 입력해 주세요.`,
          );
        return false;
      }
    }
  }

  return true;
};

export const isJson = (value: any) => {
  return value && value.constructor && value.constructor.name === 'Object';
};

export const getJosa = (t: string, j: string) => {
  let code = t.charCodeAt(t.length - 1) - 44032;

  if (!t || t.length == 0) return '';

  if (code < 0 || code > 11171) return j;

  let f = (josa: string, jong: boolean) => {
    if (josa == '을' || josa == '를') return jong ? '을' : '를';
    if (josa == '이' || josa == '가') return jong ? '이' : '가';
    if (josa == '은' || josa == '는') return jong ? '은' : '는';
    if (josa == '와' || josa == '과') return jong ? '와' : '과';
    return josa;
  };

  if (code % 28 == 0) return f(j, false);
  else return f(j, true);
};

export const isNullOrWhitespace = (txt: string) => {
  if (typeof txt === 'undefined' || txt == null) return true;

  return txt.replace(/\s/g, '').length < 1;
};

export const safeToString: (value: any) => string = value => {
  if (typeof value === 'string') return value as string;

  return '';
};

export interface mapEntity {
  value: string;
  label: string;
  label2?: string;
  parent: string;
  useYn: string;
}

const mapUrl = '/map/get/';

export const getMap: (
  mapCode: string,
  category?: string,
) => Promise<AxiosResponse<mapEntity[]>> = (mapCode, category?) => {
  //console.log('url확인 :', `${baseURL}${mapUrl}${mapCode}/${category}`);
  return RequestHandler<AxiosResponse<mapEntity[]>>(
    'get',
    `${baseURL}${mapUrl}${mapCode}/${category}`,
    {},
  );
};

/**
 * Date타입을 String타입으로 변환
 * @param date
 * @param format String으로 변환할 날짜 포멧
 * @returns
 */
export const dateToString = (
  date: Date | undefined,
  format: string,
): string | undefined => {
  if (date === undefined || date === null) return undefined;
  return Moment(date).format(format);
};

/**
 * String타입을 Data타입으로 변환
 * @param dateText
 * @param format dateText의 날짜 포멧
 * @returns
 */
export const stringToDate = (
  dateText: string | undefined,
  format: string,
): Date | undefined => {
  if (dateText === undefined || dateText === null) return undefined;
  return Moment(dateText, format).toDate();
};

export const numberToCommaUnit = (value?: number): string | undefined => {
  if (value === undefined || value === null) return undefined;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
