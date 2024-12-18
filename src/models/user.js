import prisma from "@/db/prisma";

export const getAllUsers = async () => {
    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            isDeleted: false
        }
    });
}

export const getUserById = async (userId) => {
    return prisma.user.findFirst({
        where: {
            userId,
        }
    });
}

export const deleteUser = async (userId) => {
    return prisma.user.update({
        where: {
            userId
        },
        data: {
            isDeleted: true
        }
    })
}


export const getUserByEmail = async (email) => {
    return prisma.user.findFirst({
        where: {
            email
        }
    })
}

export const registerUser = async (name, email, password, phone, address) => {
    return prisma.user.create({
        data: {
            name,
            email,
            password,
            phone,
            address
        }
    })
}

export const updateRefreshToken = async (userId, refreshToken) => {
    return prisma.user.update({
        where: {
            userId
        },
        data: {
            refreshToken
        }
    })
}

export const getUserByRefreshToken = async (refreshToken) => {
    return prisma.user.findFirst({
        where: {
            refreshToken
        }
    })
}

export const editPasswordUser = async (userId, password) => {
    return prisma.user.update({
        where: {
            userId
        },
        data: {
            password
        }
    })
}

export const editProfileUser = async (userId, name, email, phone, address) => {
    return prisma.user.update({
        where: {
            userId
        },
        data: {
            name,
            email,
            phone,
            address,
        }
    })
}

export const editPictureUser = async (userId, picture) => {
    return prisma.user.update({
        where: {
            userId
        },
        data: {
            picture
        }
    })
}
