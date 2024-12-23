import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export type UsableCompaniesType = {
  companyId: string;
  name: string;
  languageCode: string;
}[];

// localStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: usableCompaniesPersist } = recoilPersist({
  key: 'usableCompaniesPersist', // Key to identify the storage
  storage: localStorage, // Use localStorage for persistence
});

export const usableCompaniesState = atom<UsableCompaniesType>({
  key: 'usableCompaniesState', // unique ID (with respect to other atoms/selectors)
  default: [], // initial value (aka initial state)
  effects_UNSTABLE: [usableCompaniesPersist], // Apply persistence
});
