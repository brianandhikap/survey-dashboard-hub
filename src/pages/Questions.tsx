import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

// Mock data interface
interface Question {
  id: number;
  question_text: string;
}

const mockQuestions: Question[] = [
  { id: 1, question_text: "How satisfied are you with our service?" },
  { id: 2, question_text: "Would you recommend us to others?" },
];

const Questions = () => {
  const [newQuestion, setNewQuestion] = useState("");
  const { toast } = useToast();

  const { data: questions = mockQuestions, refetch } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      // In a real application, this would be an API call
      return mockQuestions;
    }
  });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, this would be an API call
      mockQuestions.push({
        id: mockQuestions.length + 1,
        question_text: newQuestion
      });

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
          {questions.map((question) => (
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