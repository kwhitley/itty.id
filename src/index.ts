import { AutoRouter, cors, error, json } from 'itty-router'
import { nanoid } from 'nanoid'
import { generateHash } from 'supergeneric'
import { typeid } from 'typeid-js'
import * as uuid from 'uuid'
import { withHelp, withLength } from './middleware'
import { jsonOrText } from './responseHandlers'

const { preflight, corsify } = cors()

const router = AutoRouter({
  before: [preflight, withLength],
  finally: [corsify],
  missing: () => error(404, {
    error: 'Not found',
    help: '/?help',
  }),
})

router.before?.push(withHelp(router))

router
  .get('/uuid', () => uuid.v4())
  .get('/nanoid', () => nanoid())
  .get('/typeid/:prefix?', ({ prefix }) => {
    if (prefix?.startsWith(':')) prefix = undefined
    return typeid(prefix).toString()
  })
  .get('/uuid/:version', ({ version, query, namespace, value, params }) => {
    const SUPPORTED_VERSIONS = {
      v4: { fn: uuid.v4 },
      v5: false,
      v6: { fn: uuid.v6 },
      v7: { fn: uuid.v7 },
    }

    // @ts-expect-error
    const TARGET_VERSION = SUPPORTED_VERSIONS[version]

    // @ts-expect-error
    if (SUPPORTED_VERSIONS[version] === undefined) {
      return error(400, `UUID version must be one of the following: ${Object.keys(SUPPORTED_VERSIONS).join(', ')}`)
    }

    if (TARGET_VERSION === false) {
      return error(400, `UUID version ${version} requires a namespace and value (e.g. /uuid/v5/:namespace/:value)`)
    }

    if (TARGET_VERSION !== false) {
      // @ts-expect-error
      return SUPPORTED_VERSIONS[version as keyof typeof SUPPORTED_VERSIONS]?.fn?.()
    }
  })
  .get('/uuid/v5/:value/:namespace?', ({ namespace = uuid.v5.URL, value }) => uuid.v5(value, namespace))
  .get('/alpha/:length?', withLength, ({ length }) => generateHash(length, {
    numeric: false,
  }))
  .get('/from/:characters/:length?', withLength, ({ characters, length }) => generateHash(length, {
    all: characters,
  }))
  .get('/numeric/:length?', withLength, ({ length }) => generateHash(length, {
    alpha: false,
  }))
  .get('/uppercase/:length?', withLength, ({ length }) => generateHash(length, {
    lower: false,
    numeric: false,
  }))
  .get('/uppercase-numeric/:length?', withLength, ({ length }) => generateHash(length, {
    lower: false,
    numeric: true,
  }))
  .get('/lowercase/:length?', withLength, ({ length }) => generateHash(length, {
    upper: false,
    numeric: false,
  }))
  .get('/lowercase-numeric/:length?', withLength, ({ length }) => generateHash(length, {
    upper: false,
    numeric: true,
  }))
  .get('/alpha-symbols/:length?', withLength, ({ length }) => generateHash(length, {
    symbols: true,
  }))
  .get('/only-symbols/:length?', withLength, ({ length }) => generateHash(length, {
    symbols: true,
    alpha: false,
    numeric: false,
  }))
  .get('/alpha-numeric/:length?', withLength, ({ length }) => generateHash(length, {
    alpha: true,
    numeric: false,
  }))
  .get('/numeric/:length?', withLength, ({ length }) => generateHash(length, {
    numeric: true
  }))
  .get('/:length', ({ params, query }) => {
    // @ts-expect-error
    if (!isNaN(params.length ?? query.length)) {
      return generateHash(Number(params.length ?? query.length))
    }
  })

export default { ...router }
