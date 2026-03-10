/**
 * Research Lab Management Page
 * Comprehensive interface for managing research, labs, queues, and bonuses
 * @component
 */

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Zap,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  Clock,
  Layers,
} from "lucide-react";

interface ResearchItem {
  id: string;
  techId: string;
  techName: string;
  techBranch: string;
  progressPercent: number;
  turnsRemaining: number;
  priority: string;
  status: string;
}

export default function ResearchLabPage() {
  const queryClient = useQueryClient();
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("normal");

  // Fetch active lab
  const { data: labData, isLoading: labLoading } = useQuery({
    queryKey: ["activeLab"],
    queryFn: async () => {
      const res = await fetch("/api/research/labs/active");
      return res.json();
    }
  });

  // Fetch research queue
  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ["researchQueue"],
    queryFn: async () => {
      const res = await fetch("/api/research/queue");
      return res.json();
    }
  });

  // Fetch bonuses
  const { data: bonusesData } = useQuery({
    queryKey: ["activeBonuses"],
    queryFn: async () => {
      const res = await fetch("/api/research/bonuses/active");
      return res.json();
    }
  });

  // Fetch speed multiplier
  const { data: multiplierData } = useQuery({
    queryKey: ["speedMultiplier"],
    queryFn: async () => {
      const res = await fetch("/api/research/speed-multiplier");
      return res.json();
    }
  });

  // Fetch diagnostics
  const { data: diagnosticsData } = useQuery({
    queryKey: ["labDiagnostics"],
    queryFn: async () => {
      const res = await fetch("/api/research/diagnostics");
      return res.json();
    }
  });

  // Mutation: Add to queue
  const addToQueueMutation = useMutation({
    mutationFn: async (data: { techId: string; priority: string }) => {
      const res = await fetch("/api/research/queue/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
      queryClient.invalidateQueries({ queryKey: ["labDiagnostics"] });
      setSelectedTech("");
    },
  });

  // Mutation: Remove from queue
  const removeFromQueueMutation = useMutation({
    mutationFn: async (queueItemId: string) => {
      const res = await fetch("/api/research/queue/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueItemId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
    },
  });

  // Mutation: Accelerate research
  const accelerateMutation = useMutation({
    mutationFn: async (data: { queueItemId: string; speedupPercent: number }) => {
      const res = await fetch("/api/research/accelerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchQueue"] });
    },
  });

  if (labLoading || queueLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p>Loading research labs...</p>
        </div>
      </div>
    );
  }

  const activeResearch = queueData?.queue?.[0];
  const allBonuses = bonusesData?.bonuses || [];
  const queue = queueData?.queue || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-8 h-8" />
              Research Lab Administration
            </h1>
            <p className="text-blue-100 mt-2">
              {labData?.lab?.name} (Type: {labData?.lab?.type})
            </p>
          </div>
          <div className="bg-blue-700 rounded-lg p-4">
            <div className="text-sm text-blue-100">Speed Multiplier</div>
            <div className="text-3xl font-bold">
              {multiplierData?.multiplier}x
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Research */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Active Research</span>
          </div>
          <p className="text-2xl font-bold">
            {activeResearch?.techName || "None"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {activeResearch?.progressPercent || 0}% complete
          </p>
        </div>

        {/* Queue  */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-semibold">Queue Length</span>
          </div>
          <p className="text-2xl font-bold">{queue.length}</p>
          <p className="text-gray-400 text-sm mt-2">
            {Math.max(0, queue.length - 1)} waiting
          </p>
        </div>

        {/* Active Bonuses */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Active Bonuses</span>
          </div>
          <p className="text-2xl font-bold">{allBonuses.length}</p>
          <p className="text-gray-400 text-sm mt-2">
            Speed boost active
          </p>
        </div>

        {/* Lab Durability */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Lab Durability</span>
          </div>
          <p className="text-2xl font-bold">
            {diagnosticsData?.diagnostics?.labDurability || 100}%
          </p>
          <p className="text-gray-400 text-sm mt-2">Operational</p>
        </div>
      </div>

      {/* Current Research Details */}
      {activeResearch && (
        <div className="bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-100">
                Current Research: {activeResearch.techName}
              </h3>
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex justify-between text-sm text-yellow-200 mb-1">
                    <span>Progress</span>
                    <span>{activeResearch.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-yellow-950 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${activeResearch.progressPercent}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-yellow-200">
                  ⏱️ {activeResearch.turnsRemaining} turns remaining
                </p>
              </div>

              {/* Acceleration Buttons */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    onClick={() =>
                      accelerateMutation.mutate({
                        queueItemId: activeResearch.id,
                        speedupPercent: percent,
                      })
                    }
                    disabled={accelerateMutation.isPending}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-2 py-1 rounded text-sm font-semibold transition"
                  >
                    +{percent}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add to Queue */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Queue Research
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Technology
              </label>
              <input
                type="text"
                placeholder="Tech ID..."
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="low">Low 🟢</option>
                <option value="normal">Normal 🟡</option>
                <option value="high">High 🔴</option>
                <option value="critical">Critical 🚨</option>
              </select>
            </div>
            <button
              onClick={() =>
                addToQueueMutation.mutate({
                  techId: selectedTech,
                  priority: selectedPriority,
                })
              }
              disabled={addToQueueMutation.isPending || !selectedTech}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded font-semibold transition"
            >
              {addToQueueMutation.isPending ? "Adding..." : "Add to Queue"}
            </button>
          </div>
        </div>

        {/* Research Queue */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Research Queue ({queue.length})
          </h2>

          {queue.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Queue is empty. Add research to get started!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {queue.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  className={`p-3 rounded border-l-4 transition ${
                    idx === 0
                      ? "bg-green-900 border-green-400"
                      : "bg-gray-700 border-gray-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {idx + 1}. {item.techName}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        <span className="inline-block mr-2">
                          🌳 {item.techBranch}
                        </span>
                        <span className="inline-block mr-2">
                          ⭐ Priority: {item.priority}
                        </span>
                      </div>
                      {idx === 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.progressPercent}%</span>
                            <span className="text-gray-400">
                              {item.turnsRemaining} turns
                            </span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-1">
                            <div
                              className="bg-green-500 h-1 rounded-full"
                              style={{
                                width: `${item.progressPercent}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      {idx > 0 && (
                        <>
                          <button
                            className="p-1 hover:bg-gray-600 rounded transition"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-600 rounded transition"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          removeFromQueueMutation.mutate(item.id)
                        }
                        disabled={removeFromQueueMutation.isPending}
                        className="p-1 hover:bg-red-600 rounded transition text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Bonuses */}
      {allBonuses.length > 0 && (
        <div className="bg-green-900 rounded-lg p-4 border border-green-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-100">
            <Zap className="w-5 h-5" />
            Active Bonuses ({allBonuses.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allBonuses.map((bonus: any) => (
              <div key={bonus.id} className="bg-green-800 rounded p-3">
                <div className="font-semibold text-green-100">{bonus.name}</div>
                <p className="text-sm text-green-200 mt-1">
                  {bonus.description}
                </p>
                {bonus.speedBonus && (
                  <p className="text-xs text-green-300 mt-2">
                    Speed Boost: +{(bonus.speedBonus * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
