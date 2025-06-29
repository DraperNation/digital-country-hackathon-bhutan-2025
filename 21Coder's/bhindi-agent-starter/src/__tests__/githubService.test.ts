import { GitHubService } from '@/services/githubService.js';
import { BaseErrorResponseDto } from '@/types/agent.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('GitHubService', () => {
  let githubService: GitHubService;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    githubService = new GitHubService();
    mockFetch.mockClear();
  });

  describe('listUserRepositories', () => {
    const mockRepositories = [
      {
        id: 1,
        name: 'test-repo',
        full_name: 'user/test-repo',
        description: 'Test repository',
        private: false,
        html_url: 'https://github.com/user/test-repo',
        language: 'TypeScript',
        stargazers_count: 5,
        forks_count: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        pushed_at: '2023-01-02T12:00:00Z'
      },
      {
        id: 2,
        name: 'another-repo',
        full_name: 'user/another-repo',
        description: null,
        private: true,
        html_url: 'https://github.com/user/another-repo',
        language: null,
        stargazers_count: 0,
        forks_count: 0,
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z',
        pushed_at: '2023-01-04T12:00:00Z'
      }
    ];

    it('should return formatted repository list with default options', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockRepositories)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await githubService.listUserRepositories('valid-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/user/repos?per_page=10&sort=updated&direction=desc&type=owner',
        {
          headers: {
            'Authorization': 'Bearer valid-token',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Bhindi-Agent-Starter/1.0'
          }
        }
      );

      expect(result.repositories).toHaveLength(2);
      expect(result.repositories[0]).toEqual({
        id: 1,
        name: 'test-repo',
        full_name: 'user/test-repo',
        description: 'Test repository',
        private: false,
        html_url: 'https://github.com/user/test-repo',
        language: 'TypeScript',
        stargazers_count: 5,
        forks_count: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        pushed_at: '2023-01-02T12:00:00Z'
      });

      expect(result.repositories[1]).toEqual({
        id: 2,
        name: 'another-repo',
        full_name: 'user/another-repo',
        description: null,
        private: true,
        html_url: 'https://github.com/user/another-repo',
        language: 'Unknown',
        stargazers_count: 0,
        forks_count: 0,
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z',
        pushed_at: '2023-01-04T12:00:00Z'
      });

      expect(result.total_count).toBe(2);
      expect(result.message).toBe('Found 2 repositories for authenticated user');
    });

    it('should handle custom options', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue([mockRepositories[0]])
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const options = {
        per_page: 5,
        sort: 'created',
        direction: 'asc',
        type: 'public'
      };

      await githubService.listUserRepositories('valid-token', options);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/user/repos?per_page=5&sort=created&direction=asc&type=public',
        expect.any(Object)
      );
    });

    it('should handle 401 authentication errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      try {
        await githubService.listUserRepositories('invalid-token');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseErrorResponseDto);
        expect((error as BaseErrorResponseDto).error.message).toBe('Invalid or expired GitHub token');
        expect((error as BaseErrorResponseDto).error.code).toBe(401);
      }
    });

    it('should handle 403 rate limit errors', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      try {
        await githubService.listUserRepositories('valid-token');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseErrorResponseDto);
        expect((error as BaseErrorResponseDto).error.message).toBe('GitHub API rate limit exceeded or insufficient permissions');
        expect((error as BaseErrorResponseDto).error.code).toBe(403);
      }
    });

    it('should handle other HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      try {
        await githubService.listUserRepositories('valid-token');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseErrorResponseDto);
        expect((error as BaseErrorResponseDto).error.message).toBe('GitHub API error: 500 Internal Server Error');
        expect((error as BaseErrorResponseDto).error.code).toBe(500);
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      try {
        await githubService.listUserRepositories('valid-token');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseErrorResponseDto);
        expect((error as BaseErrorResponseDto).error.message).toBe('Failed to fetch repositories: Network error');
        expect((error as BaseErrorResponseDto).error.code).toBe(500);
      }
    });

    it('should handle empty repository list', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue([])
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await githubService.listUserRepositories('valid-token');

      expect(result.repositories).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(result.message).toBe('Found 0 repositories for authenticated user');
    });

    it('should handle repositories with null language', async () => {
      const repoWithNullLanguage = {
        ...mockRepositories[0],
        language: null
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue([repoWithNullLanguage])
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await githubService.listUserRepositories('valid-token');

      expect(result.repositories[0].language).toBe('Unknown');
    });

    it('should handle repositories with null description', async () => {
      const repoWithNullDescription = {
        ...mockRepositories[0],
        description: null
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue([repoWithNullDescription])
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await githubService.listUserRepositories('valid-token');

      expect(result.repositories[0].description).toBe(null);
    });

    it('should handle BaseErrorResponseDto properly', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      try {
        await githubService.listUserRepositories('invalid-token');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseErrorResponseDto);
        expect((error as BaseErrorResponseDto).error.message).toBe('Invalid or expired GitHub token');
        expect((error as BaseErrorResponseDto).error.code).toBe(401);
      }
    });
  });
}); 