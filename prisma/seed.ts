import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PUC_ACCOUNTS } from "./puc-accounts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ============================================================
// HASH SIMPLE DE CONTRASEÑAS (para seed inicial)
// En producción, las contraseñas se hashean con bcrypt en el API
// ============================================================
function simpleHash(text: string): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(text + (process.env.AUTH_SECRET || "cafe-la-elda")).digest("hex");
}

async function main() {
  console.log("🌱 Iniciando seed del sistema contable Café La Elda...\n");

  // ============================================================
  // 1. CONFIGURACIÓN DE EMPRESA (CompanySettings)
  // ============================================================
  console.log("📋 Configurando datos de empresa...");
  await prisma.companySettings.upsert({
    where: { id: "company-001" },
    update: {},
    create: {
      id: "company-001",
      legalName: "CAFE LA ELDA 1941",
      documentType: "CC",
      documentNumber: "24694411",
      verificationDigit: 9,
      taxRegime: "NO_RESPONSABLE",
      icaRate: 0,
      reteFuenteRate: 0,
      address: "Dosquebradas, Risaralda",
      city: "Dosquebradas",
      department: "Risaralda",
      country: "CO",
      phone: "+57 310 000 0000",
      email: "contacto@cafelaelda.com",
      dianEnvironment: "PRUEBAS",
      matiasApiBaseUrl: "https://matias-api.com/api/v1",
      primaryColor: "#1A0F08",
      accentColor: "#C8A24A",
    },
  });
  console.log("   ✓ Empresa configurada: NIT 24694411-9, No responsable de IVA");

  // ============================================================
  // 2. USUARIO ADMINISTRADOR
  // ============================================================
  console.log("👤 Creando usuario administrador...");
  const adminPassword = process.env.ADMIN_PASSWORD || "Elda1941!";
  await prisma.user.upsert({
    where: { email: "admin@cafelaelda.com" },
    update: {},
    create: {
      email: "admin@cafelaelda.com",
      passwordHash: simpleHash(adminPassword),
      name: "Administrador",
      role: "ADMIN",
      active: true,
    },
  });
  console.log("   ✓ Usuario admin: admin@cafelaelda.com");

  // ============================================================
  // 3. PLAN ÚNICO DE CUENTAS (PUC)
  // ============================================================
  console.log("📚 Cargando Plan Único de Cuentas (PUC)...");
  const accountMap = new Map<string, string>(); // code -> id

  // Primero crear las cuentas raíz (sin padre) ordenadas por longitud de código
  const sortedAccounts = [...PUC_ACCOUNTS].sort((a, b) => a.code.length - b.code.length);

  for (const acc of sortedAccounts) {
    const parentId = acc.parentCode ? accountMap.get(acc.parentCode) : null;
    const created = await prisma.account.upsert({
      where: { code: acc.code },
      update: {},
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        class: acc.class,
        group: acc.group,
        subaccount: acc.subaccount,
        nature: acc.nature,
        niifMapping: acc.niifMapping || null,
        parentId: parentId || null,
        isCash: acc.isCash || false,
        isPaymentMethod: acc.isPaymentMethod || false,
        active: true,
        balance: 0,
      },
    });
    accountMap.set(acc.code, created.id);
  }
  console.log(`   ✓ ${PUC_ACCOUNTS.length} cuentas PUC cargadas`);

  // ============================================================
  // 4. BODEGAS
  // ============================================================
  console.log("🏢 Creando bodegas...");
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: "BOD-1" },
    update: {},
    create: {
      name: "Bodega Principal",
      code: "BOD-1",
      address: "Dosquebradas, Risaralda",
      type: "PRINCIPAL",
      active: true,
    },
  });

  await prisma.warehouse.upsert({
    where: { code: "PV-1" },
    update: {},
    create: {
      name: "Punto de Venta",
      code: "PV-1",
      type: "PUNTO_VENTA",
      active: true,
    },
  });
  console.log("   ✓ 2 bodegas creadas (Principal + Punto de Venta)");

  // ============================================================
  // 5. CUENTAS BANCARIAS
  // ============================================================
  console.log("🏦 Configurando cuentas bancarias...");

  const cajaAccount = await prisma.account.findUnique({ where: { code: "110505" } });
  const bancolombiaAccount = await prisma.account.findUnique({ where: { code: "111005" } });
  const boldAccount = await prisma.account.findUnique({ where: { code: "111006" } });
  const nequiAccount = await prisma.account.findUnique({ where: { code: "111010" } });

  if (cajaAccount) {
    await prisma.bankAccount.upsert({
      where: { accountNumber: "CAJA-001" },
      update: {},
      create: {
        bankName: "Caja Efectivo",
        accountType: "VIRTUAL",
        accountNumber: "CAJA-001",
        accountId: cajaAccount.id,
        balance: 0,
        active: true,
      },
    });
  }

  if (bancolombiaAccount) {
    await prisma.bankAccount.upsert({
      where: { accountNumber: "BANCOLOMBIA-001" },
      update: {},
      create: {
        bankName: "Bancolombia",
        accountType: "AHORROS",
        accountNumber: "BANCOLOMBIA-001",
        accountId: bancolombiaAccount.id,
        balance: 0,
        active: true,
      },
    });
  }

  if (boldAccount) {
    await prisma.bankAccount.upsert({
      where: { accountNumber: "BOLD-001" },
      update: {},
      create: {
        bankName: "Bold",
        accountType: "VIRTUAL",
        accountNumber: "BOLD-001",
        accountId: boldAccount.id,
        balance: 0,
        active: true,
      },
    });
  }

  if (nequiAccount) {
    await prisma.bankAccount.upsert({
      where: { accountNumber: "NEQUI-001" },
      update: {},
      create: {
        bankName: "Nequi",
        accountType: "VIRTUAL",
        accountNumber: "NEQUI-001",
        accountId: nequiAccount.id,
        balance: 0,
        active: true,
      },
    });
  }
  console.log("   ✓ 4 cuentas bancarias configuradas");

  // ============================================================
  // 6. TERCERO: CLIENTE EVENTUAL (para facturación sin cliente registrado)
  // ============================================================
  console.log("👥 Creando cliente eventual...");
  await prisma.thirdParty.upsert({
    where: { documentType_documentNumber: { documentType: "CC", documentNumber: "22222222" } },
    update: {},
    create: {
      type: "CLIENTE",
      documentType: "CC",
      documentNumber: "22222222",
      fullName: "CLIENTE EVENTUAL",
      taxRegime: "NO_RESPONSABLE",
      isResponsibleIva: false,
      active: true,
      balance: 0,
    },
  });
  console.log("   ✓ Cliente eventual creado");

  // ============================================================
  // 7. CATEGORÍAS Y PRODUCTOS (E-commerce existente)
  // ============================================================
  console.log("☕ Cargando catálogo de productos...");

  const cafe = await prisma.category.upsert({
    where: { slug: "cafe" },
    update: {},
    create: { name: "Café", slug: "cafe" },
  });

  const derivado = await prisma.category.upsert({
    where: { slug: "derivado" },
    update: {},
    create: { name: "Derivados", slug: "derivado" },
  });

  // Limpiar productos eliminados
  await prisma.product.deleteMany({ where: { slug: { in: ["kaski-cereal-de-cafe", "pack-arequipe-x4", "arequipe-de-cafe"] } } });

  const products = [
    { name: "Panderositas de Café 20g", slug: "panderositas-de-cafe-20g", description: "Galletas artesanales de café colombiano. Presentación individual de 20g.", price: 5000, weight: "20 gramos", image: "/images/panderositas-20g.png", tag: "Nuevo", categoryId: derivado.id },
    { name: "Panderositas de Café", slug: "panderositas-de-cafe", description: "Galletas artesanales de café colombiano. El snack perfecto para tu taza.", price: 10000, weight: "60 gramos", image: "/images/panderositas-60g.png", tag: "Nuevo", categoryId: derivado.id },
    { name: "Panderositas de Café 125g", slug: "panderositas-de-cafe-125g", description: "Galletas artesanales de café colombiano. Presentación familiar de 125g.", price: 20000, weight: "125 gramos", image: "/images/panderositas-125g.png", tag: "Nuevo", categoryId: derivado.id },
    { name: "Chocoffee", slug: "chocoffee", description: "Mezcla de café tostado con cobertura de chocolate artesanal. Irresistible.", price: 8000, weight: "30 gramos", image: "/images/chocoffee-30g.png", tag: "Especial", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Kaski Cáscara de Café", slug: "kaski-cascara-de-cafe", description: "Cáscara de café deshidratada con panela. Snack para deleitar el paladar con yogurt, leche, fruta deshidratada, etc.", price: 10000, weight: "30 gramos", image: "/images/kaski-30g.png", tag: "Novedad", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Kaski Cáscara de Café 80g", slug: "kaski-cascara-de-cafe-80g", description: "Cáscara caramelizada y deshidratada de café. Snack para deleitar el paladar.", price: 25000, weight: "80 gramos", image: "/images/kaski-80g.png", tag: "Novedad", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Totumo de Arequipe de Café 40g", slug: "totumo-arequipe-de-cafe-40g", description: "Arequipe de café artesanal La Elda en totumo tradicional. Presentación de 40g.", price: 4000, weight: "40 gramos", image: "/images/totumo-arequipe-40g.png", tag: "Artesanal", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Totumo de Arequipe de Café 130g", slug: "totumo-arequipe-de-cafe-130g", description: "Arequipe de café artesanal La Elda en totumo tradicional. Presentación de 130g.", price: 10000, weight: "130 gramos", image: "/images/totumo-arequipe-130g.png", tag: "Artesanal", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Chocoffee 70g", slug: "chocoffee-70g", description: "Mezcla de café tostado con cobertura de chocolate artesanal. Presentación 70g.", price: 12000, weight: "70 gramos", image: "/images/chocoffee-70g.png", tag: "Especial", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Chocoffee 120g", slug: "chocoffee-120g", description: "Mezcla de café tostado con cobertura de chocolate artesanal. Presentación 120g.", price: 23000, weight: "120 gramos", image: "/images/chocoffee-120g.png", tag: "Especial", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Café Premium 125g", slug: "cafe-premium-125g", description: "Presentación ideal para regalo o para probar nuestro café artesanal.", price: 15000, weight: "125 gramos", image: "/images/cafe-premium-125g.png", tag: "Grano · Molido", categoryId: cafe.id, featured: true },
    { name: "Café Premium 250g", slug: "cafe-premium-250g", description: "Café agroecológico seleccionado, disponible en grano o molido.", price: 25000, weight: "250 gramos", image: "/images/cafe-premium-250g.png", tag: "Grano · Molido", categoryId: cafe.id, featured: true },
    { name: "Pack x4 Totumos de Arequipe", slug: "pack-totumos-x4", description: "Set de 4 totumos de arequipe de café artesanal La Elda. El regalo perfecto.", price: 12000, weight: "4 totumos", image: "/images/pack-totumos-x4.png", tag: "Pack x4", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Vino de Café 750ml", slug: "vino-de-cafe-750ml", description: "Una obra maestra artesanal donde el café de altura se abraza con la uva isabelina.", price: 38000, weight: "750 ml", image: "/images/vino-de-cafe-750ml.png", tag: "Edición Artesanal", tagStyle: "nuevo", categoryId: derivado.id },
    { name: "Café Familiar 500g", slug: "cafe-familiar-500g", description: "La presentación más completa para los verdaderos amantes del café.", price: 45000, weight: "500 gramos", image: "/images/cafe-familiar-500g.png", tag: "Grano · Molido", categoryId: cafe.id, featured: true },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`   ✓ ${products.length} productos cargados`);

  // ============================================================
  // 8. INVENTARIO INICIAL (stock de productos en bodega principal)
  // ============================================================
  console.log("📦 Inicializando inventario...");
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    await prisma.inventoryItem.upsert({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: mainWarehouse.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        warehouseId: mainWarehouse.id,
        quantity: 0,
        reserved: 0,
        minStock: 5,
        unitCost: Math.round(product.price * 0.5), // Costo estimado 50% del precio
        totalCost: 0,
        valuationMethod: "PROMEDIO",
      },
    });
  }
  console.log(`   ✓ ${allProducts.length} items de inventario inicializados`);

  // ============================================================
  // RESUMEN
  // ============================================================
  console.log("\n✅ Seed completado exitosamente:");
  console.log("   • Configuración de empresa (NIT 24694411-9)");
  console.log("   • Usuario administrador");
  console.log(`   • ${PUC_ACCOUNTS.length} cuentas PUC (Plan Único de Cuentas)`);
  console.log("   • 2 bodegas (Principal + Punto de Venta)");
  console.log("   • 4 cuentas bancarias (Caja, Bancolombia, Bold, Nequi)");
  console.log("   • Cliente eventual");
  console.log(`   • ${products.length} productos`);
  console.log(`   • ${allProducts.length} items de inventario inicializados`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
