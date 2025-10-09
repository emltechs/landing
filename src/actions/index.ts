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

      try {
        // Prepare form data for Formspree
        const formData = new FormData();
        formData.append("name", name);
        formData.append("company_name", company_name);
        formData.append("email", email);
        formData.append("country", country);
        if (message) {
          formData.append("message", message);
        }

        // Submit to Formspree
        const response = await fetch("https://formspree.io/f/xzzjjbap", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          return {
            success: true,
            message:
              "Demo request submitted successfully! We'll be in touch soon.",
            data: { name, company_name, email, country, message },
          };
        } else {
          const data = await response.json();
          let errorMessage = "Oops! There was a problem submitting your form";

          if (data && data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors
              .map((error: any) => error.message)
              .join(", ");
          }

          throw new ActionError({
            code: "BAD_REQUEST",
            message: errorMessage,
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);

        if (error instanceof ActionError) {
          throw error;
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Oops! There was a problem submitting your form",
        });
      }
    },
  }),
};
