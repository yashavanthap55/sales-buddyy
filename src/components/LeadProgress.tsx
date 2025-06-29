
import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Circle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadProgressProps {
  leadName: string;
  currentStep: number;
  progress: number;
  onStepChange?: (step: number) => void;
}

const LeadProgress = ({ leadName, currentStep, progress, onStepChange }: LeadProgressProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const processSteps = [
    { name: 'Initial Contact', icon: Circle },
    { name: 'Qualified', icon: Circle },
    { name: 'Demo Scheduled', icon: Circle },
    { name: 'Proposal Sent', icon: Circle },
    { name: 'Negotiation', icon: Circle },
    { name: 'Closed', icon: CheckCircle },
  ];

  const handleStepToggle = (stepIndex: number) => {
    const newStep = stepIndex + 1;
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full bg-white/95 backdrop-blur-md shadow-2xl border-l border-gray-200/50 transition-all duration-500 ease-in-out z-40 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-4 bg-white shadow-md hover:bg-gray-50 rounded-l-md rounded-r-none border border-r-0 z-50"
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Collapsed State - Just Icon */}
      {isCollapsed && (
        <div className="flex flex-col items-center justify-center h-full">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
      )}

      {/* Expanded State - Full Content */}
      {!isCollapsed && (
        <Card className="w-full h-full rounded-none border-0 shadow-none">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Lead Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{leadName}</span>
                <span className="text-xs text-gray-500">{currentStep}/6</span>
              </div>
              <Progress value={progress} className="h-3 mb-2" />
              <div className="text-xs text-gray-500">
                Current: {processSteps[currentStep - 1]?.name || 'Unknown'}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Process Steps</h4>
              {processSteps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber <= currentStep;
                const isCurrent = stepNumber === currentStep;
                
                return (
                  <div
                    key={step.name}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                      isCompleted 
                        ? 'bg-green-50 text-green-700' 
                        : isCurrent 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-gray-50 text-gray-500'
                    }`}
                    onClick={() => handleStepToggle(index)}
                  >
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => handleStepToggle(index)}
                      className="transition-all duration-200"
                    />
                    <span className="text-sm flex-1">{step.name}</span>
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadProgress;
