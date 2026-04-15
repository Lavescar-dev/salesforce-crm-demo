import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { getAccountNames, updateOrder } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const orderEditCopy = {
  en: {
    notFound: "Order not found",
    back: "Back to Orders",
    title: "Edit Order",
    intro: "Update order information",
    orderInformation: "Order Information",
    orderNumber: "Order Number *",
    account: "Account *",
    selectAccount: "Select an account",
    amount: "Amount ($) *",
    status: "Status *",
    orderDate: "Order Date *",
    save: "Save Changes",
    cancel: "Cancel",
    statusLabels: {
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    },
  },
  tr: {
    notFound: "Sipariş bulunamadı",
    back: "Siparişlere geri dön",
    title: "Siparişi Düzenle",
    intro: "Sipariş bilgilerini güncelle",
    orderInformation: "Sipariş Bilgileri",
    orderNumber: "Sipariş No *",
    account: "Hesap *",
    selectAccount: "Bir hesap seçin",
    amount: "Tutar ($) *",
    status: "Durum *",
    orderDate: "Sipariş Tarihi *",
    save: "Değişiklikleri Kaydet",
    cancel: "İptal",
    statusLabels: {
      Processing: "İşleniyor",
      Shipped: "Kargolandı",
      Delivered: "Teslim Edildi",
      Cancelled: "İptal Edildi",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = orderEditCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const order = demoData.orders.find((item) => item.id === id);
  const accountOptions = getAccountNames(demoData);

  const formData = useStore({
    orderNumber: order?.orderNumber ?? "",
    account: order?.account ?? "",
    amount: order?.amount ?? 0,
    status: order?.status ?? "Processing",
    date: order?.date ?? "",
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Siparişi Düzenle" : "Edit Order";
  });

  if (!order) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/orders"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href={`/orders/${id}`}
          class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </Link>
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {copy.title}
          </h1>
          <p class="mt-1 text-sm text-slate-600 sm:text-base">{copy.intro}</p>
        </div>
      </div>

      <form
        preventdefault:submit
        onSubmit$={() => {
          updateOrder(demoData, id, formData);
          navigate(`/orders/${id}`);
        }}
        class="mx-auto w-full max-w-5xl"
      >
        <div class="group space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.orderInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="orderNumber"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.orderNumber}
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  value={formData.orderNumber}
                  onInput$={(event) => {
                    formData.orderNumber = (
                      event.target as HTMLInputElement
                    ).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="account"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.account}
                </label>
                <select
                  id="account"
                  value={formData.account}
                  onChange$={(event) => {
                    formData.account = (
                      event.target as HTMLSelectElement
                    ).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="" disabled>
                    {copy.selectAccount}
                  </option>
                  {accountOptions.map((accountName) => (
                    <option key={accountName} value={accountName}>
                      {accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  for="amount"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.amount}
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.amount}
                  onInput$={(event) => {
                    formData.amount =
                      Number.parseFloat(
                        (event.target as HTMLInputElement).value,
                      ) || 0;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="status"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.status}
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange$={(event) => {
                    formData.status = (event.target as HTMLSelectElement)
                      .value as
                      | "Processing"
                      | "Shipped"
                      | "Delivered"
                      | "Cancelled";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Processing">
                    {copy.statusLabels.Processing}
                  </option>
                  <option value="Shipped">{copy.statusLabels.Shipped}</option>
                  <option value="Delivered">
                    {copy.statusLabels.Delivered}
                  </option>
                  <option value="Cancelled">
                    {copy.statusLabels.Cancelled}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="date"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.orderDate}
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onInput$={(event) => {
                    formData.date = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:pt-6">
            <button
              type="submit"
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-6"
            >
              <SaveIcon class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-sm font-medium sm:text-base">{copy.save}</span>
            </button>
            <Link
              href={`/orders/${id}`}
              class="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-6 sm:text-base"
            >
              {copy.cancel}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Order",
  meta: [
    {
      name: "description",
      content: "Edit an order in the Qwik CRM demo.",
    },
  ],
};
