# Reserve Easy Tables — College Module Alignment

## Database
- [x] Inspect existing schema/auth/data (1 customer user, 12 tables, 0 reservations, role funcs locked from direct calls)
- [ ] Migration: notifications table + RLS + grants
- [ ] Migration: favourite_tables (Module 1: Manage Favourite Tables)
- [ ] Migration: double-booking prevention + capacity validation trigger
- [ ] Migration: reservation event → notification triggers (created/confirmed/cancelled/modified)
- [ ] Deprecate dietary/loyalty/VIP columns (CRM removal)
- [ ] Regenerate types.ts
- [ ] Grant admin role to existing user for testing

## Remove excluded modules (Part 1)
- [ ] Delete /menu route; remove Menu links (header, footer, landing)
- [ ] Profile: remove dietary preferences/allergies UI
- [ ] Customers CRM → User Management (no loyalty/VIP/dietary columns)
- [ ] Remove "Live Floor Board" branding from tables page (keep Module 5 table management)
- [ ] Footer: remove floor-board/CRM phrasing

## Implement modules (Part 2)
- [ ] A: Auth (exists) + profile view/update name/email/phone + reservation history view
- [ ] B: Search & Find — date, seating times, availability, filter (inside /book reservation flow)
- [ ] C: Reservation system — book w/ category + party size, confirm, details, modify, cancel, history (guest side /my-reservations)
- [ ] D: Table management — add/edit/delete, capacity, category, availability, status, assign
- [ ] E: Booking management — search by name/ID, filter date/status, details, confirm, modify, cancel, assign table
- [ ] F: Notifications — in-app records + bell/page; reminders & seating alerts generated for upcoming confirmed reservations; clearly in-app (no email domain configured)

## Dashboard (Part 3)
- [ ] Real counts: total/pending/confirmed/cancelled reservations, guests, tables
- [ ] Recent + upcoming reservations, quick links, status indicators

## UI (Part 5)
- [ ] Role-aware sidebar (staff vs guest nav)
- [ ] Loading indicators, empty states, confirm dialogs, toasts
- [ ] Responsive checks

## Verify (Part 6)
- [ ] Guest register/login/update/logout flow
- [ ] Booking flow incl. availability + double-booking block
- [ ] Admin confirm/modify/cancel reflected for guest
- [ ] Table CRUD + conflict prevention
- [ ] Notification records on create/confirm/modify/cancel
- [ ] Security: guest blocked from staff pages + other guests' data
