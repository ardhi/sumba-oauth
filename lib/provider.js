export default {
  defaults: {
    transport: 'session'
  },
  google: {
    scope: ['openid', 'profile', 'email'],
    response: ['tokens', 'profile']
  },
  linkedin: {
    scope: ['openid', 'profile', 'email'],
    response: ['tokens', 'profile'],
    profile_url: 'https://api.linkedin.com/v2/userinfo'
  },
  facebook: {
    scope: ['openid', 'email', 'public_profile'],
    response: ['tokens', 'profile']
  }
}
