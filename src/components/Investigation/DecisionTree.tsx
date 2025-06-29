import React, { useCallback, useState, useRef } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider,
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Star, 
  StarOff,
  Edit,
  X,
  Copy,
  RotateCcw
} from 'lucide-react';

interface DecisionNodeData {
  label: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  type: 'decision' | 'action' | 'end';
  requirements?: string[];
  marked?: boolean;
  createdAt?: string;
  lastModified?: string;
}

interface TreeState {
  nodes: Node[];
  edges: Edge[];
  lastSaved?: string;
  hasUnsavedChanges: boolean;
}

const DecisionNode = ({ data, selected, id }: NodeProps<DecisionNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'current':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'current':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };
  
  const getTypeIcon = () => {
    switch (data.type) {
      case 'decision':
        return '?';
      case 'action':
        return '!';
      case 'end':
        return '✓';
      default:
        return '•';
    }
  };

  const handleSaveEdit = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...editData, lastModified: new Date().toISOString() } }
          : node
      )
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    }
  };

  const handleToggleMark = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, marked: !node.data.marked } }
          : node
      )
    );
  };

  const handleDuplicate = () => {
    const nodes = getNodes();
    const newId = `${id}-copy-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'decision',
      position: { x: nodes.find(n => n.id === id)!.position.x + 250, y: nodes.find(n => n.id === id)!.position.y },
      data: {
        ...data,
        label: `${data.label} (Copy)`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
    setNodes((nodes) => [...nodes, newNode]);
  };
  
  return (
    <>
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ bottom: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ right: -6 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ left: -6 }}
      />

      <div className={`px-4 py-3 rounded-lg border-2 ${getStatusColor()} ${selected ? 'ring-2 ring-blue-500' : ''} ${data.marked ? 'ring-2 ring-yellow-400' : ''} min-w-[200px] max-w-[300px] relative group`}>
        {/* Action Buttons */}
        <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleMark}
            className={`p-1 rounded-full ${data.marked ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'} hover:scale-110 transition-transform`}
            title={data.marked ? 'Unmark' : 'Mark as important'}
          >
            {data.marked ? <Star className="h-3 w-3" /> : <StarOff className="h-3 w-3" />}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform"
            title="Edit node"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1 bg-green-500 text-white rounded-full hover:scale-110 transition-transform"
            title="Duplicate node"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
            title="Delete node"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editData.label}
              onChange={(e) => setEditData({ ...editData, label: e.target.value })}
              className="w-full px-2 py-1 text-sm border rounded"
              placeholder="Node label"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-2 py-1 text-xs border rounded"
              rows={2}
              placeholder="Description"
            />
            <div className="flex space-x-1">
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                className="flex-1 px-2 py-1 text-xs border rounded"
              >
                <option value="pending">Pending</option>
                <option value="current">Current</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value as any })}
                className="flex-1 px-2 py-1 text-xs border rounded"
              >
                <option value="decision">Decision</option>
                <option value="action">Action</option>
                <option value="end">End</option>
              </select>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditData(data);
                  setIsEditing(false);
                }}
                className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  {getTypeIcon()}
                </div>
                {getStatusIcon()}
              </div>
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">{data.label}</h3>
            <p className="text-xs text-gray-600">{data.description}</p>
            {data.requirements && data.requirements.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700">Requirements:</p>
                <ul className="text-xs text-gray-600 mt-1">
                  {data.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(data.createdAt || data.lastModified) && (
              <div className="mt-2 text-xs text-gray-500">
                {data.lastModified && (
                  <div>Modified: {new Date(data.lastModified).toLocaleString()}</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const nodeTypes = {
  decision: DecisionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'decision',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Deviation Detected',
      description: 'Initial deviation observation and documentation',
      status: 'completed',
      type: 'action',
      requirements: ['Document deviation', 'Notify supervisor'],
      createdAt: new Date().toISOString()
    },
  },
  {
    id: '2',
    type: 'decision',
    position: { x: 250, y: 180 },
    data: { 
      label: 'Immediate Investigation Required?',
      description: 'Assess if immediate investigation is needed based on severity',
      status: 'current',
      type: 'decision',
      requirements: ['Assess severity', 'Check regulatory requirements'],
      createdAt: new Date().toISOString()
    },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 100, y: 320 },
    data: { 
      label: 'Conduct Immediate Investigation',
      description: 'Perform immediate investigation for critical deviations',
      status: 'pending',
      type: 'action',
      requirements: ['Secure evidence', 'Interview personnel', 'Document findings'],
      createdAt: new Date().toISOString()
    },
  },
  {
    id: '4',
    type: 'decision',
    position: { x: 400, y: 320 },
    data: { 
      label: 'Schedule Investigation',
      description: 'Plan and schedule investigation for non-critical deviations',
      status: 'pending',
      type: 'action',
      requirements: ['Assign investigator', 'Set timeline', 'Define scope'],
      createdAt: new Date().toISOString()
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    label: 'Next',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    label: 'Yes - Critical',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#dc2626', strokeWidth: 2 },
    labelStyle: { fill: '#dc2626', fontWeight: 600 }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    label: 'No - Schedule',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#059669', strokeWidth: 2 },
    labelStyle: { fill: '#059669', fontWeight: 600 }
  },
];

function DecisionTreeContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [treeState, setTreeState] = useState<TreeState>({
    nodes: initialNodes,
    edges: initialEdges,
    hasUnsavedChanges: false
  });
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  const [newNodeData, setNewNodeData] = useState<DecisionNodeData>({
    label: '',
    description: '',
    status: 'pending',
    type: 'decision'
  });
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, getViewport } = useReactFlow();
  
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#6b7280', strokeWidth: 2 },
        labelStyle: { fill: '#374151', fontWeight: 600 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setTreeState(prev => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setEdges],
  );
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const addNewNode = () => {
    const viewport = getViewport();
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'decision',
      position: { 
        x: -viewport.x + 300, 
        y: -viewport.y + 200 
      },
      data: {
        ...newNodeData,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
    
    setNodes((nodes) => [...nodes, newNode]);
    setNewNodeData({
      label: '',
      description: '',
      status: 'pending',
      type: 'decision'
    });
    setShowAddNodeDialog(false);
    setTreeState(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  const saveTree = () => {
    const treeData = {
      nodes,
      edges,
      savedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    // Save to localStorage
    localStorage.setItem('decisionTree', JSON.stringify(treeData));
    
    setTreeState(prev => ({
      ...prev,
      lastSaved: new Date().toISOString(),
      hasUnsavedChanges: false
    }));
    
    alert('Decision tree saved successfully!');
  };

  const loadTree = () => {
    const saved = localStorage.getItem('decisionTree');
    if (saved) {
      try {
        const treeData = JSON.parse(saved);
        setNodes(treeData.nodes || []);
        setEdges(treeData.edges || []);
        setTreeState(prev => ({
          ...prev,
          lastSaved: treeData.savedAt,
          hasUnsavedChanges: false
        }));
        alert('Decision tree loaded successfully!');
      } catch (error) {
        alert('Error loading saved tree');
      }
    } else {
      alert('No saved tree found');
    }
  };

  const exportTree = () => {
    const treeData = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
      metadata: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        markedNodes: nodes.filter(n => n.data.marked).length,
        completedNodes: nodes.filter(n => n.data.status === 'completed').length
      }
    };
    
    const blob = new Blob([JSON.stringify(treeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-tree-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetTree = () => {
    if (window.confirm('Are you sure you want to reset the tree? This will remove all nodes and connections.')) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setTreeState(prev => ({ ...prev, hasUnsavedChanges: true }));
    }
  };

  const clearMarkedNodes = () => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, marked: false }
      }))
    );
  };

  const deleteMarkedNodes = () => {
    if (window.confirm('Are you sure you want to delete all marked nodes?')) {
      const markedNodeIds = nodes.filter(n => n.data.marked).map(n => n.id);
      setNodes((nodes) => nodes.filter((node) => !node.data.marked));
      setEdges((edges) => edges.filter((edge) => 
        !markedNodeIds.includes(edge.source) && !markedNodeIds.includes(edge.target)
      ));
    }
  };

  const currentNode = nodes.find(n => n.data.status === 'current');
  const markedNodesCount = nodes.filter(n => n.data.marked).length;
  
  return (
    <div className="h-screen bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">MHRA Investigation Decision Tree</h2>
            <p className="text-sm text-gray-600 mt-1">Interactive workflow for deviation investigations</p>
            {treeState.hasUnsavedChanges && (
              <p className="text-xs text-orange-600 mt-1">• Unsaved changes</p>
            )}
            {treeState.lastSaved && (
              <p className="text-xs text-gray-500 mt-1">Last saved: {new Date(treeState.lastSaved).toLocaleString()}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm bg-gray-100 px-3 py-1 rounded-lg">
              <span>Nodes: {nodes.length}</span>
              <span>•</span>
              <span>Connections: {edges.length}</span>
              {markedNodesCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-yellow-600">Marked: {markedNodesCount}</span>
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowAddNodeDialog(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Node</span>
            </button>
            
            <button
              onClick={saveTree}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={loadTree}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Load
            </button>
            
            <button
              onClick={exportTree}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            {markedNodesCount > 0 && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={clearMarkedNodes}
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Clear Marks
                </button>
                <button
                  onClick={deleteMarkedNodes}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete Marked
                </button>
              </div>
            )}
            
            <button
              onClick={resetTree}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="h-3 w-3 text-yellow-500" />
            <span>Marked</span>
          </div>
        </div>
        
        {currentNode && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Current Step: {currentNode.data.label}</h3>
                <p className="text-sm text-blue-700 mt-1">{currentNode.data.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="h-full" style={{ height: 'calc(100vh - 200px)' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="top-right"
          connectionLineStyle={{ stroke: '#6b7280', strokeWidth: 2 }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#6b7280', strokeWidth: 2 }
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Add Node Dialog */}
      {showAddNodeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Node</h3>
              <button
                onClick={() => setShowAddNodeDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={newNodeData.label}
                  onChange={(e) => setNewNodeData({ ...newNodeData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter node label"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newNodeData.description}
                  onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newNodeData.type}
                    onChange={(e) => setNewNodeData({ ...newNodeData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="decision">Decision</option>
                    <option value="action">Action</option>
                    <option value="end">End</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newNodeData.status}
                    onChange={(e) => setNewNodeData({ ...newNodeData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="current">Current</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddNodeDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewNode}
                disabled={!newNodeData.label.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedNode && (
        <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Node Details</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">{node.data.label}</h4>
                <p className="text-sm text-gray-600 mb-3">{node.data.description}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    node.data.status === 'completed' ? 'bg-green-100 text-green-800' :
                    node.data.status === 'current' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {node.data.status}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                    {node.data.type}
                  </span>
                  {node.data.marked && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      Marked
                    </span>
                  )}
                </div>
                {node.data.requirements && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {node.data.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export function DecisionTree() {
  return (
    <ReactFlowProvider>
      <DecisionTreeContent />
    </ReactFlowProvider>
  );
}