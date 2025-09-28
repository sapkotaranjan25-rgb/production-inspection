import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, QrCode, Edit3, Unlock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TargetSpecifications } from "@/types/production";
import { ManualEntry } from "./ManualEntry";

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
  onTargetSpecsChange: (targetSpecs: TargetSpecifications) => void;
  isProductionInfoComplete: boolean;
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
  onTargetSpecsChange,
  isProductionInfoComplete,
}: ProductionHeaderProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isProductionInfoLocked, setIsProductionInfoLocked] = useState(false);

  // Check if ALL 8 production info fields are completed
  const allProductionInfoComplete = !!(productionSite && date && shift && operatorName && productionLine && workOrderNumber && resinCode && colorCode);
  
  // Check if any target spec has been filled
  const hasTargetSpecData = Object.values(targetSpecs).some(val => val !== '' && val !== 0);

  // Auto-lock production info when user starts adding target specs
  if (allProductionInfoComplete && hasTargetSpecData && !isProductionInfoLocked) {
    setIsProductionInfoLocked(true);
  }

  const PRODUCTION_SITES = ['Albuquerque', 'Dallas', 'Springfield', 'Lovelady', 'Allendale', 'Woodburn'];
  const SHIFTS = ['A', 'B', 'C', 'D'];
  const PRODUCTION_LINES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
  return (
    <div className="space-y-4">
      {/* Production Information */}
      <Card className={`shadow-[var(--shadow-soft)] ${isProductionInfoLocked ? 'opacity-75' : ''}`}>
        <CardHeader className="relative">
          <CardTitle className="text-lg">Production Information</CardTitle>
          {isProductionInfoLocked && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => setIsProductionInfoLocked(false)}
            >
              <Unlock className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="production-site">Production Site *</Label>
              <Select value={productionSite} onValueChange={onProductionSiteChange} disabled={isProductionInfoLocked}>
                <SelectTrigger id="production-site">
                  <SelectValue placeholder="Select production site" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTION_SITES.map(site => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    disabled={isProductionInfoLocked}
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
              <Select value={shift} onValueChange={onShiftChange} disabled={isProductionInfoLocked}>
                <SelectTrigger id="shift">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {SHIFTS.map(shiftOption => (
                    <SelectItem key={shiftOption} value={shiftOption}>{shiftOption}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator-name">Operator Name *</Label>
              <Input
                id="operator-name"
                value={operatorName}
                onChange={(e) => onOperatorNameChange(e.target.value)}
                placeholder="Enter operator name"
                disabled={isProductionInfoLocked}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="production-line">Production Line *</Label>
              <Select value={productionLine} onValueChange={onProductionLineChange} disabled={isProductionInfoLocked}>
                <SelectTrigger id="production-line">
                  <SelectValue placeholder="Select line" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTION_LINES.map(line => (
                    <SelectItem key={line} value={line}>{line}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-order">Work Order Number</Label>
              <Input
                id="work-order"
                value={workOrderNumber}
                onChange={(e) => onWorkOrderNumberChange(e.target.value)}
                placeholder="Enter work order #"
                disabled={isProductionInfoLocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resin-code">Resin Code</Label>
              <Input
                id="resin-code"
                value={resinCode}
                onChange={(e) => onResinCodeChange(e.target.value)}
                placeholder="Enter resin code"
                disabled={isProductionInfoLocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-code">Color Code</Label>
              <Input
                id="color-code"
                value={colorCode}
                onChange={(e) => onColorCodeChange(e.target.value)}
                placeholder="Enter color code"
                disabled={isProductionInfoLocked}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Specifications */}
      <Card className={`shadow-[var(--shadow-soft)] ${!allProductionInfoComplete ? 'opacity-50' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Target Specifications</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowManualEntry(true)} 
              variant="outline" 
              size="sm"
              disabled={!allProductionInfoComplete}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
            <Button 
              onClick={onQRScanClick} 
              variant="outline" 
              size="sm"
              disabled={!allProductionInfoComplete}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-foreground">OD Avg</div>
              <div className="text-primary">{targetSpecs.odAverage || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">OD Max</div>
              <div className="text-primary">{targetSpecs.odMax || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">OD Min</div>
              <div className="text-primary">{targetSpecs.odMin || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Cal Max</div>
              <div className="text-primary">{targetSpecs.caliperMaximum || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Cal Min</div>
              <div className="text-primary">{targetSpecs.caliperMinimum || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Out Round</div>
              <div className="text-primary">{targetSpecs.outOfRound || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Ovality</div>
              <div className="text-primary">{targetSpecs.ovality || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Toe-in</div>
              <div className="text-primary">{targetSpecs.toeIn || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Wall Min</div>
              <div className="text-primary">{targetSpecs.wallMin || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Wall Max</div>
              <div className="text-primary">{targetSpecs.wallMax || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Target Min</div>
              <div className="text-primary">{targetSpecs.targetMin || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Target Max</div>
              <div className="text-primary">{targetSpecs.targetMax || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Eccentric</div>
              <div className="text-primary">{targetSpecs.eccentricity || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Goal PPH</div>
              <div className="text-primary">{targetSpecs.goalPPH || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Theo Wt/Ft</div>
              <div className="text-primary">{targetSpecs.theoWtPerFt || ''}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Target Gain</div>
              <div className="text-primary">{targetSpecs.targetGain || ''}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Dialog */}
      <ManualEntry
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSave={onTargetSpecsChange}
        currentSpecs={targetSpecs}
      />
    </div>
  );
}