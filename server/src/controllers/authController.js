import bcrypt from 'bcryptjs';
import { User, FoodPassport, Notification } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone, addresses = [] } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ['customer', 'restaurant', 'delivery', 'admin'].includes(role) ? role : 'customer',
      phone: phone || '',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      addresses: addresses.length ? addresses : [
        {
          id: 'addr-default',
          title: 'Home',
          addressLine: 'Flat 402, Sunshine Heights, Indiranagar',
          landmark: 'Near 100ft Road Metro',
          city: 'Bengaluru',
          postalCode: '560038',
          lat: 12.9716,
          lng: 77.5946,
          isDefault: true,
        }
      ],
      dietaryPreferences: {
        isVegOnly: false,
        isVegan: false,
        isGlutenFree: false,
        isJain: false,
        spicePreference: 'Medium',
      },
      loyaltyPoints: 100, // Welcome bonus!
      isActive: true,
    });

    // Initialize Food Passport for customer
    if (user.role === 'customer') {
      FoodPassport.create({
        userId: user._id,
        points: 100,
        badges: [
          {
            id: 'welcome',
            name: 'Crave Starter',
            icon: '🎉',
            description: 'Joined CraveX platform',
            unlockedAt: new Date().toISOString(),
          }
        ],
        cuisinesExplored: ['Indian'],
        challenges: [
          { id: 'c1', title: 'Order from 3 different cuisines', target: 3, current: 1, completed: false, rewardPoints: 200 },
          { id: 'c2', title: 'Try a healthy green salad', target: 1, current: 0, completed: false, rewardPoints: 150 },
          { id: 'c3', title: 'Leave your first review', target: 1, current: 0, completed: false, rewardPoints: 100 },
        ],
      });

      Notification.create({
        userId: user._id,
        role: 'customer',
        title: 'Welcome to CraveX! 🎉',
        message: 'You have received 100 CravePoints welcome bonus. Start exploring dishes!',
        type: 'promo',
        read: false,
      });
    }

    const token = generateToken(user._id);
    const { password: _, ...userSafe } = user;

    res.status(201).json({
      success: true,
      token,
      user: userSafe,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      token,
      user: userSafe,
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, addresses, dietaryPreferences } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (addresses) updateData.addresses = addresses;
    if (dietaryPreferences) updateData.dietaryPreferences = dietaryPreferences;

    const updatedUser = User.findByIdAndUpdate(req.user._id, updateData);
    const { password, ...userSafe } = updatedUser;

    res.json({
      success: true,
      user: userSafe,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// One-click demo login for reviewing all 4 dashboards
export const demoLogin = async (req, res) => {
  try {
    const { role = 'customer' } = req.body;
    const emailMap = {
      customer: 'customer@cravex.com',
      restaurant: 'owner@cravex.com',
      delivery: 'delivery@cravex.com',
      admin: 'admin@cravex.com',
    };

    const targetEmail = emailMap[role] || 'customer@cravex.com';
    let user = User.findOne({ email: targetEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: `Demo user for role ${role} not found. Please run seed.` });
    }

    const token = generateToken(user._id);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      token,
      user: userSafe,
      message: `Signed in as Demo ${role.toUpperCase()}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Demo login error' });
  }
};
