import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import mysql from "mysql2/promise";

const Dashboard = () => {
  const { data: answers, isLoading } = useQuery({
    queryKey: ["answers"],
    queryFn: async () => {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "survey",
        password: "salatiga2024",
        database: "survey_db"
      });

      const [rows] = await connection.execute(
        `SELECT q.question_text, COUNT(a.answer) as count, a.answer
         FROM questions q
         LEFT JOIN answers a ON q.id = a.question_id
         GROUP BY q.id, a.answer
         ORDER BY q.id, a.answer`
      );

      await connection.end();
      return rows;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Survey</h1>
      <div className="grid gap-8">
        {answers?.map((question: any, index: number) => (
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