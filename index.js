/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * SumbaOauth class
   *
   * @class
   */
  class SumbaOauth extends this.app.pluginClass.base {
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
