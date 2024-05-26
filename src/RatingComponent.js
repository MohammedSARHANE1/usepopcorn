import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

const styleComponent = {
  display: "flex",
  gap: "100",
};

export function RatingComponent({ maxNumber = 5,handleUserRating } ) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  handleUserRating(rating)
  
  const handleRating = (event) => {
    setRating(event);
  };

  // Handle pointer move
  const onPointerMove = (index) => {
    setTempRating(index + 1);
  };

  // Handle pointer leave
  const onPointerLeave = () => {
    setTempRating(0);
  };

  return (
    <div style={styleComponent}>
      <Rating
        onClick={handleRating}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        iconsCount={maxNumber}
        size={24}
        emptyColor="#000"
       
      />

      <p>{tempRating !== 0 ? tempRating : rating || ""}</p>
      
    </div>
  );
}
