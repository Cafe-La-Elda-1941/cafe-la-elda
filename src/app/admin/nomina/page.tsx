"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP, formatDate } from "@/lib/format";

interface ThirdParty {
  id: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
}
interface Employee {
  id: string;
  position: string;
  salary: number; // centavos
  eps: string;
  pensionFund: string; // AFP
  arl: string;
  active: boolean;
  startDate: string;
  thirdParty: ThirdParty;
}
interface Payroll {
  id: string;
  period: string;
  payDate: string;
}

const emptyForm = {
  fullName: "",
  documentType: "CC",
  documentNumber: "",
  position: "",
  baseSalary: 0,
  eps: "",
  afp: "",
  arl: "",
};

export default function AdminNomina() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [lastPayroll, setLastPayroll] = useState<Payroll | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [liquidating, setLiquidating] = useState(false);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    const data = await fetch("/api/admin/nomina").then((r) => r.json());
    setEmployees(data.employees || []);
    setLastPayroll(data.lastPayroll || null);
    setLoading(false);
  };

  // Stats
  const stats = useMemo(() => {
    const totalEmpleados = employees.length;
    const activos = employees.filter((e) => e.active).length;
    const costoMes = employees.filter((e) => e.active).reduce((s, e) => s + e.salary, 0);
    // Aportes patronales aprox: salud 8.5% + pensión 12% + ARL 0.522% + caja 4% + ICBF 3% + SENA 2%
    const aportes = Math.round(costoMes * (0.085 + 0.12 + 0.00522 + 0.04 + 0.03 + 0.02));
    return { totalEmpleados, activos, costoMes, aportes };
  }, [employees]);

  const proximaLiquidacion = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }, []);

  const handleSave = async () => {
    if (!form.fullName || !form.documentNumber || !form.position) {
      alert("Nombre, documento y cargo son obligatorios");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/nomina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, baseSalary: Number(form.baseSalary) }),
    });
    setSaving(false);
    if (res.ok) {
      await reload();
      setShowForm(false);
      setForm(emptyForm);
    } else {
      const err = await res.text();
      alert("Error al crear empleado: " + err);
    }
  };

  const handleLiquidar = async () => {
    const now = new Date();
    const periodo = `${now.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}`;
    if (!confirm(`¿Liquidar la nómina de ${periodo}? Se generarán los desprendibles para todos los empleados activos.`))
      return;
    setLiquidating(true);
    const res = await fetch("/api/admin/nomina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "LIQUIDAR" }),
    });
    setLiquidating(false);
    if (res.ok) {
      const data = await res.json();
      await reload();
      alert(`Nómina liquidada: ${data.liquidados} empleado(s). Neto a pagar: ${formatCOP(data.totalNetPay)}`);
    } else {
      const err = await res.json();
      alert("Error al liquidar: " + (err.error || "desconocido"));
    }
  };

  const inputCn =
    "w-full bg-crema/[0.06] border border-crema/15 text-crema py-2.5 px-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo transition-colors placeholder:text-crema/25";
  const labelCn = "block text-[11px] uppercase tracking-wider text-crema/50 mb-1.5";

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-crema/30">Cargando...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-crema mb-1">Nómina Electrónica</h1>
          <p className="text-sm text-crema/50">Gestión de empleados y liquidación</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleLiquidar}
            disabled={liquidating || stats.activos === 0}
            className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro transition-colors font-josefin disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {liquidating ? "Liquidando..." : "Liquidar Nómina"}
          </button>
          <button
            onClick={() => {
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-verde text-crema hover:bg-verde-claro transition-colors font-josefin"
          >
            + Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Empleados" value={String(stats.totalEmpleados)} sub={`${stats.activos} activos`} icon="👥" />
        <StatCard label="Costo Nómina Mes" value={formatCOP(stats.costoMes)} icon="💰" mono />
        <StatCard label="Aportes Patronales" value={formatCOP(stats.aportes)} icon="🏛️" mono />
        <StatCard label="Próxima Liquidación" value={formatDate(proximaLiquidacion)} icon="📅" />
      </div>

      {/* Employee table */}
      <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-crema/10">
              {["Nombre", "Documento", "Cargo", "Salario Base", "EPS", "AFP", "Estado"].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-normal ${
                    h === "Salario Base" ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="border-b border-crema/[0.05] last:border-0 hover:bg-crema/[0.02] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-crema">{emp.thirdParty.fullName}</div>
                </td>
                <td className="px-5 py-3 text-sm text-crema/70">
                  <span className="font-bebas tracking-wider">{emp.thirdParty.documentNumber}</span>
                </td>
                <td className="px-5 py-3 text-sm text-crema/70">{emp.position}</td>
                <td className="px-5 py-3 text-right font-bebas text-lg text-amarillo">
                  {formatCOP(emp.salary)}
                </td>
                <td className="px-5 py-3 text-sm text-crema/60">{emp.eps || "—"}</td>
                <td className="px-5 py-3 text-sm text-crema/60">{emp.pensionFund || "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      emp.active ? "bg-verde-claro/15 text-verde-claro" : "bg-rojo/15 text-rojo"
                    }`}
                  >
                    {emp.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-crema/30 text-sm">
                  No hay empleados registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {lastPayroll && (
        <div className="mt-6 text-xs text-crema/40 font-josefin">
          Última liquidación registrada: período <span className="text-amarillo">{lastPayroll.period}</span> · pago {formatDate(lastPayroll.payDate)}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl bg-cafe-oscuro border border-amarillo/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-crema/10 sticky top-0 bg-cafe-oscuro z-10">
              <h3 className="font-playfair text-xl text-crema">Nuevo Empleado</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-crema/40 hover:text-crema cursor-pointer text-xl border-none bg-transparent"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCn}>Nombre Completo *</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nombre y apellidos"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>Tipo de Documento *</label>
                <select
                  value={form.documentType}
                  onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                  className={inputCn}
                >
                  <option value="CC" className="bg-cafe-oscuro">Cédula de Ciudadanía</option>
                  <option value="CE" className="bg-cafe-oscuro">Cédula de Extranjería</option>
                  <option value="PA" className="bg-cafe-oscuro">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className={labelCn}>Número de Documento *</label>
                <input
                  value={form.documentNumber}
                  onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                  placeholder="Ej: 1037621456"
                  className={inputCn}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCn}>Cargo *</label>
                <input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Ej: Barista, Vendedor, Administrativo"
                  className={inputCn}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCn}>Salario Base (COP) *</label>
                <input
                  type="number"
                  min={0}
                  value={form.baseSalary}
                  onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })}
                  placeholder="En pesos mensuales"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>EPS</label>
                <input
                  value={form.eps}
                  onChange={(e) => setForm({ ...form, eps: e.target.value })}
                  placeholder="Entidad de salud"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>AFP (Pensiones)</label>
                <input
                  value={form.afp}
                  onChange={(e) => setForm({ ...form, afp: e.target.value })}
                  placeholder="Fondo de pensiones"
                  className={inputCn}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCn}>ARL</label>
                <input
                  value={form.arl}
                  onChange={(e) => setForm({ ...form, arl: e.target.value })}
                  placeholder="Administradora de riesgos laborales"
                  className={inputCn}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-crema/10 sticky bottom-0 bg-cafe-oscuro">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg cursor-pointer text-sm font-josefin text-crema/60 bg-crema/[0.06] hover:bg-crema/15 transition-colors border-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase bg-verde text-crema hover:bg-verde-claro transition-colors border-none font-josefin disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Crear Empleado"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-cafe-oscuro/50 border border-amarillo/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-crema/40 font-josefin">{label}</span>
        <span className="text-lg opacity-60">{icon}</span>
      </div>
      <div className={`${mono ? "font-bebas" : "font-playfair"} text-2xl text-crema`}>{value}</div>
      {sub && <div className="text-[11px] text-crema/40 mt-1 font-josefin">{sub}</div>}
    </div>
  );
}
