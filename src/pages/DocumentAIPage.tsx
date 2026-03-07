import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Send, Loader2, CheckCircle2, AlertCircle, X, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';

const UPLOAD_URL = '/api/rag/upload';
const QUERY_URL = '/api/rag/query';

interface UploadedDoc {
  id: string;
  name: string;
  uploadedAt: Date;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const DocumentAIPage = () => {
  const { user } = useAuth();

  // Upload state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Documents state
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // ---- File handling ----
  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadStatus('error');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }
    setSelectedFile(file);
    setUploadStatus('idle');
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    // Simulate progress since fetch doesn't expose upload progress natively
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (user?.id) formData.append('user_id', user.id);

      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      clearInterval(interval);

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setUploadProgress(100);
      setUploadStatus('success');

      const newDoc: UploadedDoc = {
        id: data?.document_id ?? `doc-${Date.now()}`,
        name: selectedFile.name,
        uploadedAt: new Date(),
      };
      setDocuments(prev => [newDoc, ...prev]);
      setActiveDocId(newDoc.id);
      setSelectedFile(null);
    } catch (err) {
      clearInterval(interval);
      console.error('Upload error:', err);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  // ---- Chat ----
  const handleSend = async () => {
    const trimmed = query.trim();
    if (!trimmed || !activeDocId) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setThinking(true);

    try {
      const res = await fetch(QUERY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, document_id: activeDocId }),
      });

      if (!res.ok) throw new Error('Query failed');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data?.answer ?? data?.response ?? 'Sorry, I could not find an answer.',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Query error:', err);
      setMessages(prev => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'assistant', content: 'Unable to get a response. Please try again later.' },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">AI Document Chat</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Upload your study materials and ask questions about them using AI.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5 text-primary" /> Upload Document
              </CardTitle>
              <CardDescription>Drag & drop a PDF or click to browse. Max 50 MB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors',
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                )}
              >
                <FileText className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {selectedFile ? selectedFile.name : 'Drop your PDF here or click to select'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />
              </div>

              {/* Progress */}
              {uploading && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">Uploading… {uploadProgress}%</p>
                </div>
              )}

              {/* Status */}
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="w-4 h-4" /> Document indexed successfully
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" /> Upload failed. Please check the file and try again.
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="glow-button text-white border-0 w-full sm:w-auto"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : 'Upload & Process'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-primary" /> Chat with your Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 h-[500px]">
                {/* Document list */}
                <div className="md:w-56 shrink-0 border border-border rounded-xl p-3 space-y-2 overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Documents</p>
                  {documents.length === 0 && (
                    <p className="text-xs text-muted-foreground">No documents yet.</p>
                  )}
                  {documents.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => { setActiveDocId(doc.id); setMessages([]); }}
                      className={cn(
                        'w-full text-left rounded-lg p-2 text-sm transition-colors',
                        activeDocId === doc.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/50 text-foreground',
                      )}
                    >
                      <p className="truncate font-medium">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">{doc.uploadedAt.toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden">
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 && !thinking && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 py-20">
                        <MessageSquare className="w-8 h-8" />
                        <p className="text-sm">
                          {activeDocId ? 'Ask anything about the uploaded document.' : 'Upload and select a document to start chatting.'}
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {messages.map(msg => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-secondary text-secondary-foreground rounded-bl-md',
                            )}
                          >
                            {msg.role === 'assistant' ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : (
                              msg.content
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {thinking && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-3 text-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                          </div>
                        </motion.div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="border-t border-border p-3 flex gap-2">
                    <Input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="Ask anything about the uploaded document…"
                      disabled={!activeDocId || thinking}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!query.trim() || !activeDocId || thinking}
                      className="shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DocumentAIPage;
