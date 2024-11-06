import { registerPlugin } from '@capacitor/core';

type NotificationPluginType = {
  showDownloadNotification(options: { title: string; content: string }): Promise<void>;
};

const NotificationPlugin = registerPlugin<NotificationPluginType>('NotificationPlugin');

export async function showNotification(title: string, content: string) {
  await NotificationPlugin.showDownloadNotification({ title, content });
}