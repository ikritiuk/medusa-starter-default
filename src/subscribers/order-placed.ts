import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { EmailTemplates } from "../modules/email-notifications/templates"; // Make sure this exists

export default async function orderPlacedHandler({
                                                     event: { data },
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)

    // Retrieve order module service properly
    const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)

    const order = await orderModuleService.retrieveOrder(data.id, {
        relations: ["items", "summary", "shipping_address"],
    });

    if (!order || !order.email) {
        console.error(`Order or email not found for order ID: ${data.id}`)
        return
    }

    // Send notification
    await notificationModuleService.createNotifications({
        to: order.email, // Now guaranteed to be a string
        channel: "email",
        template: EmailTemplates.ORDER_PLACED, // Ensure EmailTemplates is correct
        data: {
            order: order,
        },
    })
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
