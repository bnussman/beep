import * as nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "./constants";

export const email = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD
  }
});
