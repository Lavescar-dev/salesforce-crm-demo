import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ArrowLeftIcon, SaveIcon } from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { addContact, getAccountNames, type Contact } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const contactFormCopy = {
  en: {
    title: "New Contact",
    intro: "Add a new contact record",
    basicInformation: "Basic Information",
    fullName: "Full Name *",
    titleLabel: "Title *",
    account: "Account *",
    selectAccount: "Select an account",
    status: "Status *",
    contactDetails: "Contact Details",
    email: "Email *",
    phone: "Phone *",
    create: "Create Contact",
    cancel: "Cancel",
    statusLabels: {
      Active: "Active",
      Inactive: "Inactive",
    },
  },
  tr: {
    title: "Yeni Kişi",
    intro: "Yeni bir kişi kaydı ekleyin",
    basicInformation: "Temel Bilgiler",
    fullName: "Tam Ad *",
    titleLabel: "Unvan *",
    account: "Hesap *",
    selectAccount: "Bir hesap seçin",
    status: "Durum *",
    contactDetails: "İletişim Bilgileri",
    email: "E-posta *",
    phone: "Telefon *",
    create: "Kişi Oluştur",
    cancel: "İptal",
    statusLabels: {
      Active: "Aktif",
      Inactive: "Pasif",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = contactFormCopy[locale.value];
  const location = useLocation();
  const navigate = useNavigate();
  const accountOptions = getAccountNames(demoData);
  const searchAccount = location.url.searchParams.get("account") ?? "";
  const initialAccount = accountOptions.includes(searchAccount)
    ? searchAccount
    : "";
  const formData = useStore({
    name: "",
    title: "",
    account: initialAccount,
    email: "",
    phone: "",
    status: "Active" as Contact["status"],
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Yeni Kişi" : "New Contact";
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <Link
          href="/contacts"
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
          const createdContact = addContact(demoData, formData);
          navigate(`/contacts/${createdContact.id}`);
        }}
        class="mx-auto w-full max-w-5xl"
      >
        <div class="group space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <div>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.basicInformation}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="name"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.fullName}
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onInput$={(event) => {
                    formData.name = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="title"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.titleLabel}
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onInput$={(event) => {
                    formData.title = (event.target as HTMLInputElement).value;
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
                      .value as "Active" | "Inactive";
                  }}
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                >
                  <option value="Active">{copy.statusLabels.Active}</option>
                  <option value="Inactive">{copy.statusLabels.Inactive}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-4 sm:pt-6">
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.contactDetails}
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
              <div>
                <label
                  for="email"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onInput$={(event) => {
                    formData.email = (event.target as HTMLInputElement).value;
                  }}
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4"
                />
              </div>
              <div>
                <label
                  for="phone"
                  class="mb-2 block text-xs font-medium text-slate-700 sm:text-sm"
                >
                  {copy.phone}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onInput$={(event) => {
                    formData.phone = (event.target as HTMLInputElement).value;
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
              <span class="text-sm font-medium sm:text-base">
                {copy.create}
              </span>
            </button>
            <Link
              href="/contacts"
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
  title: "New Contact",
  meta: [
    {
      name: "description",
      content: "Create a new contact in the Qwik CRM demo.",
    },
  ],
};
