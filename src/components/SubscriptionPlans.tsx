import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₹999",
    period: "/year",
    description: "Perfect for small shops",
    features: [
      "Basic billing & invoicing",
      "Customer management",
      "Inventory tracking (100 items)",
      "Monthly reports",
      "WhatsApp sharing",
      "Cloud backup"
    ],
    buttonText: "Get Started",
    variant: "outline" as const
  },
  {
    name: "Pro",
    price: "₹1,499",
    period: "/year",
    description: "Most popular for growing businesses",
    popular: true,
    features: [
      "Advanced billing & invoicing",
      "Unlimited customers",
      "Inventory tracking (1000 items)",
      "GST reports & filing",
      "Multi-language support",
      "Priority support",
      "Advanced analytics",
      "Cloud backup & sync"
    ],
    buttonText: "Choose Pro",
    variant: "gradient" as const
  },
  {
    name: "Advanced",
    price: "₹2,499",
    period: "/year",
    description: "For established businesses",
    features: [
      "Everything in Pro",
      "Unlimited inventory",
      "Multi-location support",
      "Custom invoice templates",
      "API access",
      "White-label options",
      "Dedicated support",
      "Advanced integrations"
    ],
    buttonText: "Go Advanced",
    variant: "accent" as const
  }
];

export function SubscriptionPlans() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlock powerful billing features for your business
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative ${plan.popular ? 'border-primary shadow-elegant scale-105' : ''} hover:shadow-glow transition-all duration-300`}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-accent"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button 
                  variant={plan.variant}
                  className="w-full h-12 text-base font-semibold"
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Secure payment methods available</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>UPI</span>
            <span>•</span>
            <span>Debit/Credit Cards</span>
            <span>•</span>
            <span>NetBanking</span>
            <span>•</span>
            <span>Google Pay</span>
            <span>•</span>
            <span>Wallets</span>
          </div>
        </div>
      </div>
    </div>
  );
}