-- Phase 11: Fix the masterclass "Cohort WhatsApp Community" resource link.
-- The phase9 seed migration inserted a placeholder personal wa.me link before
-- the real group invite link existed. Safe to run multiple times: the WHERE
-- clause only matches rows still holding the old placeholder value.

update public.masterclass_resources
set url = 'https://chat.whatsapp.com/H7Vi2HjcioL3sp4gzER45P',
    updated_at = now()
where title = 'Cohort WhatsApp Community'
  and url = 'https://wa.me/254715674828';
