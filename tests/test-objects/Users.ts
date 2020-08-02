import { User } from '../../src/models'

export function user() {
  return new User(
    'testUser',
    'http://image.png',
    '12345678',
    'TestUser',
    '12345-12345-12345-12345-12345')
}