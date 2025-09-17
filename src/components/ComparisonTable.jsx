import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, X, Zap } from "lucide-react";

const ComparisonTable = () => {
  const features = [
    {
      category: "Core Features",
      items: [
        { feature: "Visual Query Builder", xquery: true, studio3t: true, highlight: false },
        { feature: "MongoDB Connection Manager", xquery: true, studio3t: true, highlight: false },
        { feature: "Data Import/Export", xquery: true, studio3t: true, highlight: false },
        { feature: "Index Management", xquery: true, studio3t: true, highlight: false },
        { feature: "Schema Visualization", xquery: true, studio3t: true, highlight: false },
      ]
    },
    {
      category: "AI & Automation",
      items: [
        { feature: "AI-Powered Query Generation", xquery: true, studio3t: true, highlight: true },
        { feature: "Natural Language Queries", xquery: true, studio3t: true, highlight: true },
        { feature: "Smart Query Optimization", xquery: true, studio3t: false, highlight: true },
        { feature: "Automated Index Suggestions", xquery: true, studio3t: false, highlight: true },
        { feature: "Performance Insights AI", xquery: true, studio3t: false, highlight: true },
      ]
    },
    {
      category: "Advanced Features",
      items: [
        // { feature: "Real-time Collaboration", xquery: true, studio3t: "Pro Only", highlight: false },
        { feature: "Advanced Aggregation Pipeline", xquery: true, studio3t: true, highlight: false },
        { feature: "Data Visualization Charts", xquery: true, studio3t: true, highlight: false },
        { feature: "SQL to MongoDB Migration", xquery: true, studio3t: true, highlight: false },
        { feature: "Backup & Restore", xquery: true, studio3t: true, highlight: false },
      ]
    },
    // {
    //   category: "Enterprise Features",
    //   items: [
    //     { feature: "SSO Integration", xquery: true, studio3t: "Enterprise", highlight: false },
    //     { feature: "Role-based Access Control", xquery: true, studio3t: "Pro+", highlight: false },
    //     { feature: "Audit Logging", xquery: true, studio3t: "Enterprise", highlight: false },
    //     { feature: "API Access", xquery: true, studio3t: "Pro+", highlight: false },
    //     { feature: "White-label Options", xquery: true, studio3t: false, highlight: true },
    //   ]
    // }
  ];

  return (
    <section id="comparison" className="hidden lg:block py-20 px-6 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Feature-by-Feature Comparison
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Xquery.io stacks up against Studio 3T across all feature categories
          </p>
        </div>

        <Card className="shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-primary text-primary-foreground text-center py-6">
            <CardTitle className="text-2xl">Complete Feature Matrix</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Feature Category</th>
                    <th className="text-center p-4 font-semibold text-primary">Xquery.io</th>
                    <th className="text-center p-4 font-semibold">Studio 3T</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={`category-${categoryIndex}`}>
                      <tr className="bg-accent/30">
                        <td colSpan={3} className="p-4 font-bold text-foreground border-t">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr 
                          key={`${categoryIndex}-${itemIndex}`} 
                          className={`hover:bg-muted/30 transition-colors animate-fade-in ${item.highlight ? 'bg-primary/5' : ''}`}
                          style={{ animationDelay: `${(categoryIndex * category.items.length + itemIndex) * 0.05}s` }}
                        >
                          <td className="p-4 text-foreground">
                            <div className="flex items-center">
                              {item.highlight && <Zap className="w-4 h-4 text-primary mr-2" />}
                              {item.feature}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {item.xquery === true ? (
                              <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                            ) : typeof item.xquery === 'string' ? (
                              <span className="text-sm text-muted-foreground">{item.xquery}</span>
                            ) : (
                              <X className="w-6 h-6 text-muted-foreground mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {item.studio3t === true ? (
                              <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                            ) : item.studio3t === false ? (
                              <X className="w-6 h-6 text-destructive mx-auto" />
                            ) : (
                              <span className="text-sm text-muted-foreground">{item.studio3t}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* <div className="p-6 bg-primary/5 border-t">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="text-2xl font-bold text-primary mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Unique AI Features</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="text-2xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Studio 3T Parity</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="text-2xl font-bold text-primary mb-2">FREE</div>
                  <div className="text-sm text-muted-foreground">Forever</div>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ComparisonTable;
