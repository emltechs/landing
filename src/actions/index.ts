import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  demo: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(3, "Name is required"),
      company_name: z.string().min(3, "Company name is required"),
      email: z.string().email("Please enter a valid email address"),
      country: z.string().min(3, "Country is required"),
      message: z.string().optional(),
    }),
    handler: async ({ name, company_name, email, country, message }) => {
      console.log("=== DEMO ACTION CALLED ===");
      console.log("Received data:", {
        name,
        company_name,
        email,
        country,
        message,
      });

      // Simulate some processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Demo request submitted successfully! We'll be in touch soon.",
        data: { name, company_name, email, country, message },
      };
    },
  }),
};
