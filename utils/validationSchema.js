import { z } from 'zod';

//! Create Contact Us Schema
export const contactusSchema = z.object({
    business_name: z.string().min(1, 'Business name is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
    phone_number: z
        .string()
        .refine((value) => {
            const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
            return phoneRegex.test(value);
        }, {
            message: "Invalid phone number format!",
        }),
    contact_person: z.string().min(1, 'Contact person is required'),
});

//! Category validation schema
export const categorySchema = z.object({
    id: z.coerce.number().optional(),
    category_name: z
        .string()
        .min(3, { message: "Category name must be at least 3 characters long!" }),
    category_icon: z.string().optional()
});

//! Location Form Validation Schema
export const locationSchema = z.object({
    id: z.coerce.number().optional(),
    district_name: z
        .string()
        .min(3, { message: "Location name must be at least 3 characters long!" }),
});

//! Venue Schema 
export const venueSchema = z.object({
    id: z.coerce.number().optional(),
    venue_name: z
        .string()
        .min(3, { message: "Venue Name must be at least 3 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    phone_number: z
        .string()
        .refine((value) => {
            const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
            return phoneRegex.test(value);
        }, {
            message: "Invalid phone number format!",
        }),
    pan_vat_number: z.string().optional(),
    active: z.boolean().optional(),
    venue_address: z
        .string()
        .min(3, { message: "Venue Address must be at least 3 characters long!" }),
    contact_person: z
        .string()
        .min(3, { message: "Contact Person must be at least 3 characters long!" }),
});

//! Event Type Validation Schema
export const eventTypeSchema = z.object({
    id: z.coerce.number().optional(),
    title: z
        .string()
        .min(3, { message: "Event Type must be at least 3 characters long!" }),
});

//! Blog Validation Schema
export const blogSchema = z.object({
    id: z.coerce.number().optional(),
    title: z
        .string()
        .min(3, { message: "Blog Title must be at least 3 characters long!" }),
    description: z
        .string()
        .min(50, { message: "Description must be at least 50 characters long!" })
        .max(200, { message: "Description cannot be more than 200 characters long!" }),
    image: z.string().optional(),
    author_id: z.number(),
    // author_id: z.string(),
    is_approved: z.boolean().optional(),
});

//! Product Validation Schema
export const productSchema = z.object({
    id: z.coerce.number().optional(),
    title: z
        .string()
        .min(3, { message: "Product name must be at least 3 characters long!" }),
    short_description: z
        .string()
        .min(3, { message: "Product name must be at least 3 characters long!" }).optional(),
    address: z
        .string()
        .min(3, { message: "Address must be at least 3 characters long!" }),
    // price: z
    //     .string()
    //     .transform((val) => parseInt(val, 10))
    //     .refine((val) => !isNaN(val), {
    //         message: "Price must be a valid number",
    //     }),
    description: z
        .string()
        .min(50, { message: "Description must be at least 50 characters long!" })
        .max(200, { message: "Description cannot be more than 200 characters long!" }),
    category: z.string(),
    location: z.string(),
    business: z.string(),
    product_image: z
        .array(z.string(), { message: "Product Image must be a valid string" }).optional(),
    amenities: z
        .array(z.object({
            amenity_name: z.string().min(1, { message: "Amenity name is required." }),
        })).optional(),
    rules: z
        .array(z.object({
            description: z.string().min(1, { message: "Rule description is required." }),
        })).optional(),
    halls: z
        .array(z.object({
            hall_name: z.string().min(1, { message: "Hall name is required." }),
            hall_capacity: z.number().min(1, { message: "Hall capacity must be at least 1." }),
        })).optional(),

    //! 1. Multimedia
    multimedia: z
        .array(z.object({
            multimedia_name: z.string().min(1, { message: "Photography or Videograpy is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 2. Musical
    musical: z
        .array(z.object({
            instrument_name: z.string().min(1, { message: "Musical Instrument is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 3. Extra Luxury
    luxury: z
        .array(z.object({
            luxury_name: z.string().min(1, { message: "Luxury name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 4. Entertainment
    entertainment: z
        .array(z.object({
            entertainment_name: z.string().min(1, { message: "Entertainment name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 5. Meeting
    meeting: z
        .array(z.object({
            meeting_name: z.string().min(1, { message: "Musical name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 6. Beauty & Decor
    beautydecor: z
        .array(z.object({
            beauty_name: z.string().min(1, { message: "Beauty & Decor name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 7. Adventure
    adventure: z
        .array(z.object({
            adventure_name: z.string().min(1, { message: "Adventure name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 8. Party Palace
    partypalace: z
        .array(z.object({
            partypalace_name: z.string().min(1, { message: "Party Palace name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),

    //! 9. CateringTent
    cateringtent: z
        .array(z.object({
            catering_name: z.string().min(1, { message: "Catering or Tent name is required." }),
            price: z.number().min(1, { message: "Price is required" }),
        })).optional(),
});

//! Booking Validation Schema
export const bookingSchema = z.object({
    id: z.coerce.number().optional(),
    start_date: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid start_date" }),
    end_date: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid end_date" }),
    Hall: z
        .array(z.object({
            hall_name: z.string().min(1, { message: "Hall name is required." }),
            hall_capacity: z.number().min(1, { message: "Hall capacity must be at least 1." }),
        })).optional(),
    authorId: z.number().optional(),
    is_approved: z.boolean().optional(),
    approved_by_id: z.number().optional(),
    productId: z.number(),
});

//! User Register Schema Validation
export const registerSchema = z.object({
    id: z.coerce.number().optional(),
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone_number: z
        .string()
        .refine((value) => {
            const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
            return phoneRegex.test(value);
        }, {
            message: "Invalid phone number format!",
        }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/\d/, "Password must contain at least one number")
        .refine((val) => /[A-Za-z]/.test(val), {
            message: "Password must contain at least one letter",
        }),
})

//! User Login Schema Validation
export const loginSchema = z.object({
    id: z.coerce.number().optional(),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/\d/, "Password must contain at least one number")
        .refine((val) => /[A-Za-z]/.test(val), {
            message: "Password must contain at least one letter",
        }),
})

//! Forgot password validation
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

//! Reset password validation
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/\d/, "Password must contain at least one number")
        .refine((val) => /[A-Za-z]/.test(val), {
            message: "Password must contain at least one letter",
        }),
})
