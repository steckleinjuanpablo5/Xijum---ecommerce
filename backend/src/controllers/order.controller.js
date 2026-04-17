import { query } from '../config/db.js';

export async function getMyOrders(req, res, next) {
  try {
    const ordersResult = await query(
      `SELECT id, order_number, status, payment_status, subtotal, shipping_cost, tax_amount, total, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    const orders = [];
    for (const order of ordersResult.rows) {
      const items = await query(
        `SELECT product_name, unit_price, quantity, line_total
         FROM order_items
         WHERE order_id = $1
         ORDER BY id ASC`,
        [order.id]
      );
      orders.push({ ...order, items: items.rows });
    }

    return res.json({ orders });
  } catch (error) {
    next(error);
  }
}
