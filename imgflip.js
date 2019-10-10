const https = require('https')
const URL = require('url')
const qs = require('qs')
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
const makeCall = (url, type, payload) => {
  return new Promise((res, rej) => {
    throttle(() => {
      switch(type) {
        case 'get':
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
          break
        case 'post':
          const urlobj = URL.parse(url)
          const body = qs.stringify(payload)

          console.log(body)

          const options = {
            protocol: 'https:',
            host: urlobj.host,
            port: 443,
            path: urlobj.path,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': body.length
            }
          }

          const req = https.request(options, resp => {
            resp.setEncoding('utf8')

            resp.on('data', d => {
              res(d)
            })
          })

          req.on('error', err => {
            rej(err)
          })

          // res('{"success":false,"error_message":"No texts specified. Remember, API request params are http parameters not JSON."}')
          // res('{"success":true,"data":{"url":"https:\/\/i.imgflip.com\/3cyq2z.jpg","page_url":"https:\/\/imgflip.com\/i\/3cyq2z"}}')

          req.write(body)
          req.end()
          break
        default:
      }
    })
  })
}

// Cache requests
const cacheCall = async (url, type, cache, payload) => {
  const result = await makeCall(url, type, payload).catch(err => {
    console.log(err)
  })

  if(cache) {
    switch(cache) {
      case 'long':
        longCache.get(url, async (err, val) => {
          if(!err) {
            if(val === undefined) {
              console.log('long cache miss', url)
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

  return result
}

const longCacheCall = async (url, type, payload) => {
  return await cacheCall(url, type, 'long', payload)
}

const shortCacheCall = async (url, type, payload) => {
  return await cacheCall(url, type, 'short', payload)
}

const getMemes = () => {
  const fullLink = baseLink + endpoints.get_memes
  return longCacheCall(fullLink, 'get')
}

const createMeme = (payload) => {
  const fullLink = baseLink + endpoints.caption_mage
  return shortCacheCall(fullLink, 'post', payload)
}

const imgflip = {}

imgflip.getMemes = getMemes
imgflip.createMeme = createMeme

module.exports = imgflip
