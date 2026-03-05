"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Code2,
  Eye,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const INITIAL_CODE = `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.title}>Fitness Tracker</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Steps</Text>
          <Text style={styles.cardValue}>8,432</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '84%' }]} />
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Calories</Text>
            <Text style={styles.smallCardValue}>420</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Workouts</Text>
            <Text style={styles.smallCardValue}>12</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start New Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020205',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContent: {
    gap: 16,
  },
  card: {
    backgroundColor: '#12141d',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    color: '#a1a1aa',
    fontSize: 14,
    marginBottom: 8,
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#12141d',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  smallCardLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 4,
  },
  smallCardValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
`;

type DeviceType = "phone" | "tablet" | "desktop";

const DEVICE_SIZES: Record<DeviceType, { width: string; label: string; icon: React.ComponentType<{ size?: number }> }> = {
  phone: { width: "320px", label: "Phone", icon: Smartphone },
  tablet: { width: "480px", label: "Tablet", icon: Tablet },
  desktop: { width: "100%", label: "Desktop", icon: Monitor },
};

export default function Preview() {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<DeviceType>("phone");
  const [key, setKey] = useState(0);

  const handleRefresh = () => setKey((k) => k + 1);

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm gap-3">
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/8">
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              viewMode === "preview" ? "bg-accent text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Eye size={13} /> Preview
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              viewMode === "code" ? "bg-accent text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Code2 size={13} /> Code
          </button>
        </div>

        {/* Device Switcher (only in preview mode) */}
        {viewMode === "preview" && (
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/8">
            {(Object.entries(DEVICE_SIZES) as [DeviceType, typeof DEVICE_SIZES[DeviceType]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                title={val.label}
                className={cn(
                  "flex items-center justify-center p-1.5 rounded-lg transition-all",
                  device === key ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                <val.icon size={15} />
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            title="Refresh"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <RotateCcw size={15} />
          </button>
          <button
            title="Download ZIP"
            onClick={() => alert("Export feature coming soon!")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => alert("Publishing coming soon!")}
            className="hidden sm:flex h-8 items-center justify-center rounded-lg bg-white/8 border border-white/10 px-3 text-xs font-bold text-white hover:bg-white/15 transition-all gap-1.5"
          >
            <ExternalLink size={13} /> Publish
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative overflow-hidden">
        <SandpackProvider
          key={key}
          template="react"
          theme={atomDark}
          files={{ "/App.js": INITIAL_CODE }}
          options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
          customSetup={{
            dependencies: {
              "react-native-web": "latest",
              "lucide-react": "latest",
            },
          }}
        >
          <AnimatePresence mode="wait">
            {viewMode === "preview" ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_70%)]"
              >
                <div
                  className="relative transition-all duration-300"
                  style={{ width: DEVICE_SIZES[device].width, maxWidth: "100%", height: "100%" }}
                >
                  {device === "phone" ? (
                    /* iPhone Frame */
                    <div className="mx-auto w-[300px] rounded-[3.5rem] border-[12px] border-zinc-900 bg-black p-1 shadow-2xl ring-1 ring-white/15 h-full max-h-[600px]">
                      <div className="relative h-full overflow-hidden rounded-[2.6rem] bg-zinc-950">
                        <SandpackPreview
                          showNavigator={false}
                          showOpenInCodeSandbox={false}
                          className="h-full w-full"
                        />
                        <div className="absolute top-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black z-50 pointer-events-none" />
                      </div>
                    </div>
                  ) : device === "tablet" ? (
                    /* Tablet Frame */
                    <div className="mx-auto w-[460px] rounded-[2rem] border-[10px] border-zinc-900 bg-black p-1 shadow-2xl ring-1 ring-white/15 h-full max-h-[640px]">
                      <div className="relative h-full overflow-hidden rounded-[1.4rem] bg-zinc-950">
                        <SandpackPreview
                          showNavigator={false}
                          showOpenInCodeSandbox={false}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Desktop Frame */
                    <div className="w-full h-full rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                      <div className="flex h-8 items-center gap-2 bg-zinc-900 px-4 border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-red-500/60" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                          <div className="h-3 w-3 rounded-full bg-green-500/60" />
                        </div>
                        <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center px-3">
                          <span className="text-[10px] text-zinc-600">localhost:3000</span>
                        </div>
                      </div>
                      <div className="h-[calc(100%-2rem)]">
                        <SandpackPreview
                          showNavigator={false}
                          showOpenInCodeSandbox={false}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <SandpackLayout className="h-full border-none !rounded-none">
                  <SandpackCodeEditor
                    showTabs={true}
                    showLineNumbers={true}
                    showInlineErrors={true}
                    className="h-full"
                  />
                </SandpackLayout>
              </motion.div>
            )}
          </AnimatePresence>
        </SandpackProvider>
      </div>
    </div>
  );
}
