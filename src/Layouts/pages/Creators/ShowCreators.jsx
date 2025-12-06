import { Link } from "react-router-dom";
import {useState, useEffect} from "react";  
import {supabase} from "../../../Client.js";



const ShowCreators = () => {
  const [Name, setName] = useState();

  useEffect(() => {
    const fetchuser = async () => {
      const { data} = await supabase.auth.getUser();
      if (data.user) {
        setName(data.user.user_metadata.display_name);
      }
    };
    fetchuser();
  }, []);

  return (
    <div>
      <h2>Show Creators Page</h2>
      <p>Welcome, {Name}!</p>


       
      <Link to="/creators/add">Add Creator</Link>
      <br />
      <Link to={`/creators/1`}>View Creator</Link>
      <br />
      
    </div>
  );
};

export default ShowCreators;
