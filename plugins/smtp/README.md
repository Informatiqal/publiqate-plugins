# Publiqate SMTP

Generic SMTP plugin for `Publiqate`

## Build and Installation

Clone this repository. Navigate to the `plugins -> smtp` folder and run:

```bash
npm run build
```

Once the build process is complete the compiled code will be available in `plugins -> smtp -> dist` folder.

Copy the content of the `dist` folder somewhere on the server, where `Publiqate` is running and specify the location from where `Publiqate` will load the plugin.

Once the config is set either restart the `Publiqate` service or visit the admin UI and press "Refresh config".

Example config:

```yaml
...
plugins:
  - c:\path\to\smtp\plugin\dist\index.js
...
notifications:
  - type: Stream
    ...
    callbacks:
      - type: mail
        details:
          host: some-host-or-ip
          port: 123
          from: test@test-company.com
          to:
            - recipient1@test-company.com
            - recipient2@test-company.com
          subject: "Stream updated"
          # html: <h1>Stream updated</h1><br><div>Stream has been updated</div>
          template: c:\path\to\template.ejs # see Templates section for details
          auth:
            user: some-user
            pass: secret-password
...
```

## Options

- `host` - SMTP server host/ip
- `port` - SMTP server port
- `secure` - optional. boolean. Default is `true`
- `proxy` - optional. TCP proxy
- `from` - email address from which the emails will be send
- `to` - array of emails
- `subject` - email subject
- `html` - HTML string to be used as the mail body. If `html` and `template` are present then only `template` is used
- `template` - full path to the EJS template to use (see `Templates` section for details)
- `headers` - optional. List of additional headers (`header-name: header-value`)
- `auth` - see `Authentication` section

## Authentication

Three authentication methods are supported:

### User and pass

Very basic one. Provide `user` and `pass` properties

### 3-legged legged OAuth

- `user` - user email address
- `clientId` - the registered client id of the application
- `clientSecret` - the registered client secret of the application
- `refreshToken` - optional. If it is provided then tries to generate a new access token if existing one expires or fails
- `accessToken` - he access token for the user. Required only if refreshToken is not available
- `expires` - optional. expiration time for the current accessToken
- `accessUrl` - optional. HTTP endpoint for requesting new access tokens. This value defaults to Gmail

For more information have a look at [3-legged OAuth2 authentication](https://www.nodemailer.com/smtp/oauth2/#oauth-3lo)

### 2LO OAuth

- `user` - user email address you want to send mail as
- `serviceClient` - service client id. Found it in the service key file (`client_id` field)
- `privateKey` - private key content. Found it in the service key file (`private_key` field)

For more information have a look at [2LO authentication (service accounts)](https://www.nodemailer.com/smtp/oauth2/#oauth-2lo)

## Templates

Provide `template` property to load [EJS](https://ejs.co/) template file.

Example to render list of names for all entities in the notification:

```ejs
<ul>
  <% entities.forEach((entity,index) => {%>
  <li><%= entity.name %></li>
  <% }) %>
</ul>

```

Error log entry will be generated if the template fails to compile/render.
