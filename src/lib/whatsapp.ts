export interface WhatsAppBookingPayload {
  routeTitle: string;
  travelDate: string;
  passengers: number;
  luggage: number;
  estimatedPriceSar?: number;
  vehicleName?: string;
  phoneDispatch?: string;
}

export function constructWhatsAppLink(payload: WhatsAppBookingPayload): string {
  const phone = payload.phoneDispatch || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966591206299';

  const lines = [
    '🕋 *Assalam o Alaikum | Umrah Taxi Booking Request*',
    '',
    `📍 *Route:* ${payload.routeTitle}`,
    `📅 *Travel Date:* ${payload.travelDate}`,
    `👥 *Passengers:* ${payload.passengers}`,
    `🧳 *Luggage:* ${payload.luggage} bags`,
    payload.vehicleName ? `🚗 *Vehicle Preference:* ${payload.vehicleName}` : null,
    payload.estimatedPriceSar ? `💰 *Estimated Fare:* ${payload.estimatedPriceSar} SAR (Pay on Arrival)` : null,
    '✅ *Includes:* Free Miqat Stopover, Tolls & Radar Flight Delay Waiting',
    '',
    'Please confirm chauffeur availability and pickup procedure.'
  ].filter(Boolean);

  const encodedText = encodeURIComponent(lines.join('\n'));

  // Mobile detection for native intent deep-link
  if (typeof window !== 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      return `whatsapp://send?phone=${phone}&text=${encodedText}`;
    }
  }

  // Desktop Web Fallback
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
}
