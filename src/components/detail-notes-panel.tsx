import { component$ } from "@builder.io/qwik";

type Tone = "blue" | "emerald" | "violet" | "amber" | "rose" | "slate";

type NoteItem = {
  id: string;
  title: string;
  text: string;
  icon: any;
  tone: Tone;
};

interface DetailNotesPanelProps {
  title: string;
  items: NoteItem[];
}

const toneStyles: Record<Tone, { box: string; icon: string; text: string }> = {
  blue: {
    box: "border-blue-200 bg-blue-50 text-blue-800",
    icon: "bg-blue-100 text-blue-600",
    text: "text-blue-800",
  },
  emerald: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-800",
  },
  violet: {
    box: "border-violet-200 bg-violet-50 text-violet-800",
    icon: "bg-violet-100 text-violet-600",
    text: "text-violet-800",
  },
  amber: {
    box: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "bg-amber-100 text-amber-600",
    text: "text-amber-800",
  },
  rose: {
    box: "border-rose-200 bg-rose-50 text-rose-800",
    icon: "bg-rose-100 text-rose-600",
    text: "text-rose-800",
  },
  slate: {
    box: "border-slate-200 bg-slate-50 text-slate-800",
    icon: "bg-slate-100 text-slate-600",
    text: "text-slate-800",
  },
};

export const DetailNotesPanel = component$((props: DetailNotesPanelProps) => {
  return (
    <div class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
      <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
        {props.title}
      </h3>
      <div class="space-y-3">
        {props.items.map((item) => {
          const Icon = item.icon;
          const tone = toneStyles[item.tone];

          return (
            <div
              key={item.id}
              class={`group/item rounded-xl border px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${tone.box}`}
            >
              <div class="flex items-start gap-3">
                <div
                  class={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover/item:scale-105 ${tone.icon}`}
                >
                  <Icon class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class={`text-sm font-medium ${tone.text}`}>{item.title}</p>
                  <p class="mt-1 text-sm leading-5 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
