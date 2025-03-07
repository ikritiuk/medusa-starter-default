import { MedusaContainer, Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"

export default async (container: MedusaContainer): Promise<void> => {
    const notificationModuleService: INotificationModuleService =
        container.resolve(Modules.NOTIFICATION) // Correct way to resolve notification service in Medusa v2

    notificationModuleService.subscribe("order.placed", "email") // Ensure "email" matches your provider identifier
}
