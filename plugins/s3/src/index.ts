import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Logger } from "winston";
import { NotificationData, S3Callback } from "../../../interfaces";

export const meta = {
  author: "Informatiqal",
  version: "0.1.0",
  name: "s3",
};

export async function implementation(
  callback: S3Callback,
  notification: NotificationData,
  logger: Logger
) {
  try {
    const n = JSON.parse(JSON.stringify(notification));
    delete n.config.callback;

    if (!callback.details.region) logger.error(`region is not defined`);
    if (!callback.details.bucket) logger.error(`bucket is not defined`);

    if (!callback.details.auth) logger.error(`auth property is not defined`);
    if (!callback.details.auth.accessKeyId)
      logger.error(`accessKeyId is not defined`);
    if (!callback.details.auth.secretAccessKey)
      logger.error(`secretAccessKey is not defined`);

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: callback.details.auth.accessKeyId,
        secretAccessKey: callback.details.auth.secretAccessKey,
      },
      region: callback.details.region,
    });

    const timeStamp = new Date()
      .toISOString()
      .replace(/:/g, "")
      .replace(/./g, "")
      .replace(/-/g, "");
    const key =
      callback.details.key || `${notification.config.id}_${timeStamp}.json`;

    const params = {
      Bucket: callback.details.bucket,
      Key: key,
      ContentType: "application/json",
      Body: JSON.stringify(n),
    };

    if (callback.details.serverSideEncryption)
      params["ServerSideEncryption"] = callback.details.serverSideEncryption;
    if (callback.details.acl) params["ACL"] = callback.details.acl;

    try {
      const uploadResult = await s3Client.send(new PutObjectCommand(params));

      logger.info(
        `S3 file uploaded for notification "${notification.config.id}". ETag "${uploadResult.ETag}"; VersionId: ${uploadResult.VersionId}`
      );
    } catch (e) {
      logger.error(e);
    }
  } catch (e) {
    logger.error(e);
  }

  return true;
}
