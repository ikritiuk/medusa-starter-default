import { Subscriber, EventBusService, Logger } from "@medusajs/medusa";
import EmailService from "../services/email-service"; // Use ResendEmailService if needed

@Subscriber()
class OrderSubscriber {
    constructor(
        private readonly eventBusService: EventBusService,
        private readonly emailService: EmailService // Replace with ResendEmailService if using Resend
    ) {
        this.eventBusService.subscribe("order.placed", this.handleOrderPlaced);
    }

    async handleOrderPlaced(order: any): Promise<void> {
        try {
            Logger.info(`Sending order confirmation email for order ${order.id}`);
            await this.emailService.sendOrderConfirmation(order);
        } catch (error) {
            Logger.error(`Failed to send email: ${error.message}`);
        }
    }
}

export default OrderSubscriber;
