import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, X } from "lucide-react";
import { TargetSpecifications } from "@/types/production";
import QrScanner from "qr-scanner";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (targetSpecs: TargetSpecifications) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const parseQRData = (data: string): TargetSpecifications => {
    const values = data.split('*^').map(val => val.trim() === '' ? '' : parseFloat(val));
    
    return {
      odAverage: values[0] || '',
      odMax: values[1] || '',
      odMin: values[2] || '',
      caliperMaximum: values[3] || '',
      caliperMinimum: values[4] || '',
      outOfRound: values[5] || '',
      ovality: values[6] || '',
      toeIn: values[7] || '',
      wallMin: values[8] || '',
      wallMax: values[9] || '',
      targetMin: values[10] || '',
      targetMax: values[11] || '',
      eccentricity: values[12] || '',
      goalPPH: values[13] || '',
      theoWtPerFt: values[14] || '',
      targetGain: values[15] || '',
    };
  };

  const handleScan = (data: string) => {
    try {
      const targetSpecs = parseQRData(data);
      onScan(targetSpecs);
      onClose();
    } catch (error) {
      console.error('Error parsing QR data:', error);
    }
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      handleScan(manualInput);
    }
  };

  const startScanning = async () => {
    if (videoRef.current) {
      try {
        setIsScanning(true);
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleScan(result.data),
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        await scannerRef.current.start();
      } catch (error) {
        console.error('Error starting QR scanner:', error);
        setIsScanning(false);
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen && !isScanning) {
      // Auto-start scanning when dialog opens
      startScanning();
    }
    
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      stopScanning();
      setManualInput('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan QR Code for Target Specifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Camera Scanner */}
          <div className="relative">
            <video 
              ref={videoRef}
              className="w-full h-64 bg-muted rounded-lg object-cover"
              style={{ display: isScanning ? 'block' : 'none' }}
            />
            {!isScanning && (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera not active</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={startScanning} disabled={isScanning} className="flex-1">
              {isScanning ? 'Scanning...' : 'Start Camera'}
            </Button>
            <Button onClick={stopScanning} disabled={!isScanning} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Manual Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="manual-qr"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Use Barcode scanner here..."
                className="flex-1"
              />
              <Button onClick={handleManualInput} disabled={!manualInput.trim()}>
                Add Spec
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}