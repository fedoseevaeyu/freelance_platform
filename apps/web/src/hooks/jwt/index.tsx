import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { createCookie, readCookie } from '../../apps/utils/cookie';
import { URLBuilder } from '../../apps/utils/url';

interface RedirectProps {
  method: 'push' | 'replace';
  to: string;
  redirect: boolean;
  successAction?: (a: any) => any;
}

export default function useIssueNewAuthToken(props?: RedirectProps) {
  const { isReady, push, replace, asPath } = useRouter();
  useEffect(() => {
    const refreshToken = readCookie('refreshToken');
    if (!isReady || !refreshToken) {
      return () => {};
    }
    const controller = new AbortController();
    axios
      .get<{ token: string }>(URLBuilder('/hydrate/token'), {
        headers: {
          authorization: `Bearer ${refreshToken}`,
        },
        signal: controller.signal,
      })
      .then((d) => d.data)
      .then(({ token }) => {
        createCookie('refreshtoken', token, 1);
        if (props) {
          if (props.successAction) {
            props.successAction(token);
          }
        }
      })
      .catch((err) => {
        if (err.code === 'ERR_CANCELED') return;
        if (props) {
          const { method, redirect, to } = props;
          if (method === 'push' && redirect) {
            push({
              pathname: to,
              query: {
                to: asPath,
              },
            });
          }
          if (method === 'replace' && redirect) {
            replace({
              pathname: to,
              query: {
                to: asPath,
              },
            });
          }
        }
      });
    return () => {
      controller.abort();
    };
  }, [isReady]);
}
