import apiClient from "../apiClient";
import { toast } from "sonner";

export function DataSeeder() {
  const handleSeedData = async () => {
    try {
      await apiClient.seed.run();
      toast.success('Seeded database');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to seed data');
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-medium text-yellow-800 mb-2">Sample Data</h3>
      <p className="text-sm text-yellow-700 mb-3">
        This app uses sample data for demonstration. Click below to populate the database with example hydrogen infrastructure data.
      </p>
      <button
        onClick={handleSeedData}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
      >
        Load Sample Data
      </button>
    </div>
  );
}
