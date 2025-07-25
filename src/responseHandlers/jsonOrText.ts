import { json, text, type IRequest } from 'itty-router'

export const jsonOrText = (data: any, request: IRequest) => {
  if (request.headers.get('accept')?.includes('text')) {
    return text(data)
  }
  return json(data)
}