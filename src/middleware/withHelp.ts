import { type IRequest, type RouterType, json } from 'itty-router'

const extractRoutes = (router: any) =>
  router.routes.map(
    ([method, , handlers, route]: any[]) => `${method} ${route}`
  )

export const withHelp = (router: RouterType) => (req: IRequest) => {
  if (req.query.help !== undefined) return {
    routes: extractRoutes(router),
  }
}
