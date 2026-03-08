import { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  Upload, FileText, Send, Bot, User, Loader2, X,
  MessageSquare, AlertCircle, CheckCircle2, Trash2,
} from 'lucide-react';

const DOC_UPLOAD_WEBHOOK = 'https://roxx5071.app.n8n.cloud/webhook-test/doc_upload';
const DOC_QUERY_WEBHOOK = 'https://roxx5071.app.n8n.cloud/webhook-test/doc_query';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

interface UploadedDoc {
  id: string;
  file_name: string;
  file_url: string;
  status: string;
  created_at: string;
}

const DocumentChatPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [querying, setQuerying] = useState(false);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setDocuments(data);
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    if (file.type !== 'application/pdf') {
      toast({ title: 'Invalid file', description: 'Only PDF files are accepted.', variant: 'destructive' });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 20MB.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);

      // Send PDF file directly to n8n webhook as multipart form data
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('file_name', file.name);

      setUploadProgress(50);

      const webhookRes = await fetch(DOC_UPLOAD_WEBHOOK, {
        method: 'POST',
        body: formData,
      });

      if (!webhookRes.ok) throw new Error('Webhook upload failed');
      setUploadProgress(80);

      // Save to documents table for tracking
      const { error: dbError } = await supabase
        .from('documents')
        .insert({ user_id: user.id, file_name: file.name, file_url: '', status: 'processing' });
      if (dbError) throw dbError;

      setUploadProgress(100);
      toast({ title: 'Upload successful', description: 'Document uploaded successfully. AI indexing has started.' });
      fetchDocuments();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDeleteDoc = async (doc: UploadedDoc) => {
    await supabase.from('documents').delete().eq('id', doc.id);
    if (selectedDoc?.id === doc.id) {
      setSelectedDoc(null);
      setMessages([]);
    }
    fetchDocuments();
  };

  const handleSend = async () => {
    if (!query.trim() || !selectedDoc) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setQuerying(true);

    try {
      const res = await fetch(DOC_QUERY_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content, document_name: selectedDoc.file_name }),
      });

      if (!res.ok) throw new Error('Backend request failed');
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer || data.output || 'No response received.',
        sources: data.sources,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, something went wrong. The document may not be indexed yet. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Document Chat</h1>
          <p className="text-muted-foreground mt-1">Upload PDFs and ask AI questions about them</p>
        </div>

        {/* Upload Section */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="w-5 h-5 text-primary" />
              Upload Document
            </CardTitle>
            <CardDescription>Drag and drop a PDF or click to browse (max 20MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
                dragOver
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : 'border-border/60 hover:border-primary/50 hover:bg-muted/30'
              )}
            >
              <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : 'Drop your PDF here or click to browse'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                  e.target.value = '';
                }}
              />
            </div>
            {uploadProgress > 0 && (
              <div className="mt-4 space-y-1">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">{uploadProgress}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Section */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
          {/* Document List */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Your Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[400px]">
                {documents.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No documents uploaded yet</p>
                ) : (
                  <div className="space-y-1">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => { setSelectedDoc(doc); setMessages([]); }}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors group text-sm',
                          selectedDoc?.id === doc.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted/50 text-foreground'
                        )}
                      >
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate flex-1">{doc.file_name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteDoc(doc); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3 border-b border-border/30">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
                {selectedDoc ? (
                  <span className="truncate">Chat — {selectedDoc.file_name}</span>
                ) : (
                  'Chat with Document'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 h-[400px] p-4">
                {!selectedDoc ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <Bot className="w-12 h-12 text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground text-sm">Select a document to start chatting</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <CheckCircle2 className="w-12 h-12 text-primary/40 mb-3" />
                    <p className="text-muted-foreground text-sm">Ask a question about <strong>{selectedDoc.file_name}</strong></p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex gap-3 max-w-[85%]',
                          msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                        )}>
                          {msg.role === 'user'
                            ? <User className="w-4 h-4 text-primary-foreground" />
                            : <Bot className="w-4 h-4 text-accent-foreground" />
                          }
                        </div>
                        <div className={cn(
                          'rounded-2xl px-4 py-3 text-sm',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        )}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-border/30 space-y-1">
                              <p className="text-xs font-medium opacity-70">Sources:</p>
                              {msg.sources.map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs mr-1">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {querying && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          AI is analyzing the document...
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/30">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about the uploaded document..."
                    disabled={!selectedDoc || querying}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!selectedDoc || !query.trim() || querying}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentChatPage;
