const mongoose = require("mongoose");

const account = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "user must have email"],
    },

    phoneNumber: {
      type: String,
    },

    firstName: {
      type: String,
    },

    lastName: {
        type: String,
      },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
      },
      default: "user"
    },

    passwordCode: {
      type: Number,
    },

    passwordResetCodeExpiresAt: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Account = mongoose.model("Account", account);

account.index({
  email: "text",
  username: "text",
});

module.exports = Account;
