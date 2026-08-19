-- ========================================================
-- KỊCH BẢN TẠO BẢNG VÀ NẠP DỮ LIỆU MẪU DỰ ÁN MINI-SHOP (SUPABASE)
-- RLS (Row Level Security) tạm thời tắt theo yêu cầu.
-- ========================================================

-- 1. XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI (RESET)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. TẠO BẢNG DANH MỤC (categories)
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TẠO BẢNG SẢN PHẨM (products)
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TẠO BẢNG ĐƠN HÀNG (orders)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  payment_method TEXT DEFAULT 'cod',
  items_summary TEXT,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TẠO BẢNG CHI TIẾT ĐƠN HÀNG (order_items)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- 6. TẠO BẢNG HỒ SƠ & PHÂN VAI NGƯỜI DÙNG (profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TẮT RLS TRÊN TẤT CẢ CÁC BẢNG (Chưa bật khóa an toàn lúc này)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ========================================================
-- 7. NẠP DỮ LIỆU BAN ĐẦU (SEED DATA)
-- ========================================================

-- Nạp 6 Danh mục sản phẩm
INSERT INTO categories (id, name) VALUES
  ('noi-that', 'Nội thất'),
  ('trang-tri', 'Trang trí'),
  ('nha-bep', 'Nhà bếp'),
  ('den', 'Đèn'),
  ('van-phong', 'Văn phòng'),
  ('luu-tru', 'Lưu trữ');

-- Nạp 10 Sản phẩm chính thức của MINI-SHOP
INSERT INTO products (id, name, category_id, price, description, image, featured) VALUES
  (1, 'Sofa 2 chỗ Nordic', 'noi-that', 2990000, 'Thiết kế tối giản, êm ái', '/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp', true),
  (2, 'Bàn ăn gỗ Sồi', 'noi-that', 3490000, 'Gỗ sồi tự nhiên, bền đẹp', '/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp', true),
  (3, 'Đèn thả trần Minimal', 'den', 599000, 'Ánh sáng dịu nhẹ, tinh tế', '/assets/images/products/do-my-nghe/den-tre-thu-cong.webp', true),
  (4, 'Bình gốm Decor', 'trang-tri', 290000, 'Gốm sứ cao cấp, trang nhã', '/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp', true),
  (5, 'Kệ gỗ đa năng', 'noi-that', 1293000, 'Tiết kiệm không gian', '/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp', true),
  (6, 'Giỏ mây lưu trữ', 'luu-tru', 199000, 'Thân thiện, tiện dụng', '/assets/images/products/do-thu-cong/gio-may-dan.webp', true),
  (7, 'Khay gỗ hoa văn', 'nha-bep', 320000, 'Khắc họa hoa văn tinh xảo', '/assets/images/products/do-thu-cong/khay-go-hoa-van.webp', false),
  (8, 'Tranh treo Macrame', 'trang-tri', 450000, 'Đan thủ công phong cách Boho', '/assets/images/products/do-thu-cong/tranh-treo-macrame.webp', false),
  (9, 'Chậu cây để bàn', 'van-phong', 180000, 'Trang trí góc làm việc xanh', '/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp', false),
  (10, 'Đèn lồng tre', 'den', 380000, 'Phong cách mộc mạc truyền thống', '/assets/images/products/do-my-nghe/den-long-tre.webp', false);
