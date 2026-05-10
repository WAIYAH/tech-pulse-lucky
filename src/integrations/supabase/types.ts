export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      assignments: {
        Row: {
          course_id: string;
          created_at: string;
          due_date: string | null;
          id: string;
          instructions: string;
          lesson_id: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          instructions: string;
          lesson_id?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          instructions?: string;
          lesson_id?: string | null;
          title?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          category: string;
          created_at: string;
          currency: string;
          description: string;
          duration: string;
          faqs: Json;
          id: string;
          image_url: string;
          instructor: string;
          is_free: boolean;
          learning_outcomes: string[];
          level: Database["public"]["Enums"]["lms_course_level"];
          price: number;
          requirements: string[];
          short_description: string;
          slug: string;
          target_audience: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          currency?: string;
          description: string;
          duration: string;
          faqs?: Json;
          id?: string;
          image_url?: string;
          instructor?: string;
          is_free?: boolean;
          learning_outcomes?: string[];
          level?: Database["public"]["Enums"]["lms_course_level"];
          price?: number;
          requirements?: string[];
          short_description?: string;
          slug: string;
          target_audience?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          duration?: string;
          faqs?: Json;
          id?: string;
          image_url?: string;
          instructor?: string;
          is_free?: boolean;
          learning_outcomes?: string[];
          level?: Database["public"]["Enums"]["lms_course_level"];
          price?: number;
          requirements?: string[];
          short_description?: string;
          slug?: string;
          target_audience?: string[];
          title?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          access_status: Database["public"]["Enums"]["lms_access_status"];
          course_id: string;
          created_at: string;
          id: string;
          progress: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_status?: Database["public"]["Enums"]["lms_access_status"];
          course_id: string;
          created_at?: string;
          id?: string;
          progress?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_status?: Database["public"]["Enums"]["lms_access_status"];
          course_id?: string;
          created_at?: string;
          id?: string;
          progress?: number;
          updated_at?: string;
          user_id?: string;
        };
      };
      lesson_progress: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          course_id: string;
          created_at: string;
          id: string;
          lesson_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          course_id: string;
          created_at?: string;
          id?: string;
          lesson_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          course_id?: string;
          created_at?: string;
          id?: string;
          lesson_id?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      lessons: {
        Row: {
          assignment: Json | null;
          content: string;
          course_id: string;
          created_at: string;
          id: string;
          lesson_order: number;
          lesson_type: Database["public"]["Enums"]["lms_lesson_type"];
          quiz: Json | null;
          resource_downloads: Json;
          title: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          assignment?: Json | null;
          content: string;
          course_id: string;
          created_at?: string;
          id?: string;
          lesson_order: number;
          lesson_type?: Database["public"]["Enums"]["lms_lesson_type"];
          quiz?: Json | null;
          resource_downloads?: Json;
          title: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          assignment?: Json | null;
          content?: string;
          course_id?: string;
          created_at?: string;
          id?: string;
          lesson_order?: number;
          lesson_type?: Database["public"]["Enums"]["lms_lesson_type"];
          quiz?: Json | null;
          resource_downloads?: Json;
          title?: string;
          updated_at?: string;
          video_url?: string | null;
        };
      };
      payments: {
        Row: {
          admin_note: string | null;
          amount: number;
          course_id: string;
          created_at: string;
          currency: string;
          email: string;
          full_name: string;
          id: string;
          payment_date: string;
          phone: string;
          screenshot_url: string | null;
          status: Database["public"]["Enums"]["lms_payment_status"];
          transaction_code: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_note?: string | null;
          amount: number;
          course_id: string;
          created_at?: string;
          currency?: string;
          email: string;
          full_name: string;
          id?: string;
          payment_date: string;
          phone: string;
          screenshot_url?: string | null;
          status?: Database["public"]["Enums"]["lms_payment_status"];
          transaction_code: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_note?: string | null;
          amount?: number;
          course_id?: string;
          created_at?: string;
          currency?: string;
          email?: string;
          full_name?: string;
          id?: string;
          payment_date?: string;
          phone?: string;
          screenshot_url?: string | null;
          status?: Database["public"]["Enums"]["lms_payment_status"];
          transaction_code?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string;
          role: Database["public"]["Enums"]["lms_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string;
          id: string;
          phone?: string;
          role?: Database["public"]["Enums"]["lms_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string;
          role?: Database["public"]["Enums"]["lms_role"];
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: {
          target_user_id?: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      lms_access_status: "free" | "pending_payment" | "approved" | "rejected";
      lms_course_level: "Beginner" | "Intermediate" | "Advanced";
      lms_lesson_type: "video" | "text" | "assignment" | "quiz";
      lms_payment_status: "pending" | "approved" | "rejected";
      lms_role: "guest" | "student" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      lms_access_status: ["free", "pending_payment", "approved", "rejected"],
      lms_course_level: ["Beginner", "Intermediate", "Advanced"],
      lms_lesson_type: ["video", "text", "assignment", "quiz"],
      lms_payment_status: ["pending", "approved", "rejected"],
      lms_role: ["guest", "student", "admin"],
    },
  },
} as const;

