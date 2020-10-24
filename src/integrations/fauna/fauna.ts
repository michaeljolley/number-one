import { Client, query, ClientConfig } from 'faunadb'
import { Action, Stream, User } from '../../models'
import { log, LogLevel } from '../../common'

export abstract class FaunaClient {

  private static client: Client

  public static init(): void {
    if (process.env.FAUNADB_SECRET) {
      const config: ClientConfig = {
        secret: process.env.FAUNADB_SECRET
      }
      this.client = new Client(config)
    }
  }

  private static mapResponse<T>(payload: FaunaDocument): T {
    return {
      ...payload.data,
      _id: payload.ref.value.id
    } as unknown as T
  }

  public static async getUser(login: string): Promise<User | undefined> {
    if (!this.client) {
      return undefined
    }

    let user: User
    try {
      const response = await this.client.query<FaunaResponse>(
        query.Map(
          query.Paginate(
            query.Match(query.Index("users_login"), login)),
          query.Lambda("users", query.Get((query.Var("users"))))
        )
      )
      if (response.data && response.data.length > 0) {
        user = this.mapResponse(response.data[0])
      }
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:getUser - ${err}`)
    }
    return user
  }

  public static async saveUser(user: User): Promise<User> {
    if (!this.client) {
      return undefined
    }

    let savedUser: User

    const existingUser: User = await this.getUser(user.login)

    if (user._id || existingUser) {
      const _id = user._id || existingUser._id
      // Update user
      try {
        const response = await this.client.query<FaunaDocument>(
          query.Replace(query.Ref(query.Collection("users"), _id), {
            data: user
          })
        )
        savedUser = this.mapResponse(response)
      }
      catch (err) {
        log(LogLevel.Error, `Fauna:saveUser - Update: ${err}`)
      }
    }
    else {
      // Create user
      try {
        const response = await this.client.query<FaunaDocument>(
          query.Create(query.Collection("users"), {
            data: user
          })
        )
        savedUser = this.mapResponse(response)
      }
      catch (err) {
        log(LogLevel.Error, `Fauna:saveUser - Create: ${err}`)
      }
    }
    return savedUser
  }

  public static async getStream(streamDate: string): Promise<Stream | undefined> {
    if (!this.client) {
      return undefined
    }

    let stream: Stream
    try {
      const response = await this.client.query<FaunaResponse>(
        query.Map(
          query.Paginate(
            query.Match(query.Index("streams_streamDate"), streamDate)),
          query.Lambda("streams", query.Get((query.Var("streams"))))
        )
      )
      if (response.data && response.data.length > 0) {
        stream = this.mapResponse(response.data[0])
      }
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:getStream - ${err}`)
    }
    return stream
  }

  public static async saveStream(stream: Stream): Promise<Stream> {
    if (!this.client) {
      return undefined
    }

    let savedStream: Stream

    const existingStream: Stream = await this.getStream(stream.streamDate)

    if (stream._id || existingStream) {
      const _id = stream._id || existingStream._id
      // Update user
      try {
        const response = await this.client.query<FaunaDocument>(
          query.Replace(query.Ref(query.Collection("streams"), _id), {
            data: stream
          })
        )
        savedStream = this.mapResponse(response)
      }
      catch (err) {
        log(LogLevel.Error, `Fauna:saveStream - Update: ${err}`)
      }
    }
    else {
      // Create stream
      try {
        const response = await this.client.query<FaunaDocument>(
          query.Create(query.Collection("streams"), {
            data: stream
          })
        )
        savedStream = this.mapResponse(response)
      }
      catch (err) {
        log(LogLevel.Error, `Fauna:saveStream - Create: ${err}`)
      }
    }
    return savedStream
  }

  public static async saveAction(action: Action): Promise<Action> {
    if (!this.client) {
      return undefined
    }

    let savedAction: Action

    try {
      const response = await this.client.query<FaunaDocument>(
        query.Create(query.Collection("actions"), {
          data: action
        })
      )
      savedAction = this.mapResponse(response)
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:saveAction - Create: ${err}`)
    }
    return savedAction
  }

  public static async getActions(actionDate: string): Promise<Action[] | undefined> {
    if (!this.client) {
      return undefined
    }

    let actions: Action[]
    try {
      const response = await this.client.query<FaunaResponse>(
        query.Map(
          query.Paginate(
            query.Match(query.Index("actions_actionDate"), actionDate)),
          query.Lambda("actions", query.Get((query.Var("actions"))))
        )
      )
      if (response.data && response.data.length > 0) {
        actions = response.data.map(m => this.mapResponse(m))
      }
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:getActions - ${err}`)
    }
    return actions
  }

  public static async getGivingActions(actionDate: string): Promise<Action[] | undefined> {
    if (!this.client) {
      return undefined
    }

    let actions: Action[]
    try {
      const response = await this.client.query<FaunaResponse>(
        query.Map(
          query.Paginate(
            query.Union(
              query.Match(query.Index("actions_date_type"), [actionDate, 'onDonation']),
              query.Match(query.Index("actions_date_type"), [actionDate, 'onCheer']),
              query.Match(query.Index("actions_date_type"), [actionDate, 'onSub']),
            ),
            { size: 500 }
          ),
          query.Lambda("actions", query.Get((query.Var("actions"))))
        )
      )
      if (response.data && response.data.length > 0) {
        actions = response.data.map(m => this.mapResponse(m))
      }
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:getGivingActions - ${err}`)
    }
    return actions
  }
}

interface FaunaResponse {
  data: FaunaDocument[]
}

interface FaunaDocument {
  ref: FaunaRef
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: object
}
interface FaunaRef {
  value: RefValue
}
interface RefValue {
  id: string
}