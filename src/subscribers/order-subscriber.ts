import { Lifetime } from "@medusajs/types";
import { MedusaContainer, MedusaModule, MedusaModuleService } from "@medusajs/modules-sdk";
import EmailService from "../services/email-service";

@MedusaModule({
    imports: ["eventBusService", "emailService"],
    lifetime: Lifetime.SCOPED,
})
class OrderSubscriber extends MedusaModuleService {
    constructor(
        private readonly container: MedusaContainer
    ) {
        super();
        const eventBusService = this.container.resolve("eventBusService");
        eventBusService.subscribe("order.placed", this.handleOrderPlaced.bind(this));
    }

    async handleOrderPlaced(order: any): Promise<void> {
        try {
            console.info(`Sending order confirmation email for order ${order.id}`);
            const emailService = this.container.resolve<EmailService>("emailService");
            await emailService.sendOrderConfirmation(order);
        } catch (error) {
            console.error(`Failed to send email: ${error.message}`);
        }
    }
}

export default OrderSubscriber;
