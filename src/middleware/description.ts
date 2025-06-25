import { type IRequest } from 'itty-router'

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

const registeredRoutes = new Map<string, RouteHelp>()

export const description = (desc: string, parameters?: { [key: string]: string }, exampleResponse?: string) => {
  return (req: IRequest) => {
    if (req.route) {
      const route: RouteHelp = {
        path: req.route,
        description: desc,
        parameters,
        example: exampleResponse ? {
          path: generateExamplePath(req.route),
          response: exampleResponse
        } : undefined
      }
      registeredRoutes.set(req.route, route)
    }
  }
}

export const getRegisteredRoutes = (): RouteHelp[] => {
  return Array.from(registeredRoutes.values())
}

export const getRouteHelp = (path: string): RouteHelp | undefined => {
  for (const [routePattern, routeHelp] of registeredRoutes) {
    if (matchesRoute(routePattern, path)) {
      return routeHelp
    }
  }
  return undefined
}

function generateExamplePath(routePattern: string): string {
  let examplePath = routePattern
  
  // Replace :length? with a sample length
  examplePath = examplePath.replace(/:length\?/g, '10')
  
  // Replace :characters with sample characters
  examplePath = examplePath.replace(/:characters/g, 'ABC')
  
  // Remove optional trailing parameters for root route
  if (examplePath === '/:length?') {
    examplePath = '/15'
  }
  
  return examplePath
}

function matchesRoute(routePattern: string, actualPath: string): boolean {
  // Handle root route special case
  if (routePattern === '/:length?' && (actualPath === '/' || /^\/\d+$/.test(actualPath))) {
    return true
  }
  
  // Convert route pattern to regex
  let regexPattern = routePattern
    .replace(/:[^/?]+\?/g, '(?:/[^/]+)?')  // Optional parameters like :length?
    .replace(/:[^/?]+/g, '[^/]+')          // Required parameters like :characters
    .replace(/\//g, '\\/')                 // Escape slashes
  
  // Make sure we match the exact path
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(actualPath)
}