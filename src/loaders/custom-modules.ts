import { asClass } from "awilix";
import CustomEmailService from "../modules/custom-email";

export default async ({ container }) => {
    container.register("customEmailService", asClass(CustomEmailService));
};
