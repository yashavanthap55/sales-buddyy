
import React, { useState } from 'react';
import { Target, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LeadScoring = () => {
   const { isDarkMode } = useTheme();
  const [bantScores, setBantScores] = useState({
    budget: 75,
    authority: 60,
    need: 85,
    timeline: 40
  });

  const totalScore = Math.round((bantScores.budget + bantScores.authority + bantScores.need + bantScores.timeline) / 4);
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 70) return { label: 'Hot', color: 'bg-red-500' };
    if (score >= 40) return { label: 'Warm', color: 'bg-yellow-500' };
    return { label: 'Cold', color: 'bg-blue-500' };
  };

  const bantFactors = [
    {
      key: 'budget',
      label: 'Budget',
      icon: DollarSign,
      description: 'Prospect has allocated budget for solution',
      factors: ['Budget range confirmed', 'Financial decision maker identified', 'ROI expectations clear']
    },
    {
      key: 'authority',
      label: 'Authority',
      icon: Users,
      description: 'Decision maker identified and engaged',
      factors: ['Direct access to decision maker', 'Influence over buying process', 'Stakeholder mapping complete']
    },
    {
      key: 'need',
      label: 'Need',
      icon: Target,
      description: 'Clear business need for your solution',
      factors: ['Pain points identified', 'Current solution gaps', 'Impact of inaction understood']
    },
    {
      key: 'timeline',
      label: 'Timeline',
      icon: Calendar,
      description: 'Defined timeline for implementation',
      factors: ['Project timeline established', 'Urgency level determined', 'Implementation readiness']
    }
  ];

  const currentLead = {
    name: 'John Doe',
    company: 'Acme Corporation',
    title: 'VP of Sales',
    email: 'john@acme.com',
    lastContact: '2024-01-15'
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl ${
          isDarkMode 
            ? 'text-gray-300' 
            : 'text-gray-900'
        } font-bold `}>Lead Scoring Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Evaluate leads using the BANT framework for qualified opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Lead</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">{currentLead.name}</p>
                <p className="text-sm text-gray-600">{currentLead.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentLead.company}</p>
                <p className="text-sm text-gray-600">{currentLead.email}</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">Last Contact: {currentLead.lastContact}</p>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className={`rounded-xl shadow-sm border p-6 ${getScoreBg(totalScore)}`}>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-current text-gray-300"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`stroke-current ${getScoreColor(totalScore)}`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${totalScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className={`absolute text-xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
              <div className="flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${getScoreStatus(totalScore).color} mr-2`}></div>
                <span className={`font-medium ${getScoreColor(totalScore)}`}>
                  {getScoreStatus(totalScore).label} Lead
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BANT Framework */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bantFactors.map((factor) => (
              <div key={factor.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getScoreBg(bantScores[factor.key as keyof typeof bantScores])}`}>
                      <factor.icon className={`h-5 w-5 ${getScoreColor(bantScores[factor.key as keyof typeof bantScores])}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{factor.label}</h3>
                      <p className="text-xs text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(bantScores[factor.key as keyof typeof bantScores])}`}>
                      {bantScores[factor.key as keyof typeof bantScores]}
                    </div>
                    <div className="text-xs text-gray-500">/ 100</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        bantScores[factor.key as keyof typeof bantScores] >= 70 ? 'bg-green-500' :
                        bantScores[factor.key as keyof typeof bantScores] >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${bantScores[factor.key as keyof typeof bantScores]}%` }}
                    ></div>
                  </div>
                </div>

                {/* Factors */}
                <div className="space-y-2">
                  {factor.factors.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-2 ${index < 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={index < 2 ? 'text-gray-900' : 'text-gray-500'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Recommendations */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {totalScore < 70 && (
                <>
                  {bantScores.timeline < 50 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Timeline Score Low</p>
                      <p className="text-sm text-yellow-700">Schedule discovery call to understand urgency and implementation timeline</p>
                    </div>
                  )}
                  {bantScores.authority < 50 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Authority Score Low</p>
                      <p className="text-sm text-blue-700">Request introduction to decision makers and map stakeholder influence</p>
                    </div>
                  )}
                  {bantScores.budget < 50 && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">Budget Score Low</p>
                      <p className="text-sm text-purple-700">Discuss budget range and ROI expectations with economic buyer</p>
                    </div>
                  )}
                </>
              )}
              {totalScore >= 70 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">High-Quality Lead</p>
                  <p className="text-sm text-green-700">Proceed with proposal preparation and demo scheduling</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoring;
