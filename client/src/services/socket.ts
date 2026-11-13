import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5001'
        : (typeof window !== 'undefined' ? window.location.origin : '/'));

    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      // socket connected
    });

    socket.on('disconnect', () => {
      // socket disconnected
    });
  }
  return socket;
};

export const joinOrderRoom = (orderId: string) => {
  const s = getSocket();
  s.emit('join_order', orderId);
};

export const leaveOrderRoom = (orderId: string) => {
  const s = getSocket();
  s.emit('leave_order', orderId);
};

export const joinRestaurantRoom = (restaurantId: string) => {
  const s = getSocket();
  s.emit('join_restaurant', restaurantId);
};

export const joinDeliveryRoom = (deliveryId: string) => {
  const s = getSocket();
  s.emit('join_delivery', deliveryId);
};

export const joinUserRoom = (userId: string) => {
  const s = getSocket();
  s.emit('join_user', userId);
};

export const joinGroupRoom = (groupCode: string) => {
  const s = getSocket();
  s.emit('join_group_order', groupCode);
};

export default getSocket;
