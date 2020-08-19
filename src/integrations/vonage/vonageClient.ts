import Nexmo from 'nexmo'
import { log, LogLevel } from '../../common'
import { VonageUser, VonageConversation, VonageMember } from './models'
import { User } from '../../models'
import { Events } from '../../events'

export abstract class VonageClient {

  private static _nexmoClient: any

  public static init() {
    this._nexmoClient = new Nexmo({
      apiKey: process.env.NEXMO_API_KEY,
      apiSecret: process.env.NEXMO_API_SECRET,
      applicationId: process.env.NEXMO_APPLICATION_ID,
      privateKey: './private.key'
    })
  }

  /**
   * Creates a new conversation to store data re: the stream
   * @param streamDate Date the stream started
   */
  public static async createConversation(streamDate: string): Promise<string | undefined> {

    return new Promise((resolve, reject) => {
      this._nexmoClient.conversations.create({
        name: streamDate,
        display_name: streamDate
      }, (error, result) => {
        if (error) {
          if (error.body && error.body.description) {
            log(LogLevel.Error, `Vonage:createConversation - ${error.body.description}`)
          }
          else {
            log(LogLevel.Error, 'Vonage:createConversation - Something bad happened')
          }
          reject(undefined)
        }
        else {
          resolve(result.id)
        }
      })
    })
  }

  /**
   * Gets a conversation based on the provided streamDate
   * @param conversationId Unique Id of the conversation
   */
  public static async getConversation(conversationId: string): Promise<VonageConversation | undefined> {
    return new Promise((resolve, reject) => {
      this._nexmoClient.conversations.get(conversationId, (error, result) => {
        if (error) {
          if (error.body && error.body.description) {
            log(LogLevel.Error, `Vonage:getConversation - ${error.body.description}`)
          }
          else {
            log(LogLevel.Error, 'Vonage:getConversation - Something bad happened')
          }
          reject(undefined)
        }
        else {
          resolve(result as VonageConversation)
        }
      })
    })
  }

  public static async createUser(user: User): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this._nexmoClient.users.create({
        "name": user.id,
        "display_name": user.display_name || user.login
      }, (error, result) => {
        if (error) {
          if (error.body && error.body.description) {
            log(LogLevel.Error, `Vonage:createUser - ${error.body.description}`)
          }
          else {
            log(LogLevel.Error, 'Vonage:createUser - Something bad happened')
          }
          reject(undefined)
        }
        else {
          const newUser: VonageUser = result as VonageUser
          user.vonageUserId = newUser.id
          resolve(user)
        }
      })
    })
  }

  public static async createMember(conversationId: string, userId: string): Promise<VonageMember | undefined> {
    return new Promise((resolve, reject) => {
      this._nexmoClient.conversations.members.create(conversationId,
        { "action": "join", "user_id": userId, "channel": { "type": "app" } },
        (error, result) => {
          if (error) {
            if (error.body && error.body.description) {
              log(LogLevel.Error, `Vonage:createMember - ${error.body.description}`)
            }
            else {
              log(LogLevel.Error, 'Vonage:createMember - Something bad happened')
            }
            reject(undefined)
          }
          else {
            resolve(result as VonageMember)
          }
        })
    })
  }

  public static sendEvent(conversationId: string, type: Events, memberId: string, body: object) {
    try {
      this._nexmoClient.conversations.events.create(conversationId, {
        "type": `custom:${type}`,
        "from": memberId,
        body
      },
        (error, result) => {
          if (error) {
            log(LogLevel.Error, error)
          } else {
            log(LogLevel.Info, `Event Sent: ${type}: ${result.id}`)
          }
        });
    }
    catch (err) {
      log(LogLevel.Error, err)
    }
  }
}