import React, { useCallback, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDataStore } from '@/store/dataStore'
import { useAuthStore } from '@/store/authStore'
import { Upload, File, Trash2, Download } from 'lucide-react'

interface DocumentManagerProps {
  regionId: string
}

export function DocumentManager({ regionId }: DocumentManagerProps) {
  const { documents, uploadDocument } = useDataStore()
  const { user } = useAuthStore()
  const [uploading, setUploading] = useState(false)

  const regionDocuments = documents.filter(doc => doc.region_id === regionId)

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (user) {
          // 클라우드 업로드
          await uploadDocument(regionId, file)
        } else {
          // 로컬 저장 (시뮬레이션)
          const mockDoc = {
            id: Date.now().toString(),
            region_id: regionId,
            name: file.name,
            file_size: file.size,
            file_type: file.type,
            upload_date: new Date().toISOString(),
            user_id: 'local'
          }
          // 로컬 스토리지에 문서 정보만 저장
          const existingDocs = JSON.parse(localStorage.getItem('local-documents') || '[]')
          existingDocs.push(mockDoc)
          localStorage.setItem('local-documents', JSON.stringify(existingDocs))
        }
      }
      alert('파일이 업로드되었습니다.')
    } catch (error) {
      alert('파일 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }, [regionId, uploadDocument, user])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }, [handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>파일 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              파일을 여기에 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-sm text-gray-500">
              PDF, 이미지, 문서 파일 등을 업로드할 수 있습니다
            </p>
            {uploading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">업로드 중...</p>
              </div>
            )}
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </CardContent>
      </Card>

      {/* 업로드된 문서 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>업로드된 문서</CardTitle>
        </CardHeader>
        <CardContent>
          {regionDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>업로드된 문서가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {regionDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(doc.file_size)} • {formatDate(doc.upload_date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user && doc.file_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Supabase Storage에서 파일 다운로드 URL 생성
                          alert('파일 다운로드 기능은 실제 Supabase 설정 후 사용 가능합니다.')
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('이 문서를 삭제하시겠습니까?')) {
                          // 문서 삭제 로직
                          alert('문서 삭제 기능 구현 필요')
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 안내 메시지 */}
      {!user && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800">
              <strong>💡 안내:</strong> 로컬 모드에서는 문서 정보만 저장됩니다. 
              실제 파일 저장을 위해서는 클라우드 연동을 사용하세요.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}