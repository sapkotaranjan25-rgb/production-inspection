import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ManufacturingHeader } from "./ManufacturingHeader";
import { ManufacturingTable } from "./ManufacturingTable";
import { ManufacturingEntry } from "@/types/manufacturing";
import { Factory, Download, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Generate empty entry
const generateEmptyEntry = (): ManufacturingEntry => ({
  sampleStart: '',
  sampleEnd: '',
  odAverage: '',
  odMaximum: '',
  odMinimum: '',
  outOfRound: '',
  qualityPercent: '',
  oilPercent: '',
  wallThickness: '',
  targetWall: '',
  wallMaximum: '',
  wallMinimum: '',
  eccentricity: '',
  estimatedWtPerFt: '',
  unitsProduced: '',
  totalFootage: '',
  scrapLbs: '',
  scrapCode: '',
  disposition: '',
  visualInspection: '',
  printQuality: '',
  odAtSaw: '',
  odAtVacTank: '',
  meltPressure: '',
  dieHead: '',
  actualPph: '',
  lineReading: '',
  notes: '',
});

// Generate initial 10 entries
const generateInitialEntries = (): ManufacturingEntry[] => {
  return Array.from({ length: 10 }, () => generateEmptyEntry());
};

export function ManufacturingForm() {
  const { toast } = useToast();
  
  // Form state
  const [date, setDate] = useState<Date>(new Date());
  const [shift, setShift] = useState('');
  const [operator, setOperator] = useState('');
  const [productLine, setProductLine] = useState('');
  const [materialType, setMaterialType] = useState('');
  
  // Target specifications
  const [targetOD, setTargetOD] = useState<number | ''>('');
  const [targetWall, setTargetWall] = useState<number | ''>('');
  const [targetWeight, setTargetWeight] = useState<number | ''>('');
  
  // Entries
  const [entries, setEntries] = useState<ManufacturingEntry[]>(generateInitialEntries());

  const handleEntryChange = (index: number, field: keyof ManufacturingEntry, value: string | number) => {
    setEntries(prev => 
      prev.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addEntry = () => {
    setEntries(prev => [...prev, generateEmptyEntry()]);
    toast({
      title: "Row Added",
      description: "New entry row has been added to the form.",
    });
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter((_, i) => i !== index));
      toast({
        title: "Row Removed",
        description: "Entry row has been removed from the form.",
      });
    }
  };

  const handleSave = () => {
    if (!date || !shift || !operator || !productLine) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required header fields before saving.",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      date,
      shift,
      operator,
      productLine,
      materialType,
      targetSpecs: {
        targetOD: typeof targetOD === 'number' ? targetOD : 0,
        targetWall: typeof targetWall === 'number' ? targetWall : 0,
        targetWeight: typeof targetWeight === 'number' ? targetWeight : 0,
      },
      entries,
    };

    console.log('Saving manufacturing form:', formData);
    
    toast({
      title: "Form Saved",
      description: "Manufacturing inspection form has been saved successfully.",
    });
  };

  const handleReset = () => {
    setDate(new Date());
    setShift('');
    setOperator('');
    setProductLine('');
    setMaterialType('');
    setTargetOD('');
    setTargetWall('');
    setTargetWeight('');
    setEntries(generateInitialEntries());
    
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const handleExport = () => {
    const formData = {
      date,
      shift,
      operator,
      productLine,
      materialType,
      targetSpecs: { targetOD, targetWall, targetWeight },
      entries,
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `manufacturing-form-${productLine}-${date?.toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Form Exported",
      description: "Manufacturing form has been exported successfully.",
    });
  };

  // Calculate statistics
  const completedEntries = entries.filter(entry => 
    entry.sampleStart !== '' || entry.odAverage !== '' || entry.unitsProduced !== ''
  ).length;

  const totalUnits = entries.reduce((sum, entry) => 
    sum + (typeof entry.unitsProduced === 'number' ? entry.unitsProduced : 0), 0
  );

  const totalScrap = entries.reduce((sum, entry) => 
    sum + (typeof entry.scrapLbs === 'number' ? entry.scrapLbs : 0), 0
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Factory className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Manufacturing Quality Control Form
            </h1>
          </div>
          <p className="text-muted-foreground">
            Production monitoring and quality assurance tracking
          </p>
        </div>

        {/* Form Header */}
        <ManufacturingHeader
          date={date}
          shift={shift}
          operator={operator}
          productLine={productLine}
          materialType={materialType}
          targetOD={targetOD}
          targetWall={targetWall}
          targetWeight={targetWeight}
          onDateChange={setDate}
          onShiftChange={setShift}
          onOperatorChange={setOperator}
          onProductLineChange={setProductLine}
          onMaterialTypeChange={setMaterialType}
          onTargetODChange={(value) => setTargetOD(value ? parseFloat(value) : '')}
          onTargetWallChange={(value) => setTargetWall(value ? parseFloat(value) : '')}
          onTargetWeightChange={(value) => setTargetWeight(value ? parseFloat(value) : '')}
        />

        {/* Statistics Summary */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{completedEntries}</div>
                <div className="text-sm text-muted-foreground">Entries Completed</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">{totalUnits}</div>
                <div className="text-sm text-muted-foreground">Total Units</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-warning">{totalScrap.toFixed(1)} lbs</div>
                <div className="text-sm text-muted-foreground">Total Scrap</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {totalUnits > 0 ? ((1 - totalScrap / totalUnits) * 100).toFixed(1) : '0'}%
                </div>
                <div className="text-sm text-muted-foreground">Efficiency Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manufacturing Table */}
        <ManufacturingTable entries={entries} onEntryChange={handleEntryChange} />

        {/* Entry Management */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Button onClick={addEntry} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
              <Button 
                onClick={() => removeEntry(entries.length - 1)} 
                variant="outline" 
                disabled={entries.length <= 1}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Row
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                  <Save className="mr-2 h-4 w-4" />
                  Save Form
                </Button>
                <Button onClick={handleExport} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <Button onClick={handleReset} variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}