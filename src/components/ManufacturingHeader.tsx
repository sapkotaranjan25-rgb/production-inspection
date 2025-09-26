import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ManufacturingHeaderProps {
  date: Date | undefined;
  shift: string;
  operator: string;
  productLine: string;
  materialType: string;
  targetOD: number | '';
  targetWall: number | '';
  targetWeight: number | '';
  onDateChange: (date: Date | undefined) => void;
  onShiftChange: (value: string) => void;
  onOperatorChange: (value: string) => void;
  onProductLineChange: (value: string) => void;
  onMaterialTypeChange: (value: string) => void;
  onTargetODChange: (value: string) => void;
  onTargetWallChange: (value: string) => void;
  onTargetWeightChange: (value: string) => void;
}

export function ManufacturingHeader({
  date,
  shift,
  operator,
  productLine,
  materialType,
  targetOD,
  targetWall,
  targetWeight,
  onDateChange,
  onShiftChange,
  onOperatorChange,
  onProductLineChange,
  onMaterialTypeChange,
  onTargetODChange,
  onTargetWallChange,
  onTargetWeightChange,
}: ManufacturingHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-[var(--shadow-form)]">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Production Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Production Date</Label>
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
                  <SelectItem value="day">Day Shift</SelectItem>
                  <SelectItem value="evening">Evening Shift</SelectItem>
                  <SelectItem value="night">Night Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator" className="text-sm font-medium">
                Operator
              </Label>
              <Input
                id="operator"
                value={operator}
                onChange={(e) => onOperatorChange(e.target.value)}
                placeholder="Operator name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productLine" className="text-sm font-medium">
                Product Line
              </Label>
              <Input
                id="productLine"
                value={productLine}
                onChange={(e) => onProductLineChange(e.target.value)}
                placeholder="Product line"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialType" className="text-sm font-medium">
                Material Type
              </Label>
              <Input
                id="materialType"
                value={materialType}
                onChange={(e) => onMaterialTypeChange(e.target.value)}
                placeholder="Material type"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Specifications */}
      <Card className="shadow-[var(--shadow-form)]">
        <CardHeader className="bg-table-header">
          <CardTitle className="text-lg">Target Specifications</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="targetOD" className="text-sm font-medium">
                Target OD (inches)
              </Label>
              <Input
                id="targetOD"
                type="number"
                step="0.001"
                value={targetOD}
                onChange={(e) => onTargetODChange(e.target.value)}
                placeholder="0.000"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWall" className="text-sm font-medium">
                Target Wall (inches)
              </Label>
              <Input
                id="targetWall"
                type="number"
                step="0.001"
                value={targetWall}
                onChange={(e) => onTargetWallChange(e.target.value)}
                placeholder="0.000"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="text-sm font-medium">
                Target Weight (lbs/ft)
              </Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.001"
                value={targetWeight}
                onChange={(e) => onTargetWeightChange(e.target.value)}
                placeholder="0.000"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}