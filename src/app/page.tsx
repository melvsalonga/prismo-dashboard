export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Prismo
          </h1>
          <p className="text-xl text-muted-foreground">
            Social Media Dashboard for Multi-Platform Management
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Multi-Platform Posting</h3>
              <p className="text-muted-foreground">
                Publish content across Twitter, Facebook, Instagram, LinkedIn, and TikTok simultaneously.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Content Scheduling</h3>
              <p className="text-muted-foreground">
                Schedule posts for optimal engagement times across different time zones.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground">
                Track performance metrics and engagement across all your social platforms.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Engagement Monitoring</h3>
              <p className="text-muted-foreground">
                Monitor comments, mentions, and messages in one unified dashboard.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Collaborate with team members on content creation and approval workflows.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
              <p className="text-muted-foreground">
                Manage your social media presence from any device, anywhere.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Project Foundation Complete</h2>
              <p className="text-muted-foreground mb-4">
                Next.js 14 with TypeScript, Tailwind CSS, and core project structure is now set up.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">Next.js 14</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">TypeScript</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">Tailwind CSS</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">App Router</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">ESLint</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">Prettier</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
