import {
     SubscriberConfig,
     SubscriberArgs
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"
import { IOrderModuleService } from "@medusajs/medusa/dist/types/services"

export default async function orderPlacedHandler({
                                                     event,
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)
    const orderService: IOrderModuleService = container.resolve("orderService")

    const order = await orderService.retrieve(event.data.id)

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