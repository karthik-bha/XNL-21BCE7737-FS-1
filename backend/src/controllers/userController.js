import User from '../models/User.js'; 

// Controller to fetch users with 'customer' role
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' });

    // If no customers are found, send an empty array
    if (!customers.length) {
      return res.status(404).json({ message: 'No customers found' });
    }

    // Return the list of customers (include only necessary fields)
    const customersList = customers.map(user => ({
      _id: user._id,
      name: user.name,
    }));

    return res.json(customersList);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
