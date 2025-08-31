"use client"

import React, { useState, useRef } from "react"
import Button from "./Button"

export default function ImageUpload({ onImageUpload, currentImage = null }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(currentImage)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef(null)

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ]
            if (!allowedTypes.includes(file.type)) {
                alert("Please select a valid image file (JPEG, PNG, or WebP)")
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB")
                return
            }

            setSelectedFile(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append("file", selectedFile)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                setUploadProgress(100)
                onImageUpload(result.url)
                setSelectedFile(null)
                // Keep the preview for display
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleRemoveImage = () => {
        setSelectedFile(null)
        setPreview(null)
        onImageUpload(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add("border-blue-500", "bg-blue-50")
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50")
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50")

        const files = e.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            // Simulate file input change
            const event = { target: { files: [file] } }
            handleFileSelect(event)
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    preview
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="space-y-4">
                        <div className="relative inline-block">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Image selected.{" "}
                            {selectedFile && "Click 'Upload Image' to save it."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, WebP up to 5MB
                            </p>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Upload Progress */}
            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {preview ? "Change Image" : "Select Image"}
                </Button>

                {selectedFile && !isUploading && (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleUpload}
                    >
                        Upload Image
                    </Button>
                )}
            </div>
        </div>
    )
}
