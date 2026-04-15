import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  EditIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useDemoData } from "~/data/demo-state";
import { updateOpportunity } from "~/data/mock-data";
import { useLocale } from "~/data/i18n";

const opportunityDetailCopy = {
  en: {
    notFound: "Opportunity not found",
    back: "Back to Opportunities",
    markWon: "Mark Won",
    edit: "Edit Opportunity",
    probability: (value: number) => `${value}% probability`,
    highValue: "High value",
    value: "Value",
    closeDate: "Close Date",
    daysLeft: "Days Left",
    dealHealth: "Deal Health",
    engagement: "Engagement",
    solutionFit: "Solution Fit",
    forecastConfidence: "Forecast Confidence",
    activityTimeline: "Activity Timeline",
    relatedAccount: "Related Account",
    type: "Type",
    status: "Status",
    openAccount: "Open Account",
    noAccountRecord: "No account record available.",
    stakeholders: "Stakeholders",
    noStakeholders: "No stakeholders linked to this opportunity's account yet.",
    nextSteps: "Next Steps",
    nextStepItems: [
      "Send revised implementation timeline to the buying committee.",
      "Confirm security review completion before legal handoff.",
      "Finalize pricing approval ahead of the close date.",
    ],
  },
  tr: {
    notFound: "Fırsat bulunamadı",
    back: "Fırsatlara geri dön",
    markWon: "Kazanıldı Olarak İşaretle",
    edit: "Fırsatı Düzenle",
    probability: (value: number) => `%${value} olasılık`,
    highValue: "Yüksek değer",
    value: "Değer",
    closeDate: "Kapanış Tarihi",
    daysLeft: "Kalan Gün",
    dealHealth: "Fırsat Sağlığı",
    engagement: "Etkileşim",
    solutionFit: "Çözüm Uyumu",
    forecastConfidence: "Tahmin Güveni",
    activityTimeline: "Aktivite Zaman Çizelgesi",
    relatedAccount: "İlgili Hesap",
    type: "Tür",
    status: "Durum",
    openAccount: "Hesabı Aç",
    noAccountRecord: "Kullanılabilir hesap kaydı yok.",
    stakeholders: "Paydaşlar",
    noStakeholders: "Bu fırsatın hesabına bağlı paydaş henüz yok.",
    nextSteps: "Sonraki Adımlar",
    nextStepItems: [
      "Gözden geçirilmiş uygulama zaman çizelgesini satın alma komitesine gönder.",
      "Yasal devir öncesinde güvenlik incelemesinin tamamlandığını doğrula.",
      "Kapanış tarihinden önce fiyat onayını tamamla.",
    ],
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.params.id;
  const opportunity = demoData.opportunities.find((item) => item.id === id);
  const copy = opportunityDetailCopy[locale.value];
  const localeCode = locale.value === "tr" ? "tr-TR" : "en-US";

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title =
      locale.value === "tr" ? "Fırsat Detayı" : "Opportunity Detail";
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospecting":
        return "bg-slate-100 text-slate-800";
      case "Qualification":
        return "bg-amber-100 text-amber-800";
      case "Proposal":
        return "bg-blue-100 text-blue-800";
      case "Negotiation":
        return "bg-violet-100 text-violet-800";
      case "Closed Won":
        return "bg-emerald-100 text-emerald-800";
      case "Closed Lost":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (!opportunity) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/opportunities"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  const relatedAccount = demoData.accounts.find(
    (item) => item.name === opportunity.account,
  );
  const relatedContacts = demoData.contacts.filter(
    (item) => item.account === opportunity.account,
  );
  const canMarkWon =
    opportunity.stage !== "Closed Won" && opportunity.stage !== "Closed Lost";
  const daysToClose =
    opportunity.daysToClose ??
    Math.max(
      Math.ceil(
        (new Date(opportunity.closeDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      0,
    );
  const surfaceCardClass =
    "group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6";

  const activity = [
    {
      title:
        locale.value === "tr" ? "Teklif gözden geçirildi" : "Proposal reviewed",
      description:
        locale.value === "tr"
          ? "Satış mühendisliği fiyatlandırma ve uygulama kapsamını onayladı."
          : "Sales engineering confirmed pricing and implementation scope.",
      time: locale.value === "tr" ? "Bugün" : "Today",
      icon: CheckCircleIcon,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title:
        locale.value === "tr"
          ? "Paydaş görüşmesi tamamlandı"
          : "Stakeholder call completed",
      description:
        locale.value === "tr"
          ? "Finans ve operasyon liderliğiyle keşif görüşmesi tamamlandı."
          : "Discovery call with finance and operations leadership finished.",
      time: locale.value === "tr" ? "2 gün önce" : "2 days ago",
      icon: UsersIcon,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title:
        locale.value === "tr"
          ? "Kapanış tarihi güncellendi"
          : "Close date updated",
      description:
        locale.value === "tr"
          ? `Tahmin mevcut kapanış tarihi ${opportunity.closeDate} için güncellendi.`
          : `Forecast adjusted for ${opportunity.closeDate}.`,
      time: locale.value === "tr" ? "4 gün önce" : "4 days ago",
      icon: ClockIcon,
      color: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/opportunities"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {opportunity.name}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {opportunity.account}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            disabled={!canMarkWon}
            onClick$={() => {
              if (!canMarkWon) {
                return;
              }
              updateOpportunity(demoData, id, {
                stage: "Closed Won",
                probability: 100,
              });
              navigate(`/opportunities/${id}?action=won`);
            }}
            class={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 sm:px-4",
              canMarkWon
                ? "border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50"
                : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400",
            ].join(" ")}
          >
            <CheckCircleIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.markWon}</span>
          </button>
          <Link
            href={`/opportunities/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.edit}</span>
          </Link>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStageColor(opportunity.stage)}`}
        >
          {opportunity.stage}
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3 sm:text-sm">
          {copy.probability(opportunity.probability)}
        </span>
        {opportunity.isHighValue ? (
          <span class="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 sm:px-3 sm:text-sm">
            {copy.highValue}
          </span>
        ) : null}
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class={surfaceCardClass}>
              <div class="mb-2 flex items-center gap-3">
                <div class="rounded-xl bg-blue-50 p-2 transition duration-200 group-hover:scale-105">
                  <DollarSignIcon class="h-5 w-5 text-blue-600" />
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.value}
                </p>
              </div>
              <p class="text-2xl font-semibold text-slate-900">
                ${opportunity.value.toLocaleString()}
              </p>
            </div>

            <div class={surfaceCardClass}>
              <div class="mb-2 flex items-center gap-3">
                <div class="rounded-xl bg-emerald-50 p-2 transition duration-200 group-hover:scale-105">
                  <TargetIcon class="h-5 w-5 text-emerald-600" />
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {locale.value === "tr" ? "Olasılık" : "Probability"}
                </p>
              </div>
              <p class="text-2xl font-semibold text-slate-900">
                {opportunity.probability}%
              </p>
            </div>

            <div class={surfaceCardClass}>
              <div class="mb-2 flex items-center gap-3">
                <div class="rounded-xl bg-amber-50 p-2 transition duration-200 group-hover:scale-105">
                  <CalendarIcon class="h-5 w-5 text-amber-600" />
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.closeDate}
                </p>
              </div>
              <p class="text-2xl font-semibold text-slate-900">
                {new Date(opportunity.closeDate).toLocaleDateString(localeCode)}
              </p>
            </div>

            <div class={surfaceCardClass}>
              <div class="mb-2 flex items-center gap-3">
                <div class="rounded-xl bg-violet-50 p-2 transition duration-200 group-hover:scale-105">
                  <ClockIcon class="h-5 w-5 text-violet-600" />
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.daysLeft}
                </p>
              </div>
              <p class="text-2xl font-semibold text-slate-900">{daysToClose}</p>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.dealHealth}
            </h2>
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium text-slate-700">
                    {copy.engagement}
                  </span>
                  <span class="text-slate-500">88%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full w-[88%] rounded-full bg-blue-500" />
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium text-slate-700">
                    {copy.solutionFit}
                  </span>
                  <span class="text-slate-500">82%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full w-[82%] rounded-full bg-emerald-500" />
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium text-slate-700">
                    {copy.forecastConfidence}
                  </span>
                  <span class="text-slate-500">74%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full w-[74%] rounded-full bg-violet-500" />
                </div>
              </div>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.activityTimeline}
            </h2>
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
                    <div class="min-w-0 flex-1 pb-6">
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

        <div class="space-y-4 sm:space-y-6">
          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.relatedAccount}
            </h3>
            {relatedAccount ? (
              <div class="space-y-4">
                <div>
                  <p class="text-base font-semibold text-slate-900">
                    {relatedAccount.name}
                  </p>
                  <p class="mt-1 text-sm text-slate-600">
                    {relatedAccount.industry}
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div class="rounded-xl bg-slate-50 p-3 transition duration-200 group-hover:bg-slate-100/70">
                    <p class="text-xs text-slate-500">{copy.type}</p>
                    <p class="mt-1 font-medium text-slate-900">
                      {relatedAccount.type}
                    </p>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-3 transition duration-200 group-hover:bg-slate-100/70">
                    <p class="text-xs text-slate-500">{copy.status}</p>
                    <p class="mt-1 font-medium text-slate-900">
                      {relatedAccount.status}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/accounts/${relatedAccount.id}`}
                  class="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  {copy.openAccount}
                </Link>
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noAccountRecord}</p>
            )}
          </div>

          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.stakeholders}
            </h3>
            {relatedContacts.length > 0 ? (
              <div class="space-y-3">
                {relatedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3 transition duration-200 hover:bg-slate-100/70"
                  >
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium text-slate-900">
                        {contact.name}
                      </p>
                      <p class="truncate text-xs text-slate-500">
                        {contact.title}
                      </p>
                    </div>
                    <span class="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {contact.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noStakeholders}</p>
            )}
          </div>

          <div class={surfaceCardClass}>
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.nextSteps}
            </h3>
            <ul class="space-y-3 text-sm text-slate-600">
              <li class="flex gap-3">
                <span class="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                {copy.nextStepItems[0]}
              </li>
              <li class="flex gap-3">
                <span class="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                {copy.nextStepItems[1]}
              </li>
              <li class="flex gap-3">
                <span class="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                {copy.nextStepItems[2]}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Opportunity Detail",
  meta: [
    {
      name: "description",
      content: "Inspect an opportunity in the Qwik CRM demo.",
    },
  ],
};
