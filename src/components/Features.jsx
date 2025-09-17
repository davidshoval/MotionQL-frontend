import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Brain, Palette, BarChart3, RefreshCw, Users, Zap, Building, CheckCircle, Factory, DollarSign } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Query Builder",
      description: "Write natural language queries and let our AI convert them to MongoDB syntax automatically.",
      icon: Brain
    },
    {
      title: "Visual Query Interface",
      description: "Build complex queries with our intuitive drag-and-drop interface, just like Studio 3T.",
      icon: Palette
    },
    {
      title: "Advanced Data Visualization",
      description: "Create stunning charts and graphs to understand your data patterns instantly.",
      icon: BarChart3
    },
    {
      title: "Smart Import/Export",
      description: "Seamlessly import and export data in multiple formats with intelligent mapping.",
      icon: RefreshCw
    },
    // {
    //   title: "Real-time Collaboration",
    //   description: "Work together with your team on queries and share insights in real-time.",
    //   icon: Users
    // },
    {
      title: "Performance Analytics",
      description: "Monitor query performance and optimize your database operations effortlessly.",
      icon: Zap
    },
      {
        title: "Commercial Use License",
        description: "Use Xquery.io in your commercial projects without restrictions. No licensing fees, no limitations, completely free.",
        icon: Building
      }
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need and More
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            All the features you love from Studio 3T, enhanced with AI capabilities and modern design
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-primary transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Commercial Use Callout */}
        <div className="mt-16 bg-gradient-primary rounded-2xl p-8 text-center text-primary-foreground">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold">
              Free for Commercial Use
            </h3>
          </div>
          <p className="text-primary-foreground/90 mb-6 max-w-3xl mx-auto">
            Use Xquery.io in your business, startup, or enterprise without any licensing restrictions.
            No hidden fees, no user limits, no commercial license required - completely free.
          </p>
          <p className="text-xs text-primary-foreground/60 max-w-2xl mx-auto mb-8">
            Xquery.io is currently free for 12 months of full commercial use. Renewals may be free or paid depending on future plans. No credit card required to start.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-primary-foreground/90 font-medium">Production Ready</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Factory className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-primary-foreground/90 font-medium">Enterprise Use</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-primary-foreground/90 font-medium">Zero Licensing Costs</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
