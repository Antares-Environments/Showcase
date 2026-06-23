import type { PortfolioItem } from '../types';

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  license: { name: string } | null;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
  };
}

export async function fetchGithubPortfolio(username: string, isOrg = false): Promise<PortfolioItem[]> {
  const url = isOrg
    ? `https://api.github.com/orgs/${username}/repos?per_page=100&sort=updated`
    : `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }

  const repos: GithubRepo[] = await response.json();
  const items: PortfolioItem[] = [];

  for (const repo of repos) {
    const meta: Record<string, string> = {
      Language: repo.language || 'Unknown',
      Stars: repo.stargazers_count.toString(),
      Forks: repo.forks_count.toString(),
      Updated: new Date(repo.updated_at).toLocaleDateString(),
      Link: repo.html_url,
    };

    if (repo.license) {
      meta['License'] = repo.license.name;
    }

    let description = repo.description || 'No description provided.';
    let thumbnail: string | null = null;
    const readmeUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/README.md`;

    try {
      const readmeRes = await fetch(readmeUrl);
      if (readmeRes.ok) {
        const readmeText = await readmeRes.text();
        if (readmeText.trim()) {
          description = readmeText;
        }

        const imageRegex = /!\[.*?\]\((.*?)\)/;
        const imgTagRegex = /<img.*?src=["'](.*?)["']/;
        
        let match = readmeText.match(imageRegex);
        if (!match) {
          match = readmeText.match(imgTagRegex);
        }

        if (match && match[1]) {
          const imgUrl = match[1].trim();
          if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
            thumbnail = imgUrl;
          } else {
            const cleanPath = imgUrl.startsWith('./') ? imgUrl.slice(2) : imgUrl;
            thumbnail = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/${cleanPath}`;
          }
        }
      }
    } catch {
    }

    if (!thumbnail) {
      try {
        const treeUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`;
        const treeRes = await fetch(treeUrl);
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          if (treeData && Array.isArray(treeData.tree)) {
            const imageExtensions = /\.(png|jpg|jpeg|webp|gif|svg|avif)$/i;
            const imageFiles = treeData.tree.filter((file: any) => 
              file.type === 'blob' && imageExtensions.test(file.path)
            );
            if (imageFiles.length > 0) {
              const scored = imageFiles.map((file: any) => {
                const path = file.path.toLowerCase();
                const filename = path.split('/').pop() || '';
                let score = 0;
                if (filename.includes('logo')) score += 10;
                else if (filename.includes('icon')) score += 9;
                else if (filename.includes('thumbnail')) score += 8;
                else if (filename.includes('avatar')) score += 7;
                else if (filename.includes('banner')) score += 6;
                else if (filename.includes('cover')) score += 5;
                if (path.includes('/assets/') || path.includes('/static/') || path.includes('/images/') || path.includes('/img/') || path.includes('/media/')) {
                  score += 4;
                }
                if (!path.includes('/')) {
                  score += 3;
                }
                return { path: file.path, score };
              });
              scored.sort((a: any, b: any) => b.score - a.score);
              const bestImage = scored[0].path;
              thumbnail = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/${bestImage}`;
            }
          }
        }
      } catch {
      }
    }

    const attachments: string[] = [repo.html_url];
    if (thumbnail) {
      attachments.unshift(thumbnail);
    }

    items.push({
      id: repo.id.toString(),
      title: repo.name,
      meta,
      description,
      attachments,
    });
  }

  return items;
}
