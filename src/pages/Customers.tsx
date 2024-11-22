import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

// Mock data interface
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
  const { toast } = useToast();

  const { data: customers = mockCustomers, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      // In a real application, this would be an API call
      return mockCustomers;
    }
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, this would be an API call
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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">ID Pelanggan</h1>
      
      <form onSubmit={handleAddCustomer} className="space-y-4">
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
          <Button type="submit">Tambah Pelanggan</Button>
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Pelanggan</TableHead>
            <TableHead>Nama</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.customer_id}</TableCell>
              <TableCell>{customer.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Customers;