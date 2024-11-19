import prisma from "@/db/prisma";

export const getAllItems = async () => {
  return prisma.item.findMany({
    orderBy: [
      {
        price: "asc",
      },
      {
        isAvailable: "desc",
      }
    ],
    where: {
      isDeleted: false,
    },
  });
};

export const getAllItemsPopular = async () => {
  return prisma.item.findMany({
    orderBy: {
      carts: {
        _count: "desc",
      },
    },
    take: 3,
    where: {
      AND: [
        {
          isDeleted: false,
        },
        {
          isAvailable: true,
        },
      ],
    },
  });
};




export const getItemById = async (itemId) => {
  return prisma.item.findFirst({
    where: {
      AND: [
        {
          itemId,
        },
      ],
    },
  });
};

export const createItem = async (name, description, image, price) => {
  return prisma.item.create({
    data: {
      name,
      description,
      image,
      price,
    },
  });
};

export const editItem = async (itemId, name, description, price) => {
  return prisma.item.update({
    data: {
      name,
      description,
      price,
    },
    where: {
      itemId,
      isDeleted: false,
    },
  });
};

export const editImageItem = async (itemId, image) => {
  return prisma.item.update({
    where: {
      itemId,
      isDeleted: false,
    },
    data: {
      image,
    },
  });
};

export const deleteItem = async (itemId) => {
  return prisma.item.update({
    where: {
      itemId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const setActive = async (itemId, isAvailable) => {
  return prisma.item.update({
    where: {
      itemId,
    },
    data: {
      isAvailable,
    },
  });
};
