import {getPayload} from 'payload';
import config from '@payload-config';

// 사이트 페이지는 HTTP(REST)가 아니라 로컬 API 로 DB 를 직접 읽는다.
// 서버가 없는 정적 빌드에서도 빌드 시점에 그대로 돌아간다.
export const getCms = () => getPayload({config});
