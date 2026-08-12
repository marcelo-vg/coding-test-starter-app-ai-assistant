import type { Gig } from '@shared/types';

/**
 * Mock listing data. In production this would come from the gigs service; for
 * the demo app it is a static fixture so the page always renders the same set.
 */
export const gigs: Gig[] = [
  {
    id: 'gig-001',
    title: 'Warehouse Picker — Night Shift',
    category: 'Warehouse',
    payRate: 24,
    location: 'Denver, CO',
    remote: false,
    postedAt: '2026-08-10',
    description:
      'Pick and pack orders on the overnight shift. Steel-toe boots required; pallet jack experience preferred.',
  },
  {
    id: 'gig-002',
    title: 'Customer Support Agent',
    category: 'Customer Support',
    payRate: 27,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-11',
    description:
      'Handle inbound billing questions over chat and email for a subscription retailer. Two weeks paid onboarding.',
  },
  {
    id: 'gig-003',
    title: 'Event Bartender — Summer Series',
    category: 'Events',
    payRate: 31,
    location: 'Austin, TX',
    remote: false,
    postedAt: '2026-08-05',
    description:
      'Serve craft beer and cocktails at outdoor concerts. TABC certification required, tips pooled nightly.',
  },
  {
    id: 'gig-004',
    title: 'Line Cook — Weekend Brunch',
    category: 'Hospitality',
    payRate: 22,
    location: 'Portland, OR',
    remote: false,
    postedAt: '2026-08-08',
    description:
      'Run the egg and griddle station for a busy brunch service. Saturday and Sunday, 6am to 2pm.',
  },
  {
    id: 'gig-005',
    title: 'Data Entry Clerk',
    category: 'Admin',
    payRate: 19,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-12',
    description:
      'Transcribe scanned intake forms into the claims system. Flexible hours, 20 hours per week minimum.',
  },
  {
    id: 'gig-006',
    title: 'Grocery Delivery Driver',
    category: 'Delivery',
    payRate: 26,
    location: 'Chicago, IL',
    remote: false,
    postedAt: '2026-08-09',
    description:
      'Deliver same-day grocery orders in your own vehicle. Mileage reimbursed weekly, insulated bags provided.',
  },
  {
    id: 'gig-007',
    title: 'Retail Sales Associate — Flagship Store',
    category: 'Retail',
    payRate: 21,
    location: 'Seattle, WA',
    remote: false,
    postedAt: '2026-08-03',
    description:
      'Greet customers and manage fitting rooms at a downtown apparel flagship. Weekend availability essential.',
  },
  {
    id: 'gig-008',
    title: 'Office Cleaner — Early Mornings',
    category: 'Cleaning',
    payRate: 20,
    location: 'Phoenix, AZ',
    remote: false,
    postedAt: '2026-08-07',
    description:
      'Clean two floors of a corporate office before 9am. Supplies and cart provided, background check required.',
  },
  {
    id: 'gig-009',
    title: 'Virtual Executive Assistant',
    category: 'Admin',
    payRate: 34,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-06',
    description:
      'Manage calendars and travel for two founders across time zones. Strong written communication required.',
  },
  {
    id: 'gig-010',
    title: 'Hotel Front Desk — Overnight Audit',
    category: 'Hospitality',
    payRate: 25,
    location: 'Nashville, TN',
    remote: false,
    postedAt: '2026-08-04',
    description:
      'Check in late arrivals and reconcile the nightly ledger. 11pm to 7am, three shifts per week.',
  },
];
