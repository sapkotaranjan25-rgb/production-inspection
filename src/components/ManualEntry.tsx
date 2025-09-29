import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3 } from "lucide-react";
import { TargetSpecifications } from "@/types/production";

interface ManualEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (targetSpecs: TargetSpecifications) => void;
  currentSpecs?: TargetSpecifications;
}

export function ManualEntry({ isOpen, onClose, onSave, currentSpecs }: ManualEntryProps) {
  const [specs, setSpecs] = useState<TargetSpecifications>({
    odAverage: currentSpecs?.odAverage || '',
    odMax: currentSpecs?.odMax || '',
    odMin: currentSpecs?.odMin || '',
    caliperMaximum: currentSpecs?.caliperMaximum || '',
    caliperMinimum: currentSpecs?.caliperMinimum || '',
    outOfRound: currentSpecs?.outOfRound || '',
    ovality: currentSpecs?.ovality || '',
    toeIn: currentSpecs?.toeIn || '',
    wallMin: currentSpecs?.wallMin || '',
    wallMax: currentSpecs?.wallMax || '',
    targetMin: currentSpecs?.targetMin || '',
    targetMax: currentSpecs?.targetMax || '',
    eccentricity: currentSpecs?.eccentricity || '',
    goalPPH: currentSpecs?.goalPPH || '',
    theoWtPerFt: currentSpecs?.theoWtPerFt || '',
    targetGain: currentSpecs?.targetGain || '',
  });

  const handleInputChange = (field: keyof TargetSpecifications, value: string) => {
    // Allow empty string, dash, numbers, and decimal points
    if (value === '' || value === '-') {
      setSpecs(prev => ({ ...prev, [field]: value }));
      return;
    }
    
    // Allow numbers and decimal points, including partial decimals like "1."
    if (/^\d*\.?\d*$/.test(value)) {
      setSpecs(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    onSave(specs);
    onClose();
  };

  const handleClose = () => {
    // Reset to current specs when closing without saving
    setSpecs({
      odAverage: currentSpecs?.odAverage || '',
      odMax: currentSpecs?.odMax || '',
      odMin: currentSpecs?.odMin || '',
      caliperMaximum: currentSpecs?.caliperMaximum || '',
      caliperMinimum: currentSpecs?.caliperMinimum || '',
      outOfRound: currentSpecs?.outOfRound || '',
      ovality: currentSpecs?.ovality || '',
      toeIn: currentSpecs?.toeIn || '',
      wallMin: currentSpecs?.wallMin || '',
      wallMax: currentSpecs?.wallMax || '',
      targetMin: currentSpecs?.targetMin || '',
      targetMax: currentSpecs?.targetMax || '',
      eccentricity: currentSpecs?.eccentricity || '',
      goalPPH: currentSpecs?.goalPPH || '',
      theoWtPerFt: currentSpecs?.theoWtPerFt || '',
      targetGain: currentSpecs?.targetGain || '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Manual Target Specifications Entry
          </DialogTitle>
          <DialogDescription>
            Enter target specification values manually. Leave fields empty or use "-" for values that don't apply.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="odAverage">OD Average</Label>
            <Input
              id="odAverage"
              type="text"
              value={specs.odAverage}
              onChange={(e) => handleInputChange('odAverage', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="odMax">OD Max</Label>
            <Input
              id="odMax"
              type="text"
              value={specs.odMax}
              onChange={(e) => handleInputChange('odMax', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="odMin">OD Min</Label>
            <Input
              id="odMin"
              type="text"
              value={specs.odMin}
              onChange={(e) => handleInputChange('odMin', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caliperMaximum">Caliper Maximum</Label>
            <Input
              id="caliperMaximum"
              type="text"
              value={specs.caliperMaximum}
              onChange={(e) => handleInputChange('caliperMaximum', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caliperMinimum">Caliper Minimum</Label>
            <Input
              id="caliperMinimum"
              type="text"
              value={specs.caliperMinimum}
              onChange={(e) => handleInputChange('caliperMinimum', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="outOfRound">Out of Round</Label>
            <Input
              id="outOfRound"
              type="text"
              value={specs.outOfRound}
              onChange={(e) => handleInputChange('outOfRound', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ovality">Ovality</Label>
            <Input
              id="ovality"
              type="text"
              value={specs.ovality}
              onChange={(e) => handleInputChange('ovality', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="toeIn">Toe-in</Label>
            <Input
              id="toeIn"
              type="text"
              value={specs.toeIn}
              onChange={(e) => handleInputChange('toeIn', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallMin">Wall Min</Label>
            <Input
              id="wallMin"
              type="text"
              value={specs.wallMin}
              onChange={(e) => handleInputChange('wallMin', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallMax">Wall Max</Label>
            <Input
              id="wallMax"
              type="text"
              value={specs.wallMax}
              onChange={(e) => handleInputChange('wallMax', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetMin">Target Min</Label>
            <Input
              id="targetMin"
              type="text"
              value={specs.targetMin}
              onChange={(e) => handleInputChange('targetMin', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetMax">Target Max</Label>
            <Input
              id="targetMax"
              type="text"
              value={specs.targetMax}
              onChange={(e) => handleInputChange('targetMax', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eccentricity">Eccentricity</Label>
            <Input
              id="eccentricity"
              type="text"
              value={specs.eccentricity}
              onChange={(e) => handleInputChange('eccentricity', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goalPPH">Goal PPH</Label>
            <Input
              id="goalPPH"
              type="text"
              value={specs.goalPPH}
              onChange={(e) => handleInputChange('goalPPH', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theoWtPerFt">Theo Wt/Ft</Label>
            <Input
              id="theoWtPerFt"
              type="text"
              value={specs.theoWtPerFt}
              onChange={(e) => handleInputChange('theoWtPerFt', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetGain">Target Gain</Label>
            <Input
              id="targetGain"
              type="text"
              value={specs.targetGain}
              onChange={(e) => handleInputChange('targetGain', e.target.value)}
              placeholder="Enter value or -"
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Specifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}