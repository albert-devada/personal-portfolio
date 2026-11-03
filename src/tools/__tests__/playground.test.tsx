import { render, screen } from "@testing-library/react";
import { YourLocation } from "@/components/playground/yourLocation";
import { LanguageProvider } from "@/language";
import type { GeoLocationData } from "@/common/types";

const mockGeoData: GeoLocationData = {
    ip: "127.0.0.1",
    success: true,
    type: "IPv4",
    continent: "Asia",
    continent_code: "AS",
    country: "Indonesia",
    country_code: "ID",
    region: "Jakarta",
    region_code: "JK",
    city: "Jakarta",
    latitude: -6.2,
    longitude: 106.8,
    is_eu: false,
    postal: "10110",
    calling_code: "+62",
    capital: "Jakarta",
    borders: "",
    flag: {
        img: "/flag.png",
        emoji: "🇮🇩",
        emoji_unicode: "U+1F1EE U+1F1E9",
    },
    connection: {
        asn: 7717,
        org: "Telkom Indonesia",
        isp: "PT Telekomunikasi Indonesia",
        domain: "telkom.co.id",
    },
    timezone: {
        id: "Asia/Jakarta",
        abbr: "WIB",
        is_dst: false,
        offset: 7,
        utc: "+07:00",
    },
    readme: "",
};

describe("Cybersecurity & Dev Tools - YourLocation Component", () => {
    it("renders visitor IP and location details correctly", () => {
        render(
            <LanguageProvider>
                <YourLocation
                    visitorIp="127.0.0.1"
                    userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                    geoData={mockGeoData}
                />
            </LanguageProvider>
        );

        expect(screen.getByText("127.0.0.1")).toBeInTheDocument();
        expect(screen.getByText("PT Telekomunikasi Indonesia")).toBeInTheDocument();
    });

    it("handles fallback state when geoData is not provided", () => {
        render(
            <LanguageProvider>
                <YourLocation
                    visitorIp="192.168.1.1"
                    userAgent="Mozilla/5.0"
                    geoData={null}
                />
            </LanguageProvider>
        );

        expect(screen.getByText("192.168.1.1")).toBeInTheDocument();
    });
});