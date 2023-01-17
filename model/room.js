const mongoose = require("mongoose");

const room = new mongoose.Schema(
  {
    roomNumber: {
        type: Number,
        unique: true,
        required: true,
    },

    floorNumber: {
        type: Number,
        required: true,
    },

    roomPrice: {
        type: Number,
        required: true,
    },

    roomSize: {
        type: String,
        enum: {
            values: ["small", "medium", "big"],
          },
        required: [true],
    },

    roomStatus: {
        type: Boolean,
        default: false,
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

const Room = mongoose.model("Room", room);

module.exports = Room;
