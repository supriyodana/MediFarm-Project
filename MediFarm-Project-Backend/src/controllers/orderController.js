const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const mongoose = require("mongoose");



// ===========================================Place order from cart (for User )=================================================
exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, paymentMethod } = req.body;

    // shipping address  validation----------------------------------
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || 
        !shippingAddress.phone) {
      return res.status(400).json({ error: "Please provide complete shipping address" });
    }

    
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: "items.product",
        select: "name price stock"
      })
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock availability and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (product.stock < cartItem.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` 
        });
      }

      const itemTotal = cartItem.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
        total: itemTotal
      });

      // *** reduce product stock
      product.stock -= cartItem.quantity;
      await product.save({ session });
    }

    // create order --------------------------------
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save({ session });

    // clear cart -------------------------------
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ 
      message: "Order placed successfully", 
      data: order,
      orderId: order.orderId
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




//==================================================================Get user's orders=================================================
exports.getMyOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "items.product",
        select: "name image med_id"
      });

    res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// =================================================Get order details=========================================================
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId,
      user: req.user.id 
    }).populate({
      path: "items.product",
      select: "name image med_id description category"
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ===============================================Cancel order ==============================================================
exports.cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Order not found" });
    }

    
    if (order.orderStatus === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    if (order.orderStatus === "delivered") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Cannot cancel delivered order" });
    }

    if (order.orderStatus === "shipped") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        error: "Order is already shipped. Please contact customer support." 
      });
    }

    // product stock restore
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    
    order.orderStatus = "cancelled";
    order.cancelledBy = "user";
    order.cancellationReason = reason || "Cancelled by user";
    order.cancelledAt = new Date();

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      message: "Order cancelled successfully", 
      data: order 
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//======================================================Get all orders(for Admin)=================================================
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate({
        path: "user",
        select: "name email"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({ 
      data: orders, 
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




// ================================================Get order details(for Admin)=========================================================
exports.getOrderDetailsAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate({
        path: "user",
        select: "name email phone"
      })
      .populate({
        path: "items.product",
        select: "name image med_id category"
      });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// =========================================================Update order status(for Admin)==================================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, estimatedDelivery } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    
    if (status === "delivered" && order.orderStatus !== "delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "completed"; // Auto-complete payment on delivery for COD
    }

    
    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      order.cancelledBy = "admin";
      order.cancellationReason = req.body.cancellationReason || "Cancelled by admin";
      order.cancelledAt = new Date();

      
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.orderStatus = status;
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    await order.save();

    res.json({ 
      message: "Order status updated", 
      data: order 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// =========================================================Update payment status(for Admin)==================================================
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "completed", "failed"];
    
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ 
        error: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ 
      message: "Payment status updated", 
      data: order 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};