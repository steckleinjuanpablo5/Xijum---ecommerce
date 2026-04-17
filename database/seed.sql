-- Categorías
INSERT INTO categories (name, slug, description) VALUES ('Agendas', 'agendas', 'Agenda tus días con intención y estilo.');
INSERT INTO categories (name, slug, description) VALUES ('Planners', 'planners', 'Organización flexible y visual para cada objetivo.');
INSERT INTO categories (name, slug, description) VALUES ('Libretas', 'libretas', 'Escribe, crea y documenta cada idea.');
INSERT INTO categories (name, slug, description) VALUES ('Stickers', 'stickers', 'Añade color y personalidad a tu rutina.');
INSERT INTO categories (name, slug, description) VALUES ('Papelería', 'papeleria', 'Pequeños esenciales con mucho encanto.');
INSERT INTO categories (name, slug, description) VALUES ('Accesorios', 'accesorios', 'Detalles prácticos para tu espacio.');
INSERT INTO categories (name, slug, description) VALUES ('Regalos', 'regalos', 'Obsequios cálidos y memorables.');

-- Usuarios demo
INSERT INTO users (first_name, last_name, email, password_hash, role, phone) VALUES
('Admin', 'Xijúm', 'admin@xijum.com', crypt('Admin12345!', gen_salt('bf')), 'admin', '4770000000'),
('Cliente', 'Demo', 'cliente@xijum.com', crypt('Cliente12345!', gen_salt('bf')), 'customer', '4771111111');

-- Productos
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'agendas'),
  'Agenda semanal',
  'agenda-semanal',
  'XIJ-001',
  'Agenda semanal con distribución práctica para organizar objetivos, pendientes y citas. Ideal para quienes buscan una vista completa de cada semana.',
  'Planifica tu semana con estilo y claridad.',
  500.00,
  590.00,
  37,
  TRUE,
  'agenda.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'agenda-semanal'), './public/images/categories/agenda.svg', 'Agenda semanal de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'agendas'),
  'Agenda diaria',
  'agenda-diaria',
  'XIJ-002',
  'Agenda diaria pensada para jornadas intensas, con espacio generoso para tareas, notas y recordatorios importantes.',
  'Control detallado de cada día.',
  665.00,
  784.70,
  24,
  TRUE,
  'agenda.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'agenda-diaria'), './public/images/categories/agenda.svg', 'Agenda diaria de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'agendas'),
  'Agenda citas',
  'agenda-citas',
  'XIJ-003',
  'Agenda diseñada para organizar citas, bloques de atención y seguimiento de clientes de forma ordenada y elegante.',
  'Perfecta para profesionales y servicios con agenda llena.',
  550.00,
  649.00,
  40,
  TRUE,
  'agenda.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'agenda-citas'), './public/images/categories/agenda.svg', 'Agenda citas de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'planners'),
  'Planner mini',
  'planner-mini',
  'XIJ-004',
  'Planner compacto para llevar en bolsa o mochila, ideal para registrar metas, tareas rápidas y prioridades del día.',
  'Pequeño en tamaño, grande en organización.',
  250.00,
  295.00,
  34,
  TRUE,
  'planner.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'planner-mini'), './public/images/categories/planner.svg', 'Planner mini de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'agendas'),
  'Agenda docentes',
  'agenda-docentes',
  'XIJ-005',
  'Agenda especializada para docentes, útil para planear clases, actividades, evaluaciones y seguimiento académico.',
  'Hecha para el ritmo de maestras y maestros.',
  520.00,
  613.60,
  25,
  TRUE,
  'agenda.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'agenda-docentes'), './public/images/categories/agenda.svg', 'Agenda docentes de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'agendas'),
  'Agenda mini',
  'agenda-mini',
  'XIJ-006',
  'Agenda de formato reducido que conserva practicidad y diseño cálido para acompañarte todos los días.',
  'La versión compacta para organizarte donde estés.',
  350.00,
  413.00,
  15,
  TRUE,
  'agenda.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'agenda-mini'), './public/images/categories/agenda.svg', 'Agenda mini de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'agendas'),
  'Agenda emprendedores',
  'agenda-emprendedores',
  'XIJ-007',
  'Agenda orientada a emprendedores que necesitan estructurar tareas, ventas, reuniones y objetivos semanales.',
  'Pensada para ideas, metas y seguimiento del negocio.',
  490.00,
  578.20,
  37,
  TRUE,
  'agenda.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'agenda-emprendedores'), './public/images/categories/agenda.svg', 'Agenda emprendedores de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta hojas blancas',
  'libreta-hojas-blancas',
  'XIJ-008',
  'Libreta con hojas blancas ideal para escribir, bocetar, dibujar o documentar ideas con libertad total.',
  'Creatividad sin límites.',
  220.00,
  259.60,
  40,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-hojas-blancas'), './public/images/categories/libreta.svg', 'Libreta hojas blancas de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta hojas de raya',
  'libreta-hojas-de-raya',
  'XIJ-009',
  'Libreta rayada con formato clásico, excelente para apuntes, journaling, trabajo y estudio.',
  'Para notas limpias y ordenadas.',
  280.00,
  330.40,
  45,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-hojas-de-raya'), './public/images/categories/libreta.svg', 'Libreta hojas de raya de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta journal',
  'libreta-journal',
  'XIJ-010',
  'Libreta estilo journal para organizar pensamientos, registros personales, seguimiento de hábitos o planificación flexible.',
  'Tu espacio para hábitos, reflexiones y creatividad.',
  310.00,
  365.80,
  38,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-journal'), './public/images/categories/libreta.svg', 'Libreta journal de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta chica',
  'libreta-chica',
  'XIJ-011',
  'Libreta compacta para notas rápidas, pendientes y recordatorios cotidianos.',
  'Práctica y ligera para llevar a todos lados.',
  140.00,
  165.20,
  22,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-chica'), './public/images/categories/libreta.svg', 'Libreta chica de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta chica crema',
  'libreta-chica-crema',
  'XIJ-012',
  'Libreta pequeña con hojas tono crema que aporta una experiencia visual agradable y elegante al escribir.',
  'Pequeña, cálida y con papel suave a la vista.',
  125.00,
  147.50,
  17,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-chica-crema'), './public/images/categories/libreta.svg', 'Libreta chica crema de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta mini',
  'libreta-mini',
  'XIJ-013',
  'Formato mini perfecto para listas rápidas, notas breves o detalles que no se te pueden escapar.',
  'La libreta más portable del catálogo.',
  45.00,
  53.10,
  28,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-mini'), './public/images/categories/libreta.svg', 'Libreta mini de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta cosida',
  'libreta-cosida',
  'XIJ-014',
  'Libreta cosida con acabado artesanal, ideal para uso diario y proyectos personales.',
  'Sencilla, resistente y encantadora.',
  80.00,
  94.40,
  31,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-cosida'), './public/images/categories/libreta.svg', 'Libreta cosida de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta post it',
  'libreta-post-it',
  'XIJ-015',
  'Formato funcional para quienes aman marcar ideas, pendientes y mensajes rápidos con practicidad.',
  'Notas adhesivas siempre a la mano.',
  65.00,
  76.70,
  32,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-post-it'), './public/images/categories/libreta.svg', 'Libreta post it de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'libretas'),
  'Libreta post it chica',
  'libreta-post-it-chica',
  'XIJ-016',
  'Una libreta pequeña y funcional para acompañar tu día con recordatorios inmediatos y visibles.',
  'Versión compacta para notas rápidas.',
  45.00,
  53.10,
  33,
  TRUE,
  'libreta.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'libreta-post-it-chica'), './public/images/categories/libreta.svg', 'Libreta post it chica de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'regalos'),
  'Adventure book',
  'adventure-book',
  'XIJ-017',
  'Libro de aventuras para documentar experiencias, fotos, memorias y momentos inolvidables.',
  'Guarda recuerdos, viajes e historias especiales.',
  500.00,
  590.00,
  38,
  TRUE,
  'regalo.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'adventure-book'), './public/images/categories/regalo.svg', 'Adventure book de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'papeleria'),
  'Tarjetas',
  'tarjetas',
  'XIJ-018',
  'Tarjetas versátiles para regalos, agradecimientos, notas especiales o detalles creativos.',
  'Pequeños mensajes con gran intención.',
  30.00,
  35.40,
  22,
  TRUE,
  'papeleria.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'tarjetas'), './public/images/categories/papeleria.svg', 'Tarjetas de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'regalos'),
  'Juego',
  'juego',
  'XIJ-019',
  'Juego pensado para momentos de convivencia, ideal como regalo creativo y memorable.',
  'Un producto divertido para compartir.',
  290.00,
  342.20,
  29,
  TRUE,
  'regalo.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'juego'), './public/images/categories/regalo.svg', 'Juego de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'accesorios'),
  'Portaretratos',
  'portaretratos',
  'XIJ-020',
  'Portarretratos decorativo para exhibir fotos y darle calidez a cualquier espacio.',
  'Tus recuerdos favoritos en un lugar especial.',
  280.00,
  330.40,
  33,
  TRUE,
  'accesorio.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'portaretratos'), './public/images/categories/accesorio.svg', 'Portaretratos de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'stickers'),
  'Stickers Planilla',
  'stickers-planilla',
  'XIJ-021',
  'Planilla de stickers para planners, agendas y libretas. Perfecta para destacar tareas y eventos.',
  'Organiza con color y personalidad.',
  40.00,
  47.20,
  12,
  TRUE,
  'stickers.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'stickers-planilla'), './public/images/categories/stickers.svg', 'Stickers Planilla de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'stickers'),
  'Stickers 10 pack',
  'stickers-10-pack',
  'XIJ-022',
  'Paquete de 10 stickers para personalizar tus productos de papelería con estilo.',
  'Más variedad para decorar tu organización.',
  35.00,
  41.30,
  36,
  TRUE,
  'stickers.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'stickers-10-pack'), './public/images/categories/stickers.svg', 'Stickers 10 pack de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'accesorios'),
  'Organizador escritorio',
  'organizador-escritorio',
  'XIJ-023',
  'Organizador de escritorio para mantener útiles, notas y accesorios siempre ordenados y a la vista.',
  'Todo en su lugar, sobre tu mesa.',
  365.00,
  430.70,
  19,
  TRUE,
  'accesorio.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'organizador-escritorio'), './public/images/categories/accesorio.svg', 'Organizador escritorio de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'planners'),
  'Planner carta',
  'planner-carta',
  'XIJ-024',
  'Planner tamaño carta para visualizar objetivos, tareas y actividades con más comodidad.',
  'Espacio amplio para una planeación completa.',
  220.00,
  259.60,
  35,
  TRUE,
  'planner.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'planner-carta'), './public/images/categories/planner.svg', 'Planner carta de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'planners'),
  'Planner media carta',
  'planner-media-carta',
  'XIJ-025',
  'Planner media carta ideal para quienes necesitan planear sin cargar demasiado volumen.',
  'Balance perfecto entre tamaño y practicidad.',
  140.00,
  165.20,
  35,
  TRUE,
  'planner.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'planner-media-carta'), './public/images/categories/planner.svg', 'Planner media carta de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'papeleria'),
  'Separadores de imán',
  'separadores-de-iman',
  'XIJ-026',
  'Separadores imantados funcionales y bonitos para agendas, libros y libretas.',
  'Marca tus páginas favoritas con estilo.',
  60.00,
  70.80,
  15,
  TRUE,
  'papeleria.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'separadores-de-iman'), './public/images/categories/papeleria.svg', 'Separadores de imán de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'papeleria'),
  'Calendario Refri',
  'calendario-refri',
  'XIJ-027',
  'Calendario para refrigerador, ideal para tareas, menús, pendientes y recordatorios familiares.',
  'Organización visible para toda la casa.',
  40.00,
  47.20,
  33,
  TRUE,
  'papeleria.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'calendario-refri'), './public/images/categories/papeleria.svg', 'Calendario Refri de Xijúm', 0);
INSERT INTO products (
  category_id, name, slug, sku, description, short_description, price, compare_at_price, stock, is_active, image_name
) VALUES (
  (SELECT id FROM categories WHERE slug = 'planners'),
  'Planner mensual',
  'planner-mensual',
  'XIJ-028',
  'Planner mensual para objetivos, eventos y seguimiento general de actividades importantes.',
  'Visualiza el mes de un vistazo.',
  140.00,
  165.20,
  35,
  TRUE,
  'planner.svg'
);
INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
VALUES ((SELECT id FROM products WHERE slug = 'planner-mensual'), './public/images/categories/planner.svg', 'Planner mensual de Xijúm', 0);

-- Reseñas demo
INSERT INTO reviews (product_id, user_id, rating, title, comment)
VALUES (
  (SELECT id FROM products WHERE slug = 'agenda-semanal'),
  (SELECT id FROM users WHERE email = 'cliente@xijum.com'),
  5,
  'Hermosa y práctica',
  'La calidad se siente desde que la abres. Me ayudó mucho a organizar mi semana.'
);
INSERT INTO reviews (product_id, user_id, rating, title, comment)
VALUES (
  (SELECT id FROM products WHERE slug = 'libreta-journal'),
  (SELECT id FROM users WHERE email = 'cliente@xijum.com'),
  5,
  'Muy linda',
  'El papel se siente increíble y el diseño está precioso.'
);
INSERT INTO reviews (product_id, user_id, rating, title, comment)
VALUES (
  (SELECT id FROM products WHERE slug = 'planner-carta'),
  (SELECT id FROM users WHERE email = 'cliente@xijum.com'),
  4,
  'Muy útil',
  'Tiene muy buen espacio para organizar tareas y pendientes.'
);
INSERT INTO reviews (product_id, user_id, rating, title, comment)
VALUES (
  (SELECT id FROM products WHERE slug = 'organizador-escritorio'),
  (SELECT id FROM users WHERE email = 'cliente@xijum.com'),
  5,
  'Ideal para mi escritorio',
  'Se ve bonito y de verdad ayuda a mantener todo ordenado.'
);
