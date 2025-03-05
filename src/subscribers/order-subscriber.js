class OrderSubscriber {
    constructor({ eventBusService, customEmailService }) {
        this.eventBusService = eventBusService;
        this.customEmailService = customEmailService;

        this.eventBusService.subscribe("order.completed", this.handleOrderCompleted.bind(this));
    }

    async handleOrderCompleted(data) {
        console.log("EVENT TRIGGERED: Order completed!", data);

        const { email, display_id } = data;

        console.log(`📩 Попытка отправить email заказчику: ${email}`);

        await this.customEmailService.sendMail(
            email,
            `Ваш заказ #${display_id} выполнен 🎉`,
            `Здравствуйте! Ваш заказ #${display_id} успешно выполнен. Спасибо за покупку!`,
            `<h1>Ваш заказ #${display_id} выполнен 🎉</h1><p>Спасибо, что выбрали нас!</p>`
        );
    }

}

export default OrderSubscriber;
