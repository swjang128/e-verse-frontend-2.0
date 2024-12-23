import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// sessionStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: translatePersist } = recoilPersist({
  key: 'translatePersist', // Key to identify the storage
  storage: sessionStorage, // Use sessionStorage for persistence
});

export const translateState = atom<string | null>({
  key: 'translateState', // unique ID (with respect to other atoms/selectors)
  default: null, // initial value (aka initial state)
  effects_UNSTABLE: [translatePersist], // Apply persistence
});
