import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { pool } from "@/lib/db";

interface Question {
  id: number;
  question_text: string;
}

const Questions = () => {
  const [newQuestion, setNewQuestion] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const [rows] = await pool.query('SELECT * FROM questions');
      return rows as Question[];
    }
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (questionText: string) => {
      await pool.query(
        'INSERT INTO questions (question_text) VALUES (?)',
        [questionText]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Success", description: "Question added successfully" });
      setNewQuestion("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add question: " + error.message,
      });
    }
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (question: Question) => {
      await pool.query(
        'UPDATE questions SET question_text = ? WHERE id = ?',
        [question.question_text, question.id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Success", description: "Question updated successfully" });
      setEditingQuestion(null);
      setNewQuestion("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update question: " + error.message,
      });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      await pool.query('DELETE FROM questions WHERE id = ?', [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Success", description: "Question deleted successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete question: " + error.message,
      });
    }
  });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    addQuestionMutation.mutate(newQuestion);
  };

  const handleUpdateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    
    updateQuestionMutation.mutate({
      id: editingQuestion.id,
      question_text: newQuestion
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Pertanyaan</h1>
      
      <form onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion} className="space-y-4">
        <Textarea
          placeholder="Masukkan pertanyaan baru"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <div className="flex gap-4">
          <Button type="submit">
            {editingQuestion ? "Update Pertanyaan" : "Tambah Pertanyaan"}
          </Button>
          {editingQuestion && (
            <Button variant="outline" onClick={() => {
              setEditingQuestion(null);
              setNewQuestion("");
            }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pertanyaan</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.question_text}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditQuestion(question)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the question.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteQuestion(question.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Questions;
