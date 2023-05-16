import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import * as fs from 'fs';
faker.locale = 'ru';

const prisma = new PrismaClient();

const getDeadline = () => {
  const currentDate = new Date();
  const minDays = 5;
  const maxDays = 30;
  const randomDays =
    Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  return new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
};

const config = {
  categories: [
    {
      name: 'Веб-разработка',
      slug: 'web-development',
      tags: [
        { name: 'HTML', slug: 'html' },
        { name: 'CSS', slug: 'css' },
        { name: 'JavaScript', slug: 'javascript' },
        { name: 'PHP', slug: 'php' },
        { name: 'Python', slug: 'python' },
        { name: 'Ruby', slug: 'ruby' },
        { name: 'Java', slug: 'java' },
        { name: 'C#', slug: 'csharp' },
        { name: 'Node.js', slug: 'node-js' },
        { name: 'React.js', slug: 'react-js' },
        { name: 'Angular', slug: 'angular' },
        { name: 'Vue.js', slug: 'vue-js' },
        { name: 'Express.js', slug: 'express-js' },
        { name: 'Django', slug: 'django' },
        { name: 'Ruby on Rails', slug: 'ruby-on-rails' },
        { name: 'ASP.NET', slug: 'asp-net' },
        { name: 'Laravel', slug: 'laravel' },
        { name: 'WordPress', slug: 'wordpress' },
        { name: 'Joomla', slug: 'joomla' },
        { name: 'Drupal', slug: 'drupal' },
      ],
      services: [
        {
          title: 'Разработка сайта с адаптивным и мобильным дизайном',
          description:
            'Вам нужен сайт, который будет выглядеть превосходно на всех устройствах, включая настольные компьютеры, планшеты и смартфоны? Я могу помочь вам создать адаптивный и мобильный дизайн для вашего сайта, который будет идеально работать и выглядеть великолепно на любом устройстве.',
          price: 5000,
          duration: 10,
          includes: [
            'Дизайн адаптивного и мобильного интерфейса',
            'Верстка и оживление интерфейса',
            'Программирование функциональности и взаимодействия',
            'SEO оптимизация для повышения видимости в поисковых системах',
          ],
        },
        {
          title: 'Разработка веб-приложения с адаптивным и мобильным дизайном',
          description:
            'Мы предлагаем создание динамических веб-приложений, которые будут работать на любых устройствах и обеспечат отличный пользовательский опыт. Наша команда разработчиков специализируется на использовании современных JavaScript-фреймворков для достижения максимальной эффективности и функциональности.',
          price: 10000,
          duration: 20,
          includes: [
            'Анализ и проектирование функциональности',
            'Разработка адаптивного и мобильного дизайна',
            'Разработка фронтенда с использованием современных JavaScript-фреймворков',
            'Разработка бэкенда для обеспечения функциональности и взаимодействия с базой данных',
            'Тестирование и отладка для гарантированной работоспособности',
            'Развёртывание на выбранном хостинге или облачной платформе',
          ],
        },
      ],
      orders: [
        {
          title: 'Требуется создать привлекательный лендинга для продукта',
          description:
            'Требуется создать привлекательный и информативный лендинг для продвижения нового продукта. Ищем опытных веб-разработчиков, способных разработать уникальный дизайн, который будет привлекать внимание и мотивировать посетителей совершить желаемое действие. У нас нет команды разработчиков, поэтому ищем профессионалов, способных воплотить наши требования и достичь оптимальных результатов. Прикреплены некоторые изображения для вашего ознакомления.',
          budget: 3000,
          deadline: getDeadline(),
          images: ['fallback.jpg'],
        },
        {
          title:
            'Нужен редизайн сайта для повышения конверсии и привлекательности',
          description:
            'Имеется существующий сайт, который требует полного редизайна с целью улучшения пользовательского опыта, повышения конверсии и обновления визуального облика. Ищем профессиональных дизайнеров и разработчиков, способных предоставить современный и функциональный дизайн, адаптированный к требованиям нашей аудитории. У нас нет собственной команды разработчиков, поэтому ищем экспертов, которые смогут учесть нашу бренд-идентичность и цели бизнеса для создания сайта, который впечатлит наших посетителей.',
          budget: 8000,
          deadline: getDeadline(),
          images: ['fallback.jpg'],
        },
      ],
    },
    {
      name: 'Мобильная разработка',
      slug: 'mobile-development',
      tags: [
        { name: 'Android', slug: 'android' },
        { name: 'iOS', slug: 'ios' },
        { name: 'React Native', slug: 'react-native' },
        { name: 'Flutter', slug: 'flutter' },
        { name: 'Xamarin', slug: 'xamarin' },
        { name: 'Ionic', slug: 'ionic' },
        { name: 'Swift', slug: 'swift' },
        { name: 'Kotlin', slug: 'kotlin' },
        { name: 'Java', slug: 'java' },
        { name: 'Objective-C', slug: 'objective-c' },
        { name: 'Cordova', slug: 'cordova' },
        { name: 'PhoneGap', slug: 'phonegap' },
        { name: 'Unity', slug: 'unity' },
        { name: 'Cocos2d', slug: 'cocos2d' },
        { name: 'Corona SDK', slug: 'corona-sdk' },
        { name: 'Appcelerator Titanium', slug: 'appcelerator-titanium' },
        { name: 'React.js', slug: 'react-js' },
        { name: 'Vue.js', slug: 'vue-js' },
        { name: 'AngularJS', slug: 'angular-js' },
        { name: 'jQuery Mobile', slug: 'jquery-mobile' },
      ],
      services: [
        {
          title: 'Разработка мобильного приложения',
          description:
            'Мы предлагаем создание высококачественного мобильного приложения для платформы Android или iOS с использованием современных технологий разработки. Наша команда опытных разработчиков создаст функциональное и интуитивно понятное приложение, соответствующее вашим требованиям.',
          price: 15000,
          duration: 30,
          includes: [
            'Разработка фронтенда',
            'Разработка бэкенда',
            'Тестирование',
            'Развёртывание в Google Play или App Store',
          ],
        },
        {
          title: 'Разработка мобильного интерфейса',
          description:
            'Мы предлагаем создание удобного и привлекательного интерфейса для вашего мобильного приложения. Наша команда опытных дизайнеров разработает макеты экранов, которые будут легко восприниматься пользователями.',
          price: 5000,
          duration: 10,
          includes: [
            'Проектирование интерфейса',
            'Разработка макетов экранов',
            'Анимация и визуальные эффекты',
            'Адаптация под различные устройства',
          ],
        },
      ],
      orders: [
        {
          title: 'Разработка MVP мобильного приложения',
          description:
            'Требуется разработка минимально жизнеспособной версии мобильного приложения с базовым функционалом. Ищем команду разработчиков, способных создать прототип приложения, который позволит протестировать идею и собрать обратную связь от пользователей. ',
          budget: 10000,
          deadline: getDeadline(),
          images: ['fallback.jpg'],
        },
        {
          title: 'Разработка UI/UX дизайна для мобильного приложения',
          description:
            'Требуется разработка дизайна пользовательского интерфейса и опыта использования для мобильного приложения. Ищем опытных дизайнеров, способных создать привлекательный и удобный дизайн, который обеспечит отличный пользовательский опыт. ',
          budget: 8000,
          deadline: getDeadline(),
          images: ['fallback.jpg'],
        },
      ],
    },
  ],
};

async function generateCategoriesAndTags() {
  const categories = await prisma.category.createMany({
    data: config.categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    })),
  });

  const newTags = [];
  const tagSlugs = [];
  for (const t of config.categories.flatMap((category) => category.tags)) {
    if (!tagSlugs.includes(t.slug)) {
      newTags.push(t);
      tagSlugs.push(t.slug);
    }
  }

  const tags = await prisma.tags.createMany({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: newTags,
  });

  return { categories, tags };
}

async function generateUsers() {
  const freelancers = [];
  const clients = [];

  for (let i = 0; i < 5; i++) {
    const pass = faker.internet.password();
    const hashPass = await hash(pass, 10);

    const freelancer = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashPass,
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        country: 'Russia',
        verified: faker.datatype.boolean(),
        role: Role.Freelancer,
        emailVerified: faker.datatype.boolean(),
        profileCompleted: faker.datatype.boolean(),
        bio: faker.lorem.sentences(),
        avatarUrl: faker.internet.avatar(),
        phone: faker.phone.number(),
      },
    });
    freelancers.push({ ...freelancer, password: pass });

    const pass2 = faker.internet.password();
    const hashPass2 = await hash(pass2, 10);

    const client = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashPass2,
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        country: 'Russia',
        verified: faker.datatype.boolean(),
        role: Role.Client,
        emailVerified: faker.datatype.boolean(),
        profileCompleted: faker.datatype.boolean(),
        bio: faker.lorem.sentences(),
        phone: faker.phone.number(),
        avatarUrl: "fallback.jpg"
      },
    });
    clients.push({ ...client, password: pass2 });
  }

  const headers = ['Role', 'Email', 'Password'].join(',');
  const data = [...freelancers, ...clients]
    .map((user) => ({
      role: user.role,
      email: user.email,
      password: user.password,
    }))
    .map((user) => Object.values(user).join(','))
    .join('\n');
  const csv = `${headers}\n${data}`;

  fs.writeFileSync('./out/users.csv', csv);

  return { freelancers, clients };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function generateServices(freelancers) {
  const services = [];

  for (const category of config.categories) {
    for (const service of category.services) {
      const tags = category.tags.slice();
      shuffle(tags);
      const selectedTags = tags
        .slice(0, Math.floor(Math.random() * Math.min(tags.length, 3)) + 1)
        .map((tag) => ({
          slug: tag.slug,
        }));
      const packages = [];
      const numPackages = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numPackages; i++) {
        packages.push({
          name: `Пакет ${i + 1}`,
          price: service.price + Math.floor(Math.random() * 1000),
          description: `Описание пакета ${i + 1}`,
          deliveryDays: service.duration + Math.floor(Math.random() * 10),
        });
      }
      services.push(
        await prisma.service.create({
          data: {
            bannerImage: 'fallback.jpg',
            title: service.title,
            description: service.description,
            slug: service.title.toLowerCase().replace(/ /g, '-'),
            category: {
              connect: {
                slug: category.slug,
              },
            },
            user: {
              connect: {
                id: freelancers[Math.floor(Math.random() * freelancers.length)]
                  .id,
              },
            },
            tags: {
              connect: selectedTags,
            },
            package: {
              createMany: {
                data: packages,
              },
            },
            features: {
              createMany: {
                data: service.includes.map((e) => ({
                  name: e,
                  includedIn: packages.map((p) => p.name),
                })),
              },
            },
          },
        }),
      );
    }
  }

  return services;
}

async function generateJobPosts(clients) {
  const jobs = [];

  for (const category of config.categories) {
    for (const order of category.orders) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const tags = category.tags.slice();
      shuffle(tags);
      const selectedTags = tags
        .slice(0, Math.floor(Math.random() * Math.min(tags.length, 3)) + 1)
        .map((tag) => ({
          slug: tag.slug,
        }));
      jobs.push(
        await prisma.jobPost.create({
          data: {
            title: order.title,
            description: order.description,
            budget: order.budget,
            deadline: new Date(order.deadline),
            images: { set: order.images },
            tags: {
              connect: selectedTags,
            },
            category: {
              connect: {
                slug: category.slug,
              },
            },
            user: {
              connect: {
                id: client.id,
              },
            },
            slug: order.title.toLowerCase().replace(/ /g, '-'),
          },
        }),
      );
    }
  }
  return jobs;
}

async function main() {
  await generateCategoriesAndTags();
  const { freelancers, clients } = await generateUsers();

  await generateServices(freelancers);
  await generateJobPosts(clients);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
