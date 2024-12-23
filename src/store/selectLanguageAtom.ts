import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// sessionStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: selectLanguagePersist } = recoilPersist({
  key: 'selectLanguagePersist', // Key to identify the storage
  storage: localStorage, // Use localStorage for persistence
});

export const selectLanguageState = atom<string>({
  key: 'selectLanguageState', // unique ID (with respect to other atoms/selectors)
  default: 'en-US', // initial value (aka initial state)
  effects_UNSTABLE: [selectLanguagePersist], // Apply persistence
});
