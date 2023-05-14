import { Container } from '@components/container';
import { inter } from '@fonts';
import { useSetUser } from '@hooks/user';
import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import axios, { isCancel } from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { RegisterResponse } from '~/types/response/register';

import { routes } from '../../config/routes';
import EmailField from '../../forms/fields/email';
import { createCookie } from '../../utils/cookie';
import { notifyAboutError } from '../../utils/error';
import { profileImageRouteGenerator } from '../../utils/profile';
import { URLBuilder } from '../../utils/url';
import { validateEmail, validatePassword } from '../../utils/validate';

export default function LoginPageContent() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: validateEmail,
      password: validatePassword,
    },
    validateInputOnBlur: true,
  });

  const dispatch = useSetUser();
  const { replace, query } = useRouter();
  function handleSubmit(values: typeof form.values) {
    setLoading(true);
    const { email, password } = values;
    axios
      .post<RegisterResponse>(URLBuilder('/auth/sign-in'), {
        email,
        password,
      })
      .then((d) => d.data)
      .then((d) => {
        dispatch({
          type: 'SET_USER',
          payload: {
            ...d.user,
            avatarUrl: profileImageRouteGenerator(d.user.username),
          },
        });
        createCookie('token', d.token);
        showNotification({
          message: `Здраствуйте, @${upperFirst(d.user.username)}!`,
          color: 'green',
        });
        replace((query.to as string) || routes.profile(d.user.username));
      })
      .catch((err) => {
        if (isCancel(err)) return;
        notifyAboutError(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Container className={clsx('mt-20')} size={500} my={40}>
      <Text
        size="lg"
        weight={500}
        className={clsx('mb-4 text-center text-3xl font-bold', {
          [inter.className]: true,
        })}
      >
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-center text-transparent">
          Freelance Platform
        </span>
      </Text>

      <Paper radius="md" p="xl" withBorder>
        <form onSubmit={form.onSubmit((d) => handleSubmit(d))}>
          <Stack>
            <EmailField required {...form.getInputProps('email')} />

            <PasswordInput
              required
              label="Пароль"
              {...form.getInputProps('password')}
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component={Link}
              href={routes.auth.signUp}
              type="button"
              size="xs"
              className="text-[#3b82f6] hover:underline"
            >
              Ещё нет аккаунта? Зарегестрироваться
            </Anchor>
            <Button
              type="submit"
              fullWidth
              color="black"
              className={clsx('bg-gray-900 hover:bg-black', {
                [inter.className]: true,
              })}
              loading={loading}
            >
              Войти
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
