// All content sourced from the manager-approved "PPT CONTENT" document
// (Company Profile 2026). Do not add claims or specs that are not in that file.

export const MAIZE_TRUTHFUL = [
  { label: 'Physical Purity', value: '98% min' },
  { label: 'Germination', value: '90% min' },
  { label: 'Genetic Purity', value: '95% min' },
  { label: 'Moisture', value: '12% max' },
]

export const SWEETCORN_TRUTHFUL = [
  { label: 'Physical Purity', value: '98% min' },
  { label: 'Germination', value: '90% min' },
  { label: 'Genetic Purity', value: '95% min' },
  { label: 'Moisture', value: '8% max' },
]

export const PADDY_TRUTHFUL = [
  { label: 'Physical Purity', value: '98% min' },
  { label: 'Germination', value: '80% min' },
  { label: 'Genetic Purity', value: '95% min' },
  { label: 'Moisture', value: '13% max' },
]

export const PRODUCTS = [
  {
    id: 'sandhya-8028',
    category: 'maize',
    type: 'Hybrid Maize',
    code: 'HY-001',
    name: 'Sandhya 8028',
    tagline: '110–115 Days | Kharif & Rabi',
    claim: 'Strong plant architecture with large, uniform cobs and excellent field performance.',
    image: '/images/pack-sandhya-8028.jpg',
    badges: ['110–115 Days', 'Kharif & Rabi'],
    stats: [
      { label: 'Duration', value: '110–115', unit: 'days' },
      { label: 'Season', value: 'Kharif & Rabi' },
    ],
    truthful: MAIZE_TRUTHFUL,
    cob: { kernel: '#E8912A', husk: '#7B9E5A', height: 1.0 },
  },
  {
    id: 'ram-0304',
    category: 'maize',
    type: 'Hybrid Maize',
    code: 'HY-002',
    name: 'Ram 0304',
    tagline: '105–110 Days | Early Maturity',
    claim: 'Ideal for farmers seeking timely harvests and dependable yields.',
    image: '/images/pack-ram-0304.jpg',
    badges: ['105–110 Days', 'Early Maturity'],
    stats: [
      { label: 'Duration', value: '105–110', unit: 'days' },
      { label: 'Maturity', value: 'Early' },
    ],
    truthful: MAIZE_TRUTHFUL,
    cob: { kernel: '#EFA23B', husk: '#86A968', height: 0.88 },
  },
  {
    id: 'virat-8115',
    category: 'maize',
    type: 'Hybrid Maize',
    code: 'HY-003',
    name: 'Virat 8115',
    tagline: '115–120 Days | Premium Long-Duration Hybrid',
    claim: 'Outstanding plant vigor, long cobs, and excellent yield potential.',
    image: '/images/pack-virat-8115.jpg',
    badges: ['115–120 Days', 'Long-Duration'],
    stats: [
      { label: 'Duration', value: '115–120', unit: 'days' },
      { label: 'Type', value: 'Premium Long-Duration' },
    ],
    truthful: MAIZE_TRUTHFUL,
    cob: { kernel: '#E0821F', husk: '#6F934F', height: 1.12 },
  },
  {
    id: 'sweet-16',
    category: 'sweetcorn',
    type: 'Sweet Corn',
    code: '',
    name: 'Sweet 16',
    tagline: '75–80 Days',
    claim: 'Premium sweet corn featuring exceptional sweetness, uniform ears, and attractive market appeal.',
    image: '/images/pack-sweet-16.jpg',
    badges: ['75–80 Days'],
    stats: [
      { label: 'Duration', value: '75–80', unit: 'days' },
    ],
    truthful: SWEETCORN_TRUTHFUL,
    cob: { kernel: '#F4C93F', husk: '#8FB35F', height: 0.85 },
  },
  {
    id: 'padma-25',
    category: 'sweetcorn',
    type: 'Sweet Corn',
    code: '',
    name: 'Padma 25',
    tagline: '80–85 Days',
    claim: '',
    image: '/images/pack-padma-25.jpg',
    badges: ['80–85 Days'],
    stats: [
      { label: 'Duration', value: '80–85', unit: 'days' },
    ],
    truthful: SWEETCORN_TRUTHFUL,
    cob: { kernel: '#F7D14E', husk: '#9ABB6A', height: 0.92 },
  },
  {
    id: 'mr-10',
    category: 'paddy',
    type: 'Hybrid Paddy',
    code: '',
    name: 'MR 10',
    tagline: 'Hybrid Paddy',
    claim: '',
    image: '/images/pack-mr-10.jpg',
    badges: ['Hybrid Paddy'],
    stats: [],
    truthful: PADDY_TRUTHFUL,
    cob: { kernel: '#E9DFA8', husk: '#A4B86B', height: 0.9, paddy: true },
  },
  {
    id: 'neelavathi',
    category: 'paddy',
    type: 'Hybrid Paddy',
    code: '',
    name: 'Neelavathi',
    tagline: 'Hybrid Paddy',
    claim: '',
    image: '/images/pack-neelavathi.jpg',
    badges: ['Hybrid Paddy'],
    stats: [],
    truthful: PADDY_TRUTHFUL,
    cob: { kernel: '#EFE6B5', husk: '#AEC178', height: 1.0, paddy: true },
  },
  {
    id: 'kanika-1692',
    category: 'paddy',
    type: 'Research Paddy',
    code: '',
    name: 'Kanika 1692',
    tagline: 'Research Paddy',
    claim: '',
    image: '/images/pack-kanika.jpg',
    badges: ['Research Paddy'],
    stats: [],
    truthful: PADDY_TRUTHFUL,
    cob: { kernel: '#EDE3AE', husk: '#A8BC70', height: 1.05, paddy: true },
  },
  {
    id: 'singara-999',
    category: 'paddy',
    type: 'Research Paddy',
    code: '',
    name: 'Singara 999',
    tagline: 'Research Paddy',
    claim: '',
    image: '/images/pack-singara-999-improved.jpg',
    badges: ['Research Paddy'],
    stats: [],
    truthful: PADDY_TRUTHFUL,
    cob: { kernel: '#E4D693', husk: '#97AC5E', height: 1.1, paddy: true },
  },
]

export const CATEGORIES = [
  {
    id: 'maize',
    label: 'Hybrid Maize',
    heading: 'Hybrid Maize Portfolio',
    intro: '',
  },
  {
    id: 'sweetcorn',
    label: 'Sweet Corn',
    heading: 'Sweet Corn',
    intro: '',
  },
  {
    id: 'paddy',
    label: 'Paddy',
    heading: 'Paddy Portfolio',
    intro: 'New improved varieties arriving in 2027.',
  },
]

export const TIMELINE = [
  { year: '1995', label: 'Foundation', note: 'Established our seed production operations in Telangana.' },
  { year: '2001', label: 'Partnership', note: 'Partnered with our first multinational seed company.' },
  { year: '2010', label: 'Operations', note: 'Commissioned our state-of-the-art 800-tonne drying facility.' },
  { year: '2020', label: 'Expansion', note: 'Our second drying facility followed — taking total capacity past 2,000 MT.' },
  { year: '2022', label: 'Our Brand', note: 'Incorporated Yellina Seeds Private Limited and launched our own brand — delivering premium hybrid seeds directly to farmers across India.' },
]

export const STATS = [
  { num: '31+', sub: 'years', label: 'Seed Production Expertise' },
  { num: '15+', sub: 'partners', label: 'Trusted Production Partner to Leading Seed Companies' },
  { num: '2', sub: 'facilities', label: 'Integrated Drying & Processing — 2,000+ MT Total Capacity' },
  { num: '9+', sub: 'varieties', label: 'Premium Hybrid Portfolio Under the Yellina Brand' },
]

export const PILLARS = [
  {
    num: '01',
    title: 'Built on Indian Agriculture',
    body: 'Our hybrids are developed, produced, and tested under Indian farming conditions, ensuring dependable performance across diverse climates and soils.',
    icon: 'leaf',
  },
  {
    num: '02',
    title: 'Complete Quality Control',
    body: 'Every seed is dried in our own advanced processing and drying facility, allowing us to maintain optimal moisture levels, high germination, and consistent quality.',
    icon: 'plant2',
  },
  {
    num: '03',
    title: 'With You Through the Season',
    body: 'Our relationship doesn\'t end when you purchase seed. Our agronomy team provides technical guidance throughout the growing season to help maximize productivity.',
    icon: 'hands',
  },
]

export const QUALITY_RINGS = [
  { pct: 95, label: 'Genetic Purity', sub: 'Minimum', color: '#C3874B' },
  { pct: 98, label: 'Physical Purity', sub: 'Minimum', color: '#2D5A3B' },
  { pct: 90, label: 'Germination', sub: 'Maize · minimum', color: '#E08840' },
  { pct: 80, label: 'Germination', sub: 'Paddy · minimum', color: '#9E6A34' },
]

export const QUALITY_PROMISES = [
  { bold: 'Produced under complete in-house supervision', rest: '' },
  { bold: 'Processed in our own 800-tonne drying facility', rest: '' },
  { bold: 'Laboratory tested before packaging, for every lot', rest: '' },
  { bold: 'Scientifically treated for seed protection', rest: '' },
  { bold: 'Fully traceable from production to distribution', rest: '' },
  { bold: 'Proudly Produced, Processed, Packed, and Marketed in India', rest: '' },
]

export const PARTNERS = [
  'Syngenta', 'Pioneer', 'Advanta', 'Kaveri', 'Nath', 'Shriram Bioseed', 'Crystal',
]

// Full portfolio from the approved profile — what we grow today and next.
export const PORTFOLIO = {
  field: ['Hybrid Maize', 'Hybrid Paddy', 'Research Paddy', 'Wheat', 'Mustard — Research & Hybrid', 'Fodder Bajra', 'Fodder Sorghum'],
  vegetable: ['Sweet Corn', 'Okra — Research & Hybrids', 'Cowpea', 'Radish', 'Cluster Beans', 'Cucumber', 'Beans'],
}

export const AGRONOMY_SUPPORT = [
  'Land Preparation',
  'Sowing Recommendations',
  'Nutrient Management',
  'Pest & Disease Management',
  'Seasonal Crop Calendar',
]

export const DEALER_BENEFITS = [
  'Competitive dealer margins',
  'Strong field demonstrations',
  'Technical marketing support',
  'Fast service and complaint resolution',
  'Reliable product availability',
]

export const CONTACT = {
  phone: '+91 99494 84078',
  phoneRaw: '+919949484078',
  customerCare: '+91 85230 06206',
  customerCareRaw: '+918523006206',
  phone2: '+91 83414 64748',
  phone2Raw: '+918341464748',
  email: 'yellinaseeds@gmail.com',
  hours: 'Customer Care',
  corporate: {
    label: 'Corporate Office',
    name: 'Yellina Seeds Private Limited',
    address: 'Kompally, Hyderabad, Telangana, India',
  },
  plant: {
    label: 'Seed Processing Unit',
    name: '800-Tonne Drying & Processing Facility',
    address: 'Banda Mallaram Village, Telangana, India',
  },
  team: [
    {
      initials: 'MK',
      name: 'Murali Krishna Yellina',
      role: 'Founder · Managing Director',
      note: '+91 99494 84078',
      tel: '+919949484078',
    },
    {
      initials: 'AS',
      name: 'Abhinav Sanjay Yellina',
      role: 'Yellina Seeds',
      note: '+91 83414 64748',
      tel: '+918341464748',
    },
  ],
}
