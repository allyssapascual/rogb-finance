-- ROGB Finance: one table per form type + shared drive_files + audit expenses.
-- Run in Supabase Dashboard → SQL Editor → New query → Run.
--
-- If you already ran an earlier version of this migration, drop and recreate:

drop table if exists public.drive_files;
drop table if exists public.event_audit_expenses;
drop table if exists public.event_audits;
drop table if exists public.budget_proposals;
drop table if exists public.reimbursements;
drop table if exists public.submissions;
drop function if exists public.delete_drive_files_for_parent();
drop function if exists public.set_submissions_updated_at();
drop function if exists public.set_updated_at();
drop type if exists public.submission_type;
drop type if exists public.submission_status;

create type public.submission_status as enum (
  'submitted',
  'reviewed',
  'paid',
  'filed'
);

-- Which parent table parent_id refers to:
--   reimbursement → public.reimbursements
--   budget        → public.budget_proposals
--   audit         → public.event_audits
create type public.submission_type as enum (
  'reimbursement',
  'budget',
  'audit'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Delete polymorphic drive_files rows when a parent submission is removed
create or replace function public.delete_drive_files_for_parent()
returns trigger
language plpgsql
as $$
declare
  parent_type public.submission_type;
begin
  parent_type := tg_argv[0]::public.submission_type;

  delete from public.drive_files
  where submission_type = parent_type
    and parent_id = old.id;

  return old;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reimbursements
-- ---------------------------------------------------------------------------
create table public.reimbursements (
  id uuid primary key default gen_random_uuid(),
  status public.submission_status not null default 'submitted',
  submitted_at timestamptz not null default now(),

  name text not null,
  form_date date not null,
  ministry text not null,
  expense_description text not null,
  total_amount numeric(12, 2) not null,
  notes text,

  bank_account_name text,
  bank_account_number text,
  bank_sort_code text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reimbursements_submitted_at_idx on public.reimbursements (submitted_at desc);
create index reimbursements_ministry_idx on public.reimbursements (ministry);
create index reimbursements_status_idx on public.reimbursements (status);

create trigger reimbursements_set_updated_at
before update on public.reimbursements
for each row
execute function public.set_updated_at();

create trigger reimbursements_delete_drive_files
after delete on public.reimbursements
for each row
execute function public.delete_drive_files_for_parent('reimbursement');

alter table public.reimbursements enable row level security;

-- ---------------------------------------------------------------------------
-- Budget proposals
-- ---------------------------------------------------------------------------
create table public.budget_proposals (
  id uuid primary key default gen_random_uuid(),
  status public.submission_status not null default 'submitted',
  submitted_at timestamptz not null default now(),

  name text not null,
  form_date date not null,
  ministry text not null,
  project text not null,          -- Event Name on the form
  purpose text not null,
  event_date date not null,
  total_amount numeric(12, 2) not null,
  notes text,

  bank_account_name text,
  bank_account_number text,
  bank_sort_code text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index budget_proposals_submitted_at_idx on public.budget_proposals (submitted_at desc);
create index budget_proposals_ministry_idx on public.budget_proposals (ministry);
create index budget_proposals_event_date_idx on public.budget_proposals (event_date);
create index budget_proposals_status_idx on public.budget_proposals (status);

create trigger budget_proposals_set_updated_at
before update on public.budget_proposals
for each row
execute function public.set_updated_at();

create trigger budget_proposals_delete_drive_files
after delete on public.budget_proposals
for each row
execute function public.delete_drive_files_for_parent('budget');

alter table public.budget_proposals enable row level security;

-- ---------------------------------------------------------------------------
-- Event audits
-- ---------------------------------------------------------------------------
create table public.event_audits (
  id uuid primary key default gen_random_uuid(),
  status public.submission_status not null default 'submitted',
  submitted_at timestamptz not null default now(),

  name text not null,
  form_date date not null,
  ministry text not null,
  event_name text not null,
  event_date date not null,

  bank_name text,
  bank_account_name text,
  bank_sort_code text,

  collected_per_person numeric(12, 2) not null,
  people_paid integer not null,
  total_amount_coming numeric(12, 2) not null,
  total_expenses numeric(12, 2) not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index event_audits_submitted_at_idx on public.event_audits (submitted_at desc);
create index event_audits_ministry_idx on public.event_audits (ministry);
create index event_audits_event_date_idx on public.event_audits (event_date);
create index event_audits_status_idx on public.event_audits (status);

create trigger event_audits_set_updated_at
before update on public.event_audits
for each row
execute function public.set_updated_at();

create trigger event_audits_delete_drive_files
after delete on public.event_audits
for each row
execute function public.delete_drive_files_for_parent('audit');

alter table public.event_audits enable row level security;

-- ---------------------------------------------------------------------------
-- Audit expense line items
-- ---------------------------------------------------------------------------
create table public.event_audit_expenses (
  id uuid primary key default gen_random_uuid(),
  event_audit_id uuid not null references public.event_audits (id) on delete cascade,
  sort_order integer not null default 0,
  description text not null,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index event_audit_expenses_event_audit_id_idx
  on public.event_audit_expenses (event_audit_id);

alter table public.event_audit_expenses enable row level security;

-- ---------------------------------------------------------------------------
-- Drive files (polymorphic parent: reimbursements | budget_proposals | event_audits)
-- parent_id is not a real FK across three tables — app + submission_type resolve it.
-- ---------------------------------------------------------------------------
create table public.drive_files (
  id uuid primary key default gen_random_uuid(),
  submission_type public.submission_type not null,
  parent_id uuid not null,

  drive_file_id text not null unique,
  file_name text not null,
  mime_type text,
  -- Month folder in Drive (same for all files in that upload batch)
  drive_folder_id text,
  drive_folder_url text,
  -- 1, 2, 3… for receipts; null for summary.pdf
  file_index integer,
  is_summary boolean not null default false,

  created_at timestamptz not null default now()
);

create index drive_files_parent_idx
  on public.drive_files (submission_type, parent_id);

alter table public.drive_files enable row level security;

-- No anon/authenticated policies → denied by default.
-- service_role (server) bypasses RLS.
