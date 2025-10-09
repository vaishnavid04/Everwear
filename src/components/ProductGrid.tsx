import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  category: string;
}

export default function ProductGrid({ products, category }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
