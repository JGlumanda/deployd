import { useEffect, useRef } from 'react'
import type { ModalWrapperProps } from '@core/types'

export function DefaultModalWrapper({ onClose, children }: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trap and initial focus
  useEffect(() => {
    const modalElement = modalRef.current
    if (!modalElement) return

    // Use setTimeout to avoid blocking the main thread
    const timeoutId = setTimeout(() => {
      // Get all focusable elements within modal
      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      // Focus the close button initially
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }, 0)

    // Handle Tab key to trap focus
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusable = Array.from(
        modalElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      )

      if (focusable.length === 0) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    modalElement.addEventListener('keydown', handleTab, { passive: false })
    return () => {
      clearTimeout(timeoutId)
      modalElement.removeEventListener('keydown', handleTab)
    }
  }, [])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[1000] overflow-y-auto"
      style={{
        animation: 'modalFadeIn 0.2s ease-out',
        willChange: 'opacity'
      }}
    >
      <div
        ref={modalRef}
        className="bg-card rounded-lg max-w-[800px] w-full max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        style={{
          animation: 'modalSlideUp 0.25s ease-out',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border bg-bg text-text text-xl font-bold cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-accent hover:border-accent hover:text-white"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Modal content */}
        {children}
      </div>
    </div>
  )
}
