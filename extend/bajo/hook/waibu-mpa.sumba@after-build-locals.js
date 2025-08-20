async function afterBuildLocals (locals, req) {
  if (!this.app.sumbaOauth) return
  locals.oauthProviders = Object.keys(this.app.sumbaOauth.config.provider)
}

export default afterBuildLocals
