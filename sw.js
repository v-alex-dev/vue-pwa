const version = "1.0";

// Cache pour les ressources statiques
const STATIC_CACHE = `static-cache-v${version}`;
// Cache pour les données de l'API
const DATA_CACHE = `data-cache-v${version}`;

// Ressources statiques à mettre en cache lors de l'installation
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/install.js",
  "/register-sw.js",
  "/manifest.json",
  "/favicon.ico",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
  "/icons/favicon-96x96.png",
  "/icons/favicon-256x256.png",
];

// URL de l'API pour la gestion spécifique des données
const API_URL =
  "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/items/voyages";

//installer le service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installation en cours...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Cache statique ouvert:", STATIC_CACHE);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("Ressources statiques mises en cache avec succès");
        return self.skipWaiting(); // Force l'activation immédiate
      })
      .catch((error) => {
        console.error("Erreur lors de l'installation:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activation en cours...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches qui ne correspondent pas à la version actuelle
            if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
              console.log("Suppression de l'ancien cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker activé et prêt");
        return self.clients.claim(); // Prendre le contrôle de toutes les pages
      })
  );
});

self.addEventListener("fetch", (event) => {
  // Vérifier si c'est une requête vers l'API
  if (event.request.url.includes(API_URL)) {
    console.log("Requête API interceptée:", event.request.url);

    // Stratégie "Network First" pour les données de l'API
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la requête réseau réussit, mettre à jour le cache
          if (response.status === 200) {
            console.log("Données API récupérées du réseau et mises en cache");
            const responseClone = response.clone();
            caches.open(DATA_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essayer de récupérer depuis le cache
          console.log(
            "Réseau indisponible, tentative de récupération depuis le cache"
          );
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log("Données API récupérées depuis le cache");
              return cachedResponse;
            }
            // Si pas de cache disponible, retourner une réponse d'erreur
            console.log("Aucune donnée en cache disponible");
            return new Response(
              JSON.stringify({
                error: "Données non disponibles hors ligne",
                offline: true,
              }),
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "application/json" },
              }
            );
          });
        })
    );
  } else {
    // Stratégie "Cache First" pour les ressources statiques
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log(
            "Ressource statique servie depuis le cache:",
            event.request.url
          );
          return response;
        }

        console.log(
          "Ressource statique récupérée du réseau:",
          event.request.url
        );
        return fetch(event.request)
          .then((response) => {
            // Mettre en cache les nouvelles ressources si elles sont valides
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback pour les pages HTML
            if (event.request.destination === "document") {
              return caches.match("/index.html");
            }
          });
      })
    );
  }
});
