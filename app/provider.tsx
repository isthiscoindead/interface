"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import { AppProgressBar } from "next-nprogress-bar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const config = getDefaultConfig({
  appName: "Is This Coin Dead?",
  projectId: "YOUR_PROJECT_ID",
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      structuralSharing,
    },
  },
});

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColorForeground: "white",
            // fontStack: "system",
            overlayBlur: "large",
          })}
        >
          <div className="bg-neutral-900 min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
      <AppProgressBar
        color="#ffffff"
        height="2px"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </WagmiProvider>
  );
};

export default Provider;
