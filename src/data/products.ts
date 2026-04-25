export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  shortDesc: string;
  price: number;
  originalPrice?: number;
  weight: string;
  origin: string;
  roast: 'Light' | 'Medium' | 'Dark';
  flavorNotes: string[];
  tags: string[];
  featured: boolean;
  badge?: string;
  gradient: string;
  cardBg: string;
  textColor: string;
  inStock: boolean;
  comingSoon?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'al-khawlani',
    name: 'Al-Khawlani Coffee',
    subtitle: 'Single Origin · Khawlan, Yemen',
    description:
      'Al-Khawlani is the crown jewel of Yemeni coffee — a rare, single-origin bean grown in the ancient highlands of the Khawlan tribe in northern Yemen. At elevations exceeding 2,000 meters, the plants are nourished by mountain mist, volcanic soil, and generations of farming wisdom passed down through centuries. Hand-picked at peak ripeness and naturally processed under the Yemeni sun, each bean retains its wild complexity. Expect a cup that opens with bright blueberry and cherry, evolves into dark chocolate and honey, and lingers with delicate floral notes on the finish. This is not just coffee — it is history in a cup.',
    shortDesc: 'Rare highland beans with blueberry, wild cherry & dark chocolate notes.',
    price: 34.99,
    weight: '250g',
    origin: 'Khawlan, Yemen',
    roast: 'Medium',
    flavorNotes: ['Blueberry', 'Wild Cherry', 'Dark Chocolate', 'Honey', 'Floral'],
    tags: ['single-origin', 'highland', 'award-winning'],
    featured: true,
    badge: 'Best Seller',
    gradient: 'linear-gradient(145deg, #1a0800 0%, #5c2e08 40%, #c8963e 100%)',
    cardBg: '#1a0800',
    textColor: '#f5e0b0',
    inStock: true,
    rating: 4.9,
    reviews: 318,
  },
  {
    id: '2',
    slug: 'haraz-dark',
    name: 'Haraz Dark Roast',
    subtitle: 'Coming Soon · Haraz Mountains, Yemen',
    description: 'Coming soon.',
    shortDesc: 'A bold, smoky dark roast from the legendary Haraz mountains.',
    price: 36.99,
    weight: '250g',
    origin: 'Haraz, Yemen',
    roast: 'Dark',
    flavorNotes: ['Dark Cocoa', 'Tobacco', 'Dried Fruit', 'Molasses'],
    tags: ['dark-roast', 'haraz', 'bold'],
    featured: true,
    comingSoon: true,
    badge: 'Coming Soon',
    gradient: 'linear-gradient(145deg, #0a0500 0%, #2c1503 50%, #7a3d0a 100%)',
    cardBg: '#0a0500',
    textColor: '#e8c47a',
    inStock: false,
    rating: 5.0,
    reviews: 0,
  },
  {
    id: '3',
    slug: 'mocha-blend',
    name: 'Mocha House Blend',
    subtitle: 'Coming Soon · Multi-Origin, Yemen',
    description: 'Coming soon.',
    shortDesc: 'Our signature blend — three Yemeni regions, one extraordinary cup.',
    price: 32.99,
    weight: '250g',
    origin: 'Yemen Blend',
    roast: 'Medium',
    flavorNotes: ['Milk Chocolate', 'Brown Sugar', 'Walnut', 'Vanilla'],
    tags: ['blend', 'signature', 'everyday'],
    featured: true,
    comingSoon: true,
    badge: 'Coming Soon',
    gradient: 'linear-gradient(145deg, #160b02 0%, #3d1e05 35%, #c8963e 80%, #e8c47a 100%)',
    cardBg: '#160b02',
    textColor: '#f5e0b0',
    inStock: false,
    rating: 5.0,
    reviews: 0,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getAvailableProducts(): Product[] {
  return products.filter((p) => !p.comingSoon);
}

export const roastLevels = {
  Light: { label: 'Light Roast', bars: 1 },
  Medium: { label: 'Medium Roast', bars: 2 },
  Dark: { label: 'Dark Roast', bars: 3 },
};
