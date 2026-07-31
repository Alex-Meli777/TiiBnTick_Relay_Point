'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, MessageCircle, MapPin, Clock, Package, Navigation, ArrowLeft, CheckCircle, User, ChevronUp, ChevronDown } from 'lucide-react'

export default function DeliveryTrackingPage() {
  const [deliveryStatus, setDeliveryStatus] = useState<'in_progress' | 'arrived'>('in_progress')
  const [isExpanded, setIsExpanded] = useState(false)
  const [panelHeight, setPanelHeight] = useState(280)
  const panelRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  // Données de livraison fictives
  const delivery = {
    id: 'LIV-2024-001',
    clientName: 'Marie Kouassi',
    clientPhone: '+225 07 00 00 00 00',
    address: 'Cocody, Rue des Jardins, N° 45',
    pickupAddress: 'Marcory, Zone 4, Boutique Alpha',
    distanceRemaining: 3.5,
    estimatedTime: 12,
    packageName: 'Colis moyen',
    packageSize: 'Moyen',
    paymentStatus: 'Payé',
    paymentMethod: 'MTN Mobile Money',
    orderId: 'CMD-2024-789'
  }

  const handleCallClient = () => {
    window.location.href = `tel:${delivery.clientPhone}`
  }

  const handleChatClient = () => {
    alert('Ouverture du chat avec ' + delivery.clientName)
  }

  const handleMarkDelivered = () => {
    setDeliveryStatus('arrived')
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    startY.current = e.touches[0].clientY
    startHeight.current = panelHeight
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    
    const deltaY = startY.current - e.touches[0].clientY
    const newHeight = Math.min(Math.max(startHeight.current + deltaY, 280), window.innerHeight * 0.85)
    setPanelHeight(newHeight)
    setIsExpanded(newHeight > 350)
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    // Snap to either collapsed or expanded state
    if (panelHeight > 350) {
      setPanelHeight(Math.min(window.innerHeight * 0.85, 600))
      setIsExpanded(true)
    } else {
      setPanelHeight(280)
      setIsExpanded(false)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden relative">
      {/* Zone principale: Carte */}
      <div className="absolute inset-0 bg-gray-200 overflow-hidden">
        {/* Placeholder de carte */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="text-center">
            <MapPin className="w-20 h-20 text-orange-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 font-medium">Carte de navigation</p>
            <p className="text-sm text-gray-500 mt-2">La carte sera intégrée ici</p>
          </div>
        </div>

        {/* Indicateur de position du livreur */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full opacity-60 animate-ping" />
        </div>

        {/* Destination marker */}
        <div className="absolute top-1/3 right-1/4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Pickup marker */}
        <div className="absolute bottom-1/3 left-1/4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <Package className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Bouton de navigation flottant */}
        <Button className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl z-20">
          <Navigation className="w-5 h-5 mr-2" />
          Itinéraire
        </Button>
      </div>

      {/* Header flottant */}
      <header className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Livraison en cours</h1>
              <p className="text-xs opacity-90">{delivery.id}</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
            {deliveryStatus === 'in_progress' ? 'En cours' : 'Livré'}
          </Badge>
        </div>
      </header>

      {/* Zone secondaire: Panneau extensible (superpose la carte) */}
      <div
        ref={panelRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 transition-all duration-300 ease-out"
        style={{ height: `${panelHeight}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle pour glisser */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Bouton expand/collapse */}
        <div className="flex justify-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpand}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Réduire
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Voir plus
              </>
            )}
          </Button>
        </div>

        {/* Contenu scrollable */}
        <div className="px-4 pb-6 overflow-y-auto" style={{ height: `${panelHeight - 80}px` }}>
          <div className="space-y-4">
            {/* Section: Boutons d'action */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCallClient}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white h-12"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appeler
              </Button>
              <Button
                onClick={handleChatClient}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-12"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </Button>
            </div>

            {/* Section: Distance et temps */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                    <MapPin className="w-5 h-5" />
                    <span className="text-2xl font-bold">{delivery.distanceRemaining}</span>
                  </div>
                  <p className="text-sm text-gray-600">km restants</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-2xl font-bold">{delivery.estimatedTime}</span>
                  </div>
                  <p className="text-sm text-gray-600">min restantes</p>
                </CardContent>
              </Card>
            </div>

            {/* Section: Infos client */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Client</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {delivery.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{delivery.clientName}</p>
                    <p className="text-sm text-gray-600 truncate">{delivery.clientPhone}</p>
                    <div className="flex items-center gap-1 mt-1 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm truncate">{delivery.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section: Infos colis */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Détails du colis</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{delivery.packageName}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">{delivery.packageSize}</Badge>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        {delivery.paymentStatus}
                      </Badge>
                      <Badge variant="secondary">{delivery.paymentMethod}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Commande: {delivery.orderId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section: Point de départ */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Point de départ</h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{delivery.pickupAddress}</p>
                    <p className="text-xs text-gray-500 mt-1">Lieu de collecte</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bouton marquer comme livré */}
            {deliveryStatus === 'in_progress' && (
              <Button
                onClick={handleMarkDelivered}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-14 text-base font-semibold"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Marquer comme livré
              </Button>
            )}

            {/* Indicateur de livraison terminée */}
            {deliveryStatus === 'arrived' && (
              <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">Livraison terminée avec succès</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
