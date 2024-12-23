import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdatePassword from '../pages/Profile/UpdatePassword';
import { LoggedInUser } from '../types/user';
import { E_ROLE_TYPES } from '../enum';

// Mock 데이터
const mockUser: LoggedInUser = {
  memberId: 4,
  companyId: 1,
  companyName: 'ATEMoS',
  companyType: 'FEMS',
  role: E_ROLE_TYPES.ADMIN,
  name: 'ATEMoS22',
  email: 'atemos@atemos.co.kr',
  phone: '01012349876',
  accessibleMenuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
};

// Modal 컴포넌트의 Mock 구현
const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div role="dialog">
      <button onClick={onClose}>Close Modal</button>
      {children}
    </div>
  );
};

describe('UpdatePassword 구성 요소 테스트', () => {
  test('모달을 렌더링하고 닫아야 합니다', () => {
    const isModalOpen = true;
    const handleClose = jest.fn();

    render(
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <UpdatePassword
          info={mockUser}
          onSave={() => {}}
          onClose={handleClose}
        />
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Update Password')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Modal'));
    expect(handleClose).toHaveBeenCalled();
  });

  test('양식 필드에 사용자 정보를 표시해야 합니다.', () => {
    const isModalOpen = true;

    render(
      <Modal isOpen={isModalOpen} onClose={() => {}}>
        <UpdatePassword info={mockUser} onSave={() => {}} onClose={() => {}} />
      </Modal>,
    );

    expect(
      screen.getByPlaceholderText('Enter your current password'),
    ).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter your new password')).toHaveValue(
      '',
    );
    expect(
      screen.getByPlaceholderText('Enter your new password one more time'),
    ).toHaveValue('');
  });

  test('입력 변경 사항을 처리하고 올바르게 저장해야 합니다.', async () => {
    const isModalOpen = true;
    const handleSave = jest.fn();

    render(
      <Modal isOpen={isModalOpen} onClose={() => {}}>
        <UpdatePassword
          info={mockUser}
          onSave={handleSave}
          onClose={() => {}}
        />
      </Modal>,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Enter your current password'),
      {
        target: { value: 'Atemos1234!' },
      },
    );

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith({
        password: 'Atemos1234!',
        newPassword: '',
        confirmNewPassword: '',
      });
    });
  });

  test('양식 필드의 유효성을 검사해야 합니다.', async () => {
    const isModalOpen = true;
    const handleSave = jest.fn();
    const handleClose = jest.fn();

    render(
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <UpdatePassword
          info={mockUser}
          onSave={handleSave}
          onClose={handleClose}
        />
      </Modal>,
    );

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(
        screen.getByText('Enter your current password'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Enter within 8 to 16 digits including numbers, letters, and special characters',
        ),
      ).toBeInTheDocument();
    });
  });

  test('프로필을 저장할 때 올바른 데이터로 API 호출을 해야 합니다.', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      }),
    ) as jest.Mock;

    const isModalOpen = true;
    const handleClose = jest.fn();

    const handleSave = async (data: any) => {
      try {
        await fetch('http://127.0.0.1:8080/atemos/auth/update-password', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Error while updating info:', error);
      }
    };

    render(
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <UpdatePassword
          info={mockUser}
          onSave={handleSave}
          onClose={handleClose}
        />
      </Modal>,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Enter your current password'),
      {
        target: { value: 'Atemos1234!' },
      },
    );
    fireEvent.change(screen.getByPlaceholderText('Enter your new password'), {
      target: { value: 'Atemos1234!@' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Enter your new password one more time'),
      {
        target: { value: 'Atemos1234!@' },
      },
    );

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8080/atemos/auth/update-password',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          body: JSON.stringify({
            email: mockUser.email,
            password: 'Atemos1234!',
            newPassword: 'Atemos1234!@',
          }),
        },
      );
    });

    expect(handleClose).toHaveBeenCalled();
  });
});
