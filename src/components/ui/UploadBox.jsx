import { ImageUp } from "lucide-react";

export default function UploadBox({ onFileSelect, fileName }) {
  return (
    <label className="panel-soft surface-grid flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-dashed px-6 py-10 text-center hover:border-aqua/30 hover:bg-white/6">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
        <ImageUp className="h-6 w-6" />
      </span>
      <span className="text-lg font-semibold text-white">Sube tu diseño en PNG o JPG</span>
      <span className="mt-2 max-w-md text-sm leading-7 text-slate-300">
        Arrastra tu archivo o toca aquí para elegir una imagen y verla aplicada sobre la prenda.
      </span>
      <span className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
        {fileName || "Aún no has cargado un archivo"}
      </span>
      <input
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(event) => onFileSelect(event.target.files?.[0])}
        type="file"
      />
    </label>
  );
}
