import { User } from '../../models'

export function user():User {
  return new User(
    'testUser',
    'http://image.png',
    '12345678',
    'TestUser')
}