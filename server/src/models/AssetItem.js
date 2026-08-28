const mongoose = require('mongoose');

const assetItemSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Textbook', 'Furniture', 'Laboratory', 'Sports', 'IT Equipment', 'Stationery'],
      default: 'Textbook',
    },
    assetCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    assignedLocation: {
      type: String,
      default: 'Main Store / Library',
    },
    condition: {
      type: String,
      enum: ['Good', 'Fair', 'Needs Repair', 'Damaged'],
      default: 'Good',
    },
    unitCost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssetItem', assetItemSchema);
