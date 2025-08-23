async function factory (pkgName) {
  const me = this

  return class SumbaOauth extends this.lib.Plugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'oauth'
      this.dependencies = ['sumba', 'waibu-mpa']
      this.config = {
        waibu: {
          prefix: 'site/oauth'
        },
        provider: {}
      }
    }
  }
}

export default factory
