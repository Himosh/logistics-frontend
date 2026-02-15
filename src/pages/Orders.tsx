import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Loader2, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { searchOrders, updateOrderStatus } from "@/lib/api";
import { PaginationControls } from "@/components/PaginationControls";
import { CreateOrderModal } from "@/components/CreateOrderModal";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["Pending", "Shipped", "Cancelled"] as const;

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Shipped" ? "default" :
    status === "Cancelled" ? "destructive" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function OrdersPage() {
  const [productName, setProductName] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { limit, offset };
      if (productName) params.product_name = productName;
      if (status) params.status = status;
      if (dateFrom) params.date_from = format(dateFrom, "yyyy-MM-dd");
      if (dateTo) params.date_to = format(dateTo, "yyyy-MM-dd");

      const data = await searchOrders(params as any);
      setItems(data.items);
      setTotal(data.total);
    } catch {
      // toast handled
    } finally {
      setLoading(false);
    }
  }, [productName, status, dateFrom, dateTo, limit, offset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus as Order["status"] });
      fetchData();
    } catch {
      // toast handled
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-end gap-3 justify-between">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Product name…"
                className="pl-9"
                value={productName}
                onChange={(e) => { setProductName(e.target.value); setOffset(0); }}
              />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-40">
                <Select value={status} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setOffset(0); }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-40 justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => { setDateFrom(date); setOffset(0); }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {dateFrom && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => { setDateFrom(undefined); setOffset(0); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <span className="text-muted-foreground text-sm">to</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-40 justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => { setDateTo(date); setOffset(0); }}
                      initialFocus
                      disabled={(date) => dateFrom ? date < dateFrom : false}
                    />
                  </PopoverContent>
                </Popover>
                {dateTo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => { setDateTo(undefined); setOffset(0); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Order ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="w-44">Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {loading ? "Loading…" : "No orders found"}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(o.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {o.items.map((it) => `${it.product_name} ×${it.quantity_ordered}`).join(", ")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.status}
                        onValueChange={(v) => handleStatusUpdate(o.id, v)}
                        disabled={updatingId === o.id}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          {updatingId === o.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationControls
            total={total}
            limit={limit}
            offset={offset}
            onLimitChange={setLimit}
            onOffsetChange={setOffset}
          />
        </CardContent>
      </Card>

      <CreateOrderModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
