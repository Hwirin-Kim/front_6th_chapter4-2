import axios, { AxiosResponse } from "axios";

type CacheEntry = {
  promise: Promise<AxiosResponse<unknown>>;
  time: number;
};

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; //5분

export const fetchWithCache = async <T>(
  url: string,
  options?: { force?: boolean }
): Promise<AxiosResponse<T>> => {
  const now = Date.now();
  const cached = cache.get(url);

  // force 요청이 아니고, 캐시가 존재하며 TTL 이내라면 캐시 반환
  if (!options?.force && cached && now - cached.time < TTL) {
    console.log("캐시 히트 : ", url);
    return cached.promise as Promise<AxiosResponse<T>>;
  }

  // 그 외 새 요청 실행
  console.log("API 호출 : ", url);
  const request = axios.get<T>(url);

  // 새 요청 캐시 저장
  cache.set(url, { promise: request, time: now });

  // 새 요청 반환
  return request;
};
