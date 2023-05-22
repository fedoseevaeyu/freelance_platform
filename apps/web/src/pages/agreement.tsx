import Link from 'next/link';

import { routes } from '../apps/config/routes';
import Layout from '../apps/ui/layout';
import { siteName, siteUrl } from '../apps/data/site';

export default function TermsPage() {
  return (
    <Layout
      title="Пользовательское соглашение"
      description="Пользовательское соглашение"
    >
      <div className="container px-5 pb-[48px] pt-[24px] sm:px-6">
        <div className="prose max-w-full">
          <h1>Пользовательское соглашение</h1>
          <h2>Общие положения</h2>
          <p>
            1.1. Настоящее Пользовательское соглашение (далее – Соглашение)
            определяет условия использования Интернет-сервиса {siteName}
            (далее – Сервис), расположенного по адресу: {siteUrl} (далее – Сайт)
            и регулирует отношения между ООО {siteName} (далее – Администрация
            Сервиса) и пользователем Сервиса (далее – Пользователь).
          </p>
          <p>
            1.2. Использование Сервиса означает безоговорочное согласие
            Пользователя с настоящим Соглашением. Если Пользователь не согласен
            с условиями настоящего Соглашения, он обязан прекратить
            использование Сервиса.
          </p>
          <p>
            1.3. Администрация Сервиса вправе вносить изменения в настоящее
            Соглашение. Изменения вступают в силу с момента их опубликования на
            Сайте. Продолжение использования Сервиса после внесения изменений
            означает согласие Пользователя с новой редакцией Соглашения.
          </p>
          <p>
            1.4. Настоящее Соглашение составлено на русском языке и регулируется
            в соответствии с законодательством Российской Федерации.
          </p>

          <h2>Услуги Сервиса</h2>
          <p>
            2.1. Сервис предоставляет Пользователям возможность размещать заказы
            на выполнение работ и услуг в сфере разработки, а также откликаться
            на заказы других Пользователей.
          </p>
          <p>2.2. Все расчеты между Пользователями осуществляются в рублях.</p>
          <p>
            2.3. Сервис включает в себя рекомендательную систему,
            предоставляющую Пользователям предложения, наиболее соответствующие
            их интересам.
          </p>

          <h2>Регистрация и использование Сервиса</h2>
          <p>
            3.1. Для использования Сервиса Пользователь обязан пройти процедуру
            регистрации.
          </p>
          <p>
            3.2. В процессе регистрации Пользователь обязан предоставить
            Администрации Сервиса достоверные и актуальные данные, необходимые
            для идентификации.
          </p>
          <p>
            3.3. Пользователь обязан сохранять в тайне логин и пароль, выбранные
            им в процессе регистрации.
          </p>

          <h2>Права и обязанности сторон</h2>
          <p>
            4.1. Администрация Сервиса обязуется обеспечивать надлежащее
            функционирование Сервиса и предпринимать все необходимые меры для
            обеспечения безопасности и сохранности информации, размещенной
            Пользователями.
          </p>
          <p>
            4.2. Администрация Сервиса имеет право в одностороннем порядке
            изменять условия настоящего Соглашения, предупреждая Пользователей
            об этом путем публикации изменений на Сайте.
          </p>
          <p>
            4.3. Пользователь обязан соблюдать условия настоящего Соглашения и
            действующее законодательство Российской Федерации.
          </p>
          <p>
            4.4. Пользователь имеет право обратиться в службу поддержки Сервиса
            по вопросам, связанным с функционированием Сервиса и условиями
            настоящего Соглашения.
          </p>
          <p>
            4.5. Пользователь обязан соблюдать права и законные интересы других
            Пользователей и Администрации Сервиса.
          </p>

          <h2>Ответственность сторон</h2>
          <p>
            5.1. За неисполнение или ненадлежащее исполнение обязательств по
            настоящему Соглашению стороны несут ответственность в соответствии с
            законодательством Российской Федерации.
          </p>
          <p>
            5.2. Администрация Сервиса не несет ответственности за возможные
            прямые или косвенные убытки Пользователя, возникшие в результате
            использования Сервиса, в том числе за убытки, связанные с возможными
            техническими сбоями или проблемами с доступом к Сайту.
          </p>
          <p>
            5.3. Пользователь несет ответственность за все действия, совершенные
            с использованием его учетной записи, а также за сохранность своего
            логина и пароля.
          </p>

          <h2>Защита персональных данных</h2>
          <p>
            6.1. Администрация Сервиса обязуется соблюдать требования
            законодательства Российской Федерации о защите персональных данных и
            принимать все необходимые меры для обеспечения сохранности
            персональных данных Пользователей.
          </p>
          <p>
            6.2. Использование Сервиса означает согласие Пользователя на
            обработку его персональных данных. Подробная информация о защите
            персональных данных представлена в{' '}
            <Link href={routes.privacy}>Политике конфиденциальности</Link>,
            размещенной на Сайте.
          </p>

          <h2>Заключительные положения</h2>
          <p>
            7.1. Все споры и разногласия, возникающие между сторонами по
            настоящему Соглашению, должны быть решены путем переговоров. В
            случае недостижения согласия сторон, споры могут быть переданы на
            рассмотрение в судебный орган в соответствии с действующим
            законодательством Российской Федерации.
          </p>
          <p>
            7.2. Если одно или несколько положений настоящего Соглашения
            признаются недействительными или не имеющими юридической силы, это
            не влияет на действительность и силу остальных положений Соглашения.
          </p>
          <p>
            7.3. Настоящее Соглашение вступает в силу с момента его
            опубликования на Сайте и действует до момента отзыва согласия
            Пользователя с условиями Соглашения или до прекращения деятельности
            Сервиса.
          </p>

          <small className="mt-8 block w-full text-right font-bold text-gray-400">
            Последнее обновление: 20 апреля 2023.
          </small>
        </div>
      </div>
    </Layout>
  );
}
