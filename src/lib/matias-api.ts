/**
 * Cliente MATIAS API - Integración con DIAN
 *
 * MATIAS es un proveedor tecnológico autorizado por la DIAN que maneja:
 * - OAuth 2.0 / JWT para autenticación
 * - Generación de XML UBL 2.1
 * - Firma digital XAdES
 * - Envío y validación con la DIAN
 * - RADIAN (validación de facturas)
 *
 * Sitio: https://matias-api.com
 * Plan recomendado: $220,000 COP/año - 5,000 documentos
 */

import { dianDate, dianTime } from "./format";

// ============================================================
// TIPOS
// ============================================================

interface MatiasConfig {
  apiToken: string;
  baseUrl: string;
  softwareId?: string;
  softwarePin?: string;
}

interface MatiasInvoiceResponse {
  success: boolean;
  cufe?: string;
  qrCode?: string;
  xml?: string;
  pdfBase64?: string;
  response?: any;
  error?: string;
}

interface MatiasPayrollResponse {
  success: boolean;
  cune?: string;
  xml?: string;
  response?: any;
  error?: string;
}

// ============================================================
// CLIENTE MATIAS
// ============================================================

/**
 * Construye el XML de la factura en formato UBL 2.1 para la DIAN.
 * Este XML es requerido por MATIAS para el envío.
 */
export function buildInvoiceXML(invoice: any, company: any): string {
  const date = dianDate(invoice.createdAt);
  const time = dianTime(invoice.createdAt);

  // XML simplificado - MATIAS se encarga de la firma y validación completa
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ID>${invoice.fullNumber}</cbc:ID>
  <cbc:IssueDate>${date}</cbc:IssueDate>
  <cbc:IssueTime>${time}</cbc:IssueTime>
  <cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>
  <cac:AccountingSupplierParty>
    <cac:PartyIdentification>
      <cbc:ID schemeID="4">${company.documentNumber}</cbc:ID>
    </cac:PartyIdentification>
    <cac:PartyName>
      <cbc:Name>${company.legalName}</cbc:Name>
    </cac:PartyName>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:PartyIdentification>
      <cbc:ID schemeID="4">${invoice.customerDocument}</cbc:ID>
    </cac:PartyIdentification>
    <cac:PartyName>
      <cbc:Name>${invoice.customerName}</cbc:Name>
    </cac:PartyName>
  </cac:AccountingCustomerParty>
  ${invoice.items.map((item: any, idx: number) => `
  <cac:InvoiceLine>
    <cbc:ID>${idx + 1}</cbc:ID>
    <cbc:InvoicedQuantity>${item.quantity}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount>${item.total}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>${item.description}</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount>${item.unitPrice}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>`).join("")}
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount>${invoice.subtotal - invoice.discount}</cbc:LineExtensionAmount>
    <cbc:TaxInclusiveAmount>${invoice.total}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount>${invoice.total}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;
}

/**
 * Envía una factura a la DIAN a través de MATIAS API
 */
export async function sendInvoiceToMatias(
  invoice: any,
  company: any
): Promise<MatiasInvoiceResponse> {
  const config: MatiasConfig = {
    apiToken: company.matiasApiToken || "",
    baseUrl: company.matiasApiBaseUrl || "https://matias-api.com/api/v1",
    softwareId: company.dianSoftwareId || undefined,
    softwarePin: company.dianPin || undefined,
  };

  if (!config.apiToken) {
    return {
      success: false,
      error: "Token de MATIAS API no configurado",
    };
  }

  const xml = buildInvoiceXML(invoice, company);

  try {
    const response = await fetch(`${config.baseUrl}/invoice/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiToken}`,
      },
      body: JSON.stringify({
        documentType: "FACTURA",
        prefix: invoice.prefix,
        number: invoice.number,
        xml,
        paymentMethod: invoice.paymentMethod,
        environment: company.dianEnvironment || "PRUEBAS",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        error: `MATIAS API error ${response.status}: ${errorData}`,
      };
    }

    const data = await response.json();

    return {
      success: data.success || data.cufe ? true : false,
      cufe: data.cufe,
      qrCode: data.qrCode,
      xml: data.xml || xml,
      pdfBase64: data.pdfBase64,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Error de conexión MATIAS: ${error.message}`,
    };
  }
}

/**
 * Consulta el estado de una factura en la DIAN
 */
export async function getInvoiceStatus(
  cufe: string,
  config: MatiasConfig
): Promise<any> {
  try {
    const response = await fetch(`${config.baseUrl}/invoice/status/${cufe}`, {
      headers: {
        "Authorization": `Bearer ${config.apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Error consultando estado DIAN: ${error.message}`);
  }
}

/**
 * Envía una nómina electrónica a la DIAN a través de MATIAS API
 * Resolución 000013/2021
 */
export async function sendPayrollToMatias(
  payroll: any,
  company: any
): Promise<MatiasPayrollResponse> {
  const config: MatiasConfig = {
    apiToken: company.matiasApiToken || "",
    baseUrl: company.matiasApiBaseUrl || "https://matias-api.com/api/v1",
  };

  if (!config.apiToken) {
    return {
      success: false,
      error: "Token de MATIAS API no configurado",
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/payroll/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiToken}`,
      },
      body: JSON.stringify({
        period: payroll.period,
        employeeDocument: payroll.employee.thirdParty.documentNumber,
        employeeName: payroll.employee.thirdParty.fullName,
        baseSalary: payroll.baseSalary,
        totalEarned: payroll.totalEarned,
        totalDeductions: payroll.totalDeductions,
        netPay: payroll.netPay,
        employerContributions: {
          health: payroll.employerHealth,
          pension: payroll.employerPension,
          arl: payroll.arl,
          caja: payroll.caja,
          icbf: payroll.icbf,
          sena: payroll.sena,
        },
        environment: company.dianEnvironment || "PRUEBAS",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        error: `MATIAS API error ${response.status}: ${errorData}`,
      };
    }

    const data = await response.json();

    return {
      success: data.success || data.cune ? true : false,
      cune: data.cune,
      xml: data.xml,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Error de conexión MATIAS: ${error.message}`,
    };
  }
}

/**
 * Valida la conexión con MATIAS API
 */
export async function testMatiasConnection(config: MatiasConfig): Promise<boolean> {
  try {
    const response = await fetch(`${config.baseUrl}/health`, {
      headers: {
        "Authorization": `Bearer ${config.apiToken}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
