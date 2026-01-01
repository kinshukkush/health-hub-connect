import React, { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { MedicalRecord } from '@/types';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Plus,
  Calendar,
  User,
  FlaskConical,
  Pill,
  Image,
  File
} from 'lucide-react';
import { toast } from 'sonner';

const typeIcons = {
  lab_report: FlaskConical,
  prescription: Pill,
  imaging: Image,
  other: File,
};

const typeLabels = {
  lab_report: 'Lab Report',
  prescription: 'Prescription',
  imaging: 'Imaging',
  other: 'Other',
};

export const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const { records, isLoading, uploadRecord, deleteRecord } = useMedicalRecords(user?.id || '');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<MedicalRecord['type']>('lab_report');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !uploadTitle || !selectedFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await uploadRecord({
      patientId: user.id,
      title: uploadTitle,
      type: uploadType,
      description: uploadDescription,
      fileUrl: URL.createObjectURL(selectedFile),
      fileName: selectedFile.name,
    });

    if (success) {
      toast.success('Record uploaded successfully');
      setShowUploadModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteRecord(id);
    if (success) {
      toast.success('Record deleted');
    }
  };

  const resetForm = () => {
    setUploadTitle('');
    setUploadType('lab_report');
    setUploadDescription('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Medical Records</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your medical documents
            </p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Record
          </Button>
        </div>

        {/* Records Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const Icon = typeIcons[record.type];
            return (
              <Card key={record.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{record.title}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {typeLabels[record.type]}
                      </Badge>
                    </div>
                  </div>

                  {record.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {record.description}
                    </p>
                  )}

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{record.uploadedAt}</span>
                    </div>
                    {record.doctorName && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{record.doctorName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{record.fileName}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {!isLoading && records.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No records yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your medical documents to keep them organized
            </p>
            <Button onClick={() => setShowUploadModal(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Your First Record
            </Button>
          </div>
        )}

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
              <DialogDescription>
                Add a new medical document to your records
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Document Title *</Label>
                <Input
                  placeholder="e.g., Blood Test Results - January 2024"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={uploadType} onValueChange={(v) => setUploadType(v as MedicalRecord['type'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab_report">Lab Report</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="imaging">Imaging (X-Ray, MRI, etc.)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  placeholder="Add any notes about this document..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>File *</Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to select a file
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleUpload}
                disabled={!uploadTitle || !selectedFile || isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};
