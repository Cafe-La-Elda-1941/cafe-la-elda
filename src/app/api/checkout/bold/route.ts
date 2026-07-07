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

interface BoldLinkResponse {
  payload?: {
    payment_link: string;
    url: string;
  };
  errors?: Array<{ message?: string }>;
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
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BOLD_API_KEY;
    if (!apiKey || apiKey === "pon_aqui_tu_llave_de_identidad_de_bold") {
      return NextResponse.json(
        {
          error:
            "Falta configurar BOLD_API_KEY en el archivo .env con la llave de identidad de Bold.",
        },
        { status: 500 }
      );
    }

    // Validar el carrito contra los precios oficiales del servidor.
    // Esto evita la manipulación de precios desde el cliente.
    const { lines: verifiedLines, total } = await verifyCart(items);

    if (total < 1000) {
      return NextResponse.json(
        { error: "El monto mínimo para pagar con tarjeta es $1.000 COP." },
        { status: 400 }
      );
    }

    let orderReference = `cafe-la-elda-${Date.now()}`;
    try {
      const order = await prisma.order.create({
        data: {
          customerName: customerName ? String(customerName).slice(0, 200) : "Cliente Bold",
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
      // si la BD no está disponible, igual generamos el link con una referencia temporal
    }

    const description = `Pedido Café La Elda 1941 (Ref: ${orderReference})`;

    const boldResponse = await fetch(
      "https://integrations.api.bold.co/online/link/v1",
      {
        method: "POST",
        headers: {
          Authorization: `x-api-key ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount_type: "CLOSE",
          amount: {
            currency: "COP",
            total_amount: total,
            tip_amount: 0,
          },
          description,
          reference: orderReference,
        }),
      }
    );

    const data: BoldLinkResponse = await boldResponse.json();

    if (!boldResponse.ok || !data.payload?.url) {
      const msg =
        data.errors?.map((e) => e.message).join("; ") ||
        `Error ${boldResponse.status} al crear el link de pago`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: data.payload.url,
      reference: orderReference,
      total,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
