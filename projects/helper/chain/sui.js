
const sdk = require('@defillama/sdk')

const http = require('../http')
const env = require('../env')
const { transformDexBalances } = require('../portedTokens')

//https://docs.sui.io/sui-jsonrpc

const endpoint = env.SUI_RPC || "https://fullnode.mainnet.sui.io/"

async function getObject(objectId) {
  return (await call('sui_getObject', [objectId, {
    "showType": true,
    "showOwner": true,
    "showContent": true,
  }])).content
}

async function queryEvents(queryObject) {
  return call('suix_queryEvents', queryObject)
}

async function getObjects(objectIds) {
  const {
    result
  } = await http.post(endpoint, {
    jsonrpc: "2.0", id: 1, method: 'sui_multiGetObjects', params: [objectIds, {
      "showType": true,
      "showOwner": true,
      "showContent": true,
    }],
  })
  return objectIds.map(i => result.find(j => j.data.objectId === i)?.data?.content)
}

async function getDynamicFieldObject(parent, id) {
  return (await call('suix_getDynamicFieldObject', [parent, {
    "type": "0x2::object::ID",
    "value": id
  }])).content
}

async function getDynamicFieldObjects({ parent, cursor = null, limit = 48, items = [], idFilter = i => i, addedIds = new Set() }) {
  const {
    result: { data, hasNextPage, nextCursor }
  } = await http.post(endpoint, { jsonrpc: "2.0", id: 1, method: 'suix_getDynamicFields', params: [parent, cursor, limit], })
  sdk.log('[sui] fetched items length', data.length, hasNextPage, nextCursor)
  const fetchIds = data.filter(idFilter).map(i => i.objectId).filter(i => !addedIds.has(i))
  fetchIds.forEach(i => addedIds.add(i))
  const objects = await getObjects(fetchIds)
  items.push(...objects)
  if (!hasNextPage) return items
  return getDynamicFieldObjects({ parent, cursor: nextCursor, items, limit, idFilter, addedIds })
}

async function call(method, params) {
  if (!Array.isArray(params)) params = [params]
  const {
    result: { data }
  } = await http.post(endpoint, { jsonrpc: "2.0", id: 1, method, params, })
  return data
}

async function multiCall(calls) {
  return Promise.all(calls.map(i => call(...i)))
}


function dexExport({
  account,
  poolStr,
  token0Reserve = i => i.fields.coin_x_reserve,
  token1Reserve = i => i.fields.coin_y_reserve,
  getTokens = i => i.type.split('<')[1].replace('>', '').split(', '),
  isAMM = true,
}) {
  return {
    timetravel: false,
    misrepresentedTokens: true,
    sui: {
      tvl: async (_, _1, _2, { api }) => {
        const data = []
        let pools = await getDynamicFieldObjects({ parent: account, idFilter: i => poolStr ? i.objectType.includes(poolStr) : i })
        sdk.log(`[sui] Number of pools: ${pools.length}`)
        pools.forEach(i => {
          const [token0, token1] = getTokens(i)
          if (isAMM) {
            data.push({
              token0,
              token1,
              token0Bal: token0Reserve(i),
              token1Bal: token1Reserve(i),
            })
          } else {
            api.add(token0, token0Reserve(i))
            api.add(token1, token1Reserve(i))
          }
        })

        if (!isAMM) return api.getBalances()

        return transformDexBalances({ chain: 'sui', data })
      }
    }
  }
}

module.exports = {
  endpoint,
  call,
  multiCall,
  getObject,
  getObjects,
  queryEvents,
  getDynamicFieldObject,
  getDynamicFieldObjects,
  dexExport,
};
