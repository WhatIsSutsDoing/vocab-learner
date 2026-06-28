import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // When building in CI for GitHub Pages we'll set GITHUB_PAGES=true.
  // This sets the base so asset URLs become /vocab-learner/...
  const isGitHubPages = !!process.env.GITHUB_PAGES;

  return {
    base: isGitHubPages ? '/vocab-learner/' : '/',
    plugins: [react()],
  }
})
