import '@styles/globals.scss';
import 'react-phone-input-2/lib/style.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import ErrorBoundary from '@components/error';
import { inter } from '@fonts';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppProps } from 'next/app';

import { UserProvider } from '../apps/(auth)/user.context';
import { Header } from '../apps/ui/layout/header';
import { RouterTransition } from '../apps/ui/layout/nprogress';

const client = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props as any;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <RouterTransition />
        <UserProvider>
          <MantineProvider
            theme={{
              colorScheme: 'light',
              fontFamily: inter.style.fontFamily,
              colors: {
                dark: [
                  '#C1C2C5',
                  '#A6A7AB',
                  '#909296',
                  '#5c5f66',
                  '#373A40',
                  '#2C2E33',
                  '#25262b',
                  '#0c0d14',
                  '#141517',
                  '#101113',
                ],
              },
            }}
            withGlobalStyles
            withNormalizeCSS
            withCSSVariables
          >
            <ModalsProvider>
              <div>
                <Header />
                <AnimatePresence mode="wait">
                  <motion.main
                    variants={{
                      exit: {
                        filter: 'blur(8px)',
                      },
                      enter: {
                        filter: 'blur(0px)',
                      },
                    }}
                    animate="enter"
                    initial="initial"
                    exit="exit"
                    className="min-h-screen overflow-x-hidden pt-[80px]"
                    key={props.router.pathname}
                  >
                    <Component {...pageProps} key={props.router.asPath} />
                  </motion.main>
                </AnimatePresence>
              </div>
            </ModalsProvider>
            <Notifications />
            <ReactQueryDevtools />
          </MantineProvider>
        </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
