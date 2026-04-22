import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead, useLocation } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  Building2Icon,
  ChevronRightIcon,
  DatabaseIcon,
  FocusIcon,
  GlobeIcon,
  MailIcon,
  MonitorIcon,
  ShieldIcon,
  TargetIcon,
  TerminalIcon,
  UserIcon,
} from "lucide-qwik";
import {
  buildDemoAccessHref,
  clearDemoAccessSession,
  createDemoAccessSession,
  getDemoTarget,
  getRequestedTarget,
  readDemoAccessSession,
  writeDemoAccessCookie,
  writeDemoAccessSession,
  type DemoAccessDraft,
  type DemoAccessSession,
} from "~/data/demo-access";
import { useLocale } from "~/data/i18n";

const dict = {
  en: {
    activeBody:
      "Reuse the current profile or reset it before opening the workspace with a new review context.",
    activeLabel: "Current session",
    activeReset: "Use new access data",
    activeResume: "Continue current session",
    back: "Back to product intro",
    bootstrap: "Bootstrap Session",
    demoBadge: "Salesforce demo",
    desc:
      "Move from the public intro into the live sales workspace through a guided handoff that keeps the selected revenue surface in focus.",
    errorEmail: "Use a valid business email address.",
    errorFields: "Complete all access fields before opening the workspace.",
    fieldEmail: "Business Email",
    fieldEmailPlaceholder: "john@company.com",
    fieldFocus: "Review Focus",
    fieldFocusHelp:
      "Use a short commercial context so the walkthrough opens with a clear review angle.",
    fieldFocusPlaceholder:
      "Evaluating pipeline visibility and reporting for the enterprise sales team.",
    fieldName: "Name",
    fieldNamePlaceholder: "John Doe",
    fieldTeam: "Team or Company",
    fieldTeamPlaceholder: "TechVision Solutions",
    flowLabel: "Flow",
    flowValue: "Identity capture, session bootstrap, workspace handoff.",
    formDesc:
      "The access layer sets the review context before the live Vertex CRM workspace opens.",
    formTitle: "Open target",
    loadingBody:
      "The access profile and selected revenue surface are being locked before the live workspace opens.",
    loadingKicker: "Session bootstrap",
    loadingSteps: [
      {
        body: "Visitor identity and review context are attached to the demo session.",
        title: "Access profile locked",
      },
      {
        body: "The selected sales surface is being prepared for the walkthrough.",
        title: "Workspace context aligned",
      },
      {
        body: "The live workspace opens as soon as the handoff finishes.",
        title: "Handoff complete",
      },
    ],
    loadingTitle: "Opening the workspace",
    pathDesc:
      "The fastest proof path starts in the dashboard, moves into opportunities, then closes in quotes and invoices.",
    pathLabel: "Recommended sales path",
    pathNodes: ["Dashboard", "Opportunities", "Quotes", "Invoices"],
    subtitle: "Vertex CRM Demo Platform",
    surfaceDefaultLabel: "Revenue control surface",
    targetLabel: "Target",
    title: "Controlled access layer",
    windowLabel: "Window",
    windowValue:
      "Single-session access designed for portfolio walkthroughs and guided reviews.",
  },
  tr: {
    activeBody:
      "Mevcut profili kullanın veya yeni bir inceleme bağlamı ile workspace açmadan önce sıfırlayın.",
    activeLabel: "Mevcut oturum",
    activeReset: "Yeni erişim bilgisi gir",
    activeResume: "Mevcut oturumla devam et",
    back: "Ürün tanıtımına dön",
    bootstrap: "Oturumu Başlat",
    demoBadge: "Salesforce demo",
    desc:
      "Seçili gelir yüzeyini odakta tutan yönlendirilmiş bir geçiş ile genel tanıtımdan canlı satış çalışma alanına geçin.",
    errorEmail: "Geçerli bir iş e-postası adresi kullanın.",
    errorFields: "Workspace açılmadan önce tüm alanları doldurun.",
    fieldEmail: "İş E-postası",
    fieldEmailPlaceholder: "john@sirket.com",
    fieldFocus: "İnceleme Odağı",
    fieldFocusHelp:
      "Turun net bir inceleme açısıyla açılması için kısa bir ticari bağlam girin.",
    fieldFocusPlaceholder:
      "Kurumsal satış ekibi için pipeline görünürlüğü ve raporlama kalitesini değerlendiriyoruz.",
    fieldName: "İsim",
    fieldNamePlaceholder: "John Doe",
    fieldTeam: "Ekip veya Şirket",
    fieldTeamPlaceholder: "TechVision Solutions",
    flowLabel: "Akış",
    flowValue: "Kimlik yakalama, oturum başlatma, çalışma alanı devri.",
    formDesc:
      "Erişim katmanı, canlı Vertex CRM çalışma alanı açılmadan önce inceleme bağlamını ayarlar.",
    formTitle: "Hedefi aç",
    loadingBody:
      "Canlı workspace açılmadan önce erişim profili ve seçilen gelir yüzeyi sabitleniyor.",
    loadingKicker: "Oturum başlatılıyor",
    loadingSteps: [
      {
        body: "Ziyaretçi kimliği ve inceleme bağlamı demo oturumuna bağlanıyor.",
        title: "Erişim profili sabitlendi",
      },
      {
        body: "Seçilen satış yüzeyi walkthrough için hazırlanıyor.",
        title: "Workspace bağlamı hizalandı",
      },
      {
        body: "Geçiş tamamlanır tamamlanmaz canlı workspace açılacak.",
        title: "Devir tamamlandı",
      },
    ],
    loadingTitle: "Workspace açılıyor",
    pathDesc:
      "En hızlı doğrulama rotası dashboard'da başlar, fırsatlara geçer, teklif ve faturalarla kapanır.",
    pathLabel: "Önerilen satış rotası",
    pathNodes: ["Dashboard", "Fırsatlar", "Teklifler", "Faturalar"],
    subtitle: "Vertex CRM Demo Platformu",
    surfaceDefaultLabel: "Gelir kontrol yüzeyi",
    targetLabel: "Hedef",
    title: "Kontrollü erişim katmanı",
    windowLabel: "Pencere",
    windowValue:
      "Portföy incelemeleri ve rehberli turlar için tasarlanmış tek oturumluk erişim.",
  },
} as const;

const resolveTargetIcon = (icon: ReturnType<typeof getDemoTarget>["icon"]) => {
  switch (icon) {
    case "accounts":
      return Building2Icon;
    case "contacts":
      return UserIcon;
    case "dashboard":
      return MonitorIcon;
    case "invoices":
      return TerminalIcon;
    case "leads":
      return UserIcon;
    case "opportunities":
      return TargetIcon;
    case "quotes":
      return TerminalIcon;
    case "search":
      return FocusIcon;
    default:
      return DatabaseIcon;
  }
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const PathNode = component$(
  (props: { href: string; isLast?: boolean; label: string }) => (
    <div class="flex items-center">
      <Link
        href={buildDemoAccessHref(props.href)}
        class="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
      >
        {props.label}
      </Link>
      {!props.isLast ? (
        <ChevronRightIcon class="mx-2 h-4 w-4 text-slate-400" />
      ) : null}
    </div>
  ),
);

export default component$(() => {
  const locale = useLocale();
  const location = useLocation();
  const t = dict[locale.value];
  const targetPath = getRequestedTarget(location.url.search, "/dashboard");
  const target = getDemoTarget(targetPath);
  const TargetIcon = resolveTargetIcon(target.icon);
  const form = useStore<DemoAccessDraft>({
    email: "",
    name: "",
    organization: "",
    role: "",
  });
  const existingSession = useSignal<DemoAccessSession | null>(null);
  const error = useSignal("");
  const isLoading = useSignal(false);
  const loadingStep = useSignal(0);

  const beginHandoff = $(async (session: DemoAccessSession) => {
    isLoading.value = true;
    loadingStep.value = 0;
    error.value = "";

    writeDemoAccessSession(session);
    writeDemoAccessCookie(session.accessId);
    existingSession.value = session;

    const wait = (ms: number) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });

    for (const nextStep of [1, 2, 3]) {
      await wait(nextStep === 1 ? 180 : 260);
      loadingStep.value = nextStep;
    }

    await wait(220);
    window.location.assign(targetPath);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => locale.value);
    track(() => location.url.search);

    const session = readDemoAccessSession();
    existingSession.value = session;

    if (session) {
      form.name = session.name;
      form.email = session.email;
      form.organization = session.organization;
      form.role = session.role;
      writeDemoAccessCookie(session.accessId);
    }
  });

  return (
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <header class="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/"
              class="inline-flex items-center gap-3 self-start rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:text-slate-950"
            >
              <span class="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                <ArrowLeftIcon class="h-4 w-4" />
              </span>
              <span>{t.back}</span>
            </Link>
            <div class="hidden h-4 w-px bg-slate-300 sm:block" />
            <div class="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
              <DatabaseIcon class="h-5 w-5 text-blue-600" />
              <span class="font-bold tracking-tight text-slate-900">
                Vertex CRM
              </span>
              <span class="ml-2 rounded-md bg-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200">
                {t.demoBadge}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick$={() => {
              locale.value = locale.value === "tr" ? "en" : "tr";
            }}
            class="inline-flex items-center gap-2 self-start rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:text-slate-900 lg:self-auto"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200">
              <GlobeIcon class="h-3 w-3" />
            </span>
            {locale.value}
          </button>
        </div>
      </header>

      <main class="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-6 py-6 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-12">
        <section class="col-span-1 space-y-10 border-slate-200 pb-10 lg:col-span-5 lg:border-r lg:pr-8 lg:pb-0">
          <div>
            <div class="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ShieldIcon class="h-5 w-5" />
            </div>
            <h1 class="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
              {t.title}
            </h1>
            <p class="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">
              {t.subtitle}
            </p>
            <p class="text-base leading-relaxed text-slate-600">{t.desc}</p>
          </div>

          <div class="space-y-6">
            <div class="border-l-2 border-slate-200 pl-4">
              <span class="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.targetLabel}
              </span>
              <p class="text-sm font-medium text-slate-900">
                {locale.value === "tr" ? target.titleTr : target.titleEn}
              </p>
              <p class="text-sm text-slate-500">
                {locale.value === "tr" ? target.signalTr : target.signalEn}
              </p>
            </div>

            <div class="border-l-2 border-slate-200 pl-4">
              <span class="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.flowLabel}
              </span>
              <p class="text-sm font-medium leading-relaxed text-slate-900">
                {t.flowValue}
              </p>
            </div>

            <div class="border-l-2 border-slate-200 pl-4">
              <span class="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.windowLabel}
              </span>
              <p class="text-sm font-medium leading-relaxed text-slate-900">
                {t.windowValue}
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-100 p-5">
            <h3 class="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
              <MonitorIcon class="h-4 w-4 text-slate-500" />
              {t.pathLabel}
            </h3>
            <p class="mb-4 text-xs leading-relaxed text-slate-600">
              {t.pathDesc}
            </p>
            <div class="flex flex-wrap items-center gap-y-2">
              {[
                { href: "/dashboard", label: t.pathNodes[0] },
                { href: "/opportunities", label: t.pathNodes[1] },
                { href: "/quotes", label: t.pathNodes[2] },
                { href: "/invoices", label: t.pathNodes[3] },
              ].map((item, index, items) => (
                <PathNode
                  key={item.href}
                  href={item.href}
                  isLast={index === items.length - 1}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        </section>

        <section class="col-span-1 flex flex-col justify-center lg:col-span-7">
          <div class="mb-8">
            <h2 class="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <TargetIcon class="h-6 w-6 text-blue-600" />
              {t.formTitle}
            </h2>
            <p class="text-slate-600">{t.formDesc}</p>
          </div>

          <div class="rounded-t-xl border border-b-0 border-slate-200 bg-white p-5">
            <span class="mb-2 block text-xs font-bold uppercase tracking-wider text-blue-600">
              {locale.value === "tr" ? target.signalTr : target.signalEn}
            </span>
            <div class="mb-2 flex flex-wrap items-center gap-3">
              <TargetIcon class="h-5 w-5 text-slate-800" />
              <h3 class="text-lg font-bold text-slate-900">
                {locale.value === "tr" ? target.titleTr : target.titleEn}
              </h3>
              <span class="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                {targetPath}
              </span>
            </div>
            <p class="text-sm text-slate-500">
              {locale.value === "tr" ? target.descriptionTr : target.descriptionEn}
            </p>
          </div>

          <div class="relative rounded-b-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {existingSession.value ? (
              <div class="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {t.activeLabel}
                </div>
                <div class="mt-2 text-sm font-semibold text-slate-900">
                  {existingSession.value.name}
                </div>
                <div class="mt-1 text-sm text-slate-600">
                  {existingSession.value.organization}
                </div>
                <p class="mt-2 text-sm leading-relaxed text-slate-600">
                  {existingSession.value.role}
                </p>
                <p class="mt-3 text-xs leading-relaxed text-slate-500">
                  {t.activeBody}
                </p>
                <div class="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick$={async () => {
                      const session = existingSession.value;
                      if (!session) {
                        return;
                      }

                      await beginHandoff(session);
                    }}
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {t.activeResume}
                    <ChevronRightIcon class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick$={() => {
                      clearDemoAccessSession();
                      existingSession.value = null;
                      form.name = "";
                      form.email = "";
                      form.organization = "";
                      form.role = "";
                      error.value = "";
                    }}
                    class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    {t.activeReset}
                  </button>
                </div>
              </div>
            ) : null}

            <form
              class="space-y-6"
              preventdefault:submit
              onSubmit$={async () => {
                const payload = {
                  email: form.email.trim(),
                  name: form.name.trim(),
                  organization: form.organization.trim(),
                  role: form.role.trim(),
                };

                if (
                  !payload.name ||
                  !payload.email ||
                  !payload.organization ||
                  !payload.role
                ) {
                  error.value = t.errorFields;
                  return;
                }

                if (!isValidEmail(payload.email)) {
                  error.value = t.errorEmail;
                  return;
                }

                await beginHandoff(createDemoAccessSession(payload));
              }}
            >
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <UserIcon class="h-4 w-4 text-slate-400" />
                    {t.fieldName}
                  </label>
                  <input
                    type="text"
                    autocomplete="name"
                    value={form.name}
                    onInput$={(event) => {
                      form.name = (event.target as HTMLInputElement).value;
                    }}
                    placeholder={t.fieldNamePlaceholder}
                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <MailIcon class="h-4 w-4 text-slate-400" />
                    {t.fieldEmail}
                  </label>
                  <input
                    type="email"
                    autocomplete="email"
                    value={form.email}
                    onInput$={(event) => {
                      form.email = (event.target as HTMLInputElement).value;
                    }}
                    placeholder={t.fieldEmailPlaceholder}
                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Building2Icon class="h-4 w-4 text-slate-400" />
                  {t.fieldTeam}
                </label>
                <input
                  type="text"
                  autocomplete="organization"
                  value={form.organization}
                  onInput$={(event) => {
                    form.organization = (event.target as HTMLInputElement).value;
                  }}
                  placeholder={t.fieldTeamPlaceholder}
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FocusIcon class="h-4 w-4 text-slate-400" />
                  {t.fieldFocus}
                </label>
                <textarea
                  rows={3}
                  value={form.role}
                  onInput$={(event) => {
                    form.role = (event.target as HTMLTextAreaElement).value;
                  }}
                  placeholder={t.fieldFocusPlaceholder}
                  class="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <p class="text-xs leading-relaxed text-slate-500">
                  {t.fieldFocusHelp}
                </p>
              </div>

              <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                {error.value ? (
                  <p class="pr-4 text-sm font-medium text-rose-600">
                    {error.value}
                  </p>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  {t.bootstrap}
                  <ChevronRightIcon class="h-4 w-4" />
                </button>
              </div>
            </form>

            {isLoading.value ? (
              <div class="absolute inset-0 rounded-b-xl bg-slate-950/94 px-6 py-8 text-white backdrop-blur-xl sm:px-8">
                <div class="flex h-full flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3">
                      <div
                        class="h-2.5 w-2.5 animate-pulse rounded-full"
                        style={`background:${target.accent}; box-shadow: 0 0 22px ${target.accent};`}
                      />
                      <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                        {t.loadingKicker}
                      </div>
                    </div>
                    <h3 class="mt-5 text-3xl font-semibold tracking-tight text-white">
                      {t.loadingTitle}
                    </h3>
                    <p class="mt-4 max-w-md text-sm leading-7 text-slate-300">
                      {t.loadingBody}
                    </p>
                  </div>

                  <div class="space-y-4">
                    {t.loadingSteps.map((step, index) => (
                      <div
                        key={step.title}
                        class={[
                          "rounded-[18px] border px-4 py-4 transition",
                          loadingStep.value > index
                            ? "border-white/18 bg-white/8"
                            : "border-white/10 bg-white/[0.03]",
                        ].join(" ")}
                      >
                        <div class="flex items-start gap-4">
                          <div
                            class={[
                              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                              loadingStep.value > index
                                ? "bg-white text-slate-950"
                                : "bg-white/10 text-slate-300",
                            ].join(" ")}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <div>
                            <div class="text-sm font-semibold text-white">
                              {step.title}
                            </div>
                            <p class="mt-1 text-sm leading-7 text-slate-300">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Vertex CRM | Demo Platform",
  meta: [
    {
      name: "description",
      content:
        "Controlled access layer for the live Vertex CRM demo workspace.",
    },
  ],
};
