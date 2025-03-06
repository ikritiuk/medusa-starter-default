import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import nodemailer from "nodemailer"

type SMTPOptions = {
    host: string
    port: number
    auth: {
        user: string
        pass: string
    }
}

class SMTPNotificationProviderService extends AbstractNotificationProviderService {
    static identifier = "notification-smtp" // Ensure this matches medusa-config.ts
    protected logger_: Logger
    protected options_: SMTPOptions
    protected transporter_: nodemailer.Transporter

    constructor({ logger }: { logger: Logger }, options: SMTPOptions) {
        super()
        this.logger_ = logger
        this.options_ = options
        this.transporter_ = nodemailer.createTransport(options)
    }

    async send(data) {
        const { to, subject, data: emailData } = data

        try {
            const info = await this.transporter_.sendMail({
                from: this.options_.auth.user,
                to,
                subject: subject || "Order Confirmation",
                html: this.getTemplate(emailData),
            })
            return { id: info.messageId }
        } catch (error) {
            this.logger_.error(`Failed to send email: ${error.message}`)
            return {}
        }
    }

    getTemplate(data) {
        switch (data.template) {
            case "order-placed":
                return `
                    <h1>Order Placed</h1>
                    <p>Thank you for your order!</p>
                    <p><strong>Order ID:</strong> ${data.order.id}</p>
                    <p><strong>Total:</strong> $${data.order.total}</p>
                    <p>We will notify you once your order is shipped.</p>
                `
            default:
                return `<p>No template found for ${data.template}</p>`
        }
    }
}

export default SMTPNotificationProviderService
