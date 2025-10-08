import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  demo: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Please enter a valid email address"),
      company_name: z.string().min(1, "Company name is required"),
      message: z.string().optional(),
    }),
    handler: async ({ name, company_name, email, message }) => {
      console.log("=== DEMO ACTION CALLED ===");
      console.log("Received data:", { name, company_name, email, message });

      return {
        success: true,
        message: "Demo request submitted successfully! We'll be in touch soon.",
      };
    },
  }),
};
