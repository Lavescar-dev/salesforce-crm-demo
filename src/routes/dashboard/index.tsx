import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-qwik";
import { LeadSourcesPieChart } from "~/components/lead-sources-pie-chart";
import { MetricCard } from "~/components/metric-card";
import { SalesFunnelChart } from "~/components/sales-funnel-chart";
import { useDemoData } from "~/data/demo-state";

import { dashboardCopy, type Locale, useLocale } from "~/data/i18n";

const formatMoney = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const opportunityStageLabels = {
  en: {
    Prospecting: "Prospecting",
    Qualification: "Qualification",
    Proposal: "Proposal",
    Negotiation: "Negotiation",
    "Closed Won": "Closed Won",
    "Closed Lost": "Closed Lost",
  },
  tr: {
    Prospecting: "Keşif",
    Qualification: "Nitelendirme",
    Proposal: "Teklif",
    Negotiation: "Müzakere",
    "Closed Won": "Kazanıldı",
    "Closed Lost": "Kayıp",
  },
} as const;

const translateOpportunityStage = (stage: string, locale: Locale) =>
  opportunityStageLabels[locale][
    stage as keyof (typeof opportunityStageLabels)["en"]
  ] ?? stage;

const getOpportunityStageClass = (stage: string) => {
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

export default component$(() => {
  const locale = useLocale();
  const copy = dashboardCopy[locale.value];
  const demoData = useDemoData();
  const totalLeads = 42;
  const hotLeads = 18;
  const qualifiedLeads = 10;
  const totalOpportunities = 32;
  const closingSoon = 5;
  const totalPipelineValue = 8_495_000;
  const highValueDeals = 13;
  const wonThisMonth = 0;
  const leadConversionRate = 24;
  const avgDealSize = 265_469;
  const winRate = 68;
  const pipelineCoverage = 19;
  const topOpportunities = [...demoData.opportunities]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const funnelData = [
    {
      id: "funnel-prospecting",
      stage: copy.funnelStages.prospecting,
      deals: 5,
      rate: 71.4,
    },
    {
      id: "funnel-qualification",
      stage: copy.funnelStages.qualification,
      deals: 7,
      rate: 100,
    },
    {
      id: "funnel-proposal",
      stage: copy.funnelStages.proposal,
      deals: 5,
      rate: 71.4,
    },
    {
      id: "funnel-negotiation",
      stage: copy.funnelStages.negotiation,
      deals: 3,
      rate: 42.9,
    },
    {
      id: "funnel-closed",
      stage: copy.funnelStages.closedWon,
      deals: 1,
      rate: 14.3,
    },
  ];
  const leadSourceData = [
    {
      id: "source-website",
      name: copy.leadSources.website,
      value: 15,
      color: "#3b82f6",
    },
    {
      id: "source-referral",
      name: copy.leadSources.referral,
      value: 10,
      color: "#10b981",
    },
    {
      id: "source-events",
      name: copy.leadSources.events,
      value: 8,
      color: "#f59e0b",
    },
    {
      id: "source-cold-call",
      name: copy.leadSources.coldCall,
      value: 5,
      color: "#8b5cf6",
    },
    {
      id: "source-social",
      name: copy.leadSources.social,
      value: 4,
      color: "#ec4899",
    },
  ];
  const pipelineHealthCards = [
    {
      id: "health-strong",
      title: copy.pipelineHealthCards.strong.title,
      description: copy.pipelineHealthCards.strong.description(
        formatMoney(totalPipelineValue, locale.value),
      ),
      icon: CheckCircleIcon,
      tone: "emerald",
    },
    {
      id: "health-followup",
      title: copy.pipelineHealthCards.followUp.title,
      description: copy.pipelineHealthCards.followUp.description(hotLeads),
      icon: AlertCircleIcon,
      tone: "amber",
    },
    {
      id: "health-closing",
      title: copy.pipelineHealthCards.closingSoon.title,
      description:
        copy.pipelineHealthCards.closingSoon.description(closingSoon),
      icon: ClockIcon,
      tone: "blue",
    },
  ] as const;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => locale.value);
    document.title =
      locale.value === "tr" ? "Satış Komuta Merkezi" : "Sales Command Center";
  });

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {copy.title}
          </h1>
          <p class="mt-1 max-w-3xl text-sm text-slate-600 sm:text-base">
            {copy.intro}
          </p>
        </div>
        <div class="text-xs text-slate-500 sm:text-sm">
          {copy.lastUpdated}:{" "}
          {new Date().toLocaleString(
            locale.value === "tr" ? "tr-TR" : "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <MetricCard
          title={copy.metrics.pipelineCoverage}
          value={`${pipelineCoverage}x`}
          subtitle={copy.subtitles.againstQuarterlyTarget}
          icon={TrendingUpIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.metrics.conversion}
          value={`${leadConversionRate}%`}
          subtitle={`${qualifiedLeads} ${copy.subtitles.qualifiedLeads}`}
          icon={TargetIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.metrics.dealsClosingSoon}
          value={closingSoon}
          subtitle={copy.subtitles.within30Days}
          change="12%"
          changeType="positive"
          icon={ClockIcon}
          iconColor="text-amber-600"
          badgeClass="bg-amber-50"
        />
        <MetricCard
          title={copy.metrics.totalLeads}
          value={totalLeads}
          subtitle={`${hotLeads} ${copy.subtitles.hotLeads}`}
          change="8%"
          changeType="positive"
          icon={UsersIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <MetricCard
          title={copy.metrics.openOpportunities}
          value={totalOpportunities}
          subtitle={`${closingSoon} ${copy.subtitles.closingWithin30Days}`}
          change="15%"
          changeType="positive"
          icon={TargetIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.metrics.totalPipelineValue}
          value={formatMoney(totalPipelineValue, locale.value)}
          subtitle={`${highValueDeals} ${copy.subtitles.highValueDeals}`}
          change="3%"
          changeType="positive"
          icon={DollarSignIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.metrics.wonThisMonth}
          value={wonThisMonth}
          subtitle={copy.subtitles.vsLastMonth}
          icon={CheckCircleIcon}
          iconColor="text-slate-500"
          badgeClass="bg-slate-50"
          changeType="neutral"
        />
        <MetricCard
          title={copy.metrics.winRate}
          value={`${winRate}%`}
          subtitle={copy.subtitles.last90Days}
          icon={TrendingUpIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
          changeType="positive"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        <MetricCard
          title={copy.metrics.leadConversionRate}
          value={`${leadConversionRate}%`}
          subtitle={
            locale.value === "tr"
              ? `${qualifiedLeads} / ${totalLeads} lead niteliklendi`
              : `${qualifiedLeads} of ${totalLeads} leads qualified`
          }
          icon={TargetIcon}
          iconColor="text-blue-600"
          badgeClass="bg-blue-50"
        />
        <MetricCard
          title={copy.metrics.averageDealSize}
          value={formatMoney(avgDealSize, locale.value)}
          subtitle={copy.subtitles.acrossAllOpenOpportunities}
          icon={DollarSignIcon}
          iconColor="text-emerald-600"
          badgeClass="bg-emerald-50"
        />
        <MetricCard
          title={copy.metrics.winRate}
          value={`${winRate}%`}
          subtitle={copy.subtitles.last90Days}
          icon={TrendingUpIcon}
          iconColor="text-violet-600"
          badgeClass="bg-violet-50"
        />
      </div>

      <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
        <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
          {copy.executiveNotes}
        </h2>
        <div class="space-y-3 sm:space-y-4">
          <div class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 sm:p-4">
            <CheckCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-emerald-900">
                {copy.notes.bestMomentum}
              </p>
              <p class="mt-1 text-xs text-emerald-700 sm:text-sm">
                {copy.notes.bestMomentumBody(highValueDeals)}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
            <AlertCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-amber-900">
                {copy.notes.attentionNeeded}
              </p>
              <p class="mt-1 text-xs text-amber-700 sm:text-sm">
                {copy.notes.attentionNeededBody(hotLeads)}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <TrendingUpIcon class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-blue-900">
                {copy.notes.executionQuality}
              </p>
              <p class="mt-1 text-xs text-blue-700 sm:text-sm">
                {copy.notes.executionQualityBody(wonThisMonth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
            {copy.salesFunnel}
          </h2>
          <SalesFunnelChart data={funnelData} />
        </div>

        <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
          <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
            {copy.leadSourcesHeading}
          </h2>
          <div class="space-y-4">
            <LeadSourcesPieChart data={leadSourceData} />
          </div>
        </div>
      </div>

      <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
        <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
          {copy.pipelineHealth}
        </h2>
        <div class="grid grid-cols-1 gap-3 xl:grid-cols-3">
          {pipelineHealthCards.map((card) => {
            const Icon = card.icon;
            const toneClasses =
              card.tone === "emerald"
                ? {
                    border: "border-emerald-200",
                    background: "bg-emerald-50",
                    icon: "bg-emerald-100 text-emerald-600",
                    title: "text-emerald-800",
                    text: "text-emerald-700",
                  }
                : card.tone === "amber"
                  ? {
                      border: "border-amber-200",
                      background: "bg-amber-50",
                      icon: "bg-amber-100 text-amber-600",
                      title: "text-amber-800",
                      text: "text-amber-700",
                    }
                  : {
                      border: "border-blue-200",
                      background: "bg-blue-50",
                      icon: "bg-blue-100 text-blue-600",
                      title: "text-blue-800",
                      text: "text-blue-700",
                    };

            return (
              <div
                key={card.id}
                class={`rounded-xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:p-5 ${toneClasses.border} ${toneClasses.background}`}
              >
                <div class="flex items-start gap-3">
                  <div
                    class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses.icon}`}
                  >
                    <Icon class="h-5 w-5" />
                  </div>
                  <div class="min-w-0">
                    <p class={`text-sm font-medium ${toneClasses.title}`}>
                      {card.title}
                    </p>
                    <p class={`mt-1 text-xs sm:text-sm ${toneClasses.text}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-base font-semibold text-slate-900 sm:text-lg">
            {copy.topOpportunities}
          </h2>
          <span class="text-xs text-slate-500 sm:text-sm">
            {copy.largestDeals}
          </span>
        </div>
        <div class="overflow-x-auto">
          <div class="flex min-w-max gap-4 pb-1">
            {topOpportunities.map((opportunity) => (
              <Link
                key={opportunity.id}
                href={`/opportunities/${opportunity.id}`}
                class="group flex w-67.5 flex-none flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-900">
                      {opportunity.name}
                    </p>
                    <p class="mt-1 truncate text-xs text-slate-500">
                      {opportunity.account}
                    </p>
                  </div>
                  <span class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    {opportunity.probability}%
                  </span>
                </div>

                <div class="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                  <p class="text-xs text-slate-500">
                    {copy.topOppLabels.stage}
                  </p>
                  <div class="text-right">
                    <span
                      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOpportunityStageClass(opportunity.stage)}`}
                    >
                      {translateOpportunityStage(
                        opportunity.stage,
                        locale.value,
                      )}
                    </span>
                  </div>

                  <p class="text-xs text-slate-500">
                    {copy.topOppLabels.value}
                  </p>
                  <p class="text-right text-sm font-semibold text-slate-900">
                    {formatMoney(opportunity.value, locale.value)}
                  </p>

                  <p class="text-xs text-slate-500">
                    {copy.topOppLabels.owner}
                  </p>
                  <p class="text-right text-sm font-medium text-slate-700">
                    {opportunity.owner}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sales Command Center",
  meta: [
    {
      name: "description",
      content:
        "Qwik CRM demo dashboard with sales pipeline, lead source, and forecast views.",
    },
  ],
};
