import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductionHeader } from "./ProductionHeader";
import { ProductionTable } from "./ProductionTable";
import { QRScanner } from "./QRScanner";
import { ProductionEntry, ProductionFormData, TargetSpecifications, ProductionTotals } from "@/types/production";
import { Factory, Download, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductionFormProps {
  formData: ProductionFormData;
  onFormDataChange: (formData: ProductionFormData) => void;
}

// Generate empty entry
const generateEmptyEntry = (): ProductionEntry => ({
  start: '',
  end: '',
  odAverage: '',
  odMaximum: '',
  odMinimum: '',
  outOfRound: 0,
  ovality: 0,
  odEnd: '',
  toeIn: 0,
  wallMinimum: '',
  wallMaximum: '',
  eccentricity: 0,
  visual: '',
  print: '',
  odAtSaw: '',
  odAtVacTank: '',
  meltPress: '',
  dieHeadClean: '',
  unitStart: '',
  unitEnd: '',
  actualPPH: '',
  actualWtPerFt: '',
  gain: '',
  loss: '',
  acceptedFt: '',
  acceptedLbs: '',
  scrapFts: '',
  scrapLbs: '',
  scrapCode: '',
  regrindConsumed: '',
});

export function ProductionForm({ formData, onFormDataChange }: ProductionFormProps) {
  const { toast } = useToast();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleFieldChange = (field: keyof ProductionFormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const handleTargetSpecsChange = (targetSpecs: TargetSpecifications) => {
    onFormDataChange({
      ...formData,
      targetSpecs,
    });
  };

  const handleEntryChange = (index: number, field: keyof ProductionEntry, value: string | number) => {
    const updatedEntries = formData.entries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    );
    onFormDataChange({
      ...formData,
      entries: updatedEntries,
    });
  };

  const addEntry = () => {
    // Check if previous row has some data
    const lastEntry = formData.entries[formData.entries.length - 1];
    const hasLastEntryData = lastEntry.start || lastEntry.end || lastEntry.odAverage || 
                           lastEntry.unitStart || lastEntry.visual || lastEntry.print;
    
    if (formData.entries.length > 0 && !hasLastEntryData) {
      toast({
        title: "Cannot Add Row",
        description: "Please enter some data in the previous row before adding a new one.",
        variant: "destructive",
      });
      return;
    }

    onFormDataChange({
      ...formData,
      entries: [...formData.entries, generateEmptyEntry()],
    });
    toast({
      title: "Row Added",
      description: "New entry row has been added to the form.",
    });
  };

  const removeEntry = (index: number) => {
    if (formData.entries.length > 1) {
      const entryToRemove = formData.entries[index];
      const hasEntryData = entryToRemove.start || entryToRemove.end || entryToRemove.odAverage || 
                          entryToRemove.unitStart || entryToRemove.visual || entryToRemove.print;
      
      if (hasEntryData) {
        const confirmed = window.confirm("This row contains data. Are you sure you want to delete it?");
        if (!confirmed) return;
      }

      const updatedEntries = formData.entries.filter((_, i) => i !== index);
      onFormDataChange({
        ...formData,
        entries: updatedEntries,
      });
      toast({
        title: "Row Removed",
        description: "Entry row has been removed from the form.",
      });
    }
  };

  const handleSave = () => {
    if (!formData.date || !formData.shift || !formData.operatorName || !formData.productionLine || !formData.productionSite) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required header fields before saving.",
        variant: "destructive",
      });
      return;
    }

    console.log('Saving production form:', formData);
    
    toast({
      title: "Form Saved",
      description: "Production form has been saved successfully.",
    });
  };

  const handleReset = () => {
    const resetFormData: ProductionFormData = {
      ...formData,
      productionSite: '',
      date: new Date(),
      shift: '',
      operatorName: '',
      productionLine: '',
      workOrderNumber: '',
      resinCode: '',
      colorCode: '',
      targetSpecs: {
        odAverage: '', odMax: '', odMin: '', caliperMaximum: '', caliperMinimum: '',
        outOfRound: '', ovality: '', toeIn: '', wallMin: '', wallMax: '',
        targetMin: '', targetMax: '', eccentricity: '', goalPPH: '', theoWtPerFt: '', targetGain: ''
      },
      entries: [generateEmptyEntry()],
    };
    
    onFormDataChange(resetFormData);
    
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `production-form-${formData.productionLine}-${formData.date?.toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Form Exported",
      description: "Production form has been exported successfully.",
    });
  };

  // Calculate totals
  const totals: ProductionTotals = formData.entries.reduce((acc, entry) => ({
    acceptedLbs: acc.acceptedLbs + (typeof entry.acceptedLbs === 'number' ? entry.acceptedLbs : 0),
    acceptedFts: acc.acceptedFts + (typeof entry.acceptedFt === 'number' ? entry.acceptedFt : 0),
    scrapLbs: acc.scrapLbs + (typeof entry.scrapLbs === 'number' ? entry.scrapLbs : 0),
    scrapFts: acc.scrapFts + (typeof entry.scrapFts === 'number' ? entry.scrapFts : 0),
  }), { acceptedLbs: 0, acceptedFts: 0, scrapLbs: 0, scrapFts: 0 });

  const completedEntries = formData.entries.filter(entry => 
    entry.start !== '' || entry.odAverage !== '' || entry.unitStart !== ''
  ).length;

  // Calculate average actual weight per foot
  const validActualWtPerFt = formData.entries
    .map(entry => parseFloat(entry.actualWtPerFt?.toString() || '0'))
    .filter(value => !isNaN(value) && value > 0);
  
  const avgActualWtPerFt = validActualWtPerFt.length > 0 
    ? validActualWtPerFt.reduce((sum, value) => sum + value, 0) / validActualWtPerFt.length 
    : 0;

  // Calculate Gain/Loss
  const theoWtPerFt = parseFloat(formData.targetSpecs.theoWtPerFt?.toString() || '0');
  let gainLossValue = 0;
  let gainLossLabel = '';
  
  if (theoWtPerFt > 0 && avgActualWtPerFt > 0) {
    gainLossValue = ((avgActualWtPerFt - theoWtPerFt) / theoWtPerFt) * 100;
    gainLossLabel = gainLossValue < 0 ? 'Gain' : 'Loss';
  }

  // Calculate Total Units
  const totalUnits = formData.entries.reduce((sum, entry) => {
    const unitStart = parseFloat(entry.unitStart?.toString() || '0');
    const unitEnd = parseFloat(entry.unitEnd?.toString() || '0');
    return sum + Math.abs(unitEnd - unitStart);
  }, 0);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-full mx-auto">

        {/* Form Header */}
        <ProductionHeader
          productionSite={formData.productionSite}
          date={formData.date}
          shift={formData.shift}
          operatorName={formData.operatorName}
          productionLine={formData.productionLine}
          workOrderNumber={formData.workOrderNumber}
          resinCode={formData.resinCode}
          colorCode={formData.colorCode}
          targetSpecs={formData.targetSpecs}
          onProductionSiteChange={(value) => handleFieldChange('productionSite', value)}
          onDateChange={(date) => handleFieldChange('date', date || new Date())}
          onShiftChange={(value) => handleFieldChange('shift', value)}
          onOperatorNameChange={(value) => handleFieldChange('operatorName', value)}
          onProductionLineChange={(value) => handleFieldChange('productionLine', value)}
          onWorkOrderNumberChange={(value) => handleFieldChange('workOrderNumber', value)}
          onResinCodeChange={(value) => handleFieldChange('resinCode', value)}
          onColorCodeChange={(value) => handleFieldChange('colorCode', value)}
          onQRScanClick={() => setShowQRScanner(true)}
          onTargetSpecsChange={handleTargetSpecsChange}
          isProductionInfoComplete={!!(formData.productionSite && formData.date && formData.shift && formData.operatorName && formData.productionLine && formData.workOrderNumber && formData.resinCode && formData.colorCode)}
        />

        {/* Statistics Summary */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{completedEntries}</div>
                <div className="text-sm text-muted-foreground">Entries</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">{totals.acceptedLbs.toFixed(1)} lbs</div>
                <div className="text-sm text-muted-foreground">Accepted Lbs</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">{totals.acceptedFts}</div>
                <div className="text-sm text-muted-foreground">Accepted Fts</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-warning">{totals.scrapLbs.toFixed(1)} lbs</div>
                <div className="text-sm text-muted-foreground">Scrap Lbs</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-warning">{totals.scrapFts}</div>
                <div className="text-sm text-muted-foreground">Scrap Fts</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-destructive">
                  {theoWtPerFt > 0 && avgActualWtPerFt > 0 ? `${Math.abs(gainLossValue).toFixed(2)}%` : '0%'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {gainLossLabel || 'Gain/Loss'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{totalUnits.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Total Units</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Table */}
        <ProductionTable entries={formData.entries} targetSpecs={formData.targetSpecs} onEntryChange={handleEntryChange} />

        {/* Entry Management and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Entry Management */}
          <Card className="shadow-[var(--shadow-soft)] flex-1">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Button 
                  onClick={addEntry} 
                  variant="outline"
                  disabled={formData.entries.length > 0 && !formData.entries[formData.entries.length - 1].start && !formData.entries[formData.entries.length - 1].odAverage && !formData.entries[formData.entries.length - 1].unitStart}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
                <Button 
                  onClick={() => removeEntry(formData.entries.length - 1)} 
                  variant="outline" 
                  disabled={formData.entries.length <= 1}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Row
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-[var(--shadow-soft)] w-full sm:w-auto">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                  <Save className="mr-2 h-4 w-4" />
                  Submit
                </Button>
                <Button onClick={handleExport} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleTargetSpecsChange}
      />
    </div>
  );
}