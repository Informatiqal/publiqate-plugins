# Publiqate S3

Amazon S3 plugin for `Publiqate`

## Build and Installation

Clone this repository. Navigate to the `plugins -> smtp` folder and run:

```bash
npm run build
```

Once the build process is complete the compiled code will be available in `plugins -> smtp -> dist` folder.

Copy the content of the `dist` folder somewhere on the server, where `Publiqate` is running and specify the location from where `Publiqate` will load the plugin.

Once the config is set either restart the `Publiqate` service or visit the admin UI and press "Refresh config".

```yaml
...
plugins:
  - c:\path\to\s3\plugin\dist\index.js
...
notifications:
  - type: Stream
    ...
    callbacks:
      - type: s3
        details:
          region: eu-central-1
          bucket: bucket-name
          key: file-name # optional. if missing: notificationId_timestamp.json
          serverSideEncryption?: AES256 # optional
          acl: private # optional
          auth:
            accessKeyId: some-access-id
            secretAccessKey: some-secret-key
...
```
