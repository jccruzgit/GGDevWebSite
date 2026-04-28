import {
  getSupabaseClient,
  getSupabasePublicUrl,
  hasSupabaseConfig,
  supabaseRequestUploadsBucket,
  supabaseRequestsTable,
} from "@/lib/supabase";

export const requestTypeLabels = {
  advisory: "Asesoria",
  customizer: "Personalizacion",
  "product-help": "Ayuda con producto",
  "product-order": "Pedido de producto",
};

export const requestStatusLabels = {
  approved: "Aprobada",
  closed: "Cerrada",
  new: "Nueva",
  reviewing: "En revision",
};

export const requestStatusOptions = Object.entries(requestStatusLabels).map(
  ([value, label]) => ({
    label,
    value,
  })
);

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeMetadata(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sanitizePathSegment(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/^-+|-+$/g, "") || "archivo";
}

function normalizeRequestStatus(value) {
  return requestStatusLabels[value] ? value : "new";
}

function buildRequestTitle(record) {
  if (record.product_name) {
    return record.product_name;
  }

  if (record.subject) {
    return record.subject;
  }

  return requestTypeLabels[record.request_type] || "Solicitud";
}

function normalizeRequest(record) {
  return {
    createdAt: record.created_at || "",
    customerName: record.customer_name || "",
    customerPhone: record.customer_phone || "",
    designFileName: record.design_file_name || "",
    designFilePath: record.design_file_path || "",
    designFileUrl: getSupabasePublicUrl(
      record.design_file_path,
      supabaseRequestUploadsBucket
    ),
    garmentColor: record.garment_color || "",
    id: record.id,
    metadata: normalizeMetadata(record.metadata),
    notes: record.notes || "",
    placement: record.placement || "",
    previewOffsetX: normalizeNumber(record.preview_offset_x),
    previewOffsetY: normalizeNumber(record.preview_offset_y),
    previewScale: normalizeNumber(record.preview_scale),
    productName: record.product_name || "",
    productSlug: record.product_slug || "",
    quantity: normalizeInteger(record.quantity),
    requestType: record.request_type,
    requestTypeLabel: requestTypeLabels[record.request_type] || "Solicitud",
    size: record.size || "",
    status: normalizeRequestStatus(record.status),
    statusLabel: requestStatusLabels[normalizeRequestStatus(record.status)],
    subject: record.subject || "",
    title: buildRequestTitle(record),
    updatedAt: record.updated_at || "",
  };
}

async function uploadRequestDesignFile({ file, requestId, requestType }) {
  if (!file) {
    return "";
  }

  const client = getSupabaseClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const baseName = sanitizePathSegment(file.name.replace(/\.[^.]+$/, ""));
  const path = `${requestType}/${requestId}-${baseName}.${extension}`;
  const { error } = await client.storage.from(supabaseRequestUploadsBucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

function buildRequestPayload({ designFilePath = "", request, requestId }) {
  return {
    customer_name: normalizeText(request.customerName) || null,
    customer_phone: normalizeText(request.customerPhone) || null,
    design_file_name: normalizeText(request.designFileName) || null,
    design_file_path: designFilePath || null,
    garment_color: normalizeText(request.garmentColor) || null,
    id: requestId,
    metadata: normalizeMetadata(request.metadata),
    notes: normalizeText(request.notes) || null,
    placement: normalizeText(request.placement) || null,
    preview_offset_x: normalizeNumber(request.previewOffsetX),
    preview_offset_y: normalizeNumber(request.previewOffsetY),
    preview_scale: normalizeNumber(request.previewScale),
    product_name: normalizeText(request.productName) || null,
    product_slug: normalizeText(request.productSlug) || null,
    quantity: normalizeInteger(request.quantity),
    request_type: request.requestType,
    size: normalizeText(request.size) || null,
    status: "new",
    subject: normalizeText(request.subject) || null,
  };
}

export async function createPublicRequest({ designFile = null, request }) {
  if (!hasSupabaseConfig) {
    return null;
  }

  if (!requestTypeLabels[request?.requestType]) {
    throw new Error("El tipo de solicitud no es valido.");
  }

  const client = getSupabaseClient();
  const requestId = crypto.randomUUID();
  const designFilePath = await uploadRequestDesignFile({
    file: designFile,
    requestId,
    requestType: request.requestType,
  });
  const payload = buildRequestPayload({
    designFilePath,
    request,
    requestId,
  });
  const { data, error } = await client
    .from(supabaseRequestsTable)
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeRequest(data);
}

export async function fetchAdminRequests() {
  if (!hasSupabaseConfig) {
    return [];
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(supabaseRequestsTable)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeRequest);
}

export async function patchAdminRequestStatus(requestId, status) {
  if (!hasSupabaseConfig) {
    throw new Error("Falta configurar Supabase en las variables de entorno.");
  }

  if (!requestStatusLabels[status]) {
    throw new Error("El estado solicitado no es valido.");
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(supabaseRequestsTable)
    .update({ status })
    .eq("id", requestId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeRequest(data);
}
