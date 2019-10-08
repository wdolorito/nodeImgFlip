const https = require('https')
const throttledQueue = require('throttled-queue')
const throttle = throttledQueue(1, 500)               // 1 req/500ms
const NodeCache = require('node-cache')
const longCacheOpts = { stdTTL: 6 * 60,               // cache for 6 minutes
                    checkperiod: 2 * 60,
                    errorOnMissing: false,
                    useClones: true,
                    deleteOnExpire: true }
const longCache = new NodeCache(longCacheOpts)
const shortCacheOpts = { stdTTL: 2 * 60,              // cache for 2 minutes
                    checkperiod: 60,
                    errorOnMissing: false,
                    useClones: true,
                    deleteOnExpire: true }
const shortCache = new NodeCache(shortCacheOpts)

const baseLink = 'https://api.imgflip.com/'

const endpoints = {}

endpoints.get_memes = 'get_memes'                     // GET
endpoints.caption_mage = 'caption_image'              // POST

// Send all API calls through throttledQueue
const makeCall = url => {
  return new Promise((res, rej) => {
    throttle(() => {
      https.get(url, resp => {
        let data = ''
        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          res(data)
        })
      }).on("error", err => {
        console.log("Call Error: " + err.message)
        rej(err)
      })
    })
  })
}

// Cache requests
const cacheCall = async (url, cache) => {
  if(cache) {
    switch(cache) {
      case 'long':
        longCache.get(url, async (err, val) => {
          if(!err) {
            if(val === undefined) {
              console.log('long cache miss', url)
              const result = await makeCall(url).catch(err => {
                console.log(err)
              })
              longCache.set(url, result)
              return result
            } else {
            console.log('long cache hit', url)
            return val
            }
          }
        })
        break
      case 'short':
        shortCache.get(url, async (err, val) => {
          if(!err) {
            if(val === undefined) {
              console.log('short cache miss', url)
              const result = await makeCall(url).catch(err => {
                console.log(err)
              })
              shortCache.set(url, result)
              return result
            } else {
            console.log('short cache hit', url)
            return val
            }
          }
        })
        break
      default:
    }
  }

  return await makeCall(url)
}

const longCacheCall = async (url) => {
  return await cacheCall(url, 'long')
}

const shortCacheCall = async (url) => {
  return await cacheCall(url, 'short')
}

const getMemes = () => {
  const fullLink = baseLink + endpoints.get_memes
  return longCacheCall(fullLink)
}

const imgflip = {}

imgflip.getMemes = getMemes

module.exports = imgflip
