import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
}

interface StructuredDataProps {
  products: Product[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ products }) => {
  const generateProductSchema = (product: Product) => ({
    "@type": "Product",
    "name": product.name,
    "image": `${window.location.origin}${product.imageUrl}`,
    "description": `${product.name} - Premium essential clothing from Everwear`,
    "brand": {
      "@type": "Brand",
      "name": "Everwear"
    },
    "offers": {
      "@type": "Offer",
      "price": product.salePrice || product.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Everwear"
      }
    },
    "category": product.category
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular Now - Everwear",
    "description": "Best sellers our customers love right now",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": generateProductSchema(product)
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};

export default StructuredData;
