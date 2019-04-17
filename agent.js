const SocketClient = require('socket.io-client')

module.exports = function(agent) {
  let tip = null
  let stakeWeight = null
  let feeRate = null

  agent.messenger.on('egg-ready', () => {
    let io = SocketClient(`http://localhost:${agent.config.qtuminfo.port}`)
    io.on('tip', newTip => {
      tip = newTip
      agent.messenger.sendToApp('block-tip', tip)
      agent.messenger.sendRandom('socket/block-tip', tip)
    })
    io.on('block', block => {
      tip = block
      agent.messenger.sendToApp('new-block', block)
      agent.messenger.sendRandom('update-stakeweight')
      agent.messenger.sendRandom('socket/block-tip', block)
    })
    io.on('reorg', block => {
      tip = block
      agent.messenger.sendToApp('reorg-to-block', block)
      agent.messenger.sendRandom('socket/reorg/block-tip', block)
    })
  })

  async function fetchFeeRate() {
    let client = new agent.qtuminfo.rpc(agent.config.qtuminfo.rpc)
    let info = await client.estimatesmartfee(10)
    if (info.feerate) {
      feeRate = info.feerate
    } else if (feeRate == null) {
      feeRate = 0.004
    }
    agent.messenger.sendRandom('socket/feerate', feeRate)
  }

  setInterval(fetchFeeRate, 60 * 1000).unref()

  agent.messenger.on('blockchain-info', () => {
    agent.messenger.sendToApp('blockchain-info', {tip, stakeWeight, feeRate})
  })
  agent.messenger.on('stakeweight', result => {
    stakeWeight = result
  })

  agent.messenger.on('egg-ready', () => {
    let interval = setInterval(() => {
      if (tip && stakeWeight && feeRate) {
        agent.messenger.sendToApp('blockchain-info', {tip, stakeWeight, feeRate})
        clearInterval(interval)
        updateStatistics()
      }
    }, 0)
    agent.messenger.sendRandom('update-stakeweight')
    fetchFeeRate()
  })
}
