Cuando abro el detalle y lo cierro sale un error:

ticker-details.component.ts:450
ERROR Error: Object is disposed
at DevicePixelContentBoxBinding2.get (canvas-element-bitmap-size.mjs:40:23)
at DevicePixelContentBoxBinding2.resizeCanvasElement (canvas-element-bitmap-size.mjs:70:14)
at TimeAxisWidget.\_internal_setSizes (lightweight-charts.d…opment.mjs:10162:42)
at ChartWidget.\_private**adjustSizeImpl (lightweight-charts.d…opment.mjs:10785:39)
at ChartWidget.\_private**syncGuiWithModel (lightweight-charts.d…opment.mjs:10983:14)
at ChartWidget.\_private**updateGui (lightweight-charts.d…opment.mjs:10935:14)
at ChartWidget.\_private**drawImpl (lightweight-charts.d…opment.mjs:10844:18)
at lightweight-charts.d…opment.mjs:10923:26
[NEW] Explain Console errors by using Copilot in Edge: click
to explain an error. Learn more
Don't show again
binance.service.ts:205
WebSocket connection to 'wss://stream.binance.com:9443/ws/btcusdt@kline_1h' failed: Ping received after close

﻿

Los export de pdf se hacen bastante regular, revisar eso.

Y luego pues continuar con el plan.

Fase 3 - Progreso: ✅ Panel Global de Portfolio ✅ Mejora UX (USD-First) ✅ Export to CSV

Quedan:

🌡️ Market Sentiment Indicator
🔔 Smart Notifications
¿Continuamos con el Indicador de Sentimiento del Mercado? Es visual y divertido, te mostrará si el mercado está en modo "miedo" o "codicia".

quiero meterle una seccion de noticias de twitter o de algun sitio. No se donde meterlas porque en la modal quiza es
muy cargado la de binance tiene una pantalla por moneda. a ver que nos propone.

Estilizar el mat menu de exportar

El collapsable usa divs en vez de usar el componente de material.
