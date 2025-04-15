
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      throw new Error("No file URL provided");
    }

    console.log("Processing PDF from URL:", fileUrl);
    
    // Fetch the PDF from the provided URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    const pdfData = await response.arrayBuffer();
    
    // Initialize PDF.js
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded with ${pdf.numPages} pages`);
    
    // Process the first page for now (can be expanded to handle multiple pages)
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    
    // Extract text from the page
    const extractedText = textContent.items.map(item => item.str).join(' ');
    
    // Basic parsing for trade data
    // This is a simplified example - real implementation would need more robust parsing
    const tradeData = {
      rawText: extractedText,
      extractedData: parseTradeData(extractedText),
    };
    
    return new Response(JSON.stringify(tradeData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to process PDF"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Basic parsing function - would need to be customized based on your PDF format
function parseTradeData(text) {
  // Simple regex patterns to extract common trade data
  // These would need to be adapted to match your specific PDF format
  const patterns = {
    tradeId: /Trade ID:\s*([A-Z0-9]+)/i,
    symbol: /Symbol:\s*([A-Z]+)/i,
    date: /Date:\s*(\d{2}\/\d{2}\/\d{4})/i,
    transactions: /Transaction[s]?:\s*(\d+)/i,
  };
  
  const result = {};
  
  // Apply each pattern
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result[key] = match[1];
    }
  }
  
  // Try to extract transactions
  const transactions = [];
  const transactionBlocks = text.split(/Transaction \d+/i).slice(1);
  
  transactionBlocks.forEach((block, index) => {
    transactions.push({
      id: index + 1,
      text: block.trim(),
      // Additional parsing for transaction details would go here
    });
  });
  
  if (transactions.length > 0) {
    result.transactions = transactions;
  }
  
  return result;
}
