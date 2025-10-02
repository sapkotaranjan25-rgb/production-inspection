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
    const updatedEntries = formData.entries.map((entry, i) => {
      if (i === index) {
        return { ...entry, [field]: value };
      }
      // Lock previous row when user starts entering data on current row
      if (i === index - 1 && !entry.locked) {
        const hasCurrentRowData = formData.entries[index].start || 
                                   formData.entries[index].odAverage || 
                                   formData.entries[index].unitStart ||
                                   value !== '';
        if (hasCurrentRowData) {
          return { ...entry, locked: true };
        }
      }
      return entry;
    });
    onFormDataChange({
      ...formData,
      entries: updatedEntries,
    });
  };

  const addEntry = () => {
    // Check if previous row has required fields filled (excluding visual, print, dieHeadClean, gain, loss, and calculated fields)
    const lastEntry = formData.entries[formData.entries.length - 1];
    
    // List of fields that need to be filled (excluding calculated fields and optional fields)
    const requiredFields: (keyof ProductionEntry)[] = [
      'start', 'end', 'odAverage', 'odMaximum', 'odMinimum', 'odEnd',
      'wallMinimum', 'wallMaximum', 'odAtSaw', 'odAtVacTank',
      'meltPress', 'unitStart', 'unitEnd', 'actualPPH', 'actualWtPerFt',
      'acceptedFt', 'acceptedLbs', 'scrapFts', 'scrapLbs', 'scrapCode', 'regrindConsumed'
    ];
    
    const allFieldsFilled = requiredFields.every(field => {
      const value = lastEntry[field];
      return value !== '' && value !== null && value !== undefined;
    });
    
    if (formData.entries.length > 0 && !allFieldsFilled) {
      toast({
        title: "Cannot Add Row",
        description: "Please complete all required fields in the previous row before adding a new one.",
        variant: "destructive",
      });
      return;
    }

    // Lock the previous row before adding new one
    const updatedEntries = formData.entries.map(entry => ({ ...entry, locked: true }));

    // Create new entry with start time after previous end time
    const newEntry = generateEmptyEntry();
    if (lastEntry.end) {
      newEntry.start = lastEntry.end;
    }
    
    // Set unit start based on previous unit end
    if (typeof lastEntry.unitEnd === 'number' && lastEntry.unitEnd > 0) {
      newEntry.unitStart = lastEntry.unitEnd + 1;
    } else {
      newEntry.unitStart = 0;
    }

    onFormDataChange({
      ...formData,
      entries: [...updatedEntries, newEntry],
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

    // Include form ID in submission
    console.log('Saving production form with ID:', formData.id);
    console.log('Form data:', formData);
    
    toast({
      title: "Form Saved",
      description: `Form ${formData.id} has been saved successfully.`,
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

  const calculateEntryFields = (entry: ProductionEntry): ProductionEntry => {
    const calculatedEntry = { ...entry };
    
    // Calculate Out of Round
    if (typeof entry.odMaximum === 'number' && typeof entry.odMinimum === 'number') {
      calculatedEntry.outOfRound = Number((entry.odMaximum - entry.odMinimum).toFixed(3));
    }
    
    // Calculate Ovality
    if (typeof entry.odMaximum === 'number' && typeof entry.odMinimum === 'number' && 
        entry.odMaximum + entry.odMinimum !== 0) {
      calculatedEntry.ovality = Number((((entry.odMaximum - entry.odMinimum) / (entry.odMaximum + entry.odMinimum)) * 200).toFixed(3));
    }
    
    // Calculate Toe-in
    if (typeof entry.odEnd === 'number' && typeof entry.odAverage === 'number' && entry.odAverage !== 0) {
      calculatedEntry.toeIn = Number((((entry.odEnd - entry.odAverage) / entry.odAverage) * 100).toFixed(3));
    }
    
    // Calculate Eccentricity
    if (typeof entry.wallMaximum === 'number' && typeof entry.wallMinimum === 'number' && entry.wallMaximum !== 0) {
      calculatedEntry.eccentricity = Number((((entry.wallMaximum - entry.wallMinimum) / entry.wallMaximum) * 100).toFixed(3));
    }
    
    // Calculate Gain/Loss
    const actualWt = parseFloat(entry.actualWtPerFt?.toString() || '0');
    const theoWt = parseFloat(formData.targetSpecs.theoWtPerFt?.toString() || '0');
    
    if (actualWt !== 0 && theoWt !== 0) {
      const calculatedValue = ((actualWt - theoWt) / theoWt) * 100;
      const isGain = calculatedValue < 0;
      const absValue = Math.abs(calculatedValue);
      
      calculatedEntry.gain = isGain ? Number(absValue.toFixed(2)) : 0;
      calculatedEntry.loss = !isGain ? Number(absValue.toFixed(2)) : 0;
    }
    
    return calculatedEntry;
  };

  const handleExport = () => {
    // Calculate all fields for each entry before exporting
    const exportData = {
      ...formData,
      formId: formData.id, // Include form ID in export
      exportDate: new Date().toISOString(), // Add export timestamp
      entries: formData.entries.map(entry => calculateEntryFields(entry))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `production-form-${formData.id}-${formData.date?.toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Form Exported",
      description: `Form ${formData.id} has been exported successfully.`,
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

  // Calculate Total Units: Sum of (Unit End - Unit Start) + 1 from each row
  const totalUnits = formData.entries.reduce((sum, entry) => {
    const unitStart = parseFloat(entry.unitStart?.toString() || '0');
    const unitEnd = parseFloat(entry.unitEnd?.toString() || '0');
    if (unitEnd > 0 && unitStart >= 0 && unitEnd >= unitStart) {
      return sum + (unitEnd - unitStart) + 1;
    }
    return sum;
  }, 0);

  return (
    <div className="bg-background p-4 space-y-6">
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

        {/* Entry Management Buttons */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Button 
                onClick={addEntry} 
                variant="outline"
                disabled={formData.entries.length > 0 && (() => {
                  const lastEntry = formData.entries[formData.entries.length - 1];
                  const requiredFields: (keyof ProductionEntry)[] = [
                    'start', 'end', 'odAverage', 'odMaximum', 'odMinimum', 'odEnd',
                    'wallMinimum', 'wallMaximum', 'odAtSaw', 'odAtVacTank',
                    'meltPress', 'unitStart', 'unitEnd', 'actualPPH', 'actualWtPerFt',
                    'acceptedFt', 'acceptedLbs', 'scrapFts', 'scrapLbs', 'scrapCode', 'regrindConsumed'
                  ];
                  return !requiredFields.every(field => {
                    const value = lastEntry[field];
                    return value !== '' && value !== null && value !== undefined;
                  });
                })()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
              {formData.entries.length > 1 && !formData.entries[formData.entries.length - 1].locked && (
                <Button 
                  onClick={() => removeEntry(formData.entries.length - 1)} 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Row
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="flex gap-3 justify-end">
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

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleTargetSpecsChange}
      />
    </div>
  );
}