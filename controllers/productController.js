import { PrismaClient } from "@prisma/client";
import { productSchema } from "../utils/validationSchema.js";
import { z } from 'zod'

const prisma = new PrismaClient();

//! Get All Products
const getAllProducts = async (req, res) => {

    try {
        const { search, page = 1, limit = 10 } = req.query;

        const where = search
            ? {
                OR: [
                    {
                        title: { contains: search.toLowerCase() },
                        address: { contains: search.toLowerCase() },
                    },
                ]
            }
            : {};

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const products = await prisma.product.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            skip,
            take,
        });

        const totalCount = await prisma.product.count({ where });

        res.json({
            success: true,
            totalCount,
            totalPages: Math.ceil(totalCount / take),
            currentPage: parseInt(page),
            products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//! Get Product by Id
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        })

        if (!product) return res.status(404).json({ error: `Products ${id} doesn't exist.` })

        res.json({ success: true, product })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//! Delete Product By Id
const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {

        const product = await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ success: true, message: "Product Deleted" });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: `Product with ID ${id} does not exist` });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

//! Create new Product 
const createProduct = async (req, res) => {

    try {
        // req.body.author_id = parseInt(req.body.author_id, 10);
        const validatedData = productSchema.parse(req.body)

        const productImages = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

        const product = await prisma.product.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                address: validatedData.address,
                short_description: validatedData.short_description,

                category_id: parseInt(validatedData.category_id, 10),
                districtId: parseInt(validatedData.districtId, 10),
                businessId: parseInt(validatedData.businessId, 10),

                product_image: {
                    create: productImages.map((url) => ({ url })), // Save each image URL as a product image
                },

                //! 1. Multimedia 
                multimedia: {
                    create: validatedData.multimedia,
                },
                //! 2. Musical 
                musical: {
                    create: validatedData.musical,
                },
                //! 3. Luxury 
                luxury: {
                    create: validatedData.luxury,
                },
                //! 4. Entertainment 
                entertainment: {
                    create: validatedData.entertainment,
                },
                //! 5. Meeting 
                meeting: {
                    create: validatedData.meeting,
                },
                //! 6. Beauty & Decor 
                beautydecor: {
                    create: validatedData.beautydecor,
                },
                //! 7. Adventure
                adventure: {
                    create: validatedData.adventure,
                },
                //! 8. Party Palace 
                partypalace: {
                    create: validatedData.partypalace,
                },
                //! 9. Catering Tent 
                cateringtent: {
                    create: validatedData.cateringtent,
                },
            }
        })
        res.status(201).json({ success: true, product, message: "Product Created" })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors.map((e) => e.message)
            });
        }
        res.status(400).json({ error: error.message });
    }
}

//! Update a produtc
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // req.body.author_id = parseInt(req.body.author_id, 10);
        const validatedData = productSchema.parse(req.body)

        const productImages = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                title: validatedData.title,
                description: validatedData.description,
                address: validatedData.address,
                short_description: validatedData.short_description,

                category_id: parseInt(validatedData.category_id, 10),
                districtId: parseInt(validatedData.districtId, 10),
                businessId: parseInt(validatedData.businessId, 10),

                product_image: {
                    create: productImages.map((url) => ({ url })), // Save each image URL as a product image
                },

                //! 1. Multimedia 
                multimedia: {
                    create: validatedData.multimedia,
                },
                //! 2. Musical 
                musical: {
                    create: validatedData.musical,
                },
                //! 3. Luxury 
                luxury: {
                    create: validatedData.luxury,
                },
                //! 4. Entertainment 
                entertainment: {
                    create: validatedData.entertainment,
                },
                //! 5. Meeting 
                meeting: {
                    create: validatedData.meeting,
                },
                //! 6. Beauty & Decor 
                beautydecor: {
                    create: validatedData.beautydecor,
                },
                //! 7. Adventure
                adventure: {
                    create: validatedData.adventure,
                },
                //! 8. Party Palace 
                partypalace: {
                    create: validatedData.partypalace,
                },
                //! 9. Catering Tent 
                cateringtent: {
                    create: validatedData.cateringtent,
                },
            }
        })
        res.status(200).json({ success: true, product, message: "Product Updated" })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors.map((e) => e.message)
            });
        }
        res.status(400).json({ error: error.message });
    }
}

export {
    getAllProducts,
    getProductById,
    deleteProductById,
    createProduct,
    updateProduct
}


