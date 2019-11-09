const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    firstName: {
      type: String,
      maxlength: [50, 'First name cannot be longer than 50 characters.'],
      required: [true, 'First name is required.']
    },
    lastName: {
      type: String,
      maxlength: [50, 'First name cannot be longer than 50 characters.'],
      required: [true, 'Last name is required.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minLength: 6
    },
    // Never saved to database, only used for validation purposes
    passwordConfirm: {
      type: String,
      required: [true, 'You must confirm your password.'],
      validate: {
        // This will only work when saving the record
        validator: function(pwConfirm) {
          return pwConfirm === this.password;
        },
        message: 'Password and Confirm Password are not the same.'
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Adds the fullName to the object instead of persisting an additional field into the DB
 */
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Run prior to record being saved into database
 */
userSchema.pre('save', async function(next) {
  // Only run if the password field has been modified.
  if (!this.isModified('password')) return next();

  // Encrypt & Salt password.
  this.password = await bcrypt.hash(this.password, 12);

  // Set passwordConfirm to undefined so it is not saved to database
  this.passwordConfirm = undefined;
});

// Create the User database object
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
