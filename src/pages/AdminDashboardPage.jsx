import { useEffect, useMemo, useState } from "react";
import { Boxes, ImagePlus, ShieldCheck, Sparkles } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import UploadBox from "@/components/ui/UploadBox";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import {
  createAdminProduct,
  fetchAdminProducts,
  productCategoryOptions,
  slugifyProductName,
} from "@/services/catalogService";
import { getProductPrimaryImage } from "@/utils/productMedia";

const DRAFT_STORAGE_KEY = "ggdev.admin.product-draft";

const initialForm = {
  active: true,
  category: "gaming",
  description: "",
  featured: false,
  name: "",
  price: "20",
  shortDescription: "",
  slug: "",
  tag: "",
};

function formatErrorMessage(error) {
  if (!error) {
    return "No se pudo guardar el producto.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.code === "23505") {
    return "Ya existe un producto con ese slug. Cámbialo e intenta de nuevo.";
  }

  return error.message || "No se pudo guardar el producto.";
}

function hasDraftChanges(form) {
  return JSON.stringify(form) !== JSON.stringify(initialForm);
}

function readStoredDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!rawDraft) {
      return null;
    }

    return JSON.parse(rawDraft);
  } catch {
    return null;
  }
}

function clearStoredDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}

export default function AdminDashboardPage() {
  const { refreshProducts } = useCatalog();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [fileNameDraft, setFileNameDraft] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [draftRecovered, setDraftRecovered] = useState(false);

  const isDirty = useMemo(
    () => hasDraftChanges(form) || Boolean(file) || Boolean(fileNameDraft),
    [file, fileNameDraft, form]
  );

  useEffect(() => {
    const storedDraft = readStoredDraft();

    if (!storedDraft) {
      return;
    }

    if (storedDraft.form) {
      setForm({
        ...initialForm,
        ...storedDraft.form,
      });
    }

    setSlugTouched(Boolean(storedDraft.slugTouched));
    setFileNameDraft(storedDraft.fileNameDraft || "");
    setDraftRecovered(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setProductsLoading(true);

      try {
        const nextProducts = await fetchAdminProducts();

        if (!isMounted) {
          return;
        }

        setProducts(nextProducts);
        setProductsError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setProductsError(error.message || "No se pudo cargar el listado de productos.");
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    if (!isDirty) {
      clearStoredDraft();
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        fileNameDraft,
        form,
        slugTouched,
      })
    );
  }, [fileNameDraft, form, isDirty, slugTouched]);

  useEffect(() => {
    if (!isDirty || typeof window === "undefined") {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleFieldChange = (event) => {
    const { checked, name, type, value } = event.target;
    setSubmitSuccess("");

    setForm((current) => {
      const nextValue = type === "checkbox" ? checked : value;

      if (name === "name" && !slugTouched) {
        return {
          ...current,
          name: value,
          slug: slugifyProductName(value),
        };
      }

      return {
        ...current,
        [name]: nextValue,
      };
    });

    if (name === "slug") {
      setSlugTouched(true);
    }
  };

  const handleFileSelect = (nextFile) => {
    setSubmitSuccess("");
    setFile(nextFile || null);
    setFileNameDraft(nextFile?.name || "");
  };

  const resetForm = () => {
    setForm(initialForm);
    setFile(null);
    setFileNameDraft("");
    setSlugTouched(false);
    setDraftRecovered(false);
    clearStoredDraft();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      if (!file) {
        throw new Error("Sube la imagen principal del producto antes de guardarlo.");
      }

      if (!form.slug) {
        throw new Error("El producto necesita un slug válido.");
      }

      const createdProduct = await createAdminProduct({
        file,
        product: {
          ...form,
          slug: slugifyProductName(form.slug),
        },
        userId: user?.id,
      });

      setProducts((current) => [createdProduct, ...current]);
      setSubmitSuccess("Producto guardado y publicado en el catálogo.");
      resetForm();
      await refreshProducts();
    } catch (error) {
      setSubmitError(formatErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft p-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-aqua">
              <Boxes className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">Productos remotos</p>
            <p className="mt-2 text-3xl font-bold text-white">{products.length}</p>
          </div>
          <div className="panel-soft p-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-aqua">
              <ImagePlus className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">Uso inmediato</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              El panel ya sube la imagen principal al bucket y crea el producto en Supabase.
            </p>
          </div>
          <div className="panel-soft p-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-aqua">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">Escalable</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              La base ya contempla perfiles, roles y módulos futuros para crecer sin rehacer el
              panel.
            </p>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">Productos creados desde el admin</h2>
              <p className="mt-1 text-sm text-slate-400">
                Aquí se listan los productos remotos cargados desde Supabase.
              </p>
            </div>
          </div>

          {productsError ? (
            <div className="mt-6 rounded-[20px] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {productsError}
            </div>
          ) : null}

          {productsLoading ? (
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Cargando productos remotos...
            </div>
          ) : null}

          {!productsLoading && products.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Aún no hay productos creados desde el admin. El primero que subas aparecerá aquí y
              también en el catálogo público.
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {products.map((product) => (
                <article key={product.slug} className="panel-soft overflow-hidden">
                  <ProductImage
                    alt={product.name}
                    className="h-72"
                    fit="contain"
                    image={getProductPrimaryImage(product)}
                    imageClassName="p-4"
                    name={product.name}
                    surfaceClassName="bg-slate-100"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                        {product.categoryLabel}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-aqua">
                        {product.active ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{product.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {product.shortDescription}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">
                      /producto/{product.slug}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white">Agregar nuevo diseño</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Este formulario crea el producto en Supabase y sube la imagen principal al bucket
          público del catálogo.
        </p>

        {draftRecovered ? (
          <div className="mt-6 rounded-[20px] border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Recuperamos tu borrador local. Si habías cargado una imagen antes de salir, debes
            seleccionarla nuevamente por seguridad del navegador.
          </div>
        ) : null}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Nombre</span>
              <input
                className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
                name="name"
                onChange={handleFieldChange}
                placeholder="Mango Fortnite"
                value={form.name}
              />
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Slug</span>
              <input
                className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
                name="slug"
                onChange={handleFieldChange}
                placeholder="mango-fortnite"
                value={form.slug}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Categoría</span>
              <select
                className="w-full rounded-[20px] border border-white/10 bg-surface-3 px-4 py-3 text-sm text-white focus:border-aqua/40 focus:outline-none"
                name="category"
                onChange={handleFieldChange}
                value={form.category}
              >
                {productCategoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Precio</span>
              <input
                className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
                min="0"
                name="price"
                onChange={handleFieldChange}
                placeholder="20"
                step="0.01"
                type="number"
                value={form.price}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-3 block text-sm font-semibold text-white">Descripción corta</span>
            <input
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
              name="shortDescription"
              onChange={handleFieldChange}
              placeholder="Gráfica gamer en alto contraste sobre negro."
              value={form.shortDescription}
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-semibold text-white">Descripción completa</span>
            <textarea
              className="min-h-32 w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
              name="description"
              onChange={handleFieldChange}
              placeholder="Describe el diseño, su estilo y la intención visual."
              value={form.description}
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-semibold text-white">Tag opcional</span>
            <input
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
              name="tag"
              onChange={handleFieldChange}
              placeholder="Nuevo drop"
              value={form.tag}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="panel-soft flex items-center gap-3 p-4">
              <input
                checked={form.active}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-aqua focus:ring-aqua/30"
                name="active"
                onChange={handleFieldChange}
                type="checkbox"
              />
              <span className="text-sm text-slate-200">Publicar en el catálogo</span>
            </label>

            <label className="panel-soft flex items-center gap-3 p-4">
              <input
                checked={form.featured}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-aqua focus:ring-aqua/30"
                name="featured"
                onChange={handleFieldChange}
                type="checkbox"
              />
              <span className="text-sm text-slate-200">Marcar como destacado</span>
            </label>
          </div>

          <UploadBox
            fileName={file?.name || fileNameDraft}
            onFileSelect={handleFileSelect}
          />

          <div className="panel-soft overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-semibold text-white">Vista previa de imagen principal</p>
            </div>
            <ProductImage
              alt="Vista previa del producto"
              className="h-[360px]"
              fit="contain"
              image={previewUrl}
              imageClassName="p-4"
              name={form.name || "Nuevo diseño"}
              surfaceClassName="bg-slate-100"
            />
          </div>

          {submitError ? (
            <div className="rounded-[20px] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {submitError}
            </div>
          ) : null}

          {submitSuccess ? (
            <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {submitSuccess}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-slate-950 button-glow disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Guardando producto..." : "Guardar producto en Supabase"}
            </button>
            <button
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua"
              onClick={resetForm}
              type="button"
            >
              Limpiar borrador
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
