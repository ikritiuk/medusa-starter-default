export const EmailTemplates = {
    ORDER_PLACED: "order-placed",
    ORDER_SHIPPED: "order-shipped",
    ORDER_DELIVERED: "order-delivered",
} as const

export type EmailTemplateType = keyof typeof EmailTemplates
