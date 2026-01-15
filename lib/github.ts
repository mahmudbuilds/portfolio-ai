// Client-side GitHub API fetching
// Zero serverless costs - all fetching happens in the browser

import { GitHubUser, GitHubRepo } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number,
    public isRateLimit: boolean = false
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

async function fetchFromGitHub<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    const isRateLimit =
      response.status === 403 &&
      response.headers.get("X-RateLimit-Remaining") === "0";

    if (isRateLimit) {
      const resetTime = response.headers.get("X-RateLimit-Reset");
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      throw new GitHubError(
        `Rate limit exceeded. Resets at ${
          resetDate?.toLocaleTimeString() || "soon"
        }`,
        403,
        true
      );
    }

    if (response.status === 404) {
      throw new GitHubError("User not found", 404);
    }

    throw new GitHubError(
      `GitHub API error: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return fetchFromGitHub<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const repos = await fetchFromGitHub<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`
  );

  // Filter out forks and sort by stars
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}

export async function fetchFullProfile(username: string): Promise<{
  user: GitHubUser;
  repos: GitHubRepo[];
}> {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(username),
    fetchUserRepos(username),
  ]);

  return { user, repos };
}
