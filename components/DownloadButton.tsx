"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Package } from "lucide-react";
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
        next: "^15.1.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "framer-motion": "^12.0.0",
        "lucide-react": "^0.471.0",
        clsx: "^2.1.1",
        "tailwind-merge": "^2.6.0",
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
  const { user, repos, brand } = data;

  const sectionRenderers: Record<string, string> = {
    "hero-main": `
      <header className="relative py-24 px-6 text-center overflow-hidden rounded-(--radius) bg-white/5 border border-white/10 mb-12">
        <div className="absolute inset-0 opacity-20" style={{ background: \`radial-gradient(circle at center, \${brand.primary}, transparent)\` }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <img src="${
            user.avatar_url
          }" className="w-32 h-32 rounded-full mx-auto mb-8 border-2 border-white/10" />
          <h1 className="text-6xl font-bold mb-4 tracking-tighter">${
            user.name || user.login
          }</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">${(
            user.bio || ""
          ).replace(/"/g, '\\"')}</p>
        </motion.div>
      </header>`,

    "hero-split": `
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-7xl font-black text-white mb-6">${
            user.name || user.login
          }</h1>
          <p className="text-xl text-white/50">${(user.bio || "").replace(
            /"/g,
            '\\"'
          )}</p>
        </motion.div>
        <motion.img src="${
          user.avatar_url
        }" className="rounded-(--radius) border border-white/10 shadow-2xl" />
      </div>`,

    "projects-bento": `
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] mb-20">
        {repos.map((repo, i) => (
          <div key={i} className={i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1"}>
            <div className="h-full p-6 rounded-(--radius) bg-white/5 border border-white/10 flex flex-col justify-between">
              <h3 className="font-bold">{repo.headline}</h3>
              <p className="text-sm text-white/40 line-clamp-2">{repo.summary}</p>
            </div>
          </div>
        ))}
      </div>`,

    "projects-grid": `
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {repos.map((repo, i) => (
          <div key={i} className="p-8 rounded-(--radius) bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-2">{repo.headline}</h3>
            <p className="text-sm text-white/50">{repo.summary}</p>
          </div>
        ))}
      </div>`,

    "stats-card": `
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: "Repos", value: ${user.public_repos} },
          { label: "Followers", value: ${user.followers} },
          { label: "Stars", value: repos.reduce((a, b) => a + b.stars, 0) },
          { label: "Forks", value: repos.reduce((a, b) => a + b.forks, 0) },
        ].map(s => (
          <div key={s.label} className="p-6 rounded-(--radius) bg-white/5 border border-white/10 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs uppercase text-white/40">{s.label}</div>
          </div>
        ))}
      </div>`,

    "footer-classic": `
      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-white/20">© 2026 ${
          user.name || user.login
        } — Generated with PortfolioAI</p>
      </footer>`,
  };

  const layoutCode = (brand.layoutSections || [])
    .map((s) => sectionRenderers[s] || "")
    .join("\n");

  const reposData = repos
    .slice(0, 12)
    .map(
      (r) => `
    {
      headline: "${r.aiContent?.headline?.replace(/"/g, '\\"') || r.name}",
      summary: "${(r.aiContent?.summary || r.description || "").replace(
        /"/g,
        '\\"'
      )}",
      stars: ${r.stargazers_count},
      forks: ${r.forks_count}
    }`
    )
    .join(",");

  return `'use client';
import { motion } from 'framer-motion';

const repos = [${reposData}];
const brand = {
  primary: "${brand.primaryColor}",
  accent: "${brand.accentColor}",
  bg: "${brand.backgroundColor}",
  font: "${brand.fontFamily}",
  radius: "${
    brand.designTokens?.borderRadius === "none"
      ? "0"
      : brand.designTokens?.borderRadius === "sm"
      ? "0.25rem"
      : brand.designTokens?.borderRadius === "md"
      ? "0.5rem"
      : brand.designTokens?.borderRadius === "lg"
      ? "1rem"
      : "9999px"
  }",
  glass: ${brand.designTokens?.glassOpacity || 0.1}
};

export default function Portfolio() {
  return (
    <div className="min-h-screen text-white p-6 md:p-12" style={{ 
      backgroundColor: brand.bg, 
      fontFamily: \`'\${brand.font}', sans-serif\`,
      '--radius': brand.radius,
      '--primary': brand.primary
    } as any}>
      <div className="max-w-6xl mx-auto">
        ${layoutCode}
      </div>
    </div>
  );
}`;
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
}`;
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
      zip.file(".gitignore", "node_modules\n.next\n.env.local\n*.log");
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
      <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-indigo-600 to-purple-600" />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
