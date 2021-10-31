import React from "react";
import ContentLoader from "react-content-loader";
const AvatarLoader = (props) => (
    <ContentLoader 
    speed={2}
    width={60}
    height={48}
    viewBox="0 0 60 48"
    backgroundColor="#333"
    foregroundColor="#444"
    {...props}
  >
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" /> 
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" /> 
    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" /> 
    <circle cx="24" cy="24" r="24" /> 
    <circle cx="169" cy="110" r="37" />
  </ContentLoader>
  )
  
  export {AvatarLoader};