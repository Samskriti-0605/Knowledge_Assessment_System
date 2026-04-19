import React from 'react';

const SkillMap = ({ data, size = 300 }) => {
    // Prevent division by zero if data is empty or invalid
    if (!data || data.length === 0) {
        return <div style={{ padding: '2rem', color: '#64748b', fontSize: '0.875rem' }}>Complete diagnostics to unlock your skill map.</div>;
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    // Helper to calculate point coordinates
    const getPoint = (index, value, max = 100) => {
        const angle = angleStep * index - Math.PI / 2;
        const dist = (value / max) * radius;
        return {
            x: centerX + Math.cos(angle) * dist,
            y: centerY + Math.sin(angle) * dist
        };
    };

    // Generate path for the skill area
    const points = data.map((d, i) => {
        const p = getPoint(i, d.value);
        return `${p.x},${p.y}`;
    }).join(' ');

    // Generate grid lines (web)
    const gridLevels = [0.25, 0.5, 0.75, 1];
    
    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={size} height={size} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                {/* Background Grid */}
                {gridLevels.map((lvl, idx) => (
                    <polygon
                        key={idx}
                        points={data.map((_, i) => {
                            const p = getPoint(i, 100 * lvl);
                            return `${p.x},${p.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="1"
                        opacity="0.5"
                    />
                ))}

                    {/* Axis Lines */}
                    {data.map((d, i) => {
                        const p = getPoint(i, 100);
                        return (
                            <line
                                key={i}
                                x1={centerX}
                                y1={centerY}
                                x2={p.x}
                                y2={p.y}
                                stroke="var(--border)"
                                opacity="0.3"
                            />
                        );
                    })}

                    {/* Skill Area */}
                    <polygon
                        points={points}
                        fill="rgba(128, 128, 0, 0.2)"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {data.map((d, i) => {
                        const p = getPoint(i, d.value);
                        return (
                            <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="var(--primary)"
                                stroke="var(--card-bg)"
                                strokeWidth="2"
                            />
                        );
                    })}

                    {/* Labels */}
                    {data.map((d, i) => {
                        const p = getPoint(i, radius * 1.15); // Adjust label placement
                        const pt = getPoint(i, 100);
                        const labelPos = getPoint(i, 120);
                        return (
                            <text
                                key={i}
                                x={labelPos.x}
                                y={labelPos.y}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="bold"
                                fill="var(--text-main)"
                            >
                                {d.label}
                            </text>
                        );
                    })}
            </svg>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{d.label}: {d.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillMap;
