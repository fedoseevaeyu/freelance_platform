import useHydrateUserContext from '@hooks/hydrate/user';
import { useUser } from '@hooks/user';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LoginPageContent from '../apps/(auth)/sign-in/page';
import { routes } from '../apps/config/routes';
import { siteName } from '../apps/data/site';
import Layout from '../apps/ui/layout';

export default function LoginPage() {
  const { isReady, replace, query } = useRouter();
  const { username } = useUser();

  useHydrateUserContext();

  useEffect(() => {
    if (!isReady) return;
    if (username) {
      replace((query.to as string) || routes.profile(username));
    }
  }, [isReady, username]);

  return (
    <Layout
      title={`Авторизация | ${siteName}`}
      description={`Авторизация на сервисе ${siteName}`}
    >
      <LoginPageContent />
    </Layout>
  );
}
