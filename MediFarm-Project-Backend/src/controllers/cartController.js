const Cart = require("../models/cart");
const Product = require("../models/product");

// get user's cart--------------------------------------------------------------
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate({
            path: "items.product",
            select: "name price stock category image med_id"
        });

        if (!cart) {
            return res.json({ data: { items: [], totalPrice: 0 } });
        }

        res.json({ data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// add item to cart----------------------------------------------------------
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;


        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }


        if (product.stock < quantity) {
            return res.status(400).json({
                error: `Only ${product.stock} items available in stock`
            });
        }


        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: [{
                    product: productId,
                    quantity,
                    price: product.price
                }]
            });
        } else {

            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (existingItemIndex > -1) {

                const newQuantity = cart.items[existingItemIndex].quantity + quantity;

                if (product.stock < newQuantity) {
                    return res.status(400).json({
                        error: `Cannot add more items. Only ${product.stock} available in stock`
                    });
                }

                cart.items[existingItemIndex].quantity = newQuantity;
            } else {

                cart.items.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
            }
        }

        await cart.save();
        await cart.populate({
            path: "items.product",
            select: "name price stock category image med_id"
        });

        res.json({
            message: "Item added to cart",
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// update cart item quantity ---------------------------------------------
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "Quantity must be at least 1" });
        }

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        
        if (product.stock < quantity) {
            return res.status(400).json({
                error: `Only ${product.stock} items available in stock`
            });
        }

        
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        
        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        await cart.populate({
            path: "items.product",
            select: "name price stock category image med_id"
        });

        res.json({
            message: "Cart updated",
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// remove item from cart-------------------------------------------------------------
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        
        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        if (cart.items.length > 0) {
            await cart.populate({
                path: "items.product",
                select: "name price stock category image med_id"
            });
        }

        res.json({
            message: "Item removed from cart",
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// clear cart -------------------------------------------------------------
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [], totalPrice: 0 },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.json({
            message: "Cart cleared",
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};