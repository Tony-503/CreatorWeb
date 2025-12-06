import React from "react";
import { supabase } from "../../../Client.js";
import { useNavigate, useParams} from "react-router-dom";

const DeleteCreator = ({ creatorId, onDelete }) => {
   const navigator = useNavigate();
   const params = useParams();
   const creatorIdParam = params.id;
   if (creatorId === undefined) {
     creatorId = creatorIdParam;
   }
   const handleDelete = async () => {
    
    // Correct confirmation logic
    const confirmDelete = window.confirm("Are you sure you want to delete this creator?");
    if (!confirmDelete) return; // user canceled → stop

    // Verify ownership before deleting
    try {
      const { data: creatorRow, error: fetchError } = await supabase
        .from("creators")
        .select("user_id")
        .eq("id", creatorId)
        .single();

      if (fetchError) {
        console.error('Error fetching creator for ownership check:', fetchError);
        alert('Failed to verify ownership. Delete aborted.');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      if (!currentUserId || creatorRow.user_id !== currentUserId) {
        alert('You are not authorized to delete this creator.');
        return;
      }

    } catch (err) {
      console.error('Ownership check error:', err);
      alert('Failed to verify ownership. Delete aborted.');
      return;
    }

    const { error } = await supabase
      .from("creators")
      .delete()
      .eq("id", creatorId);

    if (error) {
      console.error("Error deleting creator:", error);
      alert("Failed to delete creator. Please try again.");
    } else {
      alert("Creator deleted successfully.");

      if (onDelete) onDelete(creatorId); // remove from UI
      navigator("/creators"); // navigate back to creators list
    }
  };

  return (
    
    <button
      onClick={handleDelete}
      style={{ color: "white", background: "red", padding: "6px 10px", borderRadius: "5px", border: "none" }}
    >
      Delete Creator
    </button>
  );
};

export default DeleteCreator;
