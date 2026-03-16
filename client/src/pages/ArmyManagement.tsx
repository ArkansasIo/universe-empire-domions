/**
 * Army Management Page
 * Complete UI for training, deploying, and managing military forces
 * @tag #ui #military #management #page
 */

import React, { useState } from 'react';
import GameLayout from '@/components/layout/GameLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Shield,
  Zap,
  Users,
  Sword,
  Target,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useMilitaryForce,
  useArmySubsystems,
  useTrainUnit,
  useDismissUnit,
  useDeployCampaign,
  useActiveCampaigns,
  useCompleteCampaign,
} from '@/hooks/useCivilizationArmy';
import type { ArmyUnit, ArmySubsystem } from '@shared/types/civilization';

type SortBy = 'tier' | 'type' | 'cost' | 'power';

const roleColors: Record<
  'commander' | 'captain' | 'sergeant' | 'specialist' | 'operator' | 'support',
  string
> = {
  commander: 'bg-red-500 text-white',
  captain: 'bg-orange-500 text-white',
  sergeant: 'bg-yellow-500 text-white',
  specialist: 'bg-blue-500 text-white',
  operator: 'bg-purple-500 text-white',
  support: 'bg-green-500 text-white',
};

const roleIcons: Record<
  'commander' | 'captain' | 'sergeant' | 'specialist' | 'operator' | 'support',
  React.ReactNode
> = {
  commander: <Sword className="w-4 h-4" />,
  captain: <Shield className="w-4 h-4" />,
  sergeant: <Users className="w-4 h-4" />,
  specialist: <Target className="w-4 h-4" />,
  operator: <Gauge className="w-4 h-4" />,
  support: <Zap className="w-4 h-4" />,
};

export default function ArmyManagement() {
  const { data: militaryForce, isLoading: forceLoading } = useMilitaryForce();
  const { data: subsystems, isLoading: subsystemsLoading } = useArmySubsystems();
  const { data: campaigns } = useActiveCampaigns();
  const trainUnitMutation = useTrainUnit();
  const dismissUnitMutation = useDismissUnit();
  const deployCampaignMutation = useDeployCampaign();
  const completeCampaignMutation = useCompleteCampaign();

  const [trainModalOpen, setTrainModalOpen] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<string | null>(null);
  const [trainQuantity, setTrainQuantity] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>('tier');
  const [searchTerm, setSearchTerm] = useState('');

  if (forceLoading || subsystemsLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading military data...</div>
        </div>
      </GameLayout>
    );
  }

  const force = militaryForce?.force || {
    playerId: '',
    squadrons: [],
    totalStrength: 0,
    totalMorale: 50,
    averageExperience: 0,
    commanderBonus: 0,
  };

  const sortedSubsystems: ArmySubsystem[] = subsystems
    ? [...subsystems]
      .filter((subsystem: ArmySubsystem) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          subsystem.name.toLowerCase().includes(term) ||
          subsystem.type.toLowerCase().includes(term) ||
          subsystem.role.toLowerCase().includes(term)
        );
      })
      .sort((a: ArmySubsystem, b: ArmySubsystem) => {
        switch (sortBy) {
          case 'tier':
            return b.tier - a.tier;
          case 'type':
            return a.type.localeCompare(b.type);
          case 'cost':
            return b.cost.credits - a.cost.credits;
          case 'power':
            return (b.combat.attack + b.combat.defense) -
              (a.combat.attack + a.combat.defense);
          default:
            return 0;
        }
      })
    : [];

  const activeCampaigns = campaigns || [];

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900">Military Command</h1>
            <p className="text-sm text-slate-600">
              Manage your military forces and operations
            </p>
          </div>
          <Button
            onClick={() => setTrainModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            <Sword className="w-4 h-4 mr-2" />
            Train Unit
          </Button>
        </div>

        {/* Military Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">{force.totalStrength}</div>
                <div className="text-sm text-slate-600">Total Strength</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Gauge className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">
                  {force.totalMorale}%
                </div>
                <div className="text-sm text-slate-600">Morale</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">
                  {force.averageExperience}
                </div>
                <div className="text-sm text-slate-600">Avg Experience</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">
                  +{force.commanderBonus}%
                </div>
                <div className="text-sm text-slate-600">Commander Bonus</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="units" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="units">Active Units</TabsTrigger>
            <TabsTrigger value="training">
              Training ({sortedSubsystems?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              Campaigns ({activeCampaigns.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Units Tab */}
          <TabsContent value="units" className="space-y-4">
            {force.squadrons.length === 0 ? (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-slate-600">
                    No active units. Start by training units below.
                  </p>
                </CardContent>
              </Card>
            ) : (
              force.squadrons.map((unit: ArmyUnit) => (
                <Card
                  key={unit.id}
                  className="bg-white border-slate-200 hover:border-slate-300 transition shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">
                            {unit.quantity}x Unit
                          </h3>
                          <Badge className={roleColors.commander}>
                            Level {unit.level}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round((unit.health / (unit.quantity * 100)) * 100)}% Health
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
                          <div>
                            <span className="text-slate-500">Morale:</span>{' '}
                            <span className="text-slate-900 font-semibold">
                              {unit.morale}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Experience:</span>{' '}
                            <span className="text-slate-900 font-semibold">
                              {unit.experience}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Location:</span>{' '}
                            <span className="text-slate-900 font-semibold">
                              {unit.location
                                ? `Sector ${unit.location.galaxy}`
                                : 'Home Base'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissUnitMutation.mutate(unit.id)}
                          className="text-red-400 border-red-400 hover:bg-red-900"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="search"
                placeholder="Search units..."
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-800"
              >
                <option value="tier">Sort by Tier</option>
                <option value="type">Sort by Type</option>
                <option value="cost">Sort by Cost</option>
                <option value="power">Sort by Power</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedSubsystems.map((subsystem) => (
                <Card
                  key={subsystem.id}
                  className="bg-white border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-sm"
                  onClick={() => setSelectedUnitType(subsystem.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{subsystem.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge>{subsystem.tier}-Star</Badge>
                          <Badge variant="outline">{subsystem.type}</Badge>
                          <div className={cn('px-2 py-0.5 rounded text-xs', roleColors[subsystem.role])}>
                            {roleIcons[subsystem.role]}
                            <span className="ml-1">{subsystem.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600">{subsystem.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">ATK</div>
                        <div className="font-bold text-rose-600">{subsystem.combat.attack}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">DEF</div>
                        <div className="font-bold text-blue-600">{subsystem.combat.defense}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">HP</div>
                        <div className="font-bold text-emerald-600">{subsystem.combat.health}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="text-slate-500">SPD</div>
                        <div className="font-bold text-amber-600">{subsystem.combat.speed}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded text-sm border border-slate-200">
                      <div className="text-slate-600">Cost: {subsystem.cost.credits} Credits</div>
                      <div className="text-slate-600">Crew: {subsystem.minCrewRequired} min</div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => {
                        setSelectedUnitType(subsystem.id);
                        setTrainModalOpen(true);
                      }}
                    >
                      Train Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            {activeCampaigns.length === 0 ? (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-slate-600">
                    No active campaigns. Deploy a campaign to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeCampaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="bg-white border-blue-200 shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{campaign.name}</h3>
                          <Badge className="bg-blue-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                          <Badge variant="outline">{campaign.type}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Galaxy {campaign.targetGalaxy} - System{' '}
                          {campaign.targetSystem}
                        </p>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-slate-500">Forces:</span>{' '}
                            <span className="font-semibold">
                              {campaign.allocatedForces.length} units
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Duration:</span>{' '}
                            <span className="font-semibold">
                              {campaign.estimatedDuration} turns
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Success Rate:</span>{' '}
                            <span className="font-semibold text-emerald-600">
                              {Math.round((campaign.successRate || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            completeCampaignMutation.mutate({
                              campaignId: campaign.id,
                              successful: true,
                            })
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Succeed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400"
                          onClick={() =>
                            completeCampaignMutation.mutate({
                              campaignId: campaign.id,
                              successful: false,
                            })
                          }
                        >
                          Fail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Train Unit Modal */}
      {trainModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Train Military Unit</CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                Select unit type and quantity to train
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Unit Type
                </label>
                <select
                  value={selectedUnitType || ''}
                  onChange={(e) => setSelectedUnitType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                >
                  <option value="">Select a unit type...</option>
                  {sortedSubsystems.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.cost.credits} credits)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={trainQuantity}
                  onChange={(e) => setTrainQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="bg-white border-slate-300"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded text-sm border border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Total Cost:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedUnitType
                      ? sortedSubsystems.find((u) => u.id === selectedUnitType)
                          ?.cost.credits! * trainQuantity
                      : 0}{' '}
                    Credits
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedUnitType) {
                      trainUnitMutation.mutate({
                        subsystemId: selectedUnitType,
                        quantity: trainQuantity,
                      });
                      setTrainModalOpen(false);
                    }
                  }}
                  disabled={!selectedUnitType}
                >
                  Train
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTrainModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </GameLayout>
  );
}
