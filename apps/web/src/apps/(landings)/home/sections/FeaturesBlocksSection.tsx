export default function FeaturesBlocksSection() {
  return (
    <section className="relative" id="how-it-work">
      <div
        className="pointer-events-none absolute inset-0 top-1/2 bg-gray-900 md:mt-24 lg:mt-0"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 m-auto h-20 w-px translate-y-1/2 bg-gray-200 p-px" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <h2 className="h2 mb-4">Как это работает?</h2>
            <p className="text-xl text-gray-600">
              Мы предлагаем простой и удобный способ сотрудничества для
              разработчиков и заказчиков на одной платформе.
            </p>
          </div>

          <div className="mx-auto grid max-w-sm items-start gap-6 md:max-w-2xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            <div className="relative flex flex-col items-center rounded bg-white p-6 shadow-xl">
              <svg
                className="-mt-1 mb-2 h-16 w-16 p-1"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <rect
                    className="fill-current text-blue-600"
                    width="64"
                    height="64"
                    rx="32"
                  />
                  <g strokeWidth="2">
                    <path
                      className="stroke-current text-blue-300"
                      d="M34.514 35.429l2.057 2.285h8M20.571 26.286h5.715l2.057 2.285"
                    />
                    <path
                      className="stroke-current text-white"
                      d="M20.571 37.714h5.715L36.57 26.286h8"
                    />
                    <path
                      className="stroke-current text-blue-300"
                      strokeLinecap="square"
                      d="M41.143 34.286l3.428 3.428-3.428 3.429"
                    />
                    <path
                      className="stroke-current text-white"
                      strokeLinecap="square"
                      d="M41.143 29.714l3.428-3.428-3.428-3.429"
                    />
                  </g>
                </g>
              </svg>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight">
                Первый контакт
              </h4>
              <p className="text-center text-gray-600">
                Зарегистрируйтесь на платформе и начните поиск проектов или
                исполнителей.
              </p>
            </div>

            <div className="relative flex flex-col items-center rounded bg-white p-6 shadow-xl">
              <svg
                className="-mt-1 mb-2 h-16 w-16 p-1"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <rect
                    className="fill-current text-blue-600"
                    width="64"
                    height="64"
                    rx="32"
                  />
                  <g strokeWidth="2" transform="translate(19.429 20.571)">
                    <circle
                      className="stroke-current text-white"
                      strokeLinecap="square"
                      cx="12.571"
                      cy="12.571"
                      r="1.143"
                    />
                    <path
                      className="stroke-current text-white"
                      d="M19.153 23.267c3.59-2.213 5.99-6.169 5.99-10.696C25.143 5.63 19.514 0 12.57 0 5.63 0 0 5.629 0 12.571c0 4.527 2.4 8.483 5.99 10.696"
                    />
                    <path
                      className="stroke-current text-blue-300"
                      d="M16.161 18.406a6.848 6.848 0 003.268-5.835 6.857 6.857 0 00-6.858-6.857 6.857 6.857 0 00-6.857 6.857 6.848 6.848 0 003.268 5.835"
                    />
                  </g>
                </g>
              </svg>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight">
                Обсуждение проекта
              </h4>
              <p className="text-center text-gray-600">
                Свяжитесь с разработчиком или заказчиком, обсудите детали
                проекта и условия сотрудничества.
              </p>
            </div>

            <div className="relative flex flex-col items-center rounded bg-white p-6 shadow-xl">
              <svg
                className="-mt-1 mb-2 h-16 w-16 p-1"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <rect
                    className="fill-current text-blue-600"
                    width="64"
                    height="64"
                    rx="32"
                  />
                  <g transform="translate(22.857 19.429)" strokeWidth="2">
                    <path
                      className="stroke-current text-white"
                      strokeLinecap="square"
                      d="M12.571 4.571V0H0v25.143h12.571V20.57"
                    />
                    <path
                      className="stroke-current text-white"
                      d="M16 12.571h8"
                    />
                    <path
                      className="stroke-current text-white"
                      strokeLinecap="square"
                      d="M19.429 8L24 12.571l-4.571 4.572"
                    />
                    <circle
                      className="stroke-current text-blue-300"
                      strokeLinecap="square"
                      cx="12.571"
                      cy="12.571"
                      r="3.429"
                    />
                  </g>
                </g>
              </svg>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight">
                Завершение и оплата
              </h4>
              <p className="text-center text-gray-600">
                После завершения работы убедитесь, что все условия выполнены. И
                проведите оплату.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
