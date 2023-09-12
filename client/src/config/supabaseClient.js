import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://orxzdtkmobkpwvqymkcc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeHpkdGttb2JrcHd2cXlta2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ1MjgwMDIsImV4cCI6MTk5MDEwNDAwMn0.JDcjSjFu3AZIQK1szBy69WxdwkjO8MYtBMuRLyUkF3Y"
);
