import { inter } from '@fonts';
import {
  Button,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconFileText, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { routes } from '../../config/routes';
import Textarea from '../../ui/textarea';
import { readCookie } from '../../utils/cookie';
import { notifyAboutError } from '../../utils/error';
import { uploadFiles } from '../../utils/upload';
import { URLBuilder } from '../../utils/url';
import { validateDescription, validateTitle } from '../../utils/validate';

dayjs.locale(ru);

function CreateJobPostPageContent() {
  const formState = useForm({
    initialValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      tags: [],
    },
    validateInputOnBlur: true,
    validate: {
      title: validateTitle,
      description: validateDescription,
    },
  });
  const { data: categoriesOptions, refetch } = useQuery<
    { id: string; name: string }[]
  >({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get(URLBuilder('/categories'));
      return res.data;
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [active, setActive] = useState(0);
  const [deadline, setDeadline] = useState<Date>();
  const { push } = useRouter();
  const goBack = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [loading, setLoading] = useState(false);
  const {
    data: tagsData,
    isLoading: tagsLoading,
    refetch: tagsRefetch,
  } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await axios.get(URLBuilder('/tags'));
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

  const handleSubmit = async (data: typeof formState.values) => {
    const { category, description, price, title, tags } = data;
    const token = readCookie('token');
    if (token) {
      setLoading(true);
      let urls: string[] = [];
      if (files.length > 0) {
        const uploadData = await uploadFiles(files, token).catch((err) => {
          notifyAboutError(err);
          setLoading(false);
          return null;
        });
        if (uploadData === null) return;
        urls = uploadData.paths;
      }
      await axios
        .post(
          URLBuilder('/job-post'),
          {
            title,
            description,
            price: Number(price),
            category,
            tags,
            images: urls.length > 0 ? urls : undefined,
            deadline: (deadline as unknown as Date)?.toISOString(),
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )
        .then((d) => d.data)
        .then((d) => {
          showNotification({
            message: 'Заказ создан!',
            color: 'green',
          });
          return push(`${routes.searchCategory(d.category.slug)}?tab=services`);
        })
        .catch((err) => {
          notifyAboutError(err);
        })
        .finally(() => setLoading(false));
    } else {
      showNotification({
        message: 'Сессия истекла.',
        color: 'red',
      });
    }
  };

  return (
    <div className={clsx('flex flex-col items-center p-20')}>
      <div className="flex flex-row flex-wrap gap-4 xl:items-center xl:justify-center">
        <div className={clsx('mr-20')}>
          <Title order={1} className={clsx(inter.className)}>
            Давайте выполним Вашу работу!
          </Title>
          <Text
            className={clsx('text-lg font-bold ', {
              [inter.className]: true,
            })}
          >
            Мы постараемся найти наиболее подходящих разработчиков.
          </Text>
        </div>
        <div className={clsx('flex flex-col')}>
          <form onSubmit={formState.onSubmit((d) => handleSubmit(d))}>
            <Stepper
              active={active}
              color="green"
              onStepClick={setActive}
              breakpoint="sm"
              classNames={{
                stepLabel: clsx('', {
                  [inter.className]: true,
                }),
                stepDescription: clsx('', {
                  [inter.className]: true,
                }),
              }}
            >
              <Stepper.Step
                label="Описание"
                description="Опишите ваш заказ"
                allowStepSelect={active > 0}
              >
                <Paper radius={'md'} p="xl" className={clsx('max-w-3xl ')}>
                  <>
                    <div>
                      <Textarea
                        required
                        id="title"
                        labelString="Заголовок"
                        placeholder="Введите заголовок заказа"
                        labelProps={{
                          className: clsx({
                            [inter.className]: true,
                          }),
                        }}
                        {...formState.getInputProps('title')}
                        classNames={{
                          input: clsx('border-0 text-base', {}),
                        }}
                        minLength={20}
                        maxLength={100}
                        wordsComponent={
                          <span
                            className={clsx('my-2 ml-auto pr-3 text-sm ', {
                              'text-[#6c757d]':
                                formState.values.title.length < 20,
                              'text-[#28a745]':
                                formState.values.title.length >= 20 &&
                                formState.values.title.length < 100,
                            })}
                          >
                            {formState.values.title.length}/100
                          </span>
                        }
                      />
                    </div>
                    <div>
                      <Textarea
                        required
                        id="description"
                        labelString="Описание"
                        placeholder="Введите описание заказа"
                        labelProps={{
                          className: clsx({
                            [inter.className]: true,
                          }),
                        }}
                        {...formState.getInputProps('description')}
                        classNames={{
                          input: clsx('border-0 text-base', {}),
                        }}
                        minLength={20}
                        maxLength={1000}
                        wordsComponent={
                          <div className="flex flex-col">
                            <span
                              className={clsx('my-2 ml-auto pr-3 text-sm', {
                                'text-[#6c757d]':
                                  formState.values.description.length < 100,
                                'text-[#28a745]':
                                  formState.values.description.length >= 100 &&
                                  formState.values.description.length < 1000,
                              })}
                            >
                              {formState.values.description.length}/1000
                            </span>
                            {files.length > 0 ? (
                              <div className="m-2 flex flex-row flex-wrap gap-2">
                                {files.map((image) => (
                                  <div className="relative" key={image.name}>
                                    {image.type.split('/')[0] === 'image' ? (
                                      <>
                                        <Image
                                          src={URL.createObjectURL(image)}
                                          alt="image"
                                          width={100}
                                          height={100}
                                          className={clsx('rounded-md')}
                                        />
                                        <div
                                          className={clsx(
                                            'absolute right-0 top-0 cursor-pointer rounded-full bg-[#e53935]'
                                          )}
                                          onClick={() => {
                                            setFiles((prev) =>
                                              prev.filter(
                                                (prevImage) =>
                                                  prevImage !== image
                                              )
                                            );
                                          }}
                                        >
                                          <IconX
                                            className={clsx('text-white')}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        {image.type.split('/')[0] ===
                                        'video' ? (
                                          <>
                                            <video
                                              src={URL.createObjectURL(image)}
                                              width={100}
                                              height={100}
                                              controls
                                              className={clsx('rounded-md')}
                                            />
                                            <div
                                              className={clsx(
                                                'absolute right-0 top-0 cursor-pointer rounded-full bg-[#e53935]'
                                              )}
                                              onClick={() => {
                                                setFiles((prev) =>
                                                  prev.filter(
                                                    (prevImage) =>
                                                      prevImage !== image
                                                  )
                                                );
                                              }}
                                            >
                                              <IconX
                                                className={clsx('text-white')}
                                              />
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex flex-col items-center justify-center">
                                            <IconFileText
                                              className={clsx(
                                                'text-4xl text-[#6c757d]'
                                              )}
                                            />
                                            <span className="text-sm text-[#6c757d]">
                                              {image.name}
                                            </span>
                                            <div
                                              className={clsx(
                                                'absolute right-0 top-0 cursor-pointer rounded-full bg-[#e53935]'
                                              )}
                                              onClick={() => {
                                                setFiles((prev) =>
                                                  prev.filter(
                                                    (prevImage) =>
                                                      prevImage !== image
                                                  )
                                                );
                                              }}
                                            >
                                              <IconX
                                                className={clsx('text-white')}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        }
                      />
                    </div>
                    <FileButton
                      onChange={(d) => {
                        if (!d) return;
                        const filesToSet: File[] = [];
                        // max size: 10mb
                        const maxSize = 10 * 1024 * 1024;
                        d.forEach((f) => {
                          if (f.size > maxSize) {
                            showNotification({
                              color: 'red',
                              message: `Размер файла ${f.name} слишком большой. Максимум - 10 мб`,
                            });
                          } else {
                            filesToSet.push(f);
                          }
                        });
                        setFiles((prev) => [...prev, ...filesToSet]);
                      }}
                      accept="image*"
                      multiple
                    >
                      {(props) => (
                        <Button
                          disabled={files.length >= 5}
                          {...props}
                          className={clsx(
                            'mt-4 bg-[#1e88e5] hover:bg-[#1976d2]',
                            {
                              [inter.className]: true,
                            }
                          )}
                        >
                          Прикрепить файлы
                        </Button>
                      )}
                    </FileButton>

                    <div>
                      <LoadingOverlay overlayBlur={2} visible={loading} />

                      <Select
                        mt="md"
                        data={
                          categoriesOptions
                            ? categoriesOptions?.map((d) => ({
                                value: d.id,
                                label: d.name,
                              }))
                            : []
                        }
                        {...formState.getInputProps('category')}
                        label="Категория"
                        placeholder="Выберите категорию"
                        searchable
                        clearable
                        required
                        creatable
                        getCreateLabel={(query) =>
                          `Создать категорию "${query}"`
                        }
                        labelProps={{
                          className: clsx('text-sm font-bold ', {
                            [inter.className]: true,
                          }),
                        }}
                        onCreate={(query) => {
                          setLoading(true);
                          axios
                            .post(
                              URLBuilder(`/categories/create`),
                              {
                                name: query,
                              },
                              {
                                headers: {
                                  authorization: `Bearer ${readCookie(
                                    'token'
                                  )}`,
                                },
                              }
                            )
                            .then(() => refetch().then(() => setLoading(false)))
                            .catch((err) => {
                              notifyAboutError(err);
                              setLoading(false);
                            });
                          return null;
                        }}
                      />
                    </div>
                    <div>
                      <LoadingOverlay overlayBlur={2} visible={tagsLoading} />
                      <MultiSelect
                        mt="md"
                        data={
                          tagsData
                            ? tagsData.map((d) => ({
                                value: d.id,
                                label: d.name,
                              }))
                            : []
                        }
                        {...formState.getInputProps('tags')}
                        label="Тэги"
                        labelProps={{
                          className: clsx('text-sm font-bold ', {
                            [inter.className]: true,
                          }),
                        }}
                        placeholder="Введите тэги"
                        searchable
                        clearable
                        creatable={formState.values.tags.length < 5}
                        getCreateLabel={(query) => `+ ${query}`}
                        onCreate={(query) => {
                          setLoading(true);
                          axios
                            .post(
                              URLBuilder(`/tags/create`),
                              {
                                name: query,
                              },
                              {
                                headers: {
                                  authorization: `Bearer ${readCookie(
                                    'token'
                                  )}`,
                                },
                              }
                            )
                            .then(() =>
                              tagsRefetch().then(() => setLoading(false))
                            )
                            .catch((err) => {
                              notifyAboutError(err);
                            });
                          setLoading(false);
                          return null;
                        }}
                        maxSelectedValues={5}
                      />
                    </div>
                    <Group position="center" mt="xl">
                      <Button variant="default" disabled>
                        Назад
                      </Button>
                      <Button
                        onClick={() => setActive(1)}
                        variant="filled"
                        className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                      >
                        Далее
                      </Button>
                    </Group>
                  </>
                </Paper>
              </Stepper.Step>
              <Stepper.Step
                label="Дедлайн и бюджет"
                description="Установите бюджет и дедлайн для вашего заказа"
                allowStepSelect={active > 1}
              >
                <Paper
                  radius={'md'}
                  p="xl"
                  className={clsx('max-w-3xl lg:min-w-[30vw]')}
                >
                  <>
                    <Text
                      className={clsx('py-2 text-sm  font-bold', {
                        [inter.className]: true,
                      })}
                    >
                      Дедлайн (опционально)
                    </Text>
                    <DatePicker
                      locale="ru"
                      onChange={(d) => {
                        if (d) setDeadline(d);
                      }}
                      value={deadline}
                      excludeDate={(date) =>
                        date.getMonth() < new Date().getMonth() &&
                        date.getFullYear() <= new Date().getFullYear()
                      }
                    />
                    <Text
                      className={clsx('mt-5 py-2  text-sm font-bold', {
                        [inter.className]: true,
                      })}
                    >
                      Бюджет (опционально)
                    </Text>
                    <NumberInput
                      {...formState.getInputProps('price')}
                      labelProps={{
                        className: clsx({
                          [inter.className]: true,
                        }),
                      }}
                      min={1}
                      icon={'₽ '}
                    />
                    <Group position="center" mt="xl">
                      <Button
                        variant="default"
                        loading={loading}
                        onClick={goBack}
                      >
                        Назад
                      </Button>
                      <Button
                        type={'submit'}
                        variant="filled"
                        loading={loading}
                        className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                      >
                        Опубликовать
                      </Button>
                    </Group>
                  </>
                </Paper>
              </Stepper.Step>
            </Stepper>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJobPostPageContent;
