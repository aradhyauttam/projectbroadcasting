import { useState, useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { uploadContent } from '@/services/content.service'
import { SUBJECTS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/utils/constants'
import { formatFileSize } from '@/utils/helpers'
import Spinner from '@/components/ui/Spinner'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Max 120 characters'),
  subject: z.string().min(1, 'Please select a subject'),
  description: z.string().max(500, 'Max 500 characters').optional(),
  file: z
    .instanceof(File, { message: 'Please upload a file' })
    .refine((f) => ALLOWED_FILE_TYPES.includes(f.type), 'Only JPG, PNG, and GIF files are allowed')
    .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, `File must be under ${MAX_FILE_SIZE_MB}MB`),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  rotationDuration: z.coerce.number().min(5, 'Minimum 5 seconds').max(3600, 'Maximum 3600 seconds').optional(),
}).refine((d) => {
  if (!d.startTime || !d.endTime) return true
  return new Date(d.endTime) > new Date(d.startTime)
}, { message: 'End time must be after start time', path: ['endTime'] })

export default function UploadContentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rotationDuration: 30 },
  })

  const watchFile = watch('file')

  const handleFile = useCallback((file) => {
    if (!file) return
    setValue('file', file, { shouldValidate: true })
    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [setValue])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onSubmit = async (data) => {
    try {
      await uploadContent(data, user.id, user.name)
      toast.success('Content uploaded successfully! Awaiting principal approval.')
      navigate('/teacher/my-content')
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.')
    }
  }

  // Min datetime for inputs = now
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  return (
    <div className="max-w-3xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Upload Content</h1>
        <p className="text-surface-400 mt-1 text-sm">Fill in the details and upload your educational content.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Title */}
        <div className="card">
          <h2 className="font-display font-bold text-surface-800 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="e.g. Introduction to Algebra"
                className={`input ${errors.title ? 'input-error' : ''}`}
                {...register('title')}
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.title.message}</p>}
            </div>

            <div>
              <label className="label">Subject <span className="text-red-400">*</span></label>
              <select className={`input ${errors.subject ? 'input-error' : ''}`} {...register('subject')}>
                <option value="">Select a subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subject && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.subject.message}</p>}
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                rows={3}
                placeholder="Brief description of the content…"
                className="input resize-none"
                {...register('description')}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <h2 className="font-display font-bold text-surface-800 mb-4">File Upload</h2>

          <Controller
            name="file"
            control={control}
            render={() => (
              <div
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                  ${isDragging ? 'border-brand-400 bg-brand-50' : 'border-surface-200 hover:border-brand-300 hover:bg-surface-50'}
                  ${errors.file ? 'border-red-300 bg-red-50' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {preview ? (
                  <div className="space-y-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-xl object-cover shadow-card"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-surface-700">{watchFile?.name}</p>
                      <p className="text-surface-400">{formatFileSize(watchFile?.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPreview(null); setValue('file', undefined) }}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <div>
                      <p className="font-semibold text-surface-700">
                        {isDragging ? 'Drop to upload!' : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-sm text-surface-400 mt-1">JPG, PNG, GIF • Max {MAX_FILE_SIZE_MB}MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          />
          {errors.file && <p className="mt-2 text-xs text-red-500">⚠ {errors.file.message}</p>}
        </div>

        {/* Scheduling */}
        <div className="card">
          <h2 className="font-display font-bold text-surface-800 mb-4">Scheduling</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Time <span className="text-red-400">*</span></label>
              <input
                type="datetime-local"
                min={nowLocal}
                className={`input ${errors.startTime ? 'input-error' : ''}`}
                {...register('startTime')}
              />
              {errors.startTime && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.startTime.message}</p>}
            </div>

            <div>
              <label className="label">End Time <span className="text-red-400">*</span></label>
              <input
                type="datetime-local"
                min={nowLocal}
                className={`input ${errors.endTime ? 'input-error' : ''}`}
                {...register('endTime')}
              />
              {errors.endTime && <p className="mt-1.5 text-xs text-red-500">⚠ {errors.endTime.message}</p>}
            </div>

            <div>
              <label className="label">Rotation Duration (seconds)</label>
              <input
                type="number"
                min={5}
                max={3600}
                placeholder="30"
                className={`input ${errors.rotationDuration ? 'input-error' : ''}`}
                {...register('rotationDuration')}
              />
              <p className="mt-1 text-xs text-surface-400">How long this content displays before rotating</p>
              {errors.rotationDuration && <p className="mt-1 text-xs text-red-500">⚠ {errors.rotationDuration.message}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 sm:flex-none sm:px-8"
          >
            {isSubmitting ? <><Spinner size="sm" /> Uploading…</> : '📤 Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  )
}