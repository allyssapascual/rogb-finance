-- Make bank details optional (run in Supabase SQL Editor if tables already exist)

alter table public.reimbursements
  alter column bank_account_name drop not null,
  alter column bank_account_number drop not null,
  alter column bank_sort_code drop not null;

alter table public.budget_proposals
  alter column bank_account_name drop not null,
  alter column bank_account_number drop not null,
  alter column bank_sort_code drop not null;

alter table public.event_audits
  alter column bank_name drop not null,
  alter column bank_account_name drop not null,
  alter column bank_sort_code drop not null;
