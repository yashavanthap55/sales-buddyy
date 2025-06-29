
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface LeadProgressProps {
  leadName: string;
  currentStep: number;
  progress: number;
}

const LeadProgress = ({ leadName, currentStep, progress }: LeadProgressProps) => {
  const processSteps = [
    { name: 'Initial Contact', icon: Circle },
    { name: 'Qualified', icon: Circle },
    { name: 'Demo Scheduled', icon: Circle },
    { name: 'Proposal Sent', icon: Circle },
    { name: 'Negotiation', icon: Circle },
    { name: 'Closed', icon: CheckCircle },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Lead Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={step.name}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 text-green-700' 
                    : isCurrent 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : isCurrent ? (
                  <Circle className="h-4 w-4 text-blue-600 fill-blue-600" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="text-sm">{step.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadProgress;
