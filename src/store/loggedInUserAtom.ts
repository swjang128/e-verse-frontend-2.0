import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { LoggedInUser } from '../types/user';

// sessionStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: loggedInUserPersist } = recoilPersist({
  key: 'loggedInUserPersist', // Key to identify the storage
  storage: sessionStorage, // Use sessionStorage for persistence
});

export const loggedInUserState = atom<LoggedInUser | null>({
  key: 'loggedInUserState', // unique ID (with respect to other atoms/selectors)
  default: null, // initial value (aka initial state)
  effects_UNSTABLE: [loggedInUserPersist], // Apply persistence
});
