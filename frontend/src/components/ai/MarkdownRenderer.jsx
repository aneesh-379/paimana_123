import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export default function MarkdownRenderer({ content = '', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  // Render markdown lines into formatted React elements
  const lines = content.split('\n');

  const renderFormattedText = (text) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-slate-900 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`relative group font-sans text-xs text-slate-700 leading-relaxed ${className}`}>
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-mono shadow-xs"
        title="Copy response"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      <div className="space-y-2.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Heading 3: ###
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-sans font-bold text-sm text-purple-900 pt-2 pb-0.5 border-b border-slate-200">
                {renderFormattedText(trimmed.slice(4))}
              </h4>
            );
          }

          // Heading 4: ####
          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={idx} className="font-sans font-semibold text-xs text-slate-800 uppercase tracking-wider pt-1.5">
                {renderFormattedText(trimmed.slice(5))}
              </h5>
            );
          }

          // Heading 2: ##
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-sans font-bold text-base text-slate-900 pt-3 pb-1 border-b border-slate-200">
                {renderFormattedText(trimmed.slice(3))}
              </h3>
            );
          }

          // Bullet points: - or • or *
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-purple-600 font-bold shrink-0 mt-0.5">•</span>
                <p className="text-slate-700 leading-relaxed">
                  {renderFormattedText(trimmed.slice(2))}
                </p>
              </div>
            );
          }

          // Numbered lists: e.g. 1. 2.
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono font-bold text-[11px] text-purple-700 shrink-0">
                  {numMatch[1]}.
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {renderFormattedText(numMatch[2])}
                </p>
              </div>
            );
          }

          // Blockquote: >
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="p-3 my-1 rounded-lg bg-purple-50/60 border-l-2 border-l-purple-600 text-slate-800 italic">
                {renderFormattedText(trimmed.slice(2))}
              </blockquote>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {renderFormattedText(trimmed)}
            </p>
          );
        })}
      </div>
    </div>
  );
}
