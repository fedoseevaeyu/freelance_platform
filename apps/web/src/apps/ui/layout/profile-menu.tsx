import { useSetUser, useUser } from '@hooks/user';
import { Avatar, Menu } from '@mantine/core';
import {
  IconLogout,
  IconMoneybag,
  IconSearch,
  IconSettings2,
  IconShoppingCart,
  IconUserCircle,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { routes } from '../../config/routes';
import { eraseCookie } from '../../utils/cookie';
import { profileImageRouteGenerator } from '../../utils/profile';
import { assetURLBuilder } from '../../utils/url';

export default function HeaderMenu() {
  const { avatarUrl, username, userType, profileCompleted } = useUser();
  const dispatch = useSetUser();
  const { push } = useRouter();
  return (
    <>
      <Menu withArrow width={200}>
        <Menu.Target>
          <Avatar
            className="cursor-pointer"
            src={
              avatarUrl
                ? assetURLBuilder(avatarUrl)
                : profileImageRouteGenerator(username)
            }
            radius="xl"
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              push(`/profile/${username}`);
            }}
            icon={<IconUserCircle size={20} />}
          >
            Профиль
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              push(`/search`);
            }}
            icon={<IconSearch size={20} />}
          >
            Поиск
          </Menu.Item>
          {userType === 'Client' ? (
            <Menu.Item
              color="green"
              onClick={() => {
                push('/create/job-post');
              }}
              icon={<IconMoneybag size={20} />}
            >
              Создать Заказ
            </Menu.Item>
          ) : (
            <>
              {userType === 'Freelancer' ? (
                <Menu.Item
                  color="green"
                  onClick={() => push(`/create/service`)}
                  icon={<IconMoneybag size={20} />}
                >
                  Создать Услугу
                </Menu.Item>
              ) : null}
            </>
          )}
            <Menu.Item
            onClick={() => {
              push(`/profile/${username}/orders`);
            }}
            icon={<IconShoppingCart size={20} />}
          >
            Заказы
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            onClick={() => {
              eraseCookie('token');
              eraseCookie('refreshToken');
              dispatch({
                type: 'LOG_OUT',
                payload: {},
              });
              push(routes.auth.signIn);
            }}
            icon={<IconLogout size={20} />}
          >
            Выход
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
