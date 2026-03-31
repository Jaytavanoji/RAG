import { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const EntityMap = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const data = await apiRequest('/api/entities');
      const nodeList = Array.isArray(data) ? data : (data?.data || []);
      setNodes(nodeList);
      if (nodeList.length > 0) {
        setSelectedNode(nodeList.find(n => n.node_type === 'nexus') || nodeList[0]);
      }
    } catch (err) {
      console.error('Failed to sync entity nodes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNodeColor = (type, isActive) => {
    if (!isActive) return 'bg-on-surface-variant/40';
    if (type === 'root' || type === 'nexus') return 'bg-primary-container';
    return 'bg-primary-container/60';
  };

  const getNodeSize = (type) => {
    if (type === 'nexus') return 'w-6 h-6';
    return 'w-4 h-4';
  };

  return (
    <div className="h-[calc(100vh-64px)] flex relative overflow-hidden bg-[#09090B]">
      <div className="flex-grow relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#D32F2F 1px, transparent 1px), linear-gradient(90deg, #D32F2F 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {nodes.map((node, i) => {
            const targetNode = nodes[(i + 1) % nodes.length];
            if (!targetNode) return null;
            return (
              <line 
                key={i}
                stroke="#D32F2F" 
                strokeWidth="1.5" 
                x1={`${node.x_position}%`} 
                x2={`${targetNode.x_position}%`} 
                y1={`${node.y_position}%`} 
                y2={`${targetNode.y_position}%`}
              ></line>
            );
          })}
        </svg>

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-primary-container text-sm">Loading neural network...</p>
          </div>
        ) : (
          nodes.map((node) => (
            <div 
              key={node.id}
              className="absolute group/node cursor-pointer"
              style={{ top: `${node.y_position}%`, left: `${node.x_position}%` }}
              onClick={() => setSelectedNode(node)}
            >
              <div className={`${getNodeSize(node.node_type)} rounded-full ${getNodeColor(node.node_type, node.is_active)} relative ${node.is_active ? (node.node_type === 'nexus' ? 'shadow-[0_0_20px_rgba(211,47,47,0.6)]' : 'shadow-[0_0_15px_rgba(211,47,47,0.4)]') : ''} ${node.node_type === 'nexus' ? 'border-4 border-background/50' : ''} ${node.is_active && node.node_type === 'root' ? 'animate-pulse' : ''}`}></div>
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-high/90 backdrop-blur-md px-3 py-1 rounded border text-[10px] uppercase tracking-wider transition-opacity opacity-0 group-hover/node:opacity-100 ${node.is_active ? 'border-primary-container/20 text-on-surface' : 'border-outline-variant text-on-surface-variant'}`}>
                {node.name}
              </div>
            </div>
          ))
        )}

        <div className="absolute bottom-10 left-10 flex flex-col gap-2">
          <div className="bg-surface-container-high/60 backdrop-blur-xl p-1.5 rounded-xl border border-white/5 flex flex-col gap-1">
            <button className="w-10 h-10 rounded-lg bg-surface-bright flex items-center justify-center text-on-surface hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="h-[1px] mx-2 bg-white/5"></div>
            <button className="w-10 h-10 rounded-lg bg-surface-bright flex items-center justify-center text-on-surface hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
          <button className="w-13 h-13 rounded-xl bg-surface-container-high/60 backdrop-blur-xl border border-white/5 p-3 text-on-surface flex items-center justify-center hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined">center_focus_strong</span>
          </button>
        </div>

        <div className="absolute top-10 left-10 bg-surface-container-lowest/40 backdrop-blur-sm p-4 rounded-xl flex flex-col gap-3 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary-container"></div>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Primary Entity</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-on-surface-variant/40"></div>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">Shadow Cluster</span>
          </div>
        </div>
      </div>

      <div className="w-[400px] h-full bg-surface-container-low/80 backdrop-blur-3xl border-l border-white/5 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-lg font-bold text-on-surface text-white">Entity Intelligence</h2>
          <span className="text-[10px] bg-primary-container/10 text-primary-container px-2 py-1 rounded font-bold">LVL 04</span>
        </div>
        <div className="space-y-8">
          {selectedNode && (
            <div className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary-container">hub</span>
                  <span className="text-[11px] font-headline uppercase tracking-widest text-primary-container">Current Selection</span>
                </div>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight mb-2 text-white">{selectedNode.name}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  {selectedNode.node_type === 'root' && 'Root kernel node - foundational processing unit for all neural operations.'}
                  {selectedNode.node_type === 'nexus' && 'Central sovereign processing node responsible for cross-chain identity verification and neural packet routing.'}
                  {selectedNode.node_type === 'storage' && 'Data storage node handling persistent document archives and vector embeddings.'}
                  {selectedNode.node_type === 'processor' && 'Processing unit for AI inference and document analysis operations.'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-white/5">
                    <span className="block text-[9px] uppercase tracking-widest text-on-surface-variant/50 mb-1">Status</span>
                    <span className={`text-xs font-bold ${selectedNode.is_active ? 'text-green-400' : 'text-on-surface-variant'}`}>
                      {selectedNode.is_active ? 'OPERATIONAL' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-white/5">
                    <span className="block text-[9px] uppercase tracking-widest text-on-surface-variant/50 mb-1">Type</span>
                    <span className="text-xs font-bold text-on-surface text-white uppercase">{selectedNode.node_type}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-headline uppercase tracking-widest text-on-surface-variant">Connection Matrix</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant/40">info</span>
            </div>
            <div className="space-y-3">
              {nodes.filter(n => n.id !== selectedNode?.id).slice(0, 3).map((conn) => (
                <div key={conn.id} className="p-4 rounded-xl bg-surface-container-lowest/50 hover:bg-surface-container-high transition-colors cursor-pointer group border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-on-surface group-hover:text-primary-container transition-colors text-white">{conn.name}</span>
                    <span className="text-[10px] text-on-surface-variant/50">{conn.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container transition-all duration-1000" style={{ width: conn.is_active ? '88%' : '30%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-3">
            <button className="w-full py-4 bg-primary-container text-on-primary-container rounded-xl font-headline font-bold text-sm tracking-wide flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-primary-container/20 uppercase">
              <span className="material-symbols-outlined text-lg">bolt</span>
              Execute Trace Analysis
            </button>
            <div className="flex gap-3">
              <button className="flex-grow py-3 bg-surface-container-high text-on-surface-variant rounded-xl font-headline font-bold text-[11px] tracking-widest uppercase hover:bg-surface-bright transition-colors border border-white/5">
                Isolate
              </button>
              <button className="flex-grow py-3 bg-surface-container-high text-on-surface-variant rounded-xl font-headline font-bold text-[11px] tracking-widest uppercase hover:bg-surface-bright transition-colors border border-white/5">
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityMap;
