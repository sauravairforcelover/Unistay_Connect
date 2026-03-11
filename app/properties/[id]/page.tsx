import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyDetail from "@/components/PropertyDetail";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <PropertyDetail propertyId={params.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
