import { Container } from '@components/container';
import { inter } from '@fonts';
import useHydrateUserContext from '@hooks/hydrate/user';
import { useSetUser } from '@hooks/user';
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { RegisterResponse } from '~/types/response/register';

import { routes } from '../../config/routes';
import { countries } from '../../data';
import EmailField from '../../forms/fields/email';
import { createCookie } from '../../utils/cookie';
import { notifyAboutError } from '../../utils/error';
import { profileImageRouteGenerator } from '../../utils/profile';
import { URLBuilder } from '../../utils/url';
import { validateEmail, validatePassword } from '../../utils/validate';

export default function RegisterPageContent() {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
      username: '',
      confirmPass: '',
      country: '',
    },

    validate: {
      email: validateEmail,
      password: validatePassword,
      confirmPass: (val, values) =>
        val === values.password ? null : 'Пароли не совпадают',
    },
    validateInputOnBlur: true,
  });

  const dispatch = useSetUser();
  const { replace } = useRouter();
  const [userType, setUserType] = useState<'Client' | 'Freelancer' | ''>('');
  const [checked, setChecked] = useState<'Client' | 'Freelancer' | ''>('');
  const [loading, setLoading] = useState(false);
  useHydrateUserContext();
  function handleSubmit(values: typeof form.values) {
    setLoading(true);
    const { confirmPass, email, name, password, username, country } = values;
    axios
      .post<RegisterResponse>(URLBuilder(`/auth/register`), {
        confirmPassword: confirmPass,
        email,
        name,
        password,
        username,
        country,
        role: userType,
      })
      .then((d) => d.data)
      .then((d) => {
        dispatch({
          type: 'SET_USER',
          payload: {
            ...d.user,
            avatarUrl: profileImageRouteGenerator(d.user.username),
            userType: userType as 'Client' | 'Freelancer',
          },
        });
        createCookie('token', d.token);
        showNotification({
          message: 'Привествуем вас на платформе!',
          color: 'green',
        });
        replace(routes.profile(d.user.username));
      })
      .catch((err) => {
        notifyAboutError(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Container className={clsx('mt-20')} my={40}>
      {!userType ? (
        <>
          <Text
            size="lg"
            weight={500}
            className={clsx('mb-4 text-center text-2xl font-bold', {
              [inter.className]: true,
            })}
          >
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-center text-transparent">
              Кто вы?
            </span>{' '}
          </Text>

          <Paper radius="md" p="xl">
            <Group position="center" className="flex flex-col flex-wrap gap-4">
              <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                <Paper
                  radius={'md'}
                  withBorder
                  p="xl"
                  className={clsx(
                    'cursor-pointer text-center text-lg hover:border-[1px] hover:border-pink-400',
                    {
                      [inter.className]: true,
                      'border-[1px] !border-pink-400': checked === 'Client',
                    }
                  )}
                  onClick={() => {
                    setChecked('Client');
                  }}
                >
                  Я заказчик
                </Paper>
                <Paper
                  radius={'md'}
                  withBorder
                  p="xl"
                  className={clsx(
                    'cursor-pointer text-center text-lg hover:border-[1px] hover:border-pink-400',
                    {
                      [inter.className]: true,
                      'border-[1px] !border-pink-400': checked === 'Freelancer',
                    }
                  )}
                  onClick={() => {
                    setChecked('Freelancer');
                  }}
                >
                  Я разработчик
                </Paper>
              </div>
              <Button
                variant="filled"
                className={clsx('bg-pink-400 hover:bg-pink-500')}
                disabled={checked === ''}
                onClick={() => {
                  setUserType(checked);
                }}
              >
                Подтвердить
              </Button>

              <Anchor
                component={Link}
                href={routes.auth.signIn}
                type="button"
                size="xs"
                className="text-[#3b82f6] hover:underline"
              >
                Уже есть аккаунт? Войти
              </Anchor>
            </Group>
          </Paper>
        </>
      ) : (
        <>
          <Text
            size="lg"
            weight={500}
            className={clsx('mb-4 text-center text-2xl font-bold', {
              [inter.className]: true,
            })}
          >
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-center text-transparent">
              Freelance Platform
            </span>
          </Text>

          <Paper radius="md" p="xl" withBorder>
            <Text
              className={clsx('mb-4 text-center text-2xl font-bold', {
                [inter.className]: true,
              })}
            >
              {userType === 'Client'
                ? 'Наймите лучших специалистов'
                : 'Начните зарабатывать деньги'}
            </Text>
            <form onSubmit={form.onSubmit((d) => handleSubmit(d))}>
              <Stack>
                <TextInput
                  label="Имя"
                  placeholder="Ваше имя"
                  required
                  {...form.getInputProps('name')}
                />

                <EmailField required {...form.getInputProps('email')} />

                <TextInput
                  required
                  label="Имя пользователя"
                  placeholder="super123"
                  {...form.getInputProps('username')}
                />

                <PasswordInput
                  required
                  label="Пароль"
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  required
                  label="Подтвердите пароль"
                  {...form.getInputProps('confirmPass')}
                />
                <Select
                  data={countries}
                  required
                  label="Страна"
                  searchable
                  placeholder="Выберите вашу страну"
                  {...form.getInputProps('country')}
                  maxDropdownHeight={280}
                />

                <Checkbox
                  label={
                    <>
                      Я согласен с{' '}
                      <Link
                        href={routes.agreement}
                        className={'text-[#3b82f6] hover:underline'}
                      >
                        Пользовательским соглашением
                      </Link>
                    </>
                  }
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue('terms', event.currentTarget.checked)
                  }
                />
              </Stack>

              <Group position="apart" mt="xl">
                <Anchor
                  component={Link}
                  href={routes.auth.signIn}
                  type="button"
                  size="xs"
                  className="text-[#3b82f6] hover:underline"
                >
                  Уже есть аккаунт? Войти
                </Anchor>
                <Button
                  type="submit"
                  fullWidth
                  color="black"
                  className={clsx(
                    'mb-2 rounded-lg bg-purple-700 px-5 py-2 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none',
                    {
                      [inter.className]: true,
                    }
                  )}
                  disabled={!form.values.terms}
                  loading={loading}
                >
                  Загерестрироваться
                </Button>
              </Group>
            </form>
          </Paper>
        </>
      )}
    </Container>
  );
}
