import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, Upload, X, Plus, Search } from 'lucide-react';
import { Priority } from '../../types/investigation';

interface TriggerInvestigationForm {
  deviationType: string;
  sampleId: string;
  testId: string;
  instrumentId: string;
  analystId: string;
  deviationDateTime: string;
  description: string;
  severity: Priority;
  immediateActions: string;
  relatedSOPs: string[];
  potentialImpact: string;
  customerImpact: boolean;
  regulatoryImpact: boolean;
}

export function TriggerInvestigation() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [relatedSOPs, setRelatedSOPs] = useState<string[]>([]);
  const [sopSearch, setSopSearch] = useState('');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TriggerInvestigationForm>();
  
  const severity = watch('severity');
  
  const onSubmit = (data: TriggerInvestigationForm) => {
    console.log('Investigation triggered:', { ...data, attachments, relatedSOPs });
    // Handle form submission
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const addSOP = () => {
    if (sopSearch && !relatedSOPs.includes(sopSearch)) {
      setRelatedSOPs(prev => [...prev, sopSearch]);
      setSopSearch('');
    }
  };
  
  const removeSOP = (sop: string) => {
    setRelatedSOPs(prev => prev.filter(s => s !== sop));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Trigger Investigation</h2>
              <p className="text-sm text-gray-600">Report a deviation and initiate the investigation process</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deviation Type *
                </label>
                <select
                  {...register('deviationType', { required: 'Deviation type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select deviation type</option>
                  <option value="out-of-specification">Out of Specification (OOS)</option>
                  <option value="out-of-trend">Out of Trend (OOT)</option>
                  <option value="equipment-failure">Equipment Failure</option>
                  <option value="procedural-deviation">Procedural Deviation</option>
                  <option value="environmental">Environmental</option>
                  <option value="contamination">Contamination</option>
                  <option value="other">Other</option>
                </select>
                {errors.deviationType && (
                  <p className="text-sm text-red-600 mt-1">{errors.deviationType.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample ID *
                  </label>
                  <input
                    type="text"
                    {...register('sampleId', { required: 'Sample ID is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., SM-2024-001"
                  />
                  {errors.sampleId && (
                    <p className="text-sm text-red-600 mt-1">{errors.sampleId.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test ID
                  </label>
                  <input
                    type="text"
                    {...register('testId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., T-2024-001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrument ID
                  </label>
                  <input
                    type="text"
                    {...register('instrumentId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., HPLC-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analyst ID *
                  </label>
                  <input
                    type="text"
                    {...register('analystId', { required: 'Analyst ID is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., AN-001"
                  />
                  {errors.analystId && (
                    <p className="text-sm text-red-600 mt-1">{errors.analystId.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deviation Date & Time *
                </label>
                <input
                  type="datetime-local"
                  {...register('deviationDateTime', { required: 'Date and time is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.deviationDateTime && (
                  <p className="text-sm text-red-600 mt-1">{errors.deviationDateTime.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <select
                  {...register('severity', { required: 'Severity level is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                {errors.severity && (
                  <p className="text-sm text-red-600 mt-1">{errors.severity.message}</p>
                )}
              </div>
            </div>
            
            {/* Detailed Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Detailed Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deviation Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed description of the deviation..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immediate Actions Taken
                </label>
                <textarea
                  {...register('immediateActions')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe any immediate actions taken..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potential Impact Assessment
                </label>
                <textarea
                  {...register('potentialImpact')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Assess potential impact on product quality, safety, etc..."
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Impact Assessment
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('customerImpact')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Potential customer impact</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('regulatoryImpact')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Regulatory impact</span>
                  </label>
                </div>
              </div>
              
              {/* Related SOPs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related SOPs
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={sopSearch}
                    onChange={(e) => setSopSearch(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search and add SOPs..."
                  />
                  <button
                    type="button"
                    onClick={addSOP}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {relatedSOPs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {relatedSOPs.map((sop, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {sop}
                        <button
                          type="button"
                          onClick={() => removeSOP(sop)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Attachments */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">
                      Upload files
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, Images, Documents up to 10MB each
                  </p>
                </div>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
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
          
          {/* Severity Alert */}
          {severity === 'critical' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Critical Deviation Alert</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This critical deviation requires immediate attention. Lab Manager and QA will be notified automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Trigger Investigation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}