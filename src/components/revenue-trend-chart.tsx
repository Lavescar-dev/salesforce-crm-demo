import { $, component$, useSignal } from "@builder.io/qwik";

export interface RevenueTrendPoint {
  month: string;
  pipeline: number;
  forecast: number;
  actual: number | null;
}

interface RevenueTrendChartProps {
  data: RevenueTrendPoint[];
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatAxisMoney = (value: number) =>
  `$${(value / 1_000_000).toFixed(1)}M`;

export const RevenueTrendChart = component$((props: RevenueTrendChartProps) => {
  const tooltip = useSignal<{
    label: string;
    month: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const width = 1200;
  const height = 180;
  const padding = {
    top: 14,
    right: 24,
    bottom: 28,
    left: 72,
  };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const stepX = props.data.length > 1 ? plotWidth / (props.data.length - 1) : 0;

  const series = [
    {
      label: "Pipeline",
      color: "#2563eb",
      fill: "rgba(37, 99, 235, 0.16)",
      values: props.data.map((point) => point.pipeline),
    },
    {
      label: "Forecast",
      color: "#06b6d4",
      fill: "rgba(6, 182, 212, 0.12)",
      values: props.data.map((point) => point.forecast),
    },
    {
      label: "Actual",
      color: "#8b5cf6",
      fill: "rgba(139, 92, 246, 0.12)",
      values: props.data.map((point) => point.actual),
    },
  ] as const;

  const numericValues: number[] = [];
  series.forEach((entry) => {
    entry.values.forEach((value) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        numericValues.push(value);
      }
    });
  });
  const maxValue = Math.max(
    Math.ceil(Math.max(...numericValues, 1) / 2_500_000) * 2_500_000,
    1,
  );

  const yForValue = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;

  const updateTooltip = $(
    (event: MouseEvent, label: string, month: string, value: number) => {
      const target = event.target as HTMLElement;
      const container = target.closest(".group.relative");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      tooltip.value = {
        label,
        month,
        value,
        x,
        y,
      };
    },
  );

  const buildPath = (values: Array<number | null>) => {
    let path = "";
    let drawing = false;

    values.forEach((value, index) => {
      if (value === null) {
        drawing = false;
        return;
      }

      const x = padding.left + stepX * index;
      const y = yForValue(value);
      path += `${drawing ? " L" : " M"} ${x} ${y}`;
      drawing = true;
    });

    return path.trim();
  };

  const buildAreaPath = (values: Array<number | null>) => {
    const points = values.flatMap((value, index) => {
      if (value === null) return [];
      const x = padding.left + stepX * index;
      const y = yForValue(value);
      return [{ x, y }];
    });

    if (points.length === 0) return "";

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const line = buildPath(values);

    return `${line} L ${lastPoint.x} ${padding.top + plotHeight} L ${firstPoint.x} ${padding.top + plotHeight} Z`;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => maxValue * ratio);

  return (
    <div class="group relative space-y-4">
      {tooltip.value ? (
        <div
          class="pointer-events-none absolute z-50 rounded-lg bg-slate-900 px-2 py-1.5 text-left text-white shadow-xl"
          style={`left:${tooltip.value.x}px; top:${tooltip.value.y - 10}px; transform: translate(-50%, -100%); width: 140px;`}
        >
          <p class="text-[10px] font-medium text-slate-400">
            {tooltip.value.label} • {tooltip.value.month}
          </p>
          <div class="mt-0.5 flex items-baseline gap-1.5">
            <span class="text-sm font-semibold">
              {formatMoney(tooltip.value.value)}
            </span>
          </div>
          <div class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
        </div>
      ) : null}
      <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
        {series.map((entry) => (
          <div
            key={entry.label}
            class="flex items-center gap-2 transition duration-200 group-hover:opacity-90"
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              style={`background:${entry.color}`}
            />
            <span class="font-medium text-slate-600">{entry.label}</span>
          </div>
        ))}
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 transition duration-200 group-hover:border-blue-200 group-hover:bg-slate-50 group-hover:shadow-sm">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          class="block h-auto w-full"
          role="img"
          aria-label="Revenue trend chart"
          onMouseLeave$={() => (tooltip.value = null)}
        >
          <defs>
            <linearGradient
              id="revenue-grid-fade"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stop-color="rgba(148, 163, 184, 0.12)" />
              <stop offset="100%" stop-color="rgba(148, 163, 184, 0)" />
            </linearGradient>
          </defs>

          {yTicks.map((value) => {
            const y = yForValue(value);
            return (
              <g key={String(value)}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.2)"
                  stroke-width="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  text-anchor="end"
                  fill="#64748b"
                  font-size="12"
                  font-family="Inter, ui-sans-serif, system-ui, sans-serif"
                >
                  {formatAxisMoney(value)}
                </text>
              </g>
            );
          })}

          {series.map((entry, index) => {
            const path = buildPath(entry.values);
            const areaPath = index === 0 ? buildAreaPath(entry.values) : "";
            return (
              <g key={entry.label}>
                {areaPath ? <path d={areaPath} fill={entry.fill} /> : null}
                <path
                  d={path}
                  fill="none"
                  stroke={entry.color}
                  stroke-width={index === 0 ? "4" : "3"}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dasharray={index === 2 ? "7 6" : undefined}
                />
                {entry.values.map((value, pointIndex) => {
                  if (value === null) return null;
                  const x = padding.left + stepX * pointIndex;
                  const y = yForValue(value);
                  const month = props.data[pointIndex]?.month ?? "";

                  return (
                    <g
                      key={`${entry.label}-${month}`}
                      class="revenue-chart-point"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="rgba(15, 23, 42, 0.001)"
                        pointer-events="all"
                        class="cursor-pointer"
                        tabindex={0}
                        aria-label={`${entry.label} ${month} ${formatMoney(value)}`}
                        onMouseEnter$={(event) =>
                          updateTooltip(
                            event,
                            entry.label.toUpperCase(),
                            month,
                            value,
                          )
                        }
                        onMouseMove$={(event) =>
                          updateTooltip(
                            event,
                            entry.label.toUpperCase(),
                            month,
                            value,
                          )
                        }
                        onMouseLeave$={() => (tooltip.value = null)}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={index === 0 ? "5" : "4"}
                        fill="#fff"
                        stroke={entry.color}
                        stroke-width="3"
                        class={
                          index === 0 ? "revenue-chart-point-dot" : undefined
                        }
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {props.data.map((point, index) => (
            <g key={point.month}>
              <text
                x={padding.left + stepX * index}
                y={height - 18}
                text-anchor="middle"
                fill="#64748b"
                font-size="11"
                font-family="Inter, ui-sans-serif, system-ui, sans-serif"
              >
                {point.month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        {series.map((entry) => {
          const latestValue = [...entry.values]
            .reverse()
            .find(
              (value): value is number =>
                typeof value === "number" && Number.isFinite(value),
            );

          return (
            <div
              key={entry.label}
              class="rounded-xl border border-slate-200 bg-white px-4 py-3 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-sm"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {entry.label}
              </p>
              <p class="mt-1 text-lg font-semibold text-slate-900">
                {latestValue !== undefined ? formatMoney(latestValue) : "-"}
              </p>
              <p class="mt-1 text-xs text-slate-500">Latest monthly value</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});
