-- ============================================================
-- Casa Organizada — initial schema
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  family_name   text not null,
  full_name     text,
  avatar_url    text,
  plan          text not null default 'free', -- free | base | pro
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  plan_expires_at        timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table profiles enable row level security;
create policy "users manage own profile" on profiles
  for all using (auth.uid() = id);

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, family_name, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'family_name', 'A minha família'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FAMILY MEMBERS
-- ============================================================
create table if not exists family_members (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  name          text not null,
  role          text not null, -- titular | conjuge | filho | ascendente | outro
  birth_date    date,
  nif           text,
  avatar_emoji  text default '👤',
  created_at    timestamptz default now()
);
alter table family_members enable row level security;
create policy "users manage own members" on family_members
  for all using (auth.uid() = user_id);

-- ============================================================
-- DOCUMENTS
-- ============================================================
create table if not exists documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  member_id     uuid references family_members(id),
  module        text not null, -- documentos | automovel | saude | escola | habitacao
  category      text not null,
  name          text not null,
  issuer        text,
  issued_at     date,
  expires_at    date,
  alert_days    int default 90,
  file_url      text,
  file_size     int,
  notes         text,
  metadata      jsonb default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table documents enable row level security;
create policy "users manage own documents" on documents
  for all using (auth.uid() = user_id);
create index if not exists documents_user_expiry_idx on documents(user_id, expires_at);
create index if not exists documents_user_module_idx on documents(user_id, module);

-- ============================================================
-- FINANÇAS — budget categories + transactions
-- ============================================================
create table if not exists budget_categories (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  name          text not null,
  icon          text,
  color         text,
  monthly_limit numeric(10,2),
  type          text not null default 'expense', -- income | expense | saving
  sort_order    int default 0
);
alter table budget_categories enable row level security;
create policy "users manage own budget_categories" on budget_categories
  for all using (auth.uid() = user_id);

create table if not exists transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  category_id   uuid references budget_categories(id),
  member_id     uuid references family_members(id),
  document_id   uuid references documents(id),
  amount        numeric(10,2) not null,
  type          text not null, -- income | expense
  description   text,
  merchant      text,
  date          date not null default current_date,
  source        text default 'manual', -- manual | ocr | bank_import
  nif_requested boolean default false,
  irs_category  text,
  irs_deduction numeric(10,2),
  metadata      jsonb default '{}',
  created_at    timestamptz default now()
);
alter table transactions enable row level security;
create policy "users manage own transactions" on transactions
  for all using (auth.uid() = user_id);
create index if not exists transactions_user_date_idx on transactions(user_id, date desc);
create index if not exists transactions_user_irs_idx on transactions(user_id, irs_category);

-- ============================================================
-- IRS
-- ============================================================
create table if not exists irs_records (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  tax_year        int not null,
  category        text not null,
  subcategory     text,
  amount          numeric(10,2) not null,
  deduction_rate  numeric(5,4) not null,
  deduction_amount numeric(10,2),
  limit_max       numeric(10,2),
  document_id     uuid references documents(id),
  merchant        text,
  receipt_date    date,
  nif_on_receipt  boolean default false,
  efatura_status  text default 'pending', -- pending | validated | error | manual
  notes           text,
  created_at      timestamptz default now()
);
alter table irs_records enable row level security;
create policy "users manage own irs_records" on irs_records
  for all using (auth.uid() = user_id);

-- ============================================================
-- SAM (AI chat)
-- ============================================================
create table if not exists sam_conversations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  module_context text,
  title         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists sam_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references sam_conversations(id) on delete cascade,
  role            text not null, -- user | assistant
  content         text not null,
  metadata        jsonb default '{}',
  created_at      timestamptz default now()
);
alter table sam_conversations enable row level security;
alter table sam_messages enable row level security;
create policy "users manage own sam_conversations" on sam_conversations
  for all using (auth.uid() = user_id);
create policy "users manage own sam_messages" on sam_messages
  for all using (
    auth.uid() = (select user_id from sam_conversations where id = conversation_id)
  );

-- ============================================================
-- SAÚDE (Pro)
-- ============================================================
create table if not exists health_records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  member_id     uuid not null references family_members(id),
  type          text not null, -- consulta | vacina | medicacao | exame | alergia | condicao
  name          text not null,
  date          date,
  next_date     date,
  doctor        text,
  clinic        text,
  notes         text,
  document_id   uuid references documents(id),
  created_at    timestamptz default now()
);
alter table health_records enable row level security;
create policy "users manage own health_records" on health_records
  for all using (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS (Stripe webhook sync)
-- ============================================================
create table if not exists subscription_events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references profiles(id),
  stripe_event_id text unique,
  event_type      text not null,
  payload         jsonb,
  processed_at    timestamptz default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  type          text not null,
  title         text not null,
  body          text,
  document_id   uuid references documents(id),
  module        text,
  read          boolean default false,
  scheduled_for timestamptz,
  created_at    timestamptz default now()
);
alter table notifications enable row level security;
create policy "users manage own notifications" on notifications
  for all using (auth.uid() = user_id);
