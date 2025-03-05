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
    static identifier = "notification-smtp"
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
                subject,
                html: this.getTemplate(emailData),
            })
            return { id: info.messageId }
        } catch (error) {
            this.logger_.error(`Failed to send email: ${error.message}`)
            return {}
        }
    }

    getTemplate(data) {
        // Implement your template logic here
        return `<h1>Order Completed</h1><p>Your order ${data.order.id} has been completed.</p>`
    }
}

export default SMTPNotificationProviderService