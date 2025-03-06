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
    static identifier = "smtp" // Ensure this matches medusa-config.ts
    protected logger_: Logger
    protected options_: SMTPOptions
    protected transporter_: nodemailer.Transporter

    constructor({ logger }: { logger: Logger }, options: SMTPOptions) {
        super()
        this.logger_ = logger
        this.options_ = options
        this.transporter_ = nodemailer.createTransport(options)

        console.log(`📧 [SMTP Initialized] SMTP Notification Provider Loaded.`)
        console.log(`🔧 [SMTP Settings] Host: ${this.options_.host}, Port: ${this.options_.port}`)
    }

    async send(data) {
        const { to, subject, data: emailData } = data

        try {
            console.log(`📤 [Sending Email] Preparing to send email to: ${to}`)
            console.log(`📝 [Email Subject] ${subject || "Order Confirmation"}`)
            console.log(`📨 [Email Template] ${emailData.template}`)

            const info = await this.transporter_.sendMail({
                from: this.options_.auth.user,
                to,
                subject: subject || "Order Confirmation",
                html: this.getTemplate(emailData),
            })

            console.log(`✅ [Email Sent] Message ID: ${info.messageId}, Sent to: ${to}`)
            return { id: info.messageId }
        } catch (error) {
            console.error(`❌ [Error] Failed to send email to ${to}: ${error.message}`)
            this.logger_.error(`Failed to send email: ${error.message}`)
            return {}
        }
    }

    getTemplate(data) {
        console.log(`🖼️ [Generating Template] Template Requested: ${data.template}`)

        switch (data.template) {
            case "order-placed":
                console.log(`📩 [Template Used] Order Placed Template`)
                return `
                    <h1>Order Placed</h1>
                    <p>Thank you for your order!</p>
                    <p><strong>Order ID:</strong> ${data.order.id}</p>
                    <p><strong>Total:</strong> $${data.order.total}</p>
                    <p>We will notify you once your order is shipped.</p>
                `
            default:
                console.warn(`⚠️ [Warning] No template found for ${data.template}`)
                return `<p>No template found for ${data.template}</p>`
        }
    }
}

export default SMTPNotificationProviderService
