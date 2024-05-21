import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

const styleComponent = {
  display: "flex"
};

export function RatingComponent() {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  // Handle rating value change
  const handleRating = (event) => {
    setRating(event);
  };

  // Handle pointer move
  const onPointerMove = (hover, index, event) => {
    setTempRating(index + 1);
  };

  // Handle pointer leave
  const onPointerLeave = (event) => {
    setTempRating(0);
  };

  return (
    <div style={styleComponent}>
      <Rating
        onClick={handleRating}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
      />

      <p>{tempRating !== 0 ? tempRating : rating || ""}</p>
    </div>
  );
}
