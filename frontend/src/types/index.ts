export interface Product {
  name: string;
  pack?: string;
  price?: string;
  image?: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  features?: string;
  defaultPack?: string;
  defaultPrice?: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  groups: ProductGroup[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface Brand {
  name: string;
  logo?: string;
}
