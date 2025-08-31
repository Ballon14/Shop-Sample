import React from "react"

const Skeleton = ({ className = "", variant = "default" }) => {
    const variants = {
        default: "animate-pulse bg-gray-200 rounded",
        shimmer:
            "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        pulse: "animate-pulse bg-gray-200 rounded-full",
    }

    return <div className={`${variants[variant]} ${className}`}></div>
}

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Skeleton className="w-full h-full" variant="shimmer" />
        </div>
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-4 h-4 rounded" />
                ))}
                <Skeleton className="w-12 h-4 rounded ml-1" />
            </div>
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <div className="flex gap-2">
                <Skeleton className="h-8 flex-1 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
            </div>
        </div>
    </div>
)

export const FilterSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-20 rounded" />
                <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
)

export default Skeleton
