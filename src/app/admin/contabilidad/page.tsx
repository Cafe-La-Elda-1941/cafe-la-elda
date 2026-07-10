"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCOP } from "@/lib/format";

// ============================================================
// TIPOS
// ============================================================

interface AccountFlat {
  id: string;
  code: string;
  name: string;
  type: string;
  class: number;
  group: number;
  subaccount: number;
  nature: string;
  niifMapping: string | null;
  parentId: string | null;
  parent: { code: string; name: string } | null;
  isCash: boolean;
  isPaymentMethod: boolean;
  active: boolean;
  balance: number;
  aggregatedBalance: number;
  isLeaf: boolean;
  level: number;
  children?: AccountFlat[];
}

interface AccountsResponse {
  total: number;
  summary: Record<string, { count: number; balance: number }>;
  flat: AccountFlat[];
  tree: AccountFlat[];
}

// ============================================================
// CONFIG VISUAL POR TIPO
// ============================================================

const TYPE_CONFIG: Record<
  string,
  { label: string; short: string; color: string; dot: string; badge: string }
> = {
  ACTIVO: {
    label: "Activo",
    short: "Activo",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  },
  PASIVO: {
    label: "Pasivo",
    short: "Pasivo",
    color: "text-red-400",
    dot: "bg-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/25",
  },
  PATRIMONIO: {
    label: "Patrimonio",
    short: "Patrim.",
    color: "text-sky-400",
    dot: "bg-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/25",
  },
  INGRESO: {
    label: "Ingreso",
    short: "Ingreso",
    color: "text-amarillo",
    dot: "bg-amarillo",
    badge: "bg-amarillo/15 text-amarillo border-amarillo/25",
  },
  GASTO: {
    label: "Gasto",
    short: "Gasto",
    color: "text-orange-400",
    dot: "bg-orange-400",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  },
  COSTO: {
    label: "Costo",
    short: "Costo",
    color: "text-rose-400",
    dot: "bg-rose-400",
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  },
};

const NATURE_BADGE: Record<string, string> = {
  DEBITO: "bg-emerald-500/10 text-emerald-300/80",
  CREDITO: "bg-red-500/10 text-red-300/80",
};

const FILTER_TABS: Array<{ key: string; label: string }> = [
  { key: "TODOS", label: "Todos" },
  { key: "ACTIVO", label: "Activo" },
  { key: "PASIVO", label: "Pasivo" },
  { key: "PATRIMONIO", label: "Patrimonio" },
  { key: "INGRESO", label: "Ingresos" },
  { key: "GASTO", label: "Gastos" },
  { key: "COSTO", label: "Costos" },
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AdminContabilidadPUC() {
  const [data, setData] = useState<AccountsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState("TODOS");
  const [search, setSearch] = useState("");
  const [onlyLeaf, setOnlyLeaf] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/admin/contabilidad/accounts")
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar cuentas");
        return r.json();
      })
      .then((d: AccountsResponse) => {
        if (!active) return;
        setData(d);
        // Expandir por defecto las clases de nivel 0
        setExpanded(new Set(d.tree.map((t) => t.id)));
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtrado en cliente sobre el arreglo plano
  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.flat.filter((a) => {
      if (activeType !== "TODOS" && a.type !== activeType) return false;
      if (onlyLeaf && !a.isLeaf) return false;
      if (q) {
        const hay =
          a.code.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          (a.niifMapping || "").toLowerCase().includes(q);
        if (!hay) return false;
      }
      return true;
    });
  }, [data, activeType, search, onlyLeaf]);

  // Cuando hay búsqueda, mostramos flat filtrado. Si no, mostramos árbol.
  const showingTree = search.trim() === "" && !onlyLeaf;

  const counts = useMemo(() => {
    if (!data) return { TODOS: 0 } as Record<string, number>;
    const c: Record<string, number> = { TODOS: data.flat.length };
    for (const a of data.flat) {
      c[a.type] = (c[a.type] || 0) + 1;
    }
    return c;
  }, [data]);

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-10 h-10 border-2 border-amarillo/30 border-t-amarillo rounded-full animate-spin" />
        <p className="text-crema/40 font-josefin text-sm">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-rojo font-josefin">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-lg bg-amarillo text-cafe-oscuro font-josefin text-sm cursor-pointer border-none"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amarillo/60 text-xs font-josefin uppercase tracking-[0.2em] mb-2">
            <span>Contabilidad</span>
            <span className="text-crema/20">/</span>
            <span className="text-crema/40">Catálogo</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl text-crema mb-1">
            Plan Único de Cuentas
          </h1>
          <p className="text-sm text-crema/50 font-josefin">
            {data?.total ?? 0} cuentas registradas &middot; Decreto 2650 de 1993
          </p>
        </div>

        {/* Tarjetas resumen rápido */}
        <div className="flex flex-wrap gap-2">
          {(["ACTIVO", "PASIVO", "PATRIMONIO"] as const).map((t) => {
            const cfg = TYPE_CONFIG[t];
            const sum = data?.summary?.[t]?.balance ?? 0;
            return (
              <div
                key={t}
                className="px-4 py-2.5 rounded-xl bg-crema/[0.04] border border-crema/[0.08] min-w-[140px]"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[10px] uppercase tracking-wider text-crema/50 font-josefin">
                    {cfg.label}
                  </span>
                </div>
                <div className={`font-bebas text-lg ${cfg.color}`}>
                  {formatCOP(sum)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTROS POR TIPO */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTER_TABS.map((tab) => {
          const isActive = activeType === tab.key;
          const count = counts[tab.key] ?? 0;
          const cfg = tab.key !== "TODOS" ? TYPE_CONFIG[tab.key] : null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-josefin border transition-all cursor-pointer ${
                isActive
                  ? "bg-amarillo text-cafe-oscuro border-amarillo font-semibold"
                  : "bg-crema/[0.03] text-crema/60 border-crema/[0.08] hover:bg-crema/[0.07] hover:text-crema"
              }`}
            >
              {cfg && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-cafe-oscuro" : cfg.dot}`}
                />
              )}
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-cafe-oscuro/20 text-cafe-oscuro" : "bg-crema/[0.06] text-crema/40"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* BARRA DE BÚSQUEDA Y CONTROLES */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-crema/30 text-sm">
            ⌕
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, nombre o mapeo NIIF..."
            className="w-full bg-crema/[0.04] border border-crema/10 text-crema py-2.5 pl-9 pr-3 font-josefin text-sm rounded-lg outline-none focus:border-amarillo/60 transition-colors placeholder:text-crema/25"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-crema/60 font-josefin cursor-pointer select-none px-3 py-2 rounded-lg bg-crema/[0.03] border border-crema/[0.08]">
          <input
            type="checkbox"
            checked={onlyLeaf}
            onChange={(e) => setOnlyLeaf(e.target.checked)}
            className="accent-amarillo"
          />
          Solo cuentas movimiento
        </label>
      </div>

      {/* TABLA / ÁRBOL */}
      <div className="rounded-xl bg-crema/[0.025] border border-crema/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b border-crema/10 bg-crema/[0.02]">
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                  Código / Cuenta
                </th>
                <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                  Tipo
                </th>
                <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                  Naturaleza
                </th>
                <th className="text-left px-3 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal hidden lg:table-cell">
                  NIIF
                </th>
                <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-crema/40 font-josefin font-normal">
                  Saldo Actual
                </th>
              </tr>
            </thead>
            <tbody>
              {showingTree
                ? renderTreeRows(
                    data!.tree.filter(
                      (n) => activeType === "TODOS" || n.type === activeType
                    ),
                    expanded,
                    toggleExpand,
                    0
                  )
                : renderFlatRows(filtered)}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && !showingTree && (
          <div className="py-16 text-center">
            <p className="text-crema/30 font-josefin text-sm">
              No se encontraron cuentas con los filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* LEYENDA */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-josefin text-crema/40">
        <span className="uppercase tracking-wider">Leyenda:</span>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        ))}
        <span className="ml-auto text-crema/30">
          Valores en pesos colombianos (COP)
        </span>
      </div>
    </div>
  );
}

// ============================================================
// RENDER DE FILAS (ÁRBOL JERÁRQUICO)
// ============================================================

function renderTreeRows(
  nodes: AccountFlat[],
  expanded: Set<string>,
  toggleExpand: (id: string) => void,
  depth: number
): React.ReactNode {
  const rows: React.ReactNode[] = [];
  for (const node of nodes) {
    rows.push(
      <TreeRow
        key={node.id}
        node={node}
        depth={depth}
        expanded={expanded}
        toggleExpand={toggleExpand}
      />
    );
    if (expanded.has(node.id) && node.children && node.children.length > 0) {
      rows.push(
        renderTreeRows(node.children, expanded, toggleExpand, depth + 1)
      );
    }
  }
  return rows;
}

function TreeRow({
  node,
  depth,
  expanded,
  toggleExpand,
}: {
  node: AccountFlat;
  depth: number;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[node.type] || TYPE_CONFIG.ACTIVO;
  const hasChildren = !!node.children && node.children.length > 0;
  const isOpen = expanded.has(node.id);
  const isParent = !node.isLeaf; // clase / grupo / subcuenta
  const displayBalance = isParent ? node.aggregatedBalance : node.balance;

  return (
    <tr className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors group">
      <td className="px-5 py-2.5">
        <div
          className="flex items-center gap-2"
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="w-5 h-5 flex items-center justify-center text-crema/40 hover:text-amarillo text-xs cursor-pointer border-none bg-transparent"
              aria-label={isOpen ? "Contraer" : "Expandir"}
            >
              {isOpen ? "▾" : "▸"}
            </button>
          ) : (
            <span className="w-5 inline-block" />
          )}
          <span
            className={`font-bebas tracking-wider ${
              isParent ? "text-amarillo/80 text-base" : "text-crema/50 text-sm"
            }`}
          >
            {node.code}
          </span>
          <span
            className={`font-josefin ${
              isParent
                ? "text-crema font-semibold"
                : "text-crema/70"
            } ${depth === 0 ? "uppercase tracking-wide" : ""}`}
          >
            {node.name}
          </span>
          {node.isCash && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amarillo/15 text-amarillo uppercase tracking-wider">
              Efectivo
            </span>
          )}
          {node.isPaymentMethod && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-verde-claro/15 text-verde-claro uppercase tracking-wider">
              Pago
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.short}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider ${NATURE_BADGE[node.nature]}`}
        >
          {node.nature}
        </span>
      </td>
      <td className="px-3 py-2.5 hidden lg:table-cell">
        {node.niifMapping ? (
          <span className="text-xs text-crema/40 italic">{node.niifMapping}</span>
        ) : (
          <span className="text-crema/15">—</span>
        )}
      </td>
      <td className="px-5 py-2.5 text-right">
        <span
          className={`font-bebas text-base tabular-nums ${
            isParent ? "text-amarillo" : displayBalance === 0 ? "text-crema/30" : "text-crema/80"
          }`}
        >
          {formatCOP(displayBalance)}
        </span>
      </td>
    </tr>
  );
}

// ============================================================
// RENDER DE FILAS (LISTA PLANA - cuando hay búsqueda o filtro)
// ============================================================

function renderFlatRows(rows: AccountFlat[]): React.ReactNode {
  return rows.map((node) => {
    const cfg = TYPE_CONFIG[node.type] || TYPE_CONFIG.ACTIVO;
    const displayBalance = node.isLeaf ? node.balance : node.aggregatedBalance;
    return (
      <tr
        key={node.id}
        className="border-b border-crema/[0.04] last:border-0 hover:bg-crema/[0.02] transition-colors"
      >
        <td className="px-5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bebas tracking-wider text-amarillo/80 text-sm">
              {node.code}
            </span>
            <span className="font-josefin text-crema/80 text-sm">{node.name}</span>
            {node.isCash && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amarillo/15 text-amarillo uppercase tracking-wider">
                Efectivo
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-2.5">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.short}
          </span>
        </td>
        <td className="px-3 py-2.5">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider ${NATURE_BADGE[node.nature]}`}
          >
            {node.nature}
          </span>
        </td>
        <td className="px-3 py-2.5 hidden lg:table-cell">
          {node.niifMapping ? (
            <span className="text-xs text-crema/40 italic">{node.niifMapping}</span>
          ) : (
            <span className="text-crema/15">—</span>
          )}
        </td>
        <td className="px-5 py-2.5 text-right">
          <span
            className={`font-bebas text-base tabular-nums ${
              displayBalance === 0 ? "text-crema/30" : "text-crema/80"
            }`}
          >
            {formatCOP(displayBalance)}
          </span>
        </td>
      </tr>
    );
  });
}
