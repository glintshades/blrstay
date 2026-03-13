import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, BedDouble, CheckCircle, XCircle, Home, Image } from "lucide-react";
import type { Room } from "@shared/schema";

const EMPTY_FORM = { roomNumber: "", type: "Single Occupancy", beds: 1, price: 8000, status: "available", floor: "", description: "" };

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
      {status === "available" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {status === "available" ? "Available" : "Occupied"}
    </span>
  );
}

export default function AdminRooms() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [photoRoomId, setPhotoRoomId] = useState<string | null>(null);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ["/api/admin/rooms"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof EMPTY_FORM) => apiRequest("POST", "/api/admin/rooms", { ...data, beds: Number(data.beds), price: Number(data.price) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] }); setDialogOpen(false); toast({ title: "Room added" }); },
    onError: () => toast({ title: "Error", description: "Failed to add room", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof EMPTY_FORM }) => apiRequest("PATCH", `/api/admin/rooms/${id}`, { ...data, beds: Number(data.beds), price: Number(data.price) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] }); setDialogOpen(false); setEditRoom(null); toast({ title: "Room updated" }); },
    onError: () => toast({ title: "Error", description: "Failed to update room", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/rooms/${id}`, undefined),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] }); setDeleteId(null); toast({ title: "Room deleted" }); },
    onError: () => toast({ title: "Error", description: "Failed to delete room", variant: "destructive" }),
  });

  const photoMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch(`/api/admin/rooms/${id}/photos`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] }); setPhotoRoomId(null); setPhotoFile(null); toast({ title: "Photo uploaded" }); },
    onError: () => toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" }),
  });

  const openAdd = () => { setEditRoom(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (room: Room) => {
    setEditRoom(room);
    setForm({ roomNumber: room.roomNumber, type: room.type, beds: room.beds, price: room.price, status: room.status, floor: room.floor ?? "", description: room.description ?? "" });
    setDialogOpen(true);
  };
  const handleSubmit = () => {
    if (!form.roomNumber.trim()) return toast({ title: "Room number is required", variant: "destructive" });
    if (editRoom) updateMutation.mutate({ id: editRoom.id, data: form });
    else createMutation.mutate(form);
  };

  const totalRooms = rooms?.length ?? 0;
  const available = rooms?.filter((r) => r.status === "available").length ?? 0;
  const occupied = rooms?.filter((r) => r.status === "occupied").length ?? 0;
  const single = rooms?.filter((r) => r.type === "Single Occupancy").length ?? 0;
  const double = rooms?.filter((r) => r.type === "Double Occupancy").length ?? 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Room Management</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{totalRooms} rooms configured</p>
        </div>
        <Button onClick={openAdd} data-testid="button-add-room">
          <Plus className="w-4 h-4 mr-2" /> Add New Room
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Rooms", value: totalRooms, color: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Available", value: available, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Occupied", value: occupied, color: "bg-red-50 text-red-700 border-red-100" },
          { label: "Single", value: single, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "Double", value: double, color: "bg-violet-50 text-violet-700 border-violet-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">Loading rooms...</CardContent></Card>
      ) : !rooms?.length ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No rooms added yet</p>
            <Button onClick={openAdd}>Add Your First Room</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold">Room No.</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Floor</th>
                <th className="px-4 py-3 font-semibold">Beds</th>
                <th className="px-4 py-3 font-semibold">Price/Month</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Photos</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, i) => (
                <tr key={room.id} className={`border-t ${i % 2 === 0 ? "" : "bg-muted/20"} hover:bg-muted/40 transition-colors`} data-testid={`room-row-${room.id}`}>
                  <td className="px-4 py-3 font-semibold">{room.roomNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{room.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{room.floor || "—"}</td>
                  <td className="px-4 py-3">{room.beds}</td>
                  <td className="px-4 py-3 font-semibold">₹{room.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <Select value={room.status} onValueChange={(val) => updateMutation.mutate({ id: room.id, data: { ...form, roomNumber: room.roomNumber, type: room.type, beds: room.beds, price: room.price, floor: room.floor ?? "", description: room.description ?? "", status: val } })}>
                      <SelectTrigger className="h-7 w-32 text-xs px-2" data-testid={`select-room-status-${room.id}`}>
                        <StatusBadge status={room.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="icon" variant="ghost" onClick={() => setPhotoRoomId(room.id)} title="Upload photo" data-testid={`button-room-photo-${room.id}`}>
                      <Image className="w-4 h-4" />
                    </Button>
                    {room.images && room.images.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">{room.images.length}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(room)} data-testid={`button-edit-room-${room.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(room.id)} data-testid={`button-delete-room-${room.id}`}>
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

      {/* Add/Edit Room Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setEditRoom(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label>Room Number *</Label>
              <Input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 101" data-testid="input-room-number" />
            </div>
            <div>
              <Label>Floor</Label>
              <Input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="e.g. Ground, 1st" data-testid="input-room-floor" />
            </div>
            <div>
              <Label>Room Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v, beds: v === "Single Occupancy" ? 1 : 2, price: v === "Single Occupancy" ? 8000 : 6000 })}>
                <SelectTrigger data-testid="select-room-type-form">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Occupancy">Single Occupancy</SelectItem>
                  <SelectItem value="Double Occupancy">Double Occupancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status *</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger data-testid="select-room-status-form">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>No. of Beds *</Label>
              <Input type="number" min={1} max={4} value={form.beds} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} data-testid="input-room-beds" />
            </div>
            <div>
              <Label>Monthly Rate (₹) *</Label>
              <Input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} data-testid="input-room-price" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional room description..." rows={2} data-testid="textarea-room-description" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => { setDialogOpen(false); setEditRoom(null); }}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-room">
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editRoom ? "Save Changes" : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog open={!!photoRoomId} onOpenChange={(o) => { if (!o) { setPhotoRoomId(null); setPhotoFile(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Room Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Select Photo (max 5MB)</Label>
              <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} data-testid="input-room-photo-upload" />
            </div>
            {photoFile && (
              <img src={URL.createObjectURL(photoFile)} alt="Preview" className="max-h-40 rounded-lg object-cover" />
            )}
            {rooms?.find((r) => r.id === photoRoomId)?.images?.length ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Existing photos</p>
                <div className="flex gap-2 flex-wrap">
                  {rooms.find((r) => r.id === photoRoomId)?.images?.map((img, i) => (
                    <img key={i} src={img} alt={`Room photo ${i + 1}`} className="h-16 w-16 object-cover rounded-lg border" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => { setPhotoRoomId(null); setPhotoFile(null); }}>Cancel</Button>
            <Button disabled={!photoFile || photoMutation.isPending} onClick={() => photoRoomId && photoFile && photoMutation.mutate({ id: photoRoomId, file: photoFile })} data-testid="button-upload-room-photo">
              <Upload className="w-4 h-4 mr-2" />
              {photoMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Room</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this room? This action cannot be undone.</p>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-room">
              {deleteMutation.isPending ? "Deleting..." : "Delete Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
