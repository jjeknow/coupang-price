export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="product-detail-page">
      {children}
    </div>
  );
}
