import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ManufacturingEntry, QUALITY_OPTIONS, DISPOSITION_OPTIONS, SCRAP_CODES } from "@/types/manufacturing";
import { Factory } from "lucide-react";

interface ManufacturingTableProps {
  entries: ManufacturingEntry[];
  onEntryChange: (index: number, field: keyof ManufacturingEntry, value: string | number) => void;
}

export function ManufacturingTable({ entries, onEntryChange }: ManufacturingTableProps) {
  return (
    <Card className="shadow-[var(--shadow-form)]">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5" />
          Production Quality Control Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header border-b border-table-border">
                <th className="px-3 py-3 text-left text-xs font-semibold text-foreground min-w-[120px]">
                  Sample Time
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  OD Avg
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  OD Max
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  OD Min
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Out of Round
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Quality %
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Oil %
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Wall Thick.
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Target Wall
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Wall Max
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Eccentricity
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Visual
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Print
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  OD at Saw
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  OD at Vac Tank
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Melt Press.
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Die Head
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Actual PPH
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Est. Wt./Ft.
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Units
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Total Footage
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Scrap Lbs
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[80px]">
                  Scrap Code
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-foreground min-w-[100px]">
                  Disposition
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
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Input
                        type="time"
                        value={entry.sampleStart}
                        onChange={(e) => onEntryChange(index, 'sampleStart', e.target.value)}
                        className="bg-background text-xs w-20"
                      />
                      <Input
                        type="time"
                        value={entry.sampleEnd}
                        onChange={(e) => onEntryChange(index, 'sampleEnd', e.target.value)}
                        className="bg-background text-xs w-20"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odAverage}
                      onChange={(e) => onEntryChange(index, 'odAverage', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odMaximum}
                      onChange={(e) => onEntryChange(index, 'odMaximum', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odMinimum}
                      onChange={(e) => onEntryChange(index, 'odMinimum', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.outOfRound}
                      onChange={(e) => onEntryChange(index, 'outOfRound', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.qualityPercent}
                      onChange={(e) => onEntryChange(index, 'qualityPercent', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.oilPercent}
                      onChange={(e) => onEntryChange(index, 'oilPercent', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.wallThickness}
                      onChange={(e) => onEntryChange(index, 'wallThickness', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.targetWall}
                      onChange={(e) => onEntryChange(index, 'targetWall', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.wallMaximum}
                      onChange={(e) => onEntryChange(index, 'wallMaximum', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.eccentricity}
                      onChange={(e) => onEntryChange(index, 'eccentricity', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select 
                      value={entry.visualInspection} 
                      onValueChange={(value) => onEntryChange(index, 'visualInspection', value)}
                    >
                      <SelectTrigger className="bg-background text-xs h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Select 
                      value={entry.printQuality} 
                      onValueChange={(value) => onEntryChange(index, 'printQuality', value)}
                    >
                      <SelectTrigger className="bg-background text-xs h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odAtSaw}
                      onChange={(e) => onEntryChange(index, 'odAtSaw', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odAtVacTank}
                      onChange={(e) => onEntryChange(index, 'odAtVacTank', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.meltPressure}
                      onChange={(e) => onEntryChange(index, 'meltPressure', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={entry.dieHead}
                      onChange={(e) => onEntryChange(index, 'dieHead', e.target.value)}
                      className="bg-background text-xs text-center"
                      placeholder="Head"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.actualPph}
                      onChange={(e) => onEntryChange(index, 'actualPph', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.estimatedWtPerFt}
                      onChange={(e) => onEntryChange(index, 'estimatedWtPerFt', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      value={entry.unitsProduced}
                      onChange={(e) => onEntryChange(index, 'unitsProduced', e.target.value ? parseInt(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.totalFootage}
                      onChange={(e) => onEntryChange(index, 'totalFootage', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.scrapLbs}
                      onChange={(e) => onEntryChange(index, 'scrapLbs', e.target.value ? parseFloat(e.target.value) : '')}
                      className="bg-background text-xs text-center"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select 
                      value={entry.scrapCode} 
                      onValueChange={(value) => onEntryChange(index, 'scrapCode', value)}
                    >
                      <SelectTrigger className="bg-background text-xs h-8">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {SCRAP_CODES.map(code => (
                          <SelectItem key={code} value={code}>{code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Select 
                      value={entry.disposition} 
                      onValueChange={(value) => onEntryChange(index, 'disposition', value)}
                    >
                      <SelectTrigger className="bg-background text-xs h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISPOSITION_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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