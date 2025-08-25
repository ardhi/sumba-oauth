async function factory (pkgName) {
  const me = this

  class SumbaOauth extends this.lib.Plugin {
    static alias = 'oauth'
    static dependencies = ['sumba', 'waibu-mpa']

    constructor () {
      super(pkgName, me.app)
      this.config = {
        waibu: {
          prefix: 'site/oauth'
        },
        provider: {}
      }
    }
  }

  return SumbaOauth
}

export default factory
