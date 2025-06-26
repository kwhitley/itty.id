import { type IRequest, json } from 'itty-router'

type Example = {
  path: string
  response: string
}

interface RouteHelp {
  path: string
  description: string
  parameters?: {
    [key: string]: string
  }
  example?: string | Example
}

// change all examples to length 10
const API_ROUTES: RouteHelp[] = [
  {
    path: '/uuid',
    description: 'Generate UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    path: '/nanoid',
    description: 'Generate nanoid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    path: '/typeid/:prefix?',
    description: 'Generate typeid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    path: '/:length?',
    description: 'Generate alphanumeric hash',
    example: 'A1b2C3d4E5',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/alpha/:length?',
    description: 'Generate alphabetic-only hash',
    example: 'AbCdEfGhIj',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/numeric/:length?',
    description: 'Generate numeric-only hash',
    example: '0542987631',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/uppercase/:length?',
    description: 'Generate uppercase letters only',
    example: 'JHIWEFGDHJ',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/lowercase/:length?',
    description: 'Generate lowercase letters only',
    example: 'jhiwefgdhj',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/uppercase-numeric/:length?',
    description: 'Generate uppercase letters and numbers',
    example: 'A1B2C3D4E5',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/lowercase-numeric/:length?',
    description: 'Generate lowercase letters and numbers',
    example: 'a1b2c3d4e5f',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/alpha-symbols/:length?',
    description: 'Generate letters and symbols',
    example: 'A!b@C#d$',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/only-symbols/:length?',
    description: 'Generate symbols only',
    example: '!@#$%^&*()',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/alpha-numeric/:length?',
    description: 'Generate letters and numbers (alias for root)',
    example: 'A1b2C3d4E5',
    parameters: { length: 'Length of hash (default: 10)' },
  },
  {
    path: '/from/:characters/:length?',
    description: 'Generate hash from custom character set',
    example: {
      path: '/from/ABC',
      response: 'ABACCAACBB',
    },
    parameters: {
      characters: 'Custom character set to use',
      length: 'Length of hash (default: 10)'
    },
  },
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
      if (route.path === '/:length?' && (/^\/\d*$/.test(currentPath) || currentPath === '/')) {
        return true
      }

      if (route.path === '/alpha/:length?' && (/^\/alpha(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/numeric/:length?' && (/^\/numeric(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/uppercase/:length?' && (/^\/uppercase(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/lowercase/:length?' && (/^\/lowercase(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/uppercase-numeric/:length?' && (/^\/uppercase-numeric(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/lowercase-numeric/:length?' && (/^\/lowercase-numeric(?:\/\d)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/alpha-symbols/:length?' && (/^\/alpha-symbols(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/only-symbols/:length?' && (/^\/only-symbols(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/alpha-numeric/:length?' && (/^\/alpha-numeric(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/from/:characters/:length?' && (/^\/from\/[^/]+(?:\/\d*)?$/.test(currentPath))) {
        return true
      }

      if (route.path === '/uuid' && currentPath === '/uuid') {
        return true
      }

      if (route.path === '/nanoid' && currentPath === '/nanoid') {
        return true
      }

      if (route.path === '/typeid/:prefix?' && (/^\/typeid(?:\/\d*)?$/.test(currentPath))) {
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