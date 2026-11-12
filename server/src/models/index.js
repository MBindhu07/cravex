import db from '../db/storage.js';

export const User = {
  find: (q, opt) => db.find('users', q, opt),
  findOne: (q) => db.findOne('users', q),
  findById: (id) => db.findById('users', id),
  create: (doc) => db.create('users', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('users', id, data),
  deleteOne: (q) => db.deleteOne('users', q),
  countDocuments: (q) => db.countDocuments('users', q),
};

export const Restaurant = {
  find: (q, opt) => db.find('restaurants', q, opt),
  findOne: (q) => db.findOne('restaurants', q),
  findById: (id) => db.findById('restaurants', id),
  create: (doc) => db.create('restaurants', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('restaurants', id, data),
  deleteOne: (q) => db.deleteOne('restaurants', q),
  countDocuments: (q) => db.countDocuments('restaurants', q),
};

export const FoodItem = {
  find: (q, opt) => db.find('foodItems', q, opt),
  findOne: (q) => db.findOne('foodItems', q),
  findById: (id) => db.findById('foodItems', id),
  create: (doc) => db.create('foodItems', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('foodItems', id, data),
  deleteOne: (q) => db.deleteOne('foodItems', q),
  countDocuments: (q) => db.countDocuments('foodItems', q),
};

export const Category = {
  find: (q, opt) => db.find('categories', q, opt),
  findOne: (q) => db.findOne('categories', q),
  findById: (id) => db.findById('categories', id),
  create: (doc) => db.create('categories', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('categories', id, data),
  deleteOne: (q) => db.deleteOne('categories', q),
  countDocuments: (q) => db.countDocuments('categories', q),
};

export const Order = {
  find: (q, opt) => db.find('orders', q, opt),
  findOne: (q) => db.findOne('orders', q),
  findById: (id) => db.findById('orders', id),
  create: (doc) => db.create('orders', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('orders', id, data),
  deleteOne: (q) => db.deleteOne('orders', q),
  countDocuments: (q) => db.countDocuments('orders', q),
};

export const GroupOrder = {
  find: (q, opt) => db.find('groupOrders', q, opt),
  findOne: (q) => db.findOne('groupOrders', q),
  findById: (id) => db.findById('groupOrders', id),
  create: (doc) => db.create('groupOrders', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('groupOrders', id, data),
  deleteOne: (q) => db.deleteOne('groupOrders', q),
};

export const Review = {
  find: (q, opt) => db.find('reviews', q, opt),
  findOne: (q) => db.findOne('reviews', q),
  findById: (id) => db.findById('reviews', id),
  create: (doc) => db.create('reviews', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('reviews', id, data),
  deleteOne: (q) => db.deleteOne('reviews', q),
  countDocuments: (q) => db.countDocuments('reviews', q),
};

export const Inventory = {
  find: (q, opt) => db.find('inventory', q, opt),
  findOne: (q) => db.findOne('inventory', q),
  findById: (id) => db.findById('inventory', id),
  create: (doc) => db.create('inventory', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('inventory', id, data),
  deleteOne: (q) => db.deleteOne('inventory', q),
};

export const Coupon = {
  find: (q, opt) => db.find('coupons', q, opt),
  findOne: (q) => db.findOne('coupons', q),
  findById: (id) => db.findById('coupons', id),
  create: (doc) => db.create('coupons', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('coupons', id, data),
  deleteOne: (q) => db.deleteOne('coupons', q),
  countDocuments: (q) => db.countDocuments('coupons', q),
};

export const SupportTicket = {
  find: (q, opt) => db.find('supportTickets', q, opt),
  findOne: (q) => db.findOne('supportTickets', q),
  findById: (id) => db.findById('supportTickets', id),
  create: (doc) => db.create('supportTickets', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('supportTickets', id, data),
  deleteOne: (q) => db.deleteOne('supportTickets', q),
  countDocuments: (q) => db.countDocuments('supportTickets', q),
};

export const FoodPoll = {
  find: (q, opt) => db.find('foodPolls', q, opt),
  findOne: (q) => db.findOne('foodPolls', q),
  findById: (id) => db.findById('foodPolls', id),
  create: (doc) => db.create('foodPolls', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('foodPolls', id, data),
  deleteOne: (q) => db.deleteOne('foodPolls', q),
};

export const FoodPassport = {
  find: (q, opt) => db.find('foodPassports', q, opt),
  findOne: (q) => db.findOne('foodPassports', q),
  findById: (id) => db.findById('foodPassports', id),
  create: (doc) => db.create('foodPassports', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('foodPassports', id, data),
  deleteOne: (q) => db.deleteOne('foodPassports', q),
};

export const Notification = {
  find: (q, opt) => db.find('notifications', q, opt),
  findOne: (q) => db.findOne('notifications', q),
  findById: (id) => db.findById('notifications', id),
  create: (doc) => db.create('notifications', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('notifications', id, data),
  deleteOne: (q) => db.deleteOne('notifications', q),
  countDocuments: (q) => db.countDocuments('notifications', q),
};

export const Promotion = {
  find: (q, opt) => db.find('promotions', q, opt),
  findOne: (q) => db.findOne('promotions', q),
  findById: (id) => db.findById('promotions', id),
  create: (doc) => db.create('promotions', doc),
  findByIdAndUpdate: (id, data) => db.findByIdAndUpdate('promotions', id, data),
  deleteOne: (q) => db.deleteOne('promotions', q),
};

export default {
  User,
  Restaurant,
  FoodItem,
  Category,
  Order,
  GroupOrder,
  Review,
  Inventory,
  Coupon,
  SupportTicket,
  FoodPoll,
  FoodPassport,
  Notification,
  Promotion,
};
