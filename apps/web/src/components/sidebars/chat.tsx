import { inter } from '@fonts';
import { useUser } from '@hooks/user';
import { Avatar, Badge, Text, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import clsx from 'clsx';

import { profileImageRouteGenerator } from '../../apps/utils/profile';
import { assetURLBuilder } from '../../apps/utils/url';

interface User {
  username: string;
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
}

interface ChatSidebarProps {
  freelancer: User;
  client: User;
}

export function ChatSidebar({ client, freelancer }: ChatSidebarProps) {
  const { userType } = useUser();
  return (
    <div
      className={clsx('flex', {
        'flex-col': userType === 'Client',
        'flex-col-reverse': userType === 'Freelancer',
      })}
    >
      <>
        <Text>
          <h2 className="text-base font-semibold">
            {userType === 'Client' ? 'Freelancer' : 'You'}
          </h2>
        </Text>

        <div className="mb-2 flex flex-row items-center rounded-md border-[1px] p-1 transition-all duration-[110ms] hover:scale-110 ">
          <Avatar
            src={
              freelancer.avatarUrl
                ? assetURLBuilder(freelancer.avatarUrl)
                : profileImageRouteGenerator(freelancer.username)
            }
            size="md"
            radius="xl"
          />
          <div className="ml-2 flex flex-col">
            <h2 className="overflow-x-hidden text-base font-semibold">
              {freelancer.name}
              {freelancer.verified ? (
                <Tooltip label="Verified User" withArrow>
                  <Badge
                    color="green"
                    variant="light"
                    className="ml-2 rounded-full"
                  >
                    <div className="flex flex-row flex-nowrap items-center justify-center">
                      <IconCheck color="green" size={15} />
                    </div>
                  </Badge>
                </Tooltip>
              ) : null}
            </h2>
            <Text
              color={'dimmed'}
              className={clsx({
                [inter.className]: true,
              })}
              lineClamp={1}
            >
              <a
                href={`/profile/${freelancer.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                @{freelancer.username}
              </a>
            </Text>
          </div>
        </div>
      </>
      <>
        <Text>
          <h2 className="text-base font-semibold">
            {userType === 'Client' ? 'You' : 'Client'}
          </h2>
        </Text>
        <div className="mb-2 flex flex-row items-center rounded-md border-[1px] p-1 transition-all duration-[110ms] hover:scale-110">
          <Avatar
            src={
              client.avatarUrl
                ? assetURLBuilder(client.avatarUrl)
                : profileImageRouteGenerator(client.username)
            }
            size="md"
            radius="xl"
          />
          <div className="ml-2 flex flex-col">
            <h2 className="text-base font-semibold">
              {client.name}
              {client.verified ? (
                <Tooltip label="Verified User" withArrow>
                  <Badge
                    color="green"
                    variant="light"
                    className="ml-2 rounded-full"
                  >
                    <div className="flex flex-row flex-nowrap items-center justify-center">
                      <IconCheck color="green" size={15} />
                    </div>
                  </Badge>
                </Tooltip>
              ) : null}
            </h2>
            <Text
              color={'dimmed'}
              className={clsx({
                [inter.className]: true,
              })}
            >
              <a
                href={`/profile/${client.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                @{client.username}
              </a>
            </Text>
          </div>
        </div>
      </>
    </div>
  );
}
