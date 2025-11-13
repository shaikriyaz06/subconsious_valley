"use client";

import * as React from "react";
import { X } from "lucide-react";

const ToastProvider = ({ children }) => children;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed top-4 right-4 z-[9999] flex max-h-screen flex-col gap-2 max-w-[420px] ${className}`}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const Toast = React.forwardRef(({ className, variant, open, onOpenChange, ...props }, ref) => {
  const baseClasses = "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all duration-300 ease-in-out";
  const variantClasses = variant === "destructive" 
    ? "border-red-200 bg-red-50 text-red-800" 
    : "border-teal-200 bg-teal-50 text-teal-800";
  
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'} ${className}`}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-gray-100 ${className}`}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={`absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-600 ${className}`}
    onClick={onClick}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm font-semibold ${className}`}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm opacity-90 ${className}`}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};