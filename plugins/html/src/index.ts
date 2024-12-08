import { Logger } from "winston";
import { NotificationData } from "../../../interfaces";

export const meta = {
  author: "Informatiqal",
  version: "0.1.1",
  name: "html",
};

export async function implementation(
  callback: any,
  notification: NotificationData,
  logger: Logger
) {
  try {
    const n = JSON.parse(JSON.stringify(notification));
    delete n.config.callback;

    // do something with the "notification" data
  } catch (e) {
    logger.error(e);
  }

  return true;
}
