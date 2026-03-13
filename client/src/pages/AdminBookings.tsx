import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Calendar, Mail, Phone, User, Bed, RefreshCw, Search, Trash2,
  FileDown, StickyNote, ChevronUp, ChevronDown, IndianRupee,
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@shared/schema";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "checked_in", label: "Checked In" },
];

const ROOM_OPTIONS = [
  { value: "all", label: "All Room Types" },
  { value: "single", label: "Single Occupancy" },
  { value: "double", label: "Double Occupancy" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  checked_in: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  checked_in: "Checked In",
};

const PAYMENT_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  partial: "bg-orange-100 text-orange-800",
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: "Unpaid",
  paid: "Paid",
  partial: "Partial",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-700"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string | null | undefined }) {
  const s = status || "pending";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_STYLES[s] || "bg-gray-100 text-gray-700"}`}>
      {PAYMENT_LABELS[s] || s}
    </span>
  );
}

type SortField = "createdAt" | "name" | "moveInDate";
type SortDir = "asc" | "desc";

export default function AdminBookings() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notesBooking, setNotesBooking] = useState<Booking | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const { data: bookings, isLoading, isFetching } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string; notes?: string; paymentStatus?: string } }) =>
      apiRequest("PATCH", `/api/admin/bookings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "Updated", description: "Booking updated successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update booking", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/bookings/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setDeleteId(null);
      toast({ title: "Deleted", description: "Booking deleted successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete booking", variant: "destructive" }),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleExportCSV = () => {
    if (!filtered) return;
    const headers = ["Name", "Email", "Phone", "Room Type", "Move-in Date", "Status", "Payment", "Notes", "Submitted"];
    const rows = filtered.map((b) => [
      b.name, b.email, b.phone,
      b.roomType === "single" ? "Single Occupancy" : "Double Occupancy",
      format(new Date(b.moveInDate), "yyyy-MM-dd"),
      STATUS_LABELS[b.status] || b.status,
      PAYMENT_LABELS[b.paymentStatus || "pending"] || b.paymentStatus || "pending",
      b.notes || "",
      format(new Date(b.createdAt), "yyyy-MM-dd HH:mm"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Blrstay-bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = bookings
    ? bookings
        .filter((b) => {
          const q = search.toLowerCase();
          const matchSearch = !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone.includes(q);
          const matchStatus = statusFilter === "all" || b.status === statusFilter;
          const matchRoom = roomFilter === "all" || b.roomType === roomFilter;
          return matchSearch && matchStatus && matchRoom;
        })
        .sort((a, b) => {
          let cmp = 0;
          if (sortField === "name") cmp = a.name.localeCompare(b.name);
          else if (sortField === "moveInDate") cmp = new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime();
          else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          return sortDir === "asc" ? cmp : -cmp;
        })
    : [];

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold">Bookings</h2>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${filtered.length} of ${bookings?.length ?? 0} inquiries`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => { queryClient.invalidateQueries({ queryKey: ["/api/bookings"] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] }); }}
            disabled={isFetching}
            data-testid="button-refresh-bookings"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={!filtered.length} data-testid="button-export-csv">
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-bookings"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44" data-testid="select-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-44" data-testid="select-room-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROOM_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">Loading bookings...</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{bookings?.length ? "No bookings match your filters" : "No bookings yet"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort("name")} data-testid="th-name">
                  <User className="w-3.5 h-3.5 inline mr-1" />Name<SortIcon field="name" />
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />Contact
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  <Bed className="w-3.5 h-3.5 inline mr-1" />Room
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort("moveInDate")} data-testid="th-movein">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />Move-in<SortIcon field="moveInDate" />
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  <IndianRupee className="w-3.5 h-3.5 inline mr-1" />Payment
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort("createdAt")} data-testid="th-submitted">
                  Submitted<SortIcon field="createdAt" />
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking, i) => (
                <tr key={booking.id} className={`border-t ${i % 2 === 0 ? "" : "bg-muted/20"} hover:bg-muted/40 transition-colors`} data-testid={`booking-row-${booking.id}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.name}</p>
                    {booking.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate" title={booking.notes}>
                        <StickyNote className="w-3 h-3 inline mr-1" />{booking.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-muted-foreground">{booking.email}</p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />{booking.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.roomType === "single" ? "Single" : "Double"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {format(new Date(booking.moveInDate), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <Select value={booking.status} onValueChange={(val) => updateMutation.mutate({ id: booking.id, data: { status: val } })}>
                      <SelectTrigger className="h-7 w-32 text-xs px-2" data-testid={`select-status-${booking.id}`}>
                        <StatusBadge status={booking.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={booking.paymentStatus || "pending"} onValueChange={(val) => updateMutation.mutate({ id: booking.id, data: { paymentStatus: val } })}>
                      <SelectTrigger className="h-7 w-28 text-xs px-2" data-testid={`select-payment-${booking.id}`}>
                        <PaymentBadge status={booking.paymentStatus} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Unpaid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                    {format(new Date(booking.createdAt), "dd MMM yy")}
                    <br />
                    {format(new Date(booking.createdAt), "h:mm a")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="icon" variant="ghost" title="Edit notes"
                        onClick={() => { setNotesBooking(booking); setNotesValue(booking.notes || ""); }}
                        data-testid={`button-notes-${booking.id}`}
                      >
                        <StickyNote className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon" variant="ghost" title="Delete booking"
                        onClick={() => setDeleteId(booking.id)}
                        className="text-destructive"
                        data-testid={`button-delete-${booking.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Booking</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to permanently delete this booking? This action cannot be undone.</p>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!notesBooking} onOpenChange={(o) => !o && setNotesBooking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Notes for {notesBooking?.name}</DialogTitle></DialogHeader>
          <Textarea placeholder="Add admin notes about this booking..." value={notesValue} onChange={(e) => setNotesValue(e.target.value)} rows={4} data-testid="textarea-notes" />
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setNotesBooking(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (notesBooking) {
                  updateMutation.mutate({ id: notesBooking.id, data: { notes: notesValue } }, { onSuccess: () => setNotesBooking(null) });
                }
              }}
              disabled={updateMutation.isPending}
              data-testid="button-save-notes"
            >
              {updateMutation.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
