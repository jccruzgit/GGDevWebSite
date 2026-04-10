const toneStyles = {
  info: "border-aqua/15 bg-aqua/8 text-slate-100",
  error: "border-rose-400/25 bg-rose-500/10 text-rose-100",
};

export default function InlineNotice({ children, className = "", tone = "info" }) {
  if (!children) {
    return null;
  }

  return (
    <div
      className={`rounded-[22px] border px-4 py-3 text-sm leading-6 ${toneStyles[tone]} ${className}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
