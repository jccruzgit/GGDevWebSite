export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";

  return (
    <div className={alignment}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
