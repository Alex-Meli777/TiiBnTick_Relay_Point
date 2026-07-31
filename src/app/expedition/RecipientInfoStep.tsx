// ----- ./src/app/expedition/RecipientInfoStep.tsx -----
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  ArrowRight,
  ArrowLeft,
  Target,
  Sparkles,
  Circle,
  Globe,
  Building,
  Navigation,
} from "lucide-react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import RelayPointModal from "@/components/relay/RelayPointModal";
import { RelayPoint } from "@/types/relayPoint";
import { Store } from "lucide-react";

interface RecipientData {
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientCountry: string;
  recipientRegion: string;
  recipientCity: string;
  recipientAddress: string;
  recipientLatitude?: number;
  recipientLongitude?: number;
}

interface RecipientInfoStepProps {
  initialData: RecipientData;
  onContinue: (data: RecipientData) => void;
  onBack: () => void;
  excludeRpName?: string;
}

const countries = {
  cameroun: {
    name: "Cameroun",
    regions: {
      centre: {
        name: "Centre",
        cities: [
          "Yaoundé",
          "Mbalmayo",
          "Akonolinga",
          "Bafia",
          "Ntui",
          "Mfou",
          "Obala",
          "Okola",
          "Soa",
        ],
      },
      littoral: {
        name: "Littoral",
        cities: [
          "Douala",
          "Edéa",
          "Nkongsamba",
          "Yabassi",
          "Loum",
          "Manjo",
          "Mbanga",
          "Mouanko",
        ],
      },
    },
  },
} as const;

type CountryKey = keyof typeof countries;

const FloatingIcon = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.4, y: 0 }}
    transition={{
      duration: 0.6,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 2,
    }}
    className="absolute text-orange-200 dark:text-orange-300/40"
  >
    {children}
  </motion.div>
);

const InputField = ({ icon: Icon, id, error, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="group"
  >
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 tracking-wider"
    >
      {props.label}
    </label>
    <div className="relative">
      <motion.div
        className="absolute left-3 top-1/2 -translate-y-1/2"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors" />
      </motion.div>
      <input
        id={id}
        {...props}
        className={`w-full pl-10 pr-3 py-2.5 text-sm border-2 rounded-lg transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100
          ${error ? "border-red-300 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400" : "border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"}
          focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 focus:bg-white dark:focus:bg-gray-800 shadow-sm hover:shadow-md`}
      />
    </div>
  </motion.div>
);

const SelectField = ({ icon: Icon, id, error, children, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="group"
  >
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 tracking-wider"
    >
      {props.label}
    </label>
    <div className="relative">
      <motion.div
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-orange-500 transition-colors" />
      </motion.div>
      <select
        id={id}
        {...props}
        className={`w-full pl-10 pr-8 py-2.5 text-sm border-2 rounded-lg appearance-none transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100
          ${error ? "border-red-300 focus:border-red-500" : "border-gray-200 dark:border-gray-600 focus:border-orange-500"}
          focus:ring-2 focus:ring-orange-500/20 focus:bg-white cursor-pointer`}
      >
        {children}
      </select>
    </div>
  </motion.div>
);

export default function RecipientInfoStep({
  initialData,
  onContinue,
  onBack,
  excludeRpName,
}: RecipientInfoStepProps) {
  const [formData, setFormData] = useState<RecipientData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRelayPoint, setIsRelayPoint] = useState(false);
  const [showRpModal, setShowRpModal] = useState(false);
  const [selectedRp, setSelectedRp] = useState<RelayPoint | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.recipientFirstName.trim().length < 2)
      newErrors.recipientFirstName = "Prénom requis";
    if (formData.recipientLastName.trim().length < 2)
      newErrors.recipientLastName = "Nom requis";
    if (!formData.recipientPhone.trim())
      newErrors.recipientPhone = "Téléphone requis";

    if (!isRelayPoint) {
      if (!formData.recipientCountry)
        newErrors.recipientCountry = "Pays requis";
      if (!formData.recipientRegion)
        newErrors.recipientRegion = "Région requise";
      if (!formData.recipientCity) newErrors.recipientCity = "Ville requise";
      if (!formData.recipientAddress.trim())
        newErrors.recipientAddress = "Adresse requise";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    onContinue(formData);
    setIsSubmitting(false);
  };

  const availableCities = (() => {
    if (formData.recipientCountry && formData.recipientRegion) {
      const countryData = countries[formData.recipientCountry as CountryKey];
      if (countryData) {
        const regionData =
          countryData.regions[
            formData.recipientRegion as keyof typeof countryData.regions
          ];
        return regionData?.cities || [];
      }
    }
    return [];
  })();

  return (
    <div className="relative overflow-hidden">
      <FloatingIcon delay={0}>
        <Target className="w-16 h-16 absolute top-20 right-20" />
      </FloatingIcon>

      <div className="relative z-10 flex items-center justify-center p-2">
        <div className="w-full max-w-3xl">
          <div className="p-2">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                Informations destinataire
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  icon={User}
                  id="recipientLastName"
                  name="recipientLastName"
                  value={formData.recipientLastName}
                  onChange={handleChange}
                  label="Nom"
                  placeholder="Mbarga"
                  error={errors.recipientLastName}
                />
                <InputField
                  icon={User}
                  id="recipientFirstName"
                  name="recipientFirstName"
                  value={formData.recipientFirstName}
                  onChange={handleChange}
                  label="Prénom"
                  placeholder="Marie"
                  error={errors.recipientFirstName}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  icon={Phone}
                  id="recipientPhone"
                  name="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={handleChange}
                  label="Téléphone"
                  placeholder="677123456"
                  error={errors.recipientPhone}
                />
                <InputField
                  icon={Mail}
                  type="email"
                  id="recipientEmail"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  label="Email"
                  placeholder="nom@exemple.com"
                  error={errors.recipientEmail}
                />
              </div>

              {/* UC5: RELAY POINT TOGGLE */}
              <div className="mb-6 bg-orange-50/50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-800">
                      Retrait dans un Point Relais TiiBnTick
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isRelayPoint}
                    onChange={(e) => {
                      setIsRelayPoint(e.target.checked);
                      if (e.target.checked) setShowRpModal(true);
                      else setSelectedRp(null);
                    }}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                  />
                </div>
                {selectedRp && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-orange-700">
                        {selectedRp.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Point de retrait sélectionné
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRpModal(true)}
                      className="text-xs font-bold text-orange-600 underline"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>

              <RelayPointModal
                isOpen={showRpModal}
                onClose={() => {
                  setShowRpModal(false);
                  if (!selectedRp) setIsRelayPoint(false);
                }}
                onSelect={(rp) => {
                  setSelectedRp(rp);
                  // Update recipient location attributes
                  setFormData((prev) => ({
                    ...prev,
                    recipientAddress: rp.name,
                    recipientCity: rp.city,
                    recipientRegion: rp.region,
                    recipientCountry: rp.country,
                    recipientLatitude: rp.latitude,
                    recipientLongitude: rp.longitude,
                    arrivalPointId: rp.id,
                  }));
                  setShowRpModal(false);
                }}
                excludeRpName={excludeRpName}
              />

              {!isRelayPoint && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      icon={Globe}
                      id="recipientCountry"
                      name="recipientCountry"
                      value={formData.recipientCountry}
                      onChange={handleChange}
                      label="Pays de destination"
                      error={errors.recipientCountry}
                    >
                      <option value="">Sélectionner un pays</option>
                      <option value="cameroun">Cameroun</option>
                    </SelectField>

                    <SelectField
                      icon={Building}
                      id="recipientRegion"
                      name="recipientRegion"
                      value={formData.recipientRegion}
                      onChange={(e: any) => {
                        const region = e.target.value;
                        const city = region === "centre" ? "Yaoundé" : "Douala";
                        setFormData((prev) => ({
                          ...prev,
                          recipientRegion: region,
                          recipientCity: city,
                        }));
                      }}
                      label="Région de destination"
                      error={errors.recipientRegion}
                      disabled={!formData.recipientCountry}
                    >
                      <option value="">Sélectionner une région</option>
                      <option value="centre">Centre</option>
                      <option value="littoral">Littoral</option>
                    </SelectField>

                    <SelectField
                      icon={Navigation}
                      id="recipientCity"
                      name="recipientCity"
                      value={formData.recipientCity}
                      label="Ville de destination"
                      error={errors.recipientCity}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner une ville</option>
                      {availableCities.map((city: string) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 tracking-wider">
                    Adresse de livraison
                  </label>
                  <AddressAutocomplete
                    onSelect={(address: any) => {
                      setFormData((prev) => ({
                        ...prev,
                        recipientAddress: address.street,
                        recipientCity: address.city || prev.recipientCity,
                        recipientRegion:
                          address.district || prev.recipientRegion,
                        recipientCountry: "cameroun",
                        recipientLatitude: address.latitude,
                        recipientLongitude: address.longitude,
                      }));
                    }}
                    defaultValue={formData.recipientAddress}
                    city={formData.recipientCity}
                    placeholder="Rue, Quartier..."
                  />
                </>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg text-sm transition-all"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
