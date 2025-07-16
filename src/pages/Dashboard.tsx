import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  TrendingUp,
  MessageCircle,
  Plus,
  ArrowRight,
  Building2,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [companyNotSet, setCompanyNotSet] = useState(false);

  useEffect(() => {
    const checkCompanySetup = async () => {
      if (!user) {
        setCheckingSetup(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("company_name")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (!profile || !profile.company_name) {
          setCompanyNotSet(true);
        }
      } catch (error) {
        console.error("Error checking company setup:", error);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkCompanySetup();
  }, [user]);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["dashboard-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(
          `
          *,
          lead_scores (
            total_score
          )
        `
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalLeads = leads.length;
  const scoredLeads = leads.filter(
    (lead) => lead.lead_scores?.[0]?.total_score
  ).length;
  const highQualityLeads = leads.filter(
    (lead) =>
      lead.lead_scores?.[0]?.total_score &&
      lead.lead_scores[0].total_score >= 70
  ).length;
  const averageScore =
    scoredLeads > 0
      ? leads
          .filter((lead) => lead.lead_scores?.[0]?.total_score)
          .reduce(
            (sum, lead) => sum + (lead.lead_scores?.[0]?.total_score || 0),
            0
          ) / scoredLeads
      : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (checkingSetup) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p
            className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1
            className={`text-3xl ${
              isDarkMode ? "text-gray-300" : "text-gray-900"
            } font-bold`}
          >
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's your sales overview.
          </p>
        </div>
        <Button onClick={() => navigate("/leads")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      {companyNotSet && (
        <div
          className={`p-4 rounded-md border flex justify-between items-center ${
            isDarkMode
              ? "bg-yellow-900 text-yellow-200 border-yellow-700"
              : "bg-yellow-100 text-yellow-800 border-yellow-300"
          }`}
        >
          <div>
            <strong>Company profile not set up yet.</strong>
            <p className="text-sm">Please complete your company setup</p>
          </div>
          <Button className="ml-4" onClick={() => navigate("/company-setup")}>
            Go to Setup
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Active prospects in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scored Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoredLeads}</div>
            <p className="text-xs text-muted-foreground">
              Leads with BANT scores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Quality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highQualityLeads}</div>
            <p className="text-xs text-muted-foreground">Score 70%+ leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall lead quality
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <Button variant="outline" onClick={() => navigate("/leads")}>
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first lead to begin the sales process
              </p>
              <Button onClick={() => navigate("/leads")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Lead
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-gray-600">
                        {lead.company} • {lead.email}
                      </p>
                    </div>
                    <Badge
                      variant={
                        lead.lead_type === "b2b" ? "default" : "secondary"
                      }
                    >
                      {lead.lead_type?.toUpperCase()}
                    </Badge>
                    {lead.lead_scores?.[0]?.total_score && (
                      <div
                        className={`text-sm font-medium ${getScoreColor(
                          lead.lead_scores[0].total_score
                        )}`}
                      >
                        {lead.lead_scores[0].total_score}% BANT
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/lead/${lead.id}`)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/company-setup")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Company Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Configure your company profile and product catalog
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/lead-qualification")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Lead Qualification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Qualify and enrich your leads with detailed insights
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/analytics")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track performance and conversion metrics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;