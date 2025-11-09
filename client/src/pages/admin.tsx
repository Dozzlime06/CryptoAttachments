import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
        <AdminPanel />
      </div>
    </div>
  );
}
