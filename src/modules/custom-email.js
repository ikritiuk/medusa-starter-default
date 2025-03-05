import { ModuleService } from "@medusajs/types";
import nodemailer from "nodemailer";

class CustomEmailService extends ModuleService {
    constructor({}) {
        super();

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail(to, subject, text, html) {
        return await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
            html,
        });
    }
}

export default CustomEmailService;
