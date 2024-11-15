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
            include: {
                category: {
                    select: {
                        id: true,
                        category_name: true,
                    }
                },
                District: {
                    select: {
                        id: true,
                        district_name: true
                    }
                },
                Venue: {
                    select: {
                        id: true,
                        venue_name: true,
                    }
                },
                partypalace: true,
                musical: true,
                multimedia: true,
                luxury: true,
                meeting: true,
                adventure: true,
                beautydecor: true,
                entertainment: true,
                cateringtent: true,
            },
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

//! Get HomePage Products 
const getHomePageProducts = async (req, res) => {
    try {
        const { search = "", category = "", location: district = "" } = req.query;
        console.log(search, category, district)

        // Build the `where` condition dynamically
        const whereClause = {

            Venue: {
                active: true
            }
        };
    
        if (search) {
            whereClause.title = {
                contains: search,
            };
        }
    
        if (category) {
            whereClause.category = {
                category_name: category,
            };
        }
        if (district) {
            whereClause.districtId = parseInt(district);  // Ensure district is being passed as an integer
        }
    
        // Fetch the products based on the query parameters (all products if no filter is provided)
        const products = await prisma.product.findMany({
            where: Object.keys(whereClause).length ? whereClause : undefined,
            include: {
                product_image: true,
                District: {
                    select: {
                        district_name: true
                    }
                },
                //!1.  Add other categories if needed
                multimedia: {
                    select: {
                        price: true,
                        multimedia_name: true
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                entertainment: {
                    select: {
                        entertainment_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                musical: {
                    select: {
                        instrument_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                cateringtent: {
                    select: {
                        catering_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                adventure: {
                    select: {
                        adventure_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                luxury: {
                    select: {
                        luxury_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                meeting: {
                    select: {
                        meeting_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                partypalace: {
                    select: {
                        partypalace_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
                beautydecor: {
                    select: {
                        beauty_name: true,
                        price: true,
                    },
                    take: 1,
                    orderBy: { price: 'asc' }
                },
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
    
        // Calculate the minimum price for each product based on related categories' minimum prices
        const productsWithMinPrice = products.map(product => {
            const minPrice = Math.min(
                ...(product.multimedia.map(item => item.price) || []),
                ...(product.entertainment.map(item => item.price) || []),
                ...(product.musical.map(item => item.price) || []),
                ...(product.partypalace.map(item => item.price) || []),
                ...(product.beautydecor.map(item => item.price) || []),
                ...(product.adventure.map(item => item.price) || []),
                ...(product.luxury.map(item => item.price) || []),
                ...(product.cateringtent.map(item => item.price) || []),
                ...(product.meeting.map(item => item.price) || []),
            );
    
            return {
                ...product,
                minPrice: minPrice || 0  // Set to 0 if no price data exists
            };
        });

        // Respond with the products
        res.json(productsWithMinPrice);

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//! Get Product by Id
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: {
                District: {
                    select: {
                        id: true,
                        district_name: true,
                    }
                },
                Venue: {
                    select: {
                        venue_name: true,
                    }
                },
                product_image: {
                    select: {
                        id: true,
                        url: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        category_name: true
                    }
                },
                //* 1. Party Palace 
                partypalace: {
                    select: {
                        id: true,
                        partypalace_name: true,
                        price: true
                    }
                },
                //* 2. Multimedia 
                multimedia: {
                    select: {
                        id: true,
                        multimedia_name: true,
                        price: true,
                    }
                },
                //* 3. Musical 
                musical: {
                    select: {
                        id: true,
                        instrument_name: true,
                        price: true
                    }
                },
                //! 4. Luxury 
                luxury: {
                    select: {
                        id: true,
                        luxury_name: true,
                        price: true
                    }
                },
                //! 5. CateringTent 
                cateringtent: {
                    select: {
                        id: true,
                        catering_name: true,
                        price: true
                    }
                },
                //! 6. Adventure 
                adventure: {
                    select: {
                        id: true,
                        adventure_name: true,
                        price: true
                    }
                },
                //! 7. Entertainment 
                entertainment: {
                    select: {
                        id: true,
                        entertainment_name: true,
                        price: true
                    }
                },
                //! 8. Beauty & Decoration 
                beautydecor: {
                    select: {
                        id: true,
                        beauty_name: true,
                        price: true
                    }
                },
                //! 9. Luxury 
                meeting: {
                    select: {
                        id: true,
                        meeting_name: true,
                        price: true
                    }
                }
            },
        })

        if (!product) return res.status(404).json({ error: `Products ${id} doesn't exist.` })

        res.json({ success: true, product })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//! Get Product Images By Id
const getProductImagesById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.productImage.findMany({
            where: {
                productId: Number(id)
            },
            select: { id: true, url: true }
        })

        if (!product) return res.status(404).json({ error: `Product Image ${id} doesn't exist.` })

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
        // const productImages = req.body.product_image;

        const productImages = req.files ? req.files.map(file => ({ url: file.path })) : [];
        const parsedData = {
            ...req.body,
            multimedia: typeof req.body.multimedia === 'string' ? JSON.parse(req.body.multimedia) : req.body.multimedia,
            musical: typeof req.body.musical === 'string' ? JSON.parse(req.body.musical) : req.body.musical,
            luxury: typeof req.body.luxury === 'string' ? JSON.parse(req.body.luxury) : req.body.luxury,
            entertainment: typeof req.body.entertainment === 'string' ? JSON.parse(req.body.entertainment) : req.body.entertainment,
            meeting: typeof req.body.meeting === 'string' ? JSON.parse(req.body.meeting) : req.body.meeting,
            beautydecor: typeof req.body.beautydecor === 'string' ? JSON.parse(req.body.beautydecor) : req.body.beautydecor,
            adventure: typeof req.body.adventure === 'string' ? JSON.parse(req.body.adventure) : req.body.adventure,
            partypalace: typeof req.body.partypalace === 'string' ? JSON.parse(req.body.partypalace) : req.body.partypalace,
            cateringtent: typeof req.body.cateringtent === 'string' ? JSON.parse(req.body.cateringtent) : req.body.cateringtent,
        };

        const validatedData = productSchema.parse(parsedData)
        const product = await prisma.product.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                short_description: validatedData.title,
                address: validatedData.address,

                category_id: parseInt(validatedData.category, 10),
                districtId: parseInt(validatedData.location, 10),
                businessId: parseInt(validatedData.business, 10),

                product_image: {
                    create: productImages
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
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        res.status(400).json({ error: error.message });
    }
}

//! Update a produtc

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const productImages = req.files ? req.files.map(file => ({ url: file.path })) : [];

        const parsedData = {
            ...req.body,
            multimedia: typeof req.body.multimedia === 'string' ? JSON.parse(req.body.multimedia) : req.body.multimedia,
            musical: typeof req.body.musical === 'string' ? JSON.parse(req.body.musical) : req.body.musical,
            luxury: typeof req.body.luxury === 'string' ? JSON.parse(req.body.luxury) : req.body.luxury,
            entertainment: typeof req.body.entertainment === 'string' ? JSON.parse(req.body.entertainment) : req.body.entertainment,
            meeting: typeof req.body.meeting === 'string' ? JSON.parse(req.body.meeting) : req.body.meeting,
            beautydecor: typeof req.body.beautydecor === 'string' ? JSON.parse(req.body.beautydecor) : req.body.beautydecor,
            adventure: typeof req.body.adventure === 'string' ? JSON.parse(req.body.adventure) : req.body.adventure,
            partypalace: typeof req.body.partypalace === 'string' ? JSON.parse(req.body.partypalace) : req.body.partypalace,
            cateringtent: typeof req.body.cateringtent === 'string' ? JSON.parse(req.body.cateringtent) : req.body.cateringtent,
        };

        const validatedData = productSchema.parse(parsedData);

        // Delete all possible category data first, regardless of incoming data
        await prisma.productImage.deleteMany({ where: { productId: Number(id) } });
        await prisma.multimedia.deleteMany({ where: { productId: Number(id) } });
        await prisma.musical.deleteMany({ where: { productId: Number(id) } });
        await prisma.luxury.deleteMany({ where: { productId: Number(id) } });
        await prisma.entertainment.deleteMany({ where: { productId: Number(id) } });
        await prisma.meeting.deleteMany({ where: { productId: Number(id) } });
        await prisma.beautyDecor.deleteMany({ where: { productId: Number(id) } });
        await prisma.adventure.deleteMany({ where: { productId: Number(id) } });
        await prisma.partyPalace.deleteMany({ where: { productId: Number(id) } });
        await prisma.cateringTent.deleteMany({ where: { productId: Number(id) } });

        // Construct the new data for each provided category
        if (productImages.length > 0) {
            await prisma.productImage.createMany({
                data: productImages.map(img => ({
                    ...img,
                    productId: Number(id)
                }))
            });
        }

        const insertCategoryData = async (categoryData, modelName) => {
            if (categoryData && categoryData.length > 0) {
                await prisma[modelName].createMany({
                    data: categoryData.map(item => ({
                        ...item,
                        productId: Number(id)
                    }))
                });
            }
        };

        await insertCategoryData(validatedData.multimedia, 'multimedia');
        await insertCategoryData(validatedData.musical, 'musical');
        await insertCategoryData(validatedData.luxury, 'luxury');
        await insertCategoryData(validatedData.entertainment, 'entertainment');
        await insertCategoryData(validatedData.meeting, 'meeting');
        await insertCategoryData(validatedData.beautydecor, 'beautyDecor');
        await insertCategoryData(validatedData.adventure, 'adventure');
        await insertCategoryData(validatedData.partypalace, 'partyPalace');
        await insertCategoryData(validatedData.cateringtent, 'cateringTent');

        const data = {
            title: validatedData.title,
            description: validatedData.description,
            short_description: validatedData.title,
            address: validatedData.address,
            category_id: parseInt(validatedData.category, 10),
            districtId: parseInt(validatedData.location, 10),
            businessId: parseInt(validatedData.business, 10),
        };

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data
        });

        res.status(200).json({ success: true, product, message: "Product Updated" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors.map((e) => e.message)
            });
        }
        res.status(400).json({ error: error.message });
    }
};

export {
    getAllProducts,
    getProductById,
    getProductImagesById,
    getHomePageProducts,
    deleteProductById,
    createProduct,
    updateProduct
}


