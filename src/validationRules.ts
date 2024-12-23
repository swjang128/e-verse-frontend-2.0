export const validationRules = {
  email: {
    required: { value: true, message: 'Email is required' },
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Invalid email address',
    },
  },
  currentPassword: {
    // 비밀번호 수정에 쓰이는 password로서 초기화 한 후 수행해야 할 수도 있으므로 pattern체크는 제외한다.
    required: { value: true, message: 'Enter your current password' },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('confirmPassword');
      };
    },
  },
  password: {
    required: { value: true, message: 'Enter your password' },
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/,
      message:
        'Enter within 8 to 16 digits including numbers, letters, and special characters',
    },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('confirmPassword');
      };
    },
  },
  confirmPassword: {
    required: { value: true, message: 'Enter your password one more time' },
    validate: (value: string, getValues: (password: any) => any) =>
      value === getValues('password') || "Password doesn't match",
  },
  newPassword: {
    required: { value: true, message: 'Enter your new password' },
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/,
      message:
        'Enter within 8 to 16 digits including numbers, letters, and special characters',
    },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('confirmNewPassword');
      };
    },
  },
  confirmNewPassword: {
    required: { value: true, message: 'Enter your new password one more time' },
    validate: (value: string, getValues: (password: any) => any) =>
      value === getValues('newPassword') || "New password doesn't match",
  },
  phone: {
    Korea: {
      required: 'Phone number is required',
      pattern: {
        value: /^010[0-9]{7,8}$/,
        message: 'Please enter 10 to 11 digits starting with 010 (no dashes)',
      },
    },
    USA: {
      required: 'Phone number is required',
      pattern: {
        value: /^[2-9][0-9]{2}[0-9]{7}$/,
        message: 'Please enter 10 digits starting from 2 to 9 (no dashes)',
      },
    },
    Thailand: {
      required: 'Phone number is required',
      pattern: {
        value: /^0[89][0-9]{8}$/,
        message: 'Please enter 10 digits starting with 08X or 09X (no dashes)',
      },
    },
    Vietnam: {
      required: 'Phone number is required',
      pattern: {
        value: /^0[89][0-9]{8}$/,
        message: 'Please enter 10 digits starting with 08X or 09X (no dashes)',
      },
    },
  },
  adminPhone: {
    required: { value: true, message: 'Phone number is required' },
    pattern: {
      value: /^\d{8,11}$/,
      message: 'Enter 8~11 digits including numbers',
    },
  },
  name: {
    required: { value: true, message: 'Enter your name' },
  },
  authCode: {
    required: { value: true, message: 'Enter your Authentication Code' },
    pattern: {
      value: /^\d{6}$/,
      message: 'Enter 6 digits including numbers',
    },
  },
  companyId: {
    required: { value: true, message: 'Selecting a Company is required' },
  },
  role: {
    required: { value: true, message: 'Selecting a Role is required' },
  },
  companyType: {
    required: {
      value: true,
      message: `Selecting a Company's Type is required`,
    },
  },
  countryId: {
    required: {
      value: true,
      message: `Selecting a Company's Country is required`,
    },
  },
  address: {
    required: { value: true, message: `Company's Address is required` },
  },
  tel: {
    required: { value: true, message: `Company's Tel number is required` },
    pattern: {
      value: /^\d{8,11}$/,
      message: 'Enter 8~11 digits including numbers',
    },
  },
  fax: {
    required: { value: true, message: `Company's Fax number is required` },
    pattern: {
      value: /^\d{8,11}$/,
      message: 'Enter 8~11 digits including numbers',
    },
  },
};
