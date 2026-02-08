import { useState } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const CameraPreview = () => {
  const [cameraOn, setCameraOn] = useState(false);

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
              onCheckedChange={setCameraOn}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center overflow-hidden">
          {cameraOn ? (
            <div className="text-center space-y-2">
              <Video className="w-10 h-10 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Camera feed placeholder</p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <VideoOff className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground/50">Camera is off</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraPreview;
