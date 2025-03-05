import nodemailer from "nodemailer";
import { OrderDTO } from "@medusajs/types";
import { Lifetime } from "@medusajs/types";
import { MedusaContainer, MedusaService } from "@medusajs/modules-sdk";

@MedusaService({ scope: "emailService", lifetime: Lifetime.SCOPED })
class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendOrderConfirmation(order: OrderDTO): Promise<void> {
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
