import SectionHeading from "@/components/ui/SectionHeading";

const layoutClasses = [
  "md:col-span-2 xl:col-span-7 xl:row-span-2",
  "xl:col-span-5",
  "xl:col-span-5",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-4",
];

export default function ExampleGallery({ items }) {
  return (
    <section>
      <SectionHeading
        description="Una vista rápida de cómo se sienten nuestros diseños sobre la prenda: contraste limpio, impacto visual y presencia lista para redes."
        eyebrow="Así se ven nuestras camisetas"
        title="Mockups y ejemplos para que no compres a ciegas"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`panel-soft group relative overflow-hidden ${layoutClasses[index] || "xl:col-span-4"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/15 to-transparent opacity-95" />
            <img
              alt={item.name}
              className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                index === 0 ? "h-[420px] sm:h-[520px]" : "h-[320px]"
              }`}
              src={item.image}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200 backdrop-blur-md">
                {item.category}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">{item.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
