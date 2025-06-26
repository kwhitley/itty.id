import { type IRequest } from 'itty-router'

export const withLength = (req: IRequest) => {
  req.length = Number(req.params?.length ?? req.query?.length) || 8
}
