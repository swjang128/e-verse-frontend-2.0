import { useCallback, useEffect, useState } from 'react';
import { deleteData, fetchData, patchData, postData } from '../../api';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../Modal';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import queries from '../../hooks/queries/queries';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { CompanyData } from '../../types/company';
import EditCompany from '../Management/EditCompany';
import Subscription from '../Management/Subscription';
import CompanySubscription from '../Management/CompanySubscription';

const CompanyListContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useManageCompanyList } = queries();
  const { data: companyListData, error, isLoading } = useManageCompanyList();

  // 협력업체(회사) 데이터를 관리하는 상태
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  // globalFilter 상태 추가
  // const [globalFilter, setGlobalFilter] = useState('');

  // 협력업체(회사) 등록
  const [addModal, setAddModal] = useState(false);

  // 협력업체(회사) 사용 내역 보기
  const [usagePopModal, setUsagePopModal] = useState(false);

  // 협력업체(회사) 수정
  const [editCompany, setEditCompany] = useState<CompanyData | null>(null);
  const [editModal, setEditModal] = useState(false);

  // 협력업체(회사) 삭제
  const [deleteCompanyInfo, setDeleteCompanyInfo] =
    useState<CompanyData | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (companyListData) {
      setCompanies(companyListData);
    }
  }, [companyListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit'
      ? CompanyData
      : Omit<CompanyData, 'companyId'>,
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 CompanyData 타입으로 단언
      const updateCompanyInfo = updatedInfo as CompanyData;
      // 협력업체(회사) 수정
      try {
        await patchData(
          `/company/${updateCompanyInfo.companyId}`,
          updateCompanyInfo,
        );
        queryClient.invalidateQueries({
          queryKey: ['manageCompanyList'],
        });
        setEditModal(false);
        setEditCompany(null);
      } catch (error) {
        console.error('Error while updating company info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<CompanyData, 'companyId'> 타입으로 단언
      const newCompanyInfo = updatedInfo as Omit<CompanyData, 'companyId'>;
      // 협력업체(회사) 추가
      try {
        await postData(`/company`, newCompanyInfo);
        queryClient.invalidateQueries({
          queryKey: ['manageCompanyList'],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding company:', error);
      }
    }
  };

  // 협력업체(회사) 삭제
  const handleDelete = async () => {
    if (deleteCompanyInfo) {
      try {
        await deleteData(`/company/${deleteCompanyInfo.companyId}`);
        queryClient.invalidateQueries({
          queryKey: ['manageCompanyList'],
        });
        setDeleteModal(false);
        setDeleteCompanyInfo(null);
      } catch (error) {
        console.error('Error while deleting company:', error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (company: CompanyData) => {
    try {
      const data = await fetchData(`/company?companyId=${company.companyId}`);
      setEditCompany(data.data.companyList[0]);
    } catch (error) {
      console.error('Error while logging in:', error);
      // 에러 처리
    } finally {
      setEditModal(true);
    }
  };

  const onUsagePop = async (company: CompanyData) => {
    try {
      const data = await fetchData(`/company?companyId=${company.companyId}`);
      setEditCompany(data.data.companyList[0]);
    } catch (error) {
      console.error('Error while logging in:', error);
      // 에러 처리
    } finally {
      setUsagePopModal(true);
    }
  };

  const onDelete = (company: CompanyData) => {
    setDeleteCompanyInfo(company);
    setDeleteModal(true);
  };

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 검색어 필터링
  let filteredCompanies = companies;
  if (companies) {
    filteredCompanies = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.countryName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  return (
    <>
      <DataTable<CompanyData>
        title={t('Companies')}
        data={filteredCompanies}
        columns={[
          { Header: t('Name'), accessor: 'name' },
          { Header: t('Type'), accessor: 'type' },
          { Header: t('CountryName'), accessor: 'countryName' },
          { Header: t('Address'), accessor: 'address' },
          { Header: t('Email'), accessor: 'email' },
        ]}
        onEdit={onEdit}
        onPwReset={undefined}
        onUsagePop={onUsagePop}
        onDelete={onDelete}
        enableActions={true}
        additionalButtonArea={
          <button
            onClick={() => {
              setEditCompany(null);
              setAddModal(true);
            }}
            className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
          >
            {t('Button.Add')}
          </button>
        }
      />
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {editCompany && (
          <EditCompany
            info={editCompany}
            onSave={(updatedInfo: any) =>
              handleSave('edit', updatedInfo as CompanyData)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>
      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <EditCompany
          info={
            {
              name: '',
              email: '',
              type: 'FEMS',
              countryName: '',
              countryId: 1,
              tel: '',
              fax: '',
              address: '',
            } as CompanyData
          }
          onSave={(updatedInfo: any) =>
            handleSave('add', updatedInfo as Omit<CompanyData, 'companyId'>)
          }
          onClose={() => setAddModal(false)}
          mode="add"
        />
      </Modal>
      <Modal isOpen={usagePopModal} onClose={() => setUsagePopModal(false)}>
        {editCompany && (
          <CompanySubscription
            companyId={editCompany.companyId}
            companyName={editCompany.name}
            companyType={editCompany.type}
            onClose={() => setUsagePopModal(false)}
          ></CompanySubscription>
        )}
      </Modal>
      <ConfirmCancelModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('Delete Company')}
        message={t('Are you sure you want to delete this company?')}
      />
    </>
  );
};
export default CompanyListContentsWrapper;
