import EmailService from "./email-service"; // Use ResendEmailService if needed

export default (container) => {
    container.register("emailService", (c) => new EmailService(c));
};
