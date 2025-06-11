import bcrypt from 'bcrypt';
import User from '../../model/user.js';
import createToken from '../../Utils/createToken.js';

export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Empty credentials supplied',
    });
  }

  try {
    // Find user by email using MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 'FAILED',
        message: 'Invalid credentials entered',
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'FAILED',
        message: 'Invalid credentials entered',
      });
    }

    // Create JWT token
    const token = await createToken({ userId: user._id, role: user.role });

    return res.json({
      status: 'SUCCESS',
      message: 'Signed in successfully',
      token,
      data: {
        id: user._id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      status: 'FAILED',
      message: error.message || 'An error occurred while signing in',
    });
  }
};