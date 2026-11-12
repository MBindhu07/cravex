let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Join a specific order room for real-time tracking
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
    });

    // Leave order room
    socket.on('leave_order', (orderId) => {
      socket.leave(`order_${orderId}`);
    });

    // Restaurant joins their live orders channel
    socket.on('join_restaurant', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
    });

    // Delivery partner joins their assignment channel
    socket.on('join_delivery', (deliveryId) => {
      socket.join(`delivery_${deliveryId}`);
    });

    // User joins their personal notification channel
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
    });

    // Group ordering room
    socket.on('join_group_order', (groupCode) => {
      socket.join(`group_${groupCode}`);
    });

    // Delivery partner emits simulated or real GPS updates
    socket.on('update_location', ({ orderId, lat, lng }) => {
      if (orderId && lat && lng) {
        io.to(`order_${orderId}`).emit('delivery_location_updated', {
          orderId,
          lat,
          lng,
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  return io;
};

export const getIO = () => {
  return ioInstance;
};

export const emitToOrder = (orderId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`order_${orderId}`).emit(event, data);
  }
};

export const emitToRestaurant = (restaurantId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`restaurant_${restaurantId}`).emit(event, data);
  }
};

export const emitToDelivery = (deliveryId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`delivery_${deliveryId}`).emit(event, data);
  }
};

export const emitToUser = (userId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

export const emitToGroup = (groupCode, event, data) => {
  if (ioInstance) {
    ioInstance.to(`group_${groupCode}`).emit(event, data);
  }
};

export const emitToAll = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};
