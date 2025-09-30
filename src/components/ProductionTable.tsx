import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ProductionEntry, TargetSpecifications, VISUAL_OPTIONS, PRINT_OPTIONS, DIE_HEAD_OPTIONS, SCRAP_CODES } from "@/types/production";

interface ProductionTableProps {
  entries: ProductionEntry[];
  targetSpecs: TargetSpecifications;
  onEntryChange: (index: number, field: keyof ProductionEntry, value: string | number) => void;
}

export function ProductionTable({ entries, targetSpecs, onEntryChange }: ProductionTableProps) {
  // Check if all target specs are filled or contain "-"
  const isTargetSpecsComplete = () => {
    return Object.values(targetSpecs).every(value => value !== '' && value !== 0);
  };

  // Calculate gain/loss for display
  const calculateGainLoss = (entry: ProductionEntry): { gain: number; loss: number; isGain: boolean } => {
    const actualWt = parseFloat(entry.actualWtPerFt?.toString() || '0');
    const theoWt = parseFloat(targetSpecs.theoWtPerFt?.toString() || '0');
    
    if (actualWt === 0 || theoWt === 0) {
      return { gain: 0, loss: 0, isGain: true };
    }
    
    const calculatedValue = ((actualWt - theoWt) / theoWt) * 100;
    const isGain = calculatedValue < 0;
    const absValue = Math.abs(calculatedValue);
    
    return {
      gain: isGain ? absValue : 0,
      loss: !isGain ? absValue : 0,
      isGain
    };
  };

  // Conditional formatting helper
  const getConditionalFormatting = (value: string | number, field: string): string => {
    if (!value || value === '' || value === 0) return '';
    
    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return '';
    
    switch (field) {
      case 'odAverage':
        const odMax = parseFloat(targetSpecs.odMax?.toString() || '0');
        const odMin = parseFloat(targetSpecs.odMin?.toString() || '0');
        if (targetSpecs.odMax?.toString() === '-' || targetSpecs.odMin?.toString() === '-' || odMax === 0 || odMin === 0) return '';
        return numValue >= odMin && numValue <= odMax ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'odMaximum':
      case 'odMinimum':
        const calMax = parseFloat(targetSpecs.caliperMaximum?.toString() || '0');
        const calMin = parseFloat(targetSpecs.caliperMinimum?.toString() || '0');
        if (targetSpecs.caliperMaximum?.toString() === '-' || targetSpecs.caliperMinimum?.toString() === '-' || calMax === 0 || calMin === 0) return '';
        return numValue >= calMin && numValue <= calMax ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'outOfRound':
        const outRound = parseFloat(targetSpecs.outOfRound?.toString() || '0');
        if (targetSpecs.outOfRound?.toString() === '-' || outRound === 0) return '';
        return numValue <= outRound ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'ovality':
        const ovality = parseFloat(targetSpecs.ovality?.toString() || '0');
        if (targetSpecs.ovality?.toString() === '-' || ovality === 0) return '';
        return numValue <= ovality ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'toeIn':
        const toeIn = parseFloat(targetSpecs.toeIn?.toString() || '0');
        if (targetSpecs.toeIn?.toString() === '-' || toeIn === 0) return '';
        return numValue <= toeIn ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'wallMinimum':
      case 'wallMaximum':
        const wallMax = parseFloat(targetSpecs.wallMax?.toString() || '0');
        const wallMin = parseFloat(targetSpecs.wallMin?.toString() || '0');
        if (targetSpecs.wallMax?.toString() === '-' || targetSpecs.wallMin?.toString() === '-' || wallMax === 0 || wallMin === 0) return '';
        return numValue >= wallMin && numValue <= wallMax ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'eccentricity':
        const eccentric = parseFloat(targetSpecs.eccentricity?.toString() || '0');
        if (targetSpecs.eccentricity?.toString() === '-' || eccentric === 0) return '';
        return numValue <= eccentric ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'visual':
      case 'print':
        if (value === 'Pass') return 'bg-green-600/50';
        if (value === 'Fail') return 'bg-red-600/50';
        return '';
        
      case 'gain':
        const targetGain = parseFloat(targetSpecs.targetGain?.toString() || '0');
        if (targetSpecs.targetGain?.toString() === '-' || targetGain === 0) return '';
        return numValue <= targetGain ? 'bg-green-600/50' : 'bg-red-600/50';
        
      case 'loss':
        return 'bg-yellow-600/50'; // Always yellow for loss
        
      default:
        return '';
    }
  };

  const formatNumber = (value: number | '', decimals: number = 3): string => {
    if (value === '' || isNaN(Number(value))) return '';
    return Number(value).toFixed(decimals);
  };

  const calculateField = (entry: ProductionEntry, field: string): number => {
    switch (field) {
      case 'outOfRound':
        if (typeof entry.odMaximum === 'number' && typeof entry.odMinimum === 'number') {
          return Number((entry.odMaximum - entry.odMinimum).toFixed(3));
        }
        return 0;
      
      case 'ovality':
        if (typeof entry.odMaximum === 'number' && typeof entry.odMinimum === 'number' && 
            entry.odMaximum + entry.odMinimum !== 0) {
          return Number((((entry.odMaximum - entry.odMinimum) / (entry.odMaximum + entry.odMinimum)) * 200).toFixed(3));
        }
        return 0;
      
      case 'toeIn':
        if (typeof entry.odEnd === 'number' && typeof entry.odAverage === 'number' && entry.odAverage !== 0) {
          return Number((((entry.odEnd - entry.odAverage) / entry.odAverage) * 100).toFixed(3));
        }
        return 0;
      
      case 'eccentricity':
        if (typeof entry.wallMaximum === 'number' && typeof entry.wallMinimum === 'number' && entry.wallMaximum !== 0) {
          return Number((((entry.wallMaximum - entry.wallMinimum) / entry.wallMaximum) * 100).toFixed(3));
        }
        return 0;
      
      default:
        return 0;
    }
  };

  const handleChange = (index: number, field: keyof ProductionEntry, value: string) => {
    let processedValue: string | number = value;
    
    // Handle number fields
    if (['odAverage', 'odMaximum', 'odMinimum', 'odEnd', 'wallMinimum', 'wallMaximum',
         'odAtSaw', 'odAtVacTank', 'meltPress', 'actualPPH', 'actualWtPerFt', 'gain', 'loss',
         'acceptedLbs', 'scrapLbs', 'regrindConsumed'].includes(field)) {
      processedValue = value === '' ? '' : parseFloat(value) || '';
    } else if (['unitStart', 'unitEnd', 'acceptedFt', 'scrapFts'].includes(field)) {
      processedValue = value === '' ? '' : parseInt(value) || '';
    }
    
    onEntryChange(index, field, processedValue);
  };

  const handleSelectChange = (index: number, field: keyof ProductionEntry, value: string) => {
    // Convert "none" to empty string for clearing selection
    const newValue = value === 'none' ? '' : value;
    onEntryChange(index, field, newValue);
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-center min-w-[80px]">Start</TableHead>
                <TableHead className="text-center min-w-[80px]">End</TableHead>
                <TableHead className="text-center min-w-[90px]">OD Avg</TableHead>
                <TableHead className="text-center min-w-[90px]">Caliper Max</TableHead>
                <TableHead className="text-center min-w-[90px]">Caliper Min</TableHead>
                <TableHead className="text-center min-w-[90px]">OOR</TableHead>
                <TableHead className="text-center min-w-[80px]">Ovality</TableHead>
                <TableHead className="text-center min-w-[80px]">OD End</TableHead>
                <TableHead className="text-center min-w-[70px]">Toe-in</TableHead>
                <TableHead className="text-center min-w-[90px]">Wall Min</TableHead>
                <TableHead className="text-center min-w-[90px]">Wall Max</TableHead>
                <TableHead className="text-center min-w-[90px]">Eccentric</TableHead>
                <TableHead className="text-center min-w-[80px]">Visual</TableHead>
                <TableHead className="text-center min-w-[80px]">Print</TableHead>
                <TableHead className="text-center min-w-[90px]">OD Saw</TableHead>
                <TableHead className="text-center min-w-[90px]">OD Vac</TableHead>
                <TableHead className="text-center min-w-[90px]">Melt Press</TableHead>
                <TableHead className="text-center min-w-[90px]">Die Clean</TableHead>
                <TableHead className="text-center min-w-[90px]">Unit Start</TableHead>
                <TableHead className="text-center min-w-[90px]">Unit End</TableHead>
                <TableHead className="text-center min-w-[90px]">Act PPH</TableHead>
                <TableHead className="text-center min-w-[90px]">Act Wt/Ft</TableHead>
                <TableHead className="text-center min-w-[80px]">Gain</TableHead>
                <TableHead className="text-center min-w-[80px]">Loss</TableHead>
                <TableHead className="text-center min-w-[90px]">Acc Ft</TableHead>
                <TableHead className="text-center min-w-[90px]">Acc Lbs</TableHead>
                <TableHead className="text-center min-w-[90px]">Scrap Ft</TableHead>
                <TableHead className="text-center min-w-[90px]">Scrap Lbs</TableHead>
                <TableHead className="text-center min-w-[80px]">Code</TableHead>
                <TableHead className="text-center min-w-[90px]">Regrind %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => {
                const isFirstRow = index === 0;
                const shouldLockFirstRow = isFirstRow && !isTargetSpecsComplete();
                const gainLossData = calculateGainLoss(entry);
                
                return (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="p-1">
                    <Input
                      type="time"
                      value={entry.start}
                      onChange={(e) => handleChange(index, 'start', e.target.value)}
                      className="text-xs h-8"
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="time"
                      value={entry.end}
                      onChange={(e) => handleChange(index, 'end', e.target.value)}
                      className="text-xs h-8"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odAverage}
                      onChange={(e) => handleChange(index, 'odAverage', e.target.value)}
                      className={`text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${getConditionalFormatting(entry.odAverage, 'odAverage')}`}
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odMaximum}
                      onChange={(e) => handleChange(index, 'odMaximum', e.target.value)}
                      className={`text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${getConditionalFormatting(entry.odMaximum, 'odMaximum')}`}
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odMinimum}
                      onChange={(e) => handleChange(index, 'odMinimum', e.target.value)}
                      className={`text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${getConditionalFormatting(entry.odMinimum, 'odMinimum')}`}
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className={`text-xs h-8 flex items-center justify-center bg-muted rounded text-muted-foreground ${getConditionalFormatting(calculateField(entry, 'outOfRound'), 'outOfRound')}`}>
                      {formatNumber(calculateField(entry, 'outOfRound'))}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <div className={`text-xs h-8 flex items-center justify-center bg-muted rounded text-muted-foreground ${getConditionalFormatting(calculateField(entry, 'ovality'), 'ovality')}`}>
                      {formatNumber(calculateField(entry, 'ovality'))}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odEnd}
                      onChange={(e) => handleChange(index, 'odEnd', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className={`text-xs h-8 flex items-center justify-center bg-muted rounded text-muted-foreground ${getConditionalFormatting(calculateField(entry, 'toeIn'), 'toeIn')}`}>
                      {formatNumber(calculateField(entry, 'toeIn'))}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.wallMinimum}
                      onChange={(e) => handleChange(index, 'wallMinimum', e.target.value)}
                      className={`text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${getConditionalFormatting(entry.wallMinimum, 'wallMinimum')}`}
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.wallMaximum}
                      onChange={(e) => handleChange(index, 'wallMaximum', e.target.value)}
                      className={`text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${getConditionalFormatting(entry.wallMaximum, 'wallMaximum')}`}
                      disabled={shouldLockFirstRow}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className={`text-xs h-8 flex items-center justify-center bg-muted rounded text-muted-foreground ${getConditionalFormatting(calculateField(entry, 'eccentricity'), 'eccentricity')}`}>
                      {formatNumber(calculateField(entry, 'eccentricity'))}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <Select value={entry.visual || 'none'} onValueChange={(value) => handleSelectChange(index, 'visual', value)}>
                      <SelectTrigger className={`text-xs h-8 ${getConditionalFormatting(entry.visual, 'visual')}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Clear</SelectItem>
                        {VISUAL_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Select value={entry.print || 'none'} onValueChange={(value) => handleSelectChange(index, 'print', value)}>
                      <SelectTrigger className={`text-xs h-8 ${getConditionalFormatting(entry.print, 'print')}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Clear</SelectItem>
                        {PRINT_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odAtSaw}
                      onChange={(e) => handleChange(index, 'odAtSaw', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.odAtVacTank}
                      onChange={(e) => handleChange(index, 'odAtVacTank', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.meltPress}
                      onChange={(e) => handleChange(index, 'meltPress', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Select value={entry.dieHeadClean} onValueChange={(value) => handleChange(index, 'dieHeadClean', value)}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIE_HEAD_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      value={entry.unitStart}
                      onChange={(e) => handleChange(index, 'unitStart', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      value={entry.unitEnd}
                      onChange={(e) => handleChange(index, 'unitEnd', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.actualPPH}
                      onChange={(e) => handleChange(index, 'actualPPH', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.actualWtPerFt}
                      onChange={(e) => handleChange(index, 'actualWtPerFt', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className={`text-xs h-8 flex items-center justify-center bg-muted rounded text-muted-foreground ${getConditionalFormatting(gainLossData.gain, 'gain')}`}>
                      {gainLossData.gain > 0 ? gainLossData.gain.toFixed(2) : ''}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <div className={`text-xs h-8 flex items-center justify-center bg-muted rounded text-muted-foreground ${getConditionalFormatting(gainLossData.loss, 'loss')}`}>
                      {gainLossData.loss > 0 ? gainLossData.loss.toFixed(2) : ''}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      value={entry.acceptedFt}
                      onChange={(e) => handleChange(index, 'acceptedFt', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.acceptedLbs}
                      onChange={(e) => handleChange(index, 'acceptedLbs', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      value={entry.scrapFts}
                      onChange={(e) => handleChange(index, 'scrapFts', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={entry.scrapLbs}
                      onChange={(e) => handleChange(index, 'scrapLbs', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Select value={entry.scrapCode} onValueChange={(value) => handleChange(index, 'scrapCode', value)}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCRAP_CODES.map(code => (
                          <SelectItem key={code} value={code}>{code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      step="0.1"
                      value={entry.regrindConsumed}
                      onChange={(e) => handleChange(index, 'regrindConsumed', e.target.value)}
                      className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}