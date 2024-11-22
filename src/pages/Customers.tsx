import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import mysql from "mysql2/promise";

const Customers = () => {
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const { toast } = useToast();

  const { data: customers, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "survey",
        password: "salatiga2024",
        database: "survey_db"
      });

      const [rows] = await connection.execute("SELECT * FROM customers");
      await connection.end();
      return rows;
    }
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "survey",
        password: "salatiga2024",
        database: "survey_db"
      });

      await connection.execute(
        "INSERT INTO customers (customer_id, name) VALUES (?, ?)",
        [newCustomerId, newCustomerName]
      );

      await connection.end();
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
          {customers?.map((customer: any) => (
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