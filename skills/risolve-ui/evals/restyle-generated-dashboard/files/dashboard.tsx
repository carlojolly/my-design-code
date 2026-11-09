"use client";

// A typical generated admin dashboard: the input for the restyle test.
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, DollarSign, Package, Sparkles, TrendingUp, Users } from "lucide-react";

const stats = [
  { title: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", icon: DollarSign },
  { title: "Active Users", value: "2,350", change: "+180.1% from last month", icon: Users },
  { title: "Orders", value: "12,234", change: "+19% from last month", icon: Package },
  { title: "Growth Rate", value: "573", change: "+201 since last hour", icon: TrendingUp },
];

const orders = [
  { id: "ORD-001", customer: "John Doe", email: "john@example.com", status: "Pending", amount: "$250.00", date: "2024-01-15" },
  { id: "ORD-002", customer: "Jane Smith", email: "jane@example.com", status: "Completed", amount: "$150.00", date: "2024-01-15" },
  { id: "ORD-003", customer: "Acme Corp", email: "billing@acme.com", status: "Completed", amount: "$350.00", date: "2024-01-15" },
  { id: "ORD-004", customer: "Bob Johnson", email: "bob@example.com", status: "Failed", amount: "$450.00", date: "2024-01-15" },
  { id: "ORD-005", customer: "Alice Brown", email: "alice@example.com", status: "Completed", amount: "$550.00", date: "2024-01-15" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-8">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text font-bold text-3xl text-transparent">Welcome back, Admin! 👋</h1>
        <p className="mt-2 text-gray-500">Here's an overview of your business performance at a glance.</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-0 shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-gray-500 text-sm uppercase tracking-wider">{s.title}</CardTitle>
              <div className="rounded-full bg-purple-100 p-2">
                <s.icon className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">{s.value}</div>
              <p className="text-green-500 text-xs">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-semibold">Recent Orders</CardTitle>
            <CardDescription>You have 5 new orders this month — keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase">Order</TableHead>
                  <TableHead className="text-xs uppercase">Customer</TableHead>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                  <TableHead className="text-xs uppercase">Date</TableHead>
                  <TableHead className="text-right text-xs uppercase">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="py-2 font-medium text-sm">{o.id}</TableCell>
                    <TableCell className="py-2 text-sm">
                      <div className="font-medium">{o.customer}</div>
                      <div className="text-gray-500 text-xs">{o.email}</div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge className={o.status === "Failed" ? "bg-red-500" : o.status === "Pending" ? "bg-slate-900" : "bg-green-500"}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="py-2 text-gray-500 text-sm">{o.date}</TableCell>
                    <TableCell className="py-2 text-right text-sm">{o.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" /> AI Insights ✨
            </CardTitle>
            <CardDescription className="text-purple-100">Powered by advanced machine learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Your revenue is trending upward! Consider expanding your top-performing product lines to maximize growth potential.</p>
            <Button variant="secondary" className="w-full">
              View Full Report <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
