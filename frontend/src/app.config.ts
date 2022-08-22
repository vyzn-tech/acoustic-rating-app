// type RequestHeaders = {
//   authorization?: string
// }

// export default class AppConfiguration {
//   apiEndpoint?: string
//   getRequestHeaders?: any

//   constructor(apiEndpoint: string, getRequestHeaders: any) {
//     this.apiEndpoint = apiEndpoint
//     this.getRequestHeaders = getRequestHeaders
//   }
// }

// TODO: Replace by S
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
