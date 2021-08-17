import React from "react";
import { FaStarHalfAlt, FaStar } from "react-icons/fa";
import { BiStar } from "react-icons/bi";

function Rating({ value, text, color }) {
  return (
    <div className="rating">
      <span>
        {value >= 1 ? (
          <FaStar color={color} />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <BiStar color={color} />
        )}
      </span>

      <span>
        {value >= 2 ? (
          <FaStar color={color} />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <BiStar color={color} />
        )}
      </span>

      <span>
        {value >= 3 ? (
          <FaStar color={color} />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <BiStar color={color} />
        )}
      </span>

      <span>
        {value >= 4 ? (
          <FaStar color={color} />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <BiStar color={color} />
        )}
      </span>

      <span>
        {value >= 5 ? (
          <FaStar color={color} />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt color={color} />
        ) : (
          <BiStar color={color} />
        )}
      </span>

      <span>{text && text}</span>
    </div>
  );
}

export default Rating;
