import React, { useRef, useEffect, useState } from 'react';
import { Globe, RotateCw, Play, Pause, Sparkles, Filter, MapPin, Eye } from 'lucide-react';
import Badge from '../common/Badge';

export default function SpatialRadar3D({
  projects = [],
  onSelectProject = null
}) {
  const canvasRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const rotationRef = useRef({ x: 0.25, y: 0.5 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Default demo infrastructure project nodes mapped onto a 3D sphere (lat, lon, risk, name, code)
  const sphereNodes = [
    { code: 'PAIM-619054', name: 'Greenfield Expressway IV', lat: 28.6, lon: 77.2, risk: 'HIGH', cost: 184.2, delay: 16.5, color: '#EF4444' },
    { code: 'PAIM-1042', name: 'Dedicated Freight Corridor', lat: 26.8, lon: 80.9, risk: 'HIGH', cost: 320.5, delay: 24.0, color: '#EF4444' },
    { code: 'PAIM-2209', name: 'Mumbai-Ahmedabad High Speed', lat: 19.0, lon: 72.8, risk: 'MEDIUM', cost: 95.0, delay: 8.2, color: '#F59E0B' },
    { code: 'PAIM-3411', name: 'Chenab Bridge Rail Link', lat: 33.1, lon: 74.9, risk: 'HIGH', cost: 210.0, delay: 18.0, color: '#EF4444' },
    { code: 'PAIM-4502', name: 'Bengaluru Metro Phase 2', lat: 12.9, lon: 77.5, risk: 'LOW', cost: 12.4, delay: 2.1, color: '#10B981' },
    { code: 'PAIM-5012', name: 'Kolkata East-West Metro', lat: 22.5, lon: 88.3, risk: 'HIGH', cost: 145.0, delay: 14.5, color: '#EF4444' },
    { code: 'PAIM-6701', name: 'Zojila Tunnel Bypass', lat: 34.2, lon: 75.5, risk: 'MEDIUM', cost: 78.0, delay: 9.0, color: '#F59E0B' },
    { code: 'PAIM-7890', name: 'Vizag Port Deepening', lat: 17.6, lon: 83.2, risk: 'LOW', cost: 5.0, delay: 1.0, color: '#10B981' },
    { code: 'PAIM-8921', name: 'Guwahati Water Supply Grid', lat: 26.1, lon: 91.7, risk: 'MEDIUM', cost: 62.0, delay: 7.5, color: '#F59E0B' },
    { code: 'PAIM-9140', name: 'Kochi Smart Port Logistics', lat: 9.9, lon: 76.2, risk: 'LOW', cost: 8.5, delay: 0.5, color: '#10B981' }
  ];

  // Convert lat/lon on sphere to 3D (x, y, z)
  const sphereRadius = 110;
  const projectPoints3D = sphereNodes.map(node => {
    const phi = (90 - node.lat) * (Math.PI / 180);
    const theta = (node.lon + 180) * (Math.PI / 180);
    return {
      ...node,
      x: -(sphereRadius * Math.sin(phi) * Math.cos(theta)),
      z: sphereRadius * Math.sin(phi) * Math.sin(theta),
      y: -(sphereRadius * Math.cos(phi))
    };
  });

  // Project 3D point to 2D screen with rotation
  const project3D = (x, y, z, rotX, rotY, cx, cy) => {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    const dist = 360;
    const fov = dist / (dist + z2);

    return {
      screenX: cx + x1 * fov,
      screenY: cy + y2 * fov,
      fov,
      depth: z2
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      if (isRotating && !isDraggingRef.current) {
        rotationRef.current.y += 0.007;
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // 1. Draw 3D Wireframe Sphere Rings (Latitude & Longitude)
      ctx.save();
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
      ctx.lineWidth = 1;

      // Latitude rings
      [-60, -30, 0, 30, 60].forEach(latAngle => {
        ctx.beginPath();
        const r = sphereRadius * Math.cos(latAngle * (Math.PI / 180));
        const y = sphereRadius * Math.sin(latAngle * (Math.PI / 180));
        for (let i = 0; i <= 360; i += 15) {
          const theta = i * (Math.PI / 180);
          const px = r * Math.cos(theta);
          const pz = r * Math.sin(theta);
          const proj = project3D(px, y, pz, rotX, rotY, cx, cy);
          if (i === 0) ctx.moveTo(proj.screenX, proj.screenY);
          else ctx.lineTo(proj.screenX, proj.screenY);
        }
        ctx.stroke();
      });

      // Rotating Equator Highlight
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 360; i += 10) {
        const theta = i * (Math.PI / 180);
        const px = sphereRadius * Math.cos(theta);
        const pz = sphereRadius * Math.sin(theta);
        const proj = project3D(px, 0, pz, rotX, rotY, cx, cy);
        if (i === 0) ctx.moveTo(proj.screenX, proj.screenY);
        else ctx.lineTo(proj.screenX, proj.screenY);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Project and sort nodes by 3D depth
      const projected = projectPoints3D
        .filter(n => selectedFilter === 'ALL' || n.risk === selectedFilter)
        .map(node => ({
          ...node,
          ...project3D(node.x, node.y, node.z, rotX, rotY, cx, cy)
        }))
        .sort((a, b) => b.depth - a.depth);

      // 3. Render 3D Project Nodes
      projected.forEach(node => {
        // Opacity drops if node is around the back of sphere
        const isFacing = node.depth < 40;
        const alpha = isFacing ? 1 : 0.35;
        const isHovered = hoveredPoint?.code === node.code;
        const r = (isHovered ? 8 : 5) * node.fov;

        ctx.save();
        // Glow beacon
        if (isFacing) {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = isHovered ? 18 : 10;
        }

        ctx.fillStyle = node.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, r, 0, Math.PI * 2);
        ctx.fill();

        // White core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, r * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Floating label for high risk nodes
        if (isFacing && (node.risk === 'HIGH' || isHovered)) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = isHovered ? '#7C3AED' : '#334155';
          ctx.textAlign = 'center';
          ctx.fillText(node.code, node.screenX, node.screenY - r - 4);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, selectedFilter, hoveredPoint]);

  // Mouse drag handlers for rotating 3D sphere
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rotX = rotationRef.current.x;
    const rotY = rotationRef.current.y;

    // Check hit test
    let found = null;
    projectPoints3D.forEach(node => {
      const proj = project3D(node.x, node.y, node.z, rotX, rotY, cx, cy);
      if (proj.depth < 40) {
        const dist = Math.hypot(mouseX - proj.screenX, mouseY - proj.screenY);
        if (dist < 12) {
          found = node;
        }
      }
    });

    setHoveredPoint(found);
    canvas.style.cursor = found ? 'pointer' : isDraggingRef.current ? 'grabbing' : 'grab';

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    rotationRef.current.y += dx * 0.009;
    rotationRef.current.x = Math.max(-1, Math.min(1, rotationRef.current.x - dy * 0.009));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-purple-950/90 border border-slate-800 p-5 shadow-xl text-white select-none overflow-hidden">
      {/* Background ambient spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-xs">
            <Globe className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-sans font-bold text-xs text-white tracking-tight flex items-center gap-1.5">
              3D Spatial Geographic Infrastructure Sphere
            </h4>
            <span className="text-[10px] text-purple-300/70 font-mono">
              Click &amp; drag sphere to inspect national risk coordinates
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {['ALL', 'HIGH', 'MEDIUM'].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFilter(f)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                selectedFilter === f
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'All (10)' : f === 'HIGH' ? 'Critical (5)' : 'Medium (3)'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white ml-1"
            title="Toggle Spin"
          >
            {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 3D Sphere Canvas Viewport */}
      <div className="relative flex justify-center items-center h-[260px] w-full">
        <canvas
          ref={canvasRef}
          width={480}
          height={260}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block touch-none"
        />

        {/* Hovered Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-slate-900/95 border border-purple-500/50 rounded-xl p-3 text-xs font-mono shadow-2xl backdrop-blur-md animate-fadeIn max-w-[200px]">
            <span className="font-bold text-purple-400 block">{hoveredPoint.code}</span>
            <span className="text-white font-medium text-[11px] block truncate">{hoveredPoint.name}</span>
            <div className="pt-1 mt-1 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
              <span>Overrun:</span>
              <strong className="text-rose-400">+₹{hoveredPoint.cost} Cr</strong>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Delay:</span>
              <strong className="text-amber-400">+{hoveredPoint.delay} Mo</strong>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Legend */}
      <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444]" /> Critical Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" /> Medium Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" /> On Schedule
        </span>
      </div>
    </div>
  );
}
