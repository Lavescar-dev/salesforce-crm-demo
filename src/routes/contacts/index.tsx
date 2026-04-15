import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  DownloadIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-qwik";
import { useDemoData } from "~/data/demo-state";
import { MetricCard } from "~/components/metric-card";
import { type Contact } from "~/data/mock-data";
import { downloadCsv } from "~/utils/download-csv";
import { useLocale } from "~/data/i18n";

const contactCopy = {
  en: {
    title: "Contacts",
    intro: "Manage your contacts and relationships",
    newContact: "New Contact",
    totalContacts: "Total Contacts",
    emailVerified: "Email Verified",
    phoneAvailable: "Phone Available",
    activeContacts: (count: number) => `${count} active contacts`,
    allVerified: "All contacts verified",
    completeInfo: "Complete contact info",
    statusLabels: {
      All: "All",
      Active: "Active",
      Inactive: "Inactive",
    },
    searchPlaceholder: "Search contacts by name, account, or email...",
    filters: "Filters",
    export: "Export",
    table: {
      name: "Name",
      title: "Title",
      account: "Account",
      email: "Email",
      phone: "Phone",
      status: "Status",
      actions: "Actions",
    },
    view: "View",
    contact: "Contact",
    empty: "No contacts found matching your criteria",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} contacts`,
    previous: "Previous",
    next: "Next",
    csvHeaders: ["Name", "Title", "Account", "Email", "Phone", "Status"],
  },
  tr: {
    title: "Kişiler",
    intro: "Kişilerinizi ve ilişkilerinizi yönetin",
    newContact: "Yeni Kişi",
    totalContacts: "Toplam Kişi",
    emailVerified: "E-posta Doğrulandı",
    phoneAvailable: "Telefon Mevcut",
    activeContacts: (count: number) => `${count} aktif kişi`,
    allVerified: "Tüm kişiler doğrulandı",
    completeInfo: "Eksiksiz iletişim bilgisi",
    statusLabels: {
      All: "Tümü",
      Active: "Aktif",
      Inactive: "Pasif",
    },
    searchPlaceholder: "İsme, hesaba veya e-postaya göre kişi ara...",
    filters: "Filtreler",
    export: "Dışa Aktar",
    table: {
      name: "Ad",
      title: "Unvan",
      account: "Hesap",
      email: "E-posta",
      phone: "Telefon",
      status: "Durum",
      actions: "İşlemler",
    },
    view: "Görüntüle",
    contact: "İletişim",
    empty: "Kriterlerinize uyan kişi bulunamadı",
    showing: (shown: number, total: number) =>
      `${shown} / ${total} kişi gösteriliyor`,
    previous: "Önceki",
    next: "Sonraki",
    csvHeaders: ["Ad", "Unvan", "Hesap", "E-posta", "Telefon", "Durum"],
  },
} as const;

export default component$(() => {
  const locale = useLocale();
  const copy = contactCopy[locale.value];
  const csvHeaders = [...copy.csvHeaders];
  const demoData = useDemoData();
  const searchQuery = useSignal("");
  const statusFilter = useSignal<string>("All");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Kişiler" : "Contacts";
  });

  const filteredContacts = demoData.contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contact.account.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      statusFilter.value === "All" || contact.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: demoData.contacts.length,
    Active: demoData.contacts.filter((item) => item.status === "Active").length,
    Inactive: demoData.contacts.filter((item) => item.status === "Inactive")
      .length,
  };

  const getStatusColor = (status: Contact["status"]) =>
    status === "Active"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-slate-100 text-slate-800";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getAvatarColor = (id: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-violet-500 to-violet-600",
      "from-emerald-500 to-emerald-600",
      "from-amber-500 to-amber-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
    ];
    const index = Number.parseInt(id, 10) % colors.length;
    return colors[index];
  };

  const handleExport = $(() => {
    downloadCsv(
      "contacts.csv",
      csvHeaders,
      filteredContacts.map((contact) => [
        contact.name,
        contact.title,
        contact.account,
        contact.email,
        contact.phone,
        contact.status,
      ]),
    );
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {copy.title}
          </h1>
          <p class="mt-1 text-sm text-slate-600 sm:text-base">{copy.intro}</p>
        </div>
        <Link
          href="/contacts/new"
          class="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <PlusIcon class="h-5 w-5" />
          {copy.newContact}
        </Link>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
        <MetricCard
          title={copy.totalContacts}
          value={filteredContacts.length}
          subtitle={copy.activeContacts(statusCounts.Active)}
          icon={UserIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.emailVerified}
          value={filteredContacts.length}
          subtitle={copy.allVerified}
          icon={MailIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.phoneAvailable}
          value={filteredContacts.length}
          subtitle={copy.completeInfo}
          icon={PhoneIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
        />
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick$={() => {
              statusFilter.value = status;
            }}
            class={[
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition",
              statusFilter.value === status
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {copy.statusLabels[status as keyof typeof copy.statusLabels]} (
            {count})
          </button>
        ))}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div class="relative flex-1">
            <SearchIcon class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchQuery.value}
              onInput$={(event) => {
                searchQuery.value = (event.target as HTMLInputElement).value;
              }}
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <button class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <FilterIcon class="h-5 w-5" />
            <span>{copy.filters}</span>
          </button>
          <button
            type="button"
            onClick$={handleExport}
            class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <DownloadIcon class="h-5 w-5" />
            <span>{copy.export}</span>
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="border-b border-slate-200 bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.name}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell sm:px-6">
                  {copy.table.title}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell sm:px-6">
                  {copy.table.account}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell sm:px-6">
                  {copy.table.email}
                </th>
                <th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell sm:px-6">
                  {copy.table.phone}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.status}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  {copy.table.actions}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} class="transition hover:bg-slate-50/70">
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(contact.id)}`}
                      >
                        <span class="text-sm font-semibold text-white">
                          {getInitials(contact.name)}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <h3 class="truncate text-sm font-medium text-slate-900">
                          {contact.name}
                        </h3>
                        <p class="mt-1 text-xs text-slate-500 md:hidden">
                          {contact.title}
                        </p>
                        <p class="mt-1 text-xs text-slate-500 lg:hidden">
                          {contact.account}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="hidden px-4 py-3 text-sm text-slate-700 md:table-cell sm:px-6 sm:py-4">
                    {contact.title}
                  </td>
                  <td class="hidden px-4 py-3 text-sm text-slate-700 lg:table-cell sm:px-6 sm:py-4">
                    {contact.account}
                  </td>
                  <td class="hidden px-4 py-3 text-sm text-slate-700 xl:table-cell sm:px-6 sm:py-4">
                    <a
                      href={`mailto:${contact.email}`}
                      class="break-all text-blue-700 transition hover:text-blue-800"
                    >
                      {contact.email}
                    </a>
                  </td>
                  <td class="hidden px-4 py-3 text-sm text-slate-700 xl:table-cell sm:px-6 sm:py-4">
                    <a
                      href={`tel:${contact.phone}`}
                      class="text-blue-700 transition hover:text-blue-800"
                    >
                      {contact.phone}
                    </a>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contact.status)}`}
                    >
                      {
                        copy.statusLabels[
                          contact.status as keyof typeof copy.statusLabels
                        ]
                      }
                    </span>
                  </td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <div class="flex items-center gap-2">
                      <Link
                        href={`/contacts/${contact.id}`}
                        class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                      >
                        {copy.view}
                      </Link>
                      <span class="text-slate-300">|</span>
                      <a
                        href={`mailto:${contact.email}`}
                        class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                      >
                        {copy.contact}
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-slate-500">{copy.empty}</p>
          </div>
        ) : null}
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-600">
            {copy.showing(filteredContacts.length, demoData.contacts.length)}
          </p>
          <div class="flex gap-2">
            <button class="rounded-xl border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-50">
              {copy.previous}
            </button>
            <button class="rounded-xl bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700">
              1
            </button>
            <button class="rounded-xl border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-50">
              {copy.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contacts",
  meta: [
    {
      name: "description",
      content: "Browse contacts in the Qwik CRM demo.",
    },
  ],
};
