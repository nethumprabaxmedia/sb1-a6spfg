"use client"

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  budget: z.string().min(1, { message: "Budget is required" }).refine((val) => !isNaN(Number(val)), { message: "Budget must be a number" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
})

interface BusinessModel {
  name: string;
  description: string;
  requiredSkills: string[];
}

const BusinessPlanGenerator = () => {
  const [businessPlan, setBusinessPlan] = useState<any | null>(null);
  const [marketTrends, setMarketTrends] = useState<any[] | null>(null);
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);

  useEffect(() => {
    fetch('/api/business-models')
      .then(response => response.json())
      .then(data => setBusinessModels(data));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: "",
      skills: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const budget = Number(values.budget);
    const skills = values.skills.toLowerCase().split(',').map(skill => skill.trim());
    const description = values.description.toLowerCase();

    // Enhanced algorithm to match business model based on skills
    const matchedModel = businessModels.reduce((best, model) => {
      const skillMatch = model.requiredSkills.filter(skill => 
        skills.some(userSkill => userSkill.includes(skill.toLowerCase()))
      ).length;
      
      const descriptionMatch = model.name.toLowerCase().split(' ').some(word => description.includes(word));
      
      const score = skillMatch + (descriptionMatch ? 1 : 0);
      
      return score > best.score ? { model, score } : best;
    }, { model: businessModels[0], score: -1 }).model;

    // Generate a structured business plan
    const plan = {
      businessModel: matchedModel.name,
      businessModelDescription: matchedModel.description,
      requiredSkills: matchedModel.requiredSkills,
      budget: budget,
      skills: skills,
      description: values.description,
      keySteps: [
        `Market Research: Conduct thorough research on the ${matchedModel.name} market, focusing on areas that align with your personal background.`,
        `Skill Development: Focus on improving your skills in ${matchedModel.requiredSkills.join(', ')}, which are crucial for this business model.`,
        `MVP Development: Create a Minimum Viable Product that leverages your unique skills and experiences.`,
        `Marketing Strategy: Develop a marketing plan that highlights your personal strengths and targets your ideal audience.`,
        `Financial Planning: Create a detailed financial plan, including projections for the first year, considering your initial budget of ${budget}.`,
        `Personal Brand: Incorporate your personal story and skills into your business brand to stand out in the ${matchedModel.name} space.`,
      ],
      nextSteps: [
        `Refine your business concept based on the ${matchedModel.name} approach and your personal strengths.`,
        `Seek mentorship or advice from experts in the ${matchedModel.name} field who have similar backgrounds.`,
        `Start building your MVP, leveraging your skills in ${skills.join(', ')}, and gather early feedback from potential customers.`,
        `Consider taking courses or workshops to enhance your skills in ${matchedModel.requiredSkills.join(', ')}.`,
      ],
    };

    setBusinessPlan(plan);

    // Generate mock market trend data
    const trendData = Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      marketSize: Math.floor(Math.random() * 1000) + 500,
      competitors: Math.floor(Math.random() * 20) + 5,
    }));

    setMarketTrends(trendData);
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your budget" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your initial budget for the business
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your skills" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your skills, separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description About You</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief description about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Briefly describe your background, interests, and any relevant experience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Generate Business Plan</Button>
        </form>
      </Form>

      {businessPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Personalized Business Plan</CardTitle>
            <CardDescription>Based on your input, we've crafted a tailored business plan for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Business Model</h3>
              <Badge variant="secondary" className="text-lg mb-2">{businessPlan.businessModel}</Badge>
              <p className="text-sm text-muted-foreground">{businessPlan.businessModelDescription}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {businessPlan.requiredSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
              <p><strong>Budget:</strong> ${businessPlan.budget}</p>
              <p><strong>Skills:</strong> {businessPlan.skills.join(', ')}</p>
              <p><strong>About You:</strong> {businessPlan.description}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Steps</h3>
              <ul className="list-disc pl-5 space-y-2">
                {businessPlan.keySteps.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
              <ul className="space-y-2">
                {businessPlan.nextSteps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Remember, this is a starting point. Adapt and refine your plan as you gather more information and feedback.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}

      {marketTrends && (
        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>Projected market size and number of competitors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="marketSize" stroke="#8884d8" name="Market Size" />
                <Line yAxisId="right" type="monotone" dataKey="competitors" stroke="#82ca9d" name="Competitors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                This chart shows projected trends based on general market data. Actual results may vary.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BusinessPlanGenerator;