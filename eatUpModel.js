const mongoose = require('mongoose');

const EatUpSchema = new mongoose.Schema({
    name: {type: String, default: '', required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String,  default: '', required: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: 'User', required: true },
    avatar_url: { type: String, default: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg' },
    gender: {type: String, default: 'Chưa cập nhập'}
});

const ProductSchema = new mongoose.Schema({
    restaurant_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image_url: { type: String, default: '' },
    status: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
    purchases: { type: Number, default: 0 },
    category:  {type: String }
}, { timestamps: true }); 


const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image_url: { type: String, required: true },
  color: {type: String,}
}); 

const CartSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    items: [
        {
            product_id: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            restaurant_id: { type: String }
        }
    ]
});

const FavoriteSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
});

const AddressSchema = new mongoose.Schema({
    user_id: String,
    name: String,
    phone: String,
    city: String,
    ward: String,
    street: String,
    is_default: { type: Boolean, default: false }
});

const BankSchema = new mongoose.Schema({
    user_id: String,
    card_number: String,
    card_holder: String,
    expiry_date: String,
    is_default: { type: Boolean, default: false }
});

const OrderItemSchema = new mongoose.Schema({
    product_id: String,
    quantity: Number,
    price: Number
});

const OrderSchema = new mongoose.Schema({
    user_id: String,
    restaurant_id: String,
    items: [OrderItemSchema],
    total_amount: Number,
    status: { type: String, default: 'pending' }, // pending, paid, canceled
    createdAt: { type: Date, default: Date.now },
    payment_method: String,
    address_id: String,
    bank_id: String
});


const FavoriteModel = mongoose.model('favorite', FavoriteSchema);
const CartModel = mongoose.model('cart', CartSchema);
const UserModel = mongoose.model('user', EatUpSchema);
const ProductModel = mongoose.model('menu_item', ProductSchema);
const CategoryModel = mongoose.model('categorie', CategorySchema);
const AddressModel = mongoose.model('address', AddressSchema);
const BankModel = mongoose.model('bank', BankSchema);
const OrderModel = mongoose.model('order', OrderSchema);

module.exports = { UserModel, ProductModel, CategoryModel, CartModel, FavoriteModel, AddressModel, BankModel, OrderModel };