import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  Building2Icon,
  CalendarIcon,
  CheckCircleIcon,
  DollarSignIcon,
  EditIcon,
  ClockIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { DetailNotesPanel } from "~/components/detail-notes-panel";
import { useDemoData } from "~/data/demo-state";
import { useLocale } from "~/data/i18n";

const accountDetailCopy = {
  en: {
    notFound: "Account not found",
    back: "Back to Accounts",
    edit: "Edit Account",
    addContact: "Add Contact",
    createOpportunity: "Create Opportunity",
    revenue: "Revenue",
    employees: "Employees",
    openDeals: "Open Deals",
    highValue: "High Value",
    accountProfile: "Account Profile",
    industry: "Industry",
    type: "Type",
    status: "Status",
    owner: "Owner",
    relatedOpportunities: "Related Opportunities",
    noOpportunities: "No opportunities linked to this account yet.",
    opportunity: "Opportunity",
    stage: "Stage",
    value: "Value",
    keyContacts: "Key Contacts",
    noContacts: "No contacts linked to this account yet.",
    activity: "Activity",
    noteTitle: "Executive Notes",
    noteItems: [
      {
        title: "Best Momentum",
        text: "Strong account momentum with multiple active deals and consistent stakeholder coverage.",
      },
      {
        title: "Renewal Health",
        text: "Renewal and expansion motion are both healthy, with high confidence in the current quarter.",
      },
      {
        title: "Execution Quality",
        text: "Continue executive engagement to preserve momentum on late-stage opportunities.",
      },
    ],
    activityItems: [
      {
        title: "Quarterly business review completed",
        description:
          "Pipeline review and expansion plan signed off by the account owner.",
        time: "Today",
      },
      {
        title: "New opportunity created",
        description: "A new expansion deal was logged against the account.",
        time: "3 days ago",
      },
      {
        title: "Executive sponsor meeting",
        description:
          "Leadership sync covered roadmap, adoption, and renewal timing.",
        time: "1 week ago",
      },
    ],
    opportunityStages: {
      Prospecting: "Prospecting",
      Qualification: "Qualification",
      Proposal: "Proposal",
      Negotiation: "Negotiation",
      "Closed Won": "Closed Won",
      "Closed Lost": "Closed Lost",
    },
    accountTypes: {
      Enterprise: "Enterprise",
      "Mid-Market": "Mid-Market",
      "Small Business": "Small Business",
    },
    accountStatuses: {
      Active: "Active",
      Inactive: "Inactive",
      Prospect: "Prospect",
    },
  },
  tr: {
    notFound: "Hesap bulunamadı",
    back: "Hesaplara geri dön",
    edit: "Hesabı Düzenle",
    addContact: "Kişi Ekle",
    createOpportunity: "Fırsat Oluştur",
    revenue: "Gelir",
    employees: "Çalışan",
    openDeals: "Açık İşler",
    highValue: "Yüksek Değer",
    accountProfile: "Hesap Profili",
    industry: "Sektör",
    type: "Tür",
    status: "Durum",
    owner: "Sahip",
    relatedOpportunities: "İlgili Fırsatlar",
    noOpportunities: "Bu hesaba bağlı fırsat yok.",
    opportunity: "Fırsat",
    stage: "Aşama",
    value: "Değer",
    keyContacts: "Önemli Kişiler",
    noContacts: "Bu hesaba bağlı kişi yok.",
    activity: "Aktivite",
    noteTitle: "Yönetici Notları",
    noteItems: [
      {
        title: "En Güçlü Momentum",
        text: "Birden fazla aktif anlaşma ve düzenli paydaş kapsamı ile güçlü hesap ivmesi.",
      },
      {
        title: "Yenileme Sağlığı",
        text: "Yenileme ve genişleme akışı sağlıklı; mevcut çeyrekte güven yüksek.",
      },
      {
        title: "Yürütme Kalitesi",
        text: "Geç aşama fırsatlardaki ivmeyi korumak için yönetici temasını sürdürün.",
      },
    ],
    activityItems: [
      {
        title: "Çeyreklik iş incelemesi tamamlandı",
        description:
          "Pipeline incelemesi ve genişleme planı hesap sahibi tarafından onaylandı.",
        time: "Bugün",
      },
      {
        title: "Yeni fırsat oluşturuldu",
        description: "Hesaba yeni bir genişleme anlaşması eklendi.",
        time: "3 gün önce",
      },
      {
        title: "Yönetici sponsor görüşmesi",
        description:
          "Liderlik görüşmesi yol haritası, benimseme ve yenileme zamanlamasını ele aldı.",
        time: "1 hafta önce",
      },
    ],
    opportunityStages: {
      Prospecting: "Keşif",
      Qualification: "Nitelendirme",
      Proposal: "Teklif",
      Negotiation: "Müzakere",
      "Closed Won": "Kazanıldı",
      "Closed Lost": "Kayıp",
    },
    accountTypes: {
      Enterprise: "Kurumsal",
      "Mid-Market": "Orta Pazar",
      "Small Business": "Küçük İşletme",
    },
    accountStatuses: {
      Active: "Aktif",
      Inactive: "Pasif",
      Prospect: "Potansiyel",
    },
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = accountDetailCopy[locale.value];
  const location = useLocation();
  const id = location.params.id;
  const account = demoData.accounts.find((item) => item.id === id);
  const accountTypeLabel =
    copy.accountTypes[account?.type as keyof typeof copy.accountTypes] ??
    account?.type;
  const accountStatusLabel =
    copy.accountStatuses[
      account?.status as keyof typeof copy.accountStatuses
    ] ?? account?.status;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Hesap Detayı" : "Account Detail";
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Enterprise":
        return "bg-violet-100 text-violet-800";
      case "Mid-Market":
        return "bg-blue-100 text-blue-800";
      case "Small Business":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800";
      case "Inactive":
        return "bg-slate-100 text-slate-800";
      case "Prospect":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (!account) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/accounts"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  const relatedContacts = demoData.contacts.filter(
    (item) => item.account === account.name,
  );
  const relatedOpportunities = demoData.opportunities.filter(
    (item) => item.account === account.name,
  );
  const highValueDeals = relatedOpportunities.filter(
    (item) => item.isHighValue,
  ).length;
  const surfaceCardClass =
    "group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6";

  const activity = [
    {
      title: "Quarterly business review completed",
      description:
        "Pipeline review and expansion plan signed off by the account owner.",
      time: "Today",
      icon: Building2Icon,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "New opportunity created",
      description: "A new expansion deal was logged against the account.",
      time: "3 days ago",
      icon: TargetIcon,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Executive sponsor meeting",
      description:
        "Leadership sync covered roadmap, adoption, and renewal timing.",
      time: "1 week ago",
      icon: UsersIcon,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/accounts"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {account.name}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {account.industry}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/accounts/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.edit}</span>
          </Link>
          <Link
            href={`/contacts/new?account=${encodeURIComponent(account.name)}`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <UsersIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">
              {copy.addContact}
            </span>
          </Link>
          <Link
            href={`/opportunities/new?account=${encodeURIComponent(account.name)}&owner=${encodeURIComponent(account.owner)}`}
            class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-4"
          >
            <TargetIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">
              {copy.createOpportunity}
            </span>
          </Link>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getTypeColor(account.type)}`}
        >
          {accountTypeLabel}
        </span>
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(account.status)}`}
        >
          {accountStatusLabel}
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3 sm:text-sm">
          {account.owner}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-blue-50 p-2 transition duration-200 group-hover:scale-105">
              <DollarSignIcon class="h-5 w-5 text-blue-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.revenue}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            ${(account.revenue / 1_000_000).toFixed(1)}M
          </p>
        </div>

        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-emerald-50 p-2 transition duration-200 group-hover:scale-105">
              <UsersIcon class="h-5 w-5 text-emerald-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.employees}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            {account.employees.toLocaleString()}
          </p>
        </div>

        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-violet-50 p-2 transition duration-200 group-hover:scale-105">
              <TargetIcon class="h-5 w-5 text-violet-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.openDeals}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">
            {relatedOpportunities.length}
          </p>
        </div>

        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-amber-50 p-2 transition duration-200 group-hover:scale-105">
              <CalendarIcon class="h-5 w-5 text-amber-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.highValue}
            </p>
          </div>
          <p class="text-2xl font-semibold text-slate-900">{highValueDeals}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.accountProfile}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.industry}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {account.industry}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.type}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {accountTypeLabel}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.status}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {accountStatusLabel}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.owner}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {account.owner}
                </p>
              </div>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.relatedOpportunities}
            </h2>
            <div class="overflow-hidden rounded-xl border border-slate-200">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.opportunity}
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.stage}
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.value}
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {copy.owner}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white">
                    {relatedOpportunities.length > 0 ? (
                      relatedOpportunities.map((opp) => (
                        <tr
                          key={opp.id}
                          class="transition hover:bg-slate-50/70"
                        >
                          <td class="px-4 py-4">
                            <Link
                              href={`/opportunities/${opp.id}`}
                              class="text-sm font-medium text-blue-700 transition hover:text-blue-800"
                            >
                              {opp.name}
                            </Link>
                          </td>
                          <td class="px-4 py-4 text-sm text-slate-700">
                            {copy.opportunityStages[
                              opp.stage as keyof typeof copy.opportunityStages
                            ] ?? opp.stage}
                          </td>
                          <td class="px-4 py-4 text-sm font-semibold text-slate-900">
                            ${opp.value.toLocaleString()}
                          </td>
                          <td class="px-4 py-4 text-sm text-slate-700">
                            {opp.owner}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          class="px-4 py-8 text-center text-sm text-slate-500"
                          colSpan={4}
                        >
                          {copy.noOpportunities}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DetailNotesPanel
            title={copy.noteTitle}
            items={[
              {
                id: "momentum",
                title: copy.noteItems[0].title,
                text: copy.noteItems[0].text,
                icon: CheckCircleIcon,
                tone: "emerald",
              },
              {
                id: "renewal",
                title: copy.noteItems[1].title,
                text: copy.noteItems[1].text,
                icon: TargetIcon,
                tone: "blue",
              },
              {
                id: "engagement",
                title: copy.noteItems[2].title,
                text: copy.noteItems[2].text,
                icon: ClockIcon,
                tone: "violet",
              },
            ]}
          />
        </div>

        <div class="space-y-4 sm:space-y-6">
          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.keyContacts}
            </h3>
            {relatedContacts.length > 0 ? (
              <div class="space-y-3">
                {relatedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70"
                  >
                    <p class="text-sm font-medium text-slate-900">
                      {contact.name}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">{contact.title}</p>
                    <p class="mt-3 text-xs text-slate-600">{contact.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noContacts}</p>
            )}
          </div>

          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.activity}
            </h3>
            <div class="space-y-4">
              {activity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    class="group flex gap-3 rounded-xl px-2 py-2 transition duration-200 hover:bg-slate-50 sm:gap-4"
                  >
                    <div class="flex flex-col items-center flex-shrink-0">
                      <div
                        class={`flex h-8 w-8 items-center justify-center rounded-full transition duration-200 group-hover:scale-105 ${item.color}`}
                      >
                        <Icon class="h-4 w-4" />
                      </div>
                      {index < activity.length - 1 ? (
                        <div class="mt-2 h-full w-0.5 bg-slate-200" />
                      ) : null}
                    </div>
                    <div class="min-w-0 flex-1 pb-4">
                      <p class="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p class="mt-1 text-xs text-slate-600 sm:text-sm">
                        {item.description}
                      </p>
                      <p class="mt-2 text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Account Detail",
  meta: [
    {
      name: "description",
      content: "Inspect an account in the Qwik CRM demo.",
    },
  ],
};
