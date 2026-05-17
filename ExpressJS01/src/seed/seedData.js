require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');

const categories = [
    { name: 'iPhone', slug: 'iphone', description: 'Điện thoại Apple iPhone', image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400' },
    { name: 'Samsung', slug: 'samsung', description: 'Điện thoại Samsung Galaxy', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400' },
    { name: 'Xiaomi', slug: 'xiaomi', description: 'Điện thoại Xiaomi', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400' },
    { name: 'Phụ kiện', slug: 'phu-kien', description: 'Phụ kiện điện thoại', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Connected to database');

        // Xóa dữ liệu cũ
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared old data');

        // Tạo danh mục
        const createdCategories = await Category.insertMany(categories);
        console.log(`Created ${createdCategories.length} categories`);
        const catMap = {};
        createdCategories.forEach(c => catMap[c.slug] = c._id);

        // Tạo sản phẩm
        const products = [
            // iPhone
            {
                name: 'iPhone 16 Pro Max 256GB',
                slug: 'iphone-16-pro-max-256gb',
                description: 'iPhone 16 Pro Max sở hữu chip A18 Pro mạnh mẽ, camera 48MP với khả năng zoom quang học 5x, màn hình Super Retina XDR 6.9 inch, pin lâu bền nhất từ trước đến nay. Thiết kế titan cao cấp, hỗ trợ Apple Intelligence.',
                price: 33990000,
                originalPrice: 36990000,
                images: [
                    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
                    'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=600'
                ],
                category: catMap['iphone'],
                stock: 50, sold: 320,
                isPromotion: true, isNew: true, isBestSeller: true,
                specs: { screen: '6.9 inch', chip: 'A18 Pro', ram: '8GB', storage: '256GB', battery: '4685mAh' },
                rating: 4.9, reviewCount: 256
            },
            {
                name: 'iPhone 16 Pro 128GB',
                slug: 'iphone-16-pro-128gb',
                description: 'iPhone 16 Pro với chip A18 Pro, camera 48MP, màn hình 6.3 inch Super Retina XDR. Thiết kế titan nhẹ, nút Action tiện lợi.',
                price: 28490000,
                originalPrice: 30990000,
                images: [
                    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'
                ],
                category: catMap['iphone'],
                stock: 35, sold: 210,
                isPromotion: true, isNew: true, isBestSeller: false,
                specs: { screen: '6.3 inch', chip: 'A18 Pro', ram: '8GB', storage: '128GB', battery: '4323mAh' },
                rating: 4.8, reviewCount: 189
            },
            {
                name: 'iPhone 15 128GB',
                slug: 'iphone-15-128gb',
                description: 'iPhone 15 với chip A16 Bionic, Dynamic Island, camera 48MP chụp ảnh đẹp, cổng USB-C tiện lợi. Giá tốt nhất phân khúc.',
                price: 19990000,
                originalPrice: 22990000,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
                    'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=600'
                ],
                category: catMap['iphone'],
                stock: 80, sold: 540,
                isPromotion: true, isNew: false, isBestSeller: true,
                specs: { screen: '6.1 inch', chip: 'A16 Bionic', ram: '6GB', storage: '128GB', battery: '3877mAh' },
                rating: 4.7, reviewCount: 423
            },
            {
                name: 'iPhone 14 128GB',
                slug: 'iphone-14-128gb',
                description: 'iPhone 14 chip A15 Bionic, camera kép 12MP, phát hiện tai nạn SOS vệ tinh. Giá rẻ nhất dòng iPhone.',
                price: 16490000,
                originalPrice: 19990000,
                images: [
                    'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=600'
                ],
                category: catMap['iphone'],
                stock: 100, sold: 890,
                isPromotion: true, isNew: false, isBestSeller: true,
                specs: { screen: '6.1 inch', chip: 'A15 Bionic', ram: '6GB', storage: '128GB', battery: '3279mAh' },
                rating: 4.6, reviewCount: 678
            },
            // Samsung
            {
                name: 'Samsung Galaxy S25 Ultra 256GB',
                slug: 'samsung-galaxy-s25-ultra-256gb',
                description: 'Galaxy S25 Ultra trang bị chip Snapdragon 8 Elite, camera 200MP, bút S Pen tích hợp, màn hình Dynamic AMOLED 2X 6.9 inch. AI Galaxy mạnh mẽ.',
                price: 33990000,
                originalPrice: 36990000,
                images: [
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
                    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600'
                ],
                category: catMap['samsung'],
                stock: 40, sold: 280,
                isPromotion: true, isNew: true, isBestSeller: true,
                specs: { screen: '6.9 inch', chip: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', battery: '5000mAh' },
                rating: 4.8, reviewCount: 198
            },
            {
                name: 'Samsung Galaxy S25+ 256GB',
                slug: 'samsung-galaxy-s25-plus-256gb',
                description: 'Galaxy S25+ với Snapdragon 8 Elite, camera 50MP, màn hình 6.7 inch sáng rực rỡ. Galaxy AI tích hợp sẵn.',
                price: 26990000,
                originalPrice: 28990000,
                images: [
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
                    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600'
                ],
                category: catMap['samsung'],
                stock: 55, sold: 150,
                isPromotion: false, isNew: true, isBestSeller: false,
                specs: { screen: '6.7 inch', chip: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', battery: '4900mAh' },
                rating: 4.7, reviewCount: 134
            },
            {
                name: 'Samsung Galaxy A55 5G 128GB',
                slug: 'samsung-galaxy-a55-5g-128gb',
                description: 'Galaxy A55 5G tầm trung nổi bật với thiết kế kim loại, camera OIS 50MP, chống nước IP67, pin 5000mAh.',
                price: 9490000,
                originalPrice: 10990000,
                images: [
                    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600'
                ],
                category: catMap['samsung'],
                stock: 120, sold: 670,
                isPromotion: true, isNew: false, isBestSeller: true,
                specs: { screen: '6.6 inch', chip: 'Exynos 1480', ram: '8GB', storage: '128GB', battery: '5000mAh' },
                rating: 4.5, reviewCount: 345
            },
            {
                name: 'Samsung Galaxy Z Flip6 256GB',
                slug: 'samsung-galaxy-z-flip6-256gb',
                description: 'Galaxy Z Flip6 gập nhỏ gọn thời trang, chip Snapdragon 8 Gen 3, camera FlexCam 50MP, Galaxy AI.',
                price: 25990000,
                originalPrice: 28990000,
                images: [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'
                ],
                category: catMap['samsung'],
                stock: 30, sold: 95,
                isPromotion: true, isNew: false, isBestSeller: false,
                specs: { screen: '6.7 inch', chip: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', battery: '4000mAh' },
                rating: 4.6, reviewCount: 87
            },
            // Xiaomi
            {
                name: 'Xiaomi 15 Ultra 512GB',
                slug: 'xiaomi-15-ultra-512gb',
                description: 'Xiaomi 15 Ultra flagship với camera Leica 50MP, chip Snapdragon 8 Elite, sạc nhanh 90W, màn hình AMOLED 2K.',
                price: 23990000,
                originalPrice: 25990000,
                images: [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
                    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600'
                ],
                category: catMap['xiaomi'],
                stock: 25, sold: 120,
                isPromotion: false, isNew: true, isBestSeller: false,
                specs: { screen: '6.73 inch', chip: 'Snapdragon 8 Elite', ram: '16GB', storage: '512GB', battery: '5500mAh' },
                rating: 4.7, reviewCount: 89
            },
            {
                name: 'Xiaomi Redmi Note 14 Pro+ 5G 256GB',
                slug: 'xiaomi-redmi-note-14-pro-plus-5g-256gb',
                description: 'Redmi Note 14 Pro+ tầm trung mạnh mẽ với camera 200MP, chip Dimensity 7300 Ultra, sạc nhanh 120W, IP68.',
                price: 8990000,
                originalPrice: 9990000,
                images: [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'
                ],
                category: catMap['xiaomi'],
                stock: 150, sold: 780,
                isPromotion: true, isNew: true, isBestSeller: true,
                specs: { screen: '6.67 inch', chip: 'Dimensity 7300 Ultra', ram: '8GB', storage: '256GB', battery: '5110mAh' },
                rating: 4.6, reviewCount: 456
            },
            {
                name: 'Xiaomi Redmi 14C 128GB',
                slug: 'xiaomi-redmi-14c-128gb',
                description: 'Redmi 14C giá rẻ với màn hình 6.88 inch lớn nhất phân khúc, pin 5160mAh, camera 50MP AI.',
                price: 3190000,
                originalPrice: 3690000,
                images: [
                    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600'
                ],
                category: catMap['xiaomi'],
                stock: 200, sold: 1200,
                isPromotion: true, isNew: false, isBestSeller: true,
                specs: { screen: '6.88 inch', chip: 'Helio G81 Ultra', ram: '4GB', storage: '128GB', battery: '5160mAh' },
                rating: 4.3, reviewCount: 892
            },
            {
                name: 'Xiaomi POCO X7 Pro 256GB',
                slug: 'xiaomi-poco-x7-pro-256gb',
                description: 'POCO X7 Pro hiệu năng khủng với Dimensity 8400 Ultra, màn hình AMOLED 120Hz, sạc 90W siêu nhanh.',
                price: 7990000,
                originalPrice: 8990000,
                images: [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
                    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600'
                ],
                category: catMap['xiaomi'],
                stock: 85, sold: 340,
                isPromotion: false, isNew: true, isBestSeller: false,
                specs: { screen: '6.67 inch', chip: 'Dimensity 8400 Ultra', ram: '8GB', storage: '256GB', battery: '6000mAh' },
                rating: 4.5, reviewCount: 234
            },
            // Phụ kiện
            {
                name: 'AirPods Pro 2 (USB-C)',
                slug: 'airpods-pro-2-usb-c',
                description: 'AirPods Pro 2 với chip H2, chống ồn chủ động ANC thế hệ mới, âm thanh không gian, cổng USB-C tiện lợi.',
                price: 5990000,
                originalPrice: 6790000,
                images: [
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
                    'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'
                ],
                category: catMap['phu-kien'],
                stock: 70, sold: 450,
                isPromotion: true, isNew: false, isBestSeller: true,
                specs: { type: 'TWS', chip: 'H2', anc: 'Có', battery: '6h (30h với case)' },
                rating: 4.8, reviewCount: 312
            },
            {
                name: 'Sạc nhanh Apple 20W USB-C',
                slug: 'sac-nhanh-apple-20w-usb-c',
                description: 'Bộ sạc Apple 20W chính hãng, hỗ trợ sạc nhanh cho iPhone và iPad, thiết kế nhỏ gọn.',
                price: 490000,
                originalPrice: 590000,
                images: [
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'
                ],
                category: catMap['phu-kien'],
                stock: 300, sold: 1500,
                isPromotion: false, isNew: false, isBestSeller: true,
                specs: { power: '20W', port: 'USB-C', compatible: 'iPhone, iPad' },
                rating: 4.4, reviewCount: 567
            },
            {
                name: 'Ốp lưng MagSafe iPhone 16 Pro Max',
                slug: 'op-lung-magsafe-iphone-16-pro-max',
                description: 'Ốp lưng MagSafe chính hãng Apple cho iPhone 16 Pro Max, chất liệu silicon cao cấp, nhiều màu sắc.',
                price: 1290000,
                originalPrice: 1490000,
                images: [
                    'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'
                ],
                category: catMap['phu-kien'],
                stock: 150, sold: 680,
                isPromotion: true, isNew: true, isBestSeller: false,
                specs: { material: 'Silicon', magsafe: 'Có', compatible: 'iPhone 16 Pro Max' },
                rating: 4.3, reviewCount: 234
            },
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} products`);
        console.log('\n✅ Seed data completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedDB();
