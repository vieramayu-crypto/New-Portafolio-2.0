import React from 'react';
import { CollaborationCase } from '../types';

interface CollaborationCardProps {
  collaboration: CollaborationCase;
}

export const CollaborationCard: React.FC<CollaborationCardProps> = ({ collaboration }) => {
  return (
    <div className="group space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden border border-[#1a1918]/10 bg-[#eeebe3]">
        {collaboration.hasMedia && collaboration.coverImage ? (
          <img
            src={collaboration.coverImage}
            alt={collaboration.brandName}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#f5f3ed,#e8e5dc)] px-6 text-center">
            <span className="font-serif text-3xl text-[#1a1918]/25">MV</span>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#5a5854]">
              Material en preparación
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-sans uppercase tracking-widest text-[#5a5854]">
          <span>{collaboration.category}</span>
          {collaboration.location && <span>{collaboration.location}</span>}
        </div>
        <h3 className="font-serif text-xl text-[#1a1918]">{collaboration.brandName}</h3>
        <p className="text-sm text-[#5a5854] leading-relaxed">{collaboration.summary}</p>
      </div>
    </div>
  );
};
