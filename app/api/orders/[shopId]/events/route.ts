import { NextRequest } from 'next/server';
import { IOrder } from '@/models/Order';

// Store connected clients for each shop
const clients = new Map<string, Set<(data: string) => void>>();

interface NotificationData {
  type: 'connected' | 'new_order';
  order?: IOrder;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { shopId: string } }
) {
  // Get and await the shopId parameter
  const { shopId } = params;

  // Set up headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Function to send events to this client
      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Add this client to the shop's client list
      if (!clients.has(shopId)) {
        clients.set(shopId, new Set());
      }
      clients.get(shopId)?.add(send);

      // Send initial connection message
      send(JSON.stringify({ type: 'connected' } as NotificationData));

      // Remove client when connection closes
      request.signal.addEventListener('abort', () => {
        clients.get(shopId)?.delete(send);
        if (clients.get(shopId)?.size === 0) {
          clients.delete(shopId);
        }
      });
    }
  });

  return new Response(stream, { headers });
}

// Helper function to notify all clients of a shop about new orders
export function notifyShopClients(shopId: string, data: NotificationData) {
  const shopClients = clients.get(shopId);
  if (shopClients) {
    const message = JSON.stringify(data);
    shopClients.forEach(send => send(message));
  }
}
