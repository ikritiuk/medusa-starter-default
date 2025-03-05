import EmailService from "./email-service";

export default (container) => {
    container.register("emailService", () => new EmailService());
};
