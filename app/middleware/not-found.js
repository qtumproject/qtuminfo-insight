module.exports = () => async function notFound(ctx, next) {
  await next()
  if (ctx.status === 404 && !ctx.body) {
    ctx.body = {
      status: 404,
      url: ctx.originalUrl,
      error: 'Not found'
    }
  }
}
