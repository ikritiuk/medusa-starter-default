import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"

export default async function orderPlacedHandler({
                                                     event: { data },
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION)

    // Retrieve order module service properly
    const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)

    // Fetch order details using `list` method
    const orders = await orderModuleService.list({ id: data.id }, { relations: ["customer"] })

    if (!orders.length) {
        console.error(`Order with id ${data.id} not found.`)
        return
    }

    const order = orders[0] // Since list returns an array, get the first item

    // Send notification
    await notificationModuleService.createNotifications({
        to: order.customer?.email || "", // Ensure email exists
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
