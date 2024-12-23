import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { t } from 'i18next';
import { UserData } from '../../types/user';

interface MyPageCompanyContentsWrapperProps {
  companyMembers: UserData[];
}

const MyPageCompanyMembersContentsWrapper: React.FC<
  MyPageCompanyContentsWrapperProps
> = ({ companyMembers }) => {
  return (
    <>
      <div className="border-t border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <ul className="flex flex-col">
          {companyMembers &&
            companyMembers.length > 0 &&
            companyMembers.map((companyMember) => {
              return (
                <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
                  <div className="group relative inline-block cursor-pointer">
                    <span className="font-semibold hover:bg-opacity-90">
                      {companyMember.name}
                    </span>
                    <div className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-4.5 py-1.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                      <span className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-primary"></span>
                      {companyMember.noMaskingName}
                    </div>
                  </div>
                  <span>{companyMember.role}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default MyPageCompanyMembersContentsWrapper;
