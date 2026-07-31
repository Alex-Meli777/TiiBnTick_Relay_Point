import { NextRequest, NextResponse } from 'next/server'

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

// In-memory storage (in production, use a database)
let policiesStore: LivreurPolicies | null = null

export async function POST(request: NextRequest) {
  try {
    const body: LivreurPolicies = await request.json()

    // Validate required fields
    if (!body.workingHours || !body.deliveryRates || !body.cancellation) {
      return NextResponse.json(
        { error: 'Données invalides: champs manquants' },
        { status: 400 }
      )
    }

    // Store the policies
    policiesStore = body

    return NextResponse.json(
      {
        success: true,
        message: 'Politiques de livraison sauvegardées avec succès',
        data: body
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving policies:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!policiesStore) {
      return NextResponse.json(
        { error: 'Aucune politique trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: policiesStore
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching policies:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération' },
      { status: 500 }
    )
  }
}
