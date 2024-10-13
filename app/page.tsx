import BusinessPlanGenerator from '@/components/BusinessPlanGenerator';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Business Plan Generator</h1>
      <BusinessPlanGenerator />
    </div>
  );
}