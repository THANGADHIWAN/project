import React, { useCallback, useState } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

interface DecisionNodeData {
  label: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  type: 'decision' | 'action' | 'end';
  requirements?: string[];
}

const DecisionNode = ({ data, selected }: { data: DecisionNodeData; selected: boolean }) => {
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
  
  return (
    <div className={`px-4 py-3 rounded-lg border-2 ${getStatusColor()} ${selected ? 'ring-2 ring-blue-500' : ''} min-w-[200px] max-w-[300px]`}>
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
    </div>
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
      requirements: ['Document deviation', 'Notify supervisor']
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
      requirements: ['Assess severity', 'Check regulatory requirements']
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
      requirements: ['Secure evidence', 'Interview personnel', 'Document findings']
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
      requirements: ['Assign investigator', 'Set timeline', 'Define scope']
    },
  },
  {
    id: '5',
    type: 'decision',
    position: { x: 250, y: 450 },
    data: { 
      label: 'Root Cause Analysis',
      description: 'Perform comprehensive root cause analysis',
      status: 'pending',
      type: 'action',
      requirements: ['Collect data', 'Analyze causes', 'Validate findings']
    },
  },
  {
    id: '6',
    type: 'decision',
    position: { x: 250, y: 580 },
    data: { 
      label: 'CAPA Required?',
      description: 'Determine if corrective and preventive actions are needed',
      status: 'pending',
      type: 'decision',
      requirements: ['Assess risk', 'Review regulations', 'Evaluate impact']
    },
  },
  {
    id: '7',
    type: 'decision',
    position: { x: 100, y: 710 },
    data: { 
      label: 'Implement CAPA',
      description: 'Implement corrective and preventive actions',
      status: 'pending',
      type: 'action',
      requirements: ['Define actions', 'Assign responsibility', 'Set timelines']
    },
  },
  {
    id: '8',
    type: 'decision',
    position: { x: 400, y: 710 },
    data: { 
      label: 'Document & Close',
      description: 'Document findings and close investigation',
      status: 'pending',
      type: 'action',
      requirements: ['Prepare report', 'Review findings', 'Archive documents']
    },
  },
  {
    id: '9',
    type: 'decision',
    position: { x: 250, y: 840 },
    data: { 
      label: 'Effectiveness Review',
      description: 'Review effectiveness of implemented actions',
      status: 'pending',
      type: 'action',
      requirements: ['Monitor results', 'Validate effectiveness', 'Update procedures']
    },
  },
  {
    id: '10',
    type: 'decision',
    position: { x: 250, y: 970 },
    data: { 
      label: 'Investigation Complete',
      description: 'Investigation successfully completed',
      status: 'pending',
      type: 'end'
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
  { 
    id: 'e3-5', 
    source: '3', 
    target: '5', 
    label: 'Complete',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
  { 
    id: 'e4-5', 
    source: '4', 
    target: '5', 
    label: 'Begin',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
  { 
    id: 'e5-6', 
    source: '5', 
    target: '6', 
    label: 'Analysis Complete',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
  { 
    id: 'e6-7', 
    source: '6', 
    target: '7', 
    label: 'Yes - CAPA Needed',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#dc2626', strokeWidth: 2 },
    labelStyle: { fill: '#dc2626', fontWeight: 600 }
  },
  { 
    id: 'e6-8', 
    source: '6', 
    target: '8', 
    label: 'No - Document Only',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#059669', strokeWidth: 2 },
    labelStyle: { fill: '#059669', fontWeight: 600 }
  },
  { 
    id: 'e7-9', 
    source: '7', 
    target: '9', 
    label: 'Implemented',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
  { 
    id: 'e8-10', 
    source: '8', 
    target: '10', 
    label: 'Closed',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
  { 
    id: 'e9-10', 
    source: '9', 
    target: '10', 
    label: 'Validated',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6b7280', strokeWidth: 2 },
    labelStyle: { fill: '#374151', fontWeight: 600 }
  },
];

export function DecisionTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);
  
  const currentNode = nodes.find(n => n.data.status === 'current');
  
  return (
    <div className="h-screen bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">MHRA Investigation Decision Tree</h2>
            <p className="text-sm text-gray-600 mt-1">Interactive workflow for deviation investigations</p>
          </div>
          <div className="flex items-center space-x-4">
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
      
      <div className="h-full" style={{ height: 'calc(100vh - 140px)' }}>
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
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      
      {selectedNode && (
        <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Step Details</h3>
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
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Mark Complete
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}