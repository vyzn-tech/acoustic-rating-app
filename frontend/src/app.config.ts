type Configuration = {
  apiEndpoint?: string
  getRequestHeaders?: any
}

const appConfiguration: Configuration = {
  apiEndpoint: '/api',
  getRequestHeaders: async () => {
    return {}
  },
}

export const loadConfiguration = (configuration: Configuration): Configuration => {
  let key: keyof typeof appConfiguration
  for (key in appConfiguration) {
    if (configuration.hasOwnProperty(key)) {
      appConfiguration[key] = configuration[key]
    }
  }
  return appConfiguration
}

export default appConfiguration
