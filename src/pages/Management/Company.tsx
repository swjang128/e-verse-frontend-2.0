import { t } from 'i18next';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import CompanyListContentsWrapper from '../ContentsWrapper/CompanyListContentsWrapper';

const Company = () => {
  return (
    <div>
      <Breadcrumb pageName={t('Company')} />

      <Card id="companyList" titleUse={false} childrenPxUse={false}>
        <CompanyListContentsWrapper />
      </Card>
    </div>
  );
};

export default Company;
