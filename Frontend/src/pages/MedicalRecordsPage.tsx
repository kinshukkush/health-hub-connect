import React, { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { MedicalRecord } from '@/types';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const typeColors: Record<MedicalRecord['type'], string> = {
  lab_report: 'text-[#00C8FF] border-[#00C8FF]',
  prescription: 'text-[#F5A623] border-[#F5A623]',
  imaging: 'text-[#A78BFA] border-[#A78BFA]',
  other: 'text-[#00D4A1] border-[#00D4A1]',
};

const typeLabels: Record<MedicalRecord['type'], string> = {
  lab_report: 'Lab Report',
  prescription: 'Prescription',
  imaging: 'Imaging',
  other: 'Discharge',
};

export const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const { records, isLoading, uploadRecord, deleteRecord } = useMedicalRecords(user?.id || '');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<MedicalRecord['type']>('lab_report');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-['DM_Serif_Display'] text-3xl text-[#F0F4FF]">Medical Records</h1>
            <p className="text-[#8A9BB5] text-sm mt-1">
              Upload and manage your medical documents
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase px-6 py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98] flex items-center gap-2"
            aria-label="Upload record"
          >
            <Upload className="h-4 w-4" />
            Upload Record
          </button>
        </div>

        {/* Upload Zone */}
        <div
          className={cn(
            "border-2 border-dashed bg-[#111827] p-8 text-center transition-all",
            isDragging ? "border-[#00C8FF] bg-[#00C8FF08]" : "border-[#1E293B] hover:border-[#00C8FF44]"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          aria-label="Drop files or click to upload"
        >
          <Upload className="h-8 w-8 text-[#4A5568] mx-auto mb-3" />
          <p className="text-[#4A5568] text-sm">Drop files or click to upload</p>
          <p className="text-[#4A5568] text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
        </div>

        {/* Records Table */}
        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="text-left text-[9px] tracking-[0.25em] uppercase text-[#4A5568] py-3 px-4">Record Name</th>
                  <th className="text-left text-[9px] tracking-[0.25em] uppercase text-[#4A5568] py-3 px-4">Type</th>
                  <th className="text-left text-[9px] tracking-[0.25em] uppercase text-[#4A5568] py-3 px-4">Date</th>
                  <th className="text-left text-[9px] tracking-[0.25em] uppercase text-[#4A5568] py-3 px-4">Size</th>
                  <th className="text-right text-[9px] tracking-[0.25em] uppercase text-[#4A5568] py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={cn(
                      "border-b border-[#1E293B] hover:bg-[#111827] transition-colors",
                      index % 2 === 0 ? "bg-[#0B0F1A]" : "bg-[#111827]"
                    )}
                  >
                    <td className="py-4 px-4">
                      <p className="text-[#F0F4FF] text-sm">{record.title}</p>
                      <p className="text-[#4A5568] text-xs mt-0.5">{record.fileName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border",
                        typeColors[record.type]
                      )}>
                        {typeLabels[record.type]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#8A9BB5] text-sm font-mono">
                      {record.uploadedAt}
                    </td>
                    <td className="py-4 px-4 text-[#8A9BB5] text-sm font-mono">
                      2.4 MB
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        className="text-xs text-[#8A9BB5] hover:text-[#00C8FF] transition-colors"
                        aria-label={`View ${record.title}`}
                      >
                        View
                      </button>
                      <span className="text-[#1E293B] mx-2">|</span>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-xs text-[#8A9BB5] hover:text-[#FF4D6D] transition-colors"
                        aria-label={`Delete ${record.title}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-12 bg-[#111827] border border-[#1E293B]">
              <p className="text-lg text-[#8A9BB5] mb-2">No records yet</p>
              <p className="text-sm text-[#4A5568] mb-4">
                Upload your medical documents to keep them organized
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-sm tracking-[0.1em] uppercase text-[#00C8FF] hover:text-[#33D4FF] transition-colors"
              >
                Upload Your First Record →
              </button>
            </div>
          )
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />
            <div className="fixed right-0 top-0 w-full max-w-md h-screen bg-[#111827] border-l border-[#1E293B] shadow-2xl animate-slide-in-right overflow-y-auto">
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 p-2 text-[#8A9BB5] hover:text-[#F0F4FF] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6">
                <h2 className="font-['DM_Serif_Display'] text-2xl text-[#F0F4FF] mb-6">
                  Upload Medical Record
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      Document Title *
                    </label>
                    <input
                      placeholder="e.g., Blood Test Results - January 2024"
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors placeholder:text-[#4A5568]"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      Document Type
                    </label>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as MedicalRecord['type'])}
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm focus:border-[#00C8FF] focus:outline-none transition-colors"
                    >
                      <option value="lab_report">Lab Report</option>
                      <option value="prescription">Prescription</option>
                      <option value="imaging">Imaging (X-Ray, MRI, etc.)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Add any notes about this document..."
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm resize-none h-20 focus:border-[#00C8FF] focus:outline-none transition-colors placeholder:text-[#4A5568]"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      File *
                    </label>
                    <div 
                      className={cn(
                        "border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
                        selectedFile ? "border-[#00C8FF] bg-[#00C8FF08]" : "border-[#1E293B] hover:border-[#00C8FF44]"
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-2 text-[#00C8FF]">
                          <span className="text-sm">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-[#4A5568] mx-auto mb-2" />
                          <p className="text-sm text-[#4A5568]">Click to select a file</p>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!uploadTitle || !selectedFile || isLoading}
                    className="w-full bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
