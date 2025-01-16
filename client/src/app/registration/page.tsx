"use client";
import { useAuthStore } from "@/state/auth";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShallow } from "zustand/shallow";

const RegistrationForm = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const { signUp, login, loading, error, reset, setFormData } = useAuthStore(
    useShallow((state) => ({
      signUp: state.signUp,
      login: state.login,
      loading: state.loading,
      error: state.error,
      reset: state.reset,
      setFormData: state.setFormData,
    }))
  );

  console.count("RegistrationForm");

  const toggleForm = () => {
    reset();
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData(new FormData(formRef.current!));

    if (isLogin) {
      await login();
    } else {
      await signUp();
    }
  };

  const formRef = React.useRef<HTMLFormElement>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeInOut" } },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2 className="mb-6 text-center text-2xl font-semibold">
          {isLogin ? "Login" : "Register"}
        </h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        
        {/* AnimatePresence ensures animations only trigger during toggle */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <motion.input
                variants={itemVariants}
                autoComplete="username"
                type="text"
                placeholder="Username"
                name="username"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.input
                variants={itemVariants}
                name="password"
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.button
                variants={itemVariants}
                type="submit"
                className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <motion.input
                variants={itemVariants}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Full Name"
                name="fullname"
              />
              <motion.input
                variants={itemVariants}
                autoComplete="username"
                type="text"
                placeholder="Username"
                name="username"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.input
                variants={itemVariants}
                autoComplete="email"
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.input
                variants={itemVariants}
                name="password"
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.button
                variants={itemVariants}
                type="submit"
                className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={toggleForm}
            className="ml-1 text-blue-500 hover:underline"
          >
            {loading ? "Loading..." : isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
