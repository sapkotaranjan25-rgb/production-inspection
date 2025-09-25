import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InspectionFormHeader } from "./InspectionFormHeader";
import { InspectionTable } from "./InspectionTable";
import { InspectionEntry, InspectionStatus } from "@/types/inspection";
import { FileText, Download, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Generate 24 hour entries
const generateHourlyEntries = (): InspectionEntry[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ':00';
    return {
      hour,
      checkpoint1: 'na' as InspectionStatus,
      checkpoint2: 'na' as InspectionStatus,
      checkpoint3: 'na' as InspectionStatus,
      checkpoint4: 'na' as InspectionStatus,
      comments: '',
      inspectorInitials: '',
    };
  });
};

export function InspectionForm() {
  const { toast } = useToast();
  const [facility, setFacility] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [shift, setShift] = useState('');
  const [inspector, setInspector] = useState('');
  const [entries, setEntries] = useState<InspectionEntry[]>(generateHourlyEntries());

  const handleEntryChange = (index: number, field: keyof InspectionEntry, value: string | InspectionStatus) => {
    setEntries(prev => 
      prev.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSave = () => {
    if (!facility || !date || !shift || !inspector) {
      toast({
        title: "Missing Information",
        description: "Please fill in all header fields before saving.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save to a database or local storage
    console.log('Saving inspection form:', { facility, date, shift, inspector, entries });
    
    toast({
      title: "Form Saved",
      description: "Inspection form has been saved successfully.",
    });
  };

  const handleReset = () => {
    setFacility('');
    setDate(new Date());
    setShift('');
    setInspector('');
    setEntries(generateHourlyEntries());
    
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const handleExport = () => {
    const formData = { facility, date, shift, inspector, entries };
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `inspection-form-${facility}-${date?.toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Form Exported",
      description: "Inspection form has been exported successfully.",
    });
  };

  const completedEntries = entries.filter(entry => 
    entry.checkpoint1 !== 'na' || entry.checkpoint2 !== 'na' || 
    entry.checkpoint3 !== 'na' || entry.checkpoint4 !== 'na'
  ).length;

  const failedChecks = entries.reduce((count, entry) => {
    return count + 
      (entry.checkpoint1 === 'fail' ? 1 : 0) +
      (entry.checkpoint2 === 'fail' ? 1 : 0) +
      (entry.checkpoint3 === 'fail' ? 1 : 0) +
      (entry.checkpoint4 === 'fail' ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Hourly Inspection Form
            </h1>
          </div>
          <p className="text-muted-foreground">
            Complete your inspection checklist for each hour of operation
          </p>
        </div>

        {/* Form Header */}
        <InspectionFormHeader
          facility={facility}
          date={date}
          shift={shift}
          inspector={inspector}
          onFacilityChange={setFacility}
          onDateChange={setDate}
          onShiftChange={setShift}
          onInspectorChange={setInspector}
        />

        {/* Progress Summary */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{completedEntries}/24</div>
                <div className="text-sm text-muted-foreground">Hours Completed</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">
                  {entries.reduce((count, entry) => {
                    return count + 
                      (entry.checkpoint1 === 'pass' ? 1 : 0) +
                      (entry.checkpoint2 === 'pass' ? 1 : 0) +
                      (entry.checkpoint3 === 'pass' ? 1 : 0) +
                      (entry.checkpoint4 === 'pass' ? 1 : 0);
                  }, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Passed Checks</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-destructive">{failedChecks}</div>
                <div className="text-sm text-muted-foreground">Failed Checks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Table */}
        <InspectionTable entries={entries} onEntryChange={handleEntryChange} />

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