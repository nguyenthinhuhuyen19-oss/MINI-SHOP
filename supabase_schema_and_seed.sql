-- ========================================================
-- KỊCH BẢN TẠO BẢNG, NẠP DỮ LIỆU VÀ CẤU HÌNH RLS DỰ ÁN MINI-SHOP (SUPABASE)
-- ========================================================

-- 1. XÓA BẢNG VÀ HÀM CỦ NẾU ĐÃ TỒN TẠI (RESET)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;

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

-- 4. TẠO BẢNG HỒ SƠ NGƯỜI DÙNG & PHÂN VAI (profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TẠO BẢNG ĐƠN HÀNG (orders)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- 6. TẠO BẢNG CHI TIẾT ĐƠN HÀNG (order_items)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- ========================================================
-- 7. HÀM HỖ TRỢ KIỂM TRA QUYỀN ADMIN (is_admin)
-- ========================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- 8. KÍCH HOẠT KHÓA AN TOÀN RLS (ROW LEVEL SECURITY)
-- ========================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- POLICIES BẢNG categories
-- --------------------------------------------------------
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- --------------------------------------------------------
-- POLICIES BẢNG products
-- --------------------------------------------------------
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (is_admin());

-- --------------------------------------------------------
-- POLICIES BẢNG profiles
-- --------------------------------------------------------
CREATE POLICY "Users can view own profile or admins view all"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile, admin updates any"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- --------------------------------------------------------
-- POLICIES BẢNG orders
-- --------------------------------------------------------
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users and admins can view orders"
  ON orders FOR SELECT
  USING (is_admin() OR (auth.uid() IS NOT NULL AND user_id = auth.uid()));

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE
  USING (is_admin());

-- --------------------------------------------------------
-- POLICIES BẢNG order_items
-- --------------------------------------------------------
CREATE POLICY "Anyone can insert order_items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users and admins can view order_items"
  ON order_items FOR SELECT
  USING (is_admin() OR EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.role() = 'anon')
  ));

CREATE POLICY "Admins can manage order_items"
  ON order_items FOR ALL
  USING (is_admin());

-- ========================================================
-- 9. NẠP DỮ LIỆU BAN ĐẦU (SEED DATA)
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
