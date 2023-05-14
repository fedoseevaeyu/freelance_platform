import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {hash} from "bcrypt";
import * as fs from "fs";
faker.locale = 'ru'

const prisma = new PrismaClient();

const config = {
    categories: [
        {
            name: 'Веб-разработка',
            slug: 'web-development',
            tags: [
                { name: 'HTML', slug: 'html' },
                { name: 'CSS', slug: 'css' },
                { name: 'JavaScript', slug: 'javascript' },
                { name: 'React', slug: 'react' },
            ],
            services: [
                {
                    title: 'Разработка сайта',
                    description: 'Создание адаптивных и мобильных версий сайта с использованием HTML, CSS и JavaScript.',
                    price: 5000,
                    duration: 10,
                    includes: [
                        'Дизайн',
                        'Верстка',
                        'Программирование',
                        'SEO оптимизация'
                    ]
                },
                {
                    title: 'Разработка веб-приложения',
                    description: 'Создание динамических веб-приложений с использованием современных JavaScript-фреймворков.',
                    price: 10000,
                    duration: 20,
                    includes: [
                        'Разработка фронтенда',
                        'Разработка бэкенда',
                        'Тестирование',
                        'Развёртывание'
                    ]
                },
            ],
            orders: [
                {
                    title: "Создание лендинга",
                    description: "Создание лендинга для продвижения нового продукта",
                    budget: 3000,
                    deadline: "2023-05-10T12:00:00Z",
                    images: ["landing-page.jpg"],
                },
                {
                    title: "Редизайн сайта",
                    description: "Редизайн сайта для повышения конверсии",
                    budget: 8000,
                    deadline: "2023-05-15T12:00:00Z",
                    images: ["website-redesign.jpg"],
                },
            ],
        },
        {
            name: 'Реклама в социальных сетях',
            slug: 'social-media-advertising',
            tags: [
                { name: 'Facebook', slug: 'facebook' },
                { name: 'Instagram', slug: 'instagram' },
                { name: 'TikTok', slug: 'tiktok' },
            ],
            services: [
                {
                    title: 'Настройка таргетированной рекламы',
                    description: 'Создание и настройка рекламных кампаний в социальных сетях для вашего бизнеса.',
                    price: 5000,
                    duration: 7,
                    includes: [
                        'Создание рекламных объявлений',
                        'Настройка таргетинга на вашу аудиторию',
                        'Тестирование и оптимизация рекламных кампаний'
                    ]
                },
                {
                    title: 'Управление рекламными кампаниями',
                    description: 'Управление рекламными кампаниями в социальных сетях для максимального эффекта и результативности.',
                    price: 10000,
                    duration: 14,
                    includes: [
                        'Планирование и запуск рекламных кампаний',
                        'Мониторинг и оптимизация рекламных кампаний',
                        'Анализ и отчетность по результатам рекламных кампаний'
                    ]
                },
            ],
            orders: [
                {
                    title: "Реклама в Instagram",
                    description: "Настройка и управление рекламными кампаниями в Instagram",
                    budget: 10000,
                    deadline: "2023-05-20T12:00:00Z",
                    images: ["instagram-ad.jpg"],
                },
                {
                    title: "Реклама в TikTok",
                    description: "Настройка и управление рекламными кампаниями в TikTok",
                    budget: 15000,
                    deadline: "2023-05-25T12:00:00Z",
                    images: ["tiktok-ad.jpg"],
                },
            ],
        },
        {
            name: 'Графический дизайн',
            slug: 'graphic-design',
            tags: [
                { name: 'Photoshop', slug: 'photoshop' },
                { name: 'Illustrator', slug: 'illustrator' },
            ],
            services: [
                {
                    title: 'Дизайн логотипа',
                    description: 'Создание уникального и привлекательного логотипа с использованием Adobe Photoshop и Illustrator.',
                    price: 3000,
                    duration: 5,
                    includes: [
                        'Создание 3 вариантов логотипа',
                        '3 правки',
                        'Исходный файл в векторном формате'
                    ]
                },
                {
                    title: 'Дизайн баннера',
                    description: 'Создание креативных баннеров для продвижения вашего бренда или продукта с использованием графических инструментов.',
                    price: 2000,
                    duration: 3,
                    includes: [
                        'Создание 2 вариантов баннера',
                        '2 правки',
                        'Исходный файл в PNG формате'
                    ]
                },
            ],
            orders: [
                {
                    title: "Дизайн визитки",
                    description: "Создание стильной визитки, которая поможет выделиться среди конкурентов",
                    budget: 1500,
                    deadline: "2023-05-07T12:00:00Z",
                    images: ["business-card.jpg"],
                },
                {
                    title: "Дизайн упаковки",
                    description: "Разработка оригинального дизайна упаковки для вашего продукта",
                    budget: 5000,
                    deadline: "2023-05-25T12:00:00Z",
                    images: ["package-design.jpg"],
                },
            ]
        },
        {
            name: 'Мобильная разработка',
            slug: 'mobile-development',
            tags: [
                { name: 'Android', slug: 'android' },
                { name: 'iOS', slug: 'ios' },
                { name: 'React Native', slug: 'react-native' },
            ],
            services: [
                {
                    title: 'Разработка мобильного приложения',
                    description: 'Создание высококачественого мобильного приложения для Android или iOS с использованием современных технологий разработки.',
                    price: 15000,
                    duration: 30,
                    includes: [
                        'Разработка фронтенда',
                        'Разработка бэкенда',
                        'Тестирование',
                        'Развёртывание в Google Play или App Store'
                    ]
                },
                {
                    title: 'Разработка мобильного интерфейса',
                    description: 'Создание удобного и привлекательного интерфейса для вашего мобильного приложения.',
                    price: 5000,
                    duration: 10,
                    includes: [
                        'Проектирование интерфейса',
                        'Разработка макетов экранов',
                        'Анимация и визуальные эффекты',
                        'Адаптация под различные устройства'
                    ]
                },
            ],
            orders: [
                {
                    title: 'Разработка MVP мобильного приложения',
                    description: 'Разработка минимально жизнеспособной версии мобильного приложения с базовым функционалом',
                    budget: 10000,
                    deadline: '2023-05-20T12:00:00Z',
                    images: ['mobile-app-mvp.jpg'],
                },
                {
                    title: 'Разработка UI/UX дизайна для мобильного приложения',
                    description: 'Разработка дизайна пользовательского интерфейса и опыта использования мобильного приложения',
                    budget: 8000,
                    deadline: '2023-05-10T12:00:00Z',
                    images: ['mobile-app-design.jpg'],
                },
            ],
        },
        {
            name: 'Копирайтинг',
            slug: 'copywriting',
            tags: [
                { name: 'SEO', slug: 'seo' },
                { name: 'Продажи', slug: 'sales' },
            ],
            services: [
                {
                    title: 'Написание текстов для сайта',
                    description: 'Создание уникальных и продающих текстов для вашего сайта с учетом SEO-оптимизации.',
                    price: 3000,
                    duration: 5,
                    includes: [
                        'Составление семантического ядра',
                        'Написание заголовков и описаний',
                        'Написание текстов для различных страниц сайта'
                    ]
                },
                {
                    title: 'Написание статей для блога',
                    description: 'Создание интересных и информативных статей для вашего блога с учетом интересов вашей аудитории.',
                    price: 5000,
                    duration: 7,
                    includes: [
                        'Исследование темы и подбор ключевых слов',
                        'Написание статьи',
                        'Редактура и корректировка'
                    ]
                },
            ],
            orders: [
                {
                    title: "Написание текста для лендинга",
                    description: "Написание уникального текста для лендинга с учетом SEO-оптимизации",
                    budget: 2000,
                    deadline: "2023-05-20T12:00:00Z",
                    images: ["landing-text.jpg"],
                },
                {
                    title: "Написание сценария для видео",
                    description: "Написание сценария для корпоративного видео с учетом ключевых сообщений",
                    budget: 7000,
                    deadline: "2023-05-25T12:00:00Z",
                    images: ["video-script.jpg"],
                },
            ]
        },
        {
            name: 'SEO-оптимизация',
            slug: 'seo-optimization',
            tags: [
                { name: 'Аудит сайта', slug: 'site-audit' },
                { name: 'Внутренняя оптимизация', slug: 'on-page-optimization' },
                { name: 'Внешняя оптимизация', slug: 'off-page-optimization' },
            ],
            services: [
                {
                    title: 'Аудит сайта',
                    description: 'Проверка вашего сайта на соответствие требованиям поисковых систем и выявление проблем, мешающих продвижению.',
                    price: 8000,
                    duration: 14,
                    includes: [
                        'Анализ структуры сайта и качества контента',
                        'Проверка наличия технических ошибок и уязвимостей',
                        'Анализ обратных ссылок и социальных сигналов',
                        'Составление отчета и рекомендаций по улучшению'
                    ]
                },
                {
                    title: 'Внутренняя оптимизация',
                    description: 'Оптимизация внутренних элементов вашего сайта для улучшения его видимости в поисковых системах.',
                    price: 5000,
                    duration: 7,
                    includes: [
                        'Составление семантического ядра',
                        'Оптимизация заголовков, описаний и контента',
                        'Настройка метаданных и тегов',
                        'Улучшение структуры сайта и пользовательского опыта'
                    ]
                },
                {
                    title: 'Внешняя оптимизация',
                    description: 'Продвижение вашего сайта за счет увеличения количества обратных ссылок и улучшения имеющихся.',
                    price: 10000,
                    duration: 30,
                    includes: [
                        'Анализ конкурентов и исследование рынка',
                        'Поиск и привлечение качественных внешних ссылок',
                        'Улучшение ссылочного профиля сайта',
                        'Отслеживание и анализ результатов'
                    ]
                },
            ],
            orders: [
                {
                    title: "Аудит и оптимизация сайта",
                    description: "Комплексная работа по улучшению видимости и эффективности сайта в поисковых системах",
                    budget: 15000,
                    deadline: "2023-06-01T12:00:00Z",
                    images: ["seo-audit.jpg"],
                },
                {
                    title: "Продвижение сайта в Google",
                    description: "Повышение видимости вашего сайта в поисковой системе Google",
                    budget: 12000,
                    deadline: "2023-06-15T12:00:00Z",
                    images: ["google-promotion.jpg"],
                }
            ]
        },
        {
            name: 'IT-консалтинг',
            slug: 'it-consulting',
            tags: [
                { name: 'Бизнес-анализ', slug: 'business-analysis' },
                { name: 'Проектное управление', slug: 'project-management' },
                { name: 'IT-стратегия', slug: 'it-strategy' },
            ],
            services: [
                {
                    title: 'Бизнес-анализ',
                    description: 'Анализ и оптимизация бизнес-процессов вашей компании с использованием современных технологий и методологий.',
                    price: 12000,
                    duration: 20,
                    includes: [
                        'Анализ бизнес-процессов и выявление проблем',
                        'Составление рекомендаций по улучшению',
                        'Разработка ТЗ на автоматизацию бизнес-процессов',
                        'Подбор и внедрение соответствующих IT-решений'
                    ]
                },
                {
                    title: 'Проектное управление',
                    description: 'Управление IT-проектами вашей компании от начала до конца, включая планирование, управление ресурсами и контроль качествва.',
                    price: 15000,
                    duration: 30,
                    includes: [
                        'Подбор и управление командой проекта',
                        'Планирование и контроль бюджета и сроков',
                        'Риск-менеджмент и управление изменениями',
                        'Контроль качества и внедрение улучшений'
                    ]
                },
                {
                    title: 'IT-стратегия',
                    description: 'Разработка долгосрочной IT-стратегии вашей компании с учетом бизнес-целей и современных технологий.',
                    price: 20000,
                    duration: 60,
                    includes: [
                        'Анализ бизнес-целей и выявление потребностей в IT',
                        'Исследование рынка и технологий',
                        'Составление IT-стратегии и дорожной карты',
                        'Подбор и внедрение необходимых IT-решений'
                    ]
                },
            ],
            orders: [
                {
                    title: 'Подбор и внедрение CRM-системы',
                    description: 'Подбор и внедрение CRM-системы для управления взаимодействием с клиентами и улучшения процессов продаж.',
                    budget: 15000,
                    deadline: '2023-06-30T12:00:00Z',
                    images: ['crm-system.jpg'],
                },
                {
                    title: 'Анализ IT-инфраструктуры',
                    description: 'Анализ и оптимизация IT-инфраструктуры вашей компании с целью улучшения её производительности и надежности.',
                    budget: 10000,
                    deadline: '2023-06-01T12:00:00Z',
                    images: ['it-infrastructure.jpg'],
                },
            ]
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

    const tags = await prisma.tags.createMany({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: config.categories.flatMap((category) => category.tags),
    });

    return { categories, tags }
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
                country: 'Россия',
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
                country: 'Россия',
                verified: faker.datatype.boolean(),
                role: Role.Client,
                emailVerified: faker.datatype.boolean(),
                profileCompleted: faker.datatype.boolean(),
                bio: faker.lorem.sentences(),
                phone: faker.phone.number(),
            },
        });
        clients.push({ ...client, password: pass2 });
    }

    const headers = ['Role', 'Email', 'Password'].join(',');
    const data = [...freelancers, ...clients].map((user) => ({ role: user.role, email: user.email, password: user.password })).map((user) => Object.values(user).join(',')).join('\n');
    const csv = `${headers}\n${data}`;

    fs.writeFileSync('./out/users.csv', csv);

    return { freelancers, clients }
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
            const selectedTags = tags.slice(0, Math.floor(Math.random() * Math.min(tags.length, 3)) + 1).map((tag) => ({
                slug: tag.slug
            }));
            const packages = [];
            const numPackages = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numPackages; i++) {
                packages.push({
                    name: `Пакет ${i+1}`,
                    price: service.price + Math.floor(Math.random() * 1000),
                    description: `Описание пакета ${i+1}`,
                    deliveryDays: service.duration + Math.floor(Math.random() * 10),
                });
            }
            services.push(await prisma.service.create({
                data: {
                    bannerImage: "placeholder.webp",
                    title: service.title,
                    description: service.description,
                    slug: service.title.toLowerCase().replace(/ /g, '-'),
                    category: {
                        connect: {
                            slug: category.slug,
                        }
                    },
                    user: {
                        connect: {
                            id: freelancers[Math.floor(Math.random() * freelancers.length)].id
                        }
                    },
                    tags: {
                        connect: selectedTags
                    },
                    package: {
                        createMany: {
                            data: packages
                        }
                    },
                    features: {
                        createMany: {
                            data: service.includes.map((e) => ({
                                name: e,
                                includedIn: packages.map((p) => p.name)
                            }))
                        },
                    }
                },
            }))
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
            const selectedTags = tags.slice(0, Math.floor(Math.random() * Math.min(tags.length, 3)) + 1).map((tag) => ({
                slug: tag.slug
            }));
            jobs.push(await prisma.jobPost.create({
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
                    slug: order.title.toLowerCase().replace(/ /g, "-"),
                },
            }))
        }
    }
    return jobs;
}

async function main() {
    const { tags, categories } = await generateCategoriesAndTags();
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
