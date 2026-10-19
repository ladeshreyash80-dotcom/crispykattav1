-- Crispy Katta schema
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  available boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_name text not null,
  phone text not null,
  address text not null,
  instructions text,
  status text not null default 'pending',
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  idempotency_key text unique,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  name text not null,
  price numeric(10,2) not null,
  qty int not null check (qty > 0)
);

create table if not exists store_settings (
  id int primary key default 1,
  store_name text,
  whatsapp_number text,
  delivery_fee numeric(10,2) default 0,
  free_delivery_threshold numeric(10,2),
  opening_hours text,
  updated_at timestamptz default now()
);

create table if not exists loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  phone text,
  points int not null default 0,
  created_at timestamptz default now()
);

create table if not exists loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references loyalty_accounts(id) on delete cascade,
  order_id uuid references orders(id),
  type text not null,
  points int not null,
  note text,
  created_at timestamptz default now(),
  unique (account_id, order_id, type)
);

create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  points_cost int not null,
  value numeric(10,2) not null,
  active boolean not null default true
);

create index idx_orders_phone on orders(phone);
create index idx_order_items_order on order_items(order_id);
create index idx_loyalty_tx_account on loyalty_transactions(account_id);

-- DEMO SEED DATA (safe to remove in production)
insert into categories (name, sort_order) values ('Snacks',1),('Momos',2),('Rolls',3) on conflict do nothing;
