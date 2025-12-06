import React, {useState, useEffect} from "react";
// Only navigate to delete route; do not render DeleteCreator here
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import {supabase} from "../Client.js";


// Small CSS override to shrink PrimeReact ripple for buttons using "small-ripple-like"
const rippleStyles = `
  /* Limit ripple element size and soften opacity */
  .small-ripple-like .p-ripple-element {
    width: 18px !important;
    height: 18px !important;
    margin-left: -9px !important;
    margin-top: -9px !important;
    border-radius: 50% !important;
    opacity: 0.5 !important;
    transform: none !important;
  }
  /* Ensure button doesn't overflow the small ripple */
  .small-ripple-like.p-button {
    overflow: hidden;
  }
`;

const CreatorCard = ({ creator }) => {
    const navigate = useNavigate(); 
     const [expanded, setExpanded] = useState(false);
    const [Author, setAuthor] = useState();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [Like, setLike] = useState(0);
    const [creatorAuthorName, setCreatorAuthorName] = useState();


    useEffect(() => {
        let isMounted = true;

        const fetchCurrentUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    console.error("Error getting user:", error);
                } else if (data?.user && isMounted) {
                    setAuthor(data.user.user_metadata?.display_name ?? "Anonymous");
                    setCurrentUserId(data.user.id);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchCurrentUser();

        // Subscribe to auth state changes so UI updates when user signs in/out
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const user = session?.user ?? null;
            if (user && isMounted) {
                setAuthor(user.user_metadata?.display_name ?? "Anonymous");
                setCurrentUserId(user.id);
            } else if (isMounted) {
                setAuthor(undefined);
                setCurrentUserId(null);
            }
        });

        return () => {
            isMounted = false;
            // Defensive cleanup
            try {
                authListener?.subscription?.unsubscribe?.();
            } catch (cleanupErr) {
                // ignore cleanup errors
            }
        };
    }, []);


        

    useEffect(() => {
        const fetchLikes = async () => {
            try {   
                const { data, error } = await supabase
                    .from('creators')
                    .select('like')
                    .eq('id', creator.id)
                    .single();
                if (error) throw error;
                setLike(data.like || 0);
            } catch (err) {
                console.error("Error fetching likes:", err.message);
            }
        };

        fetchLikes();
    }, [creator.id]);

    // Fetch the creator record's author/display name from a profiles table (if available)



    // Update like count
    const updateLikeCount = async () => {
        try {
            const newLikeCount = Like + 1;
            const { data, error } = await supabase
                .from('creators')
                .update({ like: newLikeCount })
                .eq('id', creator.id)
                .select()
                .single();
            if (error) throw error;
            setLike(data.like || 0);
        } catch (err) {
            console.error("Error updating like count:", err.message);
        }
    };

// Toggle description expansion
   
    const toggleExpanded = () => {
        setExpanded((prev) => !prev);
    };

    const max_preview_length = 120;

    const PreviewDescription = 
        (creator?.description || "").length > max_preview_length
            ? (creator.description || "").slice(0, max_preview_length) + "..."
            : (creator.description || "");
   
    const header = (
        <img
            alt="Creator"
            src={creator.imageurl}
            className="w-full h-10 object-cover"
        />
    );

    // Compute a display name for the creator (use any available fields on the creator,
    // otherwise fall back to the signed-in user's display name or "Unknown")
    const creatorDisplayName = React.useMemo(() => {
        if (!creator) return "Unknown";
        // 0) explicit author fetched from a profiles table
        if (creatorAuthorName) return creatorAuthorName;
        // 1) explicit creator author fields stored in the record
        if (creator.display_name) return creator.display_name;
        if (creator.author_name) return creator.author_name;
        if (creator.user_display_name) return creator.user_display_name;
        // 2) nested user object that may include metadata (depends on how you fetch creators)
        if (creator.user?.user_metadata?.display_name) return creator.user.user_metadata.display_name;
        if (creator.user?.display_name) return creator.user.display_name;
        // 3) if the creator record belongs to the signed-in user, prefer the signed-in display name (Author)
        if (creator.user_id && currentUserId && creator.user_id === currentUserId && Author) return Author;
        // 4) fallback to the creator.name (more human) or "Unknown"
        return creator.name || "Unknown";
    }, [creator, Author, currentUserId, creatorAuthorName]);

    if (!creator) return null;

    // inject small ripple CSS scoped to this component
    // (keeps change local and avoids editing global CSS files)
    const RippleStyleTag = <style>{rippleStyles}</style>;

    const footer = (
    <div className="flex flex-column gap-3 mt-2">
        {RippleStyleTag}
        
        <div className="flex gap-2 justify-content-between">
            {/* Delete Button */}
            {currentUserId && creator.user_id === currentUserId && (
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    className="flex-1"
                    onClick={() => navigate(`/creators/delete/${creator.id}`)}
                />
            )}

            {/* Like Button */}
            <Button
                icon="pi pi-thumbs-up"
                label={Like}
                severity="success"
                className="flex-1 small-ripple-like"
                onClick={updateLikeCount}
            />

            {/* Edit Button */}
            {currentUserId && creator.user_id === currentUserId && (
                <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    className="flex-1"
                    onClick={() => navigate(`/creators/edit/${creator.id}`)}
                />
            )}
        </div>

        {/* Read More */}
        <Button
            label={expanded ? "Show less" : "Read more"}
            text
            className="w-full"
            onClick={toggleExpanded}
        />
        <Button
            label="View Profile"
            className="w-full"
            onClick={() => navigate(`/creators/profile/${creator.id}`)}
        />
    </div>
);

    return (
    <div className="card flex justify-content-center">
        <Card
            title={creator.name}
            subTitle={"Author: " + creatorDisplayName}
            header={header}
            footer={footer}
            className="md:w-20rem shadow-2 border-round-xl m-2"
        >
            <p className="m-0 line-height-3">
                {expanded ? creator.description : PreviewDescription}
            </p>
        </Card>
    </div>
);

};

export default CreatorCard;