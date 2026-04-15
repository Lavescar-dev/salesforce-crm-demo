import {
  component$,
  isDev,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import {
  localeContext,
  loadPersistedLocale,
  savePersistedLocale,
  type Locale,
} from "~/data/i18n";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  const locale = useSignal<Locale>("en");
  const hydrated = useSignal(false);

  useContextProvider(localeContext, locale);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const persisted = loadPersistedLocale();
    if (persisted) {
      locale.value = persisted;
    }
    hydrated.value = true;
    document.documentElement.lang = locale.value;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => locale.value);
    track(() => hydrated.value);

    if (!hydrated.value) {
      return;
    }

    document.documentElement.lang = locale.value;
    savePersistedLocale(locale.value);
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang={locale.value} class="bg-slate-50 text-slate-900 antialiased">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
