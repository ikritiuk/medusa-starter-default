import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { EmailTemplates, EmailTemplateType } from "../modules/smtp/templates"

export default async function orderPlacedHandler({
                                                     event: { data },
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)

    const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)

    const order = await orderModuleService.retrieveOrder(data.id, {
        relations: ["items", "summary", "shipping_address"],
    })

    if (!order || !order.email) {
        console.error(`Order or email not found for order ID: ${data.id}`)
        return
    }

    // Send email notification using the SMTP provider
    await notificationModuleService.createNotifications({
        provider_id: "notification-smtp", // Ensure this matches SMTPNotificationProviderService.identifier
        to: order.email,
        subject: "Your Order Has Been Placed!", // Email subject
        template: EmailTemplates.ORDER_PLACED as EmailTemplateType, // Ensure type safety
        data: {
            order: {
                id: order.id,
                total: order.total,
            },
        },
    })
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
