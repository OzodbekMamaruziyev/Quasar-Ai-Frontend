export function SkeletonCard() {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40">
            {/* Preview area */}
            <div className="aspect-[4/3] w-full skeleton" />
            {/* Body */}
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-5 w-16 rounded-full" />
            </div>
        </div>
    );
}

export function SkeletonStatCard() {
    return (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 sm:p-6">
            <div className="flex items-start justify-between">
                <div className="skeleton h-11 w-11 rounded-xl" />
                <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <div className="skeleton h-8 w-16" />
                <div className="skeleton h-3 w-24" />
            </div>
        </div>
    );
}

export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 px-4 py-3">
            <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-2/3" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
        </div>
    );
}
