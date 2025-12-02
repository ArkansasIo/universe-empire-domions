import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Send, Trash2, Reply, AlertCircle, User, Shield, Flag, Skull, Crosshair } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { messages, sendMessage, markMessageRead, deleteMessage } = useGame();
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const inbox = messages.filter(m => m.to === "Commander");
  const sent = messages.filter(m => m.from === "Commander");

  const activeMessage = messages.find(m => m.id === selectedMsg);

  const handleSend = () => {
     if (!composeTo || !composeSubject || !composeBody) {
        alert("Please fill in all fields.");
        return;
     }
     sendMessage(composeTo, composeSubject, composeBody);
     setComposeTo("");
     setComposeSubject("");
     setComposeBody("");
     // Switch to sent tab or show success?
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Subspace Communications</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Encrypted messaging terminal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
           {/* Message List */}
           <Card className="bg-white border-slate-200 col-span-1 flex flex-col">
              <Tabs defaultValue="inbox" className="flex-1 flex flex-col">
                 <div className="p-4 border-b border-slate-100">
                    <TabsList className="w-full grid grid-cols-3">
                       <TabsTrigger value="inbox">Inbox</TabsTrigger>
                       <TabsTrigger value="sent">Sent</TabsTrigger>
                       <TabsTrigger value="compose">Compose</TabsTrigger>
                    </TabsList>
                 </div>

                 <TabsContent value="inbox" className="flex-1 p-0 m-0 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1">
                       {inbox.length === 0 && <div className="p-8 text-center text-slate-500">No messages received.</div>}
                       {inbox.map(msg => (
                          <div 
                             key={msg.id} 
                             className={cn(
                                "p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors",
                                selectedMsg === msg.id && "bg-blue-50 border-l-4 border-l-primary",
                                !msg.read && "bg-slate-50 font-bold"
                             )}
                             onClick={() => {
                                setSelectedMsg(msg.id);
                                markMessageRead(msg.id);
                             }}
                          >
                             <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-sm flex items-center gap-1", !msg.read ? "text-slate-900" : "text-slate-600")}>
                                   {msg.type === "combat" && <Crosshair className="w-3 h-3 text-red-500" />}
                                   {msg.from}
                                </span>
                                <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                             </div>
                             <div className={cn("text-sm truncate", !msg.read ? "text-slate-900" : "text-slate-500")}>{msg.subject}</div>
                          </div>
                       ))}
                    </ScrollArea>
                 </TabsContent>

                 <TabsContent value="sent" className="flex-1 p-0 m-0 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1">
                       {sent.length === 0 && <div className="p-8 text-center text-slate-500">No messages sent.</div>}
                       {sent.map(msg => (
                          <div 
                             key={msg.id} 
                             className={cn(
                                "p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors",
                                selectedMsg === msg.id && "bg-blue-50 border-l-4 border-l-primary"
                             )}
                             onClick={() => setSelectedMsg(msg.id)}
                          >
                             <div className="flex justify-between items-start mb-1">
                                <span className="text-sm text-slate-600">To: {msg.to}</span>
                                <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                             </div>
                             <div className="text-sm text-slate-500 truncate">{msg.subject}</div>
                          </div>
                       ))}
                    </ScrollArea>
                 </TabsContent>
                 
                 <TabsContent value="compose" className="flex-1 p-4 m-0 space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-500">Recipient</label>
                       <Input 
                          placeholder="Player Name or Coordinates" 
                          value={composeTo}
                          onChange={e => setComposeTo(e.target.value)}
                          className="bg-slate-50 border-slate-200"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-500">Subject</label>
                       <Input 
                          placeholder="Subject" 
                          value={composeSubject}
                          onChange={e => setComposeSubject(e.target.value)}
                          className="bg-slate-50 border-slate-200"
                       />
                    </div>
                    <div className="space-y-2 flex-1">
                       <label className="text-xs font-bold uppercase text-slate-500">Message</label>
                       <Textarea 
                          placeholder="Type your message..." 
                          value={composeBody}
                          onChange={e => setComposeBody(e.target.value)}
                          className="bg-slate-50 border-slate-200 h-[200px] resize-none"
                       />
                    </div>
                    <Button className="w-full" onClick={handleSend}>
                       <Send className="w-4 h-4 mr-2" /> Send Transmission
                    </Button>
                 </TabsContent>
              </Tabs>
           </Card>

           {/* Message Reader */}
           <Card className="bg-white border-slate-200 lg:col-span-2 flex flex-col h-full">
              {activeMessage ? (
                 <>
                    <CardHeader className="border-b border-slate-100 pb-4">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <CardTitle className="text-xl font-bold text-slate-900">{activeMessage.subject}</CardTitle>
                             <div className="flex items-center gap-2 text-sm text-slate-500">
                                <User className="w-4 h-4" />
                                <span>{activeMessage.from === "Commander" ? `To: ${activeMessage.to}` : `From: ${activeMessage.from}`}</span>
                                <span className="text-slate-300">|</span>
                                <span>{new Date(activeMessage.timestamp).toLocaleString()}</span>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             {activeMessage.type === "system" && <Badge variant="outline" className="border-blue-200 text-blue-600">System</Badge>}
                             {activeMessage.type === "combat" && <Badge variant="outline" className="border-red-200 text-red-600">Combat Report</Badge>}
                             {activeMessage.type === "alliance" && <Badge variant="outline" className="border-green-200 text-green-600">Alliance</Badge>}
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 overflow-y-auto">
                       {activeMessage.battleReport ? (
                          <div className="space-y-6">
                             <div className="flex justify-between items-center bg-slate-100 p-4 rounded">
                                <div className="text-center">
                                   <div className="font-bold text-lg text-slate-900">Attacker</div>
                                   <div className="text-red-600 font-mono">Lost: {activeMessage.battleReport.attackerLosses.toLocaleString()}</div>
                                </div>
                                <div className="font-orbitron text-2xl font-bold text-slate-900 bg-white px-4 py-2 rounded border border-slate-200">
                                   {activeMessage.battleReport.winner === "attacker" ? "VICTORY" : activeMessage.battleReport.winner === "defender" ? "DEFEAT" : "DRAW"}
                                </div>
                                <div className="text-center">
                                   <div className="font-bold text-lg text-slate-900">Defender</div>
                                   <div className="text-red-600 font-mono">Lost: {activeMessage.battleReport.defenderLosses.toLocaleString()}</div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                   <div className="font-bold text-sm uppercase text-slate-500 mb-2">Loot Obtained</div>
                                   <div className="space-y-1 font-mono text-sm">
                                      <div className="flex justify-between"><span>Metal:</span> <span className="text-slate-900">{activeMessage.battleReport.loot.metal.toLocaleString()}</span></div>
                                      <div className="flex justify-between"><span>Crystal:</span> <span className="text-blue-600">{activeMessage.battleReport.loot.crystal.toLocaleString()}</span></div>
                                      <div className="flex justify-between"><span>Deuterium:</span> <span className="text-green-600">{activeMessage.battleReport.loot.deuterium.toLocaleString()}</span></div>
                                   </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                   <div className="font-bold text-sm uppercase text-slate-500 mb-2">Debris Field</div>
                                   <div className="space-y-1 font-mono text-sm">
                                      <div className="flex justify-between"><span>Metal:</span> <span className="text-slate-900">{activeMessage.battleReport.debris.metal.toLocaleString()}</span></div>
                                      <div className="flex justify-between"><span>Crystal:</span> <span className="text-blue-600">{activeMessage.battleReport.debris.crystal.toLocaleString()}</span></div>
                                   </div>
                                </div>
                             </div>

                             <div className="bg-slate-900 text-green-400 p-4 rounded font-mono text-xs h-40 overflow-y-auto">
                                {activeMessage.battleReport.log.map((line, i) => (
                                   <div key={i}>{line}</div>
                                ))}
                             </div>
                          </div>
                       ) : (
                          <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                             {activeMessage.body}
                          </div>
                       )}
                    </CardContent>
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 rounded-b-lg">
                       {activeMessage.from !== "Commander" && activeMessage.type !== "combat" && (
                          <Button variant="outline" onClick={() => {
                             setComposeTo(activeMessage.from);
                             setComposeSubject(`Re: ${activeMessage.subject}`);
                          }}>
                             <Reply className="w-4 h-4 mr-2" /> Reply
                          </Button>
                       )}
                       <Button variant="destructive" onClick={() => {
                          deleteMessage(activeMessage.id);
                          setSelectedMsg(null);
                       }}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                       </Button>
                    </div>
                 </>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <Mail className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select a message to read</p>
                 </div>
              )}
           </Card>
        </div>
      </div>
    </GameLayout>
  );
}
