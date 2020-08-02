import { Stream } from '../../src/models'

export function activeStream() {
  return new Stream(
    '2020202',
    '01/01/2020',
    '01/01/2020',
    'we streamz fer teh lulz',
    '20202-20202-20202-20202',
    null
  )
}

export function endedStream() {
  return new Stream(
    '2020202',
    '01/01/2020',
    '01/01/2020',
    'we streamz fer teh lulz',
    '20202-20202-20202-20202',
    '01/01/2020'
  )
}