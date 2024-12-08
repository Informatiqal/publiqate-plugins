import nodemailer from "nodemailer";
import {
  AuthUserPass,
  SMTPPluginDetails,
  NotificationData,
  SMTPTemplateDetails,
} from "../../../interfaces";
import { Logger } from "winston";
import { readFileSync } from "fs";
import ejs from "ejs";
import * as handlebars from "handlebars";
import * as pug from "pug";
import Mustache from "mustache";

export const meta = {
  author: "Informatiqal",
  version: "1.0.0",
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

    if (callback.details.hasOwnProperty("html"))
      mailOptions.html = callback.details["html"];

    let templateEngine: SMTPTemplateDetails["engine"] = "handlebars";

    if (callback.details.hasOwnProperty("template")) {
      if (callback.details.hasOwnProperty("engine")) {
        templateEngine = callback.details["engine"];
      } else {
        logger.debug(
          `No template engine was specified. Using "handlebars" as default`
        );
      }

      if (
        templateEngine != "ejs" &&
        templateEngine != "handlebars" &&
        templateEngine != "mustache" &&
        templateEngine != "pug"
      ) {
        logger.error(
          `${notification.config.id}|Invalid template engine "${templateEngine}". Valid values are: ejs, handlebars, pug or mustache`
        );
        return;
      }

      let templateRaw = "";
      try {
        templateRaw = readFileSync(callback.details["template"]).toString();
      } catch (e) {
        logger.error(e);
        return;
      }

      try {
        if (templateEngine == "ejs")
          mailOptions.html = await ejs.render(templateRaw, n, {});

        if (templateEngine == "handlebars") {
          const template = handlebars.compile(templateRaw);
          mailOptions.html = template(n);
        }

        if (templateEngine == "mustache")
          //@ts-ignore
          mailOptions.html = Mustache.render(templateRaw, n);

        if (templateEngine == "pug")
          //@ts-ignore
          mailOptions.html = pug.render(templateRaw, n);
      } catch (e) {
        logger.error(e);
        return;
      }
    }

    try {
      await transporter.sendMail(mailOptions);

      logger.debug(
        `${n.config.id}|Mail send to ${callback.details.to.join(",")}`
      );
    } catch (e) {
      logger.error(e);
    }
  } catch (e) {
    logger.error(e);
  }

  return true;
}
