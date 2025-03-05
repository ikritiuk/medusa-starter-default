import nodemailer from "nodemailer";
import { Order } from "@medusajs/medusa";
import { Injectable } from "@medusajs/utils";

@Injectable()
class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for others
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendOrderConfirmation(order: Order): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: order.email,
            subject: "Order Confirmation",
            html: `
        <h2>Thank you for your order, ${order.shipping_address?.first_name}!</h2>
        <p>Your order ID is: <strong>${order.id}</strong></p>
        <p>We will notify you once your order is shipped.</p>
      `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

export default EmailService;
