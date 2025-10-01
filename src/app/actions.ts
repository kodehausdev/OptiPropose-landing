'use server';

import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function signUpForEarlyAccess(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email');
  
  const validatedFields = emailSchema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors[0].message,
      success: false,
    };
  }

  // Here you would typically save the email to a database or a mailing list service.
  // For this example, we'll just log it to the console.
  console.log(`New early access sign-up: ${validatedFields.data.email}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "Thank you for signing up! We'll be in touch soon.",
    success: true,
  };
}
