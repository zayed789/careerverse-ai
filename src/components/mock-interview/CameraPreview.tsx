import { useState, useRef, useEffect, useCallback } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const CameraPreview = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    try {
      setStreamError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setStreamError(true);
      setCameraOn(false);
    }
  }, []);

  useEffect(() => {
    if (cameraOn) {
      startStream();
    } else {
      stopStream();
    }
  }, [cameraOn, startStream, stopStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const handleToggle = (checked: boolean) => {
    setCameraOn(checked);
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Video className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
              Camera Preview
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="camera-toggle" className="text-xs text-muted-foreground">
              {cameraOn ? 'ON' : 'OFF'}
            </Label>
            <Switch
              id="camera-toggle"
              checked={cameraOn}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'aspect-video rounded-lg bg-muted/30 border flex items-center justify-center overflow-hidden transition-all duration-300',
            cameraOn && !streamError
              ? 'border-primary/40 shadow-[0_0_15px_hsl(var(--glow-primary)/0.15)]'
              : 'border-border/30'
          )}
        >
          {/* Video element — always rendered, hidden when off */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              'w-full h-full object-cover',
              cameraOn && !streamError ? 'block' : 'hidden'
            )}
          />

          {/* Off state */}
          {!cameraOn && !streamError && (
            <div className="text-center space-y-2">
              <VideoOff className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground/50">Camera is off</p>
            </div>
          )}

          {/* Error state */}
          {streamError && (
            <div className="text-center space-y-2 p-4">
              <VideoOff className="w-10 h-10 text-destructive/60 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Camera access denied. Please allow camera permissions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraPreview;
