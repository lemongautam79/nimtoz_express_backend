import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../utils/validationSchema.js";
const prisma = new PrismaClient();


//! Get All Categories
// const getAllCategories = async (req, res) => {
//     try {
//         const categories = await prisma.category.findMany({
//             orderBy: {
//                 updatedAt: "desc"
//             }
//         });
//         res.json({ success: true, categories })
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }    

//! Get All Categories
const getAllCategories = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const where = search
            ? {
                OR: [
                    { category_name: { contains: search.toLowerCase() } },
                ]
            }
            : {};

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        // Fetch the data with search, pagination, and ordering
        const categories = await prisma.category.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            skip,
            take,
        });

        // Get the total count of categories (useful for pagination)
        const totalCount = await prisma.category.count({ where });

        res.json({
            success: true,
            totalCount,
            totalPages: Math.ceil(totalCount / take),
            currentPage: parseInt(page),
            categories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//! Get Category by Id
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        })

        if (!category) return res.status(404).json({ error: `Category ${id} doesn't exist` })
        res.json({ success: true, category });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//! Delete Category By Id
const deleteCategoryById = async (req, res) => {
    const { id } = req.params;
    try {

        const category = await prisma.category.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ success: true, message: "Category Deleted" });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: `Category with ID ${id} does not exist` });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};


//! Create new Category 
const createCategory = async (req, res) => {
    try {

        const validatedData = categorySchema.parse(req.body)

        // const { category_name, category_icon } = validatedData;

        const categoryIconPath = req.file ? `/uploads/categories/${req.file.filename}` : null;

        const category = await prisma.category.create({
            data: {
                category_icon: categoryIconPath,
                category_name: validatedData.category_name
            }
        })
        res.status(201).json({ success: true, category })
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

//! Update a category
const updateCategory = async (req, res) => {
    
    const { id } = req.params;
    try {
        const validatedData = categorySchema.parse(req.body)

        const categoryIconPath = req.file ? `/uploads/categories/${req.file.filename}` : null;

        // const { category_name, category_icon } = validatedData;

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                category_icon: categoryIconPath,
                category_name: validatedData.category_name
            }
        })
        res.status(200).json({ success: true, message: "Category Updated", category })
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

//! Count Categories
const countCategory = async (req, res) => {
    try {
        const categoriesWithProductCount = await prisma.category.findMany({
            select: {
                category_name: true,
                // _count: {
                //     select: {
                //         products: true,
                //     }
                // }
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
        res.status(200).json(categoriesWithProductCount)

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export {
    getAllCategories,
    getCategoryById,
    deleteCategoryById,
    createCategory,
    updateCategory,
    countCategory
}