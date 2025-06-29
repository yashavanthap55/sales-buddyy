import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, User, Bot, Target, DollarSign, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import LeadProgress from '@/components/LeadProgress';

const LeadChat = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [scores, setScores] = useState({
    budget_score: 0,
    authority_score: 0,
    need_score: 0,
    timeline_score: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch lead details
  const { data: lead, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!leadId && !!user,
  });

  // Fetch chat messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!leadId && !!user,
  });

  // Fetch lead scores
  const { data: leadScores } = useQuery({
    queryKey: ['leadScores', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_scores')
        .select('*')
        .eq('lead_id', leadId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!leadId && !!user,
  });

  // Update scores state when data is fetched
  useEffect(() => {
    if (leadScores) {
      setScores({
        budget_score: leadScores.budget_score || 0,
        authority_score: leadScores.authority_score || 0,
        need_score: leadScores.need_score || 0,
        timeline_score: leadScores.timeline_score || 0
      });
    }
  }, [leadScores]);

  // Update current step based on total score
  useEffect(() => {
    const totalScore = (scores.budget_score + scores.authority_score + scores.need_score + scores.timeline_score) / 4;
    const calculatedStep = getCurrentStep(totalScore);
    setCurrentStep(calculatedStep);
  }, [scores]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          lead_id: leadId,
          sender: 'user',
          message: newMessage,
        });
      
      if (error) throw error;
      
      // Simulate bot response
      setTimeout(async () => {
        await supabase
          .from('chat_messages')
          .insert({
            lead_id: leadId,
            sender: 'bot',
            message: `Thanks for your message about "${newMessage}". I'll help you with this lead qualification process.`,
          });
        queryClient.invalidateQueries({ queryKey: ['messages', leadId] });
      }, 1000);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', leadId] });
      setMessage('');
    },
    onError: (error) => {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    },
  });

  // Update lead scores mutation
  const updateScoresMutation = useMutation({
    mutationFn: async (newScores: typeof scores) => {
      const { error } = await supabase
        .from('lead_scores')
        .upsert({
          lead_id: leadId,
          ...newScores,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Lead scores updated successfully');
      queryClient.invalidateQueries({ queryKey: ['leadScores', leadId] });
    },
    onError: (error) => {
      toast.error('Failed to update scores');
      console.error('Error updating scores:', error);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleScoreChange = (scoreType: keyof typeof scores, value: number) => {
    const newScores = { ...scores, [scoreType]: value };
    setScores(newScores);
  };

  const handleSaveScores = () => {
    updateScoresMutation.mutate(scores);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    // Optionally update scores based on step
    const stepToScoreMap = {
      1: 10, 2: 25, 3: 40, 4: 55, 5: 70, 6: 85
    };
    const targetScore = stepToScoreMap[step as keyof typeof stepToScoreMap] || 10;
    
    // Update all scores proportionally to match the step
    const newScores = {
      budget_score: targetScore,
      authority_score: targetScore,
      need_score: targetScore,
      timeline_score: targetScore
    };
    setScores(newScores);
    updateScoresMutation.mutate(newScores);
  };

  const totalScore = (scores.budget_score + scores.authority_score + scores.need_score + scores.timeline_score) / 4;

  // Calculate current step and progress for this lead
  const getCurrentStep = (score: number = totalScore) => {
    if (score >= 80) return 6; // Closed
    if (score >= 65) return 5; // Negotiation
    if (score >= 50) return 4; // Proposal
    if (score >= 35) return 3; // Demo
    if (score >= 20) return 2; // Qualified
    return 1; // Initial
  };

  if (leadLoading) {
    return <div className="p-6">Loading lead details...</div>;
  }

  if (!lead) {
    return (
      <div className="p-6">
        <p>Lead not found.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Lead Progress Sidebar - Absolutely positioned */}
      <LeadProgress 
        leadName={lead?.name || 'Unknown Lead'}
        currentStep={currentStep}
        progress={totalScore}
        onStepChange={handleStepChange}
      />

      {/* Header Section - Fixed */}
      <div className="flex-none p-4 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{lead?.name}</h1>
            <p className="text-sm text-gray-600">{lead?.company} • {lead?.email}</p>
          </div>
          <Badge variant={lead?.lead_type === 'b2b' ? 'default' : 'secondary'}>
            {lead?.lead_type?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Section - Takes most of the space */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          {/* Chat Header */}
          <div className="flex-none px-6 py-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lead Conversation</h2>
          </div>

          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading messages...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 animate-fade-in ${
                          msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.sender !== 'user' && (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <p className={`text-xs mt-2 ${
                            msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        {msg.sender === 'user' && (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Message Input - Fixed at bottom */}
          <div className="flex-none p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[44px] max-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
              <Button 
                type="submit" 
                disabled={sendMessageMutation.isPending || !message.trim()}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>

        {/* Right Sidebar - Lead Info and BANT Scoring */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Lead Info */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Lead Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Name:</span> 
                    <span className="text-gray-900">{lead?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Email:</span> 
                    <span className="text-gray-900 truncate ml-2">{lead?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Company:</span> 
                    <span className="text-gray-900">{lead?.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Phone:</span> 
                    <span className="text-gray-900">{lead?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span> 
                    <Badge variant="outline" className="text-xs">{lead?.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* BANT Scoring */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4" />
                    BANT Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalScore.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600">Overall Score</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-medium">Budget</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.budget_score}
                        onChange={(e) => handleScoreChange('budget_score', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-xs text-gray-600 mt-1">{scores.budget_score}%</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-medium">Authority</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.authority_score}
                        onChange={(e) => handleScoreChange('authority_score', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-xs text-gray-600 mt-1">{scores.authority_score}%</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-3 w-3 text-purple-600" />
                        <span className="text-sm font-medium">Need</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.need_score}
                        onChange={(e) => handleScoreChange('need_score', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-xs text-gray-600 mt-1">{scores.need_score}%</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3 text-orange-600" />
                        <span className="text-sm font-medium">Timeline</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.timeline_score}
                        onChange={(e) => handleScoreChange('timeline_score', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-xs text-gray-600 mt-1">{scores.timeline_score}%</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveScores} 
                    className="w-full text-sm"
                    disabled={updateScoresMutation.isPending}
                  >
                    {updateScoresMutation.isPending ? 'Saving...' : 'Save Scores'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadChat;
