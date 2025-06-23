import { BaseService } from "./BaseService";
import type { Message } from "@/types";

interface DBMessage {
  id: number;
  created_at: string | null;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "video" | "document";
  metadata: any;
  timestamp: string | null;
  wa_id: string;
  status: string;
}

export class MessageService extends BaseService<Message> {
  constructor() {
    super("whatsapp_messages");
  }

  private transformDBMessageToMessage(dbMessage: DBMessage): Message {
    return {
      id: dbMessage.id,
      created_at: dbMessage.created_at || new Date().toISOString(),
      conversation_id: dbMessage.conversation_id,
      sender_id: dbMessage.sender_id,
      content: dbMessage.content,
      message_type: dbMessage.message_type,
      metadata: dbMessage.metadata || {},
      timestamp: dbMessage.timestamp || new Date().toISOString(),
      wa_id: dbMessage.wa_id,
      status: dbMessage.status || "sent",
    };
  }

  public async create(message: Partial<Message>): Promise<Message> {
    return super.create(message);
  }

  public async update(id: number, message: Partial<Message>): Promise<Message> {
    return super.update(id, message);
  }

  public async delete(id: number): Promise<void> {
    return super.delete(id);
  }

  public async getAll(): Promise<Message[]> {
    return super.getAll();
  }

  public async getById(id: number): Promise<Message> {
    return super.getById(id);
  }

  async getAllMessages(): Promise<Message[]> {
    const dbMessages = await this.getAll<DBMessage>();
    return dbMessages.map(this.transformDBMessageToMessage);
  }

  async getMessageById(id: string): Promise<Message> {
    const dbMessage = await this.getById<DBMessage>(id);
    return this.transformDBMessageToMessage(dbMessage);
  }

  async createMessage(data: Partial<Message>): Promise<Message> {
    const created = await this.create<DBMessage>(data);
    return this.transformDBMessageToMessage(created);
  }

  async updateMessage(id: string, data: Partial<Message>): Promise<Message> {
    const updated = await this.update<DBMessage>(id, data);
    return this.transformDBMessageToMessage(updated);
  }

  async deleteMessage(id: string): Promise<void> {
    return this.delete(id);
  }

  subscribeToMessages(
    callback: (
      message: Message,
      eventType: "INSERT" | "UPDATE" | "DELETE",
    ) => void,
  ): () => void {
    return this.subscribeToChanges<DBMessage>((payload) => {
      if (payload.new) {
        callback(
          this.transformDBMessageToMessage(payload.new),
          payload.eventType,
        );
      } else if (payload.old && payload.eventType === "DELETE") {
        callback(
          this.transformDBMessageToMessage(payload.old),
          payload.eventType,
        );
      }
    });
  }

  // Additional methods specific to WhatsApp messages
  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as DBMessage[]).map(this.transformDBMessageToMessage);
  }

  async getMessagesByWaId(waId: string): Promise<Message[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("wa_id", waId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as DBMessage[]).map(this.transformDBMessageToMessage);
  }
}

export const messageService = new MessageService();
