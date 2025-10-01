'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating proposal content based on user input.
 *
 * The flow takes user input related to the proposal, such as industry, project type, and client needs,
 * and uses it to generate tailored proposal content. It exports:
 * - generateProposalContent: The main function to trigger the proposal generation flow.
 * - GenerateProposalContentInput: The TypeScript type definition for the input schema.
 * - GenerateProposalContentOutput: The TypeScript type definition for the output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProposalContentInputSchema = z.object({
  industry: z.string().describe('The industry the proposal is for.'),
  projectType: z.string().describe('The type of project the proposal is for.'),
  clientNeeds: z.string().describe('Description of the client needs and pain points.'),
  additionalInformation: z.string().optional().describe('Any additional information to include in the proposal.'),
});

export type GenerateProposalContentInput = z.infer<typeof GenerateProposalContentInputSchema>;

const GenerateProposalContentOutputSchema = z.object({
  proposalContent: z.string().describe('The generated proposal content.'),
});

export type GenerateProposalContentOutput = z.infer<typeof GenerateProposalContentOutputSchema>;

export async function generateProposalContent(input: GenerateProposalContentInput): Promise<GenerateProposalContentOutput> {
  return generateProposalContentFlow(input);
}

const generateProposalContentPrompt = ai.definePrompt({
  name: 'generateProposalContentPrompt',
  input: {schema: GenerateProposalContentInputSchema},
  output: {schema: GenerateProposalContentOutputSchema},
  prompt: `You are an AI proposal writer. Your task is to generate proposal content based on the provided information.

  Industry: {{{industry}}}
  Project Type: {{{projectType}}}
  Client Needs: {{{clientNeeds}}}
  Additional Information: {{{additionalInformation}}}

  Generate a compelling and persuasive proposal content that addresses the client's needs and highlights the benefits of the proposed solution.
  `,
});

const generateProposalContentFlow = ai.defineFlow(
  {
    name: 'generateProposalContentFlow',
    inputSchema: GenerateProposalContentInputSchema,
    outputSchema: GenerateProposalContentOutputSchema,
  },
  async input => {
    const {output} = await generateProposalContentPrompt(input);
    return output!;
  }
);
