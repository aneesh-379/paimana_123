import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  description = "No matching items found for the current query or filter criteria.",
  actionText = null,
  onAction = null
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
      <div className="p-3 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-sans font-semibold text-sm text-slate-800">{title}</h4>
        <p className="font-sans text-xs text-slate-500">{description}</p>
      </div>
      {actionText && onAction && (
        <Button variant="ghost" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
