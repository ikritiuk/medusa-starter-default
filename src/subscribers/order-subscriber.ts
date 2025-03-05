import { EventBusService } from "@medusajs/medusa";
import EmailService from "../services/email-service";

class OrderSubscriber {
    private eventBusService: EventBusService;
    private emailService: EmailService;

    constructor(eventBusService: EventBusService, emailService: EmailService) {
        this.eventBusService = eventBusService;
        this.emailService = emailService;

        this.eventBusService.subscribe("order.placed", this.handleOrderPlaced.bind(this));
    }

    async handleOrderPlaced(order: any): Promise<void> {
        try {
            console.info(`Sending order confirmation email for order ${order.id}`);
            await this.emailService.sendOrderConfirmation(order);
        } catch (error) {
            console.error(`Failed to send email: ${error.message}`);
        }
    }
}

export default OrderSubscriber;
