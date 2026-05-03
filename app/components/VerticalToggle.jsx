import {useState} from 'react';

export default function VerticalToggle({defaultOn = false, onChange}) {
  const [on, setOn] = useState(defaultOn);
  const [pressing, setPressing] = useState(false);

  const handleToggle = () => {
    setOn((v) => {
      onChange?.(!v);
      return !v;
    });
  };

  return (
    <button
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => {
        setPressing(false);
        handleToggle();
      }}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => {
        setPressing(false);
        handleToggle();
      }}
      aria-pressed={on}
      style={{
        position: 'relative',
        width: 36,
        height: 36,
        borderRadius: 12,
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        padding: 0,
        background: pressing
          ? 'linear-gradient(160deg,#191919 0%,#101010 100%)'
          : 'linear-gradient(160deg,#232323 0%,#141414 100%)',
        transform: pressing ? 'scale(0.95) translateY(1px)' : 'scale(1)',
        transition:
          'transform 0.12s ease,box-shadow 0.3s ease,background 0.12s ease',
        userSelect: 'none',
      }}
    >
      {/* Outer border rim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          border: on
            ? '1px solid rgba(255,255,255,0.22)'
            : '1px solid rgba(255,255,255,0.06)',
          transition: 'border-color 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Inner recessed panel */}
      <div
        style={{
          position: 'absolute',
          inset: 4,
          borderRadius: 8,
          background: on
            ? 'radial-gradient(ellipse at 50% 40%,rgba(255,255,255,0.09) 0%,rgba(8,8,8,0.95) 70%)'
            : 'radial-gradient(ellipse at 50% 30%,rgba(50,50,50,0.25) 0%,rgba(8,8,8,0.98) 70%)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.85)',
          border: '1px solid rgba(0,0,0,0.5)',
          transition: 'background 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Top indicator pill */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 12,
          height: 2,
          borderRadius: 9999,
          background: on
            ? 'linear-gradient(180deg,#ffffff,#e5e5e5)'
            : 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
          boxShadow: on
            ? '0 0 6px rgba(255,255,255,0.95),0 0 12px rgba(255,255,255,0.4)'
            : 'inset 0 1px 2px rgba(0,0,0,0.8)',
          transition: 'background 0.35s ease,box-shadow 0.35s ease',
          pointerEvents: 'none',
        }}
      />

      {/* STATUS TEXT */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.06em',
            lineHeight: 1,
            color: on ? '#ffffff' : '#2e2e2e',
            textShadow: on
              ? '0 0 8px rgba(255,255,255,0.9),0 0 16px rgba(255,255,255,0.4)'
              : 'none',
            transition: 'color 0.35s ease,text-shadow 0.35s ease',
          }}
        >
          {on ? 'ON' : 'OFF'}
        </span>
      </div>

      {/* Surface gloss */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50%',
          height: '20%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />
    </button>
  );
}
