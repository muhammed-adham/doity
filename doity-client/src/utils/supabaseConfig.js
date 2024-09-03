import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const url = "https://ujvskrylffuzyrelbddn.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdnNrcnlsZmZ1enlyZWxiZGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMzA3NjUsImV4cCI6MjA0MDkwNjc2NX0.ZqQM3SCzi_3CxxrmcZN3d5q8kqt3gg5a-yTuw9qLQss";
const supabase = createClient(url, key);
export default supabase;

//======================================================================================================================Functions
//getUser
export const isUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data;
};
// Get All Tasks
export const getTasks = async () => {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) throw new Error(error.message);
  return data;
};

// Insert a row
export const insertTask = async (taskData) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ task: taskData }])
    .select();

  if (error) throw new Error(error.message);

  return data;
};

// Update matching rows
export const updateRow = async (task, id) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({ task })
    .eq("id", id)
    .select();

  return data;
};
//update state
export const updateState = async (done, id) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({ done })
    .eq("id", id)
    .select();

  return data;
};

// Delete matching rows
export const deleteRow = async (id) => {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
  } catch (error) {
    console.error("Error deleting row:", error);
  }
};
// Subscribe
// export const tasksSubscribe = supabase.channel('custom-all-channel')
//   .on(
//     'postgres_changes',
//     { event: '*', schema: 'public', table: 'tasks' },
//     (payload) => {
//       const eventType= payload.eventType
//       const newRecord= payload.new.task
//       return payload
//     }
//   )
//   .subscribe()
