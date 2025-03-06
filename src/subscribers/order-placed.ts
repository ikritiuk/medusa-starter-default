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

    // Send email notification using the default provider
    await notificationModuleService.createNotifications({
        to: order.email,
        subject: "Your Order Has Been Placed!", // Ensure subject is included
        channel: "email", // Medusa will route it to the configured email provider
        template: EmailTemplates.ORDER_PLACED as EmailTemplateType, // Type safety
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
