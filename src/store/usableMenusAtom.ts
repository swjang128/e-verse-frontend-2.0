import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export type UsableMenusType = {
  menuId: string;
  name: string;
  url: string;
  parentId: string | null;
}[];

// sessionStorage에 상태를 저장하기 위한 Recoil Persist 설정
const { persistAtom: usableMenusPersist } = recoilPersist({
  key: 'usableMenusPersist', // Key to identify the storage
  storage: sessionStorage, // Use sessionStorage for persistence
});

export const usableMenusState = atom<UsableMenusType>({
  key: 'usableMenusState', // unique ID (with respect to other atoms/selectors)
  default: [], // initial value (aka initial state)
  effects_UNSTABLE: [usableMenusPersist], // Apply persistence
});
