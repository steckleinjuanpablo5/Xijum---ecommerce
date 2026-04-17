export function notFound(_req, res) {
  return res.status(404).json({ message: 'Recurso no encontrado.' });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  const status = error.status || 500;
  return res.status(status).json({
    message: error.message || 'Ocurrió un error inesperado.',
  });
}
