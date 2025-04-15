
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TradeDocumentUploaderProps {
  tradeId: string;
  onProcessComplete?: (tradeData: any) => void;
}

export function TradeDocumentUploader({ tradeId, onProcessComplete }: TradeDocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ path: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `trades/${tradeId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('trade-documents')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from('trade-documents')
        .getPublicUrl(filePath);
      
      setUploadedFile({
        path: filePath,
        name: file.name
      });
      
      toast.success("Document uploaded", {
        description: `${file.name} has been uploaded successfully`
      });
      
      // Process the PDF
      await processPdf(publicUrlData.publicUrl);
      
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error("Upload failed", {
        description: error.message || "There was an error uploading the document"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processPdf = async (fileUrl: string) => {
    try {
      setIsProcessing(true);
      
      // Call the Supabase Edge Function to process the PDF
      const { data, error } = await supabase.functions.invoke('process-pdf', {
        body: { fileUrl }
      });
      
      if (error) throw error;
      
      toast.success("Document processed", {
        description: "Trade data has been extracted successfully"
      });
      
      if (onProcessComplete && data) {
        onProcessComplete(data);
      }
      
    } catch (error: any) {
      console.error("Error processing PDF:", error);
      toast.error("Processing failed", {
        description: error.message || "There was an error processing the document"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trade Documents</CardTitle>
        <CardDescription>Upload trade confirmation documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Trade Document
              </>
            )}
          </Button>
          
          {uploadedFile && (
            <div className="flex items-center p-2 bg-muted rounded-md">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm truncate">{uploadedFile.name}</span>
              {isProcessing && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
