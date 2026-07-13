// ----- ./src/app/livreur/page.tsx -----
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  Navigation,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Phone,
  Mail,
  Truck,
  Home,
  Megaphone,
} from "lucide-react";
import { withAuth } from "@/components/hoc/withAuth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getRoute } from "@/services/routing";
import {
  getPublishedAnnouncements,
  getDeliveryPersonSubscriptions,
  AnnouncementResponseDTO,
} from "@/services/announcementService";
import { requestDelivery } from "@/services/deliveryFrontendService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 animate-pulse rounded-xl" />
  ),
});

export function LivreurDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accueil");

  const livreurInfo = {
    firstName: user?.firstName || "Livreur",
    lastName: user?.lastName || "",
    rating: user?.rating || 4.8,
    totalDeliveries: user?.totalDeliveries || 156,
  };

  const [availableDeliveries, setAvailableDeliveries] = useState<
    AnnouncementResponseDTO[]
  >([]);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [activeDeliveries, setActiveDeliveries] = useState<
    AnnouncementResponseDTO[]
  >([]);
  const [activeLoading, setActiveLoading] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set());

  const fetchAvailableDeliveries = useCallback(async () => {
    setAvailableLoading(true);
    try {
      const data = await getPublishedAnnouncements();
      setAvailableDeliveries(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setAvailableLoading(false);
    }
  }, []);

  const deliveryPersonIdRef = user?.deliveryPersonId || user?.id;

  const fetchMyDeliveries = useCallback(async () => {
    if (!deliveryPersonIdRef) return;
    setActiveLoading(true);
    try {
      const data = await getDeliveryPersonSubscriptions(deliveryPersonIdRef);
      setActiveDeliveries(data);
    } catch (error) {
      console.error("Error fetching active deliveries:", error);
    } finally {
      setActiveLoading(false);
    }
  }, [deliveryPersonIdRef]);

  useEffect(() => {
    fetchAvailableDeliveries();
    fetchMyDeliveries();
  }, [fetchAvailableDeliveries, fetchMyDeliveries]);

  // Real-time notifications via SSE
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
    const eventSource = new EventSource(
      `/api/notifications/stream/${user.id}${token ? `?token=${token}` : ""}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const matchingEvent = JSON.parse(event.data);

        // CORRECTION: Add safety guard to reject matching pings/connected states that don't have announcementId
        if (matchingEvent && matchingEvent.announcementId) {
          apiClient
            .get(`/api/announcements/${matchingEvent.announcementId}`)
            .then((res: any) => {
              const announcement = res.data;
              setAvailableDeliveries((prev) => {
                if (prev.find((d) => d.id === announcement.id)) return prev;
                return [announcement as AnnouncementResponseDTO, ...prev];
              });
              toast({
                title: "Nouvelle course disponible !",
                description:
                  announcement.title ||
                  "Une nouvelle course correspond à votre position.",
              });
            })
            .catch((err) =>
              console.error(
                "Error fetching incoming announcement details:",
                err,
              ),
            );
        }
      } catch (err) {
        console.error("Error parsing SSE event:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id, toast]);

  useEffect(() => {
    if (
      selectedDelivery?.pickupAddress?.latitude &&
      selectedDelivery?.pickupAddress?.longitude &&
      selectedDelivery?.deliveryAddress?.latitude &&
      selectedDelivery?.deliveryAddress?.longitude
    ) {
      const fetchRoute = async () => {
        try {
          const route = await getRoute(
            selectedDelivery.pickupAddress.latitude,
            selectedDelivery.pickupAddress.longitude,
            selectedDelivery.deliveryAddress.latitude,
            selectedDelivery.deliveryAddress.longitude,
            selectedDelivery.transportMethod === "bike" ? "bike" : "driving",
          );
          setActiveRoute(route);
        } catch (e) {
          console.warn("Failed to fetch route on dialog", e);
          setActiveRoute(null);
        }
      };
      fetchRoute();
    } else {
      setActiveRoute(null);
    }
  }, [selectedDelivery]);

  const handleAcceptDelivery = async (deliveryId: string) => {
    setSubmittingIds((prev) => {
      const next = new Set(prev);
      next.add(deliveryId);
      return next;
    });

    try {
      const deliverId = user?.deliveryPersonId || user?.id || "livreur-demo";
      await requestDelivery(deliveryId, deliverId);
      toast({
        title: "Candidature envoyée",
        description: "Votre proposition a été transmise au client.",
      });
      fetchAvailableDeliveries();
    } catch (e) {
      toast({
        title: "Erreur",
        description: "Impossible de postuler à cette course.",
        variant: "destructive",
      });
    } finally {
      setSubmittingIds((prev) => {
        const next = new Set(prev);
        next.delete(deliveryId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              TiiB<span className="text-orange-500">n</span>Tick
            </h1>
            <p className="text-xs text-gray-500">Espace Livreur</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {livreurInfo.lastName} {livreurInfo.firstName}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">
                  {livreurInfo.rating}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="text-red-600">
            <LogOut className="w-5 h-5" />
          </Button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === "accueil" && (
            <>
              <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Bienvenue,</p>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      {livreurInfo.lastName} {livreurInfo.firstName}
                    </h1>
                    <p className="text-sm opacity-95">
                      Consultez les offres et gérez vos trajets.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setActiveTab("annonces")}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                >
                  <Megaphone className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-medium">Voir les annonces</span>
                </Button>
                <Button
                  onClick={() => setActiveTab("livraisons")}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                >
                  <Truck className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-medium">Mes livraisons</span>
                </Button>
              </div>
            </>
          )}

          {activeTab === "annonces" && (
            <div className="grid lg:grid-cols-2 gap-4">
              {availableLoading ? (
                <div className="col-span-2 flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : availableDeliveries.length === 0 ? (
                <div className="col-span-2 text-center py-16 text-gray-500">
                  <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>Aucune course disponible pour le moment.</p>
                </div>
              ) : (
                availableDeliveries.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {delivery.title}
                        </CardTitle>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {delivery.amount.toLocaleString()} FCFA
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-500">
                        {delivery.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setDetailsOpen(true);
                          }}
                        >
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          disabled={submittingIds.has(delivery.id)}
                          onClick={() => handleAcceptDelivery(delivery.id)}
                          className="bg-orange-500 text-white font-semibold"
                        >
                          {submittingIds.has(delivery.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Postuler"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "livraisons" && (
            <div className="space-y-4">
              {activeLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : activeDeliveries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-12">
                  Aucune livraison assignée.
                </p>
              ) : (
                activeDeliveries.map((d) => (
                  <Card key={d.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{d.title}</p>
                        <p className="text-xs text-gray-500">
                          📍 {d.pickupAddress?.city} → {d.deliveryAddress?.city}
                        </p>
                      </div>
                      <Badge className="bg-green-50 text-green-700">
                        Assignée
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Dialog
        open={detailsOpen}
        onOpenChange={(o) => {
          setDetailsOpen(o);
          if (!o) setSelectedDelivery(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl">
              {selectedDelivery?.title || "Détails"}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-orange-600">
              {selectedDelivery?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-4">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  📍 Lieu de Retrait
                </p>
                <p className="text-sm text-gray-700">
                  {selectedDelivery?.pickupAddress?.street},{" "}
                  {selectedDelivery?.pickupAddress?.city}
                </p>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  🏁 Lieu de Livraison
                </p>
                <p className="text-sm text-gray-700">
                  {selectedDelivery?.deliveryAddress?.street},{" "}
                  {selectedDelivery?.deliveryAddress?.city}
                </p>
              </div>

              {selectedDelivery?.pickupAddress?.latitude && (
                <div className="rounded-xl overflow-hidden border h-64 relative z-0">
                  <MapLeaflet
                    center={[
                      selectedDelivery.pickupAddress.latitude,
                      selectedDelivery.pickupAddress.longitude,
                    ]}
                    zoom={12}
                    markers={[
                      {
                        position: [
                          selectedDelivery.pickupAddress.latitude,
                          selectedDelivery.pickupAddress.longitude,
                        ],
                        label: "Retrait",
                      },
                      {
                        position: [
                          selectedDelivery.deliveryAddress.latitude,
                          selectedDelivery.deliveryAddress.longitude,
                        ],
                        label: "Livraison",
                      },
                    ]}
                    route={activeRoute}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase border-b pb-1">
                Détails de l'Annonce
              </h4>
              <p className="text-sm text-gray-600">
                {selectedDelivery?.description}
              </p>
              <div className="p-4 bg-orange-50 rounded-xl text-sm font-bold text-orange-700">
                Tarif : {selectedDelivery?.amount?.toLocaleString()} FCFA
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center md:hidden z-50">
        <button
          onClick={() => setActiveTab("accueil")}
          className={`flex flex-col items-center gap-1 ${activeTab === "accueil" ? "text-orange-600" : "text-gray-400"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Accueil</span>
        </button>
        <button
          onClick={() => setActiveTab("annonces")}
          className={`flex flex-col items-center gap-1 ${activeTab === "annonces" ? "text-orange-600" : "text-gray-400"}`}
        >
          <Megaphone className="w-5 h-5" />
          <span className="text-[10px]">Annonces</span>
        </button>
        <button
          onClick={() => setActiveTab("livraisons")}
          className={`flex flex-col items-center gap-1 ${activeTab === "livraisons" ? "text-orange-600" : "text-gray-400"}`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px]">Livraisons</span>
        </button>
      </nav>
    </div>
  );
}

export default withAuth(LivreurDashboard, ["LIVREUR"]);
