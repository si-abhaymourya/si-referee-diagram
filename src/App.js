import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

// ─── Card Node ────────────────────────────────────────────────────────────────

function CardNode({ data }) {
  const hs = { background: data.border, width: 8, height: 8, border: 'none' };
  return (
    <div style={{
      background: data.bg,
      border: `2px solid ${data.border}`,
      borderRadius: 14,
      padding: '14px 18px',
      minWidth: 210,
      maxWidth: 240,
      fontFamily: 'Inter, Segoe UI, sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <Handle type="target" position={Position.Left}  style={hs} />
      <Handle type="source" position={Position.Right} style={hs} />
      <Handle type="target" position={Position.Top}   style={hs} />
      <Handle type="source" position={Position.Bottom} style={hs} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
        <span style={{ fontSize: 22 }}>{data.icon}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: data.titleColor, lineHeight: 1.2 }}>
          {data.title}
        </span>
      </div>

      <div style={{ borderTop: `1px solid ${data.border}`, marginBottom: 9, opacity: 0.35 }} />

      {data.lines.map((line, i) => (
        <div key={i} style={{ fontSize: 11, color: data.lineColor, marginBottom: 4, lineHeight: 1.5 }}>
          {line}
        </div>
      ))}

      {data.badge && (
        <div style={{
          marginTop: 10,
          display: 'inline-block',
          background: data.border + '22',
          border: `1px solid ${data.border}`,
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: 10,
          color: data.titleColor,
          fontWeight: 600,
        }}>
          {data.badge}
        </div>
      )}
    </div>
  );
}

// ─── Section Label Node ───────────────────────────────────────────────────────

function SectionLabel({ data }) {
  return (
    <div style={{
      fontFamily: 'Inter, Segoe UI, sans-serif',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1.2,
      color: data.color,
      textTransform: 'uppercase',
      opacity: 0.6,
      pointerEvents: 'none',
    }}>
      {data.text}
    </div>
  );
}

const nodeTypes = { card: CardNode, label: SectionLabel };

// ─── Layout ───────────────────────────────────────────────────────────────────
//
//   ┌────────────────────────────────────────────────────────────┐
//   │  SETUP (one-time)                                          │
//   │  [SI Referee Repo] ──sync.sh──▶ [Target Repo]             │
//   └────────────────────────────────────────────────────────────┘
//                                           │ opens in editor
//                                           ▼
//   ┌────────────────────────────────────────────────────────────────────┐
//   │  SESSION                                                           │
//   │  [Codemod Registry] ──clone──▶ [/tmp Clone] ──codemods──▶ [AI] ◀──▶ [Endpoint] │
//   └────────────────────────────────────────────────────────────────────────────────┘

const initialNodes = [

  // ── Section labels ────────────────────────────────────────────────────────

  {
    id: 'lbl-setup',
    type: 'label',
    position: { x: 4, y: 32 },
    data: { text: '① One-time Setup', color: '#a5d6a7' },
    draggable: false,
    selectable: false,
  },
  {
    id: 'lbl-session',
    type: 'label',
    position: { x: 4, y: 312 },
    data: { text: '② Each Session', color: '#ce93d8' },
    draggable: false,
    selectable: false,
  },

  // ── Row 1: Setup ──────────────────────────────────────────────────────────

  {
    id: 'si-repo',
    type: 'card',
    position: { x: 0, y: 56 },
    data: {
      icon: '🐙',
      title: 'SI Referee Repo',
      lines: ['GitHub — main branch', 'skills/  codemods/  sync.sh', 'si-referee.config.json'],
      badge: 'Single source of truth',
      bg: '#1c1f26', border: '#4a5060', titleColor: '#e2e8f0', lineColor: '#94a3b8',
    },
  },
  {
    id: 'target',
    type: 'card',
    position: { x: 420, y: 56 },
    data: {
      icon: '📁',
      title: 'Target Repo',
      lines: ["Team's source code", 'skills/  si-referee.config.json', '.claude/commands/  .cursor/rules/', '(all SI files are gitignored)'],
      bg: '#0d2218', border: '#2e7d32', titleColor: '#a5d6a7', lineColor: '#6aaa6e',
    },
  },

  // ── Row 2: Session ────────────────────────────────────────────────────────

  {
    id: 'registry',
    type: 'card',
    position: { x: 0, y: 336 },
    data: {
      icon: '🐙',
      title: 'Codemod Registry',
      lines: ['GitHub — codemods branch', 'registry.json  (rule → transform)', 'codemods/js/  dotnet/  java/  …', 'New codemods pushed back here'],
      bg: '#1c1f26', border: '#4a5060', titleColor: '#e2e8f0', lineColor: '#94a3b8',
    },
  },
  {
    id: 'tmp',
    type: 'card',
    position: { x: 420, y: 336 },
    data: {
      icon: '📦',
      title: '/tmp Clone',
      lines: ['Cloned fresh each session', 'New codemods written here', 'Pushed back at session end'],
      badge: 'Session-scoped',
      bg: '#2a2010', border: '#f9a825', titleColor: '#ffe082', lineColor: '#c8a84b',
    },
  },
  {
    id: 'cursor',
    type: 'card',
    position: { x: 840, y: 196 },
    data: {
      icon: '🤖',
      title: 'Cursor / Claude Code',
      lines: ['/sq-fix-issues', 'Fetch issues → classify → fix', 'Codemod or AI-fix per rule', 'Commit every 15–20 fixes', 'Update sq-dashboard-data.json'],
      bg: '#1e0d37', border: '#6a1b9a', titleColor: '#ce93d8', lineColor: '#9c64b8',
    },
  },
  {
    id: 'endpoint',
    type: 'card',
    position: { x: 1280, y: 196 },
    data: {
      icon: '📡',
      title: 'Issues Endpoint',
      lines: ['HTTP GET /issues', '{ rule, severity, type,', '  file, line, message }'],
      badge: 'Read-only · curl',
      bg: '#0d1a2a', border: '#0288d1', titleColor: '#81d4fa', lineColor: '#4a90b8',
    },
  },
];

// ─── Edges ────────────────────────────────────────────────────────────────────

const edgeDefaults = {
  type: 'smoothstep',
  labelStyle: { fontSize: 10, fontFamily: 'Inter, Segoe UI, sans-serif', fontWeight: 600 },
  labelBgPadding: [5, 8],
  labelBgBorderRadius: 4,
};

const initialEdges = [

  // ① sync.sh push: SI Repo → Target
  {
    ...edgeDefaults,
    id: 'e-sync',
    source: 'si-repo', target: 'target',
    label: 'sync.sh push',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2e7d32' },
    style: { stroke: '#2e7d32', strokeWidth: 2.5 },
    labelStyle: { ...edgeDefaults.labelStyle, fill: '#a5d6a7' },
    labelBgStyle: { fill: '#0d2218', fillOpacity: 0.95 },
  },

  // ② Target → Cursor (opens in editor, runs /sq-fix-issues)
  {
    ...edgeDefaults,
    id: 'e-open',
    source: 'target', target: 'cursor',
    label: 'opens in editor',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6a1b9a' },
    style: { stroke: '#6a1b9a', strokeWidth: 2 },
    labelStyle: { ...edgeDefaults.labelStyle, fill: '#ce93d8' },
    labelBgStyle: { fill: '#1e0d37', fillOpacity: 0.95 },
  },

  // ③ Cursor ↔ Issues Endpoint (fetch issues)
  {
    ...edgeDefaults,
    id: 'e-issues',
    source: 'cursor', target: 'endpoint',
    label: 'GET /issues  ·  issues JSON',
    animated: true,
    markerStart: { type: MarkerType.ArrowClosed, color: '#0288d1' },
    markerEnd:   { type: MarkerType.ArrowClosed, color: '#0288d1' },
    style: { stroke: '#0288d1', strokeWidth: 2 },
    labelStyle: { ...edgeDefaults.labelStyle, fill: '#81d4fa' },
    labelBgStyle: { fill: '#0d1a2a', fillOpacity: 0.95 },
  },

  // ④ Registry → /tmp (clone at session start)
  {
    ...edgeDefaults,
    id: 'e-clone',
    source: 'registry', target: 'tmp',
    label: 'git clone',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f9a825' },
    style: { stroke: '#f9a825', strokeWidth: 2 },
    labelStyle: { ...edgeDefaults.labelStyle, fill: '#ffe082' },
    labelBgStyle: { fill: '#2a2010', fillOpacity: 0.95 },
  },

  // ⑤ /tmp → Cursor (provides codemods)
  {
    ...edgeDefaults,
    id: 'e-codemods',
    source: 'tmp', target: 'cursor',
    label: '--codemods-dir',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f9a825' },
    style: { stroke: '#f9a825', strokeWidth: 2 },
    labelStyle: { ...edgeDefaults.labelStyle, fill: '#ffe082' },
    labelBgStyle: { fill: '#2a2010', fillOpacity: 0.95 },
  },
];

// ─── Download Button ──────────────────────────────────────────────────────────

function DownloadButton() {
  const handleDownload = () => {
    const el = document.querySelector('.react-flow');
    if (!el) return;
    toPng(el, { backgroundColor: '#0f1117', pixelRatio: 2 }).then((dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'si-referee-architecture.png';
      a.click();
    });
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        background: '#1e0d37', border: '2px solid #6a1b9a',
        color: '#ce93d8', borderRadius: 8,
        padding: '10px 20px', cursor: 'pointer',
        fontFamily: 'Inter, Segoe UI, sans-serif',
        fontSize: 13, fontWeight: 700,
        boxShadow: '0 4px 12px rgba(106,27,154,0.4)',
      }}
    >
      ⬇ Export PNG
    </button>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f1117', position: 'relative' }}>

      <DownloadButton />

      {/* Title */}
      <div style={{
        position: 'absolute', top: 20, left: 24, zIndex: 10,
        fontFamily: 'Inter, Segoe UI, sans-serif',
        color: '#e2e8f0', fontSize: 20, fontWeight: 700, letterSpacing: 0.3,
      }}>
        SI RefAIRee
        <span style={{ fontSize: 13, fontWeight: 400, color: '#4a5060', marginLeft: 10 }}>
          Architecture Overview
        </span>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 56, left: 24, zIndex: 10,
        fontFamily: 'Inter, Segoe UI, sans-serif',
        background: '#1c1f26', border: '1px solid #2a2d36',
        borderRadius: 10, padding: '10px 16px',
        display: 'flex', gap: 24, alignItems: 'center',
      }}>
        {[
          { color: '#2e7d32', label: 'Sync (setup)' },
          { color: '#f9a825', label: 'Codemods' },
          { color: '#6a1b9a', label: 'AI execution' },
          { color: '#0288d1', label: 'Issues endpoint' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 20, height: 3, background: color, borderRadius: 2 }} />
            <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
          </div>
        ))}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={1.5}
      >
        <Background color="#1a1d27" gap={32} />
        <Controls style={{ background: '#1c1f26', border: '1px solid #2a2d36', borderRadius: 8 }} />
      </ReactFlow>
    </div>
  );
}
