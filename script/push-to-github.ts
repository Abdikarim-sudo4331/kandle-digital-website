import { getGitHubClient, createRepository, getAuthenticatedUser } from '../server/github';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = 'kandle-digital-website';
const REPO_DESCRIPTION = 'Kandle Digital - Digital Marketing Agency Website';

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.cache',
  '.replit',
  '.upm',
  'dist',
  '.env',
  '.config',
  'package-lock.json',
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (shouldIgnore(fullPath)) return;
    
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function main() {
  try {
    console.log('Getting authenticated user...');
    const user = await getAuthenticatedUser();
    console.log(`Logged in as: ${user.login}`);

    console.log(`Creating repository: ${REPO_NAME}...`);
    let repo;
    try {
      repo = await createRepository(REPO_NAME, REPO_DESCRIPTION, false);
      console.log(`Repository created: ${repo.html_url}`);
    } catch (error: any) {
      if (error.status === 422) {
        console.log('Repository already exists, using existing repo...');
        const octokit = await getGitHubClient();
        const repoResponse = await octokit.repos.get({
          owner: user.login,
          repo: REPO_NAME
        });
        repo = repoResponse.data;
      } else {
        throw error;
      }
    }

    console.log('Getting all project files...');
    const files = getAllFiles('.');
    console.log(`Found ${files.length} files to upload`);

    const octokit = await getGitHubClient();

    // Get the default branch's latest commit
    let latestCommitSha: string;
    let treeSha: string;
    
    try {
      const refResponse = await octokit.git.getRef({
        owner: user.login,
        repo: REPO_NAME,
        ref: 'heads/main'
      });
      latestCommitSha = refResponse.data.object.sha;
      
      const commitResponse = await octokit.git.getCommit({
        owner: user.login,
        repo: REPO_NAME,
        commit_sha: latestCommitSha
      });
      treeSha = commitResponse.data.tree.sha;
    } catch {
      // If main doesn't exist, try master
      const refResponse = await octokit.git.getRef({
        owner: user.login,
        repo: REPO_NAME,
        ref: 'heads/master'
      });
      latestCommitSha = refResponse.data.object.sha;
      
      const commitResponse = await octokit.git.getCommit({
        owner: user.login,
        repo: REPO_NAME,
        commit_sha: latestCommitSha
      });
      treeSha = commitResponse.data.tree.sha;
    }

    console.log('Creating blobs for files...');
    const treeItems: any[] = [];

    for (const filePath of files) {
      const content = fs.readFileSync(filePath);
      const relativePath = filePath.startsWith('./') ? filePath.slice(2) : filePath;
      
      // Check if file is binary
      const isBinary = content.includes(0);
      
      const blobResponse = await octokit.git.createBlob({
        owner: user.login,
        repo: REPO_NAME,
        content: isBinary ? content.toString('base64') : content.toString('utf8'),
        encoding: isBinary ? 'base64' : 'utf-8'
      });

      treeItems.push({
        path: relativePath,
        mode: '100644',
        type: 'blob',
        sha: blobResponse.data.sha
      });
      
      console.log(`  Uploaded: ${relativePath}`);
    }

    console.log('Creating tree...');
    const treeResponse = await octokit.git.createTree({
      owner: user.login,
      repo: REPO_NAME,
      base_tree: treeSha,
      tree: treeItems
    });

    console.log('Creating commit...');
    const commitResponse = await octokit.git.createCommit({
      owner: user.login,
      repo: REPO_NAME,
      message: 'Initial commit - Kandle Digital website',
      tree: treeResponse.data.sha,
      parents: [latestCommitSha]
    });

    console.log('Updating reference...');
    await octokit.git.updateRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: commitResponse.data.sha
    });

    console.log('\n✓ Successfully pushed all files to GitHub!');
    console.log(`Repository URL: ${repo.html_url}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
