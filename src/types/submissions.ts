/**
 * Type definitions for tool submissions
 */

export interface ToolSubmission {
  id?: string;
  name: string;
  url: string;
  tagline: string;
  content?: string;
  description: string;
  logo?: string;
  slug?: string;
  first_name: string;
  last_name: string;
  email?: string;
  submitter_email?: string;
  categories?: string[];
  created_at?: string;
  updated_at?: string;
}