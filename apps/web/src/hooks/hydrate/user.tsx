import { useSetUser } from '@hooks/user';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { createCookie, readCookie } from '../../apps/utils/cookie';
import { URLBuilder } from '../../apps/utils/url';

export default function useHydrateUserContext(
  action: 'push' | 'replace' = 'replace',
  redirect?: boolean,
  redirectTarget?: string,
  redirectIfNoAuthToken?: boolean,
  goTo?: string
) {
  const dispatch = useSetUser();
  const { push, replace, asPath, isReady } = useRouter();
  async function fetcher(tokenStr?: string, updateState = false) {
    const token = readCookie('token') || tokenStr;
    const res = await axios
      .get(URLBuilder('/profile'), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch(() => {
        return null;
      });
    if (res === null) {
      if (redirect) {
        if (redirectTarget) {
          if (action === 'push') {
            push(`${redirectTarget}?to=${asPath}`);
          } else {
            replace(`${redirectTarget}?to=${asPath}`);
          }
        } else if (action === 'push') {
          push(`${redirectTarget}?to=${asPath}`);
        } else {
          replace(`${redirectTarget}?to=${asPath}`);
        }
      }
      return;
    }
    if (updateState) {
      dispatch({
        type: 'SET_USER',
        payload: {
          ...res.data,
          userType: res.data.role,
        },
      });
      if (goTo) {
        replace(goTo);
      }
    }
  }

  useEffect(() => {
    if (!isReady) return;
    const token = readCookie('token');
    const refreshToken = readCookie('refreshToken');
    if (!token && redirectIfNoAuthToken) {
      if (action === 'push') {
        push(`${redirectTarget}?to=${asPath}`);
      } else {
        replace(`${redirectTarget}?to=${asPath}`);
      }
    }
    if (token) {
      fetcher(token, true);
    }
    if (refreshToken) {
      axios
        .get(URLBuilder('/hydrate/token'), {
          headers: {
            authorization: `Bearer ${refreshToken}`,
          },
        })
        .then((res) => {
          createCookie('token', res.data.token, 1);
          fetcher(res.data.token, true);
        })
        .catch(() => {});
    }
  }, [isReady]);
  return fetcher;
}
