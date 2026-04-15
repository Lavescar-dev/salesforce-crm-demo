import { component$ } from "@builder.io/qwik";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: any;
  iconColor?: string;
  badgeClass?: string;
}

export const MetricCard = component$((props: MetricCardProps) => {
  const Icon = props.icon;
  const changeClass =
    props.changeType === "positive"
      ? "bg-emerald-50 text-emerald-700"
      : props.changeType === "negative"
        ? "bg-rose-50 text-rose-700"
        : "bg-slate-100 text-slate-600";

  return (
    <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-slate-200/60 sm:p-5">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {props.title}
          </p>
          <p class="mt-2 text-2xl font-semibold text-slate-900 sm:text-[2rem]">
            {props.value}
          </p>
          {props.subtitle ? (
            <p class="mt-1 text-sm text-slate-500">{props.subtitle}</p>
          ) : null}
        </div>
        {Icon ? (
          <div
            class={[
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover:scale-105",
              props.badgeClass ?? "bg-slate-50",
            ].join(" ")}
          >
            <Icon class={`h-5 w-5 ${props.iconColor ?? "text-slate-600"}`} />
          </div>
        ) : null}
      </div>
      {props.change ? (
        <div class="mt-4 flex justify-end">
          <span
            class={`rounded-full px-2.5 py-1 text-xs font-medium transition duration-200 group-hover:-translate-y-0.5 ${changeClass}`}
          >
            {props.change}
          </span>
        </div>
      ) : null}
    </div>
  );
});
