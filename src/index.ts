import { AutoRouter, cors } from 'itty-router'
import { generateHash } from 'supergeneric'
import { withLength } from './middleware'
import { jsonOrText } from './responseHandlers'

const { preflight, corsify } = cors()

const router = AutoRouter({
  before: [preflight, withLength],
  finally: [corsify],
  format: jsonOrText,
})

router
  .get('/alpha/:length?', withLength, ({ length }) => generateHash(length, {
    numeric: false,
  }))
  .get('/from/:characters/:length?', withLength, ({ characters, length }) => generateHash(length, {
    all: characters,
  }))
  .get('/numeric/:length?', withLength, ({ length }) => generateHash(length, {
    alpha: false,
    // startWithLetter: false,
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
  .get('/:length?', withLength, ({ length }) => generateHash(length))

export default { ...router }