import nodemailer from "nodemailer";
import { BaseService } from "@medusajs/medusa";

class CustomEmailService extends BaseService {
    constructor({}, options) {
        super();
        this.options = options;

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true", // true для 465, false для 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail(to, subject, text, html) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM, // Например: '"Магазин" <noreply@example.com>'
                to,
                subject,
                text,
                html,
            });

            this.logger.info(`Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this.logger.error(`Email send error: ${error.message}`);
            throw error;
        }
    }

    async sendNotification(event, data) {
        const { to, subject, text, html } = this.prepareEmailData(event, data);
        return this.sendMail(to, subject, text, html);
    }

    prepareEmailData(event, data) {
        let to = data.customer_email || "admin@example.com";
        let subject = "Уведомление";
        let text = "Это тестовое письмо";
        let html = `<p>${text}</p>`;

        if (event === "order.completed") {
            subject = `Ваш заказ #${data.display_id} выполнен 🎉`;
            text = `Здравствуйте! Ваш заказ #${data.display_id} успешно выполнен. Спасибо за покупку!`;
            html = `<h1>Ваш заказ #${data.display_id} выполнен 🎉</h1><p>Спасибо, что выбрали нас!</p>`;
        }

        return { to, subject, text, html };
    }
}

export default CustomEmailService;
