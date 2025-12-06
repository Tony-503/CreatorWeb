import React, { useEffect, useState } from "react";
import { supabase } from "../../../Client.js";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";



const EditCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState({
    name: "",
    description: "",
    url: "",
    imageurl: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Load current creator
  useEffect(() => {
    const fetchCreator = async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading creator:", error);
      } else {
        setCreator(data);

        // Check ownership: only the creator (user_id) may edit
        try {
          const { data: userData } = await supabase.auth.getUser();
          const currentUserId = userData?.user?.id;
          if (currentUserId && data.user_id && currentUserId !== data.user_id) {
            alert('You are not authorized to edit this creator.');
            navigate('/creators');
            return;
          }
        } catch (err) {
          console.error('Error checking user ownership:', err);
        }
      }

      setLoading(false);
    };

    fetchCreator();
  }, [id]);

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreator((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new image upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const filePath = `news/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(filePath);

      setCreator((prev) => ({
        ...prev,
        imageurl: urlData.publicUrl,
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to upload new image");
    } finally {
      setUploading(false);
    }
  };

  // Save updates
  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("creators")
      .update({
        name: creator.name,
        description: creator.description,
        url: creator.url,
        imageurl: creator.imageurl,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      setError("Failed to update creator");
    } else {
      alert("Creator updated!");
      navigate(`/creators/${id}`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-card">
      <h1>Edit Creator</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          value={creator.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={creator.description}
          onChange={handleChange}
        />

        <InputText
          type="text"
          name="url"
          value={creator.url}
          onChange={handleChange}
        />

        <p>Current Image:</p>
        {creator.imageurl && (
          <img
            src={creator.imageurl}
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        )}

        <input type="file" accept="image/*" onChange={handleFileUpload} />
           
         

        {uploading && <p>Uploading new image...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      

          <Link to="/creators/1" style={{ textDecoration: "none" }}>
          <Button 
            label="Cancel" 
            severity="secondary" 
            rounded 
            icon="pi pi-times" 
            className="p-button-secondary" 
          />
        </Link>
      </form>
    </div>
  );
};

export default EditCreator;
