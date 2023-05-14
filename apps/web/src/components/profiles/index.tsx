import { IconBrandGithub } from '@tabler/icons-react';
import { useMemo } from 'react';

interface Props {
  githubUsername?: string | null;
  facebookUsername?: string | null;
  twitterUsername?: string | null;
  instagramUsername?: string | null;
  linkedinUsername?: string | null;
}

export default function LinkedAccounts(props: Props) {
  const links = useMemo(
    () => [
      {
        icon: IconBrandGithub,
        href: `https://twitter.com`,
        text: props.twitterUsername || 'Twitter',
        value: props.twitterUsername,
      },
    ],
    []
  );

  return (
    <>
      <ul className="mt-2 flex flex-col items-center justify-evenly">
        {links.map((link) => {
          if (link.value)
            return (
              <li className="flex w-full flex-row justify-between">
                <link.icon width={24} height={24} />
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto text-blue-500 hover:underline "
                >
                  <span className="ml-auto">{link.text}</span>
                </a>
              </li>
            );
          return null;
        })}
      </ul>
    </>
  );
}
