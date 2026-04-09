import { createClient } from "@supabase/supabase-js";
import { analyzeSeverity } from "../utils/triage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const LOCAL_PATIENTS_STORAGE_KEY = "emergency-triage-patients";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const dataMode = isSupabaseConfigured ? "supabase" : "local";

console.log("[supabase] Environment check", {
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
  url: supabaseUrl || "missing",
});

let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log("[supabase] Client initialized successfully");
  } catch (error) {
    console.error("[supabase] Failed to initialize client", error);
  }
} else {
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Create a .env file and restart Vite.",
  );
}

export const supabase = supabaseClient;

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readLocalPatients() {
  const storage = getLocalStorage();

  if (!storage) {
    return [];
  }

  try {
    const rawValue = storage.getItem(LOCAL_PATIENTS_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    console.error("[storage] Failed to read local patient records", error);
    return [];
  }
}

function writeLocalPatients(patients) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(LOCAL_PATIENTS_STORAGE_KEY, JSON.stringify(patients));
}

function createLocalPatientRecord(payload) {
  const patient = {
    ...payload,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `local-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };

  const patients = readLocalPatients();
  patients.unshift(patient);
  writeLocalPatients(patients);

  console.log("[storage] Saved patient locally", { id: patient.id });
  return patient;
}

function convertFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected image."));

    reader.readAsDataURL(file);
  });
}

export async function uploadPatientImage(file) {
  if (!file) {
    console.log("[supabase] No image selected, skipping upload");
    return null;
  }

  if (!supabase) {
    console.log("[storage] Supabase unavailable, storing image in browser only");
    return convertFileToDataUrl(file);
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `${Date.now()}-${safeName}`;

  console.log("[supabase] Uploading patient image", {
    fileName: file.name,
    filePath,
    size: file.size,
  });

  const { error } = await supabase.storage
    .from("patient-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("[supabase] Image upload failed", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("patient-images").getPublicUrl(filePath);

  console.log("[supabase] Image upload succeeded", { publicUrl });
  return publicUrl;
}

export async function createPatientRecord(payload) {
  if (!supabase) {
    return createLocalPatientRecord(payload);
  }

  console.log("[supabase] Inserting patient record", payload);

  const { data, error } = await supabase
    .from("patients")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[supabase] Insert failed", error);
    throw new Error(`Unable to save patient record: ${error.message}`);
  }

  console.log("[supabase] Insert succeeded", data);
  return data;
}

export async function createSimulatedCriticalPatient() {
  const symptoms = "Severe chest pain, sweating, and difficulty breathing before arrival.";
  const analysis = analyzeSeverity(symptoms);

  return createPatientRecord({
    symptoms,
    priority: analysis.priority,
    summary: analysis.summary,
    image_url: null,
  });
}

export async function getPatients() {
  if (!supabase) {
    console.log("[storage] Loading patient queue from browser storage");
    return readLocalPatients();
  }

  console.log("[supabase] Fetching patient queue");

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] Fetch failed", error);
    throw new Error(`Unable to fetch patients: ${error.message}`);
  }

  console.log("[supabase] Fetch succeeded", { count: data?.length ?? 0 });
  return data ?? [];
}

export function subscribeToPatients(onChange) {
  if (!supabase) {
    return () => {};
  }

  const channel = supabase
    .channel(`patients-feed-${Date.now()}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "patients" },
      (payload) => {
        console.log("[supabase] Realtime patient event received", payload.eventType);
        onChange?.(payload);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
