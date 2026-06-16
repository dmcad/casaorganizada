'use client'

import * as React from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  onFile?: (file: File) => void
  accept?: string
  className?: string
}

export function FileUpload({ onFile, accept = 'image/*,application/pdf', className }: FileUploadProps) {
  const [dragging, setDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    const f = files?.[0]
    if (!f) return
    setFile(f)
    onFile?.(f)
  }

  if (file) {
    return (
      <div className={cn('flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4', className)}>
        <FileText className="h-8 w-8 shrink-0 text-brand-500" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
          <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <button
          onClick={() => setFile(null)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Remover ficheiro"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
        dragging ? 'border-brand-400 bg-brand-50' : 'border-slate-300 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/50',
        className,
      )}
    >
      <UploadCloud className={cn('h-8 w-8', dragging ? 'text-brand-500' : 'text-slate-400')} />
      <p className="text-sm font-medium text-slate-700">
        Arraste um documento ou <span className="text-brand-600">escolha um ficheiro</span>
      </p>
      <p className="text-xs text-slate-400">PDF, JPG ou PNG — máx. 10 MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
