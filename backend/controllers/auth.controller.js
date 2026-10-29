const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const sendAuthResponse = (user, statusCode, res, message) => {
  const token = user.generateAuthToken();
  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.getUserDetails()
  });
};

const createExpiringToken = () => crypto.randomBytes(32).toString('hex');

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password, fullName, phoneNumber, address, language } = req.body;

  if (!username || !email || !password || !fullName) {
    return next(new AppError('Username, email, password, and full name are required', 400));
  }

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }]
  });

  if (existingUser) {
    return next(new AppError('A user with this email or username already exists', 409));
  }

  // Public registration never accepts a privileged role. Assign those roles only
  // through an administrative workflow.
  const user = await User.create({
    username,
    email,
    password,
    fullName,
    phoneNumber,
    address,
    language: ['dari', 'pashto', 'english'].includes(language) ? language : 'dari',
    role: 'user',
    // Email delivery is not configured in this project. Accounts remain usable
    // locally; deployments can enable a verification flow before launch.
    isVerified: true
  });

  return sendAuthResponse(user, 201, res, 'User registered successfully');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account is inactive', 403));
  }

  return sendAuthResponse(user, 200, res, 'Login successful');
});

exports.logout = (req, res) => {
  // JWTs are stateless. The browser removes the token; this endpoint provides a
  // consistent API for clients and future token deny-list support.
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.protect = catchAsync(async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return next(new AppError('Please log in to access this resource', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-development-secret');
  } catch (error) {
    return next(new AppError('Your session is invalid or has expired', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return next(new AppError('The user for this token no longer exists', 401));
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You are not authorized to perform this action', 403));
  }
  next();
};

const providerLogin = provider => catchAsync(async (req, res, next) => {
  const token = req.body[`${provider}Token`];
  const { email, fullName } = req.body;

  if (!token || typeof token !== 'string') {
    return next(new AppError(`${provider === 'amazon' ? 'Amazon' : 'Alibaba'} token is required`, 400));
  }

  // A provider token must be verified with that provider's OAuth API in a real
  // deployment. Store only a deterministic identifier, never the raw token.
  const providerId = crypto.createHash('sha256').update(token).digest('hex').slice(0, 24);
  const providerField = `${provider}Id`;
  let user = await User.findOne({ [providerField]: providerId });

  if (!user) {
    const safeEmail = email ? email.toLowerCase() : `${provider}-${providerId}@example.invalid`;
    const existingEmail = await User.findOne({ email: safeEmail });
    if (existingEmail) {
      existingEmail[providerField] = providerId;
      await existingEmail.save();
      user = existingEmail;
    } else {
      user = await User.create({
        username: `${provider}_${providerId}`,
        email: safeEmail,
        password: crypto.randomBytes(24).toString('hex'),
        fullName: fullName || `${provider === 'amazon' ? 'Amazon' : 'Alibaba'} user`,
        language: 'dari',
        role: 'user',
        isVerified: true,
        [providerField]: providerId
      });
    }
  }

  if (!user.isActive) {
    return next(new AppError('This account is inactive', 403));
  }

  return sendAuthResponse(user, 200, res, `${provider === 'amazon' ? 'Amazon' : 'Alibaba'} login successful`);
});

exports.amazonLogin = providerLogin('amazon');
exports.alibabaLogin = providerLogin('alibaba');

exports.forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() });
  // Do not disclose whether an email has an account.
  if (!user) {
    return res.status(200).json({ success: true, message: 'If an account exists, reset instructions have been created.' });
  }

  const resetToken = createExpiringToken();
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const payload = { success: true, message: 'Password reset instructions have been created.' };
  if (process.env.NODE_ENV !== 'production') payload.resetToken = resetToken;
  return res.status(200).json(payload);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;
  if (!token || !password || password !== confirmPassword) {
    return next(new AppError('A valid token and matching passwords are required', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select('+password');

  if (!user) return next(new AppError('Password reset token is invalid or expired', 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return sendAuthResponse(user, 200, res, 'Password reset successfully');
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.body.token;
  if (!token) return next(new AppError('Verification token is required', 400));

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Verification token is invalid or expired', 400));
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

exports.resendVerification = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() });
  if (!user || user.isVerified) {
    return res.status(200).json({ success: true, message: 'If verification is needed, instructions have been created.' });
  }

  const verificationToken = createExpiringToken();
  user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const payload = { success: true, message: 'Verification instructions have been created.' };
  if (process.env.NODE_ENV !== 'production') payload.verificationToken = verificationToken;
  return res.status(200).json(payload);
});
