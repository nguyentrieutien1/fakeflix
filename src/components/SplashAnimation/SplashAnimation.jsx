import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function SplashAnimation() {
  const history = useHistory();
  useEffect(() => {
    history.push("/browse");
  }, []);
  return <div>SplashAnimation</div>;
}
