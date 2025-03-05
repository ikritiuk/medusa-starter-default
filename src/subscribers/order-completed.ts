import {
    type SubscriberConfig,
    type SubscriberArgs
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"

export default async function orderPlacedHandler({
                                                     event,
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)
    const productModuleService = container.resolve(Modules.PRODUCT)

    const order = await productModuleService.retrieveOrder(event.data.id)

    await notificationModuleService.createNotifications({
        to: order.email,
        channel: "email",
        template: "order-placed",
        data: {
            order: order,
        },
    })
}

export const config: SubscriberConfig = {
    event: "order.placed",
}