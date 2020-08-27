import { Client, query, ClientConfig } from 'faunadb'
import { Stream, User } from '../../models'
import { log, LogLevel } from '../../common'
import { AMAVideo } from '../../models/AMAVideo'

export abstract class FaunaClient {

  private static client: Client

  public static init() {
    if (process.env.FAUNADB_SECRET) {
      let config: ClientConfig = {
        secret: process.env.FAUNADB_SECRET
      }
      this.client = new Client(config)
    }
  }

  private static mapResponse(payload: any): any {
    return {
      ...payload.data,
      _id: payload.ref.value.id
    }
  }

  public static async getUser(login: string): Promise<User | undefined> {
    if (!this.client) {
      return undefined
    }

    let user: User
    try {
      let response = await this.client.query(
        query.Map(
          query.Paginate(
            query.Match(query.Index("users_login"), login)),
          query.Lambda("users", query.Get((query.Var("users"))))
        )
      ) as any
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
        let response = await this.client.query(
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
        let response = await this.client.query(
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
      let response = await this.client.query(
        query.Map(
          query.Paginate(
            query.Match(query.Index("streams_streamDate"), streamDate)),
          query.Lambda("streams", query.Get((query.Var("streams"))))
        )
      ) as any
      if (response.data && response.data.length > 0) {
        stream = this.mapResponse(response.data[0])
      }
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:getConversation - ${err}`)
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
        let response = await this.client.query(
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
        let response = await this.client.query(
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

  public static async saveAMAVideo(video: AMAVideo): Promise<AMAVideo> {
    if (!this.client) {
      return undefined
    }

    let savedVideo: AMAVideo

    const existingAMAVideo: AMAVideo = await this.getAMAVideo(video.sessionId)

    if (video._id || existingAMAVideo) {
      const _id = video._id || existingAMAVideo._id
      // Update AMA Video
      try {
        let response = await this.client.query(
          query.Replace(query.Ref(query.Collection("videos"), _id), {
            data: video
          })
        )
        savedVideo = this.mapResponse(response)
      }
      catch (err) {
        log(LogLevel.Error, `Fauna:saveAMAVideo - Update: ${err}`)
      }
    }
    else {
      // Create AMA Video
      try {
        let response = await this.client.query(
          query.Create(query.Collection("videos"), {
            data: video
          })
        )
        savedVideo = this.mapResponse(response)
      }
      catch (err) {
        log(LogLevel.Error, `Fauna:saveAMAVideo - Create: ${err}`)
      }
    }
    return savedVideo
  }

  public static async getAMAVideo(sessionId: string): Promise<AMAVideo | undefined> {
    if (!this.client) {
      return undefined
    }

    let video: AMAVideo
    try {
      let response = await this.client.query(
        query.Map(
          query.Paginate(
            query.Match(query.Index("videos_sessionId"), sessionId)),
          query.Lambda("videos", query.Get((query.Var("videos"))))
        )
      ) as any
      if (response.data && response.data.length > 0) {
        video = this.mapResponse(response.data[0])
      }
    }
    catch (err) {
      log(LogLevel.Error, `Fauna:getAMAVideo - ${err}`)
    }
    return video
  }
}