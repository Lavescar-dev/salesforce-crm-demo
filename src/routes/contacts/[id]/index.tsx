import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  ArrowLeftIcon,
  Building2Icon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
  MailIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { DetailNotesPanel } from "~/components/detail-notes-panel";
import { useDemoData } from "~/data/demo-state";
import { useLocale } from "~/data/i18n";

const contactDetailCopy = {
  en: {
    notFound: "Contact not found",
    back: "Back to Contacts",
    edit: "Edit Contact",
    email: "Email",
    call: "Call",
    account: "Account",
    role: "Role",
    contactSummary: "Contact Summary",
    primaryAccount: "Primary Account",
    lifecycle: "Lifecycle",
    relatedOpportunities: "Related Opportunities",
    noOpportunities: "No opportunities linked to this contact's account yet.",
    communicationTimeline: "Communication Timeline",
    relatedAccount: "Related Account",
    noAccountRecord: "No account record available.",
    nextTouchpoints: "Next Touchpoints",
    phone: "Phone",
    labels: {
      Active: "Active",
      Inactive: "Inactive",
    },
    relatedAccountLabels: {
      type: "Type",
      status: "Status",
    },
    accountTypeLabels: {
      Enterprise: "Enterprise",
      "Mid-Market": "Mid-Market",
      "Small Business": "Small Business",
    },
    accountStatusLabels: {
      Active: "Active",
      Inactive: "Inactive",
      Prospect: "Prospect",
    },
    opportunityStages: {
      Prospecting: "Prospecting",
      Qualification: "Qualification",
      Proposal: "Proposal",
      Negotiation: "Negotiation",
      "Closed Won": "Closed Won",
      "Closed Lost": "Closed Lost",
    },
    activityItems: [
      {
        title: "Follow-up email sent",
        description:
          "Recap from the last discovery call and product materials shared.",
        time: "Today",
      },
      {
        title: "Phone call completed",
        description: "Discussed rollout timeline and key decision makers.",
        time: "3 days ago",
      },
      {
        title: "Account meeting scheduled",
        description: "Executive sponsor alignment set for next week.",
        time: "1 week ago",
      },
    ],
    notes: [
      {
        title: "Review Meeting",
        text: "Confirm the next review meeting with the sponsor and finance stakeholders.",
      },
      {
        title: "Scope Update",
        text: "Share updated implementation scope once the account owner signs off.",
      },
      {
        title: "Executive Alignment",
        text: "Prepare a short product recap for executive alignment.",
      },
    ],
  },
  tr: {
    notFound: "Kişi bulunamadı",
    back: "Kişilere geri dön",
    edit: "Kişiyi Düzenle",
    email: "E-posta",
    call: "Ara",
    account: "Hesap",
    role: "Rol",
    contactSummary: "Kişi Özeti",
    primaryAccount: "Birincil Hesap",
    lifecycle: "Yaşam Döngüsü",
    relatedOpportunities: "İlgili Fırsatlar",
    noOpportunities: "Bu kişinin hesabına bağlı fırsat henüz yok.",
    communicationTimeline: "İletişim Zaman Çizelgesi",
    relatedAccount: "İlgili Hesap",
    noAccountRecord: "Kullanılabilir hesap kaydı yok.",
    nextTouchpoints: "Sonraki Temas Noktaları",
    phone: "Telefon",
    labels: {
      Active: "Aktif",
      Inactive: "Pasif",
    },
    relatedAccountLabels: {
      type: "Tür",
      status: "Durum",
    },
    accountTypeLabels: {
      Enterprise: "Kurumsal",
      "Mid-Market": "Orta Pazar",
      "Small Business": "Küçük İşletme",
    },
    accountStatusLabels: {
      Active: "Aktif",
      Inactive: "Pasif",
      Prospect: "Potansiyel",
    },
    opportunityStages: {
      Prospecting: "Keşif",
      Qualification: "Nitelendirme",
      Proposal: "Teklif",
      Negotiation: "Müzakere",
      "Closed Won": "Kazanıldı",
      "Closed Lost": "Kayıp",
    },
    activityItems: [
      {
        title: "Takip e-postası gönderildi",
        description:
          "Son keşif görüşmesinin özeti ve ürün materyalleri paylaşıldı.",
        time: "Bugün",
      },
      {
        title: "Telefon görüşmesi tamamlandı",
        description: "Yaygınlaştırma zamanlaması ve karar vericiler konuşuldu.",
        time: "3 gün önce",
      },
      {
        title: "Hesap toplantısı planlandı",
        description: "Yönetici sponsor uyumu gelecek hafta için ayarlandı.",
        time: "1 hafta önce",
      },
    ],
    notes: [
      {
        title: "İnceleme Toplantısı",
        text: "Sponsor ve finans paydaşlarıyla bir sonraki inceleme toplantısını onayla.",
      },
      {
        title: "Kapsam Güncellemesi",
        text: "Hesap sahibi onay verdiğinde güncellenmiş uygulama kapsamını paylaş.",
      },
      {
        title: "Yönetici Uyumlaması",
        text: "Yönetici uyumu için kısa bir ürün özeti hazırla.",
      },
    ],
  },
} as const;

export default component$(() => {
  const demoData = useDemoData();
  const locale = useLocale();
  const copy = contactDetailCopy[locale.value];
  const location = useLocation();
  const id = location.params.id;
  const contact = demoData.contacts.find((item) => item.id === id);

  const getStatusColor = (status: string) =>
    status === "Active"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-slate-100 text-slate-800";

  if (!contact) {
    return (
      <div class="p-4 sm:p-6">
        <div class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-slate-500">{copy.notFound}</p>
          <Link
            href="/contacts"
            class="mt-4 inline-block text-blue-700 transition hover:text-blue-800"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.title = locale.value === "tr" ? "Kişi Detayı" : "Contact Detail";
  });

  const relatedAccount = demoData.accounts.find(
    (item) => item.name === contact.account,
  );
  const relatedOpportunities = demoData.opportunities.filter(
    (item) => item.account === contact.account,
  );
  const surfaceCardClass =
    "group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6";

  const activity = copy.activityItems.map((item, index) => ({
    ...item,
    icon: [MailIcon, PhoneIcon, ClockIcon][index],
    color: [
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-violet-100 text-violet-600",
    ][index],
  }));

  return (
    <div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <Link
            href="/contacts"
            class="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </Link>
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
              {contact.name}
            </h1>
            <p class="mt-1 truncate text-sm text-slate-600 sm:text-base">
              {contact.title}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/contacts/${id}/edit`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <EditIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.edit}</span>
          </Link>
          <a
            href={`mailto:${contact.email}`}
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <MailIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.email}</span>
          </a>
          <a
            href={`tel:${contact.phone}`}
            class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-4"
          >
            <PhoneIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            <span class="text-xs font-medium sm:text-sm">{copy.call}</span>
          </a>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getStatusColor(contact.status)}`}
        >
          {copy.labels[contact.status as keyof typeof copy.labels] ??
            contact.status}
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3 sm:text-sm">
          {contact.account}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-blue-50 p-2 transition duration-200 group-hover:scale-105">
              <MailIcon class="h-5 w-5 text-blue-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.email}
            </p>
          </div>
          <p class="break-all text-sm font-medium text-slate-900">
            {contact.email}
          </p>
        </div>

        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-emerald-50 p-2 transition duration-200 group-hover:scale-105">
              <PhoneIcon class="h-5 w-5 text-emerald-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.phone}
            </p>
          </div>
          <p class="text-sm font-medium text-slate-900">{contact.phone}</p>
        </div>

        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-violet-50 p-2 transition duration-200 group-hover:scale-105">
              <Building2Icon class="h-5 w-5 text-violet-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.account}
            </p>
          </div>
          <p class="text-sm font-medium text-slate-900">{contact.account}</p>
        </div>

        <div class={surfaceCardClass}>
          <div class="mb-2 flex items-center gap-3">
            <div class="rounded-xl bg-amber-50 p-2 transition duration-200 group-hover:scale-105">
              <UsersIcon class="h-5 w-5 text-amber-600" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.role}
            </p>
          </div>
          <p class="text-sm font-medium text-slate-900">{contact.title}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-6">
        <div class="space-y-4 lg:col-span-2 sm:space-y-6">
          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.contactSummary}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.primaryAccount}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {contact.account}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4 transition duration-200 group-hover:bg-slate-100/70">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {copy.lifecycle}
                </p>
                <p class="mt-2 text-sm font-medium text-slate-900">
                  {copy.labels[contact.status as keyof typeof copy.labels] ??
                    contact.status}
                </p>
              </div>
            </div>
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.relatedOpportunities}
            </h2>
            {relatedOpportunities.length > 0 ? (
              <div class="space-y-3">
                {relatedOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 transition duration-200 hover:bg-slate-100/70"
                  >
                    <div class="min-w-0">
                      <Link
                        href={`/opportunities/${opportunity.id}`}
                        class="truncate text-sm font-medium text-blue-700 transition hover:text-blue-800"
                      >
                        {opportunity.name}
                      </Link>
                      <p class="mt-1 text-xs text-slate-500">
                        {copy.opportunityStages[
                          opportunity.stage as keyof typeof copy.opportunityStages
                        ] ?? opportunity.stage}
                      </p>
                    </div>
                    <span class="text-sm font-semibold text-slate-900">
                      ${opportunity.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noOpportunities}</p>
            )}
          </div>

          <div class={surfaceCardClass}>
            <h2 class="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              {copy.communicationTimeline}
            </h2>
            <div class="space-y-4">
              {activity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    class="group flex gap-3 rounded-xl px-2 py-2 transition duration-200 hover:bg-slate-50 sm:gap-4"
                  >
                    <div class="flex flex-col items-center flex-shrink-0">
                      <div
                        class={`flex h-8 w-8 items-center justify-center rounded-full transition duration-200 group-hover:scale-105 ${item.color}`}
                      >
                        <Icon class="h-4 w-4" />
                      </div>
                      {index < activity.length - 1 ? (
                        <div class="mt-2 h-full w-0.5 bg-slate-200" />
                      ) : null}
                    </div>
                    <div class="min-w-0 flex-1 pb-4">
                      <p class="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p class="mt-1 text-xs text-slate-600 sm:text-sm">
                        {item.description}
                      </p>
                      <p class="mt-2 text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div class="space-y-4 sm:space-y-6">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 class="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
              {copy.relatedAccount}
            </h3>
            {relatedAccount ? (
              <div class="space-y-3">
                <p class="text-base font-semibold text-slate-900">
                  {relatedAccount.name}
                </p>
                <p class="text-sm text-slate-600">{relatedAccount.industry}</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-xl bg-slate-50 p-3">
                    <p class="text-xs text-slate-500">
                      {copy.relatedAccountLabels.type}
                    </p>
                    <p class="mt-1 text-sm font-medium text-slate-900">
                      {copy.accountTypeLabels[
                        relatedAccount.type as keyof typeof copy.accountTypeLabels
                      ] ?? relatedAccount.type}
                    </p>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-3">
                    <p class="text-xs text-slate-500">
                      {copy.relatedAccountLabels.status}
                    </p>
                    <p class="mt-1 text-sm font-medium text-slate-900">
                      {copy.accountStatusLabels[
                        relatedAccount.status as keyof typeof copy.accountStatusLabels
                      ] ?? relatedAccount.status}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/accounts/${relatedAccount.id}`}
                  class="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  {locale.value === "tr" ? "Hesabı Aç" : "Open Account"}
                </Link>
              </div>
            ) : (
              <p class="text-sm text-slate-500">{copy.noAccountRecord}</p>
            )}
          </div>

          <DetailNotesPanel
            title={copy.nextTouchpoints}
            items={[
              {
                id: "review",
                title: copy.notes[0].title,
                text: copy.notes[0].text,
                icon: CalendarIcon,
                tone: "blue",
              },
              {
                id: "scope",
                title: copy.notes[1].title,
                text: copy.notes[1].text,
                icon: MailIcon,
                tone: "emerald",
              },
              {
                id: "alignment",
                title: copy.notes[2].title,
                text: copy.notes[2].text,
                icon: UsersIcon,
                tone: "violet",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contact Detail",
  meta: [
    {
      name: "description",
      content: "Inspect a contact in the Qwik CRM demo.",
    },
  ],
};
