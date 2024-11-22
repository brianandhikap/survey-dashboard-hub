import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchAnswers } from "@/services/api";

interface Answer {
  question_text: string;
  count: number;
  answer: string;
}

const Dashboard = () => {
  const { data: answers = [], isLoading } = useQuery({
    queryKey: ["answers"],
    queryFn: fetchAnswers
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