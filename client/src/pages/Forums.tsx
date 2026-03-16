import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, Users, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Forums() {
  const featuredThreads = [
    { title: "Empire Opening Build Orders", replies: 184, category: "Strategy" },
    { title: "Civilization Workforce Optimization", replies: 92, category: "Economy" },
    { title: "Fleet Counter Meta - Current Season", replies: 147, category: "Combat" },
    { title: "Alliance Recruitment Board", replies: 231, category: "Diplomacy" },
  ];

  const moderationRules = [
    "No harassment, hate speech, or targeted abuse.",
    "Post battle reports with complete context and evidence.",
    "Keep trade and recruitment in their dedicated channels.",
    "Report exploit discussions privately to admins.",
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-600 hover:text-slate-900" data-testid="button-back-home-forums">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-slate-900 mb-4">Forums</h1>
          <p className="text-xl text-slate-600 font-rajdhani max-w-2xl mx-auto">
            Community coordination hub for Universe-Empires-Dominions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Users className="w-5 h-5 text-blue-500" /> Global Discussions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">Discuss strategy, progression, and patches with other commanders.</p>
              <Link href="/messages">
                <Button variant="outline" className="w-full">Open Messages</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Shield className="w-5 h-5 text-emerald-600" /> Alliance Boards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">Coordinate raids, diplomacy, and support operations with allied players.</p>
              <Link href="/alliance">
                <Button variant="outline" className="w-full">Open Alliance</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-slate-900">Featured Threads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {featuredThreads.map((thread) => (
                <div key={thread.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{thread.title}</div>
                    <div className="text-xs text-slate-500">{thread.category}</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{thread.replies} replies</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Forum Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {moderationRules.map((rule) => (
                <div key={rule} className="text-sm text-slate-600">• {rule}</div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
