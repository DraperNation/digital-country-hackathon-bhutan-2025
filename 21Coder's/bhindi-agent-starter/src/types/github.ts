/**
 * GitHub API Types for Simplified Service
 * Only includes types needed for our simplified GitHub integration
 */

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface ListUserRepositoriesParams {
  per_page?: number;
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  type?: 'all' | 'owner' | 'public' | 'private' | 'member';
}

export interface GitHubRepositoryResponse {
  repositories: GitHubRepository[];
  total_count: number;
  message: string;
} 