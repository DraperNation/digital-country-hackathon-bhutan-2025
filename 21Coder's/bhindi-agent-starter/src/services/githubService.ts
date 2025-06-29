import { BaseErrorResponseDto } from '@/types/agent.js';

/**
 * Simplified GitHub Service
 * Uses simple REST API calls instead of octokit for minimal dependencies
 * Only supports listing user repositories for authentication demonstration
 */
export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';

  /**
   * List repositories for the authenticated GitHub user
   * This is the only GitHub tool we keep for authentication demonstration
   */
  async listUserRepositories(
    token: string,
    options: {
      per_page?: number;
      sort?: string;
      direction?: string;
      type?: string;
    } = {}
  ): Promise<any> {
    const { per_page = 10, sort = 'updated', direction = 'desc', type = 'owner' } = options;
    
    try {
      const url = new URL(`${this.baseUrl}/user/repos`);
      url.searchParams.append('per_page', per_page.toString());
      url.searchParams.append('sort', sort);
      url.searchParams.append('direction', direction);
      url.searchParams.append('type', type);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Bhindi-Agent-Starter/1.0'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new BaseErrorResponseDto('Invalid or expired GitHub token', 401);
        }
        if (response.status === 403) {
          throw new BaseErrorResponseDto('GitHub API rate limit exceeded or insufficient permissions', 403);
        }
        throw new BaseErrorResponseDto(`GitHub API error: ${response.status} ${response.statusText}`, response.status);
      }

      const repositories = await response.json();
      
      // Return simplified repository data
      return {
        repositories: repositories.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description || null,
          private: repo.private,
          html_url: repo.html_url,
          language: repo.language || 'Unknown',
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at
        })),
        total_count: repositories.length,
        message: `Found ${repositories.length} repositories for authenticated user`
      };
    } catch (error: any) {
      if (error instanceof BaseErrorResponseDto) {
        throw error;
      }
      throw new BaseErrorResponseDto(`Failed to fetch repositories: ${error.message}`, 500);
    }
  }
} 