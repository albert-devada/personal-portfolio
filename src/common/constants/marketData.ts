import { Droplet, Flame, Fuel, Pickaxe, Atom, Leaf } from "lucide-react";

export const CURRENCY_METADATA: Record<string, { name: string; symbol: string; image: string }> = {
    IDR: { name: "Rupiah", symbol: "USD / IDR", image: "https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/id.svg" },
    EUR: { name: "Euro", symbol: "USD / EUR", image: "https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/eu.svg" },
    GBP: { name: "Pound Sterling", symbol: "USD / GBP", image: "https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/gb.svg" },
    JPY: { name: "Japanese Yen", symbol: "USD / JPY", image: "https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/jp.svg" },
    SGD: { name: "Singapore Dollar", symbol: "USD / SGD", image: "https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/sg.svg" },
    AUD: { name: "Australian Dollar", symbol: "USD / AUD", image: "https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/au.svg" },
};

export const ENERGY_METADATA: Record<string, { id: string; name: string; symbol: string; ticker: string; unitLabel: string; icon: React.ElementType; iconColor: string; }> = {
    CRUDE_OIL: { id: "crude-oil", name: "Crude Oil (Brent)", symbol: "USD / BBL", ticker: "BZ=F", unitLabel: "bbl", icon: Droplet, iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    NATURAL_GAS: { id: "natural-gas", name: "Natural Gas", symbol: "USD / MMBTU", ticker: "NG=F", unitLabel: "MMBtu", icon: Flame, iconColor: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
    GASOLINE: { id: "gasoline", name: "RBOB Gasoline", symbol: "USD / GAL", ticker: "RB=F", unitLabel: "gal", icon: Fuel, iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    COAL: { id: "coal", name: "Newcastle Coal", symbol: "USD / MT", ticker: "BTU", unitLabel: "MT", icon: Pickaxe, iconColor: "text-stone-600 dark:text-stone-300 bg-stone-500/10 border-stone-500/20" },
    URANIUM: { id: "uranium", name: "Uranium", symbol: "USD / LB", ticker: "URA", unitLabel: "lb", icon: Atom, iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    CARBON: { id: "carbon", name: "Carbon Credits", symbol: "USD / TCO2E", ticker: "KRBN", unitLabel: "tCO2e", icon: Leaf, iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
};