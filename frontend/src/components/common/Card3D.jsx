import React, { useRef, useState } from 'react';

/**
 * Card3D: A high-performance, tactile 3D card component with dynamic mouse-tracking
 * perspective tilt, specular light reflection, and layered physical depth.
 */
export default function Card3D({
  children,
  className = '',
  style = {},
  tiltDegree = 7,
  glowColor = 'rgba(124, 58, 237, 0.25)',
  interactive = true,
  onClick = null,
  role = undefined,
  tabIndex = undefined,
  ...props
}) {
  const cardRef = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -tiltDegree;
    const rY = ((x - centerX) / centerX) * tiltDegree;

    setRotX(rX);
    setRotY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotX(0);
    setRotY(0);
    setGlare(prev => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={tabIndex !== undefined ? tabIndex : (onClick ? 0 : undefined)}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
      style={{
        transform: interactive
          ? `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) ${isHovered ? 'translateY(-4px) translateZ(8px)' : 'translateZ(0px)'}`
          : undefined,
        transition: 'transform 0.16s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s ease, border-color 0.2s ease',
        ...style
      }}
      className={`group relative preserve-3d overflow-hidden ${
        interactive ? 'cursor-pointer select-none' : ''
      } ${className}`}
      {...props}
    >
      {/* Specular Glare Reflection Layer */}
      {interactive && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.65) 0%, transparent 65%)`,
            opacity: glare.opacity
          }}
        />
      )}

      {/* Ambient Depth Glow on Hover */}
      {interactive && isHovered && (
        <div
          className="pointer-events-none absolute -inset-1 rounded-[inherit] opacity-60 filter blur-md -z-10 transition-opacity duration-300"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Card Content with 3D depth retention */}
      <div className="relative z-10 w-full h-full" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </div>
  );
}
