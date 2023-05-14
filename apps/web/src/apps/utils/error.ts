import { showNotification } from '@mantine/notifications';

export const notifyAboutError = (err: any) => {
  const error = Array.isArray(err?.response?.data?.message)
    ? err?.response?.data?.message[0]
    : err?.response?.data?.message;
  showNotification({
    message: error || err?.response?.data?.message || 'Что-то пошло не так...',
    color: 'red',
  });
};
