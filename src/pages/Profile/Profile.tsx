import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import MyPageProfileContentsWrapper from '../ContentsWrapper/MyPageProfileContentsWrapper';
import MyPagePasswordContentsWrapper from '../ContentsWrapper/MyPagePasswordContentsWrapper';
import { t } from 'i18next';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import MyPageCompanyContentsWrapper from '../ContentsWrapper/MyPageCompanyContentsWrapper';
import { CompanyData } from '../../types/company';
import { fetchData } from '../../api';
import MyPageCompanyMembersContentsWrapper from '../ContentsWrapper/MyPageCompanyMembersContentsWrapper';
import queries from '../../hooks/queries/queries';
import { useQueryClient } from '@tanstack/react-query';
import { E_ROLE_TYPES } from '../../enum';

const Profile = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();

  const { useAuthCompanyInfo } = queries();
  const { data: authCompanyInfoData } = useAuthCompanyInfo();
  const [profileModal, setProfileModal] = useState(false);
  const [companyModal, setCompanyModal] = useState(false);

  const [editCompany, setEditCompany] = useState<CompanyData | null>(null);
  const [editCompanyMembers, setEditCompanyMembers] = useState([]);

  useEffect(() => {
    if (authCompanyInfoData) {
      setEditCompany(authCompanyInfoData);
    }
  }, [authCompanyInfoData]);

  useEffect(() => {
    if (editCompany?.companyId !== loggedInUser?.companyId) {
      queryClient.invalidateQueries({ queryKey: ['authCompanyInfo'] });
    }
    const getCompanyMembers = async () => {
      try {
        const maskingResponse = await fetchData(
          `/member?companyId=${loggedInUser?.companyId}&masking=true`,
        );
        const noMaskingResponse = await fetchData(
          `/member?companyId=${loggedInUser?.companyId}&masking=false`,
        );
        setEditCompanyMembers(
          maskingResponse.data.memberList.map((maskingMember: any) => {
            return {
              ...maskingMember,
              noMaskingName: noMaskingResponse.data.memberList.find(
                (nomaskingMember: any) =>
                  nomaskingMember.memberId == maskingMember.memberId,
              ).name,
            };
          }),
        );
      } catch (error) {
        console.error('Error while logging in:', error);
        // 에러 처리
      }
    };
    getCompanyMembers();
  }, []);

  return (
    <>
      <Breadcrumb pageName={t('MyPage')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id="myPageProfile"
          title={t('Profile')}
          size="md"
          childrenPxUse={false}
          buttonArea={
            <button
              onClick={() => setProfileModal(true)}
              className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
            >
              {t('Button.Edit')}
            </button>
          }
        >
          <MyPageProfileContentsWrapper
            isModalOpen={profileModal}
            setIsModalOpen={setProfileModal}
          />
        </Card>
        <Card
          id="myPagePassword"
          title={t('Password')}
          size="sm"
          childrenPxUse={false}
        >
          <MyPagePasswordContentsWrapper />
        </Card>
        {editCompany && (
          <>
            <Card
              id="myPageCompany"
              title={`${editCompany.name} / ${editCompany.type}`}
              size="md"
              childrenPxUse={false}
              buttonArea={
                loggedInUser?.role !== E_ROLE_TYPES.USER && (
                  <button
                    onClick={() => setCompanyModal(true)}
                    className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
                  >
                    {t('Button.Edit')}
                  </button>
                )
              }
            >
              <MyPageCompanyContentsWrapper
                info={editCompany}
                isModalOpen={companyModal}
                setIsModalOpen={setCompanyModal}
              />
            </Card>
            <Card
              id="myPageCompanyMembers"
              title={t(`Company's Members`)}
              size="sm"
              childrenPxUse={false}
            >
              {editCompanyMembers && (
                <MyPageCompanyMembersContentsWrapper
                  companyMembers={editCompanyMembers}
                />
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
