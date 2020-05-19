# nodejs app using socket.io to access an external API

### Packages used:
- [nodejs](https://nodejs.org/en/) whatever is LTS (v10.x+)
- [expressjs](https://expressjs.com) v4.17.1
- [Materializecss](https://archives.materializecss.com/0.100.2/) v0.100.2
- [gmail-send](https://github.com/alykoshin/gmail-send) v1.8.10
- [node-cache](https://github.com/node-cache/node-cache) v4.2.1
- [qs](https://github.com/ljharb/qs) v6.9.4
- [socket.io](https://github.com/socketio/socket.io#readme) v2.3.0
- [throttled-queue](https://github.com/shaunpersad/throttled-queue#readme) v1.0.7

### Assets from:
- https://unsplash.com
- 404 error image by [Rémi Jacquaint](https://unsplash.com/@jack_1?utm_medium=referral&utm_campaign=photographer-credit&utm_content=creditBadge)
- 'doge' site icon from https://icons8.com/
- API is the public https://api.imgflip.com

## Briefly

- "Meme"able images found from ImgFlip site and cached.
- Form will take input from user to label meme.
- Meme shows up after pressing __CREATE__ with link to copy/paste and image.
- Profit!!!!

## A little longer...
IDs and images to be meme'd are cached for 6 minutes using `node-cache`.  Created memes are cached for 2 minutes.  API calls are made on the server using `socketio` with `qs` helping out.  The form has a radio button to enable saving to an ImgFlip account if desired.  At the very bottom of the page, a modal dialog opens to send a short message using `gmail-send`.  All of this is dressed up using `Materializecss`, since this one page site wasn't too complicated.

## Configuratoring
The port this app shows up on can be changed in the `port` file.  Visit https://myaccount.google.com/apppasswords to create a password to be used with this app, then take that password and create a `gmail-credentials.json` file with the following format:
```sh
{
  "user": "aUser@gmail.com",
  "pass": "abcdefghijklmnop"
}
```
