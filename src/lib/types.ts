import type { UIMessage } from "ai";

export type { UIMessage } from "ai";

export type ExtendUIMessage = UIMessage && {
    model: string
}

export type Chat = {
  id: string;
  title: string;
  updated_at: string;
};

export type ActiveChat = {
    id: null;
    messages: (UIMessage | ExtendUIMessage)[];
  };
