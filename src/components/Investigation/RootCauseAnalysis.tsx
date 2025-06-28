import React, { useState } from 'react';
import { Brain, CheckCircle, X, Plus, Upload, Lightbulb, FileText, AlertCircle } from 'lucide-react';

interface RCAChecklist {
  id: string;
  category: string;
  question: string;
  response: boolean | null;
  comments: string;
  required: boolean;
}

interface AISuggestion {
  id: string;
  category: string;
  suggestion: string;
  confidence: number;
  reasoning: string;
}

const mockAISuggestions: AISuggestion[] = [
  {
    id: '1',
    category: 'Equipment',
    suggestion: 'HPLC column degradation due to extended use beyond recommended lifecycle',
    confidence: 85,
    reasoning: 'Historical data shows similar OOS results when column usage exceeds 2000 injections. Current column at 2150 injections.'
  },
  {
    id: '2',
    category: 'Environmental',
    suggestion: 'Temperature fluctuation in sample storage affecting stability',
    confidence: 72,
    reasoning: 'Environmental monitoring data shows temperature spikes during the sample storage period.'
  },
  {
    id: '3',
    category: 'Human Error',
    suggestion: 'Incorrect sample preparation or dilution factor',
    confidence: 68,
    reasoning: 'Analyst training records show recent completion of refresher training, but manual calculation errors possible.'
  }
];

const mockChecklist: RCAChecklist[] = [
  {
    id: '1',
    category: 'Sample Integrity',
    question: 'Was the sample stored under appropriate conditions?',
    response: null,
    comments: '',
    required: true
  },
  {
    id: '2',
    category: 'Sample Integrity',
    question: 'Was the sample within its stability period?',
    response: null,
    comments: '',
    required: true
  },
  {
    id: '3',
    category: 'Equipment',
    question: 'Was the instrument calibrated and qualified?',
    response: null,
    comments: '',
    required: true
  },
  {
    id: '4',
    category: 'Equipment',
    question: 'Were system suitability criteria met?',
    response: null,
    comments: '',
    required: true
  },
  {
    id: '5',
    category: 'Method',
    question: 'Was the correct analytical method used?',
    response: null,
    comments: '',
    required: true
  },
  {
    id: '6',
    category: 'Method',
    question: 'Were all method parameters followed correctly?',
    response: null,
    comments: '',
    required: false
  },
  {
    id: '7',
    category: 'Personnel',
    question: 'Was the analyst trained and qualified for this method?',
    response: null,
    comments: '',
    required: true
  },
  {
    id: '8',
    category: 'Environment',
    question: 'Were environmental conditions within acceptable limits?',
    response: null,
    comments: '',
    required: false
  }
];

export function RootCauseAnalysis() {
  const [checklist, setChecklist] = useState<RCAChecklist[]>(mockChecklist);
  const [manualAnalysis, setManualAnalysis] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [contributingFactors, setContributingFactors] = useState<string[]>([]);
  const [newFactor, setNewFactor] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const updateChecklistItem = (id: string, field: 'response' | 'comments', value: boolean | string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addContributingFactor = () => {
    if (newFactor.trim()) {
      setContributingFactors(prev => [...prev, newFactor.trim()]);
      setNewFactor('');
    }
  };

  const removeContributingFactor = (index: number) => {
    setContributingFactors(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId) 
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getCompletionPercentage = () => {
    const requiredItems = checklist.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.response !== null);
    return Math.round((completedRequired.length / requiredItems.length) * 100);
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RCAChecklist[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Root Cause Analysis</h2>
              <p className="text-sm text-gray-600">Investigation ID: INV-2024-001 - Out of Specification</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Completion</div>
            <div className="text-2xl font-bold text-purple-600">{getCompletionPercentage()}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Suggestions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">AI-generated potential root causes based on historical data</p>
            </div>
            <div className="p-4 space-y-4">
              {mockAISuggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSuggestions.includes(suggestion.id)}
                        onChange={() => toggleSuggestion(suggestion.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium text-gray-500 uppercase">{suggestion.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        suggestion.confidence >= 80 ? 'bg-green-500' : 
                        suggestion.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">{suggestion.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">{suggestion.suggestion}</p>
                  <p className="text-xs text-gray-600">{suggestion.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* MHRA Checklist */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">MHRA Investigation Checklist</h3>
              <p className="text-sm text-gray-600 mt-1">Systematic evaluation of potential causes</p>
            </div>
            <div className="p-4">
              {Object.entries(groupedChecklist).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center space-x-2 mt-1">
                            {item.required && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateChecklistItem(item.id, 'response', true)}
                                className={`px-3 py-1 rounded text-xs font-medium ${
                                  item.response === true 
                                    ? 'bg-green-100 text-green-800 border border-green-300' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-green-50'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => updateChecklistItem(item.id, 'response', false)}
                                className={`px-3 py-1 rounded text-xs font-medium ${
                                  item.response === false 
                                    ? 'bg-red-100 text-red-800 border border-red-300' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-red-50'
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-2">{item.question}</p>
                            <textarea
                              value={item.comments}
                              onChange={(e) => updateChecklistItem(item.id, 'comments', e.target.value)}
                              placeholder="Add comments or evidence..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Manual Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">Additional investigation findings and analysis</p>
            </div>
            <div className="p-4">
              <textarea
                value={manualAnalysis}
                onChange={(e) => setManualAnalysis(e.target.value)}
                placeholder="Describe your detailed analysis, observations, and findings..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
              />
            </div>
          </div>

          {/* Root Cause Conclusion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Root Cause Conclusion</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Root Cause *
                </label>
                <textarea
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  placeholder="State the primary root cause based on your investigation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contributing Factors
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFactor}
                    onChange={(e) => setNewFactor(e.target.value)}
                    placeholder="Add contributing factor..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addContributingFactor()}
                  />
                  <button
                    onClick={addContributingFactor}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {contributingFactors.length > 0 && (
                  <div className="space-y-2">
                    {contributingFactors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{factor}</span>
                        <button
                          onClick={() => removeContributingFactor(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Evidence Files */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Supporting Evidence</h3>
            </div>
            <div className="p-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-500">
                        Upload evidence files
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Documents, images, data files up to 10MB each
                    </p>
                  </div>
                </div>
                
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700">
              Complete RCA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}