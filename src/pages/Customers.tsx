import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { pool } from "@/lib/db";

interface Customer {
  id: number;
  customer_id: string;
  name: string;
}

const Customers = () => {
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const [rows] = await pool.query('SELECT * FROM customers');
      return rows as Customer[];
    }
  });

  const addCustomerMutation = useMutation({
    mutationFn: async (newCustomer: { customer_id: string; name: string }) => {
      await pool.query(
        'INSERT INTO customers (customer_id, name) VALUES (?, ?)',
        [newCustomer.customer_id, newCustomer.name]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Success", description: "Customer added successfully" });
      setNewCustomerId("");
      setNewCustomerName("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add customer: " + error.message,
      });
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (customer: Customer) => {
      await pool.query(
        'UPDATE customers SET customer_id = ?, name = ? WHERE id = ?',
        [customer.customer_id, customer.name, customer.id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Success", description: "Customer updated successfully" });
      setEditingCustomer(null);
      setNewCustomerId("");
      setNewCustomerName("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer: " + error.message,
      });
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number) => {
      await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Success", description: "Customer deleted successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer: " + error.message,
      });
    }
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    addCustomerMutation.mutate({ customer_id: newCustomerId, name: newCustomerName });
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    
    updateCustomerMutation.mutate({
      id: editingCustomer.id,
      customer_id: newCustomerId,
      name: newCustomerName
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">ID Pelanggan</h1>
      
      <form onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer} className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="ID Pelanggan"
            value={newCustomerId}
            onChange={(e) => setNewCustomerId(e.target.value)}
          />
          <Input
            placeholder="Nama Pelanggan"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
          />
          <Button type="submit">
            {editingCustomer ? "Update Pelanggan" : "Tambah Pelanggan"}
          </Button>
          {editingCustomer && (
            <Button variant="outline" onClick={() => {
              setEditingCustomer(null);
              setNewCustomerId("");
              setNewCustomerName("");
            }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Pelanggan</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.customer_id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCustomer(customer)}
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
                        This action cannot be undone. This will permanently delete the customer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCustomerMutation.mutate(customer.id)}>
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

export default Customers;
