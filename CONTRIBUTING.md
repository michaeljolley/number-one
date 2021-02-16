# Contributing

We appreciate contributions of any kind and acknowledge them on our [README][readme]. By participating
in this project, you agree to abide by our [code of conduct](CODE_OF_CONDUCT.md).

### Any enhancements/bugs/etc you see?

Add an [issue](https://github.com/builders-club/number-one/issues/new/choose). We'll review it, add labels and reply within a few days.

### See an issue you'd like to work on?

Comment on the issue that you'd like to work on it
and we'll add the `claimed` label. If you see the `claimed` label already on the issue you
might want to ask the contributor if they'd like some help.

### Documentation/etc need updating?

Go right ahead! Just submit a pull request when you're done.

## Pull Requests

We love pull requests from everyone.

Fork, then clone the repo:

SSH

    git clone -b dev git@github.com:your-username/number-one.git
    git remote add upstream git@github.com:builders-code/number-one

HTTPS

    git clone -b dev https://github.com/your-username/number-one.git
    git remote add upstream https://github.com/builders-club/number-one

> **All changes should be based from the `dev` branch.**

Push to your fork and [submit a pull request](https://github.com/builders-club/number-one/compare/) against the `dev` branch.

At this point you're waiting on us. We like to at least comment on pull requests
within three days (and, typically, one day). We may suggest
some changes or improvements or alternatives.

Normally reviews & merging occur live on stream at [https://twitch.tv/baldbeardedbuilder](https://twitch.tv/baldbeardedbuilder).

Some things that will increase the chance that your pull request is accepted:

- Update [README][readme] with any needed changes
- Update [CHANGELOG](CHANGELOG.md) with any changes
- **Write tests.**
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

# Get Your Environment Ready

The following information is provided to help you get up and contributing as quickly as possible. If you need help, please feel free to stop by our discord channel and reach out anytime! [Bald Bearded Builder Discord][DISCORD].

## Visual Studio Code

We use Visual Studio Code as our preferred development editor, but you can use whichever editor you're must comfortable with. However, if you decide to use Visual Studio Code we have provided a workspace which includes the recommended extensions as well as default tasks and launch settings so you can easily get up and contributing and testing your code easily.

One of the first things you should do when you launch Visual Studio Code is run the `setupenv` task which will install the required node modules (both locally and globally). Remember: you need to open this repo in Visual Studio Code using the workspace file, NOT just open the folder, in order to run the task below.

1. Press your **F1** key
1. Type, **Tasks: Run Task**
1. Choose **Setup Environment**

Next you'll need to copy the `.env-example` file and rename it to `.env` then complete the following:

## Environment Variables

Before you get started, you will need to gather some information (and possibly create an account) from multiple endpoints we use. For example, you will need know your Twitch channel ID, client ID and secret.

### Twitch

#### How to find your Twitch channel ID

- Visit your **Stream Key & Preferences** page: `https://dashboard.twitch.tv/u/<your-twitch-name>/settings/channel` 
- Click the **Show** button within the *Primary Stream key* setting
- Select the number between the _ (underscore) characters. For example, your Twitch ID would be **1234567890** using the following example: `live_1234567890_xasdfAdafsaSDfasdfAd79S`
- Copy your *Twitch ID* to the `.env` **TWITCH_CHANNEL_ID** value

#### Create a Twitch API extension

- Visit the [Twitch Developers](https://dev.twitch.tv) webpage and login to your account
- Click the **Create an Extension** button
- Name the extension something memorable to you. For example: `number-one-bot`
- Copy the *Twitch API Client ID* and add it to the `.env` **TWITCH_CLIENT_ID** value
- Click the **Extension Settings** button in the upper-right corner of the page
- Click the **Generate Secret** button, then copy the result to the `.env` **TWITCH_CLIENT_SECRET** value
- Change the OAuth Redirect URL to: `https://localhost:3000`

#### Get your Twitch Bot OAuth token

- Visit the [Twitch Chat OAuth Password Generator](https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=q6batx0epp608isickayubi39itsckt&redirect_uri=https://twitchapps.com/tmi/&scope=chat:read+chat:edit+channel:moderate+whispers:read+whispers:edit+channel_editor+user:read:email+channel:read:redemptions) 

NB: Use this link to obtain the correct scopes.

- Click the **Connect** button
- Once you log in, you'll be presented with your OAuth token. Copy this token to the `.env` **TWITCH_BOT_AUTH_TOKEN** value

### Fauna DB

- Visit your [Fauna Dashboard](https://dashboard.fauna.com/) and once logged in, click on your **Database**
- Click on the **Security** at the bottom of the menu on the left
- Click **New Key** button, ensure the selected Database is the correct one and ensure Role is set to **Admin**
- Click **Save**
- Copy the secret key to the `.env` **FAUNADB_SECRET** value

#### Collections

You'll need 3 collections in place:

- actions
- streams
- users

#### Indexes

To retrieve data from Fauna, number-one uses indexes. They are defined as:

##### `actions_actionDate`

```
Collection: 
    actions

Index Name: 
    actions_actionDate

Terms: 
    data.actionDate
```

##### `actions_date_type`

```
Collection: 
    actions

Index Name: 
    actions_date_type

Terms: 
    data.actionDate
    data.eventType
```

##### `streams_streamDate`

```
Collection: 
    streams

Index Name: 
    streams_streamDate

Terms: 
    data.streamDate
```

##### `users_login`

```
Collection: 
    users

Index Name: 
    users_login

Terms: 
    data.login

Unique:
    true
```


#### Collections

You'll need 3 collections in place:

- actions
- streams
- users

#### Indexes

To retrieve data from Fauna, number-one uses indexes. They are defined as:

##### `actions_actionDate`

```
Collection: 
    actions

Index Name: 
    actions_actionDate

Terms: 
    data.actionDate
```

##### `actions_date_type`

```
Collection: 
    actions

Index Name: 
    actions_date_type

Terms: 
    data.actionDate
    data.eventType
```

##### `streams_streamDate`

```
Collection: 
    streams

Index Name: 
    streams_streamDate

Terms: 
    data.streamDate
```

##### `users_login`

```
Collection: 
    users

Index Name: 
    users_login

Terms: 
    data.login

Unique:
    true
```


---

**CONGRATULATIONS**, you made it! Now have all your environment variables configured and you're ready to start coding and debugging your contribution. So, get coding and we can't wait to see your first PR!

[readme]: README.md
[DISCORD]: https://discord.gg/rY5edQ
