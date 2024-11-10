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