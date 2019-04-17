module.exports = app => {
  const {router, controller, middleware} = app
  const addressMiddleware = middleware.address()
  const contractMiddleware = middleware.contract()
  const paginationMiddleware = middleware.pagination()

  router.get('/status', controller.info.status)
  router.get('/supply', controller.info.supply)
  router.get('/statistics/total-supply', controller.info.supply)
  router.get('/statistics/circulating-supply', controller.info.supply)
  router.get('/utils/estimatefee', controller.info.estimateFee)
  router.get('/utils/minestimatefee', controller.info.estimateFee)

  router.get('/blocks', controller.block.list)
  router.get('/block/:hash', controller.block.block)
  router.get('/rawblock/:hash', controller.block.rawBlock)
  router.get('/block-index/:height', controller.block.recent)

  router.get('/tx/:id', controller.transaction.transaction)
  router.get('/txs', controller.transaction.transactions)
  router.get('/txs/:id/receipt', controller.transaction.transactions)
  router.get('/rawtx/:id', controller.transaction.rawTransaction)
  router.post('/tx/send', controller.transaction.send)

  router.get(
    '/addr/:address',
    addressMiddleware,
    controller.address.summary
  )
  router.get(
    '/addr/:address/balance',
    addressMiddleware,
    controller.address.balance
  )
  router.get(
    '/addr/:address/balance/totalReceived',
    addressMiddleware,
    controller.address.totalReceived
  )
  router.get(
    '/addr/:address/balance/totalSent',
    addressMiddleware,
    controller.address.totalSent
  )
  router.get(
    '/addr/:address/balance/unconfirmedBalance',
    addressMiddleware,
    controller.address.unconfirmedBalance
  )
  router.get(
    '/addr/:address/utxo',
    addressMiddleware,
    controller.address.utxo
  )

  router.get(
    '/contract/:contract',
    contractMiddleware,
    controller.contract.summary
  )
  router.get(
    '/contract/:contract/txs',
    contractMiddleware, paginationMiddleware,
    controller.contract.transactions
  )
  router.get(
    '/contract/:contract/balance-history',
    contractMiddleware, paginationMiddleware,
    controller.contract.balanceHistory
  )
  router.get(
    '/contract/:contract/qrc20-balance-history',
    contractMiddleware, paginationMiddleware,
    controller.contract.qrc20BalanceHistory
  )
  router.get(
    '/searchlogs',
    paginationMiddleware,
    controller.contract.searchLogs
  )
  router.get(
    '/qrc20',
    paginationMiddleware,
    controller.qrc20.list
  )
  router.get(
    '/qrc20/:contract/rich-list',
    contractMiddleware, paginationMiddleware,
    controller.qrc20.richList
  )
  router.get(
    '/qrc721',
    paginationMiddleware,
    controller.qrc721.list
  )
}
