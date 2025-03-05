import { Modules } from "@medusajs/framework/utils";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types";

export default async function orderPlacedHandler({
                                                     event: { data },
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION);

    // ✅ Use the correct module resolution for Order Service
    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER);

    if (!orderService) {
        console.error("Order Service could not be resolved");
        return;
    }

    try {
        const order = await orderService.retrieve(data.id);

        await notificationModuleService.createNotifications({
            to: order.email,
            channel: "email",
            template: "order-placed",
            data: { order },
        });
    } catch (error) {
        console.error("Error processing order.placed event:", error);
    }
}

export const config: SubscriberConfig = {
    event: "order.placed",
};
