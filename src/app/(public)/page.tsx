import { getPersonalProfile, getCertificateList, getExperienceList, getEducationList, getWorkingList } from "@/supabase";
import { getVisitorDetails } from "@/common/service";
import { Section } from "@/components/base";
import { HeroProfile, SSHTerminal, CertificateCourses, WorkingExperience, ProjectExperience } from "@/contents";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [profile, { ipAddress, GeoLocationData }, certificates, experiences, education, workings] = await Promise.all([
        getPersonalProfile(), 
        getVisitorDetails(true),
        getCertificateList(),
        getExperienceList(),
        getEducationList(),
        getWorkingList(),
    ]);

    return (
        <Section id="Home">
            <HeroProfile 
                profile={profile} 
            />
            <SSHTerminal 
                visitorIp={ipAddress} 
                geoData={GeoLocationData} 
                initialData={{
                    profile,
                    certificates: certificates ?? [],
                    experiences: experiences ?? [],
                    education: education ?? [],
                }}
            />
            <CertificateCourses 
                certificates={certificates ?? []} 
            />
            <WorkingExperience 
                workings={workings ?? []} 
            />
            <ProjectExperience 
                experiences={experiences ?? []} 
            />
        </Section>
    );
}
