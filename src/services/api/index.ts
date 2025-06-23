import { MessageService } from "./MessageService";
import { OrderService } from "./OrderService";

export const messageService = new MessageService();
export const orderService = new OrderService();

export type { MessageService, OrderService };
