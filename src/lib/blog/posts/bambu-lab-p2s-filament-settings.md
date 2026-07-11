---
title: "Filament settings for Bambu Lab P2S"
description: "My filament settings for the Bambu Lab P2S."
published: 2026-07-11T18:00:00+00:00
lang: en
tags: [3D printing]
draft: false
---

This is where I keep tested filament settings for my Bambu Lab P2S. They are not ideal and may be different for your use case. I will update this post as I collect new measurements and settings.

All values below were measured with a 0.4 mm nozzle and a textured PEI plate.

I post this information because for some reason there is almost no content with settings in the Internet.

## Bambu Lab

For Bambu Lab PLA Pure, I use the default filament temperatures from its Bambu Studio profile.

The ironing settings are the same for all PLA Pure colors:

- Ironing speed: 20 mm/s.
- Ironing flow: 15%.

### PLA Pure Absolute Black

[Buy Bambu Lab PLA Pure from the official store](https://eu.store.bambulab.com/products/pla-pure) — select Absolute Black when ordering.

| Flow rate | Factor K |
| --------- | -------- |
| 0.9604    | 0.025    |

### PLA Pure Pure White

[Buy Bambu Lab PLA Pure from the official store](https://eu.store.bambulab.com/products/pla-pure) — select Pure White when ordering.

| Flow rate | Factor K |
| --------- | -------- |
| 0.957     | 0.023    |

## FilHub

I use the following settings for FilHub PLA:

- Plate temperature: 60 °C.
- Other layer temperature: 215 °C.
- Print the first two layers without part cooling, then ramp the fan up to 100% over the next two layers.

### PLA Red

[Buy FilHub PLA High Speed](https://filhub.pl/produkt/pla/) — select Czerwony / Red when ordering.

| Flow rate | Factor K |
| --------- | -------- |
| 0.947     | 0.023    |

### PLA Green

[Buy FilHub PLA High Speed](https://filhub.pl/produkt/pla/) — select Zielony / Green when ordering.

| Flow rate | Factor K |
| --------- | -------- |
| 0.9675    | 0.023    |
