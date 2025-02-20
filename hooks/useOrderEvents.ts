import { useEffect } from 'react';

export function useOrderEvents(shopId: string, onNewOrder: (order: any) => void) {
  useEffect(() => {
    const eventSource = new EventSource(`/api/orders/${shopId}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_order') {
        onNewOrder(data.order);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    // Clean up on unmount
    return () => {
      eventSource.close();
    };
  }, [shopId, onNewOrder]);
}
