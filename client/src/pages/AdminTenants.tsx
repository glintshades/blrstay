import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, Search, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import type { Tenant, Room } from "@shared/schema";

const EMPTY_FORM = { name: "", phone: "", email: "", roomId: "", moveInDate: "", idProofType: "", notes: "", status: "active" };

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminTenants() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);

  const { data: tenants, isLoading } = useQuery<Tenant[]>({
    queryKey: ["/api/admin/tenants"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["/api/admin/rooms"],
    staleTime: 0,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, String(v)); });
      if (idProofFile) fd.append("idProof", idProofFile);
      const url = editTenant ? `/api/admin/tenants/${editTenant.id}` : "/api/admin/tenants";
      const method = editTenant ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tenants"] });
      setDialogOpen(false);
      setEditTenant(null);
      setIdProofFile(null);
      toast({ title: editTenant ? "Tenant updated" : "Tenant added" });
    },
    onError: () => toast({ title: "Error", description: "Failed to save tenant", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/tenants/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/tenants"] }); setDeleteId(null); toast({ title: "Tenant removed" }); },
    onError: () => toast({ title: "Error", description: "Failed to delete tenant", variant: "destructive" }),
  });

  const openAdd = () => {
    setEditTenant(null);
    setForm(EMPTY_FORM);
    setIdProofFile(null);
    setDialogOpen(true);
  };

  const openEdit = (t: Tenant) => {
    setEditTenant(t);
    setForm({
      name: t.name, phone: t.phone, email: t.email,
      roomId: t.roomId ?? "",
      moveInDate: t.moveInDate ? format(new Date(t.moveInDate), "yyyy-MM-dd") : "",
      idProofType: t.idProofType ?? "",
      notes: t.notes ?? "",
      status: t.status,
    });
    setIdProofFile(null);
    setDialogOpen(true);
  };

  const filtered = tenants?.filter((t) => {
    const q = search.toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.phone.includes(q) || t.email.toLowerCase().includes(q);
  }) ?? [];

  const active = tenants?.filter((t) => t.status === "active").length ?? 0;
  const inactive = (tenants?.length ?? 0) - active;

  const getRoomLabel = (roomId: string | null | undefined) => {
    if (!roomId) return "—";
    const room = rooms?.find((r) => r.id === roomId);
    return room ? `${room.roomNumber} (${room.type === "Single Occupancy" ? "Single" : "Double"})` : "—";
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Tenant Management</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{tenants?.length ?? 0} tenants total</p>
        </div>
        <Button onClick={openAdd} data-testid="button-add-tenant">
          <Plus className="w-4 h-4 mr-2" /> Add Tenant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Tenants", value: tenants?.length ?? 0, color: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Active", value: active, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Inactive", value: inactive, color: "bg-gray-50 text-gray-600 border-gray-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, phone or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="input-search-tenants" />
      </div>

      {isLoading ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">Loading tenants...</CardContent></Card>
      ) : !filtered.length ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{tenants?.length ? "No tenants match your search" : "No tenants added yet"}</p>
            {!tenants?.length && <Button onClick={openAdd}>Add First Tenant</Button>}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Room</th>
                <th className="px-4 py-3 font-semibold">Move-in Date</th>
                <th className="px-4 py-3 font-semibold">ID Proof</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tenant, i) => (
                <tr key={tenant.id} className={`border-t ${i % 2 === 0 ? "" : "bg-muted/20"} hover:bg-muted/40 transition-colors`} data-testid={`tenant-row-${tenant.id}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{tenant.name}</p>
                    {tenant.notes && <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate">{tenant.notes}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-muted-foreground">{tenant.email}</p>
                    <p className="text-muted-foreground">{tenant.phone}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{getRoomLabel(tenant.roomId)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {tenant.moveInDate ? format(new Date(tenant.moveInDate), "dd MMM yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {tenant.idProofUrl ? (
                      <a href={tenant.idProofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-xs hover:underline">
                        <FileText className="w-3.5 h-3.5" />
                        {tenant.idProofType || "View"}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={tenant.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(tenant)} data-testid={`button-edit-tenant-${tenant.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(tenant.id)} data-testid={`button-delete-tenant-${tenant.id}`}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setEditTenant(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTenant ? "Edit Tenant" : "Add New Tenant"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tenant full name" data-testid="input-tenant-name" />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" data-testid="input-tenant-phone" />
            </div>
            <div>
              <Label>Email Address *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tenant@email.com" data-testid="input-tenant-email" />
            </div>
            <div>
              <Label>Assigned Room</Label>
              <Select value={form.roomId || "none"} onValueChange={(v) => setForm({ ...form, roomId: v === "none" ? "" : v })}>
                <SelectTrigger data-testid="select-tenant-room">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No room assigned</SelectItem>
                  {rooms?.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.roomNumber} — {r.type === "Single Occupancy" ? "Single" : "Double"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Move-in Date</Label>
              <Input type="date" value={form.moveInDate} onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} data-testid="input-tenant-movein" />
            </div>
            <div>
              <Label>ID Proof Type</Label>
              <Select value={form.idProofType || "none"} onValueChange={(v) => setForm({ ...form, idProofType: v === "none" ? "" : v })}>
                <SelectTrigger data-testid="select-idproof-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select type</SelectItem>
                  <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="PAN">PAN Card</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="Driving License">Driving License</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger data-testid="select-tenant-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Upload ID Proof (image/PDF preview)</Label>
              <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => setIdProofFile(e.target.files?.[0] ?? null)} data-testid="input-idproof-upload" />
              {editTenant?.idProofUrl && !idProofFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Current: <a href={editTenant.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">View uploaded proof</a>
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." rows={2} data-testid="textarea-tenant-notes" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => { setDialogOpen(false); setEditTenant(null); }}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.phone || !form.email} data-testid="button-save-tenant">
              {saveMutation.isPending ? "Saving..." : editTenant ? "Save Changes" : "Add Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Tenant</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to remove this tenant? This action cannot be undone.</p>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-tenant">
              {deleteMutation.isPending ? "Removing..." : "Remove Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
