import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// persist 미 사용

export const onRenewingState = atom<boolean>({
  key: 'onRenewingState', // unique ID (with respect to other atoms/selectors)
  default: false, // initial value (aka initial state)
});
