import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCart } from "@/lib/pricing";

interface CartLine {
  id: string;
  name: string;
  price: number;
  weight?: string;
  quantity: number;
}

function bancolombiaEndpoints(env: string) {
  if (env === "production") {
    return {
      token: "https://api.bancolombia.com/enterprise-transactions/v1/token",
      transaction:
        "https://api.bancolombia.com/enterprise-transactions/v1/commerce/transaction",
      checkoutBase: "https://transacciones.bancolombia.com",
    };
  }
  return {
    token: "https://sandbox.api.bancolombia.com/enterprise-transactions/v1/token",
    transaction:
      "https://sandbox.api.bancolombia.com/enterprise-transactions/v1/commerce/transaction",
    checkoutBase: "https://sandbox.transacciones.bancolombia.com",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerName, customerPhone, customerEmail } = body as {
      items: CartLine[];
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const clientId = process.env.BANCOLOMBIA_CLIENT_ID;
    const clientSecret = process.env.BANCOLOMBIA_CLIENT_SECRET;
    const merchantId = process.env.BANCOLOMBIA_MERCHANT_ID;
    const env = process.env.BANCOLOMBIA_ENVIRONMENT || "test";

    const notConfigured =
      !clientId ||
      clientId === "pon_aqui_tu_client_id_de_bancolombia" ||
      !clientSecret ||
      clientSecret === "pon_aqui_tu_client_secret_de_bancolombia" ||
      !merchantId ||
      merchantId === "pon_aqui_tu_identificador_del_comercio";

    if (notConfigured) {
      return NextResponse.json(
        {
          error:
            "Faltan las credenciales de Bancolombia en el archivo .env (CLIENT_ID, CLIENT_SECRET, MERCHANT_ID). Se obtienen al firmar el acuerdo comercial con el ejecutivo de Bancolombia.",
        },
        { status: 500 }
      );
    }

    // Validar el carrito contra los precios oficiales del servidor.
    // Esto evita la manipulación de precios desde el cliente.
    const { lines: verifiedLines, total } = await verifyCart(items);

    if (total < 1000) {
      return NextResponse.json(
        { error: "El monto mínimo para pagar es $1.000 COP." },
        { status: 400 }
      );
    }

    let orderReference = `cafe-la-elda-${Date.now()}`;
    try {
      const order = await prisma.order.create({
        data: {
          customerName: customerName
            ? String(customerName).slice(0, 200)
            : "Cliente Bancolombia",
          customerPhone: customerPhone ? String(customerPhone).slice(0, 50) : "",
          customerEmail: customerEmail ? String(customerEmail).slice(0, 200) : null,
          city: null,
          notes: null,
          total,
          // Usamos los precios verificados del servidor (NO los del cliente)
          items: {
            create: verifiedLines.map((line) => ({
              productId: line.id,
              quantity: line.quantity,
              price: line.unitPrice,
            })),
          },
        },
      });
      orderReference = order.id;
    } catch {
      // si la BD no está disponible, igual generamos el pago con una referencia temporal
    }

    const endpoints = bancolombiaEndpoints(env);
    const origin = request.nextUrl.origin;

    const tokenRes = await fetch(endpoints.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "CommerceIntegration/transaction:write",
      }).toString(),
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      return NextResponse.json(
        { error: "No se pudo autenticar con Bancolombia.", detail: txt },
        { status: 502 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken: string = tokenData.access_token;

    const txRes = await fetch(endpoints.transaction, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchantId,
        commerce: {
          merchantData: {
            merchantName: "Café La Elda 1941",
            merchantIdentification: "Finca Buenos Aires",
          },
        },
        amount: {
          currency: "COP",
          value: total,
        },
        description: `Pedido Café La Elda 1941 (Ref: ${orderReference})`,
        reference: orderReference,
        redirectTo: {
          success: `${origin}/pago/exito?ref=${orderReference}`,
          cancel: `${origin}/pago/cancelado?ref=${orderReference}`,
        },
      }),
    });

    const txData = await txRes.json();

    if (!txRes.ok || !txData?.payload?.checkoutUrl) {
      const msg =
        txData?.errors?.map((e: { message?: string }) => e.message).join("; ") ||
        `Error ${txRes.status} al crear la transacción`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: txData.payload.checkoutUrl,
      reference: orderReference,
      total,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
