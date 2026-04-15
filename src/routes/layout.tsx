import {
  component$,
  $,
  Slot,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import {
  BellIcon,
  Building2Icon,
  ChevronDownIcon,
  ContactIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  TargetIcon,
  UsersIcon,
  XIcon,
} from "lucide-qwik";
import {
  createDemoState,
  demoStateContext,
  loadPersistedDemoState,
  saveDemoState,
} from "~/data/demo-state";
import { layoutCopy, type Locale, useLocale } from "~/data/i18n";

type NavKey = keyof typeof layoutCopy.en.nav;

type NavItem = {
  path: string;
  labelKey: NavKey;
  icon: any;
};

const salesNav: NavItem[] = [
  { path: "/dashboard", labelKey: "dashboard", icon: LayoutDashboardIcon },
  { path: "/leads", labelKey: "leads", icon: UsersIcon },
  { path: "/opportunities", labelKey: "opportunities", icon: TargetIcon },
  { path: "/accounts", labelKey: "accounts", icon: Building2Icon },
  { path: "/contacts", labelKey: "contacts", icon: ContactIcon },
];

const collateralNav: NavItem[] = [
  { path: "/quotes", labelKey: "quotes", icon: FileTextIcon },
  { path: "/orders", labelKey: "orders", icon: ShoppingCartIcon },
  { path: "/invoices", labelKey: "invoices", icon: FileTextIcon },
];

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const locale = useLocale();
  const mobileMenuOpen = useSignal(false);
  const searchTerm = useSignal("");
  const demoData = useStore(createDemoState());
  const hydrated = useSignal(false);
  const copy = layoutCopy[locale.value];

  useContextProvider(demoStateContext, demoData);

  const isLandingRoute = location.url.pathname === "/";

  const isActive = (path: string) =>
    location.url.pathname === path ||
    location.url.pathname.startsWith(`${path}/`);

  const submitGlobalSearch = $(() => {
    const query = searchTerm.value.trim();
    mobileMenuOpen.value = false;
    searchTerm.value = "";
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const persisted = loadPersistedDemoState();
    if (persisted) {
      Object.assign(demoData, persisted);
    }
    hydrated.value = true;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => hydrated.value);
    track(() => demoData.version);

    if (!hydrated.value) {
      return;
    }

    saveDemoState(demoData);
  });

  if (isLandingRoute) {
    return <Slot />;
  }

  return (
    <div class="flex min-h-screen bg-slate-50 text-slate-900">
      {mobileMenuOpen.value ? (
        <div
          class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick$={() => {
            mobileMenuOpen.value = false;
          }}
        />
      ) : null}

      <aside
        class={[
          "fixed inset-y-0 left-0 z-50 flex w-48 flex-col border-r border-slate-200 bg-white/95 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
          mobileMenuOpen.value
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div class="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <span class="text-sm font-bold text-white">V</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900">Vertex CRM</p>
              <p class="text-[11px] text-slate-500">Salesforce demo</p>
            </div>
          </div>
          <button
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            onClick$={() => {
              mobileMenuOpen.value = false;
            }}
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="border-b border-slate-200 px-3 py-3">
          <button class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50/60">
            <span class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span class="text-slate-700">{copy.demoWorkspace}</span>
            </span>
            <ChevronDownIcon class="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-3">
          <div class="px-2">
            <p class="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {copy.salesSection}
            </p>
            <div class="space-y-1">
              {salesNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick$={() => {
                      mobileMenuOpen.value = false;
                    }}
                    class={[
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <Icon class="h-4 w-4" />
                    <span>{copy.nav[item.labelKey]}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div class="mt-5 px-2">
            <p class="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {copy.collateralSection}
            </p>
            <div class="space-y-1">
              {collateralNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick$={() => {
                      mobileMenuOpen.value = false;
                    }}
                    class={[
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <Icon class="h-4 w-4" />
                    <span>{copy.nav[item.labelKey]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div class="border-t border-slate-200 p-3">
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <span class="text-sm font-semibold text-white">JD</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-900">
                John Doe
              </p>
              <p class="truncate text-xs text-slate-500">{copy.salesManager}</p>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex flex-1 flex-col overflow-hidden">
        <header class="flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:px-5">
          <div class="flex flex-1 items-center gap-3">
            <button
              class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              onClick$={() => {
                mobileMenuOpen.value = true;
              }}
            >
              <MenuIcon class="h-5 w-5" />
            </button>

            <form
              preventdefault:submit
              onSubmit$={submitGlobalSearch}
              class="relative hidden max-w-2xl flex-1 sm:block"
            >
              <SearchIcon class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm.value}
                onInput$={(event) => {
                  searchTerm.value = (event.target as HTMLInputElement).value;
                }}
                placeholder={copy.searchPlaceholder}
                class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </form>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <span class="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:inline">
              {copy.language}
            </span>
            <div class="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold text-slate-600 shadow-sm">
              {(["en", "tr"] as Locale[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  class={[
                    "rounded-md px-2.5 py-1 transition",
                    locale.value === item
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900",
                  ].join(" ")}
                  aria-pressed={locale.value === item}
                  onClick$={() => {
                    locale.value = item;
                  }}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:hidden"
              onClick$={submitGlobalSearch}
            >
              <SearchIcon class="h-5 w-5" />
            </button>
            <button class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
              <BellIcon class="h-5 w-5" />
              <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
              <SettingsIcon class="h-5 w-5" />
            </button>
          </div>
        </header>

        <main class="flex-1 overflow-auto">
          <Slot />
        </main>
      </div>
    </div>
  );
});
