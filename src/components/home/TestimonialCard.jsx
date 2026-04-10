export default function TestimonialCard({ testimonial }) {
  return (
    <article className="panel-soft h-full p-6">
      <div className="mb-5 flex gap-1 text-aqua">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
      <p className="text-sm leading-7 text-slate-200">“{testimonial.quote}”</p>
      <div className="mt-6">
        <p className="font-semibold text-white">{testimonial.name}</p>
        <p className="text-sm text-slate-400">{testimonial.role}</p>
      </div>
    </article>
  );
}
