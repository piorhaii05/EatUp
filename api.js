const express = require('express');
const mongoose = require('mongoose');
const { UserModel, ProductModel, CategoryModel } = require('./eatUpModel');
const COMMON = require('./COMMON');

const router = express.Router();

module.exports = router;

// Test
router.get('/', (req, res) => {
    res.send('Vào API mobile');
});

// ------------------ USER ------------------

// Lấy danh sách user
router.get('/list', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const users = await UserModel.find();
    res.send(users);
});

// Thêm user
router.post('/add', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const newUser = req.body;
        const user = await UserModel.create(newUser);
        res.status(200).send(user);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({ message: 'Email đã tồn tại!' });
        } else {
            res.status(500).send({ message: 'Lỗi server!', error: error.message });
        }
    }
});

// Sửa user
router.put('/update/:id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const id = req.params.id;
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    res.send(updatedUser);
});

// Xóa user
router.delete('/delete/:id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    res.send({ message: 'Đã xóa', data: deleted });
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const { email, password_hash, role } = req.body;

        if (!email || !password_hash || !role) {
            return res.status(400).send({ message: 'Thiếu thông tin đăng nhập!' });
        }

        const user = await UserModel.findOne({ email, role });

        if (!user || user.password_hash !== password_hash) {
            return res.status(401).send({ message: 'Thông tin tài khoản của bạn không chính xác!' });
        }

        res.status(200).send({
            message: 'Đăng nhập thành công!',
            user: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server!', error: error.message });
    }
});

// ------------------ PRODUCT ------------------

// Lấy tất cả sản phẩm
router.get('/product', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const products = await ProductModel.find();
    res.send(products);
});

// Thêm sản phẩm mới
router.post('/product', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    try {
        const product = await ProductModel.create(req.body);
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Lấy sản phẩm phổ biến theo rating giảm dần và chỉ lấy sản phẩm đang mở bán, rating > 4.5
router.get('/product/highest-rated', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const products = await ProductModel.find({
            status: true,
            rating: { $gt: 4.5 }
        })
            .sort({ rating: -1 })
            .limit(10);

        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server!', error: error.message });
    }
});

// Sản phẩm phổ biến theo số lượt mua cao nhất
router.get('/product/popular', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const products = await ProductModel.find({ status: true })
            .sort({ purchases: -1 }) // Giảm dần theo purchases
            .limit(7);               // Lấy đúng 7 sản phẩm

        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server!', error: error.message });
    }
});




// ------------------ CATEGORY ------------------

// Lấy danh sách category (hiển thị ảnh luôn)
router.get('/category', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const categories = await CategoryModel.find();
    res.send(categories);
});