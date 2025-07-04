const express = require('express');
const mongoose = require('mongoose');
const { UserModel, ProductModel, CategoryModel, CartModel, FavoriteModel, AddressModel, BankModel, OrderModel, VoucherModel } = require('./eatUpModel');
const COMMON = require('./COMMON');

const router = express.Router();

const multer = require('multer');
const path = require('path');

module.exports = router;

// Upload ảnh
// Khởi tạo multer để lưu trữ file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // **Quan trọng:** Đảm bảo thư mục 'uploads' này tồn tại
        // trong thư mục gốc của dự án backend của bạn.
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Đổi tên file để tránh trùng lặp, ví dụ: timestamp + đuôi file gốc
        // Đây sẽ là "linkanh" trong đường dẫn "uploads/linkanh.jpg" của bạn.
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// Route để xử lý tải lên ảnh
router.post('/upload', upload.single('image'), (req, res) => {
    // 'image' ở đây phải khớp với tên trường bạn gửi từ FormData ở frontend (`formData.append('image', ...)`).
    if (req.file) {
        // **Backend trả về tên file và đường dẫn tương đối (để frontend sử dụng)**
        // Ví dụ: filename: "1678901234567-12345.jpg", url: "/uploads/1678901234567-12345.jpg"
        res.status(200).json({ 
            message: 'Upload thành công', 
            filename: req.file.filename, 
            url: `uploads/${req.file.filename}` // Đây là đường dẫn tương đối bạn muốn
        });
    } else {
        res.status(400).json({ message: 'Không tìm thấy file ảnh' });
    }
});
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

        // Trả về thông tin cần thiết, ép _id thành string, không gửi password_hash
        res.status(200).send({
            message: 'Đăng nhập thành công!',
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar_url: user.avatar_url,
                gender: user.gender || 'Chưa cập nhập',
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server!', error: error.message });
    }
});

router.put('/change-password/:id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const { old_password, new_password } = req.body;
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ message: 'Không tìm thấy người dùng' });
        }

        if (user.password_hash !== old_password) {
            return res.status(400).send({ message: 'Mật khẩu cũ không đúng!' });
        }

        user.password_hash = new_password;
        await user.save();

        res.send({ message: 'Đổi mật khẩu thành công!' });
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

// Lấy sản phẩm theo id
router.get('/product/by-restaurant/:restaurant_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const products = await ProductModel.find({ restaurant_id: req.params.restaurant_id });
    res.send(products);
});

// Thêm sản phẩm mới
router.post('/product', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { restaurant_id, name, price } = req.body;

    if (!restaurant_id || !name || !price) {
        return res.status(400).send({ message: 'Thiếu dữ liệu bắt buộc!' });
    }

    try {
        const product = await ProductModel.create(req.body);
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Xóa sản phẩm
router.delete('/product/:id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    await ProductModel.findByIdAndDelete(req.params.id);
    res.send({ message: 'Đã xóa sản phẩm' });
});

// Sửa sản phẩm
router.put('/product/:id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
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

// Sản phẩm mới nhất theo ngày thêm (giảm dần)
router.get('/product/newest', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const products = await ProductModel.find({ status: true })
            .sort({ createdAt: -1 })  // Sắp xếp theo thời gian thêm mới nhất
            .limit(10);               // Giới hạn số lượng, có thể điều chỉnh

        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server!', error: error.message });
    }
});

router.get('/product/search', async (req, res) => {
    console.log('Received search request');
    const { name } = req.query;
    console.log('Search query:', name); // Kiểm tra xem `name` có nhận được không

    if (!name) {
        console.log('No search name provided, returning 400.');
        return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm (name).' });
    }

    try {
        // Kiểm tra xem Product model có được import đúng không
        // console.log('Product model:', Product); 
        const products = await ProductModel.find({
            name: { $regex: name, $options: 'i' },
            status: true
        });
        console.log('Found products:', products.length);
        res.json(products);
    } catch (err) {
        console.error("Error in product search:", err); // In lỗi chi tiết
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm sản phẩm.' });
    }
});

// ------------------ CATEGORY ------------------

// Lấy danh sách category (hiển thị ảnh luôn)
router.get('/category', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const categories = await CategoryModel.find();
    res.send(categories);
});

// ------------------ CART ------------------

// Lấy giỏ hàng theo user_id
router.get('/cart/:user_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const cart = await CartModel.findOne({ user_id: req.params.user_id });

    if (!cart || cart.items.length === 0) {
        return res.send({ user_id: req.params.user_id, items: [] });
    }

    // Map lại danh sách sản phẩm kèm thông tin chi tiết
    const detailedItems = await Promise.all(cart.items.map(async (item) => {
        const product = await ProductModel.findById(item.product_id);
        return {
            product_id: item.product_id,
            quantity: item.quantity,
            product_name: product?.name || '',
            product_image: product?.image_url || '',
            product_price: product?.price || 0
        };
    }));

    res.send({
        user_id: req.params.user_id,
        items: detailedItems
    });
});


// Thêm hoặc cập nhật sản phẩm trong giỏ hàng
router.post('/cart/add', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, product_id, quantity } = req.body;

    const product = await ProductModel.findById(product_id);
    if (!product) {
        return res.status(404).send({ message: 'Sản phẩm không tồn tại' });
    }

    const restaurant_id = product.restaurant_id;

    let cart = await CartModel.findOne({ user_id });

    if (!cart) {
        cart = await CartModel.create({
            user_id,
            items: [{ product_id, quantity, restaurant_id }]
        });
    } else {
        const existingItem = cart.items.find(item => item.product_id === product_id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product_id, quantity, restaurant_id });
        }
        await cart.save();
    }

    res.send(cart);
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/cart/update', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || quantity === undefined) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    const cart = await CartModel.findOne({ user_id });

    if (cart) {
        const item = cart.items.find(item => item.product_id === product_id);
        if (item) {
            item.quantity = quantity;
            await cart.save();
            return res.send(cart);
        }
    }

    res.status(404).send({ message: 'Không tìm thấy sản phẩm trong giỏ' });
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/cart/remove', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    const cart = await CartModel.findOne({ user_id });

    if (cart) {
        cart.items = cart.items.filter(item => item.product_id !== product_id);
        await cart.save();
        return res.send(cart);
    }

    res.status(404).send({ message: 'Không tìm thấy giỏ hàng' });
});

router.delete('/cart/clear/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        await CartModel.deleteOne({ user_id });
        return res.json({ message: 'Đã xoá toàn bộ giỏ hàng' });
    } catch (error) {
        console.error('Lỗi khi xoá giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
});


// ------------------ Favorite ------------------

// Lấy danh sách sản phẩm yêu thích của user
router.get('/favorite/:user_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const favorites = await FavoriteModel.find({ user_id: req.params.user_id });

    // Lấy thông tin chi tiết từng sản phẩm
    const detailedFavorites = await Promise.all(favorites.map(async (item) => {
        const product = await ProductModel.findById(item.product_id);
        return {
            product_id: item.product_id,
            product_name: product?.name || '',
            product_image: product?.image_url || '',
            product_price: product?.price || 0
        };
    }));

    res.send(detailedFavorites);
});


// Thêm sản phẩm vào danh sách yêu thích
router.post('/favorite/add', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    const existing = await FavoriteModel.findOne({ user_id, product_id });
    if (existing) {
        return res.status(200).send({ message: 'Đã có trong danh sách yêu thích' });
    }

    const favorite = await FavoriteModel.create({ user_id, product_id });
    res.send(favorite);
});

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/favorite/remove', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    await FavoriteModel.deleteOne({ user_id, product_id });
    res.send({ message: 'Đã xóa khỏi danh sách yêu thích' });
});


// ------------------ Address ------------------
// Lấy địa chỉ 
router.get('/address/:user_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const addresses = await AddressModel.find({ user_id: req.params.user_id });
    res.send(addresses);
});

// Thêm địa chỉ mới
router.post('/address/add', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, name, phone, city, ward, street } = req.body;

    if (!user_id || !name || !phone || !city || !ward || !street) {
        return res.status(400).send({ message: 'Thiếu thông tin' });
    }

    const newAddress = await AddressModel.create({
        user_id,
        name,
        phone,
        city,
        ward,
        street
    });

    res.send(newAddress);
});

// Xóa địa chỉ
router.delete('/address/remove/:address_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    await AddressModel.findByIdAndDelete(req.params.address_id);
    res.send({ message: 'Đã xóa địa chỉ' });
});

// Cập nhập địa chỉ
router.put('/address/update/:address_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const updated = await AddressModel.findByIdAndUpdate(req.params.address_id, req.body, { new: true });
    res.send(updated);
});

// Đặt địa chỉ default
router.put('/address/set-default', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, address_id } = req.body;

    if (!user_id || !address_id) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    await AddressModel.updateMany({ user_id }, { is_default: false });
    await AddressModel.findByIdAndUpdate(address_id, { is_default: true });

    res.send({ message: 'Đã cập nhật địa chỉ mặc định' });
});

// Lấy địa chỉ mặc định của user
router.get('/address/default/:user_id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const address = await AddressModel.findOne({ user_id: req.params.user_id, is_default: true });
        if (address) {
            res.status(200).json(address);
        } else {
            // Trả về 200 OK với object rỗng hoặc null nếu không tìm thấy,
            // để frontend không báo lỗi JSON Parse, mà xử lý logic "không có địa chỉ mặc định"
            res.status(200).json({}); 
        }
    } catch (error) {
        console.error("Lỗi khi lấy địa chỉ mặc định từ DB:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy địa chỉ mặc định', error: error.message });
    }
});

// ------------------ Payment ------------------
// Lấy tài khoản ngân hàng 
router.get('/bank/:user_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const banks = await BankModel.find({ user_id: req.params.user_id });
    res.send(banks);
});

// Thêm tài khoản mới
router.post('/bank/add', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, card_number, card_holder, expiry_date } = req.body;

    if (!user_id || !card_number || !card_holder || !expiry_date) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    const newBank = await BankModel.create({ user_id, card_number, card_holder, expiry_date });
    res.send(newBank);
});


// Xóa tài khoản
router.delete('/bank/remove/:id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    await BankModel.findByIdAndDelete(req.params.id);
    res.send({ message: 'Đã xóa tài khoản ngân hàng' });
});


// Cập nhập tài khoản
router.put('/bank/update/:id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { card_number, card_holder, expiry_date } = req.body;

    if (!card_number || !card_holder || !expiry_date) {
        return res.status(400).send({ message: 'Thiếu dữ liệu cập nhật' });
    }

    const updatedBank = await BankModel.findByIdAndUpdate(
        req.params.id,
        { card_number, card_holder, expiry_date },
        { new: true }
    );

    res.send(updatedBank);
});

// Đặt tài khoản default
router.put('/bank/set-default', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id, bank_id } = req.body;

    if (!user_id || !bank_id) {
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    await BankModel.updateMany({ user_id }, { is_default: false });
    await BankModel.findByIdAndUpdate(bank_id, { is_default: true });

    res.send({ message: 'Cập nhật mặc định thành công' });
});

// Lấy tài khoản ngân hàng mặc định của user
router.get('/bank/default/:user_id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const bank = await BankModel.findOne({ user_id: req.params.user_id, is_default: true });
        if (bank) {
            res.status(200).json(bank);
        } else {
            // Tương tự, trả về 200 OK với object rỗng hoặc null
            res.status(200).json({});
        }
    } catch (error) {
        console.error("Lỗi khi lấy thẻ ngân hàng mặc định từ DB:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy thẻ ngân hàng mặc định', error: error.message });
    }
});


// ------------------ Order ------------------
// Thêm Đặt hàng
router.post('/order/create', async (req, res) => {
    await mongoose.connect(COMMON.uri);

    const { user_id, items, address_id, bank_id, payment_method, shipping_fee, discount_amount } = req.body; // THÊM shipping_fee và discount_amount từ frontend

    if (!user_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ message: 'Thiếu dữ liệu đơn hàng hoặc danh sách sản phẩm trống' });
    }

    // Lấy thông tin sản phẩm kèm restaurant_id, name, image_url
    const detailedItems = await Promise.all(items.map(async (item) => {
        const product = await ProductModel.findById(item.product_id);
        if (!product) throw new Error(`Không tìm thấy sản phẩm ${item.product_id}`);
        return {
            product_id: item.product_id,
            product_name: product.name, // LẤY TÊN SẢN PHẨM TỪ DB
            product_image: product.image_url, // LẤY HÌNH ẢNH SẢN PHẨM TỪ DB
            quantity: item.quantity,
            price: item.price_at_order || product.price, // Dùng price_at_order nếu có, không thì dùng giá hiện tại
            restaurant_id: product.restaurant_id // Lấy restaurant_id từ sản phẩm
        };
    }));

    // Nhóm sản phẩm theo restaurant_id
    const grouped = {};
    for (let item of detailedItems) {
        if (!grouped[item.restaurant_id]) grouped[item.restaurant_id] = [];
        grouped[item.restaurant_id].push(item);
    }

    const orders = [];

    // Tạo đơn hàng cho từng nhà hàng
    for (let [restaurant_id, groupItems] of Object.entries(grouped)) {
        let total_amount_for_restaurant = 0;
        for (let item of groupItems) {
            total_amount_for_restaurant += item.price * item.quantity;
        }

        // THÊM phí vận chuyển và giảm giá nếu bạn muốn áp dụng cho từng đơn hàng theo nhà hàng
        // Hoặc bạn có thể áp dụng tổng phí/giảm giá ở frontend và chỉ lưu tổng cuối cùng
        // Hiện tại, ta sẽ giả định tổng tiền đã bao gồm phí vận chuyển và giảm giá từ frontend
        // Nếu không, bạn cần tính toán lại ở đây
        const final_total_amount = total_amount_for_restaurant + (shipping_fee || 0) - (discount_amount || 0);


        const order = await OrderModel.create({
            user_id,
            restaurant_id,
            items: groupItems.map(item => ({ // Chỉ lưu các trường cần thiết trong OrderItemSchema
                product_id: item.product_id,
                product_name: item.product_name,
                product_image: item.product_image,
                quantity: item.quantity,
                price: item.price,
            })),
            total_amount: final_total_amount, // Sử dụng tổng tiền đã tính
            status: 'Pending', // Đặt trạng thái ban đầu là 'Pending' hoặc 'Processing'
            payment_method: payment_method || 'COD', // Đặt mặc định là 'COD'
            address_id: address_id || null,
            bank_id: bank_id || null,
            shipping_fee: shipping_fee || 0, // Lưu shipping_fee
            discount_amount: discount_amount || 0, // Lưu discount_amount
        });

        orders.push(order);
    }

    res.send({ message: 'Đã tạo đơn hàng cho từng nhà hàng thành công', orders });
});


// Cập nhập trạng thái thanh toán 
router.put('/order/pay/:order_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const order = await OrderModel.findByIdAndUpdate(
        req.params.order_id,
        { status: 'paid' },
        { new: true }
    );

    if (!order) {
        return res.status(404).send({ message: 'Không tìm thấy đơn hàng' });
    }

    // Xoá giỏ hàng của user sau khi thanh toán thành công
    await CartModel.findOneAndDelete({ user_id: order.user_id });

    res.send({ message: 'Thanh toán thành công', order });
});

// Cập nhật router.get('/order/user/:user_id')
router.get('/order/user/:user_id', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const { user_id } = req.params;
    const { status } = req.query; // Lấy trạng thái từ query (e.g., /order/user/abc?status=Pending)

    let query = { user_id: user_id };
    if (status) {
        query.status = status;
    }

    // THÊM POPULATE VÀO ĐÂY ĐỂ LẤY THÔNG TIN ĐỊA CHỈ VÀ NGÂN HÀNG KHI LẤY DANH SÁCH ORDER
    const orders = await OrderModel.find(query)
        .populate('address_id') // Populate thông tin địa chỉ
        .populate('bank_id')    // Populate thông tin ngân hàng
        .sort({ createdAt: -1 })
        .lean(); // Luôn dùng .lean() khi chỉ đọc dữ liệu để hiệu suất tốt hơn

    // Thêm log để kiểm tra:
    console.log("Orders fetched for user with populate:", orders);

    res.send(orders);
});

// Giữ nguyên route chi tiết order này (vì nó đã đúng logic populate)
router.get('/order/:order_id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const orderId = req.params.order_id;

        // console.log(`Đang tìm đơn hàng với ID: ${orderId}`);
        const order = await OrderModel.findById(orderId)
            .populate('address_id')
            .populate('bank_id')
            .lean();

        console.log("Kết quả Populate order:", order);

        if (!order) {
            console.log(`Không tìm thấy đơn hàng với ID: ${orderId}`);
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        res.status(200).json(order);

    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng', error: error.message });
    }
});

router.put('/order/cancel/:order_id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const orderId = req.params.order_id;

        console.log(`Yêu cầu hủy đơn hàng với ID: ${orderId}`);

        // Tìm đơn hàng theo ID
        const order = await OrderModel.findById(orderId);

        if (!order) {
            console.log(`Không tìm thấy đơn hàng với ID: ${orderId} để hủy.`);
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Kiểm tra trạng thái đơn hàng: Chỉ cho phép hủy nếu trạng thái là 'Pending'
        if (order.status !== 'Pending') {
            console.log(`Không thể hủy đơn hàng ${orderId}. Trạng thái hiện tại: '${order.status}'.`);
            return res.status(400).json({ message: `Không thể hủy đơn hàng có trạng thái '${order.status}'. Chỉ đơn hàng 'Pending' mới có thể hủy.` });
        }

        // Cập nhật trạng thái của đơn hàng thành 'Cancelled'
        order.status = 'Cancelled';
        await order.save();

        console.log(`Đơn hàng ${orderId} đã được hủy thành công.`);
        res.status(200).json({ message: 'Đơn hàng đã được hủy thành công', order: order });

    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        res.status(500).json({ message: 'Lỗi server khi hủy đơn hàng', error: error.message });
    } finally {
        // mongoose.connection.close();
    }
});

// =========================================================
//                  VOUCHER ROUTES
// =========================================================

// Route 1: Lấy tất cả voucher đang hoạt động và còn hiệu lực
// Có thể thêm query param để lọc voucher khả dụng cho user cụ thể sau này
router.get('/vouchers', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const now = new Date();
        const availableVouchers = await VoucherModel.find({
            active: true,
            start_date: { $lte: now },
            end_date: { $gte: now },
            $or: [
                { usage_limit: { $eq: null } }, // Voucher không có giới hạn sử dụng
                // Điều kiện mới: usage_limit không phải null VÀ used_count < usage_limit
                {
                    // Đây là object cho trường hợp có giới hạn sử dụng và chưa dùng hết
                    usage_limit: { $ne: null },
                    $expr: { $lt: ['$used_count', '$usage_limit'] }
                }
            ]
        }).sort({ end_date: 1 });

        res.status(200).json(availableVouchers);

    } catch (error) {
        console.error("Lỗi CHI TIẾT khi tải danh sách voucher:", error);
        res.status(500).json({ message: 'Lỗi server khi tải danh sách voucher', error: error.message });
    }
});

// Route 2: Lấy voucher theo ID (nếu cần xem chi tiết voucher nào đó)
router.get('/vouchers/:id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const voucher = await VoucherModel.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ message: 'Không tìm thấy voucher' });
        }
        res.status(200).json(voucher);
    } catch (error) {
        console.error("Lỗi khi lấy voucher theo ID:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy voucher', error: error.message });
    }
});

// Route 3: Áp dụng/Kiểm tra tính hợp lệ của voucher (quan trọng cho màn thanh toán)
// Body: { code: "VOUCHERCODE", userId: "someUserId", totalAmount: 150 }
router.post('/vouchers/apply', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);
        const { code, userId, totalAmount } = req.body;

        if (!code || !userId || totalAmount === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết (code, userId, totalAmount).' });
        }

        const now = new Date();
        const voucher = await VoucherModel.findOne({ code: code.toUpperCase() });

        if (!voucher) {
            return res.status(404).json({ message: 'Mã voucher không tồn tại.' });
        }

        if (!voucher.active) {
            return res.status(400).json({ message: 'Mã voucher này không còn hiệu lực.' });
        }

        if (now < voucher.start_date || now > voucher.end_date) {
            return res.status(400).json({ message: 'Mã voucher này chưa đến thời gian áp dụng hoặc đã hết hạn.' });
        }

        if (voucher.usage_limit !== null && voucher.used_count >= voucher.usage_limit) {
            return res.status(400).json({ message: 'Mã voucher này đã hết lượt sử dụng.' });
        }

        if (totalAmount < voucher.min_order_amount) {
            return res.status(400).json({ message: `Đơn hàng tối thiểu để áp dụng voucher là ${voucher.min_order_amount}$.` });
        }

        let discountAmount = 0;
        if (voucher.discount_type === 'percentage') {
            discountAmount = totalAmount * (voucher.discount_value / 100);
            if (voucher.max_discount_amount !== null && discountAmount > voucher.max_discount_amount) {
                discountAmount = voucher.max_discount_amount;
            }
        } else if (voucher.discount_type === 'fixed') {
            discountAmount = voucher.discount_value;
        }

        // Trả về thông tin voucher và số tiền giảm giá
        res.status(200).json({
            message: 'Voucher hợp lệ!',
            voucher: voucher,
            discount_amount: discountAmount,
            final_amount: totalAmount - discountAmount
        });

    } catch (error) {
        console.error("Lỗi khi áp dụng voucher:", error);
        res.status(500).json({ message: 'Lỗi server khi áp dụng voucher', error: error.message });
    } finally {
        // mongoose.connection.close();
    }
});


router.put('/vouchers/increase-used-count/:id', async (req, res) => {
  try {
    const voucherId = req.params.id;
    const voucher = await VoucherModel.findById(voucherId); // Tìm voucher bằng ID

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tìm thấy.' });
    }

    voucher.used_count += 1; // Tăng used_count lên 1
    await voucher.save(); // Lưu thay đổi vào cơ sở dữ liệu

    res.status(200).json({ message: 'Used count đã được cập nhật thành công.', voucher });
  } catch (error) {
    console.error('Lỗi khi cập nhật used_count của voucher:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật voucher.' });
  }
});
