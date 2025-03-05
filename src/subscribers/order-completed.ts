import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { INotificationModuleService } from "@medusajs/framework/types"
import { OrderService } from "@medusajs/medusa"

export default async function orderPlacedHandler({
                                                     event: { data },
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)
    const orderService: OrderService = container.resolve("orderService")

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