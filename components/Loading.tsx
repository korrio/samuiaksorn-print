import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <Card className="p-6 max-w-3xl mx-auto text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading job details...</p>
    </Card>
  );
}