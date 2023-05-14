import { clsx } from '@mantine/core';
import { IconEaseIn, IconSearch } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import React, { useRef, useState } from 'react';

const features: Array<{
  id: number;
  title: string;
  description: ReactNode;
  icon: ReactNode;
}> = [
  {
    id: 1,
    title: 'Удобный поиск',
    description:
      'Наша платформа предлагает удобный инструмент для поиска проектов и специалистов с помощью ключевых слов, категорий и фильтров.',
    icon: <IconSearch className="h-3 w-3 fill-current" />,
  },
  {
    id: 2,
    title: 'Рекомендательная система',
    description:
      'Мы подбираем подходящие проекты и специалистов для вас с использованием рекомендательной системы.',
    icon: (
      <svg
        className="h-3 w-3 fill-current"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M6 21v-2a4 4 0 0 1 4 -4h.5"></path>
        <path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z"></path>
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Простота использования',
    description:
      'Платформа разработана с учетом потребностей пользователей, обеспечивая комфортную и эффективную работу.',
    icon: <IconEaseIn className="h-3 w-3 fill-current" />,
  },
];

export default function Features() {
  const tabs = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<number>(1);

  return (
    <section className="relative">
      <div
        className="pointer-events-none absolute inset-0 mb-16 bg-gray-100"
        aria-hidden
      />
      <div className="absolute inset-x-0 m-auto h-20 w-px -translate-y-1/2 bg-gray-200 p-px" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <h2 className="mb-4">Откройте новые решения</h2>
            <p className="text-xl text-gray-600">
              Добро пожаловать на нашу фриланс-платформу, которая предлагает
              широкий спектр решений для развития вашего бизнеса.
            </p>
          </div>

          <div className="md:grid md:grid-cols-12 md:gap-6">
            <div
              className="mx-auto max-w-xl md:col-span-7 md:w-full md:max-w-none lg:col-span-6"
              data-aos="fade-right"
            >
              <div className="mb-8 md:mb-0">
                {features.map((feature) => (
                  <span
                    key={feature.id}
                    className={`mb-3 flex cursor-pointer items-center rounded border p-5 text-lg transition duration-300 ease-in-out ${
                      tab !== feature.id
                        ? 'border-gray-200 bg-white shadow-md hover:shadow-lg'
                        : 'border-transparent bg-gray-200'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setTab(feature.id);
                    }}
                  >
                    <div>
                      <div className="mb-1 font-bold leading-snug tracking-tight">
                        {feature.title}
                      </div>
                      <div className="text-gray-600">{feature.description}</div>
                    </div>
                    <div className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow">
                      {feature.icon}
                    </div>
                  </span>
                ))}
              </div>
            </div>

            <div
              className="mx-auto mb-8 max-w-xl md:order-1 md:col-span-5 md:mb-0 md:w-full md:max-w-none lg:col-span-6"
              data-aos="zoom-y-out"
              ref={tabs}
            >
              <div className="relative flex h-full flex-col items-center justify-center text-center lg:text-right">
                {features.map((e) => (
                  <div
                    className={clsx('w-full', { hidden: e.id !== tab })}
                    key={e.id}
                  >
                    <div className="relative inline-flex flex-col">
                      <img
                        className="mx-auto rounded md:max-w-none"
                        src={`/images/features/${e.id}.jpg`}
                        width="500"
                        height="462"
                        alt={e.title}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
