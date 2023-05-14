import { useUser } from '@hooks/user';
import Link from 'next/link';

import { routes } from '../../../config/routes';

function HeroSection() {
  const { id } = useUser();

  return (
    <section className="relative">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-[-1] -translate-x-1/2"
        aria-hidden
      >
        <svg width="1360" height="578" viewBox="0 0 1360 578">
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-16 md:pb-20 md:pt-20">
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-4 text-5xl font-extrabold leading-tighter tracking-tighter md:text-6xl"
              data-aos="zoom-y-out"
            >
              Зарабатывайте и выполняйте свои задачи{' '}
              <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                вместе с нами
              </span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-gray-600"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Наша платформа поможет вам легко найти проекты, работать с
                клиентами или исполнителями.
              </p>
              <div
                className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <Link
                  className="btn mb-4 w-full bg-blue-600 text-white hover:bg-blue-700 sm:mb-0 sm:w-auto"
                  href={id ? routes.search : routes.auth.signUp}
                >
                  Начните бесплатно
                </Link>
                <Link
                  className="btn w-full bg-gray-900 text-white hover:bg-gray-800 sm:ml-4 sm:w-auto"
                  shallow
                  href="#how-it-work"
                >
                  Как это работает?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
