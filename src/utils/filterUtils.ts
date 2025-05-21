import { 
    priceOptions,
    typeOptions,
    styleOptions,
    sizeOptions,
    colorOptions,
    deliveryOptions,
} from "../constants/filterOptions";
import { Product } from "../data/products";

export interface Filters {
  price: string[];
  type: string;
  style: string;
  size: string[];
  color: string[];
  delivery: string;
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
    case 'delivery':
      options = deliveryOptions;
      break;
  }
  const option = options.find((opt) => opt.value === value);
  return option ? option.label : value;
};

export const filterProducts = (products: Product[], filters: Filters) => {
  const { price, type, style, size, color, delivery } = filters;

  return products.filter((product) => {
    const matchPrice =
      price.length === 0 ||
      price.some((p) => {
        if (p === '1') return product.price >= 200000 && product.price <= 300000;
        if (p === '2') return product.price >= 300000 && product.price <= 500000;
        return true;
      });

    const matchType = type.length === 0 || type.includes(product.type.toLowerCase());
    const matchStyle = style.length === 0 || style.includes(product.style.toLowerCase());
    const matchSize = size.length === 0 || size.some((s) => product.sizes.includes(s));
    const matchColor = color.length === 0 || color.some((c) => product.colors.includes(c));
    const matchDelivery = delivery.length === 0 || delivery.includes(product.delivery);

    return matchPrice && matchType && matchStyle && matchSize && matchColor && matchDelivery;
  });
};

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
      default:
        return 0;
    }
  });
};