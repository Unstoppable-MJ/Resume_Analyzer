import React from 'react';

export const SkeletonCard = () => (
    <div className="glass-card p-6 flex items-center gap-4 animate-pulse">
        <div className="p-3 bg-white/5 rounded-xl w-12 h-12" />
        <div className="space-y-2 flex-grow">
            <div className="h-3 bg-white/5 rounded w-20" />
            <div className="h-6 bg-white/5 rounded w-12" />
        </div>
    </div>
);

export const SkeletonSection = () => (
    <div className="glass-card p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-48" />
        <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
            <div className="h-64 bg-white/5 rounded-xl w-full" />
        </div>
    </div>
);
