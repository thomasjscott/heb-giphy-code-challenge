const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Defines the User Schema that will be written to the database
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      maxlength: [100, 'Email cannot be longer than 100 characters.'],
      validate: [validator.isEmail, 'Must provide a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minLength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    giphys: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'giphys'
      }
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Run prior to record being saved into database
 */
userSchema.pre('save', async function(next) {
  // Only run if the password field has been modified.
  if (!this.isModified('password')) return next();

  // Salt & Encrypt Password
  this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Run prior to record being saved into database to know whether to update passwordUpdatedAt
 */
userSchema.pre('save', function(next) {
  // If the password has not been modified or if it is a new record, continue
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  return next();
});

/**
 * Compares provided password against users password to see if they match
 * @param {string} providedPassword - Password provided by client
 * @param {string} userPassword     - Hashed passwordin database for given user
 */
userSchema.methods.isCorrectPassword = async function(
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};

/**
 * Checks if password has changed since the JWT token was generated.
 * @param {string} JWTTimeStamp - The timestamp associated with a JWT token
 * @returns {boolean}           - Returns true if the password has been changed
 */
userSchema.methods.hasPasswordChanged = function(JWTTimestamp) {
  // Password was never changed.  Return false.
  if (!this.passwordChangedAt) return false;

  // Convert database timestamp to same format as JWT timestamp
  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return JWTTimestamp < changedTimestamp;
};

/**
 * Generates a random hexadecimal token so user can reset their password
 */
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypt the resetToken to store into the DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token to expire in 10 minutes. (60s * 1000 ms)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Token sent to user, encrypted token stored in database
  return resetToken;
};

// Create the User database object
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
