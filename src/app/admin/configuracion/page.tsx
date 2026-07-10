"use client";

import { useEffect, useState } from "react";

interface CompanySettings {
  id?: string;
  legalName: string;
  documentType: string;
  documentNumber: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  taxRegime: string;
  dianEnvironment: string;
  resolutionNumber: string | null;
  resolutionDate: string | null;
  resolutionPrefix: string | null;
  resolutionRangeStart: number | string | null;
  resolutionRangeEnd: number | string | null;
  matiasApiBaseUrl: string;
  matiasApiToken: string | null;
}
interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  isCash: boolean;
  isPaymentMethod: boolean;
  balance: number;
}

const defaultSettings: CompanySettings = {
  legalName: "",
  documentType: "CC",
  documentNumber: "",
  address: "",
  city: "Dosquebradas",
  department: "Risaralda",
  phone: "",
  email: "",
  taxRegime: "NO_RESPONSABLE",
  dianEnvironment: "PRODUCCION",
  resolutionNumber: "",
  resolutionDate: "",
  resolutionPrefix: "",
  resolutionRangeStart: null,
  resolutionRangeEnd: "",
  matiasApiBaseUrl: "https://matias-api.com/api/v1",
  matiasApiToken: "",
};

export default function AdminConfiguracion() {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    const data = await fetch("/api/admin/configuracion").then((r) => r.json());
    if (data.settings) {
      const s = data.settings;
      setSettings({
        ...defaultSettings,
        ...s,
        resolutionDate: s.resolutionDate ? s.resolutionDate.split("T")[0] : "",
        matiasApiToken: s.matiasApiToken || "",
        resolutionNumber: s.resolutionNumber || "",
        resolutionPrefix: s.resolutionPrefix || "",
        resolutionRangeEnd: s.resolutionRangeEnd ?? "",
      });
    }
    setAccounts(data.accounts || []);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const err = await res.text();
      alert("Error al guardar: " + err);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${settings.matiasApiBaseUrl}/health`, {
        headers: settings.matiasApiToken
          ? { Authorization: `Bearer ${settings.matiasApiToken}` }
          : {},
      });
      setTestResult(res.ok ? "success" : "fail");
    } catch {
      setTestResult("error");
    }
    setTesting(false);
  };

  const set = (field: keyof CompanySettings, value: any) =>
    setSettings((prev) => ({ ...prev, [field]: value }));

  const inputCn =
    "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";
  const labelCn = "block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5";
  const sectionCn =
    "bg-cafe-oscuro/50 border border-amarillo/10 rounded-xl p-6";
  const sectionTitleCn = "font-playfair text-xl text-crema mb-1";

  // Key mapped accounts for section D
  const mappedAccounts = [
    { label: "Caja / Efectivo", match: (a: Account) => a.code === "110505" },
    { label: "Bancos", match: (a: Account) => a.code.startsWith("1110") && a.code.length > 4 },
    { label: "Clientes (Cx Cobrar)", match: (a: Account) => a.code === "130505" },
    { label: "Inventario", match: (a: Account) => a.code === "143505" },
    { label: "Proveedores (Cx Pagar)", match: (a: Account) => a.code === "220505" },
    { label: "Salarios por Pagar", match: (a: Account) => a.code === "250505" },
    { label: "Ingresos por Ventas", match: (a: Account) => a.code === "413505" },
    { label: "Costo de Ventas", match: (a: Account) => a.code === "613505" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-crema/30">Cargando...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-crema mb-1">Configuración del Sistema</h1>
          <p className="text-sm text-crema/50">Parámetros de empresa, DIAN y contabilidad</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-verde-claro bg-verde-claro/15 px-3 py-1.5 rounded-full">
              ✓ Guardado
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro transition-colors font-josefin disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* A) DATOS DE LA EMPRESA */}
        <div className={sectionCn}>
          <h2 className={sectionTitleCn}>Datos de la Empresa</h2>
          <p className="text-xs text-crema/40 mb-5 font-josefin">Información legal y de contacto</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCn}>Razón Social / Nombre Legal *</label>
              <input
                value={settings.legalName}
                onChange={(e) => set("legalName", e.target.value)}
                placeholder="Ej: Café La Elda 1941"
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Tipo de Documento</label>
              <select
                value={settings.documentType}
                onChange={(e) => set("documentType", e.target.value)}
                className={inputCn}
              >
                <option value="CC" className="bg-cafe-oscuro">Cédula de Ciudadanía</option>
                <option value="NIT" className="bg-cafe-oscuro">NIT</option>
                <option value="CE" className="bg-cafe-oscuro">Cédula de Extranjería</option>
              </select>
            </div>
            <div>
              <label className={labelCn}>Número de Documento</label>
              <input
                value={settings.documentNumber}
                onChange={(e) => set("documentNumber", e.target.value)}
                placeholder="Ej: 24694411"
                className={inputCn}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCn}>Dirección</label>
              <input
                value={settings.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Dirección fiscal"
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Ciudad</label>
              <input
                value={settings.city}
                onChange={(e) => set("city", e.target.value)}
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Departamento</label>
              <input
                value={settings.department}
                onChange={(e) => set("department", e.target.value)}
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Teléfono</label>
              <input
                value={settings.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="Ej: 313 456 7890"
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Email</label>
              <input
                value={settings.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="correo@empresa.com"
                className={inputCn}
              />
            </div>
          </div>
        </div>

        {/* B) CONFIGURACIÓN DIAN */}
        <div className={sectionCn}>
          <h2 className={sectionTitleCn}>Configuración DIAN</h2>
          <p className="text-xs text-crema/40 mb-5 font-josefin">Régimen tributario y resolución de facturación</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCn}>Régimen Tributario</label>
              <select
                value={settings.taxRegime}
                onChange={(e) => set("taxRegime", e.target.value)}
                className={inputCn}
              >
                <option value="NO_RESPONSABLE" className="bg-cafe-oscuro">No Responsable de IVA</option>
                <option value="RESPONSABLE_IVA" className="bg-cafe-oscuro">Responsable de IVA</option>
                <option value="SIMPLE" className="bg-cafe-oscuro">Régimen Simple</option>
              </select>
            </div>
            <div>
              <label className={labelCn}>Entorno DIAN</label>
              <select
                value={settings.dianEnvironment}
                onChange={(e) => set("dianEnvironment", e.target.value)}
                className={inputCn}
              >
                <option value="PRUEBAS" className="bg-cafe-oscuro">Pruebas</option>
                <option value="PRODUCCION" className="bg-cafe-oscuro">Producción</option>
              </select>
            </div>
            <div>
              <label className={labelCn}>Número de Resolución</label>
              <input
                value={settings.resolutionNumber || ""}
                onChange={(e) => set("resolutionNumber", e.target.value)}
                placeholder="Ej: 18764000000000"
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Fecha de Resolución</label>
              <input
                type="date"
                value={settings.resolutionDate || ""}
                onChange={(e) => set("resolutionDate", e.target.value)}
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Prefijo</label>
              <input
                value={settings.resolutionPrefix || ""}
                onChange={(e) => set("resolutionPrefix", e.target.value)}
                placeholder="Ej: FE"
                className={inputCn}
              />
            </div>
            <div>
              <label className={labelCn}>Rango Inicial</label>
              <input
                type="number"
                value={settings.resolutionRangeStart ?? ""}
                onChange={(e) => set("resolutionRangeStart", e.target.value ? Number(e.target.value) : null)}
                placeholder="Ej: 1"
                className={inputCn}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCn}>Rango Final</label>
              <input
                type="number"
                value={settings.resolutionRangeEnd ?? ""}
                onChange={(e) => set("resolutionRangeEnd", e.target.value ? Number(e.target.value) : null)}
                placeholder="Ej: 5000"
                className={inputCn}
              />
            </div>
          </div>
        </div>

        {/* C) MATIAS API */}
        <div className={sectionCn}>
          <h2 className={sectionTitleCn}>MATIAS API</h2>
          <p className="text-xs text-crema/40 mb-5 font-josefin">Proveedor tecnológico DIAN para facturación y nómina electrónica</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCn}>URL Base</label>
              <input
                value={settings.matiasApiBaseUrl}
                onChange={(e) => set("matiasApiBaseUrl", e.target.value)}
                placeholder="https://matias-api.com/api/v1"
                className={inputCn}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCn}>Token API</label>
              <input
                type="password"
                value={settings.matiasApiToken || ""}
                onChange={(e) => set("matiasApiToken", e.target.value)}
                placeholder="Token de acceso MATIAS"
                className={inputCn}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-2 rounded-lg cursor-pointer text-sm font-josefin bg-crema/[0.08] text-crema hover:bg-crema/15 transition-colors border border-crema/15 disabled:opacity-50"
            >
              {testing ? "Probando..." : "Probar Conexión"}
            </button>
            {testResult === "success" && (
              <span className="text-xs text-verde-claro">✓ Conexión exitosa</span>
            )}
            {testResult === "fail" && (
              <span className="text-xs text-amarillo">⚠ El servidor respondió con error</span>
            )}
            {testResult === "error" && (
              <span className="text-xs text-rojo">✕ No se pudo conectar</span>
            )}
          </div>
        </div>

        {/* D) CUENTAS CONTABLES */}
        <div className={sectionCn}>
          <h2 className={sectionTitleCn}>Cuentas Contables</h2>
          <p className="text-xs text-crema/40 mb-5 font-josefin">Cuentas PUC mapeadas por defecto</p>
          <div className="flex flex-col gap-1">
            {mappedAccounts.map(({ label, match }) => {
              const acc = accounts.find(match);
              return (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-crema/[0.03] border border-crema/[0.06]"
                >
                  <span className="text-sm text-crema/80 font-josefin">{label}</span>
                  {acc ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bebas text-amarillo tracking-wider text-sm">{acc.code}</span>
                      <span className="text-xs text-crema/40 hidden sm:inline">{acc.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-crema/30">No mapeada</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-[11px] text-crema/30 font-josefin">
            {accounts.length} cuentas activas en el plan de cuentas (PUC).
          </div>
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-verde text-crema hover:bg-verde-claro transition-colors font-josefin disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </div>
  );
}
