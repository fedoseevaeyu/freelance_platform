import { Container } from '@components/container';
import JobPosts from '@components/tabs/profile/job-posts';
import ServicesTab from '@components/tabs/profile/services';
import { inter } from '@fonts';
import useHydrateUserContext from '@hooks/hydrate/user';
import { useUser } from '@hooks/user';
import {
  Avatar,
  Button,
  FileButton,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconClock, IconMapPin, IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import React, { useEffect, useState } from 'react';

import { routes } from '../../../apps/config/routes';
import { countries } from '../../../apps/data';
import { siteName } from '../../../apps/data/site';
import { MetaTags } from '../../../apps/ui/meta-tags';
import { readCookie } from '../../../apps/utils/cookie';
import { notifyAboutError } from '../../../apps/utils/error';
import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { uploadFiles } from '../../../apps/utils/upload';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

dayjs.locale(ru);

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const [isEdit, setIsEdit] = useState(false);
  const { username } = useUser();
  const editable = username === props.username;
  useHydrateUserContext();

  const updateState = useHydrateUserContext(
    'replace',
    true,
    routes.auth.signIn
  );
  const { data, isLoading, refetch } = useQuery<{
    bio: string;
    name: string;
    aboutMe: string;
    country: string;
    avatarUrl: string;
  }>({
    queryKey: ['account'],
    queryFn: async () => {
      return fetch(URLBuilder(`/profile?settings=true`), {
        headers: {
          authorization: `Bearer ${readCookie('token')}`,
        },
      }).then((res) => res.json());
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const formState = useForm({
    initialValues: {
      bio: '',
      name: '',
      aboutMe: '',
      country: '',
      avatarUrl: '',
      imageSelected: false,
    },
  });

  const [avatar, setAvatar] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      formState.setValues({
        name: data!.name,
        bio: data!.bio,
        country: data!.country,
        avatarUrl: data!.avatarUrl,
      });
      formState.resetDirty();
    }
  }, [data, isLoading]);

  const [loading, setLoading] = useState(false);

  if (isEdit) {
    return (
      <div className={inter.className}>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <MetaTags
          title={`${props.name} | @${props.username} | ${siteName}`}
          description={props.bio || `${props.name} на ${siteName}`}
        />
        <div className="flex flex-row flex-wrap items-center justify-evenly">
          <div className="h-52 w-full bg-[#e0f3ff]" />
          <Paper
            withBorder
            p="xl"
            radius={'md'}
            style={{
              flex: 0.3,
            }}
            className="mt-[-50px] lg:min-w-[50%]"
          >
            <div className="flex flex-col items-center justify-center">
              <FileButton
                onChange={(d) => {
                  if (d) {
                    setAvatar(d);
                    formState.setFieldValue('imageSelected', true);
                  }
                }}
                accept={'image/*'}
              >
                {({ onClick }) => (
                  <Avatar
                    src={
                      formState.values.imageSelected && avatar
                        ? URL.createObjectURL(avatar)
                        : formState.values.avatarUrl
                        ? assetURLBuilder(formState.values.avatarUrl)
                        : profileImageRouteGenerator(username)
                    }
                    size={150}
                    className={clsx('cursor-pointer')}
                    radius={'50%' as any}
                    onClick={onClick}
                  />
                )}
              </FileButton>
              <div className="flex w-full flex-col items-center justify-center">
                <form
                  onReset={() => setIsEdit(false)}
                  onSubmit={formState.onSubmit(async (d) => {
                    setLoading(true);
                    let url: string | undefined;
                    if (avatar) {
                      const urls = await uploadFiles(
                        [avatar],
                        readCookie('token')!
                      ).catch((err) => {
                        notifyAboutError(err);
                        setLoading(false);
                        return null;
                      });
                      if (urls === null) return;
                      url = urls.paths[0];
                    }

                    axios
                      .post(
                        URLBuilder('/profile/update'),
                        {
                          name: d.name || undefined,
                          bio: d.bio || undefined,
                          country: d.country || undefined,
                          avatarUrl: url || d.avatarUrl || undefined,
                        },
                        {
                          headers: {
                            authorization: `Bearer ${readCookie('token')}`,
                          },
                        }
                      )
                      .then(() => {
                        showNotification({
                          message: 'Профиль обновлен',
                          color: 'green',
                        });
                        formState.resetDirty();
                        setAvatar(undefined);
                        updateState();
                        setIsEdit(false);
                        refetch();
                      })
                      .catch((err) => {
                        notifyAboutError(err);
                        return null;
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  })}
                  className="mt-8 flex flex-row gap-4"
                >
                  <TextInput
                    label="Имя"
                    {...formState.getInputProps('name')}
                    labelProps={{
                      className: clsx({
                        [inter.className]: true,
                      }),
                    }}
                    classNames={{
                      input: 'h-[44px]',
                    }}
                  />
                  <TextInput
                    label="Обо мне"
                    {...formState.getInputProps('bio')}
                    labelProps={{
                      className: clsx({
                        [inter.className]: true,
                      }),
                    }}
                    classNames={{
                      input: 'h-[44px]',
                    }}
                  />
                  <Select
                    data={countries}
                    label="Страна"
                    labelProps={{
                      className: clsx({
                        [inter.className]: true,
                      }),
                    }}
                    placeholder="Выберите страну"
                    {...formState.getInputProps('country')}
                    classNames={{
                      input: 'z-[100] h-[44px]',
                    }}
                    searchable
                  />

                  <Group position="center">
                    <Button
                      type="reset"
                      mt="md"
                      variant="outline"
                      color={'red'}
                      className={clsx(inter.className)}
                      loading={loading}
                      radius="lg"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      mt="md"
                      variant="outline"
                      color={'green'}
                      className={clsx(inter.className)}
                      loading={loading}
                      radius="lg"
                    >
                      Сохранить
                    </Button>
                  </Group>
                </form>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx({
        [inter.className]: true,
      })}
    >
      <MetaTags
        title={`${props.name} | @${props.username} | ${siteName}`}
        description={props.bio || `${props.name} on ${siteName}`}
      />
      <div className="flex flex-row flex-wrap items-center justify-evenly">
        <div className="h-52 w-full bg-[#e0f3ff]"></div>
        <Paper
          withBorder
          p="xl"
          radius={'md'}
          style={{
            flex: 0.3,
          }}
          className="mt-[-50px] lg:min-w-[50%]"
        >
          <div className="flex flex-col items-center justify-center">
            <Avatar
              src={
                props.avatarUrl
                  ? assetURLBuilder(props.avatarUrl)
                  : profileImageRouteGenerator(props.username)
              }
              className="mt-[-90px] h-32 w-32 rounded-full border-8 border-[#e0f3ff]"
              draggable={false}
            />
            <div className="flex w-full flex-col items-center justify-center">
              <div className="mt-8 flex flex-row">
                <h1 className={clsx('text-3xl font-bold', inter.className)}>
                  {props.name}
                </h1>
                {props.verified ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : null}
              </div>
              <span
                className={clsx(
                  'mt-1 text-[13px] leading-[18px] text-gray-400 hover:underline'
                )}
              >
                @{props.username}
              </span>
              <p className="mt-4 text-center text-base font-medium">
                {props.bio}
              </p>
            </div>

            <div className="mt-4 flex w-[90%] flex-row items-center justify-evenly">
              <div className="flex flex-row items-center text-base">
                <IconMapPin className="mr-2 h-5 w-5" />
                {props.country}
              </div>
              <div className="flex flex-row items-center text-base">
                <IconClock className="mr-2 h-5 w-5" />
                На платформе с {dayjs(props.createdAt).format('D MMM, YYYY')}
              </div>
            </div>

            {editable ? (
              <div
                className="mt-3 flex cursor-pointer flex-row items-center justify-center"
                onClick={() => setIsEdit(true)}
              >
                <IconPencil className="h-6 w-6 text-blue-500" />
              </div>
            ) : null}
          </div>
        </Paper>
      </div>
      <Container mb="xl">
        {props.role === 'Freelancer' ? (
          <>
            <Title align="center" className={clsx(inter.className)} mb="md">
              Услуги
            </Title>
            <ServicesTab username={props.username} />
          </>
        ) : (
          <>
            <Title align="center" className={clsx(inter.className)} mb="md">
              Заказы
            </Title>
            <JobPosts username={props.username} />
          </>
        )}
      </Container>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await (await fetch(URLBuilder('/static/profiles'))).json();
  return {
    fallback: 'blocking',
    paths: paths.map((p: { username: string }) => ({
      params: {
        username: p.username,
      },
    })),
  };
};
export const getStaticProps: GetStaticProps<{
  name: string;
  id: string;
  createdAt: Date;
  username: string;
  country: string;
  verified: boolean;
  role: 'Freelancer' | 'Client';
  bio: string;
  avatarUrl: string;
}> = async ({ params }) => {
  const { username } = params!;
  const profile = await (
    await fetch(URLBuilder(`/profile/${username}`))
  ).json();
  return {
    props: {
      ...profile,
    },
  };
};

export default ProfilePage;
