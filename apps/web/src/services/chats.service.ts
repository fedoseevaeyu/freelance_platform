import type { MessageModelType } from '@components/chat/container';
import type { AxiosError } from 'axios';
import axios, { isCancel } from 'axios';

import { URLBuilder } from '../apps/utils/url';
import type {
  ChatDetails,
  ChatQuestions,
} from '../pages/profile/[username]/order/[id]/chat';

export async function fetchChatDetails(
  orderId: string,
  token: string,
  successHandler: (d: ChatDetails) => void,
  failureHandler: (err: AxiosError) => void,
  signal: AbortSignal
) {
  return axios
    .get<ChatDetails>(URLBuilder(`/chat/${orderId}`), {
      headers: {
        authorization: `Bearer ${token}`,
      },
      signal,
    })
    .then((d) => d.data)
    .then(successHandler)
    .catch((err) => {
      if (isCancel(err)) return;
      failureHandler(err);
    });
}

export async function isChatQuestionsAnswered(
  chatId: string,
  token: string,
  successHandler: (d: boolean) => void,
  failureHandler: (err: AxiosError) => void,
  signal: AbortSignal
) {
  return axios
    .get<{ questionAnswered: boolean }>(URLBuilder(`/chat/${chatId}/info`), {
      headers: {
        authorization: `Bearer ${token}`,
      },
      signal,
    })
    .then((d) => d.data.questionAnswered)
    .then(successHandler)
    .catch((err) => {
      if (isCancel(err)) return;
      failureHandler(err);
    });
}

export async function fetchChatQuestions(
  chatId: string,
  token: string,
  successHandler: (d: ChatQuestions[]) => void,
  failureHandler: (err: AxiosError) => void,
  signal: AbortSignal
) {
  return axios
    .get<ChatQuestions[]>(URLBuilder(`/chat/${chatId}/questions`), {
      headers: {
        authorization: `Bearer ${token}`,
      },
      signal,
    })
    .then((d) => d.data)
    .then(successHandler)
    .catch((err) => {
      if (isCancel(err)) return;
      failureHandler(err);
    });
}

export async function fetchChatMessagesCount(
  chatId: string,
  token: string,
  successHandler: (d: number) => void,
  failureHandler: (err: AxiosError) => void,
  signal: AbortSignal
) {
  return axios
    .get<{ count: number }>(URLBuilder(`/messages/${chatId}/count`), {
      headers: {
        authorization: `Bearer ${token}`,
      },
      signal,
    })
    .then((d) => d.data.count)
    .then(successHandler)
    .catch((err) => {
      if (isCancel(err)) return;
      failureHandler(err);
    });
}

export async function fetchChatMessages(
  chatId: string,
  token: string,
  successHandler: (d: { next?: number; messages: MessageModelType[] }) => void,
  failureHandler: (err: AxiosError) => void,
  skip?: number,
  take?: number,
  signal?: AbortSignal
) {
  return axios
    .get<{ next?: number; messages: MessageModelType[] }>(
      URLBuilder(
        skip
          ? take
            ? `/messages/${chatId}?take=${take}&skip=${skip}`
            : `/messages/${chatId}?skip=${skip}`
          : `/messages/${chatId}`
      ),
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        signal,
      }
    )
    .then((d) => d.data)
    .then(successHandler)
    .catch((err) => {
      if (isCancel(err)) return;
      failureHandler(err);
    });
}
