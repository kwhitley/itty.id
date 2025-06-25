import { json, text, type IRequest } from 'itty-router'

export const jsonOrText = (data: any, request: IRequest) => {
  if (request.headers.get('accept')?.includes('json') || typeof data === 'object') {
    return json(data)
  }
  return text(data)
}