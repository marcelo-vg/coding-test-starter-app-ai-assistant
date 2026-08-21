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
  {
    id: 'gig-011',
    title: 'Forklift Operator — Cold Storage',
    category: 'Warehouse',
    payRate: 29,
    location: 'Kansas City, MO',
    remote: false,
    postedAt: '2026-08-02',
    description:
      'Move pallets in a refrigerated facility. Current forklift certification required, cold weather gear supplied.',
  },
  {
    id: 'gig-012',
    title: 'Barista — Morning Rush',
    category: 'Hospitality',
    payRate: 20,
    location: 'Portland, OR',
    remote: false,
    postedAt: '2026-08-11',
    description:
      'Pull espresso and run the register from 6am to noon at a high-volume cafe. Latte art a plus.',
  },
  {
    id: 'gig-013',
    title: 'Technical Support Specialist — Tier 2',
    category: 'Customer Support',
    payRate: 38,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-01',
    description:
      'Troubleshoot API and integration issues escalated from tier 1. Comfortable reading logs and HTTP traces.',
  },
  {
    id: 'gig-014',
    title: 'Wedding Setup Crew',
    category: 'Events',
    payRate: 23,
    location: 'Charleston, SC',
    remote: false,
    postedAt: '2026-07-30',
    description:
      'Set up chairs, tables and staging for weekend weddings. Frequent lifting up to 50lb.',
  },
  {
    id: 'gig-015',
    title: 'Last-Mile Parcel Courier',
    category: 'Delivery',
    payRate: 25,
    location: 'Denver, CO',
    remote: false,
    postedAt: '2026-08-09',
    description:
      'Run a fixed residential route from a suburban depot. Van provided, clean driving record required.',
  },
  {
    id: 'gig-016',
    title: 'Inventory Auditor — Weekend Counts',
    category: 'Retail',
    payRate: 22,
    location: 'Columbus, OH',
    remote: false,
    postedAt: '2026-07-28',
    description:
      'Scan and reconcile stock across three store locations. Handheld scanner training provided on site.',
  },
  {
    id: 'gig-017',
    title: 'Bookkeeping Assistant',
    category: 'Admin',
    payRate: 31,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-07',
    description:
      'Categorise transactions and chase receipts for a small agency. QuickBooks experience essential.',
  },
  {
    id: 'gig-018',
    title: 'Post-Construction Cleaner',
    category: 'Cleaning',
    payRate: 27,
    location: 'Austin, TX',
    remote: false,
    postedAt: '2026-08-06',
    description:
      'Final clean on newly finished apartment units. Respirator and eye protection required, provided on site.',
  },
  {
    id: 'gig-019',
    title: 'Order Fulfilment Associate',
    category: 'Warehouse',
    payRate: 22,
    location: 'Memphis, TN',
    remote: false,
    postedAt: '2026-08-12',
    description:
      'Pack and label outbound e-commerce orders. Day shift, 7am to 3:30pm, overtime available in peak weeks.',
  },
  {
    id: 'gig-020',
    title: 'Catering Server — Corporate Lunches',
    category: 'Events',
    payRate: 24,
    location: 'Chicago, IL',
    remote: false,
    postedAt: '2026-08-05',
    description:
      'Plate and serve buffet lunches in office settings. Black trousers and white shirt required.',
  },
  {
    id: 'gig-021',
    title: 'Live Chat Support — Weekend Cover',
    category: 'Customer Support',
    payRate: 24,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-10',
    description:
      'Cover Saturday and Sunday chat queues for a travel booking site. Typing speed of 60wpm or better.',
  },
  {
    id: 'gig-022',
    title: 'Restaurant Dishwasher — Evenings',
    category: 'Hospitality',
    payRate: 18,
    location: 'Phoenix, AZ',
    remote: false,
    postedAt: '2026-07-26',
    description:
      'Keep the pit moving through dinner service. Five evenings a week, meal included each shift.',
  },
  {
    id: 'gig-023',
    title: 'Furniture Delivery Assistant',
    category: 'Delivery',
    payRate: 28,
    location: 'Seattle, WA',
    remote: false,
    postedAt: '2026-08-03',
    description:
      'Two-person team delivering and assembling furniture. Comfortable carrying heavy items up stairs.',
  },
  {
    id: 'gig-024',
    title: 'Visual Merchandiser',
    category: 'Retail',
    payRate: 26,
    location: 'Nashville, TN',
    remote: false,
    postedAt: '2026-07-31',
    description:
      'Reset window and floor displays to seasonal planograms. Travel between four stores in the metro area.',
  },
  {
    id: 'gig-025',
    title: 'Airbnb Turnover Cleaner',
    category: 'Cleaning',
    payRate: 25,
    location: 'Charleston, SC',
    remote: false,
    postedAt: '2026-08-08',
    description:
      'Same-day turnovers on short-term rentals. Own transport needed, supplies left on site by the host.',
  },
  {
    id: 'gig-026',
    title: 'Scheduling Coordinator',
    category: 'Admin',
    payRate: 29,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-04',
    description:
      'Build weekly rotas for a home care agency and handle shift swaps. Detail-oriented, phone-heavy role.',
  },
  {
    id: 'gig-027',
    title: 'Stadium Concessions Cashier',
    category: 'Events',
    payRate: 21,
    location: 'Kansas City, MO',
    remote: false,
    postedAt: '2026-08-01',
    description:
      'Take orders and handle card payments at match-day concession stands. Standing for full shift.',
  },
  {
    id: 'gig-028',
    title: 'Goods-In Receiver',
    category: 'Warehouse',
    payRate: 23,
    location: 'Columbus, OH',
    remote: false,
    postedAt: '2026-07-24',
    description:
      'Check inbound deliveries against purchase orders and log discrepancies. Early start, 5am to 1pm.',
  },
  {
    id: 'gig-029',
    title: 'Onboarding Support Associate',
    category: 'Customer Support',
    payRate: 30,
    location: 'Remote',
    remote: true,
    postedAt: '2026-08-12',
    description:
      'Walk new customers through account setup over video calls. Patient, clear communicator wanted.',
  },
  {
    id: 'gig-030',
    title: 'Grocery Shelf Stocker — Overnight',
    category: 'Retail',
    payRate: 23,
    location: 'Memphis, TN',
    remote: false,
    postedAt: '2026-07-22',
    description:
      'Face and replenish aisles overnight ahead of store opening. 10pm to 6am, four nights a week.',
  },
];
