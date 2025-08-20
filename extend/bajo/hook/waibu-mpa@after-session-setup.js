import defProviders from '../../lib/provider.js'
import Grant from 'grant/lib/grant.js'
import qs from 'qs'

async function afterSessionSetup (ctx) {
  const { merge, omit } = this.lib._
  const { getOrigin } = this.app.waibu
  let config = merge({}, this.config.provider, defProviders)
  config.defaults.prefix = `/${this.config.waibu.prefix}`
  const deleted = []
  for (const key in config) {
    if (!defProviders[key]) {
      deleted.push(key)
      continue
    }
    const item = config[key]
    item.key = item.key + ''
    item.secret = item.secret + ''
    item.callback = `${config.defaults.prefix}/callback`
  }
  config = omit(config, deleted)

  async function handler (req, res) {
    if (!req.session) {
      throw new Error('Grant: register session plugin first')
    }

    config.defaults.origin = getOrigin(req)
    const grant = Grant({ config })

    const { location, session, state } = await grant({
      method: req.method,
      params: req.params,
      query: qs.parse(req.query),
      body: qs.parse(req.body),
      state: req.grant,
      session: req.session.grant
    })

    req.session.grant = session
    res.grant = state
    return location ? res.redirect(location) : res.send()
  }

  ctx.route({
    method: ['GET', 'POST'],
    path: `${config.defaults.prefix}/:provider`,
    handler
  })
  ctx.route({
    method: ['GET', 'POST'],
    path: `${config.defaults.prefix}/:provider/:override`,
    handler
  })
}

export default afterSessionSetup
