import {
    SubscriberConfig, SubscriberArgs,
    OrderService
} from "@medusajs/medusa"
import {Modules} from "@medusajs/framework/utils"
import {INotificationModuleService} from "@medusajs/framework/types"

export default async function orderPlacedHandler({
                                                     data,
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)
    const orderService: OrderService = container.resolve("OrderService")

    const order = await orderService.retrieve(data.id)

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