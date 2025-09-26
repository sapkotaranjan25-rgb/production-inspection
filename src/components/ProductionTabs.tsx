import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProductionForm } from "./ProductionForm";
import { ProductionFormData } from "@/types/production";
import { Plus, X, Factory } from "lucide-react";
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

  const addNewForm = () => {
    const newFormId = `form-${Date.now()}`;
    const newForm = generateInitialFormData(newFormId);
    setForms(prev => [...prev, newForm]);
    setActiveTab(newFormId);
    
    toast({
      title: "New Form Created",
      description: "A new production form has been added.",
    });
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
  };

  const updateForm = (formId: string, updatedFormData: ProductionFormData) => {
    setForms(prev => prev.map(form => 
      form.id === formId ? updatedFormData : form
    ));
  };

  const getFormDisplayName = (form: ProductionFormData, index: number) => {
    if (form.productionLine && form.shift) {
      return `${form.productionLine} - ${form.shift}`;
    }
    return `Form ${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Factory className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Production Quality Control System
            </h1>
          </div>
          <p className="text-muted-foreground">
            Multi-form production monitoring and quality assurance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="h-auto p-1 bg-muted">
              {forms.map((form, index) => (
                <div key={form.id} className="flex items-center">
                  <TabsTrigger 
                    value={form.id} 
                    className="relative pr-8 data-[state=active]:bg-background data-[state=active]:text-foreground"
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
            
            <Button onClick={addNewForm} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Form
            </Button>
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
      </div>
    </div>
  );
}