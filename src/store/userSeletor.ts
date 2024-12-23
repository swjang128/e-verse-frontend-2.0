import { selector } from 'recoil';
import { loggedInUserState } from './loggedInUserAtom';

export const userNameSelector = selector<string>({
  key: 'userNameSelector',
  get: ({ get }) => {
    const user = get(loggedInUserState);
    return user?.name || 'Guest';
  },
});
