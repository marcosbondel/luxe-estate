# Buenas Prácticas: App Inmobiliaria en Next.js

## 🚀 1. Rendimiento y SEO
- **SSG e ISR:** Para máximo SEO y carga instantánea de propiedades usar generación estática e Incremental Static Regeneration.
- **SSR / Client-Side Fetching:** Usar `getServerSideProps` o SWR/React Query para búsquedas dinámicas con filtros.
- **Optimización de Imágenes:** Usar `<Image>` de `next/image` y formatos WebP. Indispensable para no penalizar el tiempo de carga de las galerías.
- **Uso de CDNs:** Archivos pesados (Tours 360, Videos, PDFs) alojados en S3, Cloudinary o Vercel Blob.
- **Metadatos y Sitemaps Dinámicos:** Títulos autogenerados, Open Graph (para compartir por WhatsApp) y un `sitemap.xml` siempre actualizado.
- **Schema Markup:** JSON-LD de tipo `RealEstateListing` para asegurar Rich Snippets en Google.

## 📱 2. Interfaz y Experiencia de Usuario (UI/UX)
- **Mobile-First Real:** Priorizar navegación móvil, galerías *swipeables* (deslizables) y botones grandes.
- **Filtros Sincronizados a la URL:** Mapear filtros (precio, zona) a `?query=params` para que los usuarios puedan copiar y compartir sus búsquedas.
- **Mapas Interactivos:** Búsqueda por ubicación integrada (Mapbox / Google Maps) con pines interactivos.
- **Funciones de Retención:** Sistema de `Favoritos` (Wishlist) y tabla de `Comparar Propiedades`.
- **Multimedia Inmersiva:** Soporte embebido nativo para recorridos de Matterport o recorridos virtuales.

## ⚙️ 3. Base de Datos y Arquitectura
- **Backend Relacional:** Utilizar PostgreSQL (ej. Supabase o Neon) para relacionar fluidamente Entidades: `Propiedad > Agente > Comprador`.
- **Caché en Nivel de Base de Datos:** Emplear Redis para "Propiedades Destacadas" o "Busquedas Recientes" para ahorrar latencia.
- **Webhooks de Sincronización:** Si se usa un CRM Inmobiliario externo, sincronizar disponibilidad en tiempo real mediante webhooks.

## 💬 4. Leads y Conversión (Ventas)
- **Micro-Formularios Anti-Fricción:** Solicitar mínimo de datos (Solo Nombre y Teléfono).
- **CTA a WhatsApp Directo:** Botones flotantes "Contactar Agente" con mensajes de WhatsApp pre-llenados incluyendo el URL de la propiedad.
- **Agendamiento en 1 Clic:** Embeber Calendly o equivalentes para concretar visitas físicas directamente.
- **Seguridad en Entradas:** Anti-bot tipo Cloudflare Turnstile o reCAPTCHA invisible para proteger formularios públicos de spam.
- **Retención 404 Inteligente:** Mostrar "Propiedades Similares" si el link de una propiedad visitada ya se vendió, en lugar de una página de error vacía.
