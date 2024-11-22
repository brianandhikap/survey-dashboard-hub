import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";

interface Customer {
  id: number;
  customer_id: string;
  name: string;
}

const mockCustomers: Customer[] = [
  { id: 1, customer_id: "CUST001", name: "John Doe" },
  { id: 2, customer_id: "CUST002", name: "Jane Smith" },
];

const Customers = () => {
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const { data: customers = mockCustomers, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => mockCustomers
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mockCustomers.push({
        id: mockCustomers.length + 1,
        customer_id: newCustomerId,
        name: newCustomerName
      });

      setNewCustomerId("");
      setNewCustomerName("");
      refetch();
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add customer",
      });
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomerId(customer.customer_id);
    setNewCustomerName(customer.name);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;

    const index = mockCustomers.findIndex(c => c.id === editingCustomer.id);
    if (index !== -1) {
      mockCustomers[index] = {
        ...editingCustomer,
        customer_id: newCustomerId,
        name: newCustomerName
      };
      
      setEditingCustomer(null);
      setNewCustomerId("");
      setNewCustomerName("");
      refetch();
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
    }
  };

  const handleDeleteCustomer = (id: number) => {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCustomers.splice(index, 1);
      refetch();
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    }
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
                      <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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