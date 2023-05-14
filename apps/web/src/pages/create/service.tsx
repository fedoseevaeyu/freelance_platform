import useHydrateUserContext from '@hooks/hydrate/user';

import CreateServicePageContent from '../../apps/(create)/service/page';
import { siteName } from '../../apps/data/site';
import Layout from '../../apps/ui/layout';

function CreateServicePage() {
  useHydrateUserContext('replace', true);

  return (
    <Layout
      title={`Создать услугу | ${siteName}`}
      description="Создайте услугу и начните зарабатывать."
    >
      <CreateServicePageContent />
    </Layout>
  );
}

export default CreateServicePage;
