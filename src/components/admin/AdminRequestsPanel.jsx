import { useMemo } from "react";
import { ExternalLink, Inbox, MessagesSquare } from "lucide-react";
import {
  requestStatusLabels,
  requestStatusOptions,
} from "@/services/requestService";

const requestSummaryCards = [
  {
    key: "total",
    label: "Total",
    valueKey: "total",
    className: "border-white/10 bg-white/5",
    labelClassName: "text-slate-400",
  },
  {
    key: "new",
    label: "Nuevas",
    valueKey: "new",
    className: "border-sky-400/20 bg-sky-400/10",
    labelClassName: "text-sky-100",
  },
  {
    key: "reviewing",
    label: "Revision",
    valueKey: "reviewing",
    className: "border-amber-400/20 bg-amber-400/10",
    labelClassName: "text-amber-100",
  },
  {
    key: "approved",
    label: "Aprobadas",
    valueKey: "approved",
    className: "border-emerald-400/20 bg-emerald-400/10",
    labelClassName: "text-emerald-100",
  },
];

function formatRequestDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusClassName(status) {
  const styles = {
    approved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
    closed: "border-slate-400/20 bg-slate-400/10 text-slate-200",
    new: "border-sky-400/20 bg-sky-400/10 text-sky-100",
    reviewing: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  };

  return styles[status] || styles.new;
}

function buildRequestSubtitle(request) {
  const segments = [];

  if (request.customerName) {
    segments.push(request.customerName);
  }

  if (request.productName) {
    segments.push(request.productName);
  }

  if (request.subject && request.subject !== request.productName) {
    segments.push(request.subject);
  }

  return segments.join(" - ");
}

export default function AdminRequestsPanel({
  actionRequestId,
  error,
  loading,
  onStatusChange,
  requests,
}) {
  const counts = useMemo(
    () =>
      requests.reduce(
        (accumulator, request) => {
          accumulator.total += 1;
          accumulator[request.status] = (accumulator[request.status] || 0) + 1;
          return accumulator;
        },
        {
          approved: 0,
          closed: 0,
          new: 0,
          reviewing: 0,
          total: 0,
        }
      ),
    [requests]
  );

  return (
    <section className="panel p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
            <MessagesSquare className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">Solicitudes y leads</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Aqui llegan las solicitudes de personalizacion, asesoria y pedidos iniciados desde el
            sitio publico.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {requestSummaryCards.map((card) => (
            <div
              key={card.key}
              className={`min-w-0 rounded-[22px] border px-4 py-4 text-center ${card.className}`}
            >
              <p
                className={`text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] sm:text-[11px] ${card.labelClassName}`}
              >
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-bold leading-none text-white">
                {counts[card.valueKey]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-[20px] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Cargando solicitudes...
        </div>
      ) : null}

      {!loading && requests.length === 0 ? (
        <div className="mt-6 flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <Inbox className="h-5 w-5 text-aqua" />
          Aun no han entrado solicitudes desde el sitio.
        </div>
      ) : null}

      {requests.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {requests.map((request) => {
            const processing = actionRequestId === request.id;
            const subtitle = buildRequestSubtitle(request);

            return (
              <article
                key={request.id}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                        {request.requestTypeLabel}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em] ${getStatusClassName(
                          request.status
                        )}`}
                      >
                        {request.statusLabel}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{request.title}</h3>
                    {subtitle ? (
                      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
                    ) : null}
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      {formatRequestDate(request.createdAt)}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {request.garmentColor ? (
                        <div className="rounded-[18px] border border-white/10 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Color</p>
                          <p className="mt-2 text-sm text-white">{request.garmentColor}</p>
                        </div>
                      ) : null}
                      {request.size ? (
                        <div className="rounded-[18px] border border-white/10 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Talla</p>
                          <p className="mt-2 text-sm text-white">{request.size}</p>
                        </div>
                      ) : null}
                      {request.quantity ? (
                        <div className="rounded-[18px] border border-white/10 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cantidad</p>
                          <p className="mt-2 text-sm text-white">{request.quantity}</p>
                        </div>
                      ) : null}
                      {request.placement ? (
                        <div className="rounded-[18px] border border-white/10 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Lado</p>
                          <p className="mt-2 text-sm text-white">{request.placement}</p>
                        </div>
                      ) : null}
                    </div>

                    {request.notes ? (
                      <div className="mt-4 rounded-[20px] border border-white/10 bg-night/30 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Notas</p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{request.notes}</p>
                      </div>
                    ) : null}

                    {(request.designFileName || request.designFileUrl) ? (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300">
                          {request.designFileName || "Archivo adjunto"}
                        </span>
                        {request.designFileUrl ? (
                          <a
                            className="inline-flex items-center gap-2 text-sm font-semibold text-aqua hover:text-white"
                            href={request.designFileUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Abrir archivo
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="w-full lg:max-w-[220px]">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Estado
                    </label>
                    <select
                      className="w-full rounded-[18px] border border-white/10 bg-surface-3 px-4 py-3 text-sm text-white focus:border-aqua/40 focus:outline-none"
                      disabled={processing}
                      onChange={(event) => onStatusChange(request.id, event.target.value)}
                      value={request.status}
                    >
                      {requestStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-3 text-xs text-slate-500">
                      {processing ? "Actualizando estado..." : requestStatusLabels[request.status]}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
