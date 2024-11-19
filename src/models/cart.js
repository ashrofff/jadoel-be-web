import prisma from "@/db/prisma";

export const checkCart = async (userId, itemId, quantity) => {
  return prisma.cart.findFirst({
    where: {
      userId,
      itemId,
    },
  });
};

export const addItemToCart = async (userId, itemId, quantity) => {
  return prisma.cart.create({
    data: {
      userId,
      itemId,
      quantity,
    },
  });
};
export const updateQuantity = async (cartId, quantity, newQuantity) => {
  return prisma.cart.update({
    where: {
      cartId: cartId,
    },
    data: {
      quantity: quantity + newQuantity,
    },
  });
};

export const getCartById = async (userId) => {
  return prisma.cart.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      item: true,
    },
  });
};
export const deleteCartItem = async (cartId) => {
  return prisma.cart.delete({
    where: {
      cartId,
    },
  });
};
