import { Link } from "react-router-dom";

const variants = {
  primary:
    "button-glow bg-brand-gradient text-slate-950 hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(124,248,210,0.25),0_18px_50px_rgba(39,228,242,0.24)]",
  secondary:
    "border border-white/12 bg-white/5 text-white hover:border-aqua/40 hover:bg-white/10",
  ghost:
    "border border-aqua/20 bg-aqua/8 text-aqua hover:border-aqua/40 hover:bg-aqua/12",
};

export default function CTAButton({
  children,
  className = "",
  disabled = false,
  href,
  target,
  rel,
  to,
  variant = "primary",
  ...props
}) {
  const sharedClassName = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${
    variants[variant]
  } ${disabled ? "cursor-not-allowed opacity-60 saturate-50 shadow-none" : ""} ${className}`;

  if (to && !disabled) {
    return (
      <Link className={sharedClassName} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a className={sharedClassName} href={href} rel={rel} target={target} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={sharedClassName} disabled={disabled} type="button" {...props}>
      {children}
    </button>
  );
}
