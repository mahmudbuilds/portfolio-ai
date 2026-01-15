"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Check, Loader2, Package } from "lucide-react";
import JSZip from "jszip";
import { PortfolioData } from "@/lib/types";

interface DownloadButtonProps {
  portfolioData: PortfolioData;
}

function generatePackageJson(username: string) {
  return JSON.stringify(
    {
      name: `${username}-portfolio`,
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint",
      },
      dependencies: {
        next: "^16.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "framer-motion": "^12.0.0",
        "lucide-react": "^0.400.0",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4.0.0",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        typescript: "^5",
        tailwindcss: "^4.0.0",
      },
    },
    null,
    2
  );
}

function generatePageTsx(data: PortfolioData) {
  const reposCode = data.repos
    .slice(0, 12)
    .map(
      (repo) => `
    {
      name: "${repo.name}",
      headline: "${repo.aiContent?.headline || repo.name}",
      summary: "${
        repo.aiContent?.summary || repo.description || "No description"
      }",
      language: "${repo.language || "Unknown"}",
      stars: ${repo.stargazers_count},
      forks: ${repo.forks_count},
      url: "${repo.html_url}"
    }`
    )
    .join(",");

  return `'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Github, MapPin, Users } from 'lucide-react';
import { useEffect } from 'react';

const user = {
  name: "${data.user.name || data.user.login}",
  login: "${data.user.login}",
  avatar: "${data.user.avatar_url}",
  bio: "${(data.user.bio || "").replace(/"/g, '\\"')}",
  location: "${data.user.location || ""}",
  followers: ${data.user.followers},
  url: "${data.user.html_url}"
};

const repos = [${reposCode}
];

const brand = {
  primary: "${data.brand.primaryColor}",
  accent: "${data.brand.accentColor}",
  bg: "${data.brand.backgroundColor}",
  font: "${data.brand.fontFamily}"
};

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  default: brand.primary
};

export default function Portfolio() {
  useEffect(() => {
    if (brand.font) {
      const link = document.createElement("link");
      link.href = \`https://fonts.googleapis.com/css2?family=\${brand.font.replace(/ /g, "+")}:wght@400;700&display=swap\`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: brand.bg, fontFamily: brand.font ? \`'\${brand.font}', sans-serif\` : 'inherit' }}>
      {/* Hero */}
      <header className="relative py-24 px-6 text-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ background: \`radial-gradient(circle at center, \${brand.primary}, transparent)\` }} 
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-2 rounded-full blur-xl opacity-40 animate-pulse" style={{ background: brand.primary }} />
            <img
              src={user.avatar}
              alt={user.name}
              className="relative w-32 h-32 rounded-full border-2 border-white/20"
            />
          </div>
          <h1 className="text-6xl font-bold mb-4 tracking-tighter">
            {user.name}
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">{user.bio}</p>
          <div className="flex justify-center flex-wrap gap-6 text-white/40 text-sm">
            {user.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {user.location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> {user.followers.toLocaleString()} followers
            </span>
          </div>
        </motion.div>
      </header>

      {/* Projects */}
      <main className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" 
                style={{ background: \`linear-gradient(to bottom right, \${brand.primary}, \${brand.accent})\` }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: languageColors[repo.language] || languageColors.default }}
                  />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{repo.language}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text transition-all" style={{ backgroundImage: \`linear-gradient(to right, \${brand.primary}, \${brand.accent})\` }}>
                  {repo.headline}
                </h3>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">{repo.summary}</p>
                <div className="flex items-center gap-4 text-xs text-white/30 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GitFork className="w-4 h-4" /> {repo.forks}
                  </span>
                  <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-20 border-t border-white/5">
        <a
          href={user.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>Follow @{user.login}</span>
        </a>
        <p className="mt-6 text-xs text-white/10 tracking-widest uppercase font-light">
          Built with PortfolioAI
        </p>
      </footer>
    </div>
  );
}
`;
}

function generateLayoutTsx(brand: any) {
  return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio | Built with PortfolioAI',
  description: 'AI-generated developer portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen" style={{ backgroundColor: '${brand.backgroundColor}' }}>
        {children}
      </body>
    </html>
  );
}
`;
}

function generateGlobalsCss() {
  return `@import "tailwindcss";

:root {
  --background: #050505;
  --foreground: #ededed;
}

body {
  background: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
}
`;
}

function generateTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2
  );
}

function generateNextConfig() {
  return `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
`;
}

function generatePostcssConfig() {
  return `export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
`;
}

export default function DownloadButton({ portfolioData }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");

  const handleDownload = async () => {
    setStatus("generating");

    try {
      const zip = new JSZip();

      // Root files
      zip.file("package.json", generatePackageJson(portfolioData.user.login));
      zip.file("tsconfig.json", generateTsConfig());
      zip.file("next.config.ts", generateNextConfig());
      zip.file("postcss.config.mjs", generatePostcssConfig());
      zip.file(
        "next-env.d.ts",
        '/// <reference types="next" />\n/// <reference types="next/image-types/global" />'
      );
      zip.file(".gitignore", `node_modules\n.next\n.env.local\n*.log`);
      zip.file(
        "README.md",
        `# ${
          portfolioData.user.name || portfolioData.user.login
        }'s Portfolio\n\nGenerated with [PortfolioAI](https://portfolioai.dev)\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nOpen [http://localhost:3000](http://localhost:3000)`
      );

      // App directory
      const app = zip.folder("app");
      app?.file("page.tsx", generatePageTsx(portfolioData));
      app?.file("layout.tsx", generateLayoutTsx(portfolioData.brand));
      app?.file("globals.css", generateGlobalsCss());

      // Public directory
      const publicDir = zip.folder("public");
      publicDir?.file(".gitkeep", "");

      // Generate and download
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${portfolioData.user.login}-portfolio.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to generate ZIP:", error);
      setStatus("idle");
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={status === "generating"}
      className="group relative px-8 py-4 rounded-2xl font-medium text-white overflow-hidden disabled:cursor-not-allowed"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-indigo-600 to-purple-600" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Content */}
      <div className="relative flex items-center gap-3">
        {status === "idle" && (
          <>
            <Package className="w-5 h-5" />
            <span>Download Portfolio</span>
          </>
        )}
        {status === "generating" && (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        )}
        {status === "done" && (
          <>
            <Check className="w-5 h-5" />
            <span>Downloaded!</span>
          </>
        )}
      </div>
    </motion.button>
  );
}
