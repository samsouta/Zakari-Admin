import { UserType } from "./authTypes";

export type ServicesType = {
  id: string;
  name: string;
  description: string;
  img_url: string;
  is_hot: boolean;
  created_at: string;
}

export type ServiceResponse = {
  success: boolean;
  message: string;
  data: ServicesType[];
}

export type ServiceByIdResponse = {
  success: boolean;
  message: string;
  data: ServicesType;
}

export type ProductData = {
  id: number;
  game_id: number;
  service_id: number;
  name: string;
  description: string;
  img_url: string;
  preview_img: string[];
  price: string;
  fake_price: string;
  is_sold: boolean;
  is_popular: boolean,
  data: {
    rank: string;
    hero_count: number;
    skin_count: number;
    amount: number;
  };
  created_at: string;
  discount_percent: number;
  game: GameType;
  service: ServicesType;
}

export type PaginationData = {
  current_page: number;
  data: ProductData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: string[];
  next_page_url: string;
  prev_page_url: string;
  per_page: number;
  to: number;
  total: number;
}

export type ProductsResponse = {
  success: string;
  message: string;
  data: PaginationData;
}

export type AllProductsResponse = {
  success: string;
  message: string;
  data: ProductData[];
}


export type CreateOrderResponse = {
  success: boolean;
  message: string;
  order?: {
    orderable: any; // Type for the loaded relationship
  };
  credentials?: {
    email: string;
    email_password: string;
    game_password: string;
  };
};

export type OrderType = {
  id: number;
  user_id: number;
  product_id: number;
  total_price: string;
  payment_status: string;
  product: ProductData;
  created_at: string;
  meta: Record<string, string | number> | null;
  user: UserType;
}

export type OrderResponse = {
  success: boolean;
  orders?: OrderType[];
  today_count: number;
  yesterday_count: number;
  increase_percentage: number;
  last_month: number
};

export type UserMeta = {
  game_uid: string;
  server_id: string;
  email: string;
  game_password: string;
  email_password: string;
};

export type MonthlySalesResponse = {
  success: boolean;
  message: string;
  sales: number[];
}

export type MonthlyTargetResponse = {
  success: boolean;
  message: string;
  target: number;
  revenue: string;
  progress: number;
}


export type StatisticsChartResponse = {
  success: boolean;
  message: string;
  sales: number[];
  revenue: number[];
}


// Game Type 

export type GameResponse = {
  success: boolean;
  message: string;
  data: GameType[];

}


export type GameType = {
  id: number;
  service_id: number;
  slug: string;
  name: string;
  logo_url: string;
  is_hot: boolean;
  created_at: string;
  updated_at: string;
  products: ProductData[]
  service: ServicesType;
}


// Form Type 
export type FormProps = {
  service_id: number;
  game_id: number;
  name: string;
  description: string;
  img_url: string;
  preview_img: string[];
  price: number;
  fake_price: number;
  is_popular: boolean;
  data: {
    rank?: string;
    skin_count?: number;
    hero_count?: number;
    amount?: number
  };
  credentials: {
    email?: string;
    email_password?: string;
    game_password?: string;
  };
}

export type GetProductWithIdResponse = {
  success: boolean;
  data: {
    id: number;
    service_id: number;
    product_type: string;
    name: string;
    description: string;
    img_url: string;
    preview_img: string[];
    price: string;
    fake_price: string;
    discount_percentage: number;
    is_sold: boolean;
    is_popular: boolean;
    data: {
      rank: string;
      hero_count: string;
      skin_count: string;
      amount?: number
    };
    credentials: {
      email?: string;
      email_password?: string;
      game_password?: string;
    };
    created_at: string;
    game_id: number;
    discount_percent: number;
    service: Record<string, never>;
  }
}
