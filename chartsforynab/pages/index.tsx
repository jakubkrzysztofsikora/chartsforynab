import { Inter } from "@next/font/google";
import React from "react";

export default function Home() {
  return (
    <button
      onClick={() => {
        fetch("/api/ynab/auth")
          .then((res) => {
            return res.json();
          })
          .then((data) => (window.location.href = data.auth_url));
      }}
    >
      ynab
    </button>
  );
}
