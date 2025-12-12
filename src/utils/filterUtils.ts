import {
  colorOptions,
  priceOptions,
  sizeOptions,
  styleOptions,
  typeOptions,
} from "../constants/filterOptions";

import { Product } from "../types/Product";

export interface Filters {
  price: string[];
  type: string[];
  style: string[];
  size: string[];
  color: string[];
}

export const getLabel = (key: string, value: string) => {
  let options: { value: string; label: string }[] = [];
  switch (key) {
    case 'price':
      options = priceOptions;
      break;
    case 'type':
      options = typeOptions;
      break;
    case 'style':
      options = styleOptions;
      break;
    case 'size':
      options = sizeOptions;
      break;
    case 'color':
      options = colorOptions;
      break;
    default:
      return value;
  }
  const option = options.find((opt) => opt.value === value);
  return option ? option.label : value;
};

//  Cải thiện filterProducts
export const filterProducts = (products: Product[], filters: Filters) => {
  const { price, type, style, size, color } = filters;

  return products.filter((product) => {

    const matchPrice = price.length === 0 || price.some((p) => {
      if (p === '1') return product.price >= 50000 && product.price <= 100000;
      if (p === '2') return product.price > 100000 && product.price <= 200000;
      if (p === '3') return product.price > 200000 && product.price <= 300000;
      if (p === '4') return product.price > 300000 && product.price <= 500000;
      if (p === '5') return product.price > 500000 && product.price <= 1000000;
      if (p === '6') return product.price > 1000000;
      return false;
    });

    //  Type, Style filter (case-insensitive)
    const matchType = type.length === 0 || type.some(t => product.type.toLowerCase().includes(t.toLowerCase()));
    const matchStyle = style.length === 0 || style.some(s => product.style.some(ps => ps.toLowerCase().includes(s.toLowerCase())));

    //  Size, Color filter
    const matchSize = size.length === 0 || size.some(s => product.sizes.includes(s));
    const matchColor = color.length === 0 || color.some(c => product.colors.includes(c));

    return matchPrice && matchType && matchStyle && matchSize && matchColor;
  });
};

//  Cải thiện sortProducts
export const sortProducts = (products: Product[], sort: string) => {
  return [...products].sort((a, b) => {
    switch (sort) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'best-selling':
        return b.sold - a.sold;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });
};