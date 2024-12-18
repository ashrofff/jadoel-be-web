import prisma from "@/db/prisma";
export const addUserShipping = async (userId, address) => {
  return prisma.userShipping.create({
    data: {
      userId,
      address
    },
  });
};

export const getUserShipping = async (userId) => {
  return prisma.userShipping.findFirst({
    where: {
      userId,
    },
  });
};

export const editUserShipping = async (
  userId,
  address,
  longitude,
  latitude
) => {
  return prisma.userShipping.update({
    where: {
      userId,
    },
    data: {
      address,
      longitude,
      latitude,
    },
  });
};
