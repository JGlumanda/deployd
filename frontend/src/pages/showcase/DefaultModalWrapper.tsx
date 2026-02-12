import { useEffect, useRef } from 'react'
import type { ModalWrapperProps } from '@core/types'

export function DefaultModalWrapper({ onClose, children }: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trap and initial focus
  useEffect(() => {
    const modalElement = modalRef.current
    if (!modalElement) return

    // Get all focusable elements within modal
    const getFocusableElements = () => {
      return modalElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    }

    // Focus the close button initially
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle Tab key to trap focus
    const handleTab = (e: KeyboardEvent) => {
      const focusable = Array.from(getFocusableElements())
      if (focusable.length === 0) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (e.key === 'Tab') {
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
    }

    modalElement.addEventListener('keydown', handleTab)
    return () => modalElement.removeEventListener('keydown', handleTab)
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000,
        overflowY: 'auto'
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '1.25rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)'
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg)'
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.color = 'var(--color-text)'
          }}
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
