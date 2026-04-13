import { brandingAssets } from "@/assets/branding";

const variantStyles = {
  full: {
    wrapper: "inline-flex items-center",
    image: "h-14 w-auto object-contain sm:h-16",
  },
  icon: {
    wrapper:
      "inline-flex items-center justify-center rounded-[20px] border border-white/10 bg-white/5 p-2 shadow-[0_0_0_1px_rgba(124,248,210,0.08),0_18px_40px_rgba(39,228,242,0.12)] backdrop-blur-md",
    image: "h-8 w-8 object-contain sm:h-9 sm:w-9",
  },
};

export default function BrandLogo({
  alt = "GGDev",
  className = "",
  imgClassName = "",
  variant = "full",
  ...props
}) {
  const config = variantStyles[variant] ?? variantStyles.full;
  const src = brandingAssets[variant] ?? brandingAssets.full;

  return (
    <span className={`${config.wrapper} ${className}`.trim()}>
      <img alt={alt} className={`${config.image} ${imgClassName}`.trim()} src={src} {...props} />
    </span>
  );
}
