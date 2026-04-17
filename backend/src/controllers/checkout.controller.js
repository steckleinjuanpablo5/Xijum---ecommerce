import Stripe from 'stripe';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { buildOrderNumber } from '../utils/helpers.js';

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

export async function createCheckoutSession(req, res, next) {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe no está configurado todavía.' });
    }

    const { items = [], shippingAddress, billingAddress, notes } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Tu carrito está vacío.' });
    }

    const productIds = items.map(item => Number(item.productId)).filter(Boolean);
    const productsResult = await query(
      `SELECT id, name, price, stock
       FROM products
       WHERE id = ANY($1::bigint[]) AND is_active = TRUE`,
      [productIds]
    );

    const productMap = new Map(productsResult.rows.map(product => [Number(product.id), product]));
    const normalizedItems = items.map(item => {
      const dbProduct = productMap.get(Number(item.productId));
      if (!dbProduct) throw new Error('Uno de los productos ya no está disponible.');

      const quantity = Number(item.quantity);
      if (quantity <= 0 || quantity > dbProduct.stock) {
        throw new Error(`Cantidad inválida para ${dbProduct.name}.`);
      }

      return {
        productId: Number(dbProduct.id),
        productName: dbProduct.name,
        unitPrice: Number(dbProduct.price),
        quantity,
        lineTotal: Number(dbProduct.price) * quantity,
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingCost = subtotal >= 999 ? 0 : env.shippingFlatRate;
    const taxAmount = Number((subtotal * env.taxRate).toFixed(2));
    const total = Number((subtotal + shippingCost + taxAmount).toFixed(2));

    const orderInsert = await query(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status, subtotal, shipping_cost, tax_amount, total,
        shipping_address, billing_address, notes
      ) VALUES ($1, $2, 'payment_pending', 'unpaid', $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9)
      RETURNING id`,
      [req.user.id, 'TEMP', subtotal, shippingCost, taxAmount, total, JSON.stringify(shippingAddress), JSON.stringify(billingAddress), notes || null]
    );

    const orderId = orderInsert.rows[0].id;
    const orderNumber = buildOrderNumber(orderId);

    await query('UPDATE orders SET order_number = $1 WHERE id = $2', [orderNumber, orderId]);

    for (const item of normalizedItems) {
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.productId, item.productName, item.unitPrice, item.quantity, item.lineTotal]
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        ...normalizedItems.map(item => ({
          price_data: {
            currency: 'mxn',
            unit_amount: Math.round(item.unitPrice * 100),
            product_data: { name: item.productName },
          },
          quantity: item.quantity,
        })),
        ...(shippingCost > 0 ? [{
          price_data: {
            currency: 'mxn',
            unit_amount: Math.round(shippingCost * 100),
            product_data: { name: 'Envío' },
          },
          quantity: 1,
        }] : []),
        ...(taxAmount > 0 ? [{
          price_data: {
            currency: 'mxn',
            unit_amount: Math.round(taxAmount * 100),
            product_data: { name: 'Impuestos' },
          },
          quantity: 1,
        }] : []),
      ],
      success_url: `${env.frontendUrl}#checkout-success?orderId=${orderId}`,
      cancel_url: `${env.frontendUrl}#cart`,
      metadata: {
        orderId: String(orderId),
        userId: String(req.user.id),
      },
    });

    await query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);

    return res.status(201).json({
      message: 'Sesión de pago creada.',
      checkoutUrl: session.url,
      orderId,
      orderNumber,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleStripeWebhook(req, res, next) {
  try {
    if (!stripe || !env.stripeWebhookSecret) {
      return res.status(500).send('Stripe webhook no configurado.');
    }

    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = Number(session.metadata?.orderId);
      if (orderId) {
        await query(
          `UPDATE orders
           SET status = 'paid',
               payment_status = 'paid',
               stripe_payment_intent = $1
           WHERE id = $2`,
          [session.payment_intent || null, orderId]
        );
      }
    }

    return res.json({ received: true });
  } catch (error) {
    next(error);
  }
}
