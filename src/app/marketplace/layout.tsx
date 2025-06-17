import MarketplaceHeader from "./MarketplaceHeader";

export default function Layout({ children }: { children: any }) {
    return <>
        <MarketplaceHeader />
        {children}
    </>
}