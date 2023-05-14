import { ChatSidebar } from '@components/sidebars/chat';
import { inter } from '@fonts';
import useHydrateUserContext from '@hooks/hydrate/user';
import useIssueNewAuthToken from '@hooks/jwt';
import { useUser } from '@hooks/user';
import { LoadingOverlay } from '@mantine/core';
import {
  fetchChatDetails,
  isChatQuestionsAnswered,
} from '@services/chats.service';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { MetaTags } from '../../../../../apps/ui/meta-tags';
import { readCookie } from '../../../../../apps/utils/cookie';
import { notifyAboutError } from '../../../../../apps/utils/error';

const ChatContainer = dynamic(() => import('@components/chat/container'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
type AnswerType = 'TEXT' | 'MULTIPLE_CHOICE' | 'ATTACHMENT';
export type ChatDetails = {
  Chat: {
    id: string;
  };
  client: {
    id: string;
    name: string;
    username: string;
    avatarUrl: any;
    verified: boolean;
  };
  freelancer: {
    id: string;
    name: string;
    username: string;
    avatarUrl: any;
    verified: boolean;
  };
  id: string;
  status: OrderStatus;
};

export type ChatQuestions = {
  id: string;
  isRequired: boolean;
  question: string;
  answerType: AnswerType;
};

const Chat = () => {
  const [chatConfig, setchatConfig] = useState<ChatDetails>({} as ChatDetails);
  const [questionsAnswered, setQuestionsAnswered] = useState<
    Boolean | undefined
  >(undefined);
  const refetchProfile = useHydrateUserContext();
  useIssueNewAuthToken({
    method: 'replace',
    redirect: true,
    successAction: refetchProfile,
    to: '/auth/sign-in',
  });
  const { isReady, query, asPath, replace } = useRouter();
  const [complete, setCompleted] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const controller = new AbortController();
    const token = readCookie('token');
    if (!token)
      return void replace({
        pathname: '/auth/sign-in',
        query: {
          to: asPath,
        },
      });
    fetchChatDetails(
      query.id as string,
      token,
      (d) => {
        setchatConfig(d);
        if (d.status === 'COMPLETED') {
          setCompleted(true);
        }
      },
      (err) => {
        if (err.code === 'ERR_CANCELED') return;
        notifyAboutError(err);
      },
      controller.signal
    );
    return () => controller.abort();
  }, [isReady, query.id, asPath]);
  const { userType } = useUser();

  useEffect(() => {
    if (!chatConfig.id) return;
    const controller = new AbortController();
    if (!readCookie('token'))
      return void replace({
        pathname: '/auth/sign-in',
        query: {
          to: asPath,
        },
      });
    if (userType === 'Client') {
      isChatQuestionsAnswered(
        chatConfig.Chat.id,
        readCookie('token')!,
        setQuestionsAnswered,
        (err) => {
          notifyAboutError(err);
        },
        controller.signal
      );
    }
    return () => controller.abort();
  }, [chatConfig.id, userType, chatConfig?.Chat?.id, asPath]);

  useEffect(() => {
    if (questionsAnswered === undefined) return;
    if (questionsAnswered === false)
      return void replace({
        pathname: asPath.replace('chat', 'questions'),
        query: {
          to: asPath,
          chatId: chatConfig.Chat.id,
        },
      });
  }, [questionsAnswered]);

  return (
    <div
      className={clsx('p-8', {
        [inter.className]: true,
      })}
    >
      <MetaTags
        title="Чат"
        description="Общайтесь, чтобы успешно завершить этот проект."
      />
      <LoadingOverlay visible={!chatConfig.id} overlayBlur={1} />
      {chatConfig.id ? (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            Chat With{' '}
            <Link
              href={`/profile/${
                userType === 'Client'
                  ? chatConfig.freelancer.username
                  : chatConfig.client.username
              }`}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {userType === 'Client'
                ? chatConfig.freelancer.name
                : chatConfig.client.name}
            </Link>
          </h1>
          <div className="mt-5 flex flex-row">
            <div className="flex-[0.15] rounded-md border-[1px] p-2">
              <ChatSidebar
                client={chatConfig.client}
                freelancer={chatConfig.freelancer}
              />
            </div>
            <div className="ml-1 flex-1 rounded-md border-[1px] p-2">
              <ChatContainer
                orderId={query.id as string}
                chatId={chatConfig.Chat.id}
                completed={complete}
                setCompleted={setCompleted}
                freelancerUsername={chatConfig.freelancer.username}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Chat;
