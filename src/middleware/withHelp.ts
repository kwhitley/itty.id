import { type IRequest, json } from 'itty-router'

interface RouteHelp {
  path: string
  description: string
  parameters?: {
    [key: string]: string
  }
  example?: {
    path: string
    response: string
  }
}

const API_ROUTES: RouteHelp[] = [
  {
    path: '/:length?',
    description: 'Generate alphanumeric hash',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/15', response: 'A1b2C3d4E5f6G7h' }
  },
  {
    path: '/alpha/:length?',
    description: 'Generate alphabetic-only hash',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/alpha/8', response: 'AbCdEfGh' }
  },
  {
    path: '/numeric/:length?',
    description: 'Generate numeric-only hash',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/numeric/6', response: '123456' }
  },
  {
    path: '/uppercase/:length?',
    description: 'Generate uppercase letters only',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/uppercase/5', response: 'ABCDE' }
  },
  {
    path: '/lowercase/:length?',
    description: 'Generate lowercase letters only',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/lowercase/12', response: 'abcdefghijkl' }
  },
  {
    path: '/uppercase-numeric/:length?',
    description: 'Generate uppercase letters and numbers',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/uppercase-numeric/8', response: 'A1B2C3D4' }
  },
  {
    path: '/lowercase-numeric/:length?',
    description: 'Generate lowercase letters and numbers',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/lowercase-numeric/10', response: 'a1b2c3d4e5' }
  },
  {
    path: '/alpha-symbols/:length?',
    description: 'Generate letters and symbols',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/alpha-symbols/7', response: 'A!b@C#d' }
  },
  {
    path: '/only-symbols/:length?',
    description: 'Generate symbols only',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/only-symbols/4', response: '!@#$' }
  },
  {
    path: '/alpha-numeric/:length?',
    description: 'Generate letters and numbers (alias for root)',
    parameters: { length: 'Length of hash (default: 10)' },
    example: { path: '/alpha-numeric/9', response: 'A1b2C3d4E' }
  },
  {
    path: '/from/:characters/:length?',
    description: 'Generate hash from custom character set',
    parameters: {
      characters: 'Custom character set to use',
      length: 'Length of hash (default: 10)'
    },
    example: { path: '/from/ABC/10', response: 'ABCCCAACBB' }
  }
]

export const withHelp = (req: IRequest) => {
  if (req.query.help !== undefined) {
    const url = new URL(req.url)
    const currentPath = url.pathname

    if (currentPath === '/' || currentPath === '') {
      return json({
        service: 'itty.id - Random Hash Generation API',
        usage: 'Add ?help to any endpoint for specific help',
        routes: API_ROUTES
      })
    }

    const matchedRoute = API_ROUTES.find(route => {
      if (route.path === '/:length?' && (/^\/\d+$/.test(currentPath) || currentPath === '/')) {
        return true
      }

      if (route.path === '/alpha/:length?' && (/^\/alpha(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/numeric/:length?' && (/^\/numeric(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/uppercase/:length?' && (/^\/uppercase(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/lowercase/:length?' && (/^\/lowercase(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/uppercase-numeric/:length?' && (/^\/uppercase-numeric(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/lowercase-numeric/:length?' && (/^\/lowercase-numeric(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/alpha-symbols/:length?' && (/^\/alpha-symbols(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/only-symbols/:length?' && (/^\/only-symbols(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/alpha-numeric/:length?' && (/^\/alpha-numeric(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/from/:characters/:length?' && (/^\/from\/[^/]+(?:\/\d+)?$/.test(currentPath))) {
        return true
      }

      return false
    })

    if (matchedRoute) {
      return json({
        ...matchedRoute,
        query: {
          help: 'Show this help message',
          length: 'Length of hash (default: 10)'
        }
      })
    }

    return json({
      error: 'Route not found',
      availableRoutes: API_ROUTES.map(r => r.path)
    })
  }
}