import React, { useState } from "react";
import { supabase } from "../../../Client.js";
import { useNavigate } from "react-router-dom";


const AddCreator = ({ user }) => {
  const [creator, setCreator] = useState({
    name: "",
    description: "",
    url: "",
    imageurl: "", // matches DB
    authorname:
      user?.user_metadata?.displayName ||
      user?.user_metadata?.full_name ||
      user?.email,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errormsg, setErrormsg] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreator((prev) => ({ ...prev, [name]: value }));
  };

  // Upload file to Supabase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrormsg("");

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
      console.error("Upload error:", err.message);
      setErrormsg("Failed to upload image. Check your bucket policies.");
    } finally {
      setUploading(false);
    }
  };

  // Save creator to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrormsg("");

    const newCreator = {
      name: creator.name,
      description: creator.description ,
      url: creator.url,
      imageurl: creator.imageurl,
      user_id: user?.id, // make sure this matches auth.uid()
    };

    console.log("Attempting to insert creator:", newCreator);

    try {
      const { data, error } = await supabase
        .from("creators")
        .insert([newCreator])
        .select(); // returns the inserted row

      if (error) throw error;

      console.log("Insert success:", data);
      alert("Creator added successfully!");
      navigate("/creators");
    } catch (err) {
      console.error("Insert error:", err);
      setErrormsg(
        "Failed to add creator. Check RLS policies or console for details."
      );
    } finally {
      setLoading(false);
    }
  };


 

  return (
    <div className="small-form">
      <h1>Add Creator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Creator Name"
          value={creator.name}
          onChange={handleChange}
          required
        />

        <textarea
          type="text"
          name="description"
          placeholder="Description"
          value={creator.description}
          onChange={handleChange}
          required
        />
        
        
        <input
          type="text"
          name="url"
          placeholder="Website URL"
          value={creator.url}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleFileUpload}/>
        {uploading && <p>Uploading image...</p>}
        {creator.imageurl && (
          <div className="uploaded-preview">
            <p className="form-note">
              Uploaded image URL:{" "}
              <a href={creator.imageurl} target="_blank" rel="noreferrer">
                View
              </a>
            </p>
            <img
              src={creator.imageurl}
              alt="uploaded"
              style={{
                maxWidth: "200px",
                height: "auto",
                borderRadius: "8px",
                marginTop: "8px",
              }}
            />
          </div>
        )}
        {errormsg && <p style={{ color: "red" }}>{errormsg}</p>}
        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-primary"
        >
          {loading ? "Adding..." : "Add Creator"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/creators")}
          className="btn"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCreator;
