import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, CheckCircle2, Shield, Zap, Target, GitBranch, FileCheck, Layers, Box } from "lucide-react";

// SECURITY: 3D visualization placeholder components
// Replace with Spline scenes when ready: import Spline from '@splinetool/react-spline/next';
const Visual3D = ({ variant = "primary", className = "" }: { variant?: string; className?: string }) => {
  const gradients = {
    primary: "from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40",
    secondary: "from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30",
    tertiary: "from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30",
    quaternary: "from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30",
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant as keyof typeof gradients] || gradients.primary} rounded-2xl`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <Box className="w-24 h-24 text-muted-foreground/20 animate-pulse" strokeWidth={1} />
          <Layers className="w-16 h-16 text-muted-foreground/30 absolute top-4 left-4 animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ava
            </div>
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </div>
          <nav className="flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              Features
            </Link>
            <Link 
              href="#mission" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              Mission
            </Link>
            <Link 
              href="/sandbox" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sandbox
            </Link>
            <ThemeToggle />
            <Link href="/sandbox">
            <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with 3D */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-blue-950/20" />
        
        <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Advisory Compliance Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  Compliance That{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Guides
                  </span>
                  , Never Blocks
        </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Ava empowers teams to maintain standards without interrupting flow. 
                  Get instant feedback, smart task breakdowns, and compliance insights 
                  that accelerate—not impede—your work.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/sandbox">
            <Button size="lg" className="text-lg px-8">
                    Try Sandbox Free
                    <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Watch Demo
          </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  No credit card
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Free sandbox
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Setup in 2 min
                </div>
              </div>
            </div>

            {/* Right: 3D Visual */}
            <Visual3D variant="primary" className="h-[500px] lg:h-[600px]" />
            {/* To use Spline 3D: <Spline scene="https://prod.spline.design/18423bf6-cf36-4e8a-9713-afa1531bab31/scene.splinecode" /> */}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section id="mission" className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Our Mission
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Building tools that respect how teams actually work
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Traditional compliance tools force impossible choices: either sacrifice velocity 
              or compromise standards. Ava breaks this false dichotomy by providing{" "}
              <span className="font-semibold text-foreground">advisory guidance</span> that 
              informs without blocking, enabling teams to move fast while maintaining quality.
            </p>
            
            {/* Core principles */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 mb-3">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold">Advisory First</h3>
                <p className="text-sm text-muted-foreground">
                  Warnings guide decisions without blocking progress
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 mb-3">
                  <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold">Context Aware</h3>
                <p className="text-sm text-muted-foreground">
                  Different rules for different workspace contexts
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 mb-3">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold">Friction-Free</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent automation reduces manual compliance work
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to maintain standards
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful compliance tools that integrate seamlessly into your workflow
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
            {/* Feature 1: Advisory Mode */}
            <div className="order-2 lg:order-1">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                      <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">Advisory Mode</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Get compliance feedback without workflow interruption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Real-time warnings</p>
                        <p className="text-sm text-muted-foreground">
                          Instant feedback on compliance issues as they occur
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Non-blocking design</p>
                        <p className="text-sm text-muted-foreground">
                          Continue working while violations are flagged
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
                        <p className="font-medium">Suggested fixes</p>
                        <p className="text-sm text-muted-foreground">
                          Actionable recommendations for every issue
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <Visual3D variant="secondary" className="h-[400px]" />
              {/* <Spline scene="https://prod.spline.design/4cdf0d06-5ebb-40a5-8c14-1b0d587187f4/scene.splinecode" /> */}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
            {/* Feature 2: Contextual Rules */}
            <Visual3D variant="tertiary" className="h-[400px]" />
            {/* <Spline scene="https://prod.spline.design/d63cc85f-d7d3-4fac-b56b-d2864cd4cc59/scene.splinecode" /> */}
            <div>
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950">
                      <GitBranch className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-2xl">Contextual Rules</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Apply different standards to different workspace areas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Scope-based rules</p>
                        <p className="text-sm text-muted-foreground">
                          Different rules for /src, /tests, /docs directories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Sandbox testing</p>
                        <p className="text-sm text-muted-foreground">
                          Test rules safely before enabling enforcement
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Template library</p>
                        <p className="text-sm text-muted-foreground">
                          Pre-built rules for common compliance scenarios
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Feature 3: Smart Tasks */}
            <div className="order-2 lg:order-1">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                      <FileCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">Smart Task Management</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    AI-powered task breakdowns and conflict resolution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Auto-generated subtasks</p>
                        <p className="text-sm text-muted-foreground">
                          Break down compliance work into actionable steps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
                        <p className="font-medium">AI conflict resolution</p>
                        <p className="text-sm text-muted-foreground">
                          Intelligent guidance for resolving compliance conflicts
              </p>
            </div>
          </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
                        <p className="font-medium">Progress tracking</p>
                        <p className="text-sm text-muted-foreground">
                          Monitor compliance improvements over time
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <Visual3D variant="quaternary" className="h-[400px]" />
              {/* <Spline scene="https://prod.spline.design/104e1fbe-45c1-4055-9368-6b79be86d5a3/scene.splinecode" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Built for teams that need
            </h2>
            <p className="text-xl text-muted-foreground">
              Flexible compliance for every scenario
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📝",
                title: "Naming Conventions",
                description: "Enforce kebab-case, PascalCase, or custom patterns across your codebase",
              },
              {
                icon: "🔒",
                title: "Security Standards",
                description: "Block executable files, enforce size limits, track sensitive data",
              },
              {
                icon: "📂",
                title: "Project Structure",
                description: "Ensure files live in the right places with path-based rules",
              },
              {
                icon: "📊",
                title: "Documentation",
                description: "Require metadata fields like author, tags, and custom properties",
              },
            ].map((useCase, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
          <CardHeader>
                  <div className="text-4xl mb-3">{useCase.icon}</div>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
          </CardHeader>
          <CardContent>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <CardHeader className="pb-0">
                <CardTitle className="text-3xl lg:text-4xl mb-4">
                  Ready to transform compliance?
                </CardTitle>
                <CardDescription className="text-base mb-6">
                  Start with our sandbox environment—no signup, no credit card, 
                  no hassle. Experience advisory compliance in 2 minutes.
                </CardDescription>
                <div className="space-y-3 pt-4">
            <Link href="/sandbox">
                    <Button size="lg" className="w-full md:w-auto text-lg px-12">
                Launch Sandbox
                      <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
                  <p className="text-sm text-muted-foreground">
                    Works entirely in your browser • No installation required
                  </p>
                </div>
              </CardHeader>
              <div className="h-[300px] md:h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg" />
              </div>
            </div>
        </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ava
              </div>
              <p className="text-sm text-muted-foreground">
                Compliance that guides, never blocks.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/sandbox" className="hover:text-foreground transition-colors">Sandbox</Link></li>
                <li><Link href="#mission" className="hover:text-foreground transition-colors">Mission</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Ava. Built for teams that care about quality.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
