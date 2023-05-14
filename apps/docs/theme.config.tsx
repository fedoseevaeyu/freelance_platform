import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Freelance Platform</span>,
  footer: {
    text: "Freelance Platform",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Freelance Platform",
    };
  },
};

export default config;
