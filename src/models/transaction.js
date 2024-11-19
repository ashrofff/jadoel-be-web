import prisma from "@/db/prisma";

export async function getAllTransactions() {
  return prisma.transaction.findMany({
    include: {
      items: true,
    },
  });
}

export const makeTransaction = async (
  userId,
  totalPrice,
  transactionItems
) => {
  return prisma.transaction.create({
    data: {
      userId,
      totalAmount: totalPrice,
      status: 1, 
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

export const midtransTransaction = async (transactionId, snapTokenMT, redirectUrlMT) => {
    return prisma.transaction.update({
        where: {
            transactionId
        },
        data: {
            snapTokenMT,
            redirectUrlMT,
        }
    });
}
export const findPendingTransaction = async (userId) => {
    return prisma.transaction.findFirst({
      where: {
        userId,
        status: 1, // Status 1 = pending
      },
    });
  };
  
  

export const updateTransactionStatus = async (orderId, status) => {
    return prisma.transaction.updateMany({
      where: {
        orderId,
      },
      data: {
        status,
      },
    });
  };
  

