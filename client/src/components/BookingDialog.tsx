import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRoomType?: string;
}

export default function BookingDialog({ open, onOpenChange, defaultRoomType }: BookingDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomType, setRoomType] = useState(defaultRoomType ?? "");
  const [moveInDate, setMoveInDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    if (open && defaultRoomType) {
      setRoomType(defaultRoomType);
    }
  }, [open, defaultRoomType]);

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      name: string;
      email: string;
      phone: string;
      roomType: string;
      moveInDate: Date;
    }) => {
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your booking.",
      });
      
      setName("");
      setEmail("");
      setPhone("");
      setRoomType("");
      setMoveInDate(undefined);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moveInDate) {
      toast({
        title: "Missing Information",
        description: "Please select a move-in date.",
        variant: "destructive",
      });
      return;
    }
    
    createBookingMutation.mutate({
      name,
      email,
      phone,
      roomType,
      moveInDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-booking">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl" data-testid="text-dialog-title">
            Book Your Room
          </DialogTitle>
          <DialogDescription data-testid="text-dialog-description">
            Fill in your details and we'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              data-testid="input-name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              data-testid="input-email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 97405 65797"
              required
              data-testid="input-phone"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type *</Label>
            <Select value={roomType} onValueChange={setRoomType} required>
              <SelectTrigger data-testid="select-room-type">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Occupancy</SelectItem>
                <SelectItem value="double">Double Occupancy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Move-in Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-date-picker"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {moveInDate ? format(moveInDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={moveInDate}
                  onSelect={setMoveInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button
            type="submit"
            className="w-full hover-elevate active-elevate-2"
            disabled={createBookingMutation.isPending}
            data-testid="button-submit-booking"
          >
            {createBookingMutation.isPending ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
