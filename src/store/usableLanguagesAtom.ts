import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export type UsableLanguagesType = {
  [key: string]: {
    countryId: string;
    name: string;
    timeZone: string;
  };
};

// localStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: usableLanguagesPersist } = recoilPersist({
  key: 'usableLanguagesPersist', // Key to identify the storage
  storage: localStorage, // Use localStorage for persistence
});

export const usableLanguagesState = atom<UsableLanguagesType>({
  key: 'usableLanguagesState', // unique ID (with respect to other atoms/selectors)
  default: {}, // initial value (aka initial state)
  effects_UNSTABLE: [usableLanguagesPersist], // Apply persistence
});
