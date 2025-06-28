
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, User, Bot, Target, DollarSign, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

const LeadChat = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
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

  const totalScore = (scores.budget_score + scores.authority_score + scores.need_score + scores.timeline_score) / 4;

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-gray-600">{lead.company} • {lead.email}</p>
        </div>
        <Badge variant={lead.lead_type === 'b2b' ? 'default' : 'secondary'}>
          {lead.lead_type?.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Lead Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messagesLoading ? (
                  <div className="text-center py-4">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={sendMessageMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Lead Details & BANT Scoring */}
        <div className="space-y-6">
          {/* Lead Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Name:</span> {lead.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {lead.email}
              </div>
              <div>
                <span className="font-medium">Company:</span> {lead.company}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {lead.phone || 'Not provided'}
              </div>
              <div>
                <span className="font-medium">Website:</span> {lead.website || 'Not provided'}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <Badge variant="outline" className="ml-2">{lead.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* BANT Scoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                BANT Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {totalScore.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Budget</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores.budget_score}
                  onChange={(e) => handleScoreChange('budget_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-600">{scores.budget_score}%</div>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Authority</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores.authority_score}
                  onChange={(e) => handleScoreChange('authority_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-600">{scores.authority_score}%</div>
                
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Need</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores.need_score}
                  onChange={(e) => handleScoreChange('need_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-600">{scores.need_score}%</div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Timeline</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores.timeline_score}
                  onChange={(e) => handleScoreChange('timeline_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-600">{scores.timeline_score}%</div>
              </div>
              
              <Button 
                onClick={handleSaveScores} 
                className="w-full"
                disabled={updateScoresMutation.isPending}
              >
                {updateScoresMutation.isPending ? 'Saving...' : 'Save Scores'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadChat;
