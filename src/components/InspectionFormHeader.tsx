import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InspectionFormHeaderProps {
  facility: string;
  date: Date | undefined;
  shift: string;
  inspector: string;
  onFacilityChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onShiftChange: (value: string) => void;
  onInspectorChange: (value: string) => void;
}

export function InspectionFormHeader({
  facility,
  date,
  shift,
  inspector,
  onFacilityChange,
  onDateChange,
  onShiftChange,
  onInspectorChange,
}: InspectionFormHeaderProps) {
  return (
    <Card className="shadow-[var(--shadow-form)]">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facility" className="text-sm font-medium">
              Facility/Location
            </Label>
            <Input
              id="facility"
              value={facility}
              onChange={(e) => onFacilityChange(e.target.value)}
              placeholder="Enter facility name"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Inspection Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Shift</Label>
            <Select value={shift} onValueChange={onShiftChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Shift (6AM-6PM)</SelectItem>
                <SelectItem value="night">Night Shift (6PM-6AM)</SelectItem>
                <SelectItem value="morning">Morning (6AM-2PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (2PM-10PM)</SelectItem>
                <SelectItem value="overnight">Overnight (10PM-6AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspector" className="text-sm font-medium">
              Inspector Name
            </Label>
            <Input
              id="inspector"
              value={inspector}
              onChange={(e) => onInspectorChange(e.target.value)}
              placeholder="Enter inspector name"
              className="bg-background"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}