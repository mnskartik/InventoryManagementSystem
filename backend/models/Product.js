const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  Product_name: { 
    type: String, 
    required: true,
    trim: true
  },
  Product_Id: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
  },
  Category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Beverage', 'Cleaning', 'Personal Care', 'Electronics', 'Other']
  },
  Price: { 
    type: Number, 
    required: true,
    min: 0
  },
  Quantity: { 
    type: Number, 
    required: true,
    min: 0
  },
  Unit: {
    type: String,
    required: true,
    enum: ['pcs', 'kg', 'g', 'l', 'ml', 'pack']
  },
   Expiry_Date: {
    type: Date,
    required: false,
    validate: {
      validator: function (date) {
        // Only run the validation if a date is provided
        // This is crucial since required is set to false
        if (date) { 
          return date > new Date();
        }
        return true; // Return true if no date is provided
      },
      message: 'Expiry date must be in the future'
    }
  },
  Threshold_value: { 
    type: Number, 
    required: true,
    min: 1
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String,
    required: false,
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }}, {
  timestamps: true
});

// Indexes for search and performance
ProductSchema.index({ Product_name: 'text', Category: 'text' });
ProductSchema.index({ Expiry_Date: 1 });
ProductSchema.index({ Quantity: 1 });

module.exports = mongoose.model("Product", ProductSchema);
