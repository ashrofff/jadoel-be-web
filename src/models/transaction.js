import prisma from "@/db/prisma";

export async function getAllTransactions() {
  return prisma.transaction.findMany({
    include: {
      items: true,
      user: true,
    },
  });
}

export const makeTransaction = async (
  userId,
  totalPrice,
  transactionItems,
  shipmentFee
) => {
  return prisma.transaction.create({
    data: {
      userId,
      totalAmount: totalPrice,
      status: 1,
      shipmentFee: shipmentFee,
      snapTokenMT: "",
      redirectUrlMT: "",
      items: {
        create: transactionItems.map((item) => ({
          itemName: item.item.name,
          itemPrice: item.item.price,
          quantity: item.quantity,
        })),
      },
    },
  });
};

export const midtransTransaction = async (
  transactionId,
  snapTokenMT,
  redirectUrlMT
) => {
  return prisma.transaction.update({
    where: {
      transactionId,
    },
    data: {
      snapTokenMT,
      redirectUrlMT,
    },
  });
};
export const findPendingTransaction = async (userId) => {
  return prisma.transaction.findFirst({
    where: {
      userId,
      status: 1, // Status 1 = pending
    },
  });
};

export const updateTransactionStatusUser = async (userId, status) => {
  return prisma.transaction.updateMany({
    where: {
      userId,
    },
    data: {
      status,
    },
  });
};
export const updateTransactionStatus = async (transactionId, status) => {
  return prisma.transaction.updateMany({
    where: {
      transactionId,
    },
    data: {
      status,
    },
  });
};

export const paidTransaction = async (transactionId, startedAt, paidAt) => {
  return prisma.transaction.update({
    where: {
      transactionId,
    },
    data: {
      status: 2,
    },
  });
};

export const getHistoryTransaction = async (userId) => {
  return prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });
};

export const getHistoryTransactionPending = async (userId) => {
  return prisma.transaction.findFirst({
    where: {
      userId,
      status: 1,
    },
  });
};
export const getTransactionById = async (transactionId) => {
  return prisma.transaction.findFirst({
    where: {
      transactionId,
    },
    include: {
      items: true,
      user: true,
    },
  });
};
