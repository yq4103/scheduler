import React from "react";

export default function formatSpots(props) {
  if (props.spots===0) {
    return "no remaining spots"
  }
  if (props.spots===1) {
    return `${props.spots} spot remaining`
  }
  if (props.spots===2) {
    return `${props.spots} spot remaining`
  }
}