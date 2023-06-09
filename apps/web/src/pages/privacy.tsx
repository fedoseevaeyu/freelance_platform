import { siteDomain, siteName, siteUrl } from '../apps/data/site';
import Layout from '../apps/ui/layout';

export default function Privacy() {
  return (
    <Layout
      title="Политика конфиденциальности"
      description="Политика конфиденциальности"
    >
      <div className="container px-5 pb-[48px] pt-[24px] sm:px-6">
        <div className="prose max-w-full">
          <h1>Политика конфиденциальности</h1>
          <h2>Общие положения</h2>
          <p>
            1.1. Настоящая Политика конфиденциальности определяет порядок
            обработки и защиты персональных данных Пользователей Сервиса{' '}
            {siteName}, расположенного по адресу: {siteUrl}.
          </p>
          <p>
            1.2. Администрация Сервиса обязуется соблюдать положения настоящей
            Политики конфиденциальности, а также требования законодательства
            Российской Федерации в области защиты персональных данных.
          </p>

          <h2>Персональные данные</h2>
          <p>
            2.1. Персональные данные – любая информация, относящаяся к
            определенному или определяемому на основании такой информации
            физическому лицу (субъекту персональных данных).
          </p>
          <p>
            2.2. Персональные данные, которые могут быть получены и обработаны
            Администрацией Сервиса, включают, но не ограничиваются:
          </p>
          <ul>
            <li>Фамилия, имя, отчество;</li>
            <li>Адрес электронной почты;</li>
            <li>Номер телефона;</li>
            <li>
              Информация о профессии, образовании, навыках и опыте работы;
            </li>
            <li>Информация о заказах и откликах на заказы;</li>
            <li>Информация об оплате услуг Сервиса;</li>
            <li>IP-адрес и другие технические данные.</li>
          </ul>

          <h2>Цели обработки персональных данных</h2>
          <p>
            3.1. Администрация Сервиса обрабатывает персональные данные с целью:
          </p>
          <ul>
            <li>Идентификации Пользователя;</li>
            <li>Предоставления Пользователю услуг Сервиса;</li>
            <li>Обратной связи с Пользователем;</li>
            <li>Улучшения качества услуг, предоставляемых Сервисом;</li>
            <li>
              Проведения статистических и иных исследований на основе
              обезличенных данных;
            </li>
            <li>Обеспечения безопасности и предотвращения мошенничества;</li>
            <li>
              Рассылки информационных и рекламных материалов с согласия
              Пользователя.
            </li>
          </ul>

          <h2>Обработка персональных данных</h2>
          <p>
            4.1. Обработка персональных данных осуществляется с согласия
            Пользователя и в соответствии с законодательством Российской
            Федерации.
          </p>
          <p>
            4.2. Администрация Сервиса принимает все необходимые меры для
            обеспечения безопасности персональных данных и их защиты от
            несанкционированного доступа, изменения, распространения или
            уничтожения.
          </p>
          <p>
            4.3. Администрация Сервиса не передает персональные данные третьим
            лицам без согласия Пользователя, за исключением случаев,
            предусмотренных законодательством Российской Федерации.
          </p>
          <p>
            4.4. Администрация Сервиса вправе использовать технологии Cookies
            для сбора информации о Пользователях. Cookies представляют собой
            небольшие текстовые файлы, которые сохраняются на компьютере
            Пользователя и позволяют определить предпочтения Пользователя при
            использовании Сервиса.
          </p>

          <h2>Права и обязанности Пользователей</h2>
          <p>
            5.1. Пользователи имеют право на доступ к своим персональным данным,
            их изменение и удаление, а также на отзыв согласия на их обработку.
          </p>
          <p>
            5.2. Пользователи обязаны предоставлять достоверную и актуальную
            информацию о себе, а также обеспечивать конфиденциальность своего
            логина и пароля для доступа к Сервису.
          </p>

          <h2>Изменение Политики конфиденциальности</h2>
          <p>
            6.1. Администрация Сервиса вправе вносить изменения в настоящую
            Политику конфиденциальности. Изменения вступают в силу с момента их
            опубликования на Сайте.
          </p>
          <p>
            6.2. Продолжение использования Сервиса после внесения изменений в
            Политику конфиденциальности означает согласие Пользователя с новой
            редакцией Политики.
          </p>

          <h2>Контактная информация</h2>
          <p>
            7.1. Все вопросы, связанные с настоящей Политикой
            конфиденциальности, могут быть направлены Администрации Сервиса по
            следующим контактным данным:
          </p>
          <ul>
            <li>E-mail: support@{siteDomain}</li>
          </ul>

          <h2>Заключительные положения</h2>
          <p>
            8.1. Настоящая Политика конфиденциальности составлена на русском
            языке и регулируется в соответствии с законодательством Российской
            Федерации.
          </p>
          <p>
            8.2. Если одно или несколько положений настоящей Политики
            конфиденциальности признаются недействительными или не имеющими
            юридической силы, это не влияет на действительность и силу остальных
            положений Политики.
          </p>
          <p>
            8.3. Настоящая Политика конфиденциальности вступает в силу с момента
            ее опубликования на Сайте и действует до момента отзыва согласия
            Пользователя на обработку его персональных данных или до прекращения
            деятельности Сервиса.
          </p>

          <small className="mt-8 block w-full text-right font-bold text-gray-400">
            Последнее обновление: 20 апреля 2023.
          </small>
        </div>
      </div>
    </Layout>
  );
}
