import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiConfig } from '@/components/settings/ApiConfig';

export default function Admin() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage system configuration and settings
          </p>
        </div>
        
        <div className="grid gap-6">
          <ApiConfig />
        </div>
      </div>
    </div>
  );
}