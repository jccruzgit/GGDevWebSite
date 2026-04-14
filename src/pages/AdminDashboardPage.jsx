import { useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import UploadBox from "@/components/ui/UploadBox";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  productCategoryOptions,
  slugifyProductName,
  updateAdminProduct,
} from "@/services/catalogService";
import { getProductPrimaryImage } from "@/utils/productMedia";

const DRAFT_STORAGE_KEY = "ggdev.admin.product-draft";
const ADMIN_PRODUCTS_PER_PAGE = 6;

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
  if (!error) return "No se pudo guardar el producto.";
  if (typeof error === "string") return error;
  if (error.code === "23505") return "Ya existe un producto con ese slug. Cámbialo e intenta de nuevo.";
  return error.message || "No se pudo guardar el producto.";
}

function readStoredDraft() {
  if (typeof window === "undefined") return null;
  try {
    const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    return rawDraft ? JSON.parse(rawDraft) : null;
  } catch {
    return null;
  }
}

function clearStoredDraft() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  }
}

function toForm(product) {
  return {
    active: Boolean(product.active),
    category: product.category || "gaming",
    description: product.description || "",
    featured: Boolean(product.featured),
    name: product.name || "",
    price: String(product.price ?? 20),
    shortDescription: product.shortDescription || "",
    slug: product.slug || "",
    tag: product.tag || "",
  };
}

function serializeGalleryItems(items) {
  return JSON.stringify(
    items.map((item) =>
      item.kind === "existing"
        ? { kind: "existing", path: item.path }
        : { kind: "new", fileName: item.file?.name || item.name || "" }
    )
  );
}

function buildExistingGalleryItems(product) {
  return (product.secondaryImagePaths || []).map((path, index) => ({
    id: `existing-${path}`,
    kind: "existing",
    name: `Vista ${index + 1}`,
    path,
    preview: product.secondaryImages?.[index] || "",
  }));
}

function createNewGalleryItems(files) {
  return files.map((file, index) => ({
    id: `new-${Date.now()}-${index}-${file.name}`,
    kind: "new",
    file,
    name: file.name,
    preview: URL.createObjectURL(file),
  }));
}

function releaseGalleryItems(items) {
  items.forEach((item) => {
    if (item.kind === "new" && item.preview) {
      URL.revokeObjectURL(item.preview);
    }
  });
}

function buildGalleryPayload(items) {
  return items.map((item) =>
    item.kind === "existing"
      ? { kind: "existing", path: item.path }
      : { kind: "new", file: item.file }
  );
}

function moveItem(items, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= items.length) return items;
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export default function AdminDashboardPage() {
  const { refreshProducts } = useCatalog();
  const { user } = useAuth();
  const galleryItemsRef = useRef([]);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [baselineForm, setBaselineForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [fileNameDraft, setFileNameDraft] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [galleryItems, setGalleryItems] = useState([]);
  const [baselineGallery, setBaselineGallery] = useState("[]");
  const [galleryDraftNames, setGalleryDraftNames] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [draftRecovered, setDraftRecovered] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionProductId, setActionProductId] = useState("");
  const [productsPage, setProductsPage] = useState(1);

  const isEditing = Boolean(editingProduct);
  const isDirty = useMemo(() => {
    const formChanged = JSON.stringify(form) !== JSON.stringify(baselineForm);
    const galleryChanged = serializeGalleryItems(galleryItems) !== baselineGallery;

    return (
      formChanged ||
      galleryChanged ||
      Boolean(file) ||
      Boolean(fileNameDraft && !isEditing) ||
      Boolean(galleryDraftNames.length && !isEditing)
    );
  }, [baselineForm, baselineGallery, file, fileNameDraft, form, galleryDraftNames.length, galleryItems, isEditing]);

  useEffect(() => {
    galleryItemsRef.current = galleryItems;
  }, [galleryItems]);

  useEffect(() => {
    return () => {
      releaseGalleryItems(galleryItemsRef.current);
    };
  }, []);

  useEffect(() => {
    const storedDraft = readStoredDraft();

    if (storedDraft?.form) {
      setForm({ ...initialForm, ...storedDraft.form });
      setBaselineForm(initialForm);
      setSlugTouched(Boolean(storedDraft.slugTouched));
      setFileNameDraft(storedDraft.fileNameDraft || "");
      setGalleryDraftNames(Array.isArray(storedDraft.galleryDraftNames) ? storedDraft.galleryDraftNames : []);
      setDraftRecovered(true);
    }

    let isMounted = true;

    const loadProducts = async () => {
      setProductsLoading(true);

      try {
        const nextProducts = await fetchAdminProducts();
        if (!isMounted) return;
        setProducts(nextProducts);
        setProductsError("");
      } catch (error) {
        if (!isMounted) return;
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
    if (isEditing || typeof window === "undefined") return;

    if (!isDirty) {
      clearStoredDraft();
      return;
    }

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        fileNameDraft,
        form,
        galleryDraftNames,
        slugTouched,
      })
    );
  }, [fileNameDraft, form, galleryDraftNames, isDirty, isEditing, slugTouched]);

  useEffect(() => {
    if (!isDirty || typeof window === "undefined") return undefined;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const loadCreateDraft = () => {
    const storedDraft = readStoredDraft();

    if (storedDraft?.form) {
      setForm({ ...initialForm, ...storedDraft.form });
      setBaselineForm(initialForm);
      setSlugTouched(Boolean(storedDraft.slugTouched));
      setFileNameDraft(storedDraft.fileNameDraft || "");
      setGalleryDraftNames(Array.isArray(storedDraft.galleryDraftNames) ? storedDraft.galleryDraftNames : []);
      setDraftRecovered(true);
    } else {
      setForm(initialForm);
      setBaselineForm(initialForm);
      setSlugTouched(false);
      setFileNameDraft("");
      setGalleryDraftNames([]);
      setDraftRecovered(false);
    }

    setBaselineGallery("[]");
    setGalleryItems([]);
  };

  const resetToCreate = () => {
    releaseGalleryItems(galleryItemsRef.current);
    setEditingProduct(null);
    setFile(null);
    setPreviewUrl("");
    setSubmitError("");
    setSubmitSuccess("");
    loadCreateDraft();
  };

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

      return { ...current, [name]: nextValue };
    });

    if (name === "slug") {
      setSlugTouched(true);
    }
  };

  const handleMainFileSelect = (nextFile) => {
    setSubmitSuccess("");
    setFile(nextFile || null);
    setFileNameDraft(nextFile?.name || "");
  };

  const handleGalleryFilesSelect = (nextFiles) => {
    const files = Array.isArray(nextFiles) ? nextFiles.filter(Boolean) : [];
    if (files.length === 0) return;

    setSubmitSuccess("");
    setGalleryDraftNames(files.map((nextFile) => nextFile.name));
    setGalleryItems((current) => [...current, ...createNewGalleryItems(files)]);
  };

  const handleEditProduct = (product) => {
    if (
      isDirty &&
      !window.confirm("Hay cambios sin guardar. ¿Quieres descartarlos para editar este producto?")
    ) {
      return;
    }

    releaseGalleryItems(galleryItemsRef.current);

    const nextForm = toForm(product);
    const nextGalleryItems = buildExistingGalleryItems(product);

    setEditingProduct(product);
    setForm(nextForm);
    setBaselineForm(nextForm);
    setFile(null);
    setFileNameDraft("");
    setPreviewUrl("");
    setGalleryItems(nextGalleryItems);
    setBaselineGallery(serializeGalleryItems(nextGalleryItems));
    setGalleryDraftNames([]);
    setSlugTouched(true);
    setDraftRecovered(false);
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleRemoveGalleryItem = (itemId) => {
    setSubmitSuccess("");

    setGalleryItems((current) => {
      const itemToRemove = current.find((item) => item.id === itemId);
      if (itemToRemove?.kind === "new") {
        releaseGalleryItems([itemToRemove]);
      }

      const nextItems = current.filter((item) => item.id !== itemId);
      setGalleryDraftNames(
        nextItems.filter((item) => item.kind === "new").map((item) => item.file?.name || item.name)
      );
      return nextItems;
    });
  };

  const handleMoveGalleryItem = (index, direction) => {
    setSubmitSuccess("");
    setGalleryItems((current) => moveItem(current, index, index + direction));
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo? Esta acción no se puede deshacer.`)) {
      return;
    }

    setActionProductId(product.remoteId);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await deleteAdminProduct({
        mainImagePath: product.mainImagePath,
        productId: product.remoteId,
        secondaryImagePaths: product.secondaryImagePaths,
      });

      setProducts((current) => current.filter((item) => item.remoteId !== product.remoteId));

      if (editingProduct?.remoteId === product.remoteId) {
        resetToCreate();
      }

      await refreshProducts();
    } catch (error) {
      setSubmitError(formatErrorMessage(error));
    } finally {
      setActionProductId("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      if (!isEditing && !file) {
        throw new Error("Sube la imagen principal del producto antes de guardarlo.");
      }

      if (!form.slug) {
        throw new Error("El producto necesita un slug válido.");
      }

      const payload = {
        ...form,
        slug: slugifyProductName(form.slug),
      };

      if (isEditing) {
        const updatedProduct = await updateAdminProduct({
          currentImagePath: editingProduct.mainImagePath,
          currentSecondaryImagePaths: editingProduct.secondaryImagePaths,
          file,
          product: payload,
          productId: editingProduct.remoteId,
          secondaryGalleryItems: buildGalleryPayload(galleryItems),
          userId: user?.id,
        });

        releaseGalleryItems(galleryItemsRef.current);

        const nextForm = toForm(updatedProduct);
        const nextGalleryItems = buildExistingGalleryItems(updatedProduct);

        setProducts((current) =>
          current.map((product) => (product.remoteId === updatedProduct.remoteId ? updatedProduct : product))
        );
        setEditingProduct(updatedProduct);
        setForm(nextForm);
        setBaselineForm(nextForm);
        setFile(null);
        setFileNameDraft("");
        setPreviewUrl("");
        setGalleryItems(nextGalleryItems);
        setBaselineGallery(serializeGalleryItems(nextGalleryItems));
        setGalleryDraftNames([]);
        setSubmitSuccess("Producto actualizado correctamente.");
      } else {
        const createdProduct = await createAdminProduct({
          file,
          product: payload,
          secondaryGalleryItems: buildGalleryPayload(galleryItems),
          userId: user?.id,
        });

        releaseGalleryItems(galleryItemsRef.current);

        setProducts((current) => [createdProduct, ...current]);
        setSubmitSuccess("Producto guardado y publicado en el catálogo.");
        setFile(null);
        setPreviewUrl("");
        setEditingProduct(null);
        clearStoredDraft();
        loadCreateDraft();
      }

      await refreshProducts();
    } catch (error) {
      setSubmitError(formatErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const galleryCountLabel = useMemo(() => {
    if (galleryItems.length > 0) {
      return `${galleryItems.length} vista${galleryItems.length === 1 ? "" : "s"} en la galería`;
    }

    if (galleryDraftNames.length > 0) {
      return galleryDraftNames.join(", ");
    }

    return "";
  }, [galleryDraftNames, galleryItems.length]);

  const totalProductPages = useMemo(
    () => Math.max(1, Math.ceil(products.length / ADMIN_PRODUCTS_PER_PAGE)),
    [products.length]
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (productsPage - 1) * ADMIN_PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + ADMIN_PRODUCTS_PER_PAGE);
  }, [products, productsPage]);

  const paginationLabel = useMemo(() => {
    if (products.length === 0) {
      return "0 productos";
    }

    const start = (productsPage - 1) * ADMIN_PRODUCTS_PER_PAGE + 1;
    const end = Math.min(productsPage * ADMIN_PRODUCTS_PER_PAGE, products.length);

    return `Mostrando ${start}-${end} de ${products.length} productos`;
  }, [products.length, productsPage]);

  useEffect(() => {
    setProductsPage((currentPage) => Math.min(currentPage, totalProductPages));
  }, [totalProductPages]);

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
            <p className="mt-4 text-sm font-semibold text-white">Galería editable</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Ahora puedes agregar vistas, quitar imágenes individuales y cambiar el orden antes de guardar.
            </p>
          </div>

          <div className="panel-soft p-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-aqua">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">Escalable</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              La base ya contempla perfiles, roles y más módulos internos sin rehacer el panel.
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
                Aquí puedes entrar a editar la galería o eliminar productos remotos.
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-300">{paginationLabel}</p>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={productsPage === 1}
                  onClick={() => setProductsPage((currentPage) => Math.max(1, currentPage - 1))}
                  type="button"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </button>
                <span className="min-w-24 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Página {productsPage} de {totalProductPages}
                </span>
                <button
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={productsPage === totalProductPages}
                  onClick={() =>
                    setProductsPage((currentPage) => Math.min(totalProductPages, currentPage + 1))
                  }
                  type="button"
                >
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}

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
              Aún no hay productos creados desde el admin. El primero que subas aparecerá aquí y también en el catálogo público.
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {paginatedProducts.map((product) => {
                const processing = actionProductId === product.remoteId;

                return (
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
                      <p className="mt-2 text-sm leading-7 text-slate-300">{product.shortDescription}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">
                        /producto/{product.slug}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        Galería: {Array.isArray(product.secondaryImages) ? product.secondaryImages.length : 0} vistas
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua"
                          onClick={() => handleEditProduct(product)}
                          type="button"
                        >
                          <PencilLine className="h-4 w-4" />
                          Editar
                        </button>

                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100 hover:border-red-400/40 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={processing}
                          onClick={() => void handleDeleteProduct(product)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Editar producto y galería" : "Agregar nuevo diseño"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {isEditing
                ? "Conserva las vistas que quieras, elimina las que ya no sirven, cambia el orden y agrega nuevas imágenes antes de guardar."
                : "Este formulario crea el producto en Supabase y sube la imagen principal junto con la galería secundaria al bucket público del catálogo."}
            </p>
          </div>

          {isEditing ? (
            <button
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua"
              onClick={resetToCreate}
              type="button"
            >
              Volver a crear
            </button>
          ) : null}
        </div>

        {draftRecovered && !isEditing ? (
          <div className="mt-6 rounded-[20px] border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Recuperamos tu borrador local. Si habías cargado imágenes antes de salir, debes seleccionarlas nuevamente por seguridad del navegador.
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
                placeholder="Manco Fortnite"
                value={form.name}
              />
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Slug</span>
              <input
                className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
                name="slug"
                onChange={handleFieldChange}
                placeholder="manco-fortnite"
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

          <UploadBox fileName={file?.name || fileNameDraft} onFileSelect={handleMainFileSelect} />

          <UploadBox
            description="Agrega nuevas imágenes a la galería. Si ya estás editando un producto, se sumarán a las vistas existentes para que puedas reordenarlas o quitar las que no necesites."
            fileName={galleryCountLabel}
            multiple
            onFileSelect={handleGalleryFilesSelect}
            title="Sube imágenes secundarias"
          />

          <div className="panel-soft overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-semibold text-white">Vista previa de imagen principal</p>
            </div>
            <ProductImage
              alt="Vista previa del producto"
              className="h-[360px]"
              fit="contain"
              image={previewUrl || editingProduct?.mainImage || ""}
              imageClassName="p-4"
              name={form.name || "Nuevo diseño"}
              surfaceClassName="bg-slate-100"
            />
          </div>

          <div className="panel-soft overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-semibold text-white">Galería secundaria</p>
              <p className="mt-1 text-xs text-slate-400">
                Usa las flechas para ordenar las miniaturas. Puedes quitar imágenes individuales sin rehacer toda la galería.
              </p>
            </div>

            {galleryItems.length > 0 ? (
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {galleryItems.map((item, index) => (
                  <div key={item.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                    <ProductImage
                      alt={`Vista secundaria ${index + 1}`}
                      className="h-44"
                      fit="contain"
                      image={item.preview}
                      imageClassName="p-3"
                      name={item.name}
                      surfaceClassName="bg-slate-100"
                    />

                    <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">Vista {index + 1}</p>
                        <p className="truncate text-xs text-slate-400">
                          {item.kind === "existing" ? "Imagen guardada" : item.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Mover a la izquierda"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-aqua/30 hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={index === 0}
                          onClick={() => handleMoveGalleryItem(index, -1)}
                          type="button"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Mover a la derecha"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-aqua/30 hover:text-aqua disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={index === galleryItems.length - 1}
                          onClick={() => handleMoveGalleryItem(index, 1)}
                          type="button"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Quitar imagen"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-100 hover:border-red-400/40 hover:bg-red-400/20"
                          onClick={() => handleRemoveGalleryItem(item.id)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-6 text-sm text-slate-400">
                Aún no has cargado imágenes secundarias. El producto se guardará igual, pero el detalle se verá mejor con varias vistas.
              </div>
            )}
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
              {submitting
                ? isEditing
                  ? "Actualizando producto..."
                  : "Guardando producto..."
                : isEditing
                  ? "Guardar cambios"
                  : "Guardar producto en Supabase"}
            </button>

            <button
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua"
              onClick={isEditing ? resetToCreate : loadCreateDraft}
              type="button"
            >
              {isEditing ? "Cancelar edición" : "Restaurar borrador"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
