'use server';

/**
 * @fileOverview An AI agent that analyzes client information to identify key needs and pain points.
 *
 * - analyzeClientNeeds - A function that handles the client needs analysis process.
 * - AnalyzeClientNeedsInput - The input type for the analyzeClientNeeds function.
 * - AnalyzeClientNeedsOutput - The return type for the analyzeClientNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeClientNeedsInputSchema = z.object({
  clientInformation: z
    .string()
    .describe('Detailed information about the client, their business, and their goals.'),
});
export type AnalyzeClientNeedsInput = z.infer<typeof AnalyzeClientNeedsInputSchema>;

const AnalyzeClientNeedsOutputSchema = z.object({
  keyNeeds: z.array(z.string()).describe('A list of the client’s key needs.'),
  painPoints: z.array(z.string()).describe('A list of the client’s main pain points.'),
  reasoning: z.string().describe('Explanation of how the key needs and pain points were derived from the client information.'),
});
export type AnalyzeClientNeedsOutput = z.infer<typeof AnalyzeClientNeedsOutputSchema>;

export async function analyzeClientNeeds(input: AnalyzeClientNeedsInput): Promise<AnalyzeClientNeedsOutput> {
  return analyzeClientNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeClientNeedsPrompt',
  input: {schema: AnalyzeClientNeedsInputSchema},
  output: {schema: AnalyzeClientNeedsOutputSchema},
  prompt: `You are an expert business analyst specializing in understanding client needs and pain points.

You will analyze the provided client information and extract the key needs and pain points of the client.  You will also provide clear reasoning for how you derived the needs and pain points from the information provided.

Client Information: {{{clientInformation}}}`,
});

const analyzeClientNeedsFlow = ai.defineFlow(
  {
    name: 'analyzeClientNeedsFlow',
    inputSchema: AnalyzeClientNeedsInputSchema,
    outputSchema: AnalyzeClientNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
