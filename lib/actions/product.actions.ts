"use server";

import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Get the latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return data;
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug: slug },
  });
}
