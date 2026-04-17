import { query } from '../config/db.js';

export async function getDashboard(_req, res, next) {
  try {
    const [orders, revenue, users, products] = await Promise.all([
      query("SELECT COUNT(*)::int AS total FROM orders"),
      query("SELECT COALESCE(SUM(total), 0)::numeric(10,2) AS total FROM orders WHERE payment_status = 'paid'"),
      query("SELECT COUNT(*)::int AS total FROM users"),
      query("SELECT COUNT(*)::int AS total FROM products WHERE is_active = TRUE"),
    ]);

    return res.json({
      metrics: {
        orders: orders.rows[0].total,
        revenue: revenue.rows[0].total,
        users: users.rows[0].total,
        activeProducts: products.rows[0].total,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(_req, res, next) {
  try {
    const result = await query(
      `SELECT o.id, o.order_number, o.status, o.payment_status, o.total, o.created_at,
              u.first_name, u.last_name, u.email
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    return res.json({ orders: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, order_number, status',
      [status, Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado.' });
    }
    return res.json({ message: 'Estado actualizado.', order: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function listProducts(_req, res, next) {
  try {
    const result = await query(
      `SELECT p.id, p.name, p.slug, p.sku, p.price, p.stock, p.is_active, p.image_name, c.slug AS category_slug
       FROM products p
       INNER JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`
    );
    return res.json({ products: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { categorySlug, name, slug, sku, description, shortDescription, price, stock, imageName } = req.body;
    const result = await query(
      `INSERT INTO products (
         category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
       ) VALUES (
         (SELECT id FROM categories WHERE slug = $1),
         $2, $3, $4, $5, $6, $7, $8, $9, TRUE, $10
       )
       RETURNING id, name, slug, sku, price, stock, image_name`,
      [categorySlug, name, slug, sku, description, shortDescription, price, Number(price) * 1.18, stock, imageName]
    );
    return res.status(201).json({ message: 'Producto creado.', product: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { categorySlug, name, slug, sku, description, shortDescription, price, stock, imageName, isActive } = req.body;
    const result = await query(
      `UPDATE products SET
         category_id = (SELECT id FROM categories WHERE slug = $1),
         name = $2,
         slug = $3,
         sku = $4,
         description = $5,
         short_description = $6,
         price = $7,
         compare_at_price = $8,
         stock = $9,
         image_name = $10,
         is_active = $11
       WHERE id = $12
       RETURNING id, name, slug, sku, price, stock, image_name, is_active`,
      [categorySlug, name, slug, sku, description, shortDescription, price, Number(price) * 1.18, stock, imageName, Boolean(isActive), Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    return res.json({ message: 'Producto actualizado.', product: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [Number(req.params.id)]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    return res.json({ message: 'Producto eliminado.' });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const result = await query(
      'SELECT id, first_name, last_name, email, role, phone, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, first_name, last_name, email, role',
      [req.body.role, Number(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    return res.json({ message: 'Rol actualizado.', user: result.rows[0] });
  } catch (error) {
    next(error);
  }
}
