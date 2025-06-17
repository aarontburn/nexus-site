import { ResolvingMetadata, Metadata } from "next";
import { getModule } from "../server/module-database/modules";
import { ModuleInfo } from "../types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const { id } = await params;

    const [_, resolvingModuleInfo]: [ModuleInfo | undefined, Promise<ModuleInfo | undefined>] = await getModule(id);
    const moduleInfo: ModuleInfo | undefined = await resolvingModuleInfo;

    if (moduleInfo === undefined) {
        return await parent as any
    }

    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${moduleInfo.name} | Nexus`,
        description: `${moduleInfo.description ? moduleInfo.description : "A module developed for Nexus."}`,
        openGraph: {
            images: [...previousImages],
        },
    }
}

export default function Layout({ children }: { children: any }) {
    return <>{children}</>
}