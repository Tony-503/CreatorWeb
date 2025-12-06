import React, { useEffect, useState } from "react";
import { supabase } from "../../../Client.js";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CreatorCard from "../../../Components/CreatorCard.jsx";
import { Button } from "primereact/button";


const ViewCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching creators:", error);
        setCreators([]);
      } else {
        setCreators(data);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (creators.length === 0) return <div>No creators found.</div>;

  return (
    <div>
  <h1>All Creators</h1>
  
  <Link to="/creators/add" style={{ textDecoration: "none" }}>
  <Button 
    label="ADD CREATOR" 
    severity="success" 
    rounded 
    icon="pi pi-plus" 
    className="p-button-success" 
  />
</Link>

<Button
  label="Back"
  severity="warning"
  icon="pi pi-arrow-left"
  onClick={() => navigate("/creators")}
  rounded
/>


   <div>
    <h3>Total Creators: {creators.length}</h3>
   </div>
    
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    {creators && creators.length > 0 &&
    [...creators].sort((a, b) => b.id - a.id).map((creator) => (
      <CreatorCard
        key={creator.id}
        creator={creator}
        onView={(id) => navigate(`/creators/${id}`)}
      />
    ))}
  </div>

  <div>
    
  </div>
</div>

  );
};

export default ViewCreators;
