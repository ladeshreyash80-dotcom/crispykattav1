export type Category = { id: string; name: string; sort_order: number };
export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  available: boolean;
};
export type CartItem = { item: MenuItem; qty: number };
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type Order = {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  address: string;
  instructions: string | null;
  status: OrderStatus;
  total: number;
  created_at: string;
};
export type OrderItem = { id: string; order_id: string; menu_item_id: string; name: string; price: number; qty: number };
export type LoyaltyTx = { id: string; account_id: string; order_id: string | null; type: string; points: number; created_at: string };
