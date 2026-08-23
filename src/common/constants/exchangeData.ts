import React from "react";
import { BaseMarketItem } from "@/common/types";
import { Droplet, Flame, Fuel, Pickaxe, Atom, Leaf, Coins, Sun, Gem, Cpu, Factory, Plane } from "lucide-react";

export function attachMarketIcons<item extends BaseMarketItem>(items: item[],metadataMap: Record<string, { id: string; icon: React.ElementType; iconColor: string }>): item[] {
    return items.map((item) => {
        const meta = Object.values(metadataMap).find((m) => m.id === item.id);
        return {...item, icon: meta?.icon, iconColor: meta?.iconColor};
    });
}

export const CURRENCY_METADATA: Record<string, { name: string; symbol: string; image: string }> = {
    IDR: { name: "IDR", symbol: "USD / IDR", image: "https://flagcdn.com/w80/id.png" },
    EUR: { name: "Euro", symbol: "USD / EUR", image: "https://flagcdn.com/w80/eu.png" },
    GBP: { name: "Pound Sterling", symbol: "USD / GBP", image: "https://flagcdn.com/w80/gb.png" },
    JPY: { name: "Japanese Yen", symbol: "USD / JPY", image: "https://flagcdn.com/w80/jp.png" },
    SGD: { name: "Singapore Dollar", symbol: "USD / SGD", image: "https://flagcdn.com/w80/sg.png" },
    AUD: { name: "Australian Dollar", symbol: "USD / AUD", image: "https://flagcdn.com/w80/au.png" },
};

export const ENERGY_METADATA: Record<string, { id: string; name: string; symbol: string; icon: React.ElementType; iconColor: string }> = {
    CRUDE_OIL: { id: "crude-oil", name: "Crude Oil (Brent)", symbol: "USD / BBL", icon: Droplet, iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    NATURAL_GAS: { id: "natural-gas", name: "Natural Gas", symbol: "USD / MMBTU", icon: Flame, iconColor: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
    GASOLINE: { id: "gasoline", name: "RBOB Gasoline", symbol: "USD / GAL", icon: Fuel, iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    COAL: { id: "coal", name: "Newcastle Coal", symbol: "USD / MT", icon: Pickaxe, iconColor: "text-stone-600 dark:text-stone-300 bg-stone-500/10 border-stone-500/20" },
    URANIUM: { id: "uranium", name: "Uranium", symbol: "USD / LB", icon: Atom, iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    CARBON: { id: "carbon", name: "Carbon Credits", symbol: "USD / TCO2E", icon: Leaf, iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
};

export const METALS_METADATA: Record<string, { id: string; name: string; symbol: string; icon: React.ElementType; iconColor: string }> = {
    GOLD: { id: "gold", name: "Gold (XAU)", symbol: "USD / OZ", icon: Coins, iconColor: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    SILVER: { id: "silver", name: "Silver (XAG)", symbol: "USD / OZ", icon: Sun, iconColor: "text-slate-300 bg-slate-400/10 border-slate-400/20" },
    PLATINUM: { id: "platinum", name: "Platinum (XPT)", symbol: "USD / OZ", icon: Gem, iconColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
    PALLADIUM: { id: "palladium", name: "Palladium (XPD)", symbol: "USD / OZ", icon: Cpu, iconColor: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
    COPPER: { id: "copper", name: "Copper", symbol: "USD / LB", icon: Factory, iconColor: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
    ALUMINUM: { id: "aluminum", name: "Aluminum", symbol: "USD / MT", icon: Plane, iconColor: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20" },
};