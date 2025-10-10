import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-slate-900">Ava</div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">BETA</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sandbox" className="text-sm text-slate-600 hover:text-slate-900">
              Try Sandbox
            </Link>
            <Button size="sm">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Compliance That Guides,<br />Never Blocks
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Ava helps teams maintain standards without stopping work. Get instant feedback,
          smart task breakdowns, and compliance insights that actually help.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sandbox">
            <Button size="lg" className="text-lg px-8">
              Try Sandbox Demo
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Advisory Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ava warns about compliance issues without blocking your work. Make informed
                decisions about when to fix things.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Smart Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Auto-generate subtasks, resolve conflicts with AI guidance, and track
                compliance-related work effortlessly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Contextual Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Apply different standards to different parts of your workspace. Test rules
                safely in sandbox mode.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Built For Teams That Need</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="text-2xl">📝</div>
            <div>
              <h3 className="font-semibold mb-2">Naming Conventions</h3>
              <p className="text-slate-600 text-sm">
                Enforce kebab-case, PascalCase, or custom patterns across your codebase
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-semibold mb-2">Security Standards</h3>
              <p className="text-slate-600 text-sm">
                Block executable files, enforce file size limits, and track sensitive data
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">📂</div>
            <div>
              <h3 className="font-semibold mb-2">Project Structure</h3>
              <p className="text-slate-600 text-sm">
                Ensure files live in the right places with path-based rules
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-slate-600 text-sm">
                Require metadata fields like author, tags, and custom properties
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Try Ava?</CardTitle>
            <CardDescription className="text-base">
              Start with our sandbox environment - no signup required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sandbox">
              <Button size="lg" className="text-lg px-12">
                Launch Sandbox
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-slate-600">
          <p>© 2025 Ava. Built for teams that care about quality.</p>
        </div>
      </footer>
    </div>
  );
}
