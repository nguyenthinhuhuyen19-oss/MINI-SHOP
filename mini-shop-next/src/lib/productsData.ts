import { supabase } from "@/lib/supabaseClient";

export interface Product {
  id: number;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  priceFormatted: string;
  description: string;
  image: string;
  featured: boolean;
}

export const INITIAL_PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Sofa 2 chỗ Nordic",
    category: "noi-that",
    categoryName: "Nội thất",
    price: 2990000,
    priceFormatted: "2.990.000đ",
    description: "Thiết kế tối giản, êm ái",
    image: "/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp",
    featured: true
  },
  {
    id: 2,
    name: "Bàn ăn gỗ Sồi",
    category: "noi-that",
    categoryName: "Nội thất",
    price: 3490000,
    priceFormatted: "3.490.000đ",
    description: "Gỗ sồi tự nhiên, bền đẹp",
    image: "/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp",
    featured: true
  },
  {
    id: 3,
    name: "Đèn thả trần Minimal",
    category: "den",
    categoryName: "Đèn",
    price: 599000,
    priceFormatted: "599.000đ",
    description: "Ánh sáng dịu nhẹ, tinh tế",
    image: "/assets/images/products/do-my-nghe/den-tre-thu-cong.webp",
    featured: true
  },
  {
    id: 4,
    name: "Bình gốm Decor",
    category: "trang-tri",
    categoryName: "Trang trí",
    price: 290000,
    priceFormatted: "290.000đ",
    description: "Gốm sứ cao cấp, trang nhã",
    image: "/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp",
    featured: true
  },
  {
    id: 5,
    name: "Kệ gỗ đa năng",
    category: "noi-that",
    categoryName: "Nội thất",
    price: 1293000,
    priceFormatted: "1.293.000đ",
    description: "Tiết kiệm không gian",
    image: "/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp",
    featured: true
  },
  {
    id: 6,
    name: "Giỏ mây lưu trữ",
    category: "luu-tru",
    categoryName: "Lưu trữ",
    price: 199000,
    priceFormatted: "199.000đ",
    description: "Thân thiện, tiện dụng",
    image: "/assets/images/products/do-thu-cong/gio-may-dan.webp",
    featured: true
  },
  {
    id: 7,
    name: "Khay gỗ hoa văn",
    category: "nha-bep",
    categoryName: "Nhà bếp",
    price: 320000,
    priceFormatted: "320.000đ",
    description: "Khắc họa hoa văn tinh xảo",
    image: "/assets/images/products/do-thu-cong/khay-go-hoa-van.webp",
    featured: false
  },
  {
    id: 8,
    name: "Tranh treo Macrame",
    category: "trang-tri",
    categoryName: "Trang trí",
    price: 450000,
    priceFormatted: "450.000đ",
    description: "Đan thủ công phong cách Boho",
    image: "/assets/images/products/do-thu-cong/tranh-treo-macrame.webp",
    featured: false
  },
  {
    id: 9,
    name: "Chậu cây để bàn",
    category: "van-phong",
    categoryName: "Văn phòng",
    price: 180000,
    priceFormatted: "180.000đ",
    description: "Trang trí góc làm việc xanh",
    image: "/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp",
    featured: false
  },
  {
    id: 10,
    name: "Đèn lồng tre",
    category: "den",
    categoryName: "Đèn",
    price: 380000,
    priceFormatted: "380.000đ",
    description: "Phong cách mộc mạc truyền thống",
    image: "/assets/images/products/do-my-nghe/den-long-tre.webp",
    featured: false
  }
];

export function mapSupabaseProduct(p: any): Product {
  const categoryNames: Record<string, string> = {
    "noi-that": "Nội thất",
    "trang-tri": "Trang trí",
    "nha-bep": "Nhà bếp",
    "den": "Đèn",
    "van-phong": "Văn phòng",
    "luu-tru": "Lưu trữ"
  };

  const categoryId = p.category_id || p.category || "all";
  const priceNum = Number(p.price) || 0;

  return {
    id: Number(p.id),
    name: p.name || "",
    category: categoryId,
    categoryName: p.categories?.name || categoryNames[categoryId] || categoryId,
    price: priceNum,
    priceFormatted: `${priceNum.toLocaleString("vi-VN")}đ`,
    description: p.description || "",
    image: p.image || "/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp",
    featured: Boolean(p.featured)
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("id", { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_PRODUCTS_DATA;
    }

    return data.map(mapSupabaseProduct);
  } catch {
    return INITIAL_PRODUCTS_DATA;
  }
}

export async function createProductInSupabase(productData: {
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}): Promise<boolean> {
  try {
    const newId = Date.now();
    const defaultImage =
      productData.image || "/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp";

    const { error } = await supabase.from("products").insert([
      {
        id: newId,
        name: productData.name,
        category_id: productData.category,
        price: productData.price,
        description: productData.description,
        image: defaultImage,
        featured: true,
      },
    ]);

    return !error;
  } catch {
    return false;
  }
}

export async function updateProductInSupabase(
  id: number,
  productData: {
    name: string;
    category: string;
    price: number;
    description: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("products")
      .update({
        name: productData.name,
        category_id: productData.category,
        price: productData.price,
        description: productData.description,
      })
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

export async function deleteProductInSupabase(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
