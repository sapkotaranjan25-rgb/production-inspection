import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProductionForm } from "./ProductionForm";
import { ProductionFormData } from "@/types/production";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Generate initial form data
const generateInitialFormData = (id: string): ProductionFormData => ({
  id,
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
  entries: [{
    start: '', end: '', odAverage: '', odMaximum: '', odMinimum: '', outOfRound: 0,
    ovality: 0, odEnd: '', toeIn: 0, wallMinimum: '', wallMaximum: '', eccentricity: 0,
    visual: '', print: '', odAtSaw: '', odAtVacTank: '', meltPress: '', dieHeadClean: '',
    unitStart: '', unitEnd: '', actualPPH: '', actualWtPerFt: '', gain: '', loss: '',
    acceptedFt: '', acceptedLbs: '', scrapFts: '', scrapLbs: '', scrapCode: '', regrindConsumed: ''
  }],
});

export function ProductionTabs() {
  const { toast } = useToast();
  const [forms, setForms] = useState<ProductionFormData[]>([
    generateInitialFormData('form-1')
  ]);
  const [activeTab, setActiveTab] = useState('form-1');
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [formToClose, setFormToClose] = useState<string | null>(null);

  const addNewForm = () => {
    if (forms.length >= 12) {
      toast({
        title: "Maximum Forms Reached",
        description: "You can have a maximum of 12 forms open at once.",
        variant: "destructive",
      });
      return;
    }

    // Generate unique form ID with timestamp and random string
    const newFormId = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newForm = generateInitialFormData(newFormId);
    setForms(prev => [...prev, newForm]);
    setActiveTab(newFormId);
    
    toast({
      title: "New Form Created",
      description: "A new production form has been added.",
    });
  };

  const hasFormData = (form: ProductionFormData): boolean => {
    // Check if production info has data
    const hasProductionInfo = !!form.productionSite || !!form.operatorName || !!form.workOrderNumber || 
                            !!form.resinCode || !!form.colorCode || !!form.productionLine;
    
    // Check if target specs have data
    const hasTargetSpecs = Object.values(form.targetSpecs).some(val => val !== '' && val !== 0);
    
    // Check if entries have data
    const hasEntryData = form.entries.some(entry => 
      !!entry.start || !!entry.end || typeof entry.odAverage === 'number' || 
      typeof entry.unitStart === 'number' || !!entry.visual || !!entry.print
    );
    
    return hasProductionInfo || hasTargetSpecs || hasEntryData;
  };

  const closeForm = (formId: string) => {
    if (forms.length === 1) {
      toast({
        title: "Cannot Close",
        description: "At least one form must remain open.",
        variant: "destructive",
      });
      return;
    }

    const form = forms.find(f => f.id === formId);
    if (form && hasFormData(form)) {
      setFormToClose(formId);
      setCloseDialogOpen(true);
      return;
    }

    performCloseForm(formId);
  };

  const performCloseForm = (formId: string) => {
    const formIndex = forms.findIndex(form => form.id === formId);
    const updatedForms = forms.filter(form => form.id !== formId);
    setForms(updatedForms);

    // Switch to another tab if the closed tab was active
    if (activeTab === formId) {
      const newActiveIndex = Math.min(formIndex, updatedForms.length - 1);
      setActiveTab(updatedForms[newActiveIndex].id);
    }

    toast({
      title: "Form Closed",
      description: "Production form has been closed.",
    });
    
    setCloseDialogOpen(false);
    setFormToClose(null);
  };

  const updateForm = (formId: string, updatedFormData: ProductionFormData) => {
    setForms(prev => prev.map(form => 
      form.id === formId ? updatedFormData : form
    ));
  };

  const getFormDisplayName = (form: ProductionFormData, index: number) => {
    if (form.workOrderNumber && form.shift && form.productionLine) {
      return `${form.workOrderNumber}-${form.shift}${form.productionLine}`;
    }
    return `Form ${index + 1}`;
  };

  return (
    <div className="bg-background overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Production Inspection Submission
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-4 flex items-end gap-2">
            {/* Form Tabs - 90% width */}
            <div className="flex-1 w-[90%]">
              <TabsList className="h-12 p-1 bg-muted flex w-full gap-1">
                {forms.map((form, index) => (
                  <div key={form.id} className="relative flex-1">
                    <TabsTrigger 
                      value={form.id} 
                      className="relative w-full h-10 pr-8 data-[state=active]:bg-[hsl(var(--light-blue-light))] data-[state=active]:text-[hsl(var(--light-blue-foreground))] data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-[hsl(var(--success))] data-[state=active]:font-semibold transition-all duration-200"
                    >
                      {getFormDisplayName(form, index)}
                      {forms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeForm(form.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </TabsTrigger>
                  </div>
                ))}
              </TabsList>
            </div>
            
            {/* New Form Button - 10% width with larger gap */}
            <div className="w-[10%] ml-4">
              <Button 
                onClick={addNewForm} 
                variant="outline" 
                className="w-full h-12 bg-[hsl(var(--light-blue))] border-[hsl(var(--light-blue))] text-[hsl(var(--light-blue-foreground))] hover:bg-[hsl(var(--light-blue-hover))] px-6"
                disabled={forms.length >= 12}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Form
              </Button>
            </div>
          </div>

          {forms.map((form) => (
            <TabsContent key={form.id} value={form.id} className="mt-0">
              <ProductionForm
                formData={form}
                onFormDataChange={(updatedFormData) => updateForm(form.id, updatedFormData)}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Close Confirmation Dialog */}
        <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close Form?</AlertDialogTitle>
              <AlertDialogDescription>
                This form contains data. Are you sure you want to close it? All unsaved data will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCloseDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => formToClose && performCloseForm(formToClose)}>
                Close Form
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}