import { useUser } from '@hooks/user';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { routes } from '../../config/routes';
import { siteName } from '../../data/site';
import HeaderMenu from './profile-menu';

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { username } = useUser();

  useEffect(() => {
    const scrollHandler = () => {
      if (ref.current) {
        if (window.pageYOffset > 10) {
          ref.current.classList.add(
            'bg-white',
            'backdrop-blur-sm',
            'shadow-lg'
          );
        } else {
          ref.current.classList.remove(
            'bg-white',
            'backdrop-blur-sm',
            'shadow-lg'
          );
        }
      }
    };
    window.addEventListener('scroll', scrollHandler);

    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <header
      ref={ref}
      className="fixed z-30 w-full transition duration-300 ease-in-out md:bg-opacity-80"
    >
      <div className="px-5 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="mr-4 shrink-0">
            <Link
              href={routes.home}
              className="flex items-center gap-4 text-xl font-bold"
              aria-label={siteName}
            >
              <svg className="h-8 w-8" viewBox="0 0 32 32">
                <defs>
                  <radialGradient
                    cx="21.152%"
                    cy="86.063%"
                    fx="21.152%"
                    fy="86.063%"
                    r="79.941%"
                    id="header-logo"
                  >
                    <stop stopColor="#4FD1C5" offset="0%" />
                    <stop stopColor="#81E6D9" offset="25.871%" />
                    <stop stopColor="#338CF5" offset="100%" />
                  </radialGradient>
                </defs>
                <rect
                  width="32"
                  height="32"
                  rx="16"
                  fill="url(#header-logo)"
                  fillRule="nonzero"
                />
              </svg>
              {siteName}
            </Link>
          </div>

          {username ? (
            <HeaderMenu />
          ) : (
            <div className="flex items-center justify-center">
              <Link
                className="flex items-center px-5 py-3 font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-900"
                href={routes.auth.signIn}
              >
                Войти
              </Link>
              <Link
                href={routes.auth.signUp}
                className="btn-sm ml-3 bg-gray-900 text-gray-200 hover:bg-gray-800"
              >
                <span>Регистрация</span>
                <svg
                  className="-mr-1 ml-2 h-3 w-3 shrink-0 fill-current text-gray-400"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                    fillRule="nonzero"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
