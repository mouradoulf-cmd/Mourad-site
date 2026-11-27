"""Zones de prospection : centres-villes touristiques et gastronomiques des marchés prioritaires.
(code pays, pays, ville, latitude, longitude, langue du message)
La langue sert à écrire les messages dans la langue du restaurant. Ajouter une ville = une ligne."""

CITIES = [
    # France
    ("FR", "France", "Nice", 43.6960, 7.2700, "fr"),
    ("FR", "France", "Lyon", 45.7640, 4.8357, "fr"),
    ("FR", "France", "Paris Marais", 48.8570, 2.3600, "fr"),
    ("FR", "France", "Bordeaux", 44.8400, -0.5750, "fr"),
    # Italie
    ("IT", "Italie", "Florence", 43.7700, 11.2550, "it"),
    ("IT", "Italie", "Rome Trastevere", 41.8890, 12.4690, "it"),
    ("IT", "Italie", "Venise", 45.4380, 12.3270, "it"),
    ("IT", "Italie", "Naples", 40.8500, 14.2550, "it"),
    # Espagne
    ("ES", "Espagne", "Barcelone", 41.3830, 2.1760, "es"),
    ("ES", "Espagne", "Séville", 37.3860, -5.9930, "es"),
    ("ES", "Espagne", "Malaga", 36.7200, -4.4200, "es"),
    ("ES", "Espagne", "Valence", 39.4740, -0.3770, "es"),
    # Allemagne (email à froid interdit : voir policy)
    ("DE", "Allemagne", "Munich", 48.1370, 11.5750, "de"),
    ("DE", "Allemagne", "Berlin Mitte", 52.5230, 13.4000, "de"),
    # Royaume-Uni
    ("GB", "Royaume-Uni", "Édimbourg", 55.9500, -3.1900, "en"),
    ("GB", "Royaume-Uni", "Londres Soho", 51.5130, -0.1320, "en"),
    ("GB", "Royaume-Uni", "Bath", 51.3810, -2.3590, "en"),
    # Thaïlande
    ("TH", "Thaïlande", "Chiang Mai", 18.7900, 98.9900, "th"),
    ("TH", "Thaïlande", "Phuket Vieille ville", 7.8850, 98.3900, "th"),
    ("TH", "Thaïlande", "Pattaya", 12.9300, 100.8800, "th"),
    ("TH", "Thaïlande", "Bangkok Silom", 13.7250, 100.5300, "th"),
    ("TH", "Thaïlande", "Krabi Ao Nang", 8.0310, 98.8230, "th"),
    # Japon
    ("JP", "Japon", "Kyoto", 35.0050, 135.7700, "ja"),
    ("JP", "Japon", "Osaka Namba", 34.6650, 135.5000, "ja"),
    ("JP", "Japon", "Tokyo Asakusa", 35.7140, 139.7960, "ja"),
    # Chine
    ("CN", "Chine", "Chengdu", 30.6600, 104.0700, "zh"),
    ("CN", "Chine", "Hangzhou", 30.2500, 120.1600, "zh"),
    # Philippines (anglais)
    ("PH", "Philippines", "Cebu", 10.3100, 123.8900, "en"),
    ("PH", "Philippines", "Manille Intramuros", 14.5900, 120.9760, "en"),
    # Corée du Sud
    ("KR", "Corée du Sud", "Busan Haeundae", 35.1630, 129.1600, "ko"),
    ("KR", "Corée du Sud", "Séoul Hongdae", 37.5560, 126.9240, "ko"),
    # Vietnam
    ("VN", "Vietnam", "Hoi An", 15.8800, 108.3300, "vi"),
    ("VN", "Vietnam", "Da Nang", 16.0600, 108.2200, "vi"),
    ("VN", "Vietnam", "Hanoï Vieux quartier", 21.0340, 105.8500, "vi"),
    # Indonésie
    ("ID", "Indonésie", "Ubud", -8.5070, 115.2600, "id"),
    ("ID", "Indonésie", "Canggu", -8.6500, 115.1400, "id"),
    # États-Unis
    ("US", "États-Unis", "La Nouvelle-Orléans", 29.9500, -90.0700, "en"),
    ("US", "États-Unis", "Austin", 30.2670, -97.7400, "en"),
    ("US", "États-Unis", "Savannah", 32.0800, -81.0900, "en"),
    # Canada
    ("CA", "Canada", "Québec", 46.8100, -71.2100, "fr"),
    ("CA", "Canada", "Vancouver Gastown", 49.2840, -123.1090, "en"),
    # Australie
    ("AU", "Australie", "Cairns", -16.9200, 145.7700, "en"),
    ("AU", "Australie", "Melbourne", -37.8100, 144.9600, "en"),
    # Autres marchés intéressants (forte clientèle étrangère)
    ("GR", "Grèce", "Athènes Plaka", 37.9730, 23.7300, "el"),
    ("TR", "Turquie", "Antalya Kaleiçi", 36.8850, 30.7050, "tr"),
    ("PT", "Portugal", "Lisbonne", 38.7100, -9.1400, "pt"),
    ("MA", "Maroc", "Marrakech Médina", 31.6280, -7.9890, "fr"),
    ("MX", "Mexique", "Playa del Carmen", 20.6290, -87.0740, "es"),
]

# Chaque pays : politique email B2B (information, pas un avis juridique)
EMAIL_POLICY = {
    "DE": ("blocked", "Allemagne : l'email commercial non sollicité est interdit (UWG §7). Passer par formulaire de contact, téléphone, visite ou message de réseau social."),
    "AT": ("blocked", "Autriche : accord préalable exigé pour les emails commerciaux."),
    "ES": ("caution", "Espagne : accord préalable normalement exigé (LSSI). Préférer message de réseau social / visite ; un email individuel très ciblé reste un risque."),
    "IT": ("caution", "Italie : l'email individuel ciblé est toléré, jamais en masse ; indiquer comment se désinscrire."),
    "JP": ("caution", "Japon : loi sur les emails commerciaux (opt-in). Préférer formulaire de contact ou visite."),
    "KR": ("caution", "Corée du Sud : opt-in exigé pour la publicité par email. Préférer KakaoTalk/Instagram/visite."),
    "CA": ("caution", "Canada (CASL) : un email vers une adresse professionnelle publiée peut être toléré ; identifier l'expéditeur et proposer la désinscription."),
    "CN": ("caution", "Chine : email peu utilisé ; préférer WeChat/téléphone ou visite."),
    "FR": ("ok", "France : email B2B ciblé autorisé avec identification et désinscription."),
    "GB": ("ok", "Royaume-Uni : email B2B autorisé vers entreprises, avec désinscription."),
    "US": ("ok", "États-Unis : CAN-SPAM, identification + adresse postale + désinscription."),
    "AU": ("ok", "Australie : adresse professionnelle publiée = consentement présumé ; désinscription obligatoire."),
}
DEFAULT_EMAIL_POLICY = ("ok", "Email individuel ciblé avec identification de l'expéditeur et possibilité de refuser. Jamais en masse.")
