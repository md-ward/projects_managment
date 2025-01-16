"use client";
import { useState } from "react";
import useProjectStore from "@/state/project.state";
import { Project } from "@/state/api";
import { formatISO } from "date-fns";
import { useAuthStore } from "@/state/auth";

const NewProjectOrJoinProject = () => {
  const { createProject, isLoading } = useProjectStore();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    });

    try {
      await createProject();
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError("Failed to create the project. Please try again.");
    }
  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <div className="dark:bg-dark-primary z-50 flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-dark-secondary">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome, {currentUser?.fullname}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Let’s get started by creating your first project or joining a team.
        </p>
        {success ? (
          <div className="mt-4 rounded-lg bg-green-100 p-4 text-green-700">
            Project created successfully! You can now start managing it.
          </div>
        ) : (
          <form
            className="mt-6 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Name
              </label>
              <input
                type="text"
                className={inputStyles}
                placeholder="e.g., Website Redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                className={inputStyles}
                placeholder="Briefly describe your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  className={inputStyles}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  className={inputStyles}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`mt-4 flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                !isFormValid() || isLoading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewProjectOrJoinProject;
