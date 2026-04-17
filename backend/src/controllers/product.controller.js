import { query } from '../config/db.js';

export async function getCategories(_req, res, next) {
  try {
    const result = await query(
      'SELECT id, name, slug, description FROM categories ORDER BY name ASC'
    );
    return res.json({ categories: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getProducts(req, res, next) {
  try {
    const { q = '', category = '', sort = 'featured' } = req.query;
    const values = [];
    const conditions = ['p.is_active = TRUE'];

    if (q) {
      values.push(`%${q}%`);
      conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
    }

    if (category) {
      values.push(category);
      conditions.push(`c.slug = $${values.length}`);
    }

    let orderBy = 'p.created_at DESC';
    if (sort === 'price-asc') orderBy = 'p.price ASC';
    if (sort === 'price-desc') orderBy = 'p.price DESC';
    if (sort === 'name-asc') orderBy = 'p.name ASC';

    const sql = `
      SELECT
        p.id, p.name, p.slug, p.sku, p.short_description, p.description,
        p.price, p.compare_at_price, p.stock, p.image_name,
        c.name AS category_name, c.slug AS category_slug,
        COALESCE(AVG(r.rating), 0)::numeric(10,1) AS rating,
        COUNT(r.id)::int AS reviews_count
      FROM products p
      INNER JOIN categories c ON c.id = p.category_id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ${conditions.join(' AND ')}
      GROUP BY p.id, c.name, c.slug
      ORDER BY ${orderBy};
    `;

    const result = await query(sql, values);
    return res.json({ products: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const productResult = await query(
      `SELECT
        p.id, p.name, p.slug, p.sku, p.short_description, p.description,
        p.price, p.compare_at_price, p.stock, p.image_name,
        c.name AS category_name, c.slug AS category_slug,
        COALESCE(AVG(r.rating), 0)::numeric(10,1) AS rating,
        COUNT(r.id)::int AS reviews_count
      FROM products p
      INNER JOIN categories c ON c.id = p.category_id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE p.slug = $1 AND p.is_active = TRUE
      GROUP BY p.id, c.name, c.slug`,
      [slug]
    );

    const product = productResult.rows[0];
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const images = await query(
      'SELECT image_url, alt_text, sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC',
      [product.id]
    );

    const reviews = await query(
      `SELECT r.id, r.rating, r.title, r.comment, r.created_at,
              u.first_name, u.last_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [product.id]
    );

    return res.json({
      product: { ...product, images: images.rows, reviews: reviews.rows },
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    const existing = await query(
      'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [Number(productId), req.user.id]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'Ya dejaste una reseña para este producto.' });
    }

    const result = await query(
      `INSERT INTO reviews (product_id, user_id, rating, title, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, rating, title, comment, created_at`,
      [Number(productId), req.user.id, Number(rating), title.trim(), comment.trim()]
    );

    return res.status(201).json({
      message: 'Gracias por compartir tu opinión.',
      review: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}
