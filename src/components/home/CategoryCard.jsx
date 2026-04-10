import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  const Icon = category.icon;

  return (
    <Link
      className="panel-soft group surface-grid block overflow-hidden p-6 hover:-translate-y-1 hover:border-aqua/30"
      to={`/catalogo?categoria=${category.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl bg-gradient-to-br ${category.accent} p-3 text-slate-950`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          {category.name}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{category.name}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{category.description}</p>
      <span className="mt-6 inline-flex text-sm font-semibold text-aqua transition group-hover:translate-x-1">
        Ver diseños
      </span>
    </Link>
  );
}
