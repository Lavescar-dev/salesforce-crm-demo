import { $, component$, useSignal } from "@builder.io/qwik";
import { chartCopy, useLocale } from "~/data/i18n";

export interface LeadSourceSlice {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface LeadSourcesPieChartProps {
  data: LeadSourceSlice[];
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) => ({
  x: cx + radius * Math.cos(toRadians(angle)),
  y: cy + radius * Math.sin(toRadians(angle)),
});

const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    cx,
    cy,
    "L",
    end.x,
    end.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    start.x,
    start.y,
    "Z",
  ].join(" ");
};

export const LeadSourcesPieChart = component$(
  (props: LeadSourcesPieChartProps) => {
    const locale = useLocale();
    const copy = chartCopy[locale.value];
    const tooltip = useSignal<{
      name: string;
      value: number;
      percent: number;
      x: number;
      y: number;
    } | null>(null);

    const width = 320;
    const height = 220;
    const cx = 145;
    const cy = 110;
    const radius = 70;
    const labelRadius = radius + 24;
    const total = Math.max(
      props.data.reduce((sum, item) => sum + item.value, 0),
      1,
    );

    const updateTooltip = $(
      (event: MouseEvent, slice: LeadSourceSlice, percent: number) => {
        const target = event.target as HTMLElement;
        const container = target.closest(".group.relative");
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        tooltip.value = {
          name: slice.name,
          value: slice.value,
          percent,
          x,
          y,
        };
      },
    );

    let startAngle = -90;
    const slices = props.data.map((item) => {
      const sweep = (item.value / total) * 360;
      const endAngle = startAngle + sweep;
      const midAngle = startAngle + sweep / 2;
      const labelPoint = polarToCartesian(cx, cy, labelRadius, midAngle);
      const path = describeArc(cx, cy, radius, startAngle, endAngle);

      startAngle = endAngle;

      return {
        ...item,
        labelX: labelPoint.x,
        labelY: labelPoint.y,
        path,
        percent: Math.round((item.value / total) * 100),
      };
    });

    return (
      <div class="group relative">
        {tooltip.value ? (
          <div
            class="pointer-events-none absolute z-50 rounded-lg bg-slate-900 px-2.5 py-2 text-left text-white shadow-xl"
            style={`left:${tooltip.value.x}px; top:${tooltip.value.y - 12}px; transform: translate(-50%, -100%); width: 140px;`}
          >
            <p class="text-[10px] font-medium text-slate-400">
              {tooltip.value.name}
            </p>
            <div class="mt-0.5 flex items-baseline gap-1.5">
              <span class="text-sm font-semibold">
                {tooltip.value.value} {copy.leads}
              </span>
              <span class="text-[10px] text-slate-400">
                {tooltip.value.percent}%
              </span>
            </div>
            <div class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
          </div>
        ) : null}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          class="mx-auto block h-[190px] w-full max-w-[20rem] sm:h-[210px] sm:max-w-[22rem]"
          role="img"
          aria-label={
            locale.value === "tr"
              ? "Lead kaynakları pasta grafiği"
              : "Lead sources pie chart"
          }
          onMouseLeave$={() => (tooltip.value = null)}
        >
          {slices.map((slice) => {
            const textAnchor =
              slice.labelX > cx + 10
                ? "start"
                : slice.labelX < cx - 10
                  ? "end"
                  : "middle";

            return (
              <g key={slice.id}>
                <path
                  d={slice.path}
                  fill={slice.color}
                  stroke="#ffffff"
                  stroke-width="2"
                  class="cursor-pointer transition duration-200 hover:brightness-95 hover:filter"
                  onMouseEnter$={(event) =>
                    updateTooltip(event, slice, slice.percent)
                  }
                  onMouseMove$={(event) =>
                    updateTooltip(event, slice, slice.percent)
                  }
                  onMouseLeave$={() => (tooltip.value = null)}
                />
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  text-anchor={textAnchor}
                  dominant-baseline="middle"
                  fill={slice.color}
                  font-size="12"
                  font-weight="600"
                  font-family="Inter, ui-sans-serif, system-ui, sans-serif"
                  class="pointer-events-none transition duration-200 group-hover:opacity-90"
                >
                  {slice.name} {slice.percent}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
);
