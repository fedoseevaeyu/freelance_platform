import { inter } from '@fonts';
import type { ButtonProps } from '@mantine/core';
import {
  Button,
  Checkbox,
  Divider,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Stepper,
  Text,
  Textarea as T,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import type { PolymorphicComponentProps } from '@mantine/utils';
import { IconCheck, IconUpload, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import { routes } from '../../config/routes';
import { deliveryDays } from '../../data/delivery_days';
import Textarea from '../../ui/textarea';
import { readCookie } from '../../utils/cookie';
import { notifyAboutError } from '../../utils/error';
import { uploadFile, uploadFiles } from '../../utils/upload';
import { URLBuilder } from '../../utils/url';
import {
  validateDescription,
  validatePrice,
  validateTitle,
} from '../../utils/validate';
import Editor from './components/editor';

function CreateServicePageContent() {
  const formState = useForm<{
    title: string;
    description: string;
    price: string;
    category: string;
    packages?: {
      name: string;
      price: number;
      description: string;
      deliveryDays: number;
    }[];
    tags: string[];
  }>({
    initialValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      packages: [
        {
          name: 'Название',
          price: 0,
          description: '',
          deliveryDays: 0,
        },
      ],
      tags: [],
    },
    validateInputOnBlur: true,
    validate: {
      title: validateTitle,
      description: validateDescription,
      price: validatePrice,
    },
  });
  const { data, refetch } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get(URLBuilder('/categories'));
      return res.data;
    },
  });
  const [features, setFeatures] = useState<
    { id: number; name: string; includedIn: string[] }[]
  >([
    {
      id: 0,
      name: '',
      includedIn: [],
    },
  ]);

  const handlePackageDelete = (index: number) => {
    if (formState.values.packages) {
      const updatedPackages = [...formState.values.packages];
      updatedPackages.splice(index, 1);
      formState.setFieldValue('packages', updatedPackages);
    }
  };

  const [active, setActive] = useState(0);
  const { push } = useRouter();
  const [bannerImage, setBannerImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const NextButton = (
    props: PolymorphicComponentProps<'button', ButtonProps>
  ) =>
    useMemo(
      () => (
        <Button
          onClick={() => setActive((prev) => prev + 1)}
          variant="filled"
          className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
          {...props}
        >
          {props.children || 'Далее'}
        </Button>
      ),
      []
    );
  const [loadingVisible, setLoadingVisible] = useState(false);
  const handleSubmit = async (values: typeof formState.values) => {
    const token = readCookie('token');
    if (!token) {
      showNotification({
        title: 'Истек токен',
        message: 'Пожалуйста войдите',
        color: 'red',
        icon: <IconX />,
      });
    } else {
      setLoadingVisible(true);

      if (!bannerImage) {
        setLoadingVisible(false);
        showNotification({
          title: 'Обложка обязательна',
          message: 'Пожалуйста, загрузите обложку',
          color: 'red',
          icon: <IconX />,
        });
      } else {
        const upload = await uploadFile(
          bannerImage,
          token,
          'bannerImage'
        ).catch((err) => {
          notifyAboutError(err);
        });
        if (!upload) {
          setLoadingVisible(false);
          showNotification({
            title: 'Ошибка',
            message: 'Что-то пошло не так при загруке обложки',
            color: 'red',
            icon: <IconX />,
          });
        } else {
          const { path: bannerImagePath } = upload;
          let imagePaths: string[] = [];
          if (images.length > 0) {
            const uploads = await uploadFiles(
              images,
              token,
              'serviceImages'
            ).catch((err) => {
              notifyAboutError(err);
            });
            if (!uploads) {
              setLoadingVisible(false);
              showNotification({
                title: 'Ошибка',
                message: 'Что-то пошло не так при загрузке изображений...',
                color: 'red',
                icon: <IconX />,
              });
            } else {
              imagePaths = uploads.paths;
            }
          }
          axios
            .post(
              URLBuilder('/services'),
              {
                bannerImage: bannerImagePath,
                category: values.category,
                description: values.description,
                features,
                packages: values.packages!.map((p) => ({
                  ...p,
                  price: Number(p.price),
                })),
                tags: values.tags,
                title: values.title,
                images: imagePaths,
              },
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            )
            .then((d) => d.data)
            .then((d) => {
              push(`${routes.searchCategory(d.category.slug)}?tab=jobs`);
            })
            .catch((err) => {
              notifyAboutError(err);
            })
            .finally(() => {
              setLoadingVisible(false);
            });
        }
      }
    }
  };

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

  return (
    <div className={clsx('flex flex-col p-20')}>
      <LoadingOverlay visible={loadingVisible} />
      <div className="flex flex-row flex-wrap justify-center gap-4  xl:items-center">
        {active === 0 ? (
          <div className={clsx('mr-20')}>
            <Title
              order={1}
              className={clsx('text-center', {
                [inter.className]: true,
              })}
            >
              Создание услуги
            </Title>
            <Text
              className={clsx('text-lg font-bold ', {
                [inter.className]: true,
              })}
            >
              Мы найдем для вашей услуги заказчиков
            </Text>
          </div>
        ) : null}
        <div className={clsx('flex flex-col')}>
          <form onSubmit={formState.onSubmit(handleSubmit)}>
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
              completedIcon={<IconCheck />}
              orientation="horizontal"
            >
              <Stepper.Step label="Описание" allowStepSelect={active > 0}>
                <Paper radius={'md'} p="xl" className={clsx('max-w-3xl ')}>
                  <>
                    <div>
                      <Textarea
                        required
                        id="title"
                        labelString="Заголовок"
                        placeholder="Введите название для вашей услуги"
                        labelProps={{
                          className: clsx({
                            [inter.className]: true,
                          }),
                        }}
                        {...formState.getInputProps('title')}
                        classNames={{
                          input: clsx('border-0', {}),
                        }}
                        minLength={20}
                        maxLength={1000}
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
                      <LoadingOverlay overlayBlur={2} visible={loading} />

                      <Select
                        mt="md"
                        data={
                          data
                            ? data?.map((d) => ({
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
                        getCreateLabel={(query) => `Создать "${query}"`}
                        labelProps={{
                          className: clsx('text-sm font-bold text-[#495057]', {
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
                          className: clsx('text-sm font-bold text-[#495057]', {
                            [inter.className]: true,
                          }),
                        }}
                        placeholder="Введите тэги"
                        searchable
                        clearable
                        creatable={
                          formState.getInputProps('tags').value.length < 5
                        }
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
                        classNames={{
                          input: 'focus:outline-none',
                        }}
                      />
                    </div>
                    <Group position="center" mt="xl">
                      <Button
                        variant="default"
                        disabled
                        className="cursor-not-allowed"
                      >
                        Назад
                      </Button>
                      <NextButton />
                    </Group>
                  </>
                </Paper>
              </Stepper.Step>
              <Stepper.Step label="Особенности">
                <div className="mt-3 flex w-full flex-col items-center   justify-center gap-4">
                  <Text
                    align="center"
                    className={clsx('text-center text-lg font-bold', {
                      [inter.className]: true,
                    })}
                  >
                    Перечислите особенности для Ваших тарифов.
                  </Text>
                  <Text
                    align="center"
                    style={{ maxWidth: '750px' }}
                    className={clsx('text-sm text-[#6c757d]', {
                      [inter.className]: true,
                    })}
                  >
                    Выделите Ваши конкретные особенности и навыки, которые
                    хотите предложить заказчикам в рамках данной услуги. Позже
                    вы сможете указать доступность тех или иных навыков для
                    каждого отдельного тарифа. Например, вы можете предложить
                    для более дорогого тарифа сопровождение 3 месяца, а для
                    более дешевого - 1 месяц.
                  </Text>
                  <Text
                    align="center"
                    style={{ maxWidth: '750px' }}
                    className={clsx('text-sm text-[#6c757d]', {
                      [inter.className]: true,
                    })}
                  >
                    Вы должны указать хотя бы одну особенность
                  </Text>
                  <div className="mt-2 w-full">
                    {features.map((feature, id) => (
                      <div className="my-2 flex w-full flex-row gap-2" key={id}>
                        <TextInput
                          value={feature.name}
                          onChange={(e) => {
                            setFeatures(
                              features.map((f, index) =>
                                index === id
                                  ? {
                                      id: f.id,
                                      name: e.target.value,
                                      includedIn: f.includedIn,
                                    }
                                  : f
                              )
                            );
                          }}
                          className="w-full"
                        />
                        <Button
                          variant="filled"
                          className="bg-[#e53935] hover:bg-[#d32f2f]"
                          onClick={() => {
                            setFeatures(
                              features.filter((f, index) => index !== id)
                            );
                          }}
                        >
                          <IconX />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-10">
                  <Group position="center">
                    <Button
                      onClick={() => setActive(0)}
                      variant="filled"
                      className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                    >
                      Назад
                    </Button>
                    <Button
                      color="purple"
                      className={clsx('bg-purple-600 hover:bg-purple-700')}
                      onClick={() => {
                        setFeatures((f) => [
                          ...f,
                          { id: features.length, name: '', includedIn: [] },
                        ]);
                      }}
                    >
                      Добавить особенность
                    </Button>
                    <Button
                      onClick={() => {
                        if (features.length === 0) {
                          showNotification({
                            color: 'red',
                            message: 'Вы должны добавить хотя бы 1 особенность',
                          });
                        }
                        setActive(2);
                      }}
                      variant="filled"
                      className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                    >
                      Далее
                    </Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step label="Тарифы" allowStepSelect={active > 1}>
                <Text
                  align="center"
                  className={clsx('text-center text-lg font-bold', {
                    [inter.className]: true,
                  })}
                >
                  Расскажите о Ваших тарифах.
                </Text>
                <Text
                  align="center"
                  style={{ maxWidth: '750px' }}
                  className={clsx('text-center text-sm text-[#6c757d]', {
                    [inter.className]: true,
                  })}
                >
                  Придумайте любое название тарифа, опишите словами, что в него
                  входит, входит, а также укажите, сколько времени вам
                  необходимо на услуги по данному тарифу. Вы должны заполнить
                  хотя бы один тариф.
                </Text>
                <div className="mt-8 flex flex-row gap-4">
                  <SimpleGrid
                    cols={
                      // eslint-disable-next-line no-nested-ternary
                      formState.values.packages!.length === 1
                        ? 1
                        : formState.values.packages!.length === 2
                        ? 2
                        : 3
                    }
                    className="w-full"
                  >
                    {formState.values.packages?.map((p, index) => (
                      <div
                        className={clsx(
                          'flex w-full flex-col border-l-[1px] border-gray-400 pl-3'
                        )}
                        key={index}
                      >
                        <Text
                          className={clsx('text-center text-sm font-bold', {
                            [inter.className]: true,
                          })}
                        >
                          {formState.values.packages![index].name}
                        </Text>
                        <TextInput
                          placeholder="Название тарифа"
                          required
                          {...formState.getInputProps(`packages.${index}.name`)}
                        />
                        <Divider className={'my-2'} />
                        <T
                          placeholder="Описание тарифа"
                          required
                          {...formState.getInputProps(
                            `packages.${index}.description`
                          )}
                        />
                        <Select
                          label="Срок выполнения"
                          {...formState.getInputProps(
                            `packages.${index}.deliveryDays`
                          )}
                          required
                          data={deliveryDays as any}
                          placeholder="Выберите срок выполнения"
                        />
                        <Text
                          className={clsx(
                            'mt-2 text-center text-sm font-bold',
                            {
                              [inter.className]: true,
                            }
                          )}
                        >
                          Что включено?
                        </Text>
                        {features.map((feature, id) => (
                          <div
                            className="my-2 flex w-full flex-row gap-2"
                            key={id}
                          >
                            <Checkbox
                              checked={feature.includedIn?.includes(p.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (!feature.includedIn?.includes(p.name)) {
                                    setFeatures((prev) =>
                                      prev.map((f) =>
                                        f.name === feature.name
                                          ? {
                                              ...f,
                                              includedIn: [
                                                ...f.includedIn,
                                                p.name,
                                              ],
                                            }
                                          : f
                                      )
                                    );
                                  }
                                }
                                if (!e.target.checked) {
                                  setFeatures((prev) =>
                                    prev.map((f) =>
                                      f.name === feature.name
                                        ? {
                                            ...f,
                                            includedIn: f.includedIn.filter(
                                              (i) => i !== p.name
                                            ),
                                          }
                                        : f
                                    )
                                  );
                                }
                                console.log(feature);
                              }}
                              className="w-full"
                              label={feature.name}
                            />
                          </div>
                        ))}
                        <TextInput
                          placeholder="Цена"
                          required
                          label="Цена в рублях (₽)"
                          {...formState.getInputProps(
                            `packages.${index}.price`
                          )}
                          type="number"
                        />
                        <div className="mt-3 flex items-center justify-center">
                          <Button
                            variant="filled"
                            className="bg-[#e53935] hover:bg-[#d32f2f]"
                            style={{ maxWidth: '50%' }}
                            onClick={() => handlePackageDelete(index)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </SimpleGrid>
                  <div className="border-l-[1px] border-gray-400 pl-3"></div>
                </div>
                <div className="mt-4 flex flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => setActive(1)}
                    variant="filled"
                    className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                  >
                    Назад
                  </Button>
                  <Button
                    color="purple"
                    className={clsx('bg-purple-600 hover:bg-purple-700')}
                    onClick={() => {
                      formState.insertListItem('packages', {
                        name: 'Тариф',
                        price: 0,
                        description: '',
                      });
                    }}
                    disabled={formState.values.packages!.length === 3}
                  >
                    Добавить тариф
                  </Button>
                  <Button
                    onClick={() => {
                      if (formState.values.packages!.length === 0) {
                        showNotification({
                          color: 'red',
                          message: 'Вы должны заполнить хотя бы один тариф!',
                        });
                      }
                      setActive(3);
                    }}
                    variant="filled"
                    className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                  >
                    Далее
                  </Button>
                </div>
              </Stepper.Step>
              <Stepper.Step label="Описание" allowStepSelect={active > 2}>
                <Editor
                  onSubmit={(d) => {
                    /* if (d.length < 100) {
                      showNotification({
                        color: 'red',
                        message: 'Описание должно быть не менее 100 символов',
                      });
                    } */
                    formState.setFieldValue('description', d);
                    setActive((o) => o + 1);
                  }}
                  setActive={setActive}
                />
              </Stepper.Step>
              <Stepper.Step label={'Вложения'}>
                <Text
                  align="center"
                  className={clsx('mt-4 text-lg font-bold text-black', {
                    [inter.className]: true,
                  })}
                >
                  Добавьте несколько изображений к вашей услуге, чтобы сделать
                  её более привлекательной и выделяющейся.
                </Text>
                <div className="flex flex-row flex-wrap gap-5">
                  <FileButton
                    onChange={(d) => {
                      if (d) {
                        if (d.type.includes('image')) {
                          setBannerImage(d);
                        }
                      }
                    }}
                  >
                    {(props) => (
                      <>
                        {bannerImage ? (
                          <div
                            className={clsx(
                              'flex w-full flex-col items-center justify-center gap-4 pt-[12px]'
                            )}
                          >
                            <Image
                              className="cursor-pointer rounded-md"
                              src={URL.createObjectURL(bannerImage)}
                              onClick={props.onClick}
                              placeholder="/images/fallback.webp"
                              classNames={{
                                image: 'object-cover max-h-[512px] rounded-md',
                              }}
                              alt="Обложка"
                            />
                            <span
                              className={clsx('cursor-pointer  text-sm', {
                                [inter.className]: true,
                              })}
                            >
                              Обложка
                            </span>
                          </div>
                        ) : (
                          <div className="mt-4 flex w-full flex-col items-center justify-center">
                            <Paper
                              withBorder
                              p="md"
                              radius="md"
                              mb="md"
                              onClick={props.onClick}
                              className="max-w-fit cursor-pointer"
                            >
                              <div className="flex flex-col items-center justify-center">
                                <IconUpload className="h-16 w-16 text-gray-500" />
                                <Text className="text-gray-500">
                                  Загрузить обложку{' '}
                                </Text>
                                <p className="text-gray-500">
                                  Это изображение будет показано на странице
                                  поиска услуг.
                                </p>
                              </div>
                            </Paper>
                          </div>
                        )}
                      </>
                    )}
                  </FileButton>
                </div>
                <div className="flex flex-row flex-wrap gap-4">
                  {images.map((i, index) => (
                    <div
                      className="flex flex-col items-center justify-center gap-2"
                      key={index}
                    >
                      <div className="relative">
                        <Image
                          className="cursor-pointer rounded-md"
                          width={100}
                          height={100}
                          src={URL.createObjectURL(i)}
                          onClick={() => {
                            setImages(images.filter((_, i2) => i2 !== index));
                          }}
                          classNames={{
                            image: 'object-cover  rounded-md',
                          }}
                          alt="Изображение"
                        />
                        <div className="absolute right-0 top-0">
                          <Button
                            onClick={() => {
                              setImages(images.filter((_, i2) => i2 !== index));
                            }}
                            variant="filled"
                            compact
                            className={clsx(
                              'rounded-full bg-red-500 p-0 hover:bg-red-500/90'
                            )}
                          >
                            <IconX />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-8 flex w-full flex-col items-center justify-center">
                    <FileButton
                      onChange={(i) => {
                        setImages((im) => [...im, ...i]);
                      }}
                      multiple
                    >
                      {(props) => (
                        <>
                          <Paper
                            withBorder
                            p="md"
                            radius="md"
                            onClick={props.onClick}
                            className="max-w-fit cursor-pointer"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <IconUpload className="h-16 w-16 text-gray-500" />
                              <Text className="text-gray-500">
                                Загрузить портфолио{' '}
                              </Text>
                              <p className="text-gray-500">
                                Эти изображения будут показаны в виде слайд-шоу
                                на странице вашей услуги
                              </p>
                            </div>
                          </Paper>
                        </>
                      )}
                    </FileButton>
                  </div>
                </div>
                <Group position="center" mt="md">
                  <Button
                    onClick={() => {
                      setActive((o) => o - 1);
                    }}
                    variant="filled"
                    className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
                  >
                    Назад
                  </Button>
                  <NextButton
                    type="submit"
                    className={clsx('bg-green-500 hover:bg-green-500/90')}
                    onClick={() => {
                      const error =
                        formState.errors[Object.keys(formState.errors)[0]];
                      if (error) {
                        showNotification({
                          message: error,
                          color: 'red',
                        });
                      }
                    }}
                  >
                    Создать
                  </NextButton>
                </Group>
              </Stepper.Step>
            </Stepper>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateServicePageContent;
