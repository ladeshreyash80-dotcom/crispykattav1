-- Crispy Katta schema (public read for menu)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  category_id uuid references categories(id) on delete set null,
  image_url text,
  is_available boolean not null default true,
  is_popular boolean not null default false
);

alter table categories enable row level security;
alter table menu_items enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read menu_items" on menu_items for select using (true);

-- Demo seed data (clearly marked)
insert into categories (name, slug) values ('Snacks','snacks'),('Momos','momos'),('Rolls','rolls'),('Drinks','drinks') on conflict (slug) do nothing;
