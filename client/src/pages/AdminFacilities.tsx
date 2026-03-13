import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Pencil, Trash2,
  Wifi, Car, Utensils, Droplets, Shield, Video, Wind, Zap, Sparkles, WashingMachine,
  Building2,
} from "lucide-react";
import type { PgFacility } from "@shared/schema";

const ICON_MAP: Record<string, React.ReactNode> = {
  Wifi: <Wifi className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  WashingMachine: <WashingMachine className="w-5 h-5" />,
};

const ICON_OPTIONS = ["Wifi", "Car", "Utensils", "Droplets", "Shield", "Video", "Wind", "Zap", "Sparkles", "WashingMachine"];

const EMPTY_FORM = { name: "", description: "", icon: "Shield", isAvailable: true };

export default function AdminFacilities() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editFacility, setEditFacility] = useState<PgFacility | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: facilities, isLoading } = useQuery<PgFacility[]>({
    queryKey: ["/api/admin/facilities"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const saveMutation = useMutation({
    mutationFn: (data: typeof EMPTY_FORM) => {
      if (editFacility) return apiRequest("PATCH", `/api/admin/facilities/${editFacility.id}`, data);
      return apiRequest("POST", "/api/admin/facilities", data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/facilities"] }); setDialogOpen(false); setEditFacility(null); toast({ title: editFacility ? "Facility updated" : "Facility added" }); },
    onError: () => toast({ title: "Error", description: "Failed to save facility", variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      apiRequest("PATCH", `/api/admin/facilities/${id}`, { isAvailable }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/facilities"] }),
    onError: () => toast({ title: "Error", description: "Failed to update", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/facilities/${id}`, undefined),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/facilities"] }); setDeleteId(null); toast({ title: "Facility removed" }); },
    onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" }),
  });

  const openAdd = () => { setEditFacility(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (f: PgFacility) => { setEditFacility(f); setForm({ name: f.name, description: f.description ?? "", icon: f.icon ?? "Shield", isAvailable: f.isAvailable }); setDialogOpen(true); };

  const available = facilities?.filter((f) => f.isAvailable).length ?? 0;
  const unavailable = (facilities?.length ?? 0) - available;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">PG Facilities</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">Manage amenities and facilities offered at the PG</p>
        </div>
        <Button onClick={openAdd} data-testid="button-add-facility">
          <Plus className="w-4 h-4 mr-2" /> Add Facility
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Facilities", value: facilities?.length ?? 0, color: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Available", value: available, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Unavailable", value: unavailable, color: "bg-red-50 text-red-700 border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-muted/60 animate-pulse" />)}
        </div>
      ) : !facilities?.length ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No facilities yet — loading defaults...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => (
            <Card key={facility.id} className={`transition-all ${!facility.isAvailable ? "opacity-60" : ""}`} data-testid={`facility-card-${facility.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${facility.isAvailable ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {ICON_MAP[facility.icon ?? ""] ?? <Shield className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight">{facility.name}</p>
                      {facility.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{facility.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={facility.isAvailable}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: facility.id, isAvailable: checked })}
                      data-testid={`toggle-facility-${facility.id}`}
                    />
                    <span className="text-xs text-muted-foreground">{facility.isAvailable ? "Available" : "Unavailable"}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(facility)} data-testid={`button-edit-facility-${facility.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(facility.id)} data-testid={`button-delete-facility-${facility.id}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setEditFacility(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editFacility ? "Edit Facility" : "Add New Facility"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Facility Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. WiFi, Parking, CCTV" data-testid="input-facility-name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this facility..." rows={2} data-testid="textarea-facility-description" />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-colors ${form.icon === icon ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}
                    title={icon}
                    data-testid={`icon-option-${icon}`}
                  >
                    {ICON_MAP[icon]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isAvailable} onCheckedChange={(v) => setForm({ ...form, isAvailable: v })} data-testid="switch-facility-available" />
              <Label className="cursor-pointer">{form.isAvailable ? "Currently available" : "Not available"}</Label>
            </div>
          </div>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => { setDialogOpen(false); setEditFacility(null); }}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.name} data-testid="button-save-facility">
              {saveMutation.isPending ? "Saving..." : editFacility ? "Save Changes" : "Add Facility"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Facility</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to remove this facility?</p>
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-facility">
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
