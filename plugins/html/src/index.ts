import { Logger } from "winston";
import { readFileSync, writeFileSync } from "fs";
import ejs from "ejs";
import * as handlebars from "handlebars";
import * as pug from "pug";
import Mustache from "mustache";

import { HTMLPluginDetails, NotificationData } from "../../../interfaces";

export const meta = {
  author: "Informatiqal",
  version: "1.0.0",
  name: "html",
};

export async function implementation(
  callback: HTMLPluginDetails,
  notification: NotificationData,
  logger: Logger
) {
  let templateEngine: HTMLPluginDetails["details"]["engine"] = "handlebars";

  try {
    const n = JSON.parse(JSON.stringify(notification));
    delete n.config.callback;

    if (callback.details.hasOwnProperty("engine")) {
      templateEngine = callback.details.engine;
    } else {
      logger.debug(
        `No template engine was specified. Using "handlebars" as default`
      );
    }

    if (!callback.details.template) {
      logger.error(`${notification.config.id}|Template file was not provided`);
      return;
    }

    if (!callback.details.path) {
      logger.error(
        `${notification.config.id}|Path to save the generated template was not provided`
      );
      return;
    }

    let templateRaw = "";
    try {
      templateRaw = readFileSync(callback.details.template).toString();
      logger.debug(
        `${notification.config.id}|Loaded template from ${callback.details.template}`
      );
    } catch (e) {
      logger.error(e);
      return;
    }

    let htmlContent = "";

    try {
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

      if (templateEngine == "ejs")
        htmlContent = await ejs.render(templateRaw, n, {});

      if (templateEngine == "handlebars") {
        const template = handlebars.compile(templateRaw);
        htmlContent = template(n);
      }

      if (templateEngine == "mustache")
        //@ts-ignore
        htmlContent = Mustache.render(templateRaw, n);

      if (templateEngine == "pug")
        //@ts-ignore
        htmlContent = pug.render(templateRaw, n);
    } catch (e) {
      logger.error(e);
      return;
    }

    try {
      writeFileSync(callback.details.path, htmlContent);
      logger.debug(`Template generated and saved in ${callback.details.path}`);
    } catch (e) {
      logger.error(e);
      return;
    }
  } catch (e) {
    logger.error(e);
  }

  return true;
}
