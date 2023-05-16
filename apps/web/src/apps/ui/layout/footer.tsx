import Link from 'next/link';

import { routes } from '../../config/routes';
import { siteName } from '../../data/site';

const FooterWidget = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; title: string }>;
}) => (
  <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
    <h6 className="mb-2 font-medium text-gray-800">{title}</h6>
    <ul className="flex flex-col gap-2 text-sm">
      {links.map((e) => (
        <li key={e.href}>
          <Link
            href={e.href}
            className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900"
          >
            {e.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export function Footer() {
  return (
    <footer className="h-[265px] border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 py-8 sm:grid-cols-12 md:py-12">
          <div className="sm:col-span-12 lg:col-span-4">
            <div className="mb-2">
              <Link
                href={routes.home}
                className="inline-flex items-center gap-4"
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
                      id="footer-logo"
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
                    fill="url(#footer-logo)"
                    fillRule="nonzero"
                  />
                </svg>
                {siteName}
              </Link>
            </div>
            <ul className="mb-4 text-sm text-gray-600">
              <li>
                <Link
                  href={routes.agreement}
                  className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 hover:underline"
                >
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link
                  href={routes.privacy}
                  className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 hover:underline"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
            <div className="mr-4 text-sm text-gray-600">
              &copy; {new Date().getFullYear()}. Все права защищены.
            </div>
          </div>

          <FooterWidget
            title="Наши услуги"
            links={[
              { href: '#', title: 'Веб-разработка' },
              { href: '#', title: 'Мобильная-разработка' },
              { href: '#', title: 'Тарифы' },
            ]}
          />

          <FooterWidget
            title="Полезные ресурсы"
            links={[
              { href: '#', title: 'Блог' },
              { href: '#', title: 'FAQ' },
              { href: '#', title: 'Поддержка' },
              { href: '#', title: 'Советы экспертов' },
            ]}
          />

          <FooterWidget
            title="О компании"
            links={[
              { href: '#', title: 'О нас' },
              { href: '#', title: 'Отзывы' },
              { href: '#', title: 'Партнёры' },
              { href: '#', title: 'Контакты' },
            ]}
          />

          <FooterWidget
            title="Следите за нами"
            links={[
              { href: '#', title: 'Rossgram' },
              { href: '#', title: 'RuTube' },
              { href: '#', title: 'Telegram' },
              { href: '#', title: 'LinkedIn' },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}
