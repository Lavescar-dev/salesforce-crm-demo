import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import {
  ActivityIcon,
  AlertCircleIcon,
  BarChartIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  DatabaseIcon,
  DollarSignIcon,
  GlobeIcon,
  TargetIcon,
  TerminalIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-qwik";
import { buildDemoAccessHref } from "~/data/demo-access";
import { type Locale, useLocale } from "~/data/i18n";

const dict = {
  en: {
    navFeatures: "Features",
    navArch: "Architecture",
    navDocs: "Workspace",
    navLogin: "Search",
    navInit: "Open Platform",
    heroTitle: "Sales Command Center.",
    heroSubtitle:
      "Keep pipeline health, forecast confidence, and near-term execution in one polished workspace.",
    heroBody:
      "A Qwik CRM demo that brings dashboard, leads, opportunities, accounts, contacts, quotes, orders, and invoices into a single sales operating surface.",
    workspaceLabel: "Demo Workspace",
    snapshotStatus: "Live mock data, persisted in the browser",
    kpiValue: "Total Pipeline Value",
    kpiValueSub: "13 high-value deals",
    kpiLeads: "Total Leads",
    kpiLeadsSub: "18 hot leads",
    kpiOpps: "Open Opportunities",
    kpiOppsSub: "5 closing within 30 days",
    kpiConv: "Lead Conversion",
    kpiConvSub: "10 of 42 leads qualified",
    kpiCoverage: "Pipeline Coverage",
    kpiCoverageSub: "against quarterly target",
    kpiClosing: "Deals Closing Soon",
    kpiClosingSub: "within 30 days",
    kpiWinrate: "Win Rate",
    kpiWinrateSub: "Last 90 days",
    kpiAvgDeal: "Average Deal Size",
    kpiAvgDealSub: "Across all open opportunities",
    execNotes: "Executive Notes",
    execMomentum: "Best Momentum",
    execMomentumDesc:
      "13 enterprise opportunities. Large deal mix remains healthy with strong late-stage value.",
    execAttention: "Attention Needed",
    execAttentionDesc:
      "18 hot leads awaiting follow-up. Re-engaging these prospects quickly should improve conversion this week.",
    execQuality: "Execution Quality",
    execQualityDesc:
      "0 wins recorded this month. Closed business remains steady despite slightly slower month-over-month pace.",
    topOpps: "Top Opportunities",
    viewAll: "View all",
    dealName: "Deal Name",
    stage: "Stage",
    value: "Value",
    probability: "Probability",
    leadSources: "Lead Sources",
    pipelineHealth: "Pipeline Health",
    healthStrong: "Strong Pipeline",
    healthStrongDesc: "$8,495,000 in active opportunities",
    healthFollowup: "Follow-up Needed",
    healthFollowupDesc: "18 hot leads require attention",
    healthClosing: "Closing Soon",
    healthClosingDesc: "5 opportunities expected to close this month",
    ctaPrimary: "Open demo platform",
    ctaSecondary: "Review demo scope",
    featureOne: "Browser-persisted demo state",
    featureOneDesc:
      "Edits survive refresh without coupling the public demo to a private CRM.",
    featureTwo: "Revenue object coverage",
    featureTwoDesc:
      "Lead to invoice flows are represented with dense, practical CRM screens.",
    featureThree: "Client-ready localization",
    featureThreeDesc:
      "English and Turkish copy switch in place for walkthroughs.",
    architectureTitle: "Designed as a fast, isolated demo edge.",
    architectureEyebrow: "Cloudflare-ready architecture",
    architectureBody:
      "The product surface feels connected while remaining safe for public demos: mock data stays local, route behavior remains predictable, and the workspace loads without external services.",
    finalCtaTitle: "Ready for the walkthrough.",
    finalCtaBody:
      "Open the live workspace, move through the sales objects, and show a complete CRM path without depending on external services.",
  },
  tr: {
    navFeatures: "Özellikler",
    navArch: "Mimari",
    navDocs: "Workspace",
    navLogin: "Arama",
    navInit: "Platformu Aç",
    heroTitle: "Satış Komuta Merkezi.",
    heroSubtitle:
      "Pipeline sağlığını, tahmin güvenilirliğini ve yakın dönem operasyonları tek bir optimize arayüzde yönetin.",
    heroBody:
      "Dashboard, lead, fırsat, hesap, kişi, teklif, sipariş ve fatura akışlarını tek satış operasyon yüzeyinde gösteren Qwik CRM demosu.",
    workspaceLabel: "Demo Workspace",
    snapshotStatus: "Canlı mock veri, tarayıcıda kalıcı",
    kpiValue: "Toplam Pipeline Değeri",
    kpiValueSub: "13 yüksek değerli satış",
    kpiLeads: "Toplam Lead",
    kpiLeadsSub: "18 sıcak lead",
    kpiOpps: "Açık Fırsatlar",
    kpiOppsSub: "30 günde kapanacak 5",
    kpiConv: "Lead Dönüşümü",
    kpiConvSub: "42 lead'den 10'u nitelikli",
    kpiCoverage: "Pipeline Kapsamı",
    kpiCoverageSub: "çeyreklik hedefe göre",
    kpiClosing: "Yakın Kapanışlar",
    kpiClosingSub: "30 gün içinde",
    kpiWinrate: "Kazanma Oranı",
    kpiWinrateSub: "Son 90 gün",
    kpiAvgDeal: "Ortalama Satış Büyüklüğü",
    kpiAvgDealSub: "Tüm açık fırsatlarda",
    execNotes: "Yönetici Notları",
    execMomentum: "En İyi İvme",
    execMomentumDesc:
      "13 kurumsal fırsat. Büyük anlaşma karması, güçlü geç aşama değeriyle sağlıklı kalıyor.",
    execAttention: "Dikkat Gerektirenler",
    execAttentionDesc:
      "18 sıcak lead takip bekliyor. Bu potansiyel müşterilerle hızlıca yeniden etkileşime geçilmeli.",
    execQuality: "Yürütme Kalitesi",
    execQualityDesc:
      "Bu ay 0 kazanım. Aylık bazda hafif yavaşlamaya rağmen kapanan işler istikrarlı.",
    topOpps: "En İyi Fırsatlar",
    viewAll: "Tümünü gör",
    dealName: "Fırsat",
    stage: "Aşama",
    value: "Değer",
    probability: "Olasılık",
    leadSources: "Lead Kaynakları",
    pipelineHealth: "Pipeline Sağlığı",
    healthStrong: "Güçlü Pipeline",
    healthStrongDesc: "Aktif fırsatlarda $8,495,000",
    healthFollowup: "Takip Gerekiyor",
    healthFollowupDesc: "18 sıcak lead ilgi bekliyor",
    healthClosing: "Yakın Kapanış",
    healthClosingDesc: "Bu ay 5 fırsatın kapanması bekleniyor",
    ctaPrimary: "Demo platformunu aç",
    ctaSecondary: "Demo kapsamını gör",
    featureOne: "Tarayıcıda kalıcı demo state",
    featureOneDesc:
      "Düzenlemeler refresh sonrası kalır; public demo özel CRM'e bağlanmaz.",
    featureTwo: "Gelir nesnesi kapsamı",
    featureTwoDesc:
      "Lead'den faturaya akışlar yoğun ve pratik CRM ekranlarıyla temsil edilir.",
    featureThree: "Müşteri sunumuna hazır lokalizasyon",
    featureThreeDesc:
      "İngilizce ve Türkçe metinler walkthrough sırasında yerinde değişir.",
    architectureTitle: "Hızlı ve izole demo edge olarak tasarlandı.",
    architectureEyebrow: "Cloudflare-ready mimari",
    architectureBody:
      "Ürün yüzeyi bağlı hisseder ama public demo için güvenli kalır: mock veri lokal kalır, route davranışı nettir ve workspace dış servissiz yüklenir.",
    finalCtaTitle: "Walkthrough için hazır.",
    finalCtaBody:
      "Canlı workspace'i açın, satış nesneleri arasında ilerleyin ve dış servise bağlı olmadan uçtan uca CRM akışını gösterin.",
  },
} as const;

type Copy = (typeof dict)[Locale];

type IconComponent = typeof DatabaseIcon;

type Kpi = {
  title: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: IconComponent;
};

const leadSources = [
  { label: "Website", percentage: 36, colorClass: "bg-blue-600" },
  { label: "Referral", percentage: 24, colorClass: "bg-indigo-500" },
  { label: "Events", percentage: 19, colorClass: "bg-violet-500" },
  { label: "Cold Call", percentage: 12, colorClass: "bg-slate-400" },
  { label: "Social Media", percentage: 10, colorClass: "bg-slate-300" },
];

const opportunities = [
  {
    name: "Digital Transformation Initiative",
    company: "TechVision Solutions",
    stage: "Qualification",
    value: "$500,000",
    probability: 40,
  },
  {
    name: "CRM Implementation - Enterprise",
    company: "TechVision Solutions",
    stage: "Proposal",
    value: "$450,000",
    probability: 60,
  },
  {
    name: "Warehouse Management System",
    company: "TransLogistics Inc",
    stage: "Negotiation",
    value: "$445,000",
    probability: 75,
  },
  {
    name: "Risk Management System",
    company: "GlobalFinance Corp",
    stage: "Proposal",
    value: "$425,000",
    probability: 50,
  },
  {
    name: "Retail POS System Upgrade",
    company: "RetailMax Group",
    stage: "Proposal",
    value: "$420,000",
    probability: 55,
  },
];

export default component$(() => {
  const locale = useLocale();
  const t = dict[locale.value];

  return (
    <main class="landing-page min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#eef2ff_100%)] text-slate-900">
      <Navbar locale={locale.value} t={t} />

      <section class="relative px-4 pb-20 pt-14 sm:px-6 sm:pb-28 lg:px-8">
        <div class="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-64 max-w-5xl rounded-full bg-blue-100/70 blur-3xl" />
        <div class="mx-auto max-w-7xl">
          <div class="landing-fade-up mx-auto max-w-4xl text-center">
            <h1 class="text-balance text-5xl font-black tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">
              {t.heroTitle}
            </h1>
            <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {t.heroSubtitle}
            </p>
            <p class="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              {t.heroBody}
            </p>
            <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={buildDemoAccessHref("/dashboard")}
                class="group inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {t.ctaPrimary}
                <ChevronRightIcon class="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                class="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>

          <DashboardMockup t={t} />
        </div>
      </section>

      <section
        id="features"
        class="border-y border-slate-200 bg-white/80 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div class="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <FeatureBlock
            icon={DatabaseIcon}
            title={t.featureOne}
            body={t.featureOneDesc}
          />
          <FeatureBlock
            icon={BriefcaseIcon}
            title={t.featureTwo}
            body={t.featureTwoDesc}
          />
          <FeatureBlock
            icon={GlobeIcon}
            title={t.featureThree}
            body={t.featureThreeDesc}
          />
        </div>
      </section>

      <section id="architecture" class="px-4 py-20 sm:px-6 lg:px-8">
        <div class="mx-auto grid max-w-7xl gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-12">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
              {t.architectureEyebrow}
            </p>
            <h2 class="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {t.architectureTitle}
            </h2>
          </div>
          <div>
            <p class="text-lg leading-8 text-slate-600">{t.architectureBody}</p>
            <div class="mt-8 grid gap-3 sm:grid-cols-3">
              {["Qwik City", "Local state", "Cloudflare-ready"].map((item) => (
                <div
                  key={item}
                  class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="px-4 pb-20 sm:px-6 lg:px-8">
        <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/15 md:flex-row md:items-center md:p-10">
          <div>
            <h2 class="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              {t.finalCtaTitle}
            </h2>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {t.finalCtaBody}
            </p>
          </div>
          <Link
            href={buildDemoAccessHref("/dashboard")}
            class="group inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {t.ctaPrimary}
            <ChevronRightIcon class="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
});

export const Navbar = component$((props: { locale: Locale; t: Copy }) => {
  const locale = useLocale();

  return (
    <nav class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" class="flex items-center gap-2">
          <DatabaseIcon class="h-6 w-6 text-blue-600" />
          <span class="text-xl font-bold tracking-tight text-slate-900">
            VertexCRM
          </span>
        </Link>

        <div class="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" class="transition-colors hover:text-slate-900">
            {props.t.navFeatures}
          </a>
          <a
            href="#architecture"
            class="transition-colors hover:text-slate-900"
          >
            {props.t.navArch}
          </a>
          <Link
            href={buildDemoAccessHref("/dashboard")}
            class="transition-colors hover:text-slate-900"
          >
            {props.t.navDocs}
          </Link>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick$={() => {
              locale.value = props.locale === "tr" ? "en" : "tr";
            }}
            class="flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition hover:text-slate-900"
          >
            <GlobeIcon class="h-3 w-3" />
            {props.locale}
          </button>
          <Link
            href={buildDemoAccessHref("/search")}
            class="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block"
          >
            {props.t.navLogin}
          </Link>
          <Link
            href={buildDemoAccessHref("/dashboard")}
            class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            {props.t.navInit}
          </Link>
        </div>
      </div>
    </nav>
  );
});

export const DashboardMockup = component$((props: { t: Copy }) => {
  const t = props.t;
  const kpis: Kpi[] = [
    {
      title: t.kpiValue,
      value: "$8,495,000",
      subtext: t.kpiValueSub,
      trend: "+15%",
      icon: DollarSignIcon,
    },
    {
      title: t.kpiLeads,
      value: "42",
      subtext: t.kpiLeadsSub,
      trend: "+12%",
      icon: UsersIcon,
    },
    {
      title: t.kpiOpps,
      value: "32",
      subtext: t.kpiOppsSub,
      trend: "+8%",
      icon: BriefcaseIcon,
    },
    {
      title: t.kpiConv,
      value: "24%",
      subtext: t.kpiConvSub,
      icon: TargetIcon,
    },
    {
      title: t.kpiCoverage,
      value: "19x",
      subtext: t.kpiCoverageSub,
      icon: BarChartIcon,
    },
    {
      title: t.kpiClosing,
      value: "5",
      subtext: t.kpiClosingSub,
      icon: ClockIcon,
    },
    {
      title: t.kpiWinrate,
      value: "68%",
      subtext: t.kpiWinrateSub,
      icon: TrendingUpIcon,
    },
    {
      title: t.kpiAvgDeal,
      value: "$265,469",
      subtext: t.kpiAvgDealSub,
      icon: DollarSignIcon,
    },
  ];

  return (
    <div class="landing-dashboard mx-auto mt-12 w-full max-w-7xl rounded-2xl border border-slate-200 bg-slate-50/90 p-4 shadow-2xl shadow-slate-200/60 sm:p-6 lg:p-8">
      <div class="relative z-10">
        <div class="mb-8 flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center">
          <div>
            <div class="mb-1 flex items-center gap-2">
              <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.workspaceLabel}
              </span>
            </div>
            <h2 class="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
              <ActivityIcon class="h-6 w-6 text-blue-600" />
              {t.heroTitle}
            </h2>
            <p class="mt-1 text-sm text-slate-500">{t.snapshotStatus}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm font-bold text-slate-900">John Doe</p>
              <p class="text-xs text-slate-500">Sales Manager</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-100 font-bold text-blue-700">
              JD
            </div>
          </div>
        </div>

        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} kpi={kpi} />
          ))}
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="space-y-6">
            <ExecutiveNotes t={t} />
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 class="mb-4 text-sm font-bold text-slate-900">
                {t.leadSources}
              </h3>
              {leadSources.map((source) => (
                <ProgressBar key={source.label} source={source} />
              ))}
            </div>
          </div>

          <div class="space-y-6 lg:col-span-2">
            <OpportunitiesTable t={t} />
            <PipelineHealth t={t} />
          </div>
        </div>
      </div>
    </div>
  );
});

export const KpiCard = component$((props: { kpi: Kpi }) => {
  const Icon = props.kpi.icon;

  return (
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div class="mb-2 flex items-start justify-between">
        <span class="text-sm font-medium text-slate-500">
          {props.kpi.title}
        </span>
        <Icon class="h-4 w-4 text-slate-400" />
      </div>
      <div class="flex items-baseline gap-2">
        <h3 class="text-2xl font-bold tracking-tight text-slate-900">
          {props.kpi.value}
        </h3>
        {props.kpi.trend ? (
          <span class="text-xs font-medium text-emerald-600">
            {props.kpi.trend}
          </span>
        ) : null}
      </div>
      <p class="mt-1 text-xs text-slate-500">{props.kpi.subtext}</p>
    </div>
  );
});

export const ProgressBar = component$(
  (props: {
    source: { label: string; percentage: number; colorClass: string };
  }) => (
    <div class="mb-3">
      <div class="mb-1 flex justify-between text-xs">
        <span class="font-medium text-slate-700">{props.source.label}</span>
        <span class="text-slate-500">{props.source.percentage}%</span>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          class={`landing-progress h-full rounded-full ${props.source.colorClass}`}
          style={{ width: `${props.source.percentage}%` }}
        />
      </div>
    </div>
  ),
);

export const ExecutiveNotes = component$((props: { t: Copy }) => {
  const notes = [
    {
      title: props.t.execMomentum,
      body: props.t.execMomentumDesc,
      icon: CheckCircle2Icon,
      iconClass: "text-emerald-500",
    },
    {
      title: props.t.execAttention,
      body: props.t.execAttentionDesc,
      icon: AlertCircleIcon,
      iconClass: "text-amber-500",
    },
    {
      title: props.t.execQuality,
      body: props.t.execQualityDesc,
      icon: ActivityIcon,
      iconClass: "text-blue-500",
    },
  ];

  return (
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
        <TerminalIcon class="h-4 w-4 text-slate-400" />
        {props.t.execNotes}
      </h3>
      <div class="space-y-4">
        {notes.map((note) => {
          const Icon = note.icon;

          return (
            <div key={note.title} class="flex items-start gap-3">
              <Icon class={`mt-0.5 h-5 w-5 shrink-0 ${note.iconClass}`} />
              <div>
                <span class="block text-sm font-semibold text-slate-900">
                  {note.title}
                </span>
                <span class="text-xs leading-relaxed text-slate-600">
                  {note.body}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export const OpportunitiesTable = component$((props: { t: Copy }) => (
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-sm font-bold text-slate-900">{props.t.topOpps}</h3>
      <Link
        href={buildDemoAccessHref("/opportunities")}
        class="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
      >
        {props.t.viewAll}
        <ChevronRightIcon class="h-3.5 w-3.5" />
      </Link>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full whitespace-nowrap text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 text-slate-500">
            <th class="pb-3 font-medium">{props.t.dealName}</th>
            <th class="pb-3 font-medium">{props.t.stage}</th>
            <th class="pb-3 text-right font-medium">{props.t.value}</th>
            <th class="pb-3 text-right font-medium">{props.t.probability}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 text-slate-700">
          {opportunities.map((opportunity) => (
            <tr key={opportunity.name} class="transition hover:bg-slate-50">
              <td class="py-3 pr-4">
                <p class="font-semibold text-slate-900">{opportunity.name}</p>
                <p class="text-xs text-slate-500">{opportunity.company}</p>
              </td>
              <td class="py-3 pr-4">
                <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {opportunity.stage}
                </span>
              </td>
              <td class="py-3 text-right font-semibold text-slate-900">
                {opportunity.value}
              </td>
              <td class="py-3 text-right text-slate-600">
                {opportunity.probability}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

export const PipelineHealth = component$((props: { t: Copy }) => {
  const health = [
    {
      title: props.t.healthStrong,
      body: props.t.healthStrongDesc,
      color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      title: props.t.healthFollowup,
      body: props.t.healthFollowupDesc,
      color: "border-amber-200 bg-amber-50 text-amber-700",
    },
    {
      title: props.t.healthClosing,
      body: props.t.healthClosingDesc,
      color: "border-blue-200 bg-blue-50 text-blue-700",
    },
  ];

  return (
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-4 text-sm font-bold text-slate-900">
        {props.t.pipelineHealth}
      </h3>
      <div class="grid gap-3 md:grid-cols-3">
        {health.map((item) => (
          <div key={item.title} class={`rounded-xl border p-4 ${item.color}`}>
            <p class="text-sm font-bold">{item.title}</p>
            <p class="mt-1 text-xs leading-5">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export const FeatureBlock = component$(
  (props: { icon: IconComponent; title: string; body: string }) => {
    const Icon = props.icon;

    return (
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div class="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon class="h-5 w-5" />
        </div>
        <h3 class="text-lg font-bold text-slate-950">{props.title}</h3>
        <p class="mt-3 leading-7 text-slate-600">{props.body}</p>
      </div>
    );
  },
);

export const head: DocumentHead = {
  title: "VertexCRM | Sales Command Center",
  meta: [
    {
      name: "description",
      content:
        "Qwik product landing page for VertexCRM, a Salesforce-style sales command center demo.",
    },
  ],
};
