// Placeholder for future Supabase database types.
// Will be populated when the Supabase project is connected.
export interface Database {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
