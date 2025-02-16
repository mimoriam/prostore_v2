import Image from "next/image";
import Link from "next/link";

import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            priority={true}
            src={product.images![0]}
            alt={product.name}
            className="aspect-square rounded object-cover"
            height={300}
            width={300}
          />
        </Link>
      </CardHeader>

      <CardContent className="grid gap-4 p-4">
        <div className="text-xs">{product.brand}</div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>

        <div className="flex-between gap-4">
          <p>{product.rating.toString()} stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
