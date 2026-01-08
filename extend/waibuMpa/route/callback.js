const model = 'SumbaUser'

const responseHandler = async function (response, provider) {
  const { get, isEmpty } = this.app.lib._
  const email = get(response, 'profile.email')
  const body = {
    email,
    firstName: get(response, 'profile.given_name'),
    lastName: get(response, 'profile.family_name'),
    picture: get(response, 'profile.picture')
  }
  if ((isEmpty(body.firstName) || isEmpty(body.lastName)) && !isEmpty(body.name)) {
    const [fname, ...rest] = body.name.split(' ').map(n => n.trim())
    const lname = isEmpty(rest) ? fname : rest.join(' ')
    if (isEmpty(body.firstName)) body.firstName = fname
    if (isEmpty(body.lastName)) body.lastName = lname
  }
  return body
}

const callback = {
  handler: async function (req, reply) {
    const { isEmpty } = this.app.lib._
    const { findOneRecord, createRecord } = this.app.waibuDb
    const { signin, generatePassword } = this.app.sumba
    const { generateId } = this.app.lib.aneka
    const { hash } = this.app.bajoExtra
    const { response, provider } = req.session.grant
    if (response.error) throw this.error(response.error)
    const body = await responseHandler.call(this, response, provider)
    if (isEmpty(body.email)) throw this.error('noEmailFound')
    req.session.grant = null
    const providerName = `oauth-${provider}`
    const options = { dataOnly: true, query: { email: body.email } }
    const user = await findOneRecord({ model, req, reply, options })
    if (user) {
      if (user.provider === providerName) return await signin({ user, req, reply }) // TODO: user is disabled
      throw this.error('emailAlreadyInUse') // TODO: bind oauth with existing login?
    } else {
      if (isEmpty(body.firstName) || isEmpty(body.lastName)) throw this.error('cantGetFirstLastName') // TODO: complete manually
      body.username = await hash(`${providerName}:${body.mail}`)
      body.password = generatePassword(req)
      body.status = 'ACTIVE'
      body.token = generateId()
      body.provider = providerName
      const { data } = await createRecord({ model, req, reply, body, options: { noFlash: true, forceNoHidden: true } })
      return await signin({ user: data, req, reply })
    }
  }
}

export default callback
