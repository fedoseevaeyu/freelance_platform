import useHydrateUserContext from '@hooks/hydrate/user';

import CreateJobPostPageContent from '../../apps/(create)/job-post/page';
import { siteName } from '../../apps/data/site';
import Layout from '../../apps/ui/layout';

function CreateJobPost() {
  useHydrateUserContext();

  return (
    <Layout
      title={`Создать Заказ | ${siteName}`}
      description="Создайте заказ, чтобы выполнить свою работу."
    >
      <CreateJobPostPageContent />
    </Layout>
  );
}

export default CreateJobPost;
