/**
 * Plan Único de Cuentas (PUC) para Café La Elda 1941
 * Decreto 2650 de 1993 - Colombia
 *
 * Estructura: Clase(1) → Grupo(2) → Cuenta(4) → Subcuenta(6)
 *
 * Adaptado para:
 * - Persona Natural
 * - No responsable de IVA
 * - Comercio de café y derivados + producción artesanal
 */

export interface PUCNode {
  code: string;
  name: string;
  type: string;       // ACTIVO, PASIVO, PATRIMONIO, INGRESO, GASTO, COSTO
  class: number;      // 1-7
  group: number;      // primeros 2 dígitos
  subaccount: number; // primeros 4 dígitos
  nature: string;     // DEBITO o CREDITO
  isCash?: boolean;
  isPaymentMethod?: boolean;
  niifMapping?: string;
  parentCode?: string; // código del padre en la jerarquía
}

export const PUC_ACCOUNTS: PUCNode[] = [
  // ================================================================
  // CLASE 1 - ACTIVO (Naturaleza: DÉBITO)
  // ================================================================

  // --- Disponible ---
  { code: "1105", name: "Caja", type: "ACTIVO", class: 1, group: 11, subaccount: 1105, nature: "DEBITO", parentCode: "11" },
  { code: "110505", name: "Caja General", type: "ACTIVO", class: 1, group: 11, subaccount: 1105, nature: "DEBITO", isCash: true, isPaymentMethod: true, niifMapping: "Efectivo y equivalentes", parentCode: "1105" },
  { code: "110510", name: "Caja Menuda (Cambio)", type: "ACTIVO", class: 1, group: 11, subaccount: 1105, nature: "DEBITO", isCash: true, parentCode: "1105" },

  { code: "1110", name: "Bancos", type: "ACTIVO", class: 1, group: 11, subaccount: 1110, nature: "DEBITO", parentCode: "11" },
  { code: "111005", name: "Bancolombia Cuenta de Ahorros", type: "ACTIVO", class: 1, group: 11, subaccount: 1110, nature: "DEBITO", isCash: true, isPaymentMethod: true, niifMapping: "Efectivo y equivalentes", parentCode: "1110" },
  { code: "111006", name: "Bold - Pasarela de Pagos", type: "ACTIVO", class: 1, group: 11, subaccount: 1110, nature: "DEBITO", isCash: true, isPaymentMethod: true, niifMapping: "Efectivo y equivalentes", parentCode: "1110" },
  { code: "111010", name: "Nequi - Billetera Digital", type: "ACTIVO", class: 1, group: 11, subaccount: 1110, nature: "DEBITO", isCash: true, isPaymentMethod: true, parentCode: "1110" },

  // --- Deudores ---
  { code: "1305", name: "Clientes", type: "ACTIVO", class: 1, group: 13, subaccount: 1305, nature: "DEBITO", parentCode: "13" },
  { code: "130505", name: "Clientes Nacionales", type: "ACTIVO", class: 1, group: 13, subaccount: 1305, nature: "DEBITO", niifMapping: "Cuentas por cobrar comerciales", parentCode: "1305" },
  { code: "130510", name: "Clientes Corporativos", type: "ACTIVO", class: 1, group: 13, subaccount: 1305, nature: "DEBITO", parentCode: "1305" },

  { code: "1355", name: "Anticipos y Avances", type: "ACTIVO", class: 1, group: 13, subaccount: 1355, nature: "DEBITO", parentCode: "13" },
  { code: "135505", name: "Anticipos a Proveedores", type: "ACTIVO", class: 1, group: 13, subaccount: 1355, nature: "DEBITO", parentCode: "1355" },

  // --- Inventarios ---
  { code: "1435", name: "Mercancías No Fabricadas por la Empresa", type: "ACTIVO", class: 1, group: 14, subaccount: 1435, nature: "DEBITO", parentCode: "14" },
  { code: "143505", name: "Inventario Café y Derivados", type: "ACTIVO", class: 1, group: 14, subaccount: 1435, nature: "DEBITO", niifMapping: "Inventarios", parentCode: "1435" },

  { code: "1405", name: "Materias Primas", type: "ACTIVO", class: 1, group: 14, subaccount: 1405, nature: "DEBITO", parentCode: "14" },
  { code: "140505", name: "Materia Prima Café", type: "ACTIVO", class: 1, group: 14, subaccount: 1405, nature: "DEBITO", niifMapping: "Inventarios", parentCode: "1405" },
  { code: "140510", name: "Materia Prima Empaques", type: "ACTIVO", class: 1, group: 14, subaccount: 1405, nature: "DEBITO", parentCode: "1405" },

  { code: "1450", name: "Materiales Empaques y Accesorios", type: "ACTIVO", class: 1, group: 14, subaccount: 1450, nature: "DEBITO", parentCode: "14" },
  { code: "145005", name: "Empaques y Bolsas", type: "ACTIVO", class: 1, group: 14, subaccount: 1450, nature: "DEBITO", parentCode: "1450" },

  // --- Propiedades, Planta y Equipo ---
  { code: "1524", name: "Equipo de Computación y Comunicación", type: "ACTIVO", class: 1, group: 15, subaccount: 1524, nature: "DEBITO", parentCode: "15" },
  { code: "152405", name: "Equipos de Cómputo", type: "ACTIVO", class: 1, group: 15, subaccount: 1524, nature: "DEBITO", niifMapping: "Propiedad, planta y equipo", parentCode: "1524" },

  { code: "1528", name: "Equipo de Oficina", type: "ACTIVO", class: 1, group: 15, subaccount: 1528, nature: "DEBITO", parentCode: "15" },
  { code: "152805", name: "Muebles y Enseres", type: "ACTIVO", class: 1, group: 15, subaccount: 1528, nature: "DEBITO", parentCode: "1528" },

  { code: "1530", name: "Equipo de Producción", type: "ACTIVO", class: 1, group: 15, subaccount: 1530, nature: "DEBITO", parentCode: "15" },
  { code: "153005", name: "Maquinaria de Producción", type: "ACTIVO", class: 1, group: 15, subaccount: 1530, nature: "DEBITO", parentCode: "1530" },

  { code: "1592", name: "Depreciación Acumulada", type: "ACTIVO", class: 1, group: 15, subaccount: 1592, nature: "CREDITO", parentCode: "15" },
  { code: "159205", name: "Depreciación Equipo Cómputo", type: "ACTIVO", class: 1, group: 15, subaccount: 1592, nature: "CREDITO", parentCode: "1592" },
  { code: "159210", name: "Depreciación Muebles y Enseres", type: "ACTIVO", class: 1, group: 15, subaccount: 1592, nature: "CREDITO", parentCode: "1592" },
  { code: "159215", name: "Depreciación Maquinaria Producción", type: "ACTIVO", class: 1, group: 15, subaccount: 1592, nature: "CREDITO", parentCode: "1592" },

  // --- Diferidos ---
  { code: "1710", name: "Gastos Pagados por Anticipado", type: "ACTIVO", class: 1, group: 17, subaccount: 1710, nature: "DEBITO", parentCode: "17" },
  { code: "171005", name: "Seguros Pagados por Anticipado", type: "ACTIVO", class: 1, group: 17, subaccount: 1710, nature: "DEBITO", parentCode: "1710" },
  { code: "171015", name: "Dominio y Hosting Web", type: "ACTIVO", class: 1, group: 17, subaccount: 1710, nature: "DEBITO", parentCode: "1710" },

  // ================================================================
  // CLASE 2 - PASIVO (Naturaleza: CRÉDITO)
  // ================================================================

  // --- Obligaciones Financieras ---
  { code: "2105", name: "Obligaciones Financieras", type: "PASIVO", class: 2, group: 21, subaccount: 2105, nature: "CREDITO", parentCode: "21" },
  { code: "210505", name: "Bancos Nacionales", type: "PASIVO", class: 2, group: 21, subaccount: 2105, nature: "CREDITO", parentCode: "2105" },

  // --- Proveedores ---
  { code: "2205", name: "Proveedores Nacionales", type: "PASIVO", class: 2, group: 22, subaccount: 2205, nature: "CREDITO", parentCode: "22" },
  { code: "220505", name: "Proveedores", type: "PASIVO", class: 2, group: 22, subaccount: 2205, nature: "CREDITO", niifMapping: "Cuentas por pagar comerciales", parentCode: "2205" },

  // --- Cuentas por Pagar ---
  { code: "2305", name: "Cuentas por Pagar", type: "PASIVO", class: 2, group: 23, subaccount: 2305, nature: "CREDITO", parentCode: "23" },
  { code: "230505", name: "Cuentas por Pagar", type: "PASIVO", class: 2, group: 23, subaccount: 2305, nature: "CREDITO", parentCode: "2305" },

  { code: "2335", name: "Costos y Gastos por Pagar", type: "PASIVO", class: 2, group: 23, subaccount: 2335, nature: "CREDITO", parentCode: "23" },
  { code: "233595", name: "Otros Costos y Gastos por Pagar", type: "PASIVO", class: 2, group: 23, subaccount: 2335, nature: "CREDITO", parentCode: "2335" },

  // --- Retenciones ---
  { code: "2365", name: "Retención en la Fuente", type: "PASIVO", class: 2, group: 23, subaccount: 2365, nature: "CREDITO", parentCode: "23" },
  { code: "236540", name: "Retención en la Fuente - Compras", type: "PASIVO", class: 2, group: 23, subaccount: 2365, nature: "CREDITO", parentCode: "2365" },
  { code: "236545", name: "Retención en la Fuente - Honorarios", type: "PASIVO", class: 2, group: 23, subaccount: 2365, nature: "CREDITO", parentCode: "2365" },
  { code: "236550", name: "Retención en la Fuente - Servicios", type: "PASIVO", class: 2, group: 23, subaccount: 2365, nature: "CREDITO", parentCode: "2365" },

  // --- IVA ---
  { code: "2408", name: "Impuesto sobre las Ventas por Pagar (IVA)", type: "PASIVO", class: 2, group: 24, subaccount: 2408, nature: "CREDITO", parentCode: "24" },
  { code: "240805", name: "IVA Generado", type: "PASIVO", class: 2, group: 24, subaccount: 2408, nature: "CREDITO", parentCode: "2408" },
  { code: "240810", name: "IVA Descontable", type: "PASIVO", class: 2, group: 24, subaccount: 2408, nature: "DEBITO", parentCode: "2408" },

  // --- Impuestos y Contribuciones ---
  { code: "2415", name: "Estampillas", type: "PASIVO", class: 2, group: 24, subaccount: 2415, nature: "CREDITO", parentCode: "24" },
  { code: "2420", name: "Impuesto de Industria y Comercio", type: "PASIVO", class: 2, group: 24, subaccount: 2420, nature: "CREDITO", parentCode: "24" },
  { code: "242005", name: "ICA por Pagar", type: "PASIVO", class: 2, group: 24, subaccount: 2420, nature: "CREDITO", parentCode: "2420" },

  { code: "2435", name: "Aportes Patronales", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "24" },
  { code: "243505", name: "Aportes a Salud (EPS) Patronales", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "2435" },
  { code: "243510", name: "Aportes a Pensión Patronales", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "2435" },
  { code: "243515", name: "Aportes ARL", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "2435" },
  { code: "243520", name: "Aportes Caja de Compensación", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "2435" },
  { code: "243525", name: "Aportes ICBF", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "2435" },
  { code: "243530", name: "Aportes SENA", type: "PASIVO", class: 2, group: 24, subaccount: 2435, nature: "CREDITO", parentCode: "2435" },

  // --- Beneficios a Empleados ---
  { code: "2505", name: "Salarios por Pagar", type: "PASIVO", class: 2, group: 25, subaccount: 2505, nature: "CREDITO", parentCode: "25" },
  { code: "250505", name: "Salarios por Pagar", type: "PASIVO", class: 2, group: 25, subaccount: 2505, nature: "CREDITO", parentCode: "2505" },

  { code: "2520", name: "Prestaciones Sociales por Pagar", type: "PASIVO", class: 2, group: 25, subaccount: 2520, nature: "CREDITO", parentCode: "25" },
  { code: "252005", name: "Cesantías Consolidadas", type: "PASIVO", class: 2, group: 25, subaccount: 2520, nature: "CREDITO", parentCode: "2520" },
  { code: "252010", name: "Intereses sobre Cesantías", type: "PASIVO", class: 2, group: 25, subaccount: 2520, nature: "CREDITO", parentCode: "2520" },
  { code: "252015", name: "Prima de Servicios", type: "PASIVO", class: 2, group: 25, subaccount: 2520, nature: "CREDITO", parentCode: "2520" },
  { code: "252020", name: "Vacaciones Consolidadas", type: "PASIVO", class: 2, group: 25, subaccount: 2520, nature: "CREDITO", parentCode: "2520" },

  { code: "2370", name: "Impuestos a las Ventas por Pagar", type: "PASIVO", class: 2, group: 23, subaccount: 2370, nature: "CREDITO", parentCode: "23" },
  { code: "237005", name: "Declaración de IVA", type: "PASIVO", class: 2, group: 23, subaccount: 2370, nature: "CREDITO", parentCode: "2370" },

  // ================================================================
  // CLASE 3 - PATRIMONIO (Naturaleza: CRÉDITO)
  // ================================================================

  { code: "3105", name: "Aportes Sociales", type: "PATRIMONIO", class: 3, group: 31, subaccount: 3105, nature: "CREDITO", parentCode: "31" },
  { code: "310505", name: "Aportes Sociales - Persona Natural", type: "PATRIMONIO", class: 3, group: 31, subaccount: 3105, nature: "CREDITO", niifMapping: "Patrimonio", parentCode: "3105" },

  { code: "3115", name: "Aportes No Constituidos en Sociedad", type: "PATRIMONIO", class: 3, group: 31, subaccount: 3115, nature: "CREDITO", parentCode: "31" },
  { code: "311505", name: "Capital Individual", type: "PATRIMONIO", class: 3, group: 31, subaccount: 3115, nature: "CREDITO", parentCode: "3115" },

  { code: "3605", name: "Utilidad del Ejercicio", type: "PATRIMONIO", class: 3, group: 36, subaccount: 3605, nature: "CREDITO", parentCode: "36" },
  { code: "360505", name: "Utilidad del Ejercicio Corriente", type: "PATRIMONIO", class: 3, group: 36, subaccount: 3605, nature: "CREDITO", parentCode: "3605" },

  { code: "3705", name: "Resultados de Ejercicios Anteriores", type: "PATRIMONIO", class: 3, group: 37, subaccount: 3705, nature: "CREDITO", parentCode: "37" },
  { code: "370505", name: "Utilidades Acumuladas", type: "PATRIMONIO", class: 3, group: 37, subaccount: 3705, nature: "CREDITO", parentCode: "3705" },

  // ================================================================
  // CLASE 4 - INGRESOS (Naturaleza: CRÉDITO)
  // ================================================================

  { code: "4135", name: "Comercio al por Mayor y al por Menor", type: "INGRESO", class: 4, group: 41, subaccount: 4135, nature: "CREDITO", parentCode: "41" },
  { code: "413505", name: "Ingresos por Venta de Café", type: "INGRESO", class: 4, group: 41, subaccount: 4135, nature: "CREDITO", niifMapping: "Ingresos de actividades ordinarias", parentCode: "4135" },
  { code: "413510", name: "Ingresos por Venta de Derivados", type: "INGRESO", class: 4, group: 41, subaccount: 4135, nature: "CREDITO", parentCode: "4135" },
  { code: "413520", name: "Ingresos por Venta Corporativa", type: "INGRESO", class: 4, group: 41, subaccount: 4135, nature: "CREDITO", parentCode: "4135" },
  { code: "413525", name: "Ingresos por Combos y Promociones", type: "INGRESO", class: 4, group: 41, subaccount: 4135, nature: "CREDITO", parentCode: "4135" },

  { code: "4210", name: "Financieros", type: "INGRESO", class: 4, group: 42, subaccount: 4210, nature: "CREDITO", parentCode: "42" },
  { code: "421005", name: "Intereses Bancarios", type: "INGRESO", class: 4, group: 42, subaccount: 4210, nature: "CREDITO", parentCode: "4210" },
  { code: "421040", name: "Rendimientos por Excedentes", type: "INGRESO", class: 4, group: 42, subaccount: 4210, nature: "CREDITO", parentCode: "4210" },

  { code: "4250", name: "Recuperaciones", type: "INGRESO", class: 4, group: 42, subaccount: 4250, nature: "CREDITO", parentCode: "42" },
  { code: "425005", name: "Recuperaciones Diversas", type: "INGRESO", class: 4, group: 42, subaccount: 4250, nature: "CREDITO", parentCode: "4250" },

  // ================================================================
  // CLASE 5 - GASTOS OPERACIONALES (Naturaleza: DÉBITO)
  // ================================================================

  // --- Gastos de Administración ---
  { code: "5105", name: "Gastos de Personal - Administración", type: "GASTO", class: 5, group: 51, subaccount: 5105, nature: "DEBITO", parentCode: "51" },
  { code: "510506", name: "Sueldos y Salarios - Administración", type: "GASTO", class: 5, group: 51, subaccount: 5105, nature: "DEBITO", parentCode: "5105" },
  { code: "510515", name: "Prestaciones Sociales - Administración", type: "GASTO", class: 5, group: 51, subaccount: 5105, nature: "DEBITO", parentCode: "5105" },
  { code: "510533", name: "Indemnizaciones Laborales", type: "GASTO", class: 5, group: 51, subaccount: 5105, nature: "DEBITO", parentCode: "5105" },

  { code: "5110", name: "Honorarios", type: "GASTO", class: 5, group: 51, subaccount: 5110, nature: "DEBITO", parentCode: "51" },
  { code: "511005", name: "Honorarios Contador", type: "GASTO", class: 5, group: 51, subaccount: 5110, nature: "DEBITO", parentCode: "5110" },
  { code: "511010", name: "Honorarios Abogado", type: "GASTO", class: 5, group: 51, subaccount: 5110, nature: "DEBITO", parentCode: "5110" },

  { code: "5120", name: "Servicios Públicos", type: "GASTO", class: 5, group: 51, subaccount: 5120, nature: "DEBITO", parentCode: "51" },
  { code: "512005", name: "Energía Eléctrica", type: "GASTO", class: 5, group: 51, subaccount: 5120, nature: "DEBITO", parentCode: "5120" },
  { code: "512010", name: "Telefonía e Internet", type: "GASTO", class: 5, group: 51, subaccount: 5120, nature: "DEBITO", parentCode: "5120" },
  { code: "512015", name: "Acueducto y Alcantarillado", type: "GASTO", class: 5, group: 51, subaccount: 5120, nature: "DEBITO", parentCode: "5120" },
  { code: "512020", name: "Gas Natural", type: "GASTO", class: 5, group: 51, subaccount: 5120, nature: "DEBITO", parentCode: "5120" },

  { code: "5135", name: "Servicios - Administración", type: "GASTO", class: 5, group: 51, subaccount: 5135, nature: "DEBITO", parentCode: "51" },
  { code: "513505", name: "Aseo y Vigilancia", type: "GASTO", class: 5, group: 51, subaccount: 5135, nature: "DEBITO", parentCode: "5135" },
  { code: "513525", name: "Mantenimiento y Reparaciones", type: "GASTO", class: 5, group: 51, subaccount: 5135, nature: "DEBITO", parentCode: "5135" },
  { code: "513545", name: "Transportes y Fletes", type: "GASTO", class: 5, group: 51, subaccount: 5135, nature: "DEBITO", parentCode: "5135" },
  { code: "513560", name: "Gasolina y Lubricantes", type: "GASTO", class: 5, group: 51, subaccount: 5135, nature: "DEBITO", parentCode: "5135" },
  { code: "513595", name: "Otros Servicios", type: "GASTO", class: 5, group: 51, subaccount: 5135, nature: "DEBITO", parentCode: "5135" },

  { code: "5140", name: "Tributos y Aportes", type: "GASTO", class: 5, group: 51, subaccount: 5140, nature: "DEBITO", parentCode: "51" },
  { code: "514015", name: "Industria y Comercio", type: "GASTO", class: 5, group: 51, subaccount: 5140, nature: "DEBITO", parentCode: "5140" },

  { code: "5195", name: "Diversos - Administración", type: "GASTO", class: 5, group: 51, subaccount: 5195, nature: "DEBITO", parentCode: "51" },
  { code: "519535", name: "Dotación de Suministros", type: "GASTO", class: 5, group: 51, subaccount: 5195, nature: "DEBITO", parentCode: "5195" },
  { code: "519545", name: "Gastos de Papelería", type: "GASTO", class: 5, group: 51, subaccount: 5195, nature: "DEBITO", parentCode: "5195" },
  { code: "519560", name: "Suscripciones Software", type: "GASTO", class: 5, group: 51, subaccount: 5195, nature: "DEBITO", parentCode: "5195" },

  // --- Gastos de Ventas ---
  { code: "5205", name: "Gastos de Personal - Ventas", type: "GASTO", class: 5, group: 52, subaccount: 5205, nature: "DEBITO", parentCode: "52" },
  { code: "520506", name: "Sueldos y Salarios - Ventas", type: "GASTO", class: 5, group: 52, subaccount: 5205, nature: "DEBITO", parentCode: "5205" },
  { code: "520515", name: "Prestaciones Sociales - Ventas", type: "GASTO", class: 5, group: 52, subaccount: 5205, nature: "DEBITO", parentCode: "5205" },
  { code: "520536", name: "Comisiones - Ventas", type: "GASTO", class: 5, group: 52, subaccount: 5205, nature: "DEBITO", parentCode: "5205" },

  { code: "5235", name: "Servicios - Ventas", type: "GASTO", class: 5, group: 52, subaccount: 5235, nature: "DEBITO", parentCode: "52" },
  { code: "523535", name: "Publicidad y Propaganda", type: "GASTO", class: 5, group: 52, subaccount: 5235, nature: "DEBITO", parentCode: "5235" },
  { code: "523545", name: "Mantenimiento - Punto de Venta", type: "GASTO", class: 5, group: 52, subaccount: 5235, nature: "DEBITO", parentCode: "5235" },
  { code: "523570", name: "Envíos y Despachos", type: "GASTO", class: 5, group: 52, subaccount: 5235, nature: "DEBITO", parentCode: "5235" },

  { code: "5295", name: "Diferidos - Ventas", type: "GASTO", class: 5, group: 52, subaccount: 5295, nature: "DEBITO", parentCode: "52" },
  { code: "529505", name: "Marketing Digital", type: "GASTO", class: 5, group: 52, subaccount: 5295, nature: "DEBITO", parentCode: "5295" },
  { code: "529510", name: "Redes Sociales", type: "GASTO", class: 5, group: 52, subaccount: 5295, nature: "DEBITO", parentCode: "5295" },

  // --- Gastos No Operacionales ---
  { code: "5305", name: "Financieros - Gastos", type: "GASTO", class: 5, group: 53, subaccount: 5305, nature: "DEBITO", parentCode: "53" },
  { code: "530505", name: "Comisiones Bancarias", type: "GASTO", class: 5, group: 53, subaccount: 5305, nature: "DEBITO", parentCode: "5305" },
  { code: "530510", name: "Comisiones Bold (Pasarela)", type: "GASTO", class: 5, group: 53, subaccount: 5305, nature: "DEBITO", parentCode: "5305" },
  { code: "530535", name: "Intereses Bancarios", type: "GASTO", class: 5, group: 53, subaccount: 5305, nature: "DEBITO", parentCode: "5305" },

  // ================================================================
  // CLASE 6 - COSTO DE VENTAS (Naturaleza: DÉBITO)
  // ================================================================

  { code: "6135", name: "Comercio al por Mayor y al por Menor - Costo", type: "COSTO", class: 6, group: 61, subaccount: 6135, nature: "DEBITO", parentCode: "61" },
  { code: "613505", name: "Costo de Mercancías Vendidas - Café", type: "COSTO", class: 6, group: 61, subaccount: 6135, nature: "DEBITO", niifMapping: "Costo de ventas", parentCode: "6135" },
  { code: "613510", name: "Costo de Mercancías Vendidas - Derivados", type: "COSTO", class: 6, group: 61, subaccount: 6135, nature: "DEBITO", parentCode: "6135" },
  { code: "613515", name: "Costo de Mercancías Vendidas - Corporativo", type: "COSTO", class: 6, group: 61, subaccount: 6135, nature: "DEBITO", parentCode: "6135" },

  // --- Clases para jerarquía ---
  { code: "1", name: "ACTIVO", type: "ACTIVO", class: 1, group: 1, subaccount: 1, nature: "DEBITO" },
  { code: "2", name: "PASIVO", type: "PASIVO", class: 2, group: 2, subaccount: 2, nature: "CREDITO" },
  { code: "3", name: "PATRIMONIO", type: "PATRIMONIO", class: 3, group: 3, subaccount: 3, nature: "CREDITO" },
  { code: "4", name: "INGRESOS", type: "INGRESO", class: 4, group: 4, subaccount: 4, nature: "CREDITO" },
  { code: "5", name: "GASTOS", type: "GASTO", class: 5, group: 5, subaccount: 5, nature: "DEBITO" },
  { code: "6", name: "COSTOS", type: "COSTO", class: 6, group: 6, subaccount: 6, nature: "DEBITO" },

  // --- Grupos para jerarquía ---
  { code: "11", name: "Disponible", type: "ACTIVO", class: 1, group: 11, subaccount: 11, nature: "DEBITO", parentCode: "1" },
  { code: "13", name: "Deudores", type: "ACTIVO", class: 1, group: 13, subaccount: 13, nature: "DEBITO", parentCode: "1" },
  { code: "14", name: "Inventarios", type: "ACTIVO", class: 1, group: 14, subaccount: 14, nature: "DEBITO", parentCode: "1" },
  { code: "15", name: "Propiedades, Planta y Equipo", type: "ACTIVO", class: 1, group: 15, subaccount: 15, nature: "DEBITO", parentCode: "1" },
  { code: "17", name: "Diferidos", type: "ACTIVO", class: 1, group: 17, subaccount: 17, nature: "DEBITO", parentCode: "1" },
  { code: "21", name: "Obligaciones Financieras", type: "PASIVO", class: 2, group: 21, subaccount: 21, nature: "CREDITO", parentCode: "2" },
  { code: "22", name: "Proveedores", type: "PASIVO", class: 2, group: 22, subaccount: 22, nature: "CREDITO", parentCode: "2" },
  { code: "23", name: "Cuentas por Pagar", type: "PASIVO", class: 2, group: 23, subaccount: 23, nature: "CREDITO", parentCode: "2" },
  { code: "24", name: "Impuestos, Gravámenes y Tasas", type: "PASIVO", class: 2, group: 24, subaccount: 24, nature: "CREDITO", parentCode: "2" },
  { code: "25", name: "Obligaciones Laborales", type: "PASIVO", class: 2, group: 25, subaccount: 25, nature: "CREDITO", parentCode: "2" },
  { code: "31", name: "Capital Social", type: "PATRIMONIO", class: 3, group: 31, subaccount: 31, nature: "CREDITO", parentCode: "3" },
  { code: "36", name: "Resultados del Ejercicio", type: "PATRIMONIO", class: 3, group: 36, subaccount: 36, nature: "CREDITO", parentCode: "3" },
  { code: "37", name: "Resultados de Ejercicios Anteriores", type: "PATRIMONIO", class: 3, group: 37, subaccount: 37, nature: "CREDITO", parentCode: "3" },
  { code: "41", name: "Ingresos Operacionales", type: "INGRESO", class: 4, group: 41, subaccount: 41, nature: "CREDITO", parentCode: "4" },
  { code: "42", name: "Ingresos No Operacionales", type: "INGRESO", class: 4, group: 42, subaccount: 42, nature: "CREDITO", parentCode: "4" },
  { code: "51", name: "Gastos de Administración", type: "GASTO", class: 5, group: 51, subaccount: 51, nature: "DEBITO", parentCode: "5" },
  { code: "52", name: "Gastos de Ventas", type: "GASTO", class: 5, group: 52, subaccount: 52, nature: "DEBITO", parentCode: "5" },
  { code: "53", name: "Gastos No Operacionales", type: "GASTO", class: 5, group: 53, subaccount: 53, nature: "DEBITO", parentCode: "5" },
  { code: "61", name: "Costo de Ventas", type: "COSTO", class: 6, group: 61, subaccount: 61, nature: "DEBITO", parentCode: "6" },
];
