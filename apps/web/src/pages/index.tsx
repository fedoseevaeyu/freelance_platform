import useHydrateUserContext from '@hooks/hydrate/user';
import type { NextPage } from 'next';

import HomePageContent from '../apps/(landings)/home/page';
import { siteName } from '../apps/data/site';
import Layout from '../apps/ui/layout';

const Home: NextPage = () => {
  useHydrateUserContext();
  return (
    <Layout
      description="Фриланс платформа с рекомендательной системой"
      title={siteName}
      footer
    >
      <HomePageContent />
    </Layout>
  );
};
export default Home;
