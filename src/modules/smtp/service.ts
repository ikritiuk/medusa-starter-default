import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import nodemailer from "nodemailer"

type SMTPOptions = {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
}

class SMTPNotificationProviderService extends AbstractNotificationProviderService {
    static identifier = "email" // Ensure this matches medusa-config.ts
    protected logger_: Logger
    protected options_: SMTPOptions
    protected transporter_: nodemailer.Transporter

    constructor({ logger }: { logger: Logger }, options: SMTPOptions) {
        super()
        this.logger_ = logger
        this.options_ = options
        this.transporter_ = nodemailer.createTransport({
            host: this.options_.host,
            port: this.options_.port,
            secure: this.options_.secure, // Port 465 requires `secure: true`
            auth: {
                user: this.options_.auth.user,
                pass: this.options_.auth.pass,
            },
        })
        this.logger_.info(`📧 [SMTP Initialized] SMTP Notification Provider Loaded.`)
        this.logger_.info(`🔧 [SMTP Settings] Host: ${this.options_.host}, Port: ${this.options_.port}`)
    }

    async send(data) {
        const { to, channel, template, data: emailData } = data

        try {
            this.logger_.info(`📤 [Sending Email] Preparing to send email to: ${to}`)
            this.logger_.debug(`📨 [Email Template] ${template}`)

            const emailHtml = this.getTemplate(emailData, template)

            const info = await this.transporter_.sendMail({
                from: this.options_.auth.user,
                to,
                subject: "Подтверждение заказа",
                html: emailHtml,
            })

            this.logger_.info(`✅ [Email Sent] Message ID: ${info.messageId}, Sent to: ${to}`)
            return { id: info.messageId }
        } catch (error) {
            this.logger_.error(`❌ [Error] Failed to send email to ${to}: ${error.message}`)
            return {}
        }
    }

    getTemplate(data, template) {
        this.logger_.debug(`🖼️ [Генерация шаблона] Запрошен шаблон: ${template}`)
        this.logger_.debug(`🖼️ Данные:`, data)

        switch (template) {
            case "order-placed":
                this.logger_.info(`📩 [Используемый шаблон] Подтверждение заказа`)
                return `
                <h1>Заказ оформлен</h1>
                <p>Спасибо за ваш заказ!</p>
                <p><strong>Номер заказа:</strong> ${data.order.id}</p>
                <p><strong>Сумма:</strong> $${(data.order.total / 100).toFixed(2)}</p>

                <h2>Детали заказа:</h2>
                <ul>
                    ${data.order.items.map(item => `
                        <li>
                            <strong>${item.title}</strong> - ${item.quantity} шт. x $${(item.unit_price / 100).toFixed(2)}
                        </li>
                    `).join('')}
                </ul>

                <p>Мы уведомим вас, когда ваш заказ будет отправлен.</p>
            `;

            case "order-shipped":
                this.logger_.info(`📩 [Используемый шаблон] Отправка заказа`)
                return `
                <h1>Ваш заказ отправлен</h1>
                <p>Ваш заказ с номером <strong>${data.order.id}</strong> был отправлен.</p>
                <p>Вы можете отследить его по следующему номеру:</p>
                <p><strong>Трек-номер:</strong> ${data.tracking_number}</p>

                <p>Спасибо за покупку!</p>
            `;

            case "order-delivered":
                this.logger_.info(`📩 [Используемый шаблон] Доставка заказа`)
                return `
                <h1>Ваш заказ доставлен</h1>
                <p>Ваш заказ <strong>${data.order.id}</strong> успешно доставлен.</p>
                <p>Если у вас есть вопросы или возникли проблемы, пожалуйста, свяжитесь с нами.</p>

                <p>Спасибо за покупку!</p>
            `;

            default:
                this.logger_.warn(`⚠️ [Предупреждение] Шаблон не найден для ${template}`)
                return `<p>Ошибка: Шаблон ${template} не найден.</p>`;
        }
    }
}

export default SMTPNotificationProviderService
