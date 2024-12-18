import prisma from "@/db/prisma";
export const getStoreConfig = async () => {
  return prisma.storeConfig.findFirst({
    where: {
      shippingId: "1",
    },
  });
};

export const updateStoreConfig = async (
  longitudeStore,
  latitudeStore,
  costPerKm,
  phoneStore
) => {
  return prisma.storeConfig.update({
    where: {
      shippingId: "1",
    },
    data: {
      longitudeStore,
      latitudeStore,
      costPerKm,
      phoneStore,
    },
  });
};
