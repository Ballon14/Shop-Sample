"use client"

import React from "react"

export function BarChart({
    data = [],
    height = 160,
    barColor = "#3b82f6",
    className = "",
}) {
    const max = Math.max(1, ...data.map((d) => d.value))
    const barWidth = 100 / (data.length || 1)
    return (
        <svg
            viewBox={`0 0 100 ${height}`}
            className={`w-full overflow-hidden ${className}`}
            style={{ height }}
            preserveAspectRatio="xMidYMid meet"
        >
            {data.map((d, i) => {
                const h = (d.value / max) * (height - 20)
                const x = i * barWidth
                const y = height - h
                return (
                    <g key={i}>
                        <rect
                            x={x + 3}
                            y={y}
                            width={Math.max(0, barWidth - 6)}
                            height={Math.max(0, h)}
                            rx="3"
                            fill={barColor}
                            opacity="0.9"
                        />
                        <title>{`${d.label}: ${d.value}`}</title>
                    </g>
                )
            })}
        </svg>
    )
}

export function DonutChart({
    value = 0,
    max = 100,
    size = 120,
    color = "#22c55e",
    bg = "#e5e7eb",
    label = "",
    className = "",
}) {
    const radius = (size - 10) / 2
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(1, max === 0 ? 0 : value / max)
    const dash = circumference * progress
    return (
        <svg width={size} height={size} className={`block ${className}`}>
            <g transform={`translate(${size / 2}, ${size / 2})`}>
                <circle
                    r={radius}
                    fill="transparent"
                    stroke={bg}
                    strokeWidth="10"
                />
                <circle
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                />
                <text
                    textAnchor="middle"
                    dy="6"
                    fontSize="16"
                    fill="#111827"
                    fontWeight="600"
                >
                    {Math.round(progress * 100)}%
                </text>
                {label ? (
                    <text
                        textAnchor="middle"
                        dy="24"
                        fontSize="10"
                        fill="#6b7280"
                    >
                        {label}
                    </text>
                ) : null}
            </g>
        </svg>
    )
}
