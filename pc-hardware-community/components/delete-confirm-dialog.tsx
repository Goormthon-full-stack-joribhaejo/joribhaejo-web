"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, description }: DeleteConfirmDialogProps) {
  console.log('DeleteConfirmDialog render - isOpen:', isOpen, 'title:', title)
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('Dialog onOpenChange called with:', open)
      if (!open) onClose()
    }}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            console.log('Cancel button clicked')
            onClose()
          }} className="border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200">
            취소
          </Button>
          <Button onClick={() => {
            console.log('Delete button clicked')
            onConfirm()
          }} className="bg-red-600 hover:bg-red-700">
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 