import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { RoomPhoto } from "@shared/schema";

export default function AdminPhotos() {
  const { toast } = useToast();
  const [roomType, setRoomType] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: photos, isLoading } = useQuery<RoomPhoto[]>({
    queryKey: ["/api/photos"],
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !roomType) {
        throw new Error("Please select a room type and file");
      }

      const formData = new FormData();
      formData.append("photo", file);
      formData.append("roomType", roomType);
      if (caption) {
        formData.append("caption", caption);
      }

      const response = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Photo uploaded",
        description: "Room photo has been uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setFile(null);
      setPreviewUrl("");
      setCaption("");
      setRoomType("");
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Photo deleted",
        description: "Room photo has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-heading font-bold mb-6">Room Photos</h2>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upload New Photo</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType} required>
                  <SelectTrigger data-testid="select-room-type">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Occupancy">Single Occupancy</SelectItem>
                    <SelectItem value="Double Occupancy">Double Occupancy</SelectItem>
                    <SelectItem value="Common Area">Common Area</SelectItem>
                    <SelectItem value="Parking">Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Spacious room with AC"
                  data-testid="input-caption"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                required
                data-testid="input-photo"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-sm rounded-lg border"
                    data-testid="img-preview"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={uploadMutation.isPending || !file || !roomType}
              data-testid="button-upload"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadMutation.isPending ? "Uploading..." : "Upload Photo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">All Photos ({photos?.length || 0})</h3>

        {isLoading && <p className="text-muted-foreground">Loading photos...</p>}

        {!isLoading && (!photos || photos.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
            </CardContent>
          </Card>
        )}

        {photos && photos.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} data-testid={`photo-card-${photo.id}`}>
                <CardContent className="p-4">
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || photo.roomType}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    data-testid="img-room-photo"
                  />
                  <div className="space-y-2">
                    <p className="font-semibold text-sm" data-testid="text-room-type">
                      {photo.roomType}
                    </p>
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground" data-testid="text-caption">
                        {photo.caption}
                      </p>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(photo.id)}
                      disabled={deleteMutation.isPending}
                      className="w-full"
                      data-testid={`button-delete-${photo.id}`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
