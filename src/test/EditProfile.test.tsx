import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfile from '../pages/Profile/EditProfile';
import { LoggedInUser } from '../types/user';
import { E_ROLE_TYPES } from '../enum';

/* EditProfile 테스트할 주요 기능
 모달이 열리고 닫히는지 검증
 폼 필드의 값이 올바르게 표시되는지 검증
 폼 필드 값의 변경이 올바르게 처리되는지 검증
 폼 검증 로직이 제대로 작동하는지 검증
 올바른 값이 제출되었는지 검증

 EditProfile 테스트 코드 작성
 테스트 코드에서는 다음 단계들을 포함할 것입니다:
 모달이 열리고 닫히는지 확인
 기본 사용자 정보가 폼 필드에 표시되는지 확인
 입력 값을 변경하고 onSave 함수가 호출되는지 확인
 폼 검증이 올바르게 작동하는지 확인 
 API 호출이 정상적인지 확인 */

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

describe('Modal을 사용한 EditProfile', () => {
  test('EditProfile을 사용하여 모달을 렌더링하고 닫기를 처리해야 합니다.', () => {
    // 모달을 열림 상태로 설정
    const isModalOpen = true;
    const handleClose = jest.fn();

    // 컴포넌트 렌더링
    render(
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <EditProfile info={mockUser} onSave={() => {}} onClose={handleClose} />
      </Modal>,
    );

    // 모달이 화면에 표시되는지 확인
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Profile Edit')).toBeInTheDocument();

    // 닫기 버튼 클릭 시 onClose 콜백이 호출되는지 확인
    fireEvent.click(screen.getByText('Close Modal'));
    expect(handleClose).toHaveBeenCalled();
  });

  test('양식 필드에 사용자 정보를 표시해야 합니다.', () => {
    const isModalOpen = true;

    render(
      <Modal isOpen={isModalOpen} onClose={() => {}}>
        <EditProfile info={mockUser} onSave={() => {}} onClose={() => {}} />
      </Modal>,
    );

    // 폼 필드에 사용자 정보가 올바르게 표시되는지 확인
    expect(screen.getByPlaceholderText('Enter your name')).toHaveValue(
      mockUser.name,
    );
    expect(screen.getByPlaceholderText('Enter your email')).toHaveValue(
      mockUser.email,
    );
    expect(screen.getByPlaceholderText('Enter your number')).toHaveValue(
      mockUser.phone,
    );
  });

  test('입력 변경 사항을 처리하고 올바르게 저장해야 합니다.', async () => {
    const isModalOpen = true;
    const handleSave = jest.fn();
    const expectedUser: any = {
      name: 'Jane Doe',
      email: mockUser.email,
      phone: mockUser.phone,
    };

    render(
      <Modal isOpen={isModalOpen} onClose={() => {}}>
        <EditProfile info={mockUser} onSave={handleSave} onClose={() => {}} />
      </Modal>,
    );

    // 사용자 입력 변경 시
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Jane Doe' },
    });

    // 폼 제출 버튼 클릭 시
    fireEvent.click(screen.getByText('Save'));

    // handleSave 함수가 업데이트된 사용자 정보와 함께 호출되는지 확인
    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(expectedUser);
    });
  });

  test('양식 필드의 유효성을 검사해야 합니다.', async () => {
    const isModalOpen = true;
    const handleSave = jest.fn();
    const handleClose = jest.fn();

    render(
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <EditProfile
          info={mockUser}
          onSave={handleSave}
          onClose={handleClose}
        />
      </Modal>,
    );

    // 필수 입력 필드가 비어있을 때 폼 제출 버튼 클릭 시
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: '' }, // 비어 있는 값으로 설정
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: '' }, // 비어 있는 값으로 설정
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your number'), {
      target: { value: '' }, // 비어 있는 값으로 설정
    });
    fireEvent.click(screen.getByText('Save'));

    // 검증 에러 메시지가 화면에 표시되는지 확인
    // waitFor를 사용하여 유효성 검사 메시지가 나타날 때까지 기다립니다.
    await waitFor(() => {
      expect(screen.getByText('Enter your name')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });
});

describe('Modal 및 API를 사용한 EditProfile', () => {
  // API 호출 모의(Mock)
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks(); // 테스트 이후 모의된 fetch 함수를 리셋합니다.
  });

  test('프로필을 저장할 때 올바른 데이터로 API 호출을 해야 합니다.', async () => {
    const isModalOpen = true;
    const handleClose = jest.fn();

    // handleSave 함수 내에 fetch 호출
    const handleSave = async (data: LoggedInUser) => {
      try {
        await fetch(
          `http://127.0.0.1:8080/atemos/member/${mockUser.memberId}`, // memberId를 포함하여 API 엔드포인트를 구성
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer token',
            },
            body: JSON.stringify(data),
          },
        );
      } catch (error) {
        console.error('Error while updating info:', error);
        // 에러 처리
      }
    };

    // 컴포넌트 렌더링
    render(
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <EditProfile
          info={mockUser}
          onSave={handleSave} // onSave에 handleSave 전달
          onClose={handleClose}
        />
      </Modal>,
    );

    // 사용자 입력 변경
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'jane.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your number'), {
      target: { value: '0987654321' },
    });

    // 폼 제출 버튼 클릭
    fireEvent.click(screen.getByText('Save'));

    const expectedUser: any = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
    };

    // API 호출 검증
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8080/atemos/member/4', // memberId를 포함하여 API 엔드포인트를 구성
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token', // Authorization 헤더 확인
          },
          body: JSON.stringify(expectedUser), // 전송된 body 확인
        },
      );
    });

    // 모달이 닫혔는지 확인
    expect(handleClose).toHaveBeenCalled();
  });
});
