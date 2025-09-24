import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Progress } from '../components/ui/progress'
import { CheckCircle, Upload, FileText, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

interface KYCDocument {
  id: string
  document_type: string
  status: string
  uploaded_at: string
  notes?: string
}

export function KYCPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<KYCDocument[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const documentTypes = [
    {
      type: 'government_id',
      name: 'Government ID',
      description: 'Passport, Driver\'s License, or National ID',
      required: true
    },
    {
      type: 'proof_of_address',
      name: 'Proof of Address',
      description: 'Utility bill, Bank statement (not older than 3 months)',
      required: true
    },
    {
      type: 'selfie',
      name: 'Selfie with ID',
      description: 'Clear photo of yourself holding your government ID',
      required: true
    },
    {
      type: 'bank_statement',
      name: 'Bank Statement',
      description: 'Recent bank statement for verification',
      required: false
    }
  ]

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!file) return

    setUploading(documentType)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', documentType)

      await axios.post(`${API_URL}/kyc/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Document uploaded successfully!')
      
      const newDocument: KYCDocument = {
        id: Date.now().toString(),
        document_type: documentType,
        status: 'pending',
        uploaded_at: new Date().toISOString()
      }
      setDocuments(prev => [...prev.filter(d => d.document_type !== documentType), newDocument])
      
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(error.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const getDocumentStatus = (documentType: string) => {
    return documents.find(d => d.document_type === documentType)
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      default:
        return <Badge variant="outline">Not Uploaded</Badge>
    }
  }

  const requiredDocuments = documentTypes.filter(d => d.required)
  const uploadedRequired = requiredDocuments.filter(d => getDocumentStatus(d.type))
  const progress = (uploadedRequired.length / requiredDocuments.length) * 100

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">
            Complete your identity verification to start investing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Verification Progress</span>
                  {getStatusIcon(user?.kyc_status)}
                </CardTitle>
                <CardDescription>
                  Current status: {getStatusBadge(user?.kyc_status)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Documents uploaded</span>
                      <span>{uploadedRequired.length} of {requiredDocuments.length}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {user?.kyc_status === 'pending' && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Your documents are under review. This process typically takes 1-3 business days.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {user?.kyc_status === 'approved' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Your identity has been verified! You can now start investing.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {user?.kyc_status === 'rejected' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your verification was rejected. Please re-upload your documents with the feedback provided.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {documentTypes.map((docType) => {
                const document = getDocumentStatus(docType.type)
                const isUploading = uploading === docType.type
                
                return (
                  <Card key={docType.type}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            {getStatusIcon(document?.status)}
                            <span>{docType.name}</span>
                            {docType.required && <span className="text-red-500">*</span>}
                          </CardTitle>
                          <CardDescription>{docType.description}</CardDescription>
                        </div>
                        {getStatusBadge(document?.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {document?.notes && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{document.notes}</AlertDescription>
                          </Alert>
                        )}
                        
                        <div>
                          <Label htmlFor={`file-${docType.type}`}>
                            Upload {docType.name}
                          </Label>
                          <Input
                            id={`file-${docType.type}`}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(docType.type, file)
                              }
                            }}
                            disabled={isUploading || user?.kyc_status === 'approved'}
                            className="mt-1"
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            Accepted formats: JPG, PNG, PDF (max 10MB)
                          </p>
                        </div>
                        
                        {document && (
                          <div className="text-sm text-gray-600">
                            Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                          </div>
                        )}
                        
                        {isUploading && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Verification Requirements</CardTitle>
                <CardDescription>What you need to get verified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Government-issued photo ID</li>
                    <li>• Proof of current address</li>
                    <li>• Clear selfie with your ID</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Photo Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ensure documents are clearly visible</li>
                    <li>• Good lighting, no shadows</li>
                    <li>• All corners of document visible</li>
                    <li>• No glare or reflections</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Processing Time</h4>
                  <p className="text-sm text-gray-600">
                    Verification typically takes 1-3 business days. You'll receive an email notification once complete.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
