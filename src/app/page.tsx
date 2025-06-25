"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Star,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  ShoppingCart,
  Zap,
  DollarSign,
  Smile,
} from "lucide-react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Loading } from "@/components/ui/loading";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
      // If user is logged in, redirect to dashboard
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }
  
  // If user is authenticated, don't render the home page content
  // The useEffect will handle the redirect
  if (user) {
    return null;
  }

  const benefits = [
    "Enterprise-grade security",
    "24/7 expert support",
    "99.9% uptime guarantee",
    "Global scalability",
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: "Streamlined Order Management",
      description: "Efficiently manage all your food orders in one place with our intuitive dashboard and automated workflows.",
      bgColor: "bg-purple-500/10",
      color: "text-purple-500",
    },
    {
      icon: MessageCircle,
      title: "Real-time Customer Communication",
      description: "Connect with your customers instantly through WhatsApp, providing updates and answering questions in real-time.",
      bgColor: "bg-primary/10",
      color: "text-primary",
    },
    {
      icon: Zap,
      title: "Automated Order Processing",
      description: "Let our system handle routine tasks automatically, from order confirmation to delivery notifications.",
      bgColor: "bg-green-500/10",
      color: "text-green-500",
    },
    {
      icon: DollarSign,
      title: "Reduced Operational Costs",
      description: "Minimize staffing needs and eliminate expensive POS systems with our cost-effective WhatsApp solution.",
      bgColor: "bg-red-500/10",
      color: "text-red-500",
    },
    {
      icon: Smile,
      title: "Enhanced Customer Satisfaction",
      description: "Delight your customers with quick responses, personalized service, and seamless ordering experience.",
      bgColor: "bg-yellow-500/10",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="container-responsive">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-medium">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-gradient-primary">
                  WABA Admin
                </span>
                <div className="text-xs text-muted-foreground">
                  Business Portal
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="btn-primary">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                <Star className="h-4 w-4" />
                Trusted by 10,000+ food businesses
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Revolutionize Your{" "}
                <span className="text-gradient-primary">Food Business</span>{" "}
                with WhatsApp
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Integrate our powerful WhatsApp-based system to streamline order management, automate processes, and delight your customers with real-time communication.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary px-8 py-3 text-base"
                >
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-base"
                >
                  <Link href="/login">
                    Sign In
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm text-gray-600">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Demo Card */}
            <div className="relative animate-scale-in">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative card-glass p-6 lg:p-8">
                <div className="flex items-center mb-6 pb-4 border-b border-white/20">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mr-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">WABA Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Live Demo</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-primary/10 rounded"></div>
                      <div className="h-4 w-1/3 bg-primary/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your food business operations and deliver exceptional customer experiences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 lg:p-8">
                  <div
                    className={`h-14 w-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container-responsive relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of food companies already using WABA Admin to transform
              their customer communications.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Active Businesses" },
              { number: "50M+", label: "Messages Processed" },
              { number: "99.9%", label: "Uptime Guarantee" },
              { number: "24/7", label: "Expert Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-3xl sm:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Food Business?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary px-8 py-3 text-base"
            >
              <Link href="/signup">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}