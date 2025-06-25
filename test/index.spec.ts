import { describe, it, expect } from 'bun:test'
import worker from '../src/index'

type TestLeaf = (args: {
  resolve: () => void,
  makeRequest: (path: string, query?: Record<string, string>) => Promise<Response>
}) => void

type TestTree = {
  [key: string]: TestTree | TestLeaf
}

const tests: TestTree = {
  'itty.id API': {
    'HELP SYSTEM': {
      '/?help': {
        'returns complete API documentation': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/', { help: '' })
          const data = await response.json()
          
          expect(data.service).toBe('itty.id - Random Hash Generation API')
          expect(data.routes).toBeArray()
          expect(data.routes.length).toBeGreaterThan(5)
          resolve()
        }
      },
      '/alpha?help': {
        'returns route-specific help': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/alpha', { help: '' })
          const data = await response.json()
          
          expect(data.route.path).toBe('/alpha/{length?}')
          expect(data.route.description).toContain('alphabetic')
          expect(data.queryParameters.help).toBeDefined()
          resolve()
        }
      },
      '/numeric/5?help': {
        'returns help for parameterized route': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/numeric/5', { help: '' })
          const data = await response.json()
          
          expect(data.route.path).toBe('/numeric/{length?}')
          expect(data.route.description).toContain('numeric')
          resolve()
        }
      }
    },
    'HASH GENERATION': {
      '/': {
        'generates default alphanumeric hash': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/')
          const hash = await response.text()
          
          expect(hash.length).toBe(10)
          expect(hash).toMatch(/^[a-zA-Z0-9]+$/)
          resolve()
        }
      },
      '/15': {
        'generates hash with specified length': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/15')
          const hash = await response.text()
          
          expect(hash.length).toBe(15)
          resolve()
        }
      },
      '/alpha/8': {
        'generates alphabetic-only hash': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/alpha/8')
          const hash = await response.text()
          
          expect(hash.length).toBe(8)
          expect(hash).toMatch(/^[a-zA-Z]+$/)
          resolve()
        }
      },
      '/numeric/6': {
        'generates numeric-only hash': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/numeric/6')
          const hash = await response.text()
          
          expect(hash.length).toBe(6)
          expect(hash).toMatch(/^[0-9]+$/)
          resolve()
        }
      },
      '/uppercase/5': {
        'generates uppercase letters only': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/uppercase/5')
          const hash = await response.text()
          
          expect(hash.length).toBe(5)
          expect(hash).toMatch(/^[A-Z]+$/)
          resolve()
        }
      },
      '/lowercase/7': {
        'generates lowercase letters only': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/lowercase/7')
          const hash = await response.text()
          
          expect(hash.length).toBe(7)
          expect(hash).toMatch(/^[a-z]+$/)
          resolve()
        }
      },
      '/from/abc123/4': {
        'generates hash from custom character set': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/from/abc123/4')
          const hash = await response.text()
          
          expect(hash.length).toBe(4)
          expect(hash).toMatch(/^[abc123]+$/)
          resolve()
        }
      }
    },
    'QUERY PARAMETERS': {
      '/?length=12': {
        'overrides length via query parameter': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/', { length: '12' })
          const hash = await response.text()
          
          expect(hash.length).toBe(12)
          resolve()
        }
      }
    },
    'CONTENT NEGOTIATION': {
      'with Accept: application/json': {
        'returns JSON response': async ({ makeRequest, resolve }) => {
          const response = await makeRequest('/', {}, { 'Accept': 'application/json' })
          const data = await response.json()
          
          expect(typeof data).toBe('string')
          expect(response.headers.get('content-type')).toContain('application/json')
          resolve()
        }
      }
    }
  }
}

// setup function for each test
const setup = () => {
  const makeRequest = async (path: string, query: Record<string, string> = {}, headers: Record<string, string> = {}) => {
    const url = new URL(path, 'http://localhost')
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value))
    
    const request = new Request(url.toString(), { headers })
    return await worker.fetch(request, {} as any, {} as any)
  }

  return { makeRequest }
}

// recursive test runner
const runTests = (tests: TestTree) => {
  for (const [name, test] of Object.entries(tests)) {
    if (typeof test === 'function') {
      if (test.constructor.name === 'AsyncFunction') {
        // @ts-ignore
        it(name, () => new Promise(resolve => test({ ...setup(), resolve })))
      } else {
        // @ts-ignore
        it(name, () => test({ ...setup() }))
      }
    } else {
      describe(name, () => runTests(test))
    }
  }
}

// run the tests!
runTests(tests)
