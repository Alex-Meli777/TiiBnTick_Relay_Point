'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  User,
  FileText,
  Clock,
  DollarSign,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Save,
  Sparkles,
  Shield,
  MapPin,
  Package,
  Truck,
  AlertCircle,
  Navigation,
  Phone,
  Zap
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LivreurPolicies {
  workingHours: {
    monday: { start: string; end: string; enabled: boolean }
    tuesday: { start: string; end: string; enabled: boolean }
    wednesday: { start: string; end: string; enabled: boolean }
    thursday: { start: string; end: string; enabled: boolean }
    friday: { start: string; end: string; enabled: boolean }
    saturday: { start: string; end: string; enabled: boolean }
    sunday: { start: string; end: string; enabled: boolean }
  }
  deliveryRates: {
    baseRate: number
    perKmRate: number
    minimumRate: number
    expressSurcharge: number
    nightSurcharge: number
    weekendSurcharge: number
    currency: string
  }
  deliveryZones: {
    primaryZone: string[]
    secondaryZone: string[]
    unavailableZones: string
  }
  packageTypes: {
    small: { enabled: boolean; maxWeight: number; rate: number }
    medium: { enabled: boolean; maxWeight: number; rate: number }
    large: { enabled: boolean; maxWeight: number; rate: number }
    heavy: { enabled: boolean; maxWeight: number; rate: number }
    fragile: { enabled: boolean; surcharge: number }
    food: { enabled: boolean; surcharge: number }
    documents: { enabled: boolean; rate: number }
  }
  cancellation: {
    policy: string
    noticeMinutes: number
    cancellationFee: number
  }
  returns: {
    policy: string
    returnFee: number
    conditions: string
  }
  communication: {
    responseTime: string
    preferredChannels: string[]
    callBeforeDelivery: boolean
    smsUpdates: boolean
  }
  vehicle: {
    type: string
    plateNumber: string
    capacity: string
    color: string
    year: string
  }
  general: {
    bio: string
    experience: string
    languages: string[]
    specialServices: string[]
  }
}

const dayNames = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche'
}

export default function LivreurPoliciesPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('working-hours')

  const [policies, setPolicies] = useState<LivreurPolicies>({
    workingHours: {
      monday: { start: '08:00', end: '19:00', enabled: true },
      tuesday: { start: '08:00', end: '19:00', enabled: true },
      wednesday: { start: '08:00', end: '19:00', enabled: true },
      thursday: { start: '08:00', end: '19:00', enabled: true },
      friday: { start: '08:00', end: '19:00', enabled: true },
      saturday: { start: '09:00', end: '18:00', enabled: true },
      sunday: { start: '09:00', end: '14:00', enabled: false },
    },
    deliveryRates: {
      baseRate: 500,
      perKmRate: 100,
      minimumRate: 1000,
      expressSurcharge: 500,
      nightSurcharge: 300,
      weekendSurcharge: 200,
      currency: 'XOF',
    },
    deliveryZones: {
      primaryZone: ['Cocody', 'Plateau', 'Marcory', 'Yopougon'],
      secondaryZone: ['Abobo', 'Treichville', 'Koumassi', 'Port-Bouët'],
      unavailableZones: '',
    },
    packageTypes: {
      small: { enabled: true, maxWeight: 5, rate: 500 },
      medium: { enabled: true, maxWeight: 15, rate: 1000 },
      large: { enabled: true, maxWeight: 30, rate: 2000 },
      heavy: { enabled: false, maxWeight: 50, rate: 4000 },
      fragile: { enabled: true, surcharge: 300 },
      food: { enabled: true, surcharge: 200 },
      documents: { enabled: true, rate: 300 },
    },
    cancellation: {
      policy: 'Annulation gratuite jusqu\'à 30 min avant la prise en charge',
      noticeMinutes: 30,
      cancellationFee: 500,
    },
    returns: {
      policy: 'Les retours sont acceptés sous 24h en cas d\'erreur de livraison',
      returnFee: 1000,
      conditions: 'Le colis doit être en bon état et non ouvert',
    },
    communication: {
      responseTime: '5-10 minutes',
      preferredChannels: ['phone', 'whatsapp'],
      callBeforeDelivery: true,
      smsUpdates: true,
    },
    vehicle: {
      type: 'moto',
      plateNumber: '',
      capacity: '20 kg',
      color: '',
      year: '',
    },
    general: {
      bio: 'Livreur professionnel avec 3 ans d\'expérience. Ponctuel et fiable.',
      experience: '3 ans',
      languages: ['Français'],
      specialServices: ['Livraison express', 'Livraison urgente'],
    },
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policies),
      })

      if (response.ok) {
        toast({
          title: 'Politiques enregistrées',
          description: 'Vos politiques de livraison ont été sauvegardées avec succès',
        })
      } else {
        throw new Error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateWorkingHours = (day: keyof LivreurPolicies['workingHours'], field: 'start' | 'end' | 'enabled', value: string | boolean) => {
    setPolicies(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }))
  }

  const tabs = [
    { id: 'working-hours', label: 'Horaires', icon: Clock },
    { id: 'delivery-rates', label: 'Tarifs', icon: DollarSign },
    { id: 'delivery-zones', label: 'Zones', icon: MapPin },
    { id: 'package-types', label: 'Colis', icon: Package },
    { id: 'cancellation', label: 'Annulation', icon: XCircle },
    { id: 'returns', label: 'Retours', icon: Navigation },
    { id: 'communication', label: 'Communication', icon: MessageCircle },
    { id: 'vehicle', label: 'Véhicule', icon: Truck },
    { id: 'general', label: 'Général', icon: User },
  ]

  const abidjanCommunes = [
    'Abobo', 'Adjamé', 'Attecoubé', 'Cocody', 'Koumassi',
    'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
    'Bingerville', 'Songon', 'Anyama', 'Riviera'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Mes Politiques de Livraison</h1>
              <p className="text-sm text-gray-600">Configurez vos préférences de livraison</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Card */}
          <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Configurez votre activité de livraison</h2>
                  <p className="text-white/90">
                    Définissez vos tarifs, zones de livraison et préférences pour optimiser votre activité.
                    Des paramètres clairs attirent plus de clients et garantissent de meilleures livraisons.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Working Hours */}
              {activeTab === 'working-hours' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      Horaires de disponibilité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Définissez vos disponibilités pour chaque jour de la semaine.
                    </p>
                    <div className="space-y-3">
                      {Object.entries(policies.workingHours).map(([day, schedule]) => (
                        <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Switch
                            checked={schedule.enabled}
                            onCheckedChange={(checked) => updateWorkingHours(day as keyof LivreurPolicies['workingHours'], 'enabled', checked)}
                          />
                          <span className="flex-1 font-medium min-w-[100px]">
                            {dayNames[day as keyof typeof dayNames]}
                          </span>
                          {schedule.enabled && (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                type="time"
                                value={schedule.start}
                                onChange={(e) => updateWorkingHours(day as keyof LivreurPolicies['workingHours'], 'start', e.target.value)}
                                className="w-32"
                              />
                              <span className="text-gray-400">→</span>
                              <Input
                                type="time"
                                value={schedule.end}
                                onChange={(e) => updateWorkingHours(day as keyof LivreurPolicies['workingHours'], 'end', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          )}
                          {!schedule.enabled && (
                            <span className="text-sm text-gray-400">Non disponible</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Rates */}
              {activeTab === 'delivery-rates' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      Tarifs de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="baseRate">Tarif de base: {policies.deliveryRates.baseRate} FCFA</Label>
                      <Slider
                        id="baseRate"
                        min={100}
                        max={2000}
                        step={50}
                        value={[policies.deliveryRates.baseRate]}
                        onValueChange={([value]) =>
                          setPolicies(prev => ({
                            ...prev,
                            deliveryRates: { ...prev.deliveryRates, baseRate: value }
                          }))
                        }
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tarif minimum pour toute livraison
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="perKmRate">Tarif au km: {policies.deliveryRates.perKmRate} FCFA/km</Label>
                      <Slider
                        id="perKmRate"
                        min={50}
                        max={500}
                        step={10}
                        value={[policies.deliveryRates.perKmRate]}
                        onValueChange={([value]) =>
                          setPolicies(prev => ({
                            ...prev,
                            deliveryRates: { ...prev.deliveryRates, perKmRate: value }
                          }))
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="minimumRate">Tarif minimum: {policies.deliveryRates.minimumRate} FCFA</Label>
                      <Slider
                        id="minimumRate"
                        min={500}
                        max={5000}
                        step={100}
                        value={[policies.deliveryRates.minimumRate]}
                        onValueChange={([value]) =>
                          setPolicies(prev => ({
                            ...prev,
                            deliveryRates: { ...prev.deliveryRates, minimumRate: value }
                          }))
                        }
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <Label htmlFor="expressSurcharge">Supplément Express: {policies.deliveryRates.expressSurcharge} FCFA</Label>
                        <Slider
                          id="expressSurcharge"
                          min={0}
                          max={2000}
                          step={50}
                          value={[policies.deliveryRates.expressSurcharge]}
                          onValueChange={([value]) =>
                            setPolicies(prev => ({
                              ...prev,
                              deliveryRates: { ...prev.deliveryRates, expressSurcharge: value }
                            }))
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nightSurcharge">Supplément Nuit: {policies.deliveryRates.nightSurcharge} FCFA</Label>
                        <Slider
                          id="nightSurcharge"
                          min={0}
                          max={2000}
                          step={50}
                          value={[policies.deliveryRates.nightSurcharge]}
                          onValueChange={([value]) =>
                            setPolicies(prev => ({
                              ...prev,
                              deliveryRates: { ...prev.deliveryRates, nightSurcharge: value }
                            }))
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="weekendSurcharge">Supplément Weekend: {policies.deliveryRates.weekendSurcharge} FCFA</Label>
                        <Slider
                          id="weekendSurcharge"
                          min={0}
                          max={2000}
                          step={50}
                          value={[policies.deliveryRates.weekendSurcharge]}
                          onValueChange={([value]) =>
                            setPolicies(prev => ({
                              ...prev,
                              deliveryRates: { ...prev.deliveryRates, weekendSurcharge: value }
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-3">
                      <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-1">Conseil</h4>
                        <p className="text-sm text-orange-800">
                          Des tarifs compétitifs attirent plus de clients. N'oubliez pas d'inclure vos coûts (carburant, entretien, temps).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Zones */}
              {activeTab === 'delivery-zones' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      Zones de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Zone principale (tarifs standard)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {abidjanCommunes.map((commune) => (
                          <button
                            key={commune}
                            onClick={() => {
                              const newPrimary = policies.deliveryZones.primaryZone.includes(commune)
                                ? policies.deliveryZones.primaryZone.filter(c => c !== commune)
                                : [...policies.deliveryZones.primaryZone, commune]
                              const newSecondary = policies.deliveryZones.secondaryZone.filter(c => c !== commune)
                              setPolicies(prev => ({
                                ...prev,
                                deliveryZones: {
                                  ...prev.deliveryZones,
                                  primaryZone: newPrimary,
                                  secondaryZone: newSecondary
                                }
                              }))
                            }}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              policies.deliveryZones.primaryZone.includes(commune)
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            {commune}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Zone secondaire (tarifs majorés)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {abidjanCommunes.map((commune) => (
                          <button
                            key={commune}
                            onClick={() => {
                              const newSecondary = policies.deliveryZones.secondaryZone.includes(commune)
                                ? policies.deliveryZones.secondaryZone.filter(c => c !== commune)
                                : [...policies.deliveryZones.secondaryZone, commune]
                              const newPrimary = policies.deliveryZones.primaryZone.filter(c => c !== commune)
                              setPolicies(prev => ({
                                ...prev,
                                deliveryZones: {
                                  ...prev.deliveryZones,
                                  primaryZone: newPrimary,
                                  secondaryZone: newSecondary
                                }
                              }))
                            }}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              policies.deliveryZones.secondaryZone.includes(commune)
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 hover:border-amber-300'
                            }`}
                          >
                            {commune}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="unavailableZones">Zones non desservies</Label>
                      <Textarea
                        id="unavailableZones"
                        value={policies.deliveryZones.unavailableZones}
                        onChange={(e) =>
                          setPolicies(prev => ({
                            ...prev,
                            deliveryZones: { ...prev.deliveryZones, unavailableZones: e.target.value }
                          }))
                        }
                        className="mt-1"
                        rows={2}
                        placeholder="Séparez les zones par des virgules..."
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Package Types */}
              {activeTab === 'package-types' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      Types de colis acceptés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'small', label: 'Petit colis', icon: '📦', defaultWeight: 5, defaultRate: 500 },
                        { key: 'medium', label: 'Moyen colis', icon: '📦', defaultWeight: 15, defaultRate: 1000 },
                        { key: 'large', label: 'Grand colis', icon: '📦', defaultWeight: 30, defaultRate: 2000 },
                        { key: 'heavy', label: 'Colis lourd', icon: '📦', defaultWeight: 50, defaultRate: 4000 },
                      ].map((pkg) => (
                        <div key={pkg.key} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.enabled || false}
                                onCheckedChange={(checked) =>
                                  setPolicies(prev => ({
                                    ...prev,
                                    packageTypes: {
                                      ...prev.packageTypes,
                                      [pkg.key]: { ...prev.packageTypes[pkg.key as keyof typeof policies.packageTypes], enabled: checked }
                                    }
                                  }))
                                }
                              />
                              <span className="font-semibold">{pkg.label}</span>
                            </div>
                            <span className="text-2xl">{pkg.icon}</span>
                          </div>
                          {policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Poids max:</Label>
                                <Input
                                  type="number"
                                  value={policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.maxWeight || 0}
                                  onChange={(e) =>
                                    setPolicies(prev => ({
                                      ...prev,
                                      packageTypes: {
                                        ...prev.packageTypes,
                                        [pkg.key]: {
                                          ...prev.packageTypes[pkg.key as keyof typeof policies.packageTypes],
                                          maxWeight: parseInt(e.target.value) || 0
                                        }
                                      }
                                    }))
                                  }
                                  className="w-24 h-8 text-sm"
                                />
                                <span className="text-xs text-gray-500">kg</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Supplément:</Label>
                                <Input
                                  type="number"
                                  value={policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.rate || 0}
                                  onChange={(e) =>
                                    setPolicies(prev => ({
                                      ...prev,
                                      packageTypes: {
                                        ...prev.packageTypes,
                                        [pkg.key]: {
                                          ...prev.packageTypes[pkg.key as keyof typeof policies.packageTypes],
                                          rate: parseInt(e.target.value) || 0
                                        }
                                      }
                                    }))
                                  }
                                  className="w-24 h-8 text-sm"
                                />
                                <span className="text-xs text-gray-500">FCFA</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { key: 'fragile', label: 'Objets fragiles', icon: '🔔', surcharge: true },
                        { key: 'food', label: 'Aliments/Repas', icon: '🍔', surcharge: true },
                        { key: 'documents', label: 'Documents', icon: '📄', surcharge: false },
                      ].map((pkg) => (
                        <div key={pkg.key} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.enabled || false}
                                onCheckedChange={(checked) =>
                                  setPolicies(prev => ({
                                    ...prev,
                                    packageTypes: {
                                      ...prev.packageTypes,
                                      [pkg.key]: { ...prev.packageTypes[pkg.key as keyof typeof policies.packageTypes], enabled: checked }
                                    }
                                  }))
                                }
                              />
                              <span className="font-semibold">{pkg.label}</span>
                            </div>
                            <span className="text-2xl">{pkg.icon}</span>
                          </div>
                          {policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.enabled && pkg.surcharge && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Supplément:</Label>
                              <Input
                                type="number"
                                value={policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.surcharge || 0}
                                onChange={(e) =>
                                  setPolicies(prev => ({
                                    ...prev,
                                    packageTypes: {
                                      ...prev.packageTypes,
                                      [pkg.key]: {
                                        ...prev.packageTypes[pkg.key as keyof typeof policies.packageTypes],
                                        surcharge: parseInt(e.target.value) || 0
                                      }
                                    }
                                  }))
                                }
                                className="w-24 h-8 text-sm"
                              />
                              <span className="text-xs text-gray-500">FCFA</span>
                            </div>
                          )}
                          {policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.enabled && !pkg.surcharge && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Tarif:</Label>
                              <Input
                                type="number"
                                value={policies.packageTypes[pkg.key as keyof typeof policies.packageTypes]?.rate || 0}
                                onChange={(e) =>
                                  setPolicies(prev => ({
                                    ...prev,
                                    packageTypes: {
                                      ...prev.packageTypes,
                                      [pkg.key]: {
                                        ...prev.packageTypes[pkg.key as keyof typeof policies.packageTypes],
                                        rate: parseInt(e.target.value) || 0
                                      }
                                    }
                                  }))
                                }
                                className="w-24 h-8 text-sm"
                              />
                              <span className="text-xs text-gray-500">FCFA</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cancellation */}
              {activeTab === 'cancellation' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-orange-600" />
                      Politique d'annulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="cancellationPolicy">Politique d'annulation</Label>
                      <Textarea
                        id="cancellationPolicy"
                        value={policies.cancellation.policy}
                        onChange={(e) =>
                          setPolicies(prev => ({
                            ...prev,
                            cancellation: { ...prev.cancellation, policy: e.target.value }
                          }))
                        }
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="noticeMinutes">Préavis requis: {policies.cancellation.noticeMinutes} minutes</Label>
                      <Slider
                        id="noticeMinutes"
                        min={5}
                        max={120}
                        step={5}
                        value={[policies.cancellation.noticeMinutes]}
                        onValueChange={([value]) =>
                          setPolicies(prev => ({
                            ...prev,
                            cancellation: { ...prev.cancellation, noticeMinutes: value }
                          }))
                        }
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Délai minimum pour annuler sans frais
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="cancellationFee">Frais d'annulation: {policies.cancellation.cancellationFee} FCFA</Label>
                      <Slider
                        id="cancellationFee"
                        min={0}
                        max={5000}
                        step={100}
                        value={[policies.cancellation.cancellationFee]}
                        onValueChange={([value]) =>
                          setPolicies(prev => ({
                            ...prev,
                            cancellation: { ...prev.cancellation, cancellationFee: value }
                          }))
                        }
                        className="mt-2"
                      />
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-1">Conseil</h4>
                        <p className="text-sm text-orange-800">
                          Une politique d'annulation claire protège votre temps et vos revenus. Communiquez-la clairement aux clients.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Returns */}
              {activeTab === 'returns' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-orange-600" />
                      Politique de retours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="returnPolicy">Politique de retour</Label>
                      <Textarea
                        id="returnPolicy"
                        value={policies.returns.policy}
                        onChange={(e) =>
                          setPolicies(prev => ({
                            ...prev,
                            returns: { ...prev.returns, policy: e.target.value }
                          }))
                        }
                        className="mt-1"
                        rows={3}
                        placeholder="Décrivez dans quelles conditions vous acceptez les retours..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="returnFee">Frais de retour: {policies.returns.returnFee} FCFA</Label>
                      <Slider
                        id="returnFee"
                        min={0}
                        max={10000}
                        step={100}
                        value={[policies.returns.returnFee]}
                        onValueChange={([value]) =>
                          setPolicies(prev => ({
                            ...prev,
                            returns: { ...prev.returns, returnFee: value }
                          }))
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="returnConditions">Conditions de retour</Label>
                      <Textarea
                        id="returnConditions"
                        value={policies.returns.conditions}
                        onChange={(e) =>
                          setPolicies(prev => ({
                            ...prev,
                            returns: { ...prev.returns, conditions: e.target.value }
                          }))
                        }
                        className="mt-1"
                        rows={3}
                        placeholder="Précisez les conditions d'acceptation des retours..."
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Communication */}
              {activeTab === 'communication' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                      Préférences de communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="responseTime">Temps de réponse habituel</Label>
                      <Select
                        value={policies.communication.responseTime}
                        onValueChange={(value) =>
                          setPolicies(prev => ({
                            ...prev,
                            communication: { ...prev.communication, responseTime: value }
                          }))
                        }
                      >
                        <SelectTrigger id="responseTime" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-10 minutes">5-10 minutes</SelectItem>
                          <SelectItem value="10-30 minutes">10-30 minutes</SelectItem>
                          <SelectItem value="30-60 minutes">30-60 minutes</SelectItem>
                          <SelectItem value="1-2 heures">1-2 heures</SelectItem>
                          <SelectItem value="2-4 heures">2-4 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="font-medium">Appeler avant livraison</Label>
                        <p className="text-sm text-gray-500">Appeler le client à l'arrivée</p>
                      </div>
                      <Switch
                        checked={policies.communication.callBeforeDelivery}
                        onCheckedChange={(checked) =>
                          setPolicies(prev => ({
                            ...prev,
                            communication: { ...prev.communication, callBeforeDelivery: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="font-medium">Envoyer des mises à jour SMS</Label>
                        <p className="text-sm text-gray-500">Notifier le client de l'avancement</p>
                      </div>
                      <Switch
                        checked={policies.communication.smsUpdates}
                        onCheckedChange={(checked) =>
                          setPolicies(prev => ({
                            ...prev,
                            communication: { ...prev.communication, smsUpdates: checked }
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Canaux de communication préférés</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['phone', 'whatsapp', 'email', 'sms'].map((channel) => (
                          <button
                            key={channel}
                            onClick={() => {
                              const newChannels = policies.communication.preferredChannels.includes(channel)
                                ? policies.communication.preferredChannels.filter(c => c !== channel)
                                : [...policies.communication.preferredChannels, channel]
                              setPolicies(prev => ({
                                ...prev,
                                communication: { ...prev.communication, preferredChannels: newChannels }
                              }))
                            }}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              policies.communication.preferredChannels.includes(channel)
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {policies.communication.preferredChannels.includes(channel) ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                              )}
                              <span className="font-medium">
                                {channel === 'phone' ? 'Téléphone' :
                                 channel === 'whatsapp' ? 'WhatsApp' :
                                 channel === 'email' ? 'Email' : 'SMS'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vehicle */}
              {activeTab === 'vehicle' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-orange-600" />
                      Informations véhicule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="vehicleType">Type de véhicule</Label>
                      <Select
                        value={policies.vehicle.type}
                        onValueChange={(value) =>
                          setPolicies(prev => ({
                            ...prev,
                            vehicle: { ...prev.vehicle, type: value }
                          }))
                        }
                      >
                        <SelectTrigger id="vehicleType" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moto">Moto</SelectItem>
                          <SelectItem value="voiture">Voiture</SelectItem>
                          <SelectItem value="camionnette">Camionnette</SelectItem>
                          <SelectItem value="velo">Vélo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plateNumber">Numéro de plaque</Label>
                        <Input
                          id="plateNumber"
                          value={policies.vehicle.plateNumber}
                          onChange={(e) =>
                            setPolicies(prev => ({
                              ...prev,
                              vehicle: { ...prev.vehicle, plateNumber: e.target.value }
                            }))
                          }
                          className="mt-1"
                          placeholder="CI-123-AB-45"
                        />
                      </div>

                      <div>
                        <Label htmlFor="capacity">Capacité</Label>
                        <Input
                          id="capacity"
                          value={policies.vehicle.capacity}
                          onChange={(e) =>
                            setPolicies(prev => ({
                              ...prev,
                              vehicle: { ...prev.vehicle, capacity: e.target.value }
                            }))
                          }
                          className="mt-1"
                          placeholder="ex: 20 kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="color">Couleur</Label>
                        <Input
                          id="color"
                          value={policies.vehicle.color}
                          onChange={(e) =>
                            setPolicies(prev => ({
                              ...prev,
                              vehicle: { ...prev.vehicle, color: e.target.value }
                            }))
                          }
                          className="mt-1"
                          placeholder="ex: Rouge"
                        />
                      </div>

                      <div>
                        <Label htmlFor="year">Année</Label>
                        <Input
                          id="year"
                          type="number"
                          value={policies.vehicle.year}
                          onChange={(e) =>
                            setPolicies(prev => ({
                              ...prev,
                              vehicle: { ...prev.vehicle, year: e.target.value }
                            }))
                          }
                          className="mt-1"
                          placeholder="ex: 2022"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* General */}
              {activeTab === 'general' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-600" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="bio">Bio professionnelle</Label>
                      <Textarea
                        id="bio"
                        value={policies.general.bio}
                        onChange={(e) =>
                          setPolicies(prev => ({
                            ...prev,
                            general: { ...prev.general, bio: e.target.value }
                          }))
                        }
                        className="mt-1"
                        rows={4}
                        placeholder="Décrivez votre expérience et votre fiabilité..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Expérience en livraison</Label>
                      <Select
                        value={policies.general.experience}
                        onValueChange={(value) =>
                          setPolicies(prev => ({
                            ...prev,
                            general: { ...prev.general, experience: value }
                          }))
                        }
                      >
                        <SelectTrigger id="experience" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="< 1 an">Moins d'1 an</SelectItem>
                          <SelectItem value="1-2 ans">1-2 ans</SelectItem>
                          <SelectItem value="2-5 ans">2-5 ans</SelectItem>
                          <SelectItem value="5-10 ans">5-10 ans</SelectItem>
                          <SelectItem value="10+ ans">Plus de 10 ans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Langues parlées</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Français', 'Anglais', 'Espagnol', 'Portugais'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              const newLangs = policies.general.languages.includes(lang)
                                ? policies.general.languages.filter(l => l !== lang)
                                : [...policies.general.languages, lang]
                              setPolicies(prev => ({
                                ...prev,
                                general: { ...prev.general, languages: newLangs }
                              }))
                            }}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              policies.general.languages.includes(lang)
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {policies.general.languages.includes(lang) ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                              )}
                              <span className="font-medium">{lang}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Services spéciaux</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Livraison express', 'Livraison urgente', 'Livraison de nuit', 'Livraison weekend', 'Course urgente', 'Achat et livraison'].map((service) => (
                          <button
                            key={service}
                            onClick={() => {
                              const newServices = policies.general.specialServices.includes(service)
                                ? policies.general.specialServices.filter(s => s !== service)
                                : [...policies.general.specialServices, service]
                              setPolicies(prev => ({
                                ...prev,
                                general: { ...prev.general, specialServices: newServices }
                              }))
                            }}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              policies.general.specialServices.includes(service)
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {policies.general.specialServices.includes(service) ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                              )}
                              <span className="font-medium">{service}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
