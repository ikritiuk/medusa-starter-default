import EmailService from "./email-service";
import OrderSubscriber from "../subscribers/order-subscriber";

export default (container) => {
    container.register("emailService", () => new EmailService());
    container.register("orderSubscriber", (c) => new OrderSubscriber(c.resolve("eventBusService"), c.resolve("emailService")));
};
