import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { EmailTemplates, EmailTemplateType } from "../modules/smtp/templates"

export default async function orderPlacedHandler({
                                                     event: { data },
                                                     container,
                                                 }: SubscriberArgs<{ id: string }>) {
    console.log(`🔔 [Event Triggered] order.placed event received for order ID: ${data.id}`)

    try {
        console.log(`🛠 [Step 1] Resolving Notification Module...`)
        const notificationModuleService: INotificationModuleService =
            container.resolve(Modules.NOTIFICATION)
        console.log(`✅ [Step 1] Notification Module Resolved.`)

        console.log(`🛠 [Step 2] Resolving Order Module...`)
        const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)
        console.log(`✅ [Step 2] Order Module Resolved.`)

        console.log(`🔍 [Step 3] Fetching order details for order ID: ${data.id}...`)
        const order = await orderModuleService.retrieveOrder(data.id, {
            relations: ["items", "summary", "shipping_address"],
        })

        if (!order || !order.email) {
            console.error(`⚠️ [Error] Order or email not found for order ID: ${data.id}`)
            return
        }

        console.log(`✅ [Step 3] Order details retrieved successfully.`)
        console.log(`📦 Order ID: ${order.id}, Email: ${order.email}`)

        console.log(`✉️ [Step 4] Sending email notification to ${order.email}...`)
        await notificationModuleService.createNotifications({
            to: order.email, // Now guaranteed to be a string
            channel: "email",
            template: EmailTemplates.ORDER_PLACED as EmailTemplateType,
            subject: "Подтверждение заказа",
            data: {
                order: order,
            },
        })
        console.log(`✅ [Step 4] Email notification sent successfully to ${order.email}`)
    } catch (error) {
        console.error(`❌ [Error] Failed to process order.placed event:`, error)
    }
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
