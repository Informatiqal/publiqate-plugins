# Publiqate-plugins

Repo containing official [Publiqate](https://github.com/Informatiqal/publiqate) plugins.

- [smtp](./plugins/smtp/README.md) - generic SMTP client
- [S3](./plugins/s3/README.md) - S3 client

## Installation

- Clone this repo
- navigate to the each required plugin
- run `npm run build`
- in `Publiqate` config (`plugin` section) list the path to the `dist\index.js` for eac required plugin
