class OrderSubscriber {
    constructor({ eventBusService, customEmailService }) {
        this.eventBusService = eventBusService;
        this.customEmailService = customEmailService;

        this.eventBusService.subscribe("order.completed", this.handleOrderCompleted.bind(this));
    }

    async handleOrderCompleted(data) {
        try {
            const { email, display_id } = data;

            console.log(`Отправка email для завершенного заказа: ${display_id}`);

            await this.customEmailService.sendMail(
                email,
                `Ваш заказ #${display_id} выполнен 🎉`,
                `Здравствуйте! Ваш заказ #${display_id} успешно выполнен. Спасибо за покупку!`,
                `<h1>Ваш заказ #${display_id} выполнен 🎉</h1><p>Спасибо, что выбрали нас!</p>`
            );
        } catch (error) {
            console.error("Ошибка отправки email:", error);
        }
    }
}

export default OrderSubscriber;
