import React, {useState, useEffect} from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Client.js";
import { useParams } from "react-router";

const Profile = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { creatorId } = useParams();


  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("id, name, url, imageurl, created_at, description, like")
        .eq("id", creatorId)
        .single();
      if (error) {
        console.error("Error fetching creators:", error);
        setCreators(null);
      } else {
        setCreators(data);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!creators) return <div>No creators found.</div>;
   

  return (
    <div>   
        <h2>Creator Profile Page</h2>
        <p>This is the profile page for a creator.</p>
        <h3>{creators.name}</h3>
        <img src={creators.imageurl} alt={creators.name} width="200" />
        <p>{creators.decscription}</p>
        <p>
          Website: <a href={creators.url}>{creators.url}</a>
        </p>
        <p>{creators.description}</p>
        <p>Likes: {creators.like}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default Profile;