import { E_ROLE_TYPES } from '../enum';

export type UserData = {
  // map(arg0: (member: any) => any): UserData;
  memberId: number;
  name: string;
  noMaskingName?: string;
  email: string;
  password: string;
  role: E_ROLE_TYPES;
  phone: string;
  companyId: number;
  companyName: string;
  companyType: string;
  accessibleMenuIds: number[];
};

export type LoggedInUser = {
  memberId: number;
  name: string;
  email: string;
  role: E_ROLE_TYPES;
  phone: string;
  companyId: number;
  companyName: string;
  companyType: string;
  accessibleMenuIds: number[];
};
