import { t } from 'i18next';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import MemberListContentsWrapper from '../ContentsWrapper/MemberListContentsWrapper';

const Member = () => {
  return (
    <div>
      <Breadcrumb pageName={t('Member')} />

      <Card id="memberList" titleUse={false} childrenPxUse={false}>
        <MemberListContentsWrapper />
      </Card>
    </div>
  );
};

export default Member;
