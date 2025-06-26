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
    path: '/?help',
    description: 'Show this help message',
    example: 'https://itty.id/?help',
  },
  {
    path: '/:length?',
    description: 'Generate alphanumeric (itty) hash, starting with a letter',
    example: 'A1b2C3d4E5',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/uuid',
    description: 'Generate UUID v4',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    path: '/uuid/v4',
    description: 'Generate UUID v4',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    path: '/uuid/v5/:value/:namespace?',
    description: 'Generate UUID v5',
    example: '123e4567-e89b-12d3-a456-426614174000',
    parameters: {
      value: 'String value to hash',
      namespace: 'Namespace for v5 UUIDs (default: uuid.v5.URL)',
    },
  },
  {
    path: '/uuid/v6',
    description: 'Generate UUID v6',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    path: '/uuid/v7',
    description: 'Generate UUID v7',
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
    path: '/alpha/:length?',
    description: 'Generate alphabetic-only hash',
    example: 'AbCdEfGhIj',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/numeric/:length?',
    description: 'Generate numeric-only hash',
    example: '0542987631',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/uppercase/:length?',
    description: 'Generate uppercase letters only',
    example: 'JHIWEFGDHJ',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/lowercase/:length?',
    description: 'Generate lowercase letters only',
    example: 'jhiwefgdhj',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/uppercase-numeric/:length?',
    description: 'Generate uppercase letters and numbers',
    example: 'A1B2C3D4E5',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/lowercase-numeric/:length?',
    description: 'Generate lowercase letters and numbers',
    example: 'a1b2c3d4e5f',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/alpha-symbols/:length?',
    description: 'Generate letters and symbols',
    example: 'A!b@C#d$',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/only-symbols/:length?',
    description: 'Generate symbols only',
    example: '!@#$%^&*()',
    parameters: { length: 'Length of hash (default 8)' },
  },
  {
    path: '/alpha-numeric/:length?',
    description: 'Generate letters and numbers (alias for root)',
    example: 'A1b2C3d4E5',
    parameters: { length: 'Length of hash (default 8)' },
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
      length: 'Length of hash (default 8)'
    },
  },
]

export const JUST_ROUTES = API_ROUTES.map(r => r.path)

export const withHelp = (req: IRequest) => {
  if (req.query.help !== undefined) {
    return {
      service: 'itty.id - Random Hash Generation API',
      usage: 'Add ?help to any endpoint for specific help',
      routes: API_ROUTES
    }
  }
}