import { Inter, Montserrat } from 'next/font/google';

export const inter = Inter({
  weight: ['400', '500', '600', '700', '100', '200', '300', '800', '900'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  weight: ['400', '700', '800'],
});
