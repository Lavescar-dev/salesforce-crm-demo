import { $, component$, useSignal } from "@builder.io/qwik";
import { chartCopy, useLocale } from "~/data/i18n";

export interface SalesFunnelPoint {
  id: string;
  stage: string;
  deals: number;
  rate: number;
}

interface SalesFunnelChartProps {
  data: SalesFunnelPoint[];
}

export const SalesFunnelChart = component$((props: SalesFunnelChartProps) => {
  const locale = useLocale();
  const copy = chartCopy[locale.value];
  const activeRowId = useSignal<string | null>(null);
  const tooltip = useSignal<{
    id: string;
    stage: string;
    deals: number;
    rate: number;
    x: number;
    y: number;
  } | null>(null);

  const width = 860;
  const rowHeight = 22;
  const rowGap = 8;
  const barHeight = 14;
  const tooltipWidth = 144;
  const padding = {
    top: 16,
    right: 260,
    bottom: 24,
    left: 132,
  };

  const maxDeals = Math.max(...props.data.map((item) => item.deals), 1);
  const axisMax = Math.max(8, Math.ceil(maxDeals / 2) * 2);
  const plotWidth = width - padding.left - padding.right;
  const detailLabelX = padding.left + plotWidth + 56;
  const chartHeight =
    padding.top +
    props.data.length * rowHeight +
    (props.data.length - 1) * rowGap +
    padding.bottom;
  const axisTicks = [0, 2, 4, 6, 8].filter((tick) => tick <= axisMax);

  const gridX = (tick: number) => padding.left + (plotWidth * tick) / axisMax;

  const updateTooltip = $((event: MouseEvent, item: SalesFunnelPoint) => {
    const target = event.target as HTMLElement;
    const container = target.closest(".group.relative");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    tooltip.value = {
      id: item.id,
      stage: item.stage,
      deals: item.deals,
      rate: item.rate,
      x,
      y,
    };
  });

  return (
    <div class="group relative">
      {tooltip.value ? (
        <div
          class="pointer-events-none absolute z-50 rounded-lg bg-slate-900 px-2 py-1.5 text-left text-white shadow-xl"
          style={`left:${tooltip.value.x}px; top:${tooltip.value.y - 10}px; transform: translate(-50%, -100%); width:${tooltipWidth}px;`}
        >
          <p class="text-[10px] font-medium text-slate-400">
            {tooltip.value.stage}
          </p>
          <div class="mt-0.5 flex items-baseline gap-1.5">
            <span class="text-sm font-semibold">
              {tooltip.value.deals} {copy.deals}
            </span>
            <span class="text-[10px] text-slate-400">
              {tooltip.value.rate}%
            </span>
          </div>
          <div class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
        </div>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        class="block h-[170px] w-full sm:h-[180px] lg:h-[190px]"
        role="img"
        aria-label={
          locale.value === "tr" ? "Satış hunisi grafiği" : "Sales funnel chart"
        }
        onMouseLeave$={() => {
          activeRowId.value = null;
          tooltip.value = null;
        }}
      >
        {axisTicks.map((tick) => {
          const x = gridX(tick);
          return (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={padding.top - 4}
                y2={chartHeight - padding.bottom + 8}
                stroke="rgba(148, 163, 184, 0.28)"
                stroke-dasharray="2 4"
                stroke-width="1"
              />
              <text
                x={x}
                y={chartHeight - 14}
                text-anchor="middle"
                fill="#94a3b8"
                font-size="11"
                font-family="Inter, ui-sans-serif, system-ui, sans-serif"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {props.data.map((item, index) => {
          const y = padding.top + index * (rowHeight + rowGap);
          const barWidth = (item.deals / axisMax) * plotWidth;
          const barY = y + 5;
          const hitAreaY = y + 1;
          const hitAreaHeight = rowHeight + 8;

          return (
            <g key={item.id} class="sales-funnel-row">
              <text
                x={padding.left - 12}
                y={y + rowHeight / 2 + 1}
                text-anchor="end"
                dominant-baseline="middle"
                fill="#64748b"
                font-size="12"
                font-family="Inter, ui-sans-serif, system-ui, sans-serif"
              >
                {item.stage}
              </text>
              <rect
                x={padding.left}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="#3b82f6"
                class={[
                  "sales-funnel-bar transition duration-200",
                  activeRowId.value === item.id ? "opacity-85" : "opacity-100",
                ].join(" ")}
              />
              <rect
                x={padding.left}
                y={hitAreaY}
                width={barWidth}
                height={hitAreaHeight}
                rx="8"
                fill="rgba(15, 23, 42, 0.001)"
                pointer-events="all"
                class="sales-funnel-hit-area cursor-pointer"
                aria-label={`${item.stage}: ${item.deals} ${copy.deals}, ${copy.conversion} ${item.rate}%`}
                onMouseEnter$={(event) => {
                  activeRowId.value = item.id;
                  updateTooltip(event, item);
                }}
                onMouseMove$={(event) => {
                  activeRowId.value = item.id;
                  updateTooltip(event, item);
                }}
                onMouseLeave$={() => {
                  activeRowId.value = null;
                  tooltip.value = null;
                }}
              />
              <text
                x={detailLabelX}
                y={y + rowHeight / 2 + 1}
                text-anchor="start"
                dominant-baseline="middle"
                fill="#94a3b8"
                font-size="11"
                font-family="Inter, ui-sans-serif, system-ui, sans-serif"
              >
                {item.deals} {copy.deals} • {copy.conversion} {item.rate}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
