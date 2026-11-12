import { GroupOrder, FoodItem, Restaurant, Order } from '../models/index.js';
import { emitToGroup } from '../socket/index.js';

export const createGroupOrder = async (req, res) => {
  try {
    const { restaurantId, deadlineMinutes = 30 } = req.body;
    const host = req.user;

    const restaurant = Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Generate unique 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const deadline = new Date(Date.now() + deadlineMinutes * 60000).toISOString();

    const group = GroupOrder.create({
      code,
      hostId: host._id,
      hostName: host.name,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      restaurantLogo: restaurant.logo,
      deadline,
      locked: false,
      status: 'OPEN',
      participants: [
        {
          userId: host._id,
          name: host.name,
          items: [],
        },
      ],
      orderId: null,
    });

    res.status(201).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create group order' });
  }
};

export const getGroupByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const group = GroupOrder.findOne({ code: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    // If current user is not in participants, add them
    const user = req.user;
    if (user && !group.participants.some((p) => p.userId === user._id) && !group.locked) {
      group.participants.push({
        userId: user._id,
        name: user.name,
        items: [],
      });
      GroupOrder.findByIdAndUpdate(group._id, { participants: group.participants });
      emitToGroup(group.code, 'group_updated', group);
    }

    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve group' });
  }
};

export const addItemToGroup = async (req, res) => {
  try {
    const { code } = req.params;
    const { foodItemId, quantity = 1, selectedSize, selectedAddOns } = req.body;
    const user = req.user;

    const group = GroupOrder.findOne({ code: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    if (group.locked) {
      return res.status(400).json({ success: false, message: 'This group cart is locked by host' });
    }

    const food = FoodItem.findById(foodItemId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    let unitPrice = food.price;
    if (selectedSize?.price) unitPrice += Number(selectedSize.price);
    if (selectedAddOns && Array.isArray(selectedAddOns)) {
      selectedAddOns.forEach((a) => (unitPrice += Number(a.price || 0)));
    }

    let participant = group.participants.find((p) => p.userId === user._id);
    if (!participant) {
      participant = { userId: user._id, name: user.name, items: [] };
      group.participants.push(participant);
    }

    participant.items.push({
      foodItemId: food._id,
      name: food.name,
      price: unitPrice,
      quantity: Number(quantity),
      image: food.image,
      size: selectedSize?.name || 'Regular',
      itemTotal: unitPrice * Number(quantity),
    });

    const updated = GroupOrder.findByIdAndUpdate(group._id, { participants: group.participants });
    emitToGroup(group.code, 'group_updated', updated);

    res.json({ success: true, group: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add item to group' });
  }
};

export const toggleLockGroup = async (req, res) => {
  try {
    const { code } = req.params;
    const group = GroupOrder.findOne({ code: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found' });
    }

    if (group.hostId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Only group host can lock or unlock' });
    }

    const updated = GroupOrder.findByIdAndUpdate(group._id, { locked: !group.locked });
    emitToGroup(group.code, 'group_updated', updated);

    res.json({ success: true, group: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle lock' });
  }
};
