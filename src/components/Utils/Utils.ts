import axios, {Axios, AxiosResponse} from 'axios';
import Moment from 'moment';
import RequestHandler from '../../stores/RequestHandler';
//import {ImageFileData} from './data/ImageData';
import {isObject, isEmpty} from 'lodash';
import {baseURL} from '../Sever/Sever';
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
  seq?: string;
  value: string;
  label: string;
  jego?: number;
  parent: string;
  useYn: string;
  repairCauseRemark?: string;
}

export const emptyMap = {
  value: '',
  label: '',
  parent: '',
  useYn: 'Y',
  jego: '',
};

const mapUrl = `${baseURL}/map/get/`;

export const getMap: (
  mapCode: string,
  category?: string,
) => Promise<AxiosResponse<mapEntity[]>> = (mapCode, category?) => {
  if (!category) category = '';
  return RequestHandler<AxiosResponse<mapEntity[]>>(
    'get',
    `${mapUrl}${mapCode}/${category}`,
    {},
  );
};
export const getMap2: (
  mapCode: string,
  category?: string,
  subCategory?: string,
) => Promise<AxiosResponse<mapEntity[]>> = (
  mapCode,
  category?,
  subCategory?,
) => {
  return RequestHandler<AxiosResponse<mapEntity[]>>(
    'get',
    `${mapUrl}${mapCode}/${category}/${subCategory}`,
    {},
  );
};
export interface imageEntity {
  fileGubun: string;
}

//1226 seo
export const getImage: (
  repairCause: string,
  seq: string,
) => Promise<AxiosResponse<imageEntity[]>> = (repairCause, seq) => {
  return RequestHandler<AxiosResponse<imageEntity[]>>(
    'get',
    `/api/moldrepairrequest/editImage`,
    {repairCause: repairCause, seq: seq},
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

const imageUrl = '/api/image/get/';

export const dateCal = (date: string | undefined | Date) => {
  if (date === undefined)
    return dateToString(new Date() as any as Date, 'YYYYMMDD');
  if (typeof date === 'string')
    return dateToString(new Date() as any as Date, 'YYYYMMDD');
  return dateToString(date as any as Date, 'YYYYMMDD');
};

export const timeCal = (stDt: Date, edDt: Date) => {
  const time1 = stDt as any;
  const time2 = edDt as any;
  const cal = time2 - time1;
  const tt = Math.floor((cal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mm = Math.floor((cal % (1000 * 60 * 60)) / (1000 * 60));
  const repairTime = `${tt}시간${mm}분`;
  return repairTime;
};

/**
 * 드랍다운 컴포넌트의 복수 선택 값을 문자열(a,b,c...)로 변경
 */
export const dropDownValueToString = (item: any) => {
  let tempArr: any = [];
  item.map((v: any) => {
    tempArr.push(v.value);
  });
  return tempArr.join();
};

export const tableDateFormatter = (params: any) => {
  return dateToString(params.value, 'YYYY년 MM월 DD일');
};

export const transUrlToMenuId = (url: string) => {
  const splitArr = url.split('/');
  const menuId: string = `${splitArr[1]}.${splitArr[2]}`;

  return menuId;
};

export const commaFormat = (value: number): string => {
  var regexp = /\B(?=(\d{3})+(?!\d))/g;
  if (value === null) return '';
  return value.toString().replace(regexp, ',');
};

export const weekCal = () => {
  let value = [];
  let formatDate = function (date: any) {
    let myMonth = date.getMonth() + 1;
    let myWeekDay = date.getDate();

    let addZero = function (num: any) {
      if (num < 10) {
        num = '0' + num;
      }
      return num;
    };
    let md = addZero(myMonth) + addZero(myWeekDay);

    return md;
  };

  const now = new Date();
  let nowDayOfWeek = now.getDay();
  let nowDay = now.getDate();
  let nowMonth = now.getMonth();
  let nowYear = now.getFullYear();
  nowYear += nowYear < 2000 ? 1900 : 0;
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
  value.push(nowYear + formatDate(weekStartDate));
  value.push(nowYear + formatDate(weekEndDate));

  return value;
};

export const koreanTimeZone = (defaultTime: Date) => {
  const tDate = new Date(defaultTime);
  tDate.setHours(tDate.getHours() + 9);
  return tDate;
};
