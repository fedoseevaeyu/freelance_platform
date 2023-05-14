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
          images: ['landing-page.jpg'],
        },
        {
          title:
            'Нужен редизайн сайта для повышения конверсии и привлекательности',
          description:
            'Имеется существующий сайт, который требует полного редизайна с целью улучшения пользовательского опыта, повышения конверсии и обновления визуального облика. Ищем профессиональных дизайнеров и разработчиков, способных предоставить современный и функциональный дизайн, адаптированный к требованиям нашей аудитории. У нас нет собственной команды разработчиков, поэтому ищем экспертов, которые смогут учесть нашу бренд-идентичность и цели бизнеса для создания сайта, который впечатлит наших посетителей.',
          budget: 8000,
          deadline: getDeadline(),
          images: ['website-redesign.jpg'],
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
        { name: 'Twitter', slug: 'twitter' },
        { name: 'LinkedIn', slug: 'linkedin' },
        { name: 'YouTube', slug: 'youtube' },
        { name: 'Pinterest', slug: 'pinterest' },
        { name: 'Snapchat', slug: 'snapchat' },
        { name: 'VKontakte', slug: 'vkontakte' },
        { name: 'Reddit', slug: 'reddit' },
        { name: 'WhatsApp', slug: 'whatsapp' },
        { name: 'WeChat', slug: 'wechat' },
        { name: 'Telegram', slug: 'telegram' },
        { name: 'Line', slug: 'line' },
        { name: 'Viber', slug: 'viber' },
        { name: 'Tumblr', slug: 'tumblr' },
        { name: 'Weibo', slug: 'weibo' },
        { name: 'Sina Weibo', slug: 'sina-weibo' },
        { name: 'KakaoTalk', slug: 'kakaotalk' },
        { name: 'Telegram', slug: 'telegram' },
      ],
      services: [
        {
          title: 'Настройка таргетированной рекламы в социальных сетях',
          description:
            'Поможем создать и настроить эффективные рекламные кампании в социальных сетях для вашего бизнеса. Мы предлагаем профессиональную настройку таргетированной рекламы, которая позволит вам достичь максимальной отдачи от вложенных средств.',
          price: 5000,
          duration: 7,
          includes: [
            'Анализ вашей целевой аудитории и определение ключевых параметров таргетинга',
            'Создание привлекательных и информативных рекламных объявлений',
            'Настройка таргетинга на основе географии, интересов, поведения и других параметров',
            'Тестирование различных вариантов объявлений и оптимизация кампаний для достижения максимального результата',
            'Мониторинг и анализ эффективности кампаний, внесение корректировок при необходимости',
            'Предоставление подробных отчетов о результативности рекламных кампаний',
          ],
        },
        {
          title: 'Управление рекламными кампаниями в социальных сетях',
          description: `Доверьте управление своими рекламными кампаниями в социальных сетях профессионалам и добейтесь максимального эффекта и результативности. Мы предлагаем полное управление вашими рекламными кампаниями в социальных сетях, чтобы вы могли сосредоточиться на своем бизнесе, зная, что ваша реклама находится в надежных руках.
 
Наша команда экспертов по социальной рекламе будет планировать и запускать рекламные кампании, учитывая ваши бизнес-цели и требования. Мы проанализируем вашу целевую аудиторию и подберем наиболее эффективные платформы и форматы рекламы для достижения желаемого результата.            
 
Мы будем мониторить и оптимизировать ваши рекламные кампании, чтобы гарантировать их эффективность. Мы будем анализировать показатели успеха, такие как CTR (кликабельность), конверсии и ROI (отдача от инвестиций), и вносить корректировки в реальном времени, чтобы максимизировать результаты.
            
Помимо этого, мы предоставим вам подробные отчеты о результативности ваших рекламных кампаний. Вы сможете видеть ключевые показатели, анализировать эффективность и принимать информированные решения по оптимизации рекламной стратегии.
            
Доверьте нам управление вашей рекламой в социальных сетях, и мы поможем вам достичь максимального воздействия, привлечь новых клиентов и увеличить вашу видимость и продажи.`,
          price: 10000,
          duration: 14,
          includes: [
            'Планирование и запуск рекламных кампаний',
            'Мониторинг и оптимизация рекламных кампаний',
            'Анализ и отчетность по результатам рекламных кампаний',
          ],
        },
      ],
      orders: [
        {
          title: 'Реклама в Instagram',
          description:
            'Требуется настройка и управление рекламными кампаниями в Instagram. Ищем профессионалов, способных создать привлекательные рекламные объявления и оптимизировать кампании для достижения максимальных результатов. ',
          budget: 10000,
          deadline: getDeadline(),
          images: ['instagram-ad.jpg'],
        },
        {
          title: 'Реклама в TikTok',
          description:
            'Требуется настройка и управление рекламными кампаниями в TikTok. Ищем экспертов, способных создать привлекательную и эффективную рекламу на этой популярной платформе.',
          budget: 15000,
          deadline: getDeadline(),
          images: ['tiktok-ad.jpg'],
        },
      ],
    },
    {
      name: 'Графический дизайн',
      slug: 'graphic-design',
      tags: [
        { name: 'Photoshop', slug: 'photoshop' },
        { name: 'Illustrator', slug: 'illustrator' },
        { name: 'InDesign', slug: 'indesign' },
        { name: 'CorelDRAW', slug: 'coreldraw' },
        { name: 'Canva', slug: 'canva' },
        { name: 'Sketch', slug: 'sketch' },
        { name: 'Figma', slug: 'figma' },
        { name: 'GIMP', slug: 'gimp' },
        { name: 'Adobe XD', slug: 'adobe-xd' },
        { name: 'Cinema 4D', slug: 'cinema-4d' },
        { name: 'Procreate', slug: 'procreate' },
        { name: 'Affinity Designer', slug: 'affinity-designer' },
        { name: 'Autodesk SketchBook', slug: 'autodesk-sketchbook' },
        { name: 'Inkscape', slug: 'inkscape' },
        { name: 'PaintTool SAI', slug: 'painttool-sai' },
        { name: 'Gravit Designer', slug: 'gravit-designer' },
        { name: 'Xara Designer Pro', slug: 'xara-designer-pro' },
        { name: 'Adobe Creative Cloud', slug: 'adobe-creative-cloud' },
        { name: 'Affinity Photo', slug: 'affinity-photo' },
        { name: 'Clip Studio Paint', slug: 'clip-studio-paint' },
      ],
      services: [
        {
          title: 'Дизайн логотипа',
          description:
            'Мы предлагаем создание уникального и привлекательного логотипа с использованием Adobe Photoshop и Illustrator. Наша команда опытных дизайнеров разработает логотип, который отражает вашу бренд-идентичность и привлекает внимание.',
          price: 3000,
          duration: 5,
          includes: [
            'Создание 3 вариантов логотипа',
            '3 правки',
            'Исходный файл в векторном формате',
          ],
        },
        {
          title: 'Дизайн баннера',
          description:
            'Мы предлагаем создание креативных баннеров для продвижения вашего бренда или продукта с использованием графических инструментов. Наша команда опытных дизайнеров разработает баннеры, которые привлекут внимание и будут соответствовать вашим целям. ',
          price: 2000,
          duration: 3,
          includes: [
            'Создание 2 вариантов баннера',
            '2 правки',
            'Исходный файл в PNG формате',
          ],
        },
      ],
      orders: [
        {
          title: 'Нужен дизайн визитки',
          description:
            'Требуется создание стильной и профессиональной визитки, которая поможет вам выделиться среди конкурентов. Мы ищем опытных дизайнеров, способных создать уникальный дизайн, отражающий нашу бренд-идентичность и привлекающий внимание. ',
          budget: 1500,
          deadline: getDeadline(),
          images: ['business-card.jpg'],
        },
        {
          title: 'Нужен дизайн упаковки',
          description:
            'Требуется разработка оригинального и привлекательного дизайна упаковки для вашего продукта. Ищем профессиональных дизайнеров, способных создать уникальный и функциональный дизайн, соответствующий вашим требованиям и привлекающий внимание покупателей. ',
          budget: 5000,
          deadline: getDeadline(),
          images: ['package-design.jpg'],
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
          images: ['mobile-app-mvp.jpg'],
        },
        {
          title: 'Разработка UI/UX дизайна для мобильного приложения',
          description:
            'Требуется разработка дизайна пользовательского интерфейса и опыта использования для мобильного приложения. Ищем опытных дизайнеров, способных создать привлекательный и удобный дизайн, который обеспечит отличный пользовательский опыт. ',
          budget: 8000,
          deadline: getDeadline(),
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
        { name: 'Контент-маркетинг', slug: 'content-marketing' },
        { name: 'Брендинг', slug: 'branding' },
        { name: 'PR', slug: 'pr' },
        { name: 'Email-маркетинг', slug: 'email-marketing' },
        { name: 'Социальные медиа', slug: 'social-media' },
        { name: 'Техническое письмо', slug: 'technical-writing' },
        { name: 'Креативное письмо', slug: 'creative-writing' },
        { name: 'Исследование рынка', slug: 'market-research' },
        { name: 'Копирайтинг для видео', slug: 'video-copywriting' },
        { name: 'Копирайтинг для блогов', slug: 'blog-copywriting' },
        { name: 'Копирайтинг для рекламы', slug: 'advertising-copywriting' },
        { name: 'Копирайтинг для лендингов', slug: 'landing-page-copywriting' },
        {
          name: 'Копирайтинг для товаров и услуг',
          slug: 'product-service-copywriting',
        },
        {
          name: 'Копирайтинг для маркетплейсов',
          slug: 'marketplace-copywriting',
        },
        { name: 'Творческий копирайтинг', slug: 'creative-copywriting' },
        { name: 'Технический копирайтинг', slug: 'technical-copywriting' },
        {
          name: 'Копирайтинг для социальных сетей',
          slug: 'social-media-copywriting',
        },
        {
          name: 'Копирайтинг для электронной коммерции',
          slug: 'ecommerce-copywriting',
        },
      ],
      services: [
        {
          title: 'Написание текстов для сайта',
          description:
            'Мы предлагаем создание уникальных и продающих текстов для вашего сайта с учетом SEO-оптимизации. Наша команда опытных копирайтеров разработает тексты, которые привлекут внимание посетителей и помогут повысить конверсию.',
          price: 3000,
          duration: 5,
          includes: [
            'Составление семантического ядра',
            'Написание заголовков и описаний',
            'Написание текстов для различных страниц сайта',
          ],
        },
        {
          title: 'Написание статей для блога',
          description:
            'Мы предлагаем создание интересных и информативных статей для вашего блога с учетом интересов вашей аудитории. Наша команда опытных копирайтеров и исследователей проведет исследование темы, подберет ключевые слова и создаст качественную статью.',
          price: 5000,
          duration: 7,
          includes: [
            'Исследование темы и подбор ключевых слов',
            'Написание статьи',
            'Редактура и корректировка',
          ],
        },
      ],
      orders: [
        {
          title: 'Написание текста для лендинга',
          description:
            'Требуется написание уникального текста для лендинга с учетом SEO-оптимизации. Ищем опытных копирайтеров, способных создать привлекательный и информативный контент, который приведет к увеличению конверсии и продаж. У нас есть определенный бюджет и сроки выполнения. ',
          budget: 2000,
          deadline: getDeadline(),
          images: ['landing-text.jpg'],
        },
        {
          title: 'Написание сценария для видео',
          description:
            'Требуется написание сценария для корпоративного видео с учетом ключевых сообщений. Ищем профессиональных копирайтеров, способных создать увлекательный и информативный сценарий, который передаст центральные идеи вашего бренда или продукта. ',
          budget: 7000,
          deadline: getDeadline(),
          images: ['video-script.jpg'],
        },
      ],
    },
    {
      name: 'SEO-оптимизация',
      slug: 'seo-optimization',
      tags: [
        { name: 'Аудит сайта', slug: 'site-audit' },
        { name: 'Внутренняя оптимизация', slug: 'on-page-optimization' },
        { name: 'Внешняя оптимизация', slug: 'off-page-optimization' },
        { name: 'Ключевые слова', slug: 'keywords' },
        { name: 'Семантическое ядро', slug: 'semantic-core' },
        { name: 'Оптимизация контента', slug: 'content-optimization' },
        { name: 'Техническая оптимизация', slug: 'technical-optimization' },
        { name: 'Ссылочный профиль', slug: 'link-profile' },
        { name: 'Бэклинки', slug: 'backlinks' },
        {
          name: 'Оптимизация скорости загрузки',
          slug: 'load-speed-optimization',
        },
        { name: 'Мобильная оптимизация', slug: 'mobile-optimization' },
        { name: 'Локальная SEO', slug: 'local-seo' },
        { name: 'SEO-аналитика', slug: 'seo-analytics' },
        { name: 'Технический аудит', slug: 'technical-audit' },
        { name: 'Конкурентный анализ', slug: 'competitive-analysis' },
        { name: 'SEO-стратегия', slug: 'seo-strategy' },
        { name: 'SEO-контент', slug: 'seo-content' },
        { name: 'Мета-теги', slug: 'meta-tags' },
        { name: 'Сниппеты', slug: 'snippets' },
        { name: 'Поисковая индексация', slug: 'search-indexing' },
      ],
      services: [
        {
          title: 'Аудит сайта',
          description:
            'Мы предлагаем проведение аудита вашего сайта для проверки его соответствия требованиям поисковых систем и выявления проблем, мешающих его продвижению. Наша команда проведет анализ структуры сайта, качества контента, технических ошибок, уязвимостей, обратных ссылок и социальных сигналов. По результатам аудита мы предоставим вам подробный отчет с рекомендациями по улучшению.',
          price: 8000,
          duration: 14,
          includes: [
            'Анализ структуры сайта и качества контента',
            'Проверка наличия технических ошибок и уязвимостей',
            'Анализ обратных ссылок и социальных сигналов',
            'Составление отчета и рекомендаций по улучшению',
          ],
        },
        {
          title: 'Внутренняя оптимизация seo',
          description:
            'Мы предлагаем оптимизацию внутренних элементов вашего сайта для улучшения его видимости в поисковых системах. Наша команда проведет анализ семантического ядра, оптимизирует заголовки, описания, контент, настроит метаданные и теги, улучшит структуру сайта и пользовательский опыт.',
          price: 5000,
          duration: 7,
          includes: [
            'Составление семантического ядра',
            'Оптимизация заголовков, описаний и контента',
            'Настройка метаданных и тегов',
            'Улучшение структуры сайта и пользовательского опыта',
          ],
        },
        {
          title: 'Внешняя оптимизация',
          description:
            'Мы предлагаем продвижение вашего сайта за счет увеличения количества обратных ссылок и улучшения имеющихся. Наша команда проведет анализ конкурентов, исследование рынка, найдет и привлечет качественные внешние ссылки, улучшит ссылочный профиль вашего сайта. Мы также будем отслеживать и анализировать результаты продвижения.',
          price: 10000,
          duration: 30,
          includes: [
            'Анализ конкурентов и исследование рынка',
            'Поиск и привлечение качественных внешних ссылок',
            'Улучшение ссылочного профиля сайта',
            'Отслеживание и анализ результатов',
          ],
        },
      ],
      orders: [
        {
          title: 'Аудит и оптимизация сайта',
          description:
            'Требуется комплексная работа по улучшению видимости и эффективности вашего сайта в поисковых системах. Ищем опытных специалистов по SEO, которые проведут аудит вашего сайта, выявят его слабые места и предложат рекомендации по оптимизации. ',
          budget: 15000,
          deadline: getDeadline(),
          images: ['seo-audit.jpg'],
        },
        {
          title: 'Продвижение сайта в Google',
          description:
            'Требуется повышение видимости вашего сайта в поисковой системе Google. Ищем экспертов по SEO, способных разработать и реализовать эффективную стратегию продвижения, чтобы ваш сайт занимал высокие позиции в результатах поиска. У нас есть определенный бюджет и необходимость выполнить работу в заданные сроки. ',
          budget: 12000,
          deadline: getDeadline(),
          images: ['google-promotion.jpg'],
        },
      ],
    },
    {
      name: 'IT-консалтинг',
      slug: 'it-consulting',
      tags: [
        { name: 'Бизнес-анализ', slug: 'business-analysis' },
        { name: 'Проектное управление', slug: 'project-management' },
        { name: 'IT-стратегия', slug: 'it-strategy' },
        { name: 'Техническое консультирование', slug: 'technical-consulting' },
        { name: 'Архитектура систем', slug: 'system-architecture' },
        { name: 'ИТ-аудит', slug: 'it-audit' },
        { name: 'Управление изменениями', slug: 'change-management' },
        {
          name: 'Разработка бизнес-процессов',
          slug: 'business-process-development',
        },
        { name: 'ИТ-проекты', slug: 'it-projects' },
        {
          name: 'Оптимизация ИТ-инфраструктуры',
          slug: 'it-infrastructure-optimization',
        },
        { name: 'Цифровая трансформация', slug: 'digital-transformation' },
        { name: 'Облачные решения', slug: 'cloud-solutions' },
        { name: 'ИТ-безопасность', slug: 'it-security' },
        { name: 'Аутсорсинг IT-услуг', slug: 'it-outsourcing' },
        { name: 'ITIL', slug: 'itil' },
        { name: 'SLA', slug: 'sla' },
        { name: 'DevOps', slug: 'devops' },
        { name: 'Big Data', slug: 'big-data' },
        { name: 'Искусственный интеллект', slug: 'artificial-intelligence' },
        { name: 'Машинное обучение', slug: 'machine-learning' },
      ],
      services: [
        {
          title: 'Бизнес-анализ',
          description:
            'Мы предлагаем анализ и оптимизацию бизнес-процессов вашей компании с использованием современных технологий и методологий. Наша команда проведет анализ бизнес-процессов, выявит проблемы и составит рекомендации по их улучшению. Мы также разработаем техническое задание на автоматизацию бизнес-процессов и поможем подобрать и внедрить соответствующие IT-решения. ',
          price: 12000,
          duration: 20,
          includes: [
            'Анализ бизнес-процессов и выявление проблем',
            'Составление рекомендаций по улучшению',
            'Разработка ТЗ на автоматизацию бизнес-процессов',
            'Подбор и внедрение соответствующих IT-решений',
          ],
        },
        {
          title: 'Проектное управление',
          description:
            'Мы предлагаем управление IT-проектами вашей компании от начала до конца. Наша команда займется планированием, управлением ресурсами и контролем качества проекта. Мы подберем и управляем командой проекта, выполним планирование и контроль бюджета и сроков, займемся риск-менеджментом и управлением изменениями. Мы также обеспечим контроль качества проекта и внедрение улучшений.',
          price: 15000,
          duration: 30,
          includes: [
            'Подбор и управление командой проекта',
            'Планирование и контроль бюджета и сроков',
            'Риск-менеджмент и управление изменениями',
            'Контроль качества и внедрение улучшений',
          ],
        },
        {
          title: 'IT-стратегия',
          description:
            'Мы предлагаем разработку долгосрочной IT-стратегии вашей компании с учетом бизнес-целей и современных технологий. Наша команда проведет анализ бизнес-целей и выявит потребности в IT. Мы также проведем исследование рынка и технологий, составим IT-стратегию и дорожную карту. Мы поможем вам подобрать и внедрить необходимые IT-решения.',
          price: 20000,
          duration: 60,
          includes: [
            'Анализ бизнес-целей и выявление потребностей в IT',
            'Исследование рынка и технологий',
            'Составление IT-стратегии и дорожной карты',
            'Подбор и внедрение необходимых IT-решений',
          ],
        },
      ],
      orders: [
        {
          title: 'Подбор и внедрение CRM-системы',
          description:
            'Требуется подбор и внедрение CRM-системы для управления взаимодействием с клиентами и улучшения процессов продаж. Ищем экспертов по CRM, которые помогут найти подходящую систему и настроить ее с учетом ваших требований и бизнес-процессов. ',
          budget: 15000,
          deadline: getDeadline(),
          images: ['crm-system.jpg'],
        },
        {
          title: 'Анализ IT-инфраструктуры',
          description:
            'Требуется провести анализ и оптимизацию IT-инфраструктуры вашей компании с целью улучшения ее производительности и надежности. Ищем специалистов по IT-консалтингу, которые помогут выявить узкие места и предложат рекомендации по оптимизации.',
          budget: 10000,
          deadline: getDeadline(),
          images: ['it-infrastructure.jpg'],
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
            bannerImage: 'placeholder.webp',
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
