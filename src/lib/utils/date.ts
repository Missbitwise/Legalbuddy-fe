import { Conversation } from "@/types/conversation.types";

export interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previous7Days: Conversation[];
  older: Conversation[];
}

export function groupConversationsByDate(conversations: Conversation[]): GroupedConversations {
  const groups: GroupedConversations = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: [],
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOf7Days = startOfToday - 7 * 24 * 60 * 60 * 1000;

  // Sort descending by updatedAt or createdAt
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );

  sorted.forEach((conv) => {
    const time = new Date(conv.updatedAt || conv.createdAt).getTime();
    if (time >= startOfToday) {
      groups.today.push(conv);
    } else if (time >= startOfYesterday) {
      groups.yesterday.push(conv);
    } else if (time >= startOf7Days) {
      groups.previous7Days.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return groups;
}

export function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
