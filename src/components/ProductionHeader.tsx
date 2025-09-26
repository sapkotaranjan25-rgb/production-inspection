import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, QrCode } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TargetSpecifications } from "@/types/production";

interface ProductionHeaderProps {
  productionSite: string;
  date: Date;
  shift: string;
  operatorName: string;
  productionLine: string;
  workOrderNumber: string;
  resinCode: string;
  colorCode: string;
  targetSpecs: TargetSpecifications;
  onProductionSiteChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onShiftChange: (value: string) => void;
  onOperatorNameChange: (value: string) => void;
  onProductionLineChange: (value: string) => void;
  onWorkOrderNumberChange: (value: string) => void;
  onResinCodeChange: (value: string) => void;
  onColorCodeChange: (value: string) => void;
  onQRScanClick: () => void;
}

export function ProductionHeader({
  productionSite,
  date,
  shift,
  operatorName,
  productionLine,
  workOrderNumber,
  resinCode,
  colorCode,
  targetSpecs,
  onProductionSiteChange,
  onDateChange,
  onShiftChange,
  onOperatorNameChange,
  onProductionLineChange,
  onWorkOrderNumberChange,
  onResinCodeChange,
  onColorCodeChange,
  onQRScanClick,
}: ProductionHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Production Information */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-lg">Production Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="production-site">Production Site *</Label>
              <Input
                id="production-site"
                value={productionSite}
                onChange={(e) => onProductionSiteChange(e.target.value)}
                placeholder="Enter production site"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Shift *</Label>
              <Input
                id="shift"
                value={shift}
                onChange={(e) => onShiftChange(e.target.value)}
                placeholder="e.g., Day, Night, A, B"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator-name">Operator Name *</Label>
              <Input
                id="operator-name"
                value={operatorName}
                onChange={(e) => onOperatorNameChange(e.target.value)}
                placeholder="Enter operator name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="production-line">Production Line *</Label>
              <Input
                id="production-line"
                value={productionLine}
                onChange={(e) => onProductionLineChange(e.target.value)}
                placeholder="Enter production line"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-order">Work Order Number</Label>
              <Input
                id="work-order"
                value={workOrderNumber}
                onChange={(e) => onWorkOrderNumberChange(e.target.value)}
                placeholder="Enter work order #"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resin-code">Resin Code</Label>
              <Input
                id="resin-code"
                value={resinCode}
                onChange={(e) => onResinCodeChange(e.target.value)}
                placeholder="Enter resin code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-code">Color Code</Label>
              <Input
                id="color-code"
                value={colorCode}
                onChange={(e) => onColorCodeChange(e.target.value)}
                placeholder="Enter color code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Specifications */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Target Specifications</CardTitle>
            <Button onClick={onQRScanClick} variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-foreground">OD Avg</div>
              <div className="text-primary">{targetSpecs.odAverage || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">OD Max</div>
              <div className="text-primary">{targetSpecs.odMax || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">OD Min</div>
              <div className="text-primary">{targetSpecs.odMin || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Cal Max</div>
              <div className="text-primary">{targetSpecs.caliperMaximum || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Cal Min</div>
              <div className="text-primary">{targetSpecs.caliperMinimum || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Out Round</div>
              <div className="text-primary">{targetSpecs.outOfRound || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Ovality</div>
              <div className="text-primary">{targetSpecs.ovality || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Toe-in</div>
              <div className="text-primary">{targetSpecs.toeIn || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Wall Min</div>
              <div className="text-primary">{targetSpecs.wallMin || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Wall Max</div>
              <div className="text-primary">{targetSpecs.wallMax || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Target Min</div>
              <div className="text-primary">{targetSpecs.targetMin || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Target Max</div>
              <div className="text-primary">{targetSpecs.targetMax || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Eccentric</div>
              <div className="text-primary">{targetSpecs.eccentricity || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Goal PPH</div>
              <div className="text-primary">{targetSpecs.goalPPH || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Theo Wt/Ft</div>
              <div className="text-primary">{targetSpecs.theoWtPerFt || '-'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Target Gain</div>
              <div className="text-primary">{targetSpecs.targetGain || '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}