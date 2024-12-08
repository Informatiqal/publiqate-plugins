import nodemailer from "nodemailer";
import {
  AuthUserPass,
  SMTPPluginDetails,
  NotificationData,
} from "../../../interfaces";
import { Logger } from "winston";
import { readFileSync } from "fs";
import ejs from "ejs";

export const meta = {
  author: "Informatiqal",
  version: "0.1.2",
  name: "smtp",
};

export async function implementation(
  callback: SMTPPluginDetails,
  notification: NotificationData,
  logger: Logger
) {
  try {
    const n = JSON.parse(JSON.stringify(notification));
    delete n.config.callback;

    if (!(callback.details.auth as AuthUserPass).pass)
      callback.details.auth["type"] = "OAuth2";

    let transporter;

    try {
      transporter = nodemailer.createTransport({
        host: callback.details.host,
        port: callback.details.port,
        secure: callback.details.secure || true,
        auth: callback.details.auth,
        tls: {
          rejectUnauthorized: false,
        },
      });
    } catch (e) {
      logger.error(e);
      return;
    }

    let mailOptions = {
      from: "",
      to: "",
      subject: "",
      html: "",
    };

    try {
      mailOptions = {
        from: callback.details.from,
        to: callback.details.to.join(","),
        subject: callback.details.subject,
        html: "",
      };
    } catch (e) {
      logger.error(e);
    }

    if (callback.details.html) mailOptions.html = callback.details.html;

    if (callback.details.template) {
      let templateRaw = "";
      try {
        templateRaw = readFileSync(callback.details.template).toString();
      } catch (e) {
        logger.error(e);
        return;
      }

      try {
        mailOptions.html = await ejs.render(templateRaw, n, {});
      } catch (e) {
        logger.error(e);
        return;
      }
    }

    try {
      await transporter.sendMail(mailOptions);

      logger.debug(
        `Mail send for notification "${
          n.config.id
        }" to ${callback.details.to.join(",")}`
      );
    } catch (e) {
      logger.error(e);
    }
  } catch (e) {
    logger.error(e);
  }

  return true;
}
