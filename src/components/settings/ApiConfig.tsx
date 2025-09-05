import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConfigService } from '@/services/ConfigService';

export function ApiConfig() {
  const [value, setValue] = useState('');
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const url = ConfigService.getApiBaseUrl();
    setValue(url);
    setCurrent(url);
  }, []);

  const onSave = () => {
    if (!value) {
      toast.error('Please enter a valid URL');
      return;
    }
    console.log('ApiConfig - Saving URL:', value);
    ConfigService.setApiBaseUrl(value);
    const saved = ConfigService.getApiBaseUrl();
    console.log('ApiConfig - Saved URL:', saved);
    console.log('ApiConfig - localStorage content:', localStorage.getItem('app_config'));
    setCurrent(saved);
    toast.success('API base URL updated', { description: saved });
  };

  const onReset = () => {
    ConfigService.resetToDefaults();
    const def = ConfigService.getApiBaseUrl();
    setValue(def);
    setCurrent(def);
    toast.success('Reset to default API URL', { description: def });
  };

  return (
    <Card aria-label="API Configuration">
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-base-url">API base URL</Label>
          <Input
            id="api-base-url"
            placeholder="https://your-ngrok-url.ngrok-free.app"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Current: {current}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={onSave} size="sm">
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onReset} size="sm">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
