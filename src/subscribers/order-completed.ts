import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"
import { INotificationModuleService } from "@medusajs/framework/types"

export default async function orderCompletedHandler({
                                                        event: { data },
                                                        container,
                                                    }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)
    const orderService = container.resolve("orderService")

    const order = await orderService.retrieve(data.id)

    await notificationModuleService.createNotifications({
        to: order.email,
        channel: "email",
        template: "order-completed",
        data: {
            order: order,
        },
    })
}

export const config: SubscriberConfig = {
    event: "order.completed",
}