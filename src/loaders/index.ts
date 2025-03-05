import customModulesLoader from "./custom-modules";

export default async (container) => {
    await customModulesLoader({ container });
};
