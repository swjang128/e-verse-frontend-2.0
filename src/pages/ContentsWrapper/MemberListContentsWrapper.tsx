import { useCallback, useEffect, useState } from 'react';
import { UserData } from '../../types/user';
import { deleteData, fetchData, patchData, postData } from '../../api';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../Modal';
import EditMember from '../Management/EditMember';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import queries from '../../hooks/queries/queries';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { E_ROLE_TYPES } from '../../enum';
import { showToast, ToastType } from '../../ToastContainer';

const MemberListContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useMemberList, useMemberOneWithoutMasking } = queries();
  const {
    data: memberListData,
    error,
    isLoading,
  } = useMemberList(loggedInUser?.role || '', loggedInUser?.companyId || 0);

  // 멤버 데이터를 관리하는 상태
  const [members, setMembers] = useState<UserData[]>([]);
  // globalFilter 상태 추가
  // const [globalFilter, setGlobalFilter] = useState('');

  // 멤버 등록
  const [addModal, setAddModal] = useState(false);

  // 멤버 수정
  const [editMember, setEditMember] = useState<UserData | null>(null);
  const [editModal, setEditModal] = useState(false);

  // 비밀번호 초기화
  const [pwReset, setPwReset] = useState<UserData | null>(null);
  const [pwResetModal, setPwResetModal] = useState(false);

  // 멤버 삭제
  const [deleteMember, setDeleteMember] = useState<UserData | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // 사용자 변경시 memberList invalidate
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['memberList', loggedInUser?.companyId],
    });
  }, [loggedInUser]);

  useEffect(() => {
    if (memberListData) {
      setMembers(memberListData);
    }
  }, [memberListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit' ? UserData : Omit<UserData, 'memberId'>,
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 UserData 타입으로 단언
      const updateUserInfo = updatedInfo as UserData;
      // 멤버 수정
      try {
        await patchData(`/member/${updateUserInfo.memberId}`, updateUserInfo);
        // 유저 추가 성공 시 유저 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['memberList', loggedInUser?.companyId],
        });
        setEditModal(false);
        setEditMember(null);
      } catch (error) {
        console.error('Error while updating member info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<UserData, 'memberId'> 타입으로 단언
      const newUserInfo = updatedInfo as Omit<UserData, 'memberId'> & {
        password: string;
      };
      // 멤버 추가
      try {
        newUserInfo.password = 'Atemos1234!';
        await postData(`/member`, newUserInfo);
        // 유저 추가 성공 시 유저 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['memberList', loggedInUser?.companyId],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding member:', error);
      }
    }
  };

  // 비밀번호 초기화
  const handlePwReset = async () => {
    if (pwReset) {
      try {
        await postData(`/auth/reset-password`, { email: pwReset.email });
        setPwResetModal(false);
        setPwReset(null);
      } catch (error) {
        console.error('Error while resetting password:', error);
      }
    }
  };

  // 멤버 삭제
  const handleDelete = async () => {
    if (deleteMember) {
      try {
        await deleteData(`/member/${deleteMember.memberId}`);
        // 유저 추가 성공 시 유저 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['memberList', loggedInUser?.companyId],
        });
        setDeleteModal(false);
        setDeleteMember(null);
      } catch (error) {
        console.error('Error while deleting member:', error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (member: UserData) => {
    try {
      let endpoint = `/member?companyId=${loggedInUser?.companyId}&memberId=${member.memberId}&masking=false`;
      if (loggedInUser?.role === E_ROLE_TYPES.ADMIN) {
        endpoint = `/member?memberId=${member.memberId}&masking=false`;
      }

      const data = await fetchData(endpoint);
      setEditMember(data.data.memberList[0]);
    } catch (error) {
      console.error('Error while logging in:', error);
      // 에러 처리
    }
    setEditModal(true);
    setAddModal(false);
  };

  const onPwReset = (member: UserData) => {
    setPwReset(member);
    setPwResetModal(true);
  };

  const onDelete = (member: UserData) => {
    setDeleteMember(member);
    setDeleteModal(true);
  };

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 검색어 필터링
  let filteredUsers = members;
  if (members) {
    filteredUsers = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  return (
    <>
      <DataTable<UserData>
        title={t('Members')}
        data={filteredUsers}
        columns={[
          { Header: t('Name'), accessor: 'name' },
          { Header: t('Email'), accessor: 'email' },
          { Header: t('Role'), accessor: 'role' },
          { Header: t('Phone'), accessor: 'phone' },
        ]}
        onEdit={onEdit}
        onPwReset={onPwReset}
        onDelete={onDelete}
        enableActions={true}
        additionalButtonArea={
          <button
            onClick={() => {
              setEditMember(null);
              setAddModal(true);
            }}
            className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
          >
            {t('Button.Add')}
          </button>
        }
      />
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {editMember && (
          <EditMember
            info={editMember}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as UserData)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>
      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <EditMember
          info={
            {
              name: '',
              email: '',
              phone: '',
              role: E_ROLE_TYPES.USER,
              companyId: loggedInUser?.companyId,
            } as UserData
          }
          onSave={(updatedInfo) =>
            handleSave('add', updatedInfo as Omit<UserData, 'memberId'>)
          }
          onClose={() => setAddModal(false)}
          mode="add"
        />
      </Modal>
      <ConfirmCancelModal
        isOpen={pwResetModal}
        onClose={() => setPwResetModal(false)}
        onConfirm={handlePwReset}
        title={t('Reset Password')}
        message={t(
          'Do you want to initialize the password? The initialized password is received by mail.',
        )}
      />
      <ConfirmCancelModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('Delete Member')}
        message={t('Are you sure you want to delete this member?')}
      />
    </>
  );
};
export default MemberListContentsWrapper;
