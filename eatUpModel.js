const mongoose = require('mongoose');

const EatUpSchema = new mongoose.Schema({
    name: {type: String, default: '', required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String,  default: '', required: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: 'User', required: true },
    avatar_url: { type: String, default: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg' }
});

const ProductSchema = new mongoose.Schema({
    restaurant_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image_url: { type: String, default: '' },
    status: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },
    purchases: { type: Number, default: 0 }
});


const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image_url: { type: String, required: true },
  color: {type: String,}
}); 

const UserModel = mongoose.model('user', EatUpSchema);
const ProductModel = mongoose.model('menu_item', ProductSchema);
const CategoryModel = mongoose.model('categorie', CategorySchema);

module.exports = { UserModel, ProductModel, CategoryModel };