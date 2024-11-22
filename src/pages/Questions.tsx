import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import mysql from "mysql2/promise";

const Questions = () => {
  const [newQuestion, setNewQuestion] = useState("");
  const { toast } = useToast();

  const { data: questions, refetch } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "survey",
        password: "salatiga2024",
        database: "survey_db"
      });

      const [rows] = await connection.execute("SELECT * FROM questions");
      await connection.end();
      return rows;
    }
  });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "survey",
        password: "salatiga2024",
        database: "survey_db"
      });

      await connection.execute(
        "INSERT INTO questions (question_text) VALUES (?)",
        [newQuestion]
      );

      await connection.end();
      setNewQuestion("");
      refetch();
      toast({
        title: "Success",
        description: "Question added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add question",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Pertanyaan</h1>
      
      <form onSubmit={handleAddQuestion} className="space-y-4">
        <Textarea
          placeholder="Masukkan pertanyaan baru"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <Button type="submit">Tambah Pertanyaan</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pertanyaan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions?.map((question: any) => (
            <TableRow key={question.id}>
              <TableCell>{question.question_text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Questions;