"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP, formatDate } from "@/lib/format";

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string; // AHORROS | CORRIENTE | VIRTUAL
  accountNumber: string;
  balance: number;
  active: boolean;
}
interface BankTransaction {
  id: string;
  type: string; // INGRESO | EGRESO | TRANSFERENCIA | CONCILIACION
  amount: number;
  description: string;
  status: string;
  transactionDate: string;
  bankAccount: { id: string; bankName: string };
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  AHORROS: "Ahorros",
  CORRIENTE: "Corriente",
  VIRTUAL: "Virtual",
};

const emptyTx = {
  bankAccountId: "",
  type: "INGRESO",
  amount: 0,
  description: "",
};

export default function AdminBancos() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTx);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    const data = await fetch("/api/admin/bancos").then((r) => r.json());
    setAccounts(data.accounts || []);
    setTransactions(data.transactions || []);
    setLoading(false);
  };

  const totalBalance = useMemo(
    () => accounts.reduce((s, a) => s + a.balance, 0),
    [accounts]
  );

  const handleSave = async () => {
    if (!form.bankAccountId || form.amount <= 0) {
      alert("Seleccione una cuenta y un monto válido");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/bancos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      await reload();
      setShowForm(false);
      setForm(emptyTx);
    } else {
      const err = await res.text();
      alert("Error al registrar transacción: " + err);
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
          <h1 className="font-playfair text-3xl text-crema mb-1">Bancos y Tesorería</h1>
          <p className="text-sm text-crema/50">
            Balance total: <span className="text-amarillo font-bebas text-base">{formatCOP(totalBalance)}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setForm(emptyTx);
            setShowForm(true);
          }}
          className="px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold tracking-wider uppercase border-none bg-amarillo text-cafe-oscuro hover:bg-amarillo-oscuro transition-colors font-josefin"
        >
          + Nueva Transacción
        </button>
      </div>

      {/* Bank account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-cafe-oscuro/50 border border-amarillo/10 rounded-xl p-5 hover:border-amarillo/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-playfair text-lg text-crema">{acc.bankName}</div>
                <div className="text-xs text-crema/40 font-bebas tracking-widest mt-0.5">
                  {acc.accountNumber}
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amarillo/10 text-amarillo">
                {ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType}
              </span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-crema/40 font-josefin mb-1">
              Saldo disponible
            </div>
            <div className={`font-bebas text-3xl ${acc.balance >= 0 ? "text-verde-claro" : "text-rojo"}`}>
              {formatCOP(acc.balance)}
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="md:col-span-3 text-center py-10 rounded-xl bg-crema/[0.04] border border-crema/[0.08] text-crema/30">
            No hay cuentas bancarias registradas.
          </div>
        )}
      </div>

      {/* Transactions */}
      <h2 className="font-playfair text-xl text-crema mb-4">Transacciones Recientes</h2>
      <div className="rounded-xl bg-crema/[0.04] border border-crema/[0.08] overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-crema/10">
              {["Fecha", "Cuenta", "Descripción", "Tipo", "Monto", "Estado"].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-normal ${
                    h === "Monto" ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const ingreso = tx.type === "INGRESO";
              return (
                <tr
                  key={tx.id}
                  className="border-b border-crema/[0.05] last:border-0 hover:bg-crema/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 text-sm text-crema/60">{formatDate(tx.transactionDate)}</td>
                  <td className="px-5 py-3 text-sm text-crema/70">{tx.bankAccount.bankName}</td>
                  <td className="px-5 py-3 text-sm text-crema">{tx.description}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ingreso ? "bg-verde-claro/15 text-verde-claro" : "bg-rojo/15 text-rojo"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-bebas text-lg ${
                      ingreso ? "text-verde-claro" : "text-rojo"
                    }`}
                  >
                    {ingreso ? "+" : "−"}
                    {formatCOP(tx.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tx.status === "CONCILIADO"
                          ? "bg-verde-claro/15 text-verde-claro"
                          : tx.status === "RECHAZADO"
                          ? "bg-rojo/15 text-rojo"
                          : "bg-amarillo/15 text-amarillo"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-crema/30 text-sm">
                  No hay transacciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl bg-cafe-oscuro border border-amarillo/20 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-crema/10">
              <h3 className="font-playfair text-xl text-crema">Nueva Transacción</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-crema/40 hover:text-crema cursor-pointer text-xl border-none bg-transparent"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 gap-4">
              <div>
                <label className={labelCn}>Cuenta Bancaria *</label>
                <select
                  value={form.bankAccountId}
                  onChange={(e) => setForm({ ...form, bankAccountId: e.target.value })}
                  className={inputCn}
                >
                  <option value="" className="bg-cafe-oscuro">Seleccionar cuenta...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id} className="bg-cafe-oscuro">
                      {a.bankName} — {a.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCn}>Tipo *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputCn}
                >
                  <option value="INGRESO" className="bg-cafe-oscuro">Ingreso</option>
                  <option value="EGRESO" className="bg-cafe-oscuro">Gasto / Egreso</option>
                </select>
              </div>
              <div>
                <label className={labelCn}>Monto (COP) *</label>
                <input
                  type="number"
                  min={0}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  placeholder="En pesos"
                  className={inputCn}
                />
              </div>
              <div>
                <label className={labelCn}>Descripción</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Concepto de la transacción"
                  className={inputCn}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-crema/10">
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
                {saving ? "Guardando..." : "Registrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
