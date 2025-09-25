import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { InspectionEntry, InspectionStatus, INSPECTION_CHECKPOINTS } from "@/types/inspection";
import { CheckCircle, XCircle, Minus } from "lucide-react";

interface InspectionTableProps {
  entries: InspectionEntry[];
  onEntryChange: (index: number, field: keyof InspectionEntry, value: string | InspectionStatus) => void;
}

const StatusIcon = ({ status }: { status: InspectionStatus }) => {
  switch (status) {
    case 'pass':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'fail':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'na':
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: InspectionStatus }) => {
  const variants = {
    pass: "bg-success-light text-success border-success",
    fail: "bg-destructive/10 text-destructive border-destructive",
    na: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      <StatusIcon status={status} />
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  );
};

export function InspectionTable({ entries, onEntryChange }: InspectionTableProps) {
  return (
    <Card className="shadow-[var(--shadow-form)]">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <CardTitle className="text-xl">Hourly Inspection Log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header border-b border-table-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[100px]">
                  Time
                </th>
                {INSPECTION_CHECKPOINTS.map((checkpoint, index) => (
                  <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-foreground min-w-[140px]">
                    {checkpoint}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[200px]">
                  Comments
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground min-w-[100px]">
                  Initials
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-table-border hover:bg-table-row-even transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-table-row-even'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {entry.hour}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Select 
                      value={entry.checkpoint1} 
                      onValueChange={(value: InspectionStatus) => onEntryChange(index, 'checkpoint1', value)}
                    >
                      <SelectTrigger className="w-full bg-background border-input">
                        <SelectValue>
                          <StatusBadge status={entry.checkpoint1} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success mr-2" />
                            Pass
                          </div>
                        </SelectItem>
                        <SelectItem value="fail">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-destructive mr-2" />
                            Fail
                          </div>
                        </SelectItem>
                        <SelectItem value="na">
                          <div className="flex items-center">
                            <Minus className="h-4 w-4 text-muted-foreground mr-2" />
                            N/A
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Select 
                      value={entry.checkpoint2} 
                      onValueChange={(value: InspectionStatus) => onEntryChange(index, 'checkpoint2', value)}
                    >
                      <SelectTrigger className="w-full bg-background border-input">
                        <SelectValue>
                          <StatusBadge status={entry.checkpoint2} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success mr-2" />
                            Pass
                          </div>
                        </SelectItem>
                        <SelectItem value="fail">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-destructive mr-2" />
                            Fail
                          </div>
                        </SelectItem>
                        <SelectItem value="na">
                          <div className="flex items-center">
                            <Minus className="h-4 w-4 text-muted-foreground mr-2" />
                            N/A
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Select 
                      value={entry.checkpoint3} 
                      onValueChange={(value: InspectionStatus) => onEntryChange(index, 'checkpoint3', value)}
                    >
                      <SelectTrigger className="w-full bg-background border-input">
                        <SelectValue>
                          <StatusBadge status={entry.checkpoint3} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success mr-2" />
                            Pass
                          </div>
                        </SelectItem>
                        <SelectItem value="fail">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-destructive mr-2" />
                            Fail
                          </div>
                        </SelectItem>
                        <SelectItem value="na">
                          <div className="flex items-center">
                            <Minus className="h-4 w-4 text-muted-foreground mr-2" />
                            N/A
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Select 
                      value={entry.checkpoint4} 
                      onValueChange={(value: InspectionStatus) => onEntryChange(index, 'checkpoint4', value)}
                    >
                      <SelectTrigger className="w-full bg-background border-input">
                        <SelectValue>
                          <StatusBadge status={entry.checkpoint4} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success mr-2" />
                            Pass
                          </div>
                        </SelectItem>
                        <SelectItem value="fail">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-destructive mr-2" />
                            Fail
                          </div>
                        </SelectItem>
                        <SelectItem value="na">
                          <div className="flex items-center">
                            <Minus className="h-4 w-4 text-muted-foreground mr-2" />
                            N/A
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={entry.comments}
                      onChange={(e) => onEntryChange(index, 'comments', e.target.value)}
                      placeholder="Add comments..."
                      className="bg-background border-input text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Input
                      value={entry.inspectorInitials}
                      onChange={(e) => onEntryChange(index, 'inspectorInitials', e.target.value)}
                      placeholder="XX"
                      className="bg-background border-input text-center text-sm font-medium w-16 mx-auto"
                      maxLength={3}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}