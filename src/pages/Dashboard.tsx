import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data interface
interface Answer {
  question_text: string;
  count: number;
  answer: string;
}

const mockAnswers: Answer[] = [
  { question_text: "How satisfied are you with our service?", count: 5, answer: "Very Satisfied" },
  { question_text: "Would you recommend us to others?", count: 8, answer: "Yes" },
];

const Dashboard = () => {
  const { data: answers = mockAnswers, isLoading } = useQuery({
    queryKey: ["answers"],
    queryFn: async () => {
      // In a real application, this would be an API call
      return mockAnswers;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Survey</h1>
      <div className="grid gap-8">
        {answers.map((question, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[question]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="answer" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;