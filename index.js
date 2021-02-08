// Each type of email has a provider assigned.
const channels = {}

const providers = {}

module.exports = {
  setup: (allOptions, ) => {
    // set up providers
  
    Object.keys(channelMap).forEach(key => {
      const providerKey = channelMap[key]
      const providerOptions = allOptions[providerKey]

      if (!provider) {
        strapi.logger.error(`Unknown email provider: ${providerKey}. Using console instead.`)
      }

      channels[key] = providerKey || allOptions.console
    })

    console.log({ channels })
  },

  init: (providerOptions = {}, settings = {}) => {
  
    // Init all providers.
    Object.keys(providerOptions.providers).forEach(key => {
      console.log('set up', key, providerOptions.providers[key])
      providers[key] = providerOptions.init[key](
        providerOptions.providers[key],
        settings
      )
    })
  
    // Nominate the default provider
    providers.default = providers[providerOptions.default]

    // Set up channels.
    Object.keys(providerOptions.channels).forEach(channelKey => {
      const providerKey = providerOptions.channels[channelKey]
      const provider = providers[providerKey]
      if (!provider) {
        strapi.logger.error(`Unknown email provider: ${providerKey}. Using default.`)
      }

      channels[channelKey] = provider || providers.default
    })

    return {
      send: (options) => {
        const { channel } = options

        const provider = channels[channel]

        if (!provider) {
          strapi.logger.error(`No provider for email channel: ${channel}. Using default.`)
        }

        return (provider || providers.default).send(options)
      }
    }
  },
}
