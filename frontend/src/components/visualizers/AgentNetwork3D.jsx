import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, Sparkles, Layers, ShieldCheck, Database, Cpu, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Badge from '../common/Badge';

export default function AgentNetwork3D({
  activeAgentId = 'compliance',
  onSelectAgent,
  confidence = 0.98
}) {
  const canvasRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Rotation angles (radians)
  const rotationRef = useRef({ x: 0.35, y: 0.6 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // 5 Autonomous Agent Nodes in 3D coordinates (x, y, z)
  const nodes = [
    {
      id: 'orchestrator',
      name: 'Chief Orchestrator',
      role: 'Master Coordinator',
      model: 'NVIDIA NIM Llama-3.2',
      color: '#7C3AED',
      glowColor: 'rgba(124, 58, 237, 0.8)',
      x: 0,
      y: -110,
      z: 0,
      radius: 26,
      icon: Cpu,
      badge: 'COORDINATOR'
    },
    {
      id: 'quantitative',
      name: 'Quantitative Risk',
      role: 'ML Overrun Engine',
      model: 'CatBoost v1.2',
      color: '#0284C7',
      glowColor: 'rgba(2, 132, 199, 0.8)',
      x: 130,
      y: -30,
      z: 60,
      radius: 22,
      icon: Database,
      badge: 'ML PREDICTOR'
    },
    {
      id: 'compliance',
      name: 'Compliance Officer',
      role: 'GCC Clause 44.1 RAG',
      model: 'pgvector Hybrid',
      color: '#D97706',
      glowColor: 'rgba(217, 119, 6, 0.8)',
      x: 90,
      y: 90,
      z: -70,
      radius: 24,
      icon: ShieldCheck,
      badge: 'CONTRACT AUDIT'
    },
    {
      id: 'bottleneck',
      name: 'Bottleneck Diagnoser',
      role: 'Right-of-Way Stalls',
      model: 'TreeSHAP Engine',
      color: '#BE123C',
      glowColor: 'rgba(190, 18, 60, 0.8)',
      x: -90,
      y: 90,
      z: -70,
      radius: 22,
      icon: AlertTriangle,
      badge: 'DIAGNOSTIC'
    },
    {
      id: 'mitigation',
      name: 'Mitigation Expert',
      role: '14-Day Notice Dispatch',
      model: 'NVIDIA NIM Schema',
      color: '#059669',
      glowColor: 'rgba(5, 150, 105, 0.8)',
      x: -130,
      y: -30,
      z: 60,
      radius: 24,
      icon: CheckCircle,
      badge: 'HUMAN-IN-LOOP'
    }
  ];

  // Pipeline connections between nodes (from -> to)
  const connections = [
    { from: 'orchestrator', to: 'quantitative', flowSpeed: 0.02 },
    { from: 'orchestrator', to: 'compliance', flowSpeed: 0.018 },
    { from: 'orchestrator', to: 'bottleneck', flowSpeed: 0.022 },
    { from: 'orchestrator', to: 'mitigation', flowSpeed: 0.015 },
    { from: 'quantitative', to: 'compliance', flowSpeed: 0.016 },
    { from: 'compliance', to: 'bottleneck', flowSpeed: 0.019 },
    { from: 'bottleneck', to: 'mitigation', flowSpeed: 0.025 }
  ];

  // Animation packet particles along connections
  const packetsRef = useRef(
    connections.map(() => ({
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.008
    }))
  );

  // Background 3D grid particles
  const particlesRef = useRef(
    Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 400,
      y: 130 + Math.random() * 40,
      z: (Math.random() - 0.5) * 400,
      radius: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.4
    }))
  );

  // Project 3D point to 2D screen coordinates
  const project3D = (x, y, z, rotX, rotY, cx, cy, scale) => {
    // Rotate Y
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotate X
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    // Camera perspective projection
    const distance = 480;
    const fov = distance / (distance + z2);

    return {
      screenX: cx + x1 * fov * scale,
      screenY: cy + y2 * fov * scale,
      scale: fov * scale,
      depth: z2
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      // Auto-rotation if enabled
      if (isRotating && !isDraggingRef.current) {
        rotationRef.current.y += 0.006;
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // 1. Draw 3D Isometric Grid Floor
      ctx.save();
      const gridSize = 320;
      const gridSteps = 8;
      const step = gridSize / gridSteps;

      ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
      ctx.lineWidth = 1;

      for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
        const p1 = project3D(i, 140, -gridSize / 2, rotX, rotY, cx, cy, zoom);
        const p2 = project3D(i, 140, gridSize / 2, rotX, rotY, cx, cy, zoom);
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.stroke();

        const p3 = project3D(-gridSize / 2, 140, i, rotX, rotY, cx, cy, zoom);
        const p4 = project3D(gridSize / 2, 140, i, rotX, rotY, cx, cy, zoom);
        ctx.beginPath();
        ctx.moveTo(p3.screenX, p3.screenY);
        ctx.lineTo(p4.screenX, p4.screenY);
        ctx.stroke();
      }

      // Draw grid particles
      particlesRef.current.forEach(p => {
        const proj = project3D(p.x, p.y, p.z, rotX, rotY, cx, cy, zoom);
        ctx.fillStyle = `rgba(147, 51, 234, ${p.alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, p.radius * proj.scale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Project all nodes
      const projectedNodes = nodes.map(node => ({
        ...node,
        ...project3D(node.x, node.y, node.z, rotX, rotY, cx, cy, zoom)
      }));

      // 2. Draw 3D Pipeline Connection Lines & Traveling Photons
      connections.forEach((conn, idx) => {
        const source = projectedNodes.find(n => n.id === conn.from);
        const target = projectedNodes.find(n => n.id === conn.to);
        if (!source || !target) return;

        // Gradient line between source and target
        const grad = ctx.createLinearGradient(source.screenX, source.screenY, target.screenX, target.screenY);
        grad.addColorStop(0, source.glowColor);
        grad.addColorStop(1, target.glowColor);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8 * Math.min(source.scale, target.scale);
        ctx.beginPath();
        ctx.moveTo(source.screenX, source.screenY);
        ctx.lineTo(target.screenX, target.screenY);
        ctx.stroke();

        // Update & draw traveling 3D photon packet
        const packet = packetsRef.current[idx];
        packet.progress = (packet.progress + packet.speed) % 1;

        const packetX = source.screenX + (target.screenX - source.screenX) * packet.progress;
        const packetY = source.screenY + (target.screenY - source.screenY) * packet.progress;
        const packetScale = source.scale + (target.scale - source.scale) * packet.progress;

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = target.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 3.5 * packetScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Sort nodes by depth (z-index) so foreground nodes render over background
      const sortedNodes = [...projectedNodes].sort((a, b) => b.depth - a.depth);

      // 4. Draw 3D Spherical Nodes
      sortedNodes.forEach(node => {
        const isSelected = activeAgentId === node.id;
        const isHovered = hoveredNode === node.id;
        const nodeRadius = node.radius * node.scale * (isSelected ? 1.25 : isHovered ? 1.15 : 1);

        // Ambient glow halo
        ctx.save();
        const glowGrad = ctx.createRadialGradient(
          node.screenX, node.screenY, nodeRadius * 0.3,
          node.screenX, node.screenY, nodeRadius * 2.2
        );
        glowGrad.addColorStop(0, node.glowColor);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, nodeRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // 3D Orbital ring when selected
        if (isSelected) {
          ctx.strokeStyle = '#7C3AED';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(node.screenX, node.screenY, nodeRadius * 1.6, nodeRadius * 0.8, Math.PI / 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Spherical shading gradient
        const sphereGrad = ctx.createRadialGradient(
          node.screenX - nodeRadius * 0.3, node.screenY - nodeRadius * 0.3, nodeRadius * 0.1,
          node.screenX, node.screenY, nodeRadius
        );
        sphereGrad.addColorStop(0, '#FFFFFF');
        sphereGrad.addColorStop(0.35, node.color);
        sphereGrad.addColorStop(1, '#0F172A');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // White specular rim highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3D Node Label Card floating above
        ctx.font = `bold ${Math.max(10, Math.round(11 * node.scale))}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(node.name, node.screenX, node.screenY + nodeRadius + 14 * node.scale);

        ctx.font = `${Math.max(8, Math.round(9 * node.scale))}px monospace`;
        ctx.fillStyle = '#64748B';
        ctx.fillText(node.role, node.screenX, node.screenY + nodeRadius + 26 * node.scale);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, zoom, activeAgentId, hoveredNode]);

  // Mouse interaction: Drag to rotate
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check hit testing for node hover
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rotX = rotationRef.current.x;
    const rotY = rotationRef.current.y;

    let found = null;
    nodes.forEach(node => {
      const proj = project3D(node.x, node.y, node.z, rotX, rotY, cx, cy, zoom);
      const dist = Math.hypot(mouseX - proj.screenX, mouseY - proj.screenY);
      if (dist <= node.radius * proj.scale * 1.3) {
        found = node.id;
      }
    });
    setHoveredNode(found);
    canvas.style.cursor = found ? 'pointer' : isDraggingRef.current ? 'grabbing' : 'grab';

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    rotationRef.current.y += dx * 0.008;
    rotationRef.current.x = Math.max(-0.8, Math.min(0.8, rotationRef.current.x - dy * 0.008));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e) => {
    if (hoveredNode && onSelectAgent) {
      onSelectAgent(hoveredNode);
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-purple-950/90 to-slate-950 border border-purple-800/40 p-5 shadow-2xl overflow-hidden text-white select-none">
      {/* Background ambient mesh grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Controls Overlay */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-purple-800/30">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#C084FC]" />
            <h4 className="font-sans font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              3D Spatial Multi-Agent Neural Topology
            </h4>
            <Badge variant="purple" className="text-[9px] bg-purple-900/60 border-purple-500/40 text-purple-200">
              Rotatable 360°
            </Badge>
          </div>
          <p className="text-[11px] text-purple-200/70 font-mono">
            Interactive isometric coordinate space. <strong className="text-purple-300">Click &amp; drag to rotate canvas</strong> · Click nodes to inspect.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
              isRotating
                ? 'bg-purple-800/50 border-purple-500/50 text-purple-200'
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}
            title="Toggle Auto-Rotation"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[10px]">{isRotating ? 'Pause' : 'Auto-Spin'}</span>
          </button>

          <button
            type="button"
            onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
            className="p-1.5 rounded-lg border border-purple-800/50 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setZoom(z => Math.min(1.4, z + 0.15))}
            className="p-1.5 rounded-lg border border-purple-800/50 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              rotationRef.current = { x: 0.35, y: 0.6 };
              setZoom(1);
            }}
            className="p-1.5 rounded-lg border border-purple-800/50 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 transition-colors"
            title="Reset Perspective"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative flex justify-center items-center h-[340px] w-full my-2">
        <canvas
          ref={canvasRef}
          width={760}
          height={340}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          className="w-full h-full block touch-none"
        />

        {/* Hovered Node Quick HUD Badge */}
        {hoveredNode && (
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-purple-500/60 rounded-xl px-3 py-2 text-xs font-mono pointer-events-none shadow-xl backdrop-blur-md animate-fadeIn">
            <span className="text-[10px] text-purple-400 font-bold block uppercase">
              Selected 3D Vector
            </span>
            <strong className="text-white text-xs block">
              {nodes.find(n => n.id === hoveredNode)?.name}
            </strong>
            <span className="text-[10px] text-slate-400">Click to expand audit findings</span>
          </div>
        )}
      </div>

      {/* Bottom Node Quick Selector Carousel */}
      <div className="relative z-20 pt-2 border-t border-purple-800/30 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-purple-300/80 font-bold text-[10px] uppercase shrink-0">Nodes:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {nodes.map(n => (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelectAgent && onSelectAgent(n.id)}
              className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
                activeAgentId === n.id
                  ? 'bg-purple-600 border-purple-400 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'bg-purple-950/50 border-purple-800/60 text-purple-200/80 hover:bg-purple-900/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.color }} />
              <span>{n.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
