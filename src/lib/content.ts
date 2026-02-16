export type ProductCategory =
  | "Mouse"
  | "Keyboard"
  | "Keyboard Switches"
  | "Controllers"
  | "Monitor"
  | "Mousepad"
  | "IEM"
  | "Headset";

export type KeyboardSubcategory =
  | "Mechanical"
  | "Hall Effect"
  | "Induction"
  | "Low Profile"
  | "Silent";

export type ContentItem = {
  slug: string;
  title: string;
  brand: string;
  year: number;
  category: ProductCategory;
  subcategory?: KeyboardSubcategory;
  featured?: boolean;
  image: string;
  gallery: string[];
  summary: string;
};

export type ReviewItem = ContentItem & {
  rating: number;
  verdict: string;
  pros: string[];
  cons: string[];
  specs: { label: string; value: string }[];
  performance: string[];
};

export type AffiliateItem = {
  slug: string;
  title: string;
  category: ProductCategory;
  image: string;
  description: string;
  brand: string;
  url: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  productType: ProductCategory;
  year: number;
  image: string;
  sections: { id: string; title: string; body: string }[];
};

const baseGallery = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1600&q=80",
];

export const photoshoots: ContentItem[] = [
  {
    slug: "nova-kb-60",
    title: "Nova KB 60",
    brand: "Mechlands",
    year: 2025,
    category: "Keyboard",
    subcategory: "Mechanical",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "A compact mechanical board with luminous orange accents.",
  },
  {
    slug: "arc-mouse-pro",
    title: "Arc Mouse Pro",
    brand: "Ajazz",
    year: 2024,
    category: "Mouse",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Ergonomic curve, crisp clicks, and a clean matte finish.",
  },
  {
    slug: "halo-iem-s1",
    title: "Halo IEM S1",
    brand: "Blusstyle",
    year: 2025,
    category: "IEM",
    image:
      "https://images.unsplash.com/photo-1518445691929-8d8b42a98b01?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Studio-tuned in-ears with a polished aluminum shell.",
  },
  {
    slug: "pulse-pad-xl",
    title: "Pulse Pad XL",
    brand: "ASUS",
    year: 2023,
    category: "Mousepad",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Textured glide surface with a cinematic desk aesthetic.",
  },
  {
    slug: "zen-controller",
    title: "Zen Controller",
    brand: "Royal Kludge",
    year: 2024,
    category: "Controllers",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Balanced layout, clean silhouettes, and hybrid triggers.",
  },
  {
    slug: "eclipse-monitor-27",
    title: "Eclipse 27",
    brand: "ALICE",
    year: 2025,
    category: "Monitor",
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Ultra-thin bezel design with warm ambient lighting.",
  },
  {
    slug: "silent-switch-kit",
    title: "Silent Switch Kit",
    brand: "Mechlands",
    year: 2024,
    category: "Keyboard Switches",
    subcategory: "Silent",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Soft landing switches tuned for whisper-quiet presses.",
  },
  {
    slug: "airy-headset-x",
    title: "Airy Headset X",
    brand: "Ajazz",
    year: 2023,
    category: "Headset",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Lightweight frame with cinematic isolation.",
  },
];

export const reviews: ReviewItem[] = [
  {
    slug: "nova-kb-60-review",
    title: "Nova KB 60 Review",
    brand: "Mechlands",
    year: 2025,
    category: "Keyboard",
    subcategory: "Mechanical",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "A punchy 60% board that hits above its price.",
    rating: 4.6,
    verdict: "Best-in-class feel with one of the cleanest stock sound profiles.",
    pros: ["Exceptional stabilizers", "Balanced acoustic profile", "Strong build"],
    cons: ["Limited wireless options", "No dedicated volume knob"],
    specs: [
      { label: "Switches", value: "Mechlands Blaze Linear" },
      { label: "Connectivity", value: "Wired USB-C" },
      { label: "Weight", value: "940g" },
    ],
    performance: ["Latency stays under 2ms in wired mode", "No rattle on modifiers"],
  },
  {
    slug: "arc-mouse-pro-review",
    title: "Arc Mouse Pro Review",
    brand: "Ajazz",
    year: 2024,
    category: "Mouse",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Lightweight with a premium scroll and reliable sensor.",
    rating: 4.3,
    verdict: "A clean performer for both productivity and esports.",
    pros: ["Great battery life", "Smooth scroll wheel", "Comfortable shape"],
    cons: ["Software is minimal", "Limited color options"],
    specs: [
      { label: "Sensor", value: "PAW 3395" },
      { label: "Weight", value: "58g" },
      { label: "Battery", value: "70 hours" },
    ],
    performance: ["Stable tracking at 2000Hz", "Consistent lifts"],
  },
  {
    slug: "halo-iem-s1-review",
    title: "Halo IEM S1 Review",
    brand: "Blusstyle",
    year: 2025,
    category: "IEM",
    image:
      "https://images.unsplash.com/photo-1518445691929-8d8b42a98b01?auto=format&fit=crop&w=1400&q=80",
    gallery: baseGallery,
    summary: "Studio-leaning tuning with powerful sub-bass.",
    rating: 4.4,
    verdict: "Detailed midrange with a controlled low-end lift.",
    pros: ["Clear vocals", "Comfortable shells", "Great stock cable"],
    cons: ["Treble may be sharp for some"],
    specs: [
      { label: "Drivers", value: "1DD + 2BA" },
      { label: "Impedance", value: "32Ω" },
      { label: "Nozzle", value: "5.5mm" },
    ],
    performance: ["Wide staging for the price", "Clean separation"],
  },
];

export const affiliates: AffiliateItem[] = [
  {
    slug: "nova-kb-60-affiliate",
    title: "Nova KB 60",
    category: "Keyboard",
    brand: "Mechlands",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    description: "Compact board with warm acoustics and clean stabilizers.",
    url: "https://example.com/nova-kb-60",
  },
  {
    slug: "arc-mouse-pro-affiliate",
    title: "Arc Mouse Pro",
    category: "Mouse",
    brand: "Ajazz",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    description: "58g productivity mouse with a premium scroll.",
    url: "https://example.com/arc-mouse-pro",
  },
  {
    slug: "halo-iem-s1-affiliate",
    title: "Halo IEM S1",
    category: "IEM",
    brand: "Blusstyle",
    image:
      "https://images.unsplash.com/photo-1518445691929-8d8b42a98b01?auto=format&fit=crop&w=1200&q=80",
    description: "Hybrid driver set with a studio-forward balance.",
    url: "https://example.com/halo-iem-s1",
  },
  {
    slug: "pulse-pad-xl-affiliate",
    title: "Pulse Pad XL",
    category: "Mousepad",
    brand: "ASUS",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    description: "Large-format pad with textured glide.",
    url: "https://example.com/pulse-pad-xl",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "finding-the-right-iem",
    title: "Finding the Right IEM for Your Daily Mix",
    excerpt: "A quick guide to fit, driver types, and tuning profiles.",
    category: "Audio",
    tags: ["IEM", "Buying Guide"],
    productType: "IEM",
    year: 2025,
    image:
      "https://images.unsplash.com/photo-1518445691929-8d8b42a98b01?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        id: "fit",
        title: "Fit comes first",
        body: "A good seal gives you better bass, cleaner mids, and less fatigue.",
      },
      {
        id: "drivers",
        title: "Driver setup matters",
        body: "Single dynamic vs hybrid comes down to your music and comfort.",
      },
      {
        id: "tuning",
        title: "Choose a tuning target",
        body: "Neutral, Harman, or warm — pick what matches your playlists.",
      },
    ],
  },
  {
    slug: "keyboard-sound-basics",
    title: "Keyboard Sound 101",
    excerpt: "Understanding foam, switches, plates, and case resonance.",
    category: "Keyboards",
    tags: ["Mechanical", "Sound"],
    productType: "Keyboard",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        id: "switches",
        title: "Switches shape the tone",
        body: "The stem, spring, and housing determine pitch and depth.",
      },
      {
        id: "plates",
        title: "Plates and mounting",
        body: "Materials change stiffness and sound dispersion.",
      },
      {
        id: "foam",
        title: "Foam and dampening",
        body: "Layering foam reduces hollowness and sharpness.",
      },
    ],
  },
  {
    slug: "sensor-basics",
    title: "Mouse Sensor Basics",
    excerpt: "Lift-off distance, polling rate, and why it matters.",
    category: "Peripherals",
    tags: ["Mouse", "Performance"],
    productType: "Mouse",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        id: "polling",
        title: "Polling rate explained",
        body: "Higher polling means more frequent updates, but not always better.",
      },
      {
        id: "lod",
        title: "Lift-off distance",
        body: "Low LOD keeps tracking stable when you reposition.",
      },
    ],
  },
  {
    slug: "monitor-calibration",
    title: "Monitor Calibration for Reviews",
    excerpt: "How I match color across desk setups and edit suites.",
    category: "Displays",
    tags: ["Monitor", "Workflow"],
    productType: "Monitor",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1400&q=80",
    sections: [
      {
        id: "hardware",
        title: "Use a hardware calibrator",
        body: "Profiles keep your edits consistent across devices.",
      },
      {
        id: "profiles",
        title: "Keep profiles organized",
        body: "Store per-setup profiles to match your workflow.",
      },
    ],
  },
];

export const categories: ProductCategory[] = [
  "Mouse",
  "Keyboard",
  "Keyboard Switches",
  "Controllers",
  "Monitor",
  "Mousepad",
  "IEM",
  "Headset",
];

export const keyboardSubcategories: KeyboardSubcategory[] = [
  "Mechanical",
  "Hall Effect",
  "Induction",
  "Low Profile",
  "Silent",
];
